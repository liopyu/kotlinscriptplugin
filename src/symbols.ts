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
    //textDecoration: 'underline'
});
export const SubVariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
    //textDecoration: 'underline'
});
export const ImportDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4ec9b0',
});
export const MethodDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#FFD700',
});
export const OtherDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ca27ea',
});
export const DelimiterDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#a258ab',
});
export const DefaultBlueDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#569CD6',
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
    range: vscode.Range | null;
    constructor(name: string, type: string | null = "kotlin.Unit") {
        this.name = name;
        this.type = type;
        this.range = null;
    }
    public setRange(range: vscode.Range) {
        this.range = range;
    }
}
export class Scope {
    parentScope: Scope | null;
    symbols: Map<string, Symbol>;
    variables: Map<string, VariableSymbol>;
    depth: number;
    id: number

    constructor(parentScope: Scope | null) {
        this.depth = (parentScope ? parentScope.depth + 1 : 0);
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();
        this.id = parentScope ? parentScope.id + 1 : 0
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
export class ImportSymbol extends Symbol {
    simpleName: string;
    path: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;
    segmentCount: number = 0;

    constructor(path: string, range: vscode.Range, node: Parser.SyntaxNode) {
        var somePath = path.split(".").pop()
        super(somePath ? somePath : "", path);
        this.path = path;
        this.range = range;
        this.node = node;
        this.simpleName = this.getClassName();
    }

    getClassName() {
        var name = this.path.split('.');
        var finalName = name.pop()
        this.segmentCount = name.length + 1
        return finalName ? finalName : ""
    }
}
function getClassName(type: string): string {
    if (type != null) {
        const parts = type.split('.');
        return parts[parts.length - 1];
    }
    return "kotlin.Unit";
}
