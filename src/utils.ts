import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Field, Method, TypingsMember, TypingSuggestion } from './symbols';
import { TreeProvider } from './treeprovider';
import { log, error, warn, availableClasses, available_members_index } from './extension';
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
    semanticTokensEnabled
} from './constants'
import { currentEditor } from './semantictokensprovider';
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
    const className = fqName.split('.').pop() || fqName;
    const first = className[0]?.toUpperCase() || '_';
    const second = className[1]?.toLowerCase() || '_';
    const third = className[2]?.toLowerCase() || '_';
    const threeKey = `${first}${second}${third}`;
    return available_members_index[first]?.[`${first}${second}`]?.[threeKey]?.[fqName];
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
            console.warn(`⚠️ Input file not found: ${inputPath}`);
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
    console.log(`✅ Three-level alphabetical index files written to: ${outputBaseDir}`);
}


function getKotlinBoxedType(type: string): string {
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

function stripAnnotations(input: string): string {
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
            const interfaces = membersRecord["$interfaces"] || "";
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
                    if (name.includes("getAttachedOrElse") && classPath === "net.minecraft.world.entity.Entity") {
                        log("🟡 DEBUG: Matched Method — getAttachedOrElse");
                        log("🔹 Original method key:", name);
                        log("🔹 MethodSignature:", methodSignature);
                        log("🔹 Parsed rawArgsMatch:", rawArgsMatch);
                        log("🔹 Extracted raw args:", rawArgsMatch?.[1]);
                        log("🔹 Split arguments:", rawArgsMatch?.[1] ? splitTopLevelArgs(rawArgsMatch[1]) : []);
                        log("🔹 Extracted and stripped args:", extractedArgs);
                        log("🔹 Return type (raw):", (details as { returns?: string }).returns);
                        log("🔹 Return type (stripped):", stripAnnotations((details as { returns?: string }).returns || 'Any'));
                        log("🔹 Full method object:", details);
                    }

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

        // Fallback to JSON file
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
function splitTopLevelArgs(argString: string): string[] {
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
    // ✅ Expanded range calculation with boundary protection
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