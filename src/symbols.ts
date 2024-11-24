import * as vscode from 'vscode';
import Parser, { Tree } from 'web-tree-sitter';
import { TreeProvider } from './extension';
export enum VariableType {
    SIMPLE,
    VARIABLE,
    IMPORT,
    METHOD
}
export const SimpleDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ADD8E6',
});
export const VariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
    textDecoration: 'underline'
});
export const ImportDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4ec9b0',
});
export const MethodDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#FFD700',
});
export const OtherDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#a824ef',
});
export function applyDecorations(parser: TreeProvider, document: vscode.TextDocument): void {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === document) {
        if (parser.ranges.has(VariableType.IMPORT)) {
            editor.setDecorations(ImportDecorationType, parser.ranges.get(VariableType.IMPORT)!);
        }
        if (parser.ranges.has(VariableType.SIMPLE)) {
            editor.setDecorations(SimpleDecorationType, parser.ranges.get(VariableType.SIMPLE)!);
        }
        if (parser.ranges.has(VariableType.VARIABLE)) {
            editor.setDecorations(VariableDecorationType, parser.ranges.get(VariableType.VARIABLE)!);
        }
        if (parser.ranges.has(VariableType.METHOD)) {
            editor.setDecorations(MethodDecorationType, parser.ranges.get(VariableType.METHOD)!);
        }
    }
}
class Symbol {
    name: string;
    type: string | null;
    constructor(name: string, type: string | null = "kotlin.Unit") {
        this.name = name;
        this.type = type;
    }
}
export class Scope {
    parentScope: Scope | null;
    symbols: Map<string, Symbol>;
    variables: Map<string, VariableSymbol>;
    depth: number;

    constructor(parentScope: Scope | null) {
        this.depth = (parentScope ? parentScope.depth + 1 : 0);
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();
    }

    define(symbol: Symbol): void {
        if (symbol instanceof VariableSymbol) {
            this.variables.set(symbol.name, symbol);
        } else {
            this.symbols.set(symbol.name, symbol);
        }
    }
    undefine(symbol: Symbol): void {
        if (symbol instanceof VariableSymbol) {
            this.variables.delete(symbol.name);
        } else {
            this.symbols.delete(symbol.name);
        }
    }

    resolveVariable(name: string): VariableSymbol | undefined {
        const result = this.variables.get(name);
        if (result) return result;
        if (this.parentScope) {
            return this.parentScope.resolveVariable(name);
        }
        return undefined;
    }
    /**
         * Checks if a variable exists in the current scope or any parent scope.
         * @param name - The name of the variable to search for.
         * @returns True if the variable exists in the current or parent scope chain.
         */
    hasVariableInScopeChain(name: string): boolean {
        let currentScope: Scope | null = this; // Start with the current scope

        while (currentScope) {
            // Check if the variable exists in the current scope
            if (currentScope.variables.has(name)) {
                return true;
            }

            // Traverse to the parent scope
            currentScope = currentScope.parentScope;
        }

        return false; // Variable not found in the entire scope chain
    }

}
export class VariableSymbol extends Symbol {
    public isImport: boolean;
    name: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;
    childNodes: Parser.SyntaxNode[];
    value: string
    scope: Scope

    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode, value: string, scope: Scope, isImport: boolean = false) {
        super(name);
        this.name = name;
        this.range = range;
        this.node = node;
        this.childNodes = node.children;
        this.isImport = isImport;
        this.value = value;
        this.scope = scope;
    }
    public setRange(range: vscode.Range) {
        this.range = range;
    }
}


export class FunctionSymbol extends Symbol {
    public args: Symbol[];
    public returnType: string | null;
    constructor(name: string, args: Symbol[], returnType: string | null) {
        super(name, returnType);
        this.args = args;
        this.returnType = returnType;
    }
}
export class ImportSymbol {
    name: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;

    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode) {
        this.name = name;
        this.range = range;
        this.node = node;
    }
}
function getClassName(type: string): string {
    if (type != null) {
        const parts = type.split('.');
        return parts[parts.length - 1];
    }
    return "kotlin.Unit";
}
