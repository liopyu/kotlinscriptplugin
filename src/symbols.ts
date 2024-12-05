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
    color: '#ff0000',
    textDecoration: 'underline'
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
            this.variables.set(symbol.varKey, symbol);
        } else {
            this.symbols.set(symbol.name, symbol);
        }
    }
    undefine(symbol: Symbol): void {
        if (symbol instanceof VariableSymbol) {
            this.variables.delete(symbol.varKey);
        } else {
            this.symbols.delete(symbol.name);
        }
    }
    resolveVariable(name: string): VariableSymbol | undefined {
        let currentScope: Scope | null = this;
        while (currentScope) {
            const variable = Array.from(currentScope.variables.entries()).find(([key]) => {
                const [keyName] = key.split("@");
                return keyName === name;
            });
            if (variable) {
                return variable[1];
            }
            currentScope = currentScope.parentScope;
        }

        return undefined;
    }


    hasVariableInScopeChain(name: string, scopeId?: number): boolean {
        let currentScope: Scope | null = this;

        while (currentScope) {
            const found = Array.from(currentScope.variables.keys()).some(key => {
                const [keyName, keyScopeId] = key.split("@");
                return keyName === name && (scopeId === undefined || parseInt(keyScopeId) === scopeId);
            });

            if (found) {
                return true;
            }

            currentScope = currentScope.parentScope;
        }

        return false;
    }

    countVariablesByName(variableName: string): number {
        return Array.from(this.variables.keys()).filter(key => {
            const name = key.split("@")[0];
            return name === variableName;
        }).length;
    }

}
export class VariableSymbol extends Symbol {
    name: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;
    childNodes: Parser.SyntaxNode[];
    value: string
    scope: Scope
    varKey: string

    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode, value: string, scope: Scope, varKey: string) {
        super(name);
        this.name = name;
        this.range = range;
        this.node = node;
        this.childNodes = node.children;
        this.varKey = varKey;
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
