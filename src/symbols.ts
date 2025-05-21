import * as vscode from 'vscode';
import Parser, { SyntaxNode, Tree } from 'web-tree-sitter';
import { TreeProvider } from './treeprovider';
import { log, error, warn } from './extension';
import { console } from './extension'
import { documentData } from './constants';
import { currentEditor } from './semantictokensprovider';
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
    childScopeId: string | null
    document: vscode.TextDocument | undefined
    constructor(parentScope: Scope | null, startPoint: vscode.Position | null, paramScope: boolean = false, childScopeId: string | null = null) {
        this.depth = parentScope ? parentScope.depth + 1 : 0;
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();
        this.startPoint = startPoint;
        this.paramScope = paramScope
        this.childScopeId = childScopeId
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
    getAllVariablesFromCurrentScope(): string[] {
        const allVariables: string[] = [];
        let currentScope: Scope | null = this;

        while (currentScope) {
            const variableNames = Array.from(currentScope.variables.keys()).map(key => key.split("@")[0]);

            variableNames.forEach(variableName => {
                if (!allVariables.includes(variableName)) {
                    allVariables.push(variableName);
                }
            });

            currentScope = currentScope.parentScope;
        }

        return allVariables;
    }

    getAllVariablesFromScope(scope: Scope): string[] {
        const allVariables: string[] = [];
        let currentScope: Scope | null = scope;
        while (currentScope) {
            const variableNames = Array.from(currentScope.variables.keys()).map(key => key.split("@")[0]);
            variableNames.forEach(variableName => {
                if (!allVariables.includes(variableName)) {
                    allVariables.push(variableName);
                }
            });
            currentScope = currentScope.parentScope;
        }
        return allVariables;
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
        const childId = this.childScopeId
        if (childId) {
            if (!this.document) return false
            let editor = currentEditor(this.document);
            if (editor) {
                const documentUri = editor.document.uri.toString();
                const data = documentData.get(documentUri);
                if (data) {
                    let childScope: Scope | null | undefined = data.semanticTokensProvider?.treeProvider.scopes.get(childId)

                    while (childScope) {
                        const found = Array.from(childScope.variables.keys()).some(key => {
                            const [keyName, keyScopeId] = key.split("@");
                            return keyName === name && (scopeId === undefined || parseInt(keyScopeId) === scopeId);
                        });

                        if (found) {
                            return true;
                        }

                        childScope = childScope.parentScope;
                    }
                }
            }

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
    type: string
    isParamVar: boolean
    constructor(name: string, type: string | null, range: vscode.Range, node: Parser.SyntaxNode, value: string, scope: Scope, varKey: string, isParamVar: boolean = false) {
        super(name);
        this.name = name;
        this.range = range;
        this.node = node;
        this.childNodes = node.children;
        this.varKey = varKey;
        this.value = value;
        this.scope = scope;
        this.isParamVar = isParamVar
        this.type = type ?? "Any"
    }
}


export class FunctionSymbol extends Symbol {
    public args: Symbol[];
    public returnType: string = "Unit";
    constructor(name: string, args: Symbol[], returnType: string) {
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
        public requiresImport: boolean,
        public returnType: string | null,
        public args: string[],
    ) { }
}
export class TypingsMember {
    constructor(
        public classPath: string,
        public methods: Method[],
        public fields: Field[],
        public hasCompanionObject: boolean,
        public hasInvokeOperator: boolean,
        public modifiers: string,
        public superclass: string,
        public interfaces: string[],
        public typeParameters: string[]
    ) { }
}

export class Method {
    constructor(
        public name: string,
        public args: string[],
        public returns: string,
        public isStatic: boolean,
        public description: string | null,
        public modifiers: string,
        public annotations: string
    ) { }
}
export class Field {
    constructor(
        public name: string,
        public returns: string,
        public isStatic: boolean,
        public description: string | null,
        public modifiers: string
    ) { }
}

export class VariableNode {
    constructor(
        public variable: SyntaxNode,
        public type: SyntaxNode | null
    ) { }
}