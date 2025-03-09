import * as vscode from 'vscode';
import Parser, { Tree } from 'web-tree-sitter';
import { TreeProvider } from './treeprovider';
import { log, error, warn } from './extension';
import { console } from './extension'
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
    id: string
    startPoint: vscode.Position | null = null;
    endPoint: vscode.Position | null = null;
    paramScope: boolean
    constructor(parentScope: Scope | null, startPoint: vscode.Position | null, paramScope: boolean = false) {
        this.depth = parentScope ? parentScope.depth + 1 : 0;
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();
        this.startPoint = startPoint;
        this.paramScope = paramScope
        this.id = parentScope ? `${startPoint?.line}:${startPoint?.character}:` + (parentScope.depth + 1) : `0:0:0`
    }


    public setStartPoint(range: vscode.Position) {
        this.startPoint = range;
    }
    public setEndPoint(range: vscode.Position) {
        this.endPoint = range;
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
    isParamVar: boolean
    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode, value: string, scope: Scope, varKey: string, isParamVar: boolean = false) {
        super(name);
        this.name = name;
        this.range = range;
        this.node = node;
        this.childNodes = node.children;
        this.varKey = varKey;
        this.value = value;
        this.scope = scope;
        this.isParamVar = isParamVar
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
export class TypingSuggestion {
    constructor(
        public fullyQualifiedName: string,
        public simpleName: string,
        public source: string | null,
        public type: string | null,
        public path: string | null,
        public parentType: string | null,
        public requiresImport: boolean
    ) { }
}
