import * as vscode from 'vscode';
import Parser from 'web-tree-sitter';
import { SemanticTokensProvider } from './extension';
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
});
export const ImportDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4ec9b0',
});
export const MethodDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#FFD700',
});
export function applyDecorations(parser: SemanticTokensProvider, document: vscode.TextDocument): void {
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
export class Scope {
    parentScope: Scope | null;
    symbols: Map<string, Symbol>;
    variables: Map<string, VariableSymbol>;

    constructor(parentScope: Scope | null) {
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
        return this.variables.get(name) || (this.parentScope ? this.parentScope.resolveVariable(name) : undefined);
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
export class FunctionSymbol extends Symbol {
    public args: Symbol[];
    public returnType: string | null;
    constructor(name: string, args: Symbol[], returnType: string | null) {
        super(name, returnType);
        this.args = args;
        this.returnType = returnType;
    }
}
export class VariableSymbol extends Symbol {
    public isImport: boolean;
    name: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;
    childNodes: Parser.SyntaxNode[];

    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode, isImport: boolean = false) {
        super(name);
        this.name = name;
        this.range = range;
        this.node = node;
        this.childNodes = node.children;
        this.isImport = isImport;
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
