import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Field, Method, NodeContext, Scope, TypingsMember, TypingSuggestion, VariableNode } from './symbols';
import { TreeProvider } from './treeprovider';
import { log, error, warn, availableClasses, available_members_index, typingSuggestions } from './extension';
import {
    t,
    TOKEN_TYPES,
    TOKEN_MODIFIERS,
    LEGEND,
    expressionTypes,
    variableDeclarationTypes,
    blockParents,
    blocks,
    standinReserved,
    reservedCharacters,
    documentData,
    semanticTokensEnabled,
    kotlinCorePackages
} from './constants'
import { currentEditor, SemanticTokensProvider, syntheticTypingsMembers } from './semantictokensprovider';
import { SyntaxNode } from 'web-tree-sitter';

let cachedTypingSuggestions: TypingSuggestion[] | null = null;
let cachedTypingMembers: TypingsMember[] | null = null;

export class Utils {
    private static instance: Utils | null = null;
    public logFile: string;
    public logBuffer: string[] = [];
    public flushInterval: NodeJS.Timeout | null = null;
    public outputChannel: vscode.OutputChannel;
    private lastMessage: string | null = null;
    private lastMessageCount: number = 1;

    private constructor(context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel("KotlinScript Logs");
        const basePath = context.extensionPath;
        this.logFile = path.join(basePath, 'debug.log');
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }

        fs.writeFileSync(this.logFile, '');
        console.log(`Logging to: ${this.logFile}`);

        this.flushInterval = setInterval(() => {
            if (this.logBuffer.length > 0) {
                fs.appendFile(this.logFile, this.logBuffer.join(''), (err) => {
                    if (err) console.error("Failed to write logs:", err);
                });
                this.logBuffer = [];
            }
        }, 1000);
    }

    public static getInstance(context: vscode.ExtensionContext): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils(context);
        }
        return Utils.instance;
    }

    private getFormattedTimestamp(): string {
        const now = new Date();
        return "Log"//now.toISOString().replace('T', ' ').split('.')[0];
    }

    private logToFile(type: 'log' | 'warn' | 'error', args: any[]) {
        const messageContent = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');
        const timestampedMessage = `[${this.getFormattedTimestamp()}] ` + (type !== 'log' ? `[${type.toUpperCase()}]: ` : '') + messageContent;

        if (this.lastMessage === messageContent) {
            this.lastMessageCount++;
            this.updateLastLogEntry();
        } else {
            if (this.lastMessageCount > 1) {
                this.writeModifiedLastLogEntry();
            }
            this.lastMessage = messageContent;
            this.lastMessageCount = 1;
            this.logBuffer.push(timestampedMessage + '\n');
        }

        this.outputChannel.appendLine(timestampedMessage);
    }

    private updateLastLogEntry() {
        if (this.logBuffer.length > 0) {
            this.logBuffer[this.logBuffer.length - 1] = `(x${this.lastMessageCount}) ` + this.logBuffer[this.logBuffer.length - 1].replace(/^\(x\d+\) /, '');
        }
    }

    private writeModifiedLastLogEntry() {
        if (this.logBuffer.length > 0) {
            this.logBuffer[this.logBuffer.length - 1] = `(x${this.lastMessageCount}) ` + this.logBuffer[this.logBuffer.length - 1].replace(/^\(x\d+\) /, '');
            this.lastMessageCount = 1;
        }
    }

    public log(...args: any[]) {
        console.log(...args);
        this.logToFile('log', args);
    }

    public warn(...args: any[]) {
        console.warn(...args);
        this.logToFile('warn', args);
    }

    public error(...args: any[]) {
        console.error(...args);
        this.logToFile('error', args);
    }
}
export function getTypingsMember(fqName: string): TypingsMember | undefined {
    const normalizedFQName = fqName.trim();

    const className = fqName.split('.').pop() || fqName;
    const first = className[0]?.toUpperCase() || '_';
    const second = className[1]?.toLowerCase() || '_';
    const third = className[2]?.toLowerCase() || '_';
    const threeKey = `${first}${second}${third}`;

    const fromIndex = available_members_index[first]?.[`${first}${second}`]?.[threeKey]?.[fqName];
    if (fromIndex) {
        return fromIndex;
    }
    const keys = Array.from(syntheticTypingsMembers.keys());
    let matched = false;
    for (const key of keys) {
        if (key === normalizedFQName) {
            matched = true;
        } else if (key.trim() === normalizedFQName) {
            matched = true;
        }
    }

    const result = syntheticTypingsMembers.get(fqName);
    return result;
}



export function writeAlphabeticalTypingsIndex(ktsDirectory: string) {
    const inputFiles = [
        'available_members.json',
        'kotlin_members.json',
        'companion_objects.json'
    ];

    const outputBaseDir = path.join(ktsDirectory, 'typings', 'members');
    const indexMap: Record<string, Record<string, Record<string, Record<string, any>>>> = {};

    for (const fileName of inputFiles) {
        const inputPath = path.join(ktsDirectory, 'typings', fileName);

        if (!fs.existsSync(inputPath)) {
            console.warn(` Input file not found: ${inputPath}`);
            continue;
        }

        const jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

        for (const [fqName, details] of Object.entries(jsonData)) {
            const className = fqName.split('.').pop()?.split('<')[0] || fqName;
            const first = className[0]?.toUpperCase() || '_';
            const second = className[1]?.toLowerCase() || '_';
            const third = className[2]?.toLowerCase() || '_';
            const fileKey = `${first}${second}${third}`;

            if (!indexMap[first]) indexMap[first] = {};
            if (!indexMap[first][`${first}${second}`]) indexMap[first][`${first}${second}`] = {};
            if (!indexMap[first][`${first}${second}`][fileKey]) indexMap[first][`${first}${second}`][fileKey] = {};
            if (indexMap[first][`${first}${second}`][fileKey][fqName]) continue;

            indexMap[first][`${first}${second}`][fileKey][fqName] = details;
        }
    }

    for (const [firstLevel, secondLevelMap] of Object.entries(indexMap)) {
        const firstLevelPath = path.join(outputBaseDir, firstLevel);
        if (!fs.existsSync(firstLevelPath)) fs.mkdirSync(firstLevelPath, { recursive: true });

        for (const [secondLevelKey, thirdLevelMap] of Object.entries(secondLevelMap)) {
            const secondLevelPath = path.join(firstLevelPath, secondLevelKey);
            if (!fs.existsSync(secondLevelPath)) fs.mkdirSync(secondLevelPath, { recursive: true });

            for (const [fileKey, data] of Object.entries(thirdLevelMap)) {
                const filePath = path.join(secondLevelPath, `${fileKey}-index.json`);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            }
        }
    }
    const manifest: Record<string, string> = {};

    for (const [firstLevel, secondLevelMap] of Object.entries(indexMap)) {
        for (const [secondLevelKey, thirdLevelMap] of Object.entries(secondLevelMap)) {
            for (const [fileKey, fqMap] of Object.entries(thirdLevelMap)) {
                const relativePath = `${firstLevel}/${secondLevelKey}/${fileKey}-index.json`;
                for (const fqName of Object.keys(fqMap)) {
                    manifest[fqName] = relativePath;
                }
            }
        }
    }

    const manifestPath = path.join(outputBaseDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(` Three-level alphabetical index files written to: ${outputBaseDir}`);
}


export function getKotlinBoxedType(type: string): string {
    const primitiveToBoxedMap: Record<string, string> = {
        byte: 'kotlin.Byte',
        short: 'kotlin.Short',
        int: 'kotlin.Int',
        long: 'kotlin.Long',
        float: 'kotlin.Float',
        double: 'kotlin.Double',
        boolean: 'kotlin.Boolean',
        char: 'kotlin.Char',
        void: 'kotlin.Unit'
    }

    const genericMatch = type.match(/^(\w+)<(.+)>$/)
    if (genericMatch) {
        const genericName = genericMatch[1]
        const innerTypes = genericMatch[2]
        const mappedInnerTypes = innerTypes
            .split(',')
            .map(t => getKotlinBoxedType(t.trim()))
            .join(', ')
        return `${genericName}<${mappedInnerTypes}>`
    }

    return primitiveToBoxedMap[type.toLowerCase()] ?? type
}

export function stripAnnotations(input: string): string {
    return input.replace(/@[\w.]+(?:\([^\)]*\))?\s*/g, '').trim();
}

export async function loadTypingMembers(ktsDirectory: string): Promise<TypingsMember[]> {
    if (cachedTypingMembers) {
        return cachedTypingMembers;
    }

    const suggestions: TypingsMember[] = [];

    const loadFile = (filePath: string, forceStatic = false) => {
        if (!fs.existsSync(filePath)) return;

        console.log(`Loading typing suggestions from ${path.basename(filePath)}...`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(fileContent);

        Object.entries(parsedData).forEach(([classPath, members]) => {
            const methods: Method[] = [];
            const fields: Field[] = [];
            let hasInvokeOperator = false;
            const membersRecord = members as Record<string, any>;
            const classModifiers = membersRecord["$modifiers"] || "";
            const superclass = membersRecord["$superclass"] || "";
            const interfaces = membersRecord["$interfaces"] || [""];
            const typeParams = membersRecord["$typeParameters"] || ""

            Object.entries(members as Record<string, any>).forEach(([name, details]) => {
                if (["$superclass", "$modifiers", "$interfaces", "$typeParameters"].includes(name)) {
                } else if (name.endsWith(')')) {

                    const rawArgsMatch: RegExpMatchArray | null = name.match(/\((.*)\)/);
                    const extractedArgs: string[] = rawArgsMatch?.[1]
                        ? splitTopLevelArgs(rawArgsMatch[1]).map(arg => getKotlinBoxedType(stripAnnotations(arg)))

                        : [];

                    const isStatic = (details as { modifiers?: string }).modifiers?.includes("static");
                    const methodSignature = `${name.split('(')[0]}(${extractedArgs.join(',')})`;
                    methods.push(new Method(
                        methodSignature,
                        extractedArgs,
                        getKotlinBoxedType(stripAnnotations((details as { returns?: string }).returns || 'Any')),
                        forceStatic || isStatic || false,
                        (details as { description?: string }).description || '',
                        (details as { modifiers?: string }).modifiers || '',
                        ""
                    ));
                    /*   if (name.includes("getAttachedOrElse") && classPath === "net.minecraft.world.entity.Entity") {
                          log("DEBUG: Matched Method — getAttachedOrElse");
                          log(" Original method key:", name);
                          log(" MethodSignature:", methodSignature);
                          log(" Parsed rawArgsMatch:", rawArgsMatch);
                          log(" Extracted raw args:", rawArgsMatch?.[1]);
                          log(" Split arguments:", rawArgsMatch?.[1] ? splitTopLevelArgs(rawArgsMatch[1]) : []);
                          log(" Extracted and stripped args:", extractedArgs);
                          log(" Return type (raw):", (details as { returns?: string }).returns);
                          log(" Return type (stripped):", stripAnnotations((details as { returns?: string }).returns || 'Any'));
                          log(" Full method object:", details);
                      }
   */
                    if (!hasInvokeOperator)
                        hasInvokeOperator = (details as { isInvokeOperator?: boolean }).isInvokeOperator ?? false;

                } else {
                    const isStatic = (details as { modifiers?: string }).modifiers?.includes("static");

                    fields.push(new Field(
                        name,
                        getKotlinBoxedType(stripAnnotations((details as { type?: string, returns?: string }).type || (details as any).returns || 'Unknown')),
                        forceStatic || isStatic || false,
                        (details as { description?: string }).description || '',
                        (details as { modifiers?: string }).modifiers || '',
                    ));
                }
            });
            if (!availableClasses.has(classPath)) availableClasses.add(classPath)
            suggestions.push(new TypingsMember(classPath, methods, fields, forceStatic, hasInvokeOperator, classModifiers, superclass, interfaces, typeParams));
        });
    };


    try {
        const jsonFilePath = path.join(ktsDirectory, 'typings', 'available_members.json');
        //const companionJsonFilePath = path.join(ktsDirectory, 'typings', 'companion_objects.json');
        const kotlinMembers = path.join(ktsDirectory, 'typings', 'kotlin_members.json');

        loadFile(kotlinMembers);
        loadFile(jsonFilePath);
        // loadFile(companionJsonFilePath, true);

        log(`Loaded ${suggestions.length} member suggestions.`);
        cachedTypingMembers = suggestions;
    } catch (error) {
        warn(`Error loading member suggestions: ${error}`);
    }

    return suggestions;
}


export async function loadTypingSuggestions(ktsDirectory: string): Promise<TypingSuggestion[]> {
    if (cachedTypingSuggestions) {
        return cachedTypingSuggestions;
    }

    const suggestions: TypingSuggestion[] = [];
    const jsonFilePath = path.join(ktsDirectory, 'typings', 'kotlin_suggestions.json');

    try {
        if (fs.existsSync(jsonFilePath)) {
            log('Loading typing suggestions from JSON file...');
            const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
            const parsedData = JSON.parse(fileContent);

            if (Array.isArray(parsedData)) {
                parsedData.forEach(item => {
                    const baseName = item.fullyQualifiedName.split('(')[0];
                    const fqName = item.path + '.' + baseName.substring(baseName.lastIndexOf('.') + 1);
                    const parsedSimpleName = baseName.substring(baseName.lastIndexOf('.') + 1);
                    const rawArgsMatch: RegExpMatchArray | null = item.fullyQualifiedName.match(/\((.*)\)/);
                    const extractedArgs: string[] = rawArgsMatch?.[1]
                        ? splitTopLevelArgs(rawArgsMatch[1])
                        : [];

                    suggestions.push(
                        new TypingSuggestion(
                            fqName,
                            parsedSimpleName,
                            item.source || null,
                            item.type || null,
                            item.path || null,
                            item.parentType || null,
                            item.requiresImport || false,
                            item.returnType || null,
                            extractedArgs
                        )
                    );
                    if (!availableClasses.has(fqName)) availableClasses.add(fqName)
                });
                log(`Loaded ${suggestions.length} typing suggestions.`);
                cachedTypingSuggestions = suggestions;
            }

        }
    } catch (error) {
        console.error(`Error loading typing suggestions: ${error}`);
    }

    return suggestions;
}

export async function loadAvailableClasses(ktsDirectory: string): Promise<Set<string>> {
    const availableClasses = new Set<string>();

    const typingsPath = path.join(ktsDirectory, 'typings');
    const jsonFilePath = path.join(typingsPath, 'available_classes.json');
    const binaryFilePath = path.join(typingsPath, 'available_classes.bin');

    try {
        if (fs.existsSync(binaryFilePath)) {
            log('Loading classes from binary file...');
            const buffer = fs.readFileSync(binaryFilePath);
            buffer
                .toString('utf-8')
                .split('\n')
                .forEach(cls => availableClasses.add(cls));
            log(`Loaded ${availableClasses.size} classes from binary file.`);
            return availableClasses;
        }

        if (fs.existsSync(jsonFilePath)) {
            log('Loading classes from JSON file...');
            const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
            const classes = JSON.parse(fileContent);

            if (Array.isArray(classes)) {
                classes.forEach(cls => availableClasses.add(cls));
                const buffer = Buffer.from(classes.join('\n'), 'utf-8');
                fs.writeFileSync(binaryFilePath, buffer);
            } else {
                throw new Error('Invalid JSON format: expected an array of classes');
            }

            return availableClasses;
        }
        warn('No available_classes.json or binary file found.');
        return availableClasses;
    } catch (error) {
        console.error(`Error loading available classes: ${error}`);
        return availableClasses;
    }
}
export function splitTopLevelArgs(argString: string): string[] {
    const args: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < argString.length; i++) {
        const char = argString[i];
        if (char === '<') {
            depth++;
            current += char;
        } else if (char === '>') {
            depth--;
            current += char;
        } else if (char === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    if (current.trim().length > 0) {
        args.push(current.trim());
    }

    return args;
}

export function updateTokensForDocument(document: vscode.TextDocument) {
    const documentUri = document.uri.toString();
    const data = documentData.get(documentUri);
    if (!data) return;

    let editor = currentEditor(document);
    if (!editor) return;

    let treeProvider = data.semanticTokensProvider?.treeProvider
    if (!treeProvider) return;
    if (!data.semanticTokensProvider) return;

    const visibleRange = editor.visibleRanges[0];
    const expansion = 0
    const expandedStartLine = Math.max(0, visibleRange.start.line - expansion);
    const expandedEndLine = Math.min(document.lineCount - 1, visibleRange.end.line + expansion);

    const expandedRange = new vscode.Range(
        new vscode.Position(expandedStartLine, 0),
        new vscode.Position(expandedEndLine, document.lineAt(expandedEndLine).text.length)
    );
    data.semanticTokensProvider.setLastChangedRange(expandedRange);
    data.semanticTokensProvider.updateTokens(document, expandedRange);
}

export function applyTreeEdit(treeProvider: TreeProvider, change: vscode.TextDocumentContentChangeEvent, document: vscode.TextDocument): void {
    const startPosition = new vscode.Position(change.range.start.line, change.range.start.character);
    const oldEndPosition = new vscode.Position(change.range.end.line, change.range.end.character);

    const newTextLines = change.text.split('\n');

    const newEndPosition = new vscode.Position(
        startPosition.line + newTextLines.length - 1,
        newTextLines.length === 1
            ? startPosition.character + newTextLines[0].length
            : newTextLines[newTextLines.length - 1].length
    );

    const startIndex = change.rangeOffset;
    const oldEndIndex = startIndex + (change.rangeLength || 0);
    const newEndIndex = startIndex + change.text.length;

    if (!treeProvider.tree) return;

    treeProvider.tree.edit({
        startIndex,
        oldEndIndex,
        newEndIndex,
        startPosition: { row: startPosition.line, column: startPosition.character },
        oldEndPosition: { row: oldEndPosition.line, column: oldEndPosition.character },
        newEndPosition: { row: newEndPosition.line, column: newEndPosition.character },
    });
}


export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    } as T;
}

export function logNodeTree(node: any, depth: number = 0): void {
    const indent = ' '.repeat(depth * 2);
    const nodeText = node.text ? `: ${node.text}` : '';
    log(`${indent}[${depth}] ${node.type}${nodeText}`);

    for (let i = 0; i < node.childCount; i++) {
        logNodeTree(node.child(i), depth + 1);
    }
}

export function logNode(node: SyntaxNode | null | undefined, name: string) {
    if (node)
        log(`${name} type: ${node.type}, ${name} text: ${node.text}`)
    else log(name + " is null.")
}
export function buildTypingsMemberFromClassNode(node: SyntaxNode, treeProvider: TreeProvider): TypingsMember | null {
    const className = node.text;
    const classNode = node.parent
    if (!classNode) return null
    const classBody = treeProvider.findChild(classNode, "class_body", "class_declaration")
    /*  classNode.children.forEach((child, i) => {
         logNode(child, "Class child: " + i.toString())
     }) */
    const packageHeader = treeProvider.findChild(treeProvider.tree?.rootNode, "package_header")
    const packagePath = treeProvider.findChild(packageHeader, "identifier")?.text
    const outerName = "";
    const classPath = `${packagePath ? packagePath + "." : ""}${className}`;

    const inheritances = getNamedSiblings(node)
        .filter(sib => sib.type === "delegation_specifier")
        .map(sib => getImportFromClassOrPath(sib.text, treeProvider) ?? sib.text);

    const classFunctions = treeProvider.findChild(classBody, "function_declaration", "class_body");
    const classFields = treeProvider.findChild(classBody, "property_declaration", "class_body");
    const methods: Method[] = [];
    getNamedSiblings(classFunctions, true).forEach(funcNode => {
        if (funcNode.type == "function_declaration") {
            const method = getMethodFromFunctionDeclaration(funcNode, treeProvider);
            if (method) methods.push(method);
        }
    });
    const typeParameters = getNamedSiblings(
        treeProvider.findChild(node.parent ?? node, "type_parameters", "class_declaration")?.firstChild,
        true
    ).map(sib => sib.text);
    let classModifiersNode
    if (node.parent)
        classModifiersNode = treeProvider.findChild(node.parent, "modifiers", "class_declaration")?.firstChild;
    const classAnnotations: string[] = [];
    const classModifiers: string[] = [];
    getNamedSiblings(classModifiersNode, true).forEach(modChild => {
        return modChild.type !== "annotation" ? classModifiers.push(modChild.text) : classAnnotations.push(modChild.text.trim())
    });
    const fields: Field[] = [];
    getNamedSiblings(classFields, true).forEach(child => {
        if (child.type === "property_declaration") {
            const field = getFieldFromPropertyDeclaration(child, treeProvider);
            if (field) fields.push(field);
        }
    });
    let interfaceString = ""
    getAllSiblings(node.parent?.firstChild, true).forEach(sib => {
        if (sib.type == "interface")
            interfaceString = sib.text.trim()
    })
    if (interfaceString.length > 0)
        classModifiers.push(interfaceString)
    return new TypingsMember(
        classPath,
        methods,
        fields,
        false,
        false,
        classModifiers.join(" ").trim(),
        "",
        inheritances,
        typeParameters,
        true,
        treeProvider.document.uri.toString()
    );
}
export function getFieldFromPropertyDeclaration(fieldNode: SyntaxNode, treeProvider: TreeProvider): Field | null {
    const name = treeProvider.findChild(fieldNode, "simple_identifier", "variable_declaration")?.text;
    const varDeclaration = treeProvider.findChild(fieldNode, "variable_declaration", "property_declaration")
    if (!name) return null;

    const typeName = treeProvider.findChild(varDeclaration, "user_type", "variable_declaration")?.text;
    const resolvedType = getImportFromClassOrPath(typeName ?? "", treeProvider) || "Unknown";

    const modifiersNode = treeProvider.findChild(fieldNode, "modifiers", "property_declaration")?.firstChild;
    const modifiers: string[] = [];
    getNamedSiblings(modifiersNode).forEach(mod => modifiers.push(mod.text));

    const isStatic = modifiers.includes("static");

    return new Field(name, resolvedType, isStatic, "", modifiers.join(" "));
}
export function getVariableNodeFromFunctionValues(node: SyntaxNode | null | undefined, treeProvider: TreeProvider) {
    const variableNodes: VariableNode[] = []
    getNamedSiblings(node?.firstChild, true).forEach(variable => {
        if (variable.type == "parameter") {
            const variableNode = treeProvider.extractVariableNode(variable);
            variableNodes.push(variableNode)
        }
    });
    return variableNodes
}
export function getMethodFromFunctionDeclaration(funcNode: SyntaxNode, treeProvider: TreeProvider): Method | null {
    const functionName = treeProvider.findChild(funcNode, "simple_identifier", "function_declaration")?.text;
    if (!functionName) return null;

    const argList = treeProvider.findChild(funcNode, "function_value_parameters");
    const variableNodes: VariableNode[] = getVariableNodeFromFunctionValues(argList, treeProvider)
    //this is the issue
    const typedArgs = variableNodes.map(arg => {
        // log("getImportFromClassOrPath: " + getImportFromClassOrPath(arg.kotlinType.classPath, treeProvider))
        // log("arg: " + arg.variable.text)
        try {
            return getImportFromClassOrPath(arg.kotlinType.classPath, treeProvider) ?? arg.kotlinType.classPath
        } catch (error) {
            console.log("getMethodFromFunctionDeclaration: " + error)
            return "Unknown"
        }
    });
    const returnTypeName = treeProvider.findChildInRange(
        funcNode,
        "user_type",
        "function_declaration",
        treeProvider.supplyRange(funcNode)
    )?.text;
    const typedReturnType = getImportFromClassOrPath(returnTypeName ?? "", treeProvider) || "kotlin.Unit";

    const modifiersNode = treeProvider.findChild(funcNode, "modifiers", "function_declaration")?.firstChild;
    const annotations: string[] = [];
    const modifiers: string[] = [];
    getNamedSiblings(modifiersNode).forEach(modChild =>
        modChild.type !== "annotation" ? modifiers.push(modChild.text) : annotations.push(modChild.text)
    );

    return new Method(functionName, typedArgs, typedReturnType, false, "", modifiers.join(" "), "");
}

export function getNamedSiblings(node: SyntaxNode | null | undefined, includeCurrentNode: boolean = false): SyntaxNode[] {
    if (!node) return []
    let nextSibling = node.nextNamedSibling
    let siblings: SyntaxNode[] = []
    if (includeCurrentNode) siblings.push(node)
    while (nextSibling) {
        siblings.push(nextSibling)
        nextSibling = nextSibling.nextNamedSibling
    }
    return siblings
}
export function getAllSiblings(node: SyntaxNode | null | undefined, includeCurrentNode: boolean = false): SyntaxNode[] {
    if (!node) return []
    let nextSibling = node.nextSibling
    let siblings: SyntaxNode[] = []
    if (includeCurrentNode) siblings.push(node)
    while (nextSibling) {
        siblings.push(nextSibling)
        nextSibling = nextSibling.nextSibling
    }
    return siblings
}
const defaultKotlinPackages = [
    "kotlin",
    "kotlin.io",
    "kotlin.text",
    "kotlin.collections",
    "kotlin.ranges",
    "kotlin.sequences",
    "kotlin.comparisons",
    "kotlin.annotation",
    "java.lang"
];

export function getImportFromClassOrPath(classOrPath: string, treeProvider: TreeProvider): string | null {
    for (const [, importSymbol] of treeProvider.imports.entries()) {
        if (importSymbol.path === classOrPath || importSymbol.simpleName === classOrPath) {
            //console.log("found imported symbol: " + importSymbol.path)
            return importSymbol.path;
        }
    }

    for (const pkg of defaultKotlinPackages) {
        const fqName = `${pkg}.${classOrPath.split(".").pop()}`;
        const member = getTypingsMember(fqName);
        if (member) {
            return fqName;
        }
    }
    let syntheticClassName = ""

    for (const [key, member] of syntheticTypingsMembers.entries()) {
        if (key == classOrPath || key.split(".").pop() == classOrPath) {
            syntheticClassName = key
            break
        }
    }
    const fallbackMember = getTypingsMember(classOrPath) ?? getTypingsMember(syntheticClassName)
    if (fallbackMember) {
        if (
            fallbackMember.isSynthetic &&
            fallbackMember.syntheticOriginUri !== treeProvider.document.uri.toString() &&
            !treeProvider.imports.has(fallbackMember.classPath)
        ) {
            console.log("is synthetic, is not synthetic class origin file and is not imported: " + fallbackMember.classPath)
            return null
        }
        //log("returning fallback member: " + fallbackMember.classPath)
        return fallbackMember.classPath;
    }
    return null;
}
export function getCurrentTreeProvider(doc: vscode.TextDocument) {
    let editor = currentEditor(doc);
    const document = editor?.document;
    if (!document) return null
    const documentUri = document.uri.toString();
    const data = documentData.get(documentUri);
    if (!data) {
        return null;
    }
    return data.semanticTokensProvider?.treeProvider;

}

export function prepareContext(document: vscode.TextDocument, position: vscode.Position) {
    const documentUri = document.uri.toString();
    const data = documentData.get(documentUri);
    if (!data) {
        return null;
    }
    const treeProvider = data.semanticTokensProvider?.treeProvider;
    if (!treeProvider) {
        return null;
    }
    const tree = treeProvider.tree;
    if (!tree) {
        return null;
    }
    const line = position.line;
    const character = position.character - 1;
    const startPosition = new vscode.Position(line, character);
    const endPosition = new vscode.Position(line, character + 1);
    const range = new vscode.Range(startPosition, endPosition);
    const scope = data.semanticTokensProvider?.currentScopeFromRange(range);
    const node = tree.rootNode.descendantForPosition({ row: line, column: character });
    return new NodeContext(treeProvider, scope, node, range);
}

export function resolveTypingsFromSuffixes(
    treeProvider: TreeProvider,
    iNode: SyntaxNode,
    baseType: string,
    isCallOffClass: boolean,
    potentialVariable: SyntaxNode | undefined | null
) {
    //  console.log(`[resolveTypingsFromSuffixes] BaseType at start: ${baseType}`);
    // console.log(`[resolveTypingsFromSuffixes] isCallOffClass: ${isCallOffClass}`);

    const suffixes = treeProvider.findChildren(iNode, ["navigation_suffix"], null) ?? [];
    const refinedSuffixes: string[] = [];

    for (const suffix of suffixes) {
        const identifier = treeProvider.findChild(suffix, "simple_identifier", null);
        if (!identifier || identifier.text === potentialVariable?.text) continue;

        const isCall = isMethodCall(suffix);
        refinedSuffixes.push(identifier.text + (isCall ? "()" : ""));
        //console.log(`[resolveTypingsFromSuffixes] Found suffix: ${identifier.text}, isMethodCall: ${isCall}`);
    }

    // console.log("[resolveTypingsFromSuffixes] Found refined suffixes:", refinedSuffixes);

    let currentType = baseType;
    let currentIsStatic = false;
    let foundTypingsMember = getTypingsMember(currentType);

    if (!isCallOffClass) {
        //  console.log(`[resolveTypingsFromSuffixes] Resolving instance chain from baseType: ${currentType}`);

        for (const element of refinedSuffixes) {
            if (!foundTypingsMember) {
                console.log(`[resolveTypingsFromSuffixes] Stopped - no TypingsMember found for: ${currentType}`);
                break;
            }

            // console.log(`[resolveTypingsFromSuffixes] Processing suffix: ${element}`);
            const isMethod = element.endsWith("()");
            if (isMethod) {
                const method = foundTypingsMember.methods.find(m => m.name === element);
                if (!method) {
                    console.log(`[resolveTypingsFromSuffixes] Method not found: ${element} in ${foundTypingsMember.classPath}`);
                    break;
                }
                console.log(`[resolveTypingsFromSuffixes] Matched method '${method.name}' -> returns ${method.returns}`);
                currentType = method.returns;
                currentIsStatic = method.isStatic;
            } else {
                const field = foundTypingsMember.fields.find(f => f.name === element);
                if (!field) {
                    //console.log(`[resolveTypingsFromSuffixes] Field not found: ${element} in ${foundTypingsMember.classPath}`);
                    break;
                }
                // console.log(`[resolveTypingsFromSuffixes] Matched field '${field.name}' -> returns ${field.returns}`);
                currentType = field.returns;
                currentIsStatic = field.isStatic;
            }

            foundTypingsMember = getTypingsMember(currentType);
        }
    } else {
        //  console.log(`[resolveTypingsFromSuffixes] Static call context, checking baseType: ${baseType}`);
        if (!foundTypingsMember) {
            const fallback = typingSuggestions.find(
                s => s.simpleName === iNode.text || s.fullyQualifiedName === iNode.text
            );
            if (fallback?.returnType) {
                //  console.log(`[resolveTypingsFromSuffixes] Fallback TypingSuggestion used: ${fallback.returnType}`);
                currentType = fallback.returnType;
                foundTypingsMember = getTypingsMember(currentType);
            }
        } else {
            // console.log(`[resolveTypingsFromSuffixes] Found TypingsMember: ${foundTypingsMember.classPath}`);
        }
    }
    // console.log(`[resolveTypingsFromSuffixes] Final resolved currentType: ${currentType}`);
    return { currentType, foundTypingsMember, currentIsStatic };
}
export function isMethodCall(node: SyntaxNode | null): boolean {
    if (!node) return false;

    if (node.type === "call_expression") {
        //  console.log(`[isMethodCall] Direct call_expression: ${node.text}`);
        return true;
    }

    if (node.type === "navigation_expression") {
        const callExpr = node.child(0);
        if (callExpr?.type === "call_expression") {
            // console.log(`[isMethodCall] navigation_expression contains call_expression: ${callExpr.text}`);
            return true;
        }
    }

    if (node.type === "navigation_suffix" && node.parent?.type === "navigation_expression") {
        const callExpr = node.parent.parent;
        const hasCallSuffix = callExpr?.type === "call_expression" &&
            callExpr.children.some(c => c.type === "call_suffix");
        if (hasCallSuffix) {
            // console.log(`[isMethodCall] navigation_suffix leads into call_expression: ${node.text}`);
            return true;
        }
    }

    return false;
}

export function resolveBaseType(
    treeProvider: TreeProvider,
    document: vscode.TextDocument,
    iNode: SyntaxNode,
    scope: Scope | undefined
) {
    // console.log("[resolveBaseType] Starting base type resolution...");

    let className;
    let isStaticClassCall = false;
    let potentialVariable;
    let baseType: string | null = null;

    let lastChild = treeProvider.findLastChildInRange(iNode, "navigation_expression", null, treeProvider.supplyRange(iNode));
    let firstChild = treeProvider.findChild(iNode, "navigation_expression");

    if (!lastChild) {
        // console.log("[resolveBaseType] No lastChild found, using simple_identifier from current node");
        potentialVariable = treeProvider.findChild(iNode, "simple_identifier", null);
    } else if (firstChild) {
        //  console.log("[resolveBaseType] Found firstChild navigation_expression");
        potentialVariable = treeProvider.findChild(firstChild, "simple_identifier", null);
    }

    const scopedVariable = scope?.resolveVariable(potentialVariable?.text ?? "");
    if (scopedVariable) {
        //console.log("[resolveBaseType] Found scoped variable: " + scopedVariable.name);
        const classPath = getImportFromClassOrPath(scopedVariable.type, treeProvider);
        baseType = classPath ?? scopedVariable.type;
    } else {
        //console.log("[resolveBaseType] No scoped variable found, falling back to resolveBaseTypeFromImports");
        ({ baseType, className, isStaticClassCall } = resolveBaseTypeFromImports(treeProvider, document, iNode));
    }
    // TODO: fix this
    const isCallOffClass = treeProvider.findChild(iNode, "navigation_expression") == null;
    // logNode(treeProvider.findChild(iNode, "navigation_expression"), "iscalloffclassnode")
    if (isCallOffClass && !isMethodCall(iNode) && !scopedVariable) {
        console.log("[resolveBaseType] Call is directly off class, setting isStaticClassCall = true");
        isStaticClassCall = true;
    }

    // console.log("[resolveBaseType] Final resolved baseType: " + baseType);
    // console.log("[resolveBaseType] isCallOffClass: " + isCallOffClass);
    // console.log("[resolveBaseType] isStaticClassCall: " + isStaticClassCall);

    return {
        baseType,
        className,
        isStaticClassCall,
        isCallOffClass,
        potentialVariable,
        scopedVariable
    };
}
export function resolveBaseTypeFromImports(treeProvider: TreeProvider, document: vscode.TextDocument, iNode: SyntaxNode) {
    // console.log("[resolveBaseTypeFromImports] Starting import-based resolution...");

    let className: SyntaxNode | null | undefined;
    let isStaticClassCall = true;
    let isCallOffClass = true;
    let baseType: string | null = null;

    const potentialImports = [...treeProvider.findChildren(iNode, ["navigation_expression"], null), iNode];
    //console.log(`[resolveBaseTypeFromImports] Checking ${potentialImports.length} potential imports...`);

    for (const syntaxNode of potentialImports) {
        const rawText = syntaxNode.text;
        const simpleIdentifier = treeProvider.findChild(syntaxNode, "simple_identifier", null);
        const candidates = [rawText, simpleIdentifier?.text].filter(Boolean) as string[];

        for (const name of candidates) {
            if (getImportFromClassOrPath(name, treeProvider)) {
                baseType = getImportFromClassOrPath(name, treeProvider) ?? name;
                className = simpleIdentifier;
                if (isMethodCall(syntaxNode)) isStaticClassCall = false;
                //   console.log(`[resolveBaseTypeFromImports] Resolved from import: ${name}`);
                return { baseType, className, isStaticClassCall, isCallOffClass };
            }
        }

        if (!baseType) {
            // console.log("[resolveBaseTypeFromImports] No import match, checking TypingSuggestion fallback...");
            // logNode(syntaxNode, "INode");

            let fallbackKey = rawText.includes("(") ? rawText.substring(0, rawText.indexOf("(")) : rawText;
            const fallbackSuggestion = getTypingsSuggestionFromSimpleName(fallbackKey);

            if (fallbackSuggestion?.returnType) {
                baseType = fallbackSuggestion.returnType;
                className = simpleIdentifier;
                isStaticClassCall = true;
                isCallOffClass = false;
                //  console.log(`[resolveBaseTypeFromImports] Fallback TypingSuggestion used: ${baseType}`);
                return { baseType, className, isStaticClassCall, isCallOffClass };
            }
        }
    }

    //console.log("[resolveBaseTypeFromImports] Resolution failed, returning null baseType.");
    return { baseType, className, isStaticClassCall, isCallOffClass };
}

export function getTypingsSuggestionFromSimpleName(simpleName: string): TypingSuggestion | undefined {
    const className = simpleName.split(".").pop() ?? "";
    let matchedTyping = typingSuggestions.find(s => s.simpleName === className || s.fullyQualifiedName === simpleName);
    if (matchedTyping) {
        return matchedTyping;
    }
    for (const basePackage of kotlinCorePackages) {
        const potentialFQName = `${basePackage}.${className}`;
        matchedTyping = typingSuggestions.find(s => s.fullyQualifiedName === potentialFQName);
        if (matchedTyping) {
            return matchedTyping;
        }
    }
    return undefined;
}