import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Field, Method, TypingsMember, TypingSuggestion } from './symbols';
import { TreeProvider } from './treeprovider';
import { log, error, warn } from './extension';
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
            let hasInvokeOperator = false
            Object.entries(members as Record<string, any>).forEach(([name, details]) => {
                if (name.endsWith('()')) {
                    methods.push(new Method(
                        name,
                        (details as { args?: string[] }).args || [],
                        (details as { returns?: string }).returns || 'Unit',
                        forceStatic || (details as { isStatic?: boolean }).isStatic || false,
                        (details as { description?: string }).description || '',
                    ));
                    if (!hasInvokeOperator)
                        hasInvokeOperator = (details as { isInvokeOperator?: boolean }).isInvokeOperator ?? false
                    /*  if (hasInvokeOperator) {
                         log("adding invoke operator to class: " + classPath + ", for method: " + name)
                     } */
                } else {
                    fields.push(new Field(
                        name,
                        (details as { type?: string, returns?: string }).type || (details as any).returns || 'Unknown',
                        forceStatic || (details as { isStatic?: boolean }).isStatic || false,
                        (details as { description?: string }).description || '',
                    ));
                }
            });

            suggestions.push(new TypingsMember(classPath, methods, fields, forceStatic, hasInvokeOperator));
        });
    };

    try {
        const jsonFilePath = path.join(ktsDirectory, 'typings', 'available_members.json');
        const companionJsonFilePath = path.join(ktsDirectory, 'typings', 'companion_objects.json');

        loadFile(jsonFilePath);
        loadFile(companionJsonFilePath, true);

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
                    suggestions.push(
                        new TypingSuggestion(
                            item.fullyQualifiedName,
                            item.simpleName || '',
                            item.source || null,
                            item.type || null,
                            item.path || null,
                            item.parentType || null,
                            item.requiresImport || false,
                            item.isClass || false,
                            item.returnType || null,
                        )
                    );
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

            log(`Loaded ${availableClasses.size} classes from JSON file.`);
            return availableClasses;
        }
        warn('No available_classes.json or binary file found.');
        return availableClasses;
    } catch (error) {
        console.error(`Error loading available classes: ${error}`);
        return availableClasses;
    }
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
    const nodeText = node.text ? `:${node.text}` : '';
    log(`${indent}${node.type}${nodeText}`);

    for (let i = 0; i < node.childCount; i++) {
        logNodeTree(node.child(i), depth + 1);
    }
}
export function logNode(node: SyntaxNode | null | undefined, name: string) {
    if (node)
        log(`${name} type: ${node.type}, ${name} text: ${node.text}`)
    else log(name + " is null.")
}