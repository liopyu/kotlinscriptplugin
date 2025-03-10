import * as vscode from 'vscode';
import { typingSuggestions } from './extension'
import TSParser, { QueryCapture, SyntaxNode, Tree } from 'web-tree-sitter';
import {
    VariableSymbol,
    ImportSymbol,
    Scope,
    TypingSuggestion
} from './symbols';
import {
    MethodDecorationType,
    SimpleDecorationType,
    DefaultBlueDecorationType,
    SubVariableDecorationType,
    ImportDecorationType,
    DelimiterDecorationType,
    VariableDecorationType,
    OtherDecorationType,
} from './decorations'
import {
    VariableType,
    RangeMode
} from './enums'
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
    documentData
} from './constants'
import { log, error, warn } from './extension';
import { console } from './extension'
import { SemanticTokensProvider } from './semantictokensprovider';
export class TreeProvider {
    public semanticTokensProvider: SemanticTokensProvider | undefined = undefined
    public varId: number
    public hasPackageHeader: boolean = false;
    public currentScope: Scope = new Scope(null, null);
    public scopes: Map<string, Scope> = new Map()
    public ranges: Map<VariableType, vscode.Range[]> = new Map();
    public simpleRanges: vscode.Range[] = []
    public init: boolean = false;
    public readonly parser: TSParser;
    public scopedVariables: Map<string, VariableSymbol> = new Map();
    public paramVariables: Map<string, VariableSymbol> = new Map();
    public rangesToDecorate: Map<string, vscode.Range[]> = new Map();
    public imports: Map<string, ImportSymbol> = new Map();
    public tree: TSParser.Tree | undefined = undefined;
    public isUpdating: boolean = false;
    public purpleType: vscode.Range[] = []
    public defaultBlue: vscode.Range[] = []
    public variableBlue: vscode.Range[] = []
    public importRanges: vscode.Range[] = []
    public diagnostics: vscode.Diagnostic[] = [];
    public diagnosticsValues: Map<string, string> = new Map();
    public diagnosticsMap: Map<string, vscode.Diagnostic[]> = new Map();
    public diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection("kotlinscript");
    public document: vscode.TextDocument
    public duplicateVars: Map<string, string> = new Map()
    constructor(parser: TSParser, document: vscode.TextDocument) {
        this.parser = parser;
        this.document = document
        this.scopes.set(this.currentScope.id, this.currentScope)
        this.varId = 0
        const fullText = document.getText();
        this.tree = this.parser.parse(fullText);
        this.updateTokens()
    }
    updateTokens() {
        this.isUpdating = true;

        if (!this.tree) {
            console.error("Tree is not initialized.");
            this.isUpdating = false;
            return;
        }

        /* log("rootnode: " + this.tree.rootNode)
        this.tree.rootNode.children.forEach(c => {
            console.log("Child generation 1 - Text: " + c.text + ", Type: " + c.type)
            c.children.forEach(cc => {
                console.log("Child generation 2 - Text: " + cc.text + ", Type: " + cc.type)
                cc.children.forEach(ccc => {
                    console.log("Child generation 3 - Text: " + ccc.text + ", Type: " + ccc.type)
                    ccc.children.forEach(cccc => {
                        console.log("Child generation 4 - Text: " + cccc.text + ", Type: " + cccc.type)
                        cccc.children.forEach(ccccc => {
                            console.log("Child generation 5 - Text: " + ccccc.text + ", Type: " + ccccc.type)
                        })
                    })
                })
            })
        }) */
        this.defaultBlue = []
        this.variableBlue = []
        this.purpleType = []
        this.importRanges = []
        this.duplicateVars.clear()
        //this.varId = 0
        /* this.scopes.clear()
        this.currentScope = new Scope(null, null);
        this.scopes.set(this.currentScope.id, this.currentScope) */
        this.isUpdating = false;
        /* if (editor) {
            this.validateDiagnostics(editor?.document)
        } */
    }
    public validateScopes(document: vscode.TextDocument): void {
        const scopesToRemove: string[] = [];

        for (const [key, scope] of this.scopes.entries()) {
            const start = scope.startPoint;
            const end = scope.endPoint;

            if (!start || !end) {
                continue;
            }

            const expectedStartRange = new vscode.Range(
                new vscode.Position(start.line, start.character),
                new vscode.Position(start.line, start.character + 1)
            );

            const expectedEndRange = new vscode.Range(
                new vscode.Position(end.line, Math.max(0, end.character - 1)),
                new vscode.Position(end.line, Math.max(0, end.character))
            );

            const currentStartText = document.getText(expectedStartRange);
            const currentEndText = document.getText(expectedEndRange);

            if (!(currentStartText.trim() === "{" || currentStartText.trim() === "${") || currentEndText.trim() !== "}") {
                scopesToRemove.push(key);
            }
        }

        for (const scopeId of scopesToRemove) {
            this.scopes.delete(scopeId);
        }
    }


    public validateDiagnostics(document: vscode.TextDocument): void {
        const diagnosticsToRemove: string[] = [];
        for (const [errorKey, variableName] of this.diagnosticsValues.entries()) {
            const startLine = parseInt(this.fromKey(errorKey, 0));
            const startCharacter = parseInt(this.fromKey(errorKey, 1));
            const endLine = parseInt(this.fromKey(errorKey, 2));
            const endCharacter = parseInt(this.fromKey(errorKey, 3));
            const expectedRange = new vscode.Range(
                new vscode.Position(Math.max(0, startLine - 1), Math.max(0, startCharacter)),
                new vscode.Position(Math.max(0, endLine - 1), Math.max(0, endCharacter))
            );
            if (startLine > document.lineCount || endLine > document.lineCount) {
                diagnosticsToRemove.push(errorKey);
                continue;
            }
            const currentText = document.getText(expectedRange);
            const expectedErrorMessage = this.fromKey(errorKey, 4);
            if (currentText !== variableName || !this.isErrorStillRelevant(expectedRange, expectedErrorMessage)) {
                diagnosticsToRemove.push(errorKey);
            }
        }
        diagnosticsToRemove.forEach(errorKey => {
            const uri = vscode.window.activeTextEditor?.document.uri;
            if (!uri) return;
            const currentDiagnostics = this.diagnosticsMap.get(uri.toString()) || [];
            const updatedDiagnostics = currentDiagnostics.filter(
                diagnostic =>
                    this.provideErrorKey(
                        diagnostic.range.start,
                        diagnostic.range.end,
                        this.fromKey(errorKey, 4)
                    ) !== errorKey
            );
            this.diagnosticsValues.delete(errorKey);
            this.diagnostics = updatedDiagnostics;
            this.diagnosticsMap.set(uri.toString(), updatedDiagnostics);
            this.diagnosticCollection.set(uri, updatedDiagnostics);
        });
    }
    public isErrorStillRelevant(range: vscode.Range, errorMessage: string): boolean {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return false;
        }
        const currentText = editor.document.getText(range);
        if (currentText?.trim() === errorMessage.trim()) {
            return true;
        }
        const documentUri = editor.document.uri.toString();
        const data = documentData.get(documentUri);
        if (data) {
            const tree = data.treeProvider.tree;
            if (tree) {
                const node = tree.rootNode.descendantForPosition(
                    { row: range.start.line, column: range.start.character },
                    { row: range.end.line, column: range.end.character }
                );

                if (node) {
                    if (node.type === "valid_node_type") {
                        return false;
                    }
                }
            }
        }
        return false;
    }

    public validateImports(tree: TSParser.Tree): void {
        const importsToRemove: string[] = [];
        for (const [importKey, importSymbol] of this.imports.entries()) {
            const expectedRange = importSymbol.range;
            const identifierNode =
                this.findParent(tree.rootNode.descendantForPosition({
                    row: expectedRange.start.line,
                    column: expectedRange.start.character,
                }), "identifier", expectedRange)
            if (!identifierNode) {
                importsToRemove.push(importKey);
                continue;
            }
            const actualRange = this.supplyRange(identifierNode);
            const normalizedText = identifierNode.text.replace(/\s+/g, '').trim();
            if (!this.rangesEqual(expectedRange, actualRange)) {
                if (normalizedText == importSymbol.path) {
                    importSymbol.setRange(actualRange)
                    continue;
                }
            }
            if (normalizedText !== importSymbol.path) {
                importsToRemove.push(importKey);
            }
        }
        for (const importKey of importsToRemove) {
            this.imports.delete(importKey);
        }
    }

    public validateVariables(tree: TSParser.Tree): void {
        const variablesToRemove: string[] = [];

        for (const [variableKey, variableSymbol] of this.scopedVariables.entries()) {
            const [variableName, scopeId, rangeKey] = variableKey.split("@");
            const expectedRange = variableSymbol.range;

            // Find the node in the syntax tree based on the expected range
            const node = tree.rootNode.descendantForPosition({
                row: expectedRange.start.line,
                column: expectedRange.start.character,
            });

            if (!node) {
                variablesToRemove.push(variableKey);
                continue;
            }

            // Ensure the node text matches the variable name
            if (node.text !== variableName) {
                variablesToRemove.push(variableKey);
                continue;
            }

            // Validate the range
            const actualRange = this.supplyRange(node);
            const actualRangeKey = this.getRangeKey(actualRange);
            if (!this.rangesEqual(expectedRange, actualRange) || actualRangeKey !== rangeKey) {
                variableSymbol.setRange(actualRange);
                //console.log("Modifying variable range: " + variableKey)
                variablesToRemove.push(variableKey); // Add old key for removal
                const newVarKey = `${variableName}@${scopeId}@${actualRangeKey}`;
                //console.log("New variable range: " + variableKey)
                this.scopedVariables.set(newVarKey, variableSymbol); // Add updated key
                continue;
            }

            let currentNode: TSParser.SyntaxNode | null = node;
            let isValid = false;

            while (currentNode) {
                if (
                    currentNode.type === "property_declaration" ||
                    currentNode.type === "variable_declaration"
                ) {
                    isValid = true;
                    break;
                }
                currentNode = currentNode.parent;
            }

            if (!isValid) {
                variablesToRemove.push(variableKey);
                continue;
            }

            if (!variableSymbol.scope.variables.has(variableKey)) {
                variablesToRemove.push(variableKey);
            }
        }

        for (const variableKey of variablesToRemove) {
            const symbol = this.scopedVariables.get(variableKey);

            if (symbol) {
                symbol.scope.undefine(symbol);
            }
            this.scopedVariables.delete(variableKey);
            /* log(
                `Removed stale variable '${this.fromKey(variableKey)}' from scope: ${symbol?.scope.id}`
            ); */
        }
    }


    public getAffectedRange(node: TSParser.SyntaxNode): TSParser.SyntaxNode {
        let current = node;
        while (current.parent && current.parent.type !== "source_file") {
            current = current.parent;
        }
        return current;
    }
    public fromKey(string: string, index: number = 0) {
        const parts = string.split("@");
        return parts[index];
    }

    public rangesEqual(range1: vscode.Range, range2: vscode.Range): boolean {
        return range1.start.line === range2.start.line &&
            range1.start.character === range2.start.character &&
            range1.end.line === range2.end.line &&
            range1.end.character === range2.end.character;
    }
    public processPropertyDeclaration(node: SyntaxNode,
        builder: vscode.SemanticTokensBuilder): void {
        const valueNodes = this.findChildren(node, expressionTypes, "property_declaration");
        const variables = this.extractVariables(node);

        if (valueNodes.length > 0) {
            valueNodes.forEach(valueNode => {
                if (!this.isValueInDeclaration(valueNode)) return;
                variables.forEach((range, variableNode) => {
                    if (variableNode.parent?.type != "lambda_parameters")
                        this.processVariableDeclaration(variableNode, valueNode, range, builder)
                });
            });
        } else {
            variables.forEach((range, variableNode) => {
                this.processVariableDeclaration(variableNode, null, range, builder);
            })
        }

    }
    public extractVariables(node: SyntaxNode): Map<SyntaxNode, vscode.Range> {
        const variables: Map<SyntaxNode, vscode.Range> = new Map();
        const declarationNodes = this.findChildren(node, variableDeclarationTypes);

        declarationNodes.forEach(declaration => {
            const variableNodes = declaration.type === "multi_variable_declaration"
                ? this.findChildren(declaration, ["variable_declaration"])
                : [declaration];

            variableNodes.forEach(variable => {
                const variableNode = this.extractVariableNode(variable);
                if (variableNode) {
                    variables.set(variableNode, this.supplyRange(variableNode));
                }
            });
        });

        return variables;
    }
    public extractVariableNode(declaration: SyntaxNode): SyntaxNode | null {
        const userTypeNode = this.findChild(declaration, "user_type");
        return userTypeNode ? declaration.firstChild : declaration;
    }
    public processImportDeclarations(node: SyntaxNode) {
        const importNode = this.findChild(node, "identifier");
        if (!importNode) return
        const range = this.supplyRange(importNode);
        this.processImportDeclaration(importNode, range);
    };
    /* public enter: vscode.Range[] = [];
    public exit: vscode.Range[] = []; */


    public givePath(path: string, segments: number): string {
        const parts = path.split('.');
        if (segments <= 0 || segments > parts.length) {
            return ""
        }
        return parts.slice(0, segments).join('.');
    }

    public handleSimpleIdentifier(node: SyntaxNode, byPassSI: boolean = false): void {
        if (node.type == "navigation_expression" && !this.hasParent(node, "import_header")) {
            const normalizedText = node.text.replace(/\s+/g, '').trim();
            var splitNodes = this.findChildren(node, ["simple_identifier"])
            this.imports.forEach((i, key) => {
                const barePath = this.givePath(normalizedText, i.segmentCount);
                if (barePath == key) {
                    this.importRanges.push(this.supplyRange(splitNodes[i.segmentCount - 1]))
                }
            })
        } else if (((node.type === "simple_identifier" && node.parent?.type != "catch_block") || byPassSI) &&
            !this.isSpecialHandleWord(node)
        ) {
            const isUpperCase = /^[A-Z_0-9]+$/.test(node.text) && !this.hasParent(node, "import_list") && !/^(_|__|___)$/.test(node.text)
            const variableRange = this.currentScope.resolveVariable(node.text)?.range;
            var isRecordedImport = false
            this.imports.forEach((i, key) => {
                if (!isRecordedImport && node.text == i.simpleName) {
                    isRecordedImport = true
                }
            })
            if (node.parent?.type !== "navigation_suffix") {
                if (this.currentScope.hasVariableInScopeChain(node.text)) {
                    if (variableRange && !this.rangesEqual(variableRange, this.supplyRange(node))) {
                        this.variableBlue.push(this.supplyRange(node));
                    } else if (isUpperCase) {
                        this.variableBlue.push(this.supplyRange(node));
                    }
                } else if (isRecordedImport && !this.hasParent(node, "import_header")) {
                    this.importRanges.push(this.supplyRange(node))

                } else if (isUpperCase) {
                    this.variableBlue.push(this.supplyRange(node));
                }
            } else if (isUpperCase) {
                this.variableBlue.push(this.supplyRange(node));
            }
        }
    }

    public isSpecialHandleWord(node: SyntaxNode): boolean {
        return (node.type == "->" ||
            node.type == "!!" ||
            node.type == "is" ||
            node.type == "?:" ||
            node.type == "in" ||
            node.type == "companion" && node.parent?.type == "companion_object" ||
            (node.type == "simple_identifier" &&
                typingSuggestions.some(suggestion => node.text == suggestion.simpleName) &&
                node.parent?.type == "infix_expression") ||
            ((node.type == "as" || node.type == "as?") && node.parent?.type == "as_expression") ||
            (node.type == "?" && node.parent?.type == "nullable_type") ||
            (node.type == "?." && node.parent?.type == "navigation_suffix") ||
            node.type == "by" ||
            (node.text == "it" &&
                this.hasParent(node, "lambda_literal") &&
                !this.currentScope.hasVariableInScopeChain("it") &&
                node.parent?.type != "navigation_suffix")
        )
    }
    public isBlockNode(node: SyntaxNode): boolean {
        if (blocks.includes(node.type)) {
            return true;
        }
        if (node.type === "{" && node.parent && blockParents.includes(node.parent.type)) {
            return true;
        }
        return false;
    }
    public isBlockExitNode(node: SyntaxNode): boolean {
        if (node.type !== "}") return false;
        const parent = node.parent;
        if (!parent) return false;
        const hasOpeningBracket = parent.children.some(child => child.type === "{");
        const isExplicitBlock = blocks.includes(parent.type);
        return hasOpeningBracket || isExplicitBlock;
    }
    public hasParent(node: SyntaxNode, parentType: string): boolean {
        let currentNode = node.parent;
        while (currentNode) {
            if (currentNode.type === parentType) {
                return true;
            }
            currentNode = currentNode.parent;
        }
        return false;
    }

    public findChildren(
        node: SyntaxNode,
        types: string[],
        expectedParent: string | null = null
    ): SyntaxNode[] {
        const result: SyntaxNode[] = [];

        const traverse = (currentNode: SyntaxNode) => {
            for (const child of currentNode.children) {
                if (this.isBlockNode(child) || child.type === "{") {
                    continue;
                }

                if (types.includes(child.type) && (!expectedParent || child.parent?.type === expectedParent)) {
                    result.push(child);
                }

                if (!this.isBlockExitNode(child)) {
                    traverse(child);
                }
            }
        };

        traverse(node);
        return result;
    }


    public findChild(node: SyntaxNode, type: string, expectedParent: string | null = null): SyntaxNode | null {
        for (const child of node.children) {

            if (child.type === type) {
                if (!expectedParent || (child.parent && child.parent.type === expectedParent)) {
                    return child;
                }
            }
            const found = this.findChild(child, type, expectedParent);
            if (found) {
                return found;
            }
        }
        return null;
    }
    public findParent(node: TSParser.SyntaxNode | null, type: string, range: vscode.Range): TSParser.SyntaxNode | null {
        let currentNode = node;
        while (currentNode) {
            if (currentNode.type === type) {
                if (this.semanticTokensProvider)
                    if (this.semanticTokensProvider.rangesIntersect(range, this.supplyRange(currentNode)))
                        return currentNode;
            }
            currentNode = currentNode.parent;
        }

        return null;
    }

    public isValueInDeclaration(node: TSParser.SyntaxNode): boolean {
        // Detects the `10` in `var x = 10`
        return node.parent?.type === 'property_declaration' && expressionTypes.includes(node.type);
    }
    public supplyRangeFromRange(range: TSParser.Range) {
        return new vscode.Range(
            range.startPosition.row,
            range.startPosition.column,
            range.endPosition.row,
            range.endPosition.column
        )
    }
    public supplyRange(node: SyntaxNode) {
        return new vscode.Range(
            node.startPosition.row,
            node.startPosition.column,
            node.endPosition.row,
            node.endPosition.column
        )
    }
    public createDiagnostic(range: vscode.Range, message: string, severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Error): vscode.Diagnostic {
        return new vscode.Diagnostic(range, message, severity);
    }
    public addDiagnostics(diagnostics: vscode.Diagnostic[]): void {
        const uri = vscode.window.activeTextEditor?.document.uri;
        if (!uri) return;
        const currentDiagnostics = this.diagnosticsMap.get(uri.toString()) || [];
        const newDiagnostics = diagnostics.filter(newDiagnostic =>
            !currentDiagnostics.some(existingDiagnostic =>
                this.areDiagnosticsEqual(existingDiagnostic, newDiagnostic)
            )
        );
        const updatedDiagnostics = [...currentDiagnostics, ...newDiagnostics];
        this.diagnosticsMap.set(uri.toString(), updatedDiagnostics);
        this.diagnosticCollection.set(uri, updatedDiagnostics);
    }
    public areDiagnosticsEqual(a: vscode.Diagnostic, b: vscode.Diagnostic): boolean {
        return a.message === b.message &&
            a.range.isEqual(b.range) &&
            a.severity === b.severity;
    }
    public provideErrorKey(start: vscode.Position, end: vscode.Position, errorMessage: string): string {
        return `${start.line}@${start.character}@${end.line}@${end.character}@${errorMessage}`;
    }
    public static addError(range: vscode.Range, message: string, errorText: string, severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Error) {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            const documentUri = editor.document.uri.toString();
            const data = documentData.get(documentUri);
            if (data) {
                const treeProvider = data.treeProvider
                const errorKey = treeProvider.provideErrorKey(range.start, range.end, message);
                if (!treeProvider.diagnosticsValues.has(errorKey)) {
                    treeProvider.diagnostics.push(treeProvider.createDiagnostic(range, message, severity));
                    treeProvider.diagnosticsValues.set(treeProvider.provideErrorKey(range.start, range.end, message), errorText);
                }
            }
        }
    }
    public getRangeKey(range: vscode.Range): string {
        const start = `${range.start.line}:${range.start.character}`;
        const end = `${range.end.line}:${range.end.character}`;
        return `${start}-${end}`;
    }
    public processVariableDeclaration(
        identifierNode: TSParser.SyntaxNode,
        variableNode: TSParser.SyntaxNode | null,
        range: vscode.Range,
        builder: vscode.SemanticTokensBuilder,
        isParamVar: boolean = false
    ): void {
        const variableName = identifierNode.text;
        const rangeMode = this.semanticTokensProvider?.rangeMode;
        var scope = this.currentScope;
        if (!scope) return;
        let varKey = `${variableName}@${scope.id}@${this.getRangeKey(range)}`;
        if (reservedCharacters.includes(variableName)) {
            if (variableName == "_" && ["lambda_parameters", "multi_variable_declaration"].includes(identifierNode.parent?.type ?? "")) {
                builder.push(range, "enumMember");
                return;
            } else {
                const errorMessage = `Cannot define reserved identifier: '${variableName}'`;
                TreeProvider.addError(range, errorMessage, variableName);
                return;
            }
        }
        /*  if (!isParamVar) { */
        const existingVars = Array.from(scope.variables.values()).filter(v => v.name === variableName);
        const isExactDuplicate = existingVars.some(v => v.varKey === varKey);
        if (existingVars.length > 0 && !isExactDuplicate && identifierNode.parent?.type != "lambda_parameters") {
            const errorMessage = `Variable "${variableName}" is already defined in the current scope and may cause ambiguity.`;
            TreeProvider.addError(range, errorMessage, variableName, vscode.DiagnosticSeverity.Warning);
            builder.push(range, "enumMember");
            this.duplicateVars.set(variableName, scope.id)
            return;
        }
        /*  } */
        const variableSymbol = new VariableSymbol(
            variableName,
            range,
            identifierNode,
            variableNode ? variableNode.text : "",
            scope,
            varKey,
            isParamVar
        );
        scope.define(variableSymbol);
        /* if (!isParamVar) { */
        this.scopedVariables.set(varKey, variableSymbol);
        /*  } else {
             this.paramVariables.set(varKey, variableSymbol);
         } */
        builder.push(range, "enumMember");
    }


    public processImportDeclaration(node: TSParser.SyntaxNode, range: vscode.Range) {
        const importName = node.text.replace(/\s+/g, '').trim();
        if (!this.imports.has(importName)) {
            this.imports.set(importName, new ImportSymbol(importName, range, node));
        }
    }

    getscopedVariables(): Map<string, VariableSymbol> {
        return this.scopedVariables;
    }
    getimports(): Map<string, ImportSymbol> {
        return this.imports;
    }
    enterScope(parentScope: Scope, startRange: vscode.Position | null, paramScope: boolean = false): void {
        if (!parentScope) {
            throw new Error("Parent scope is required to enter a new scope.");
        }

        const depth = parentScope.depth + 1;
        const id = `${startRange?.line}:${startRange?.character}:${depth}`;


        let existingScope = this.scopes.get(id);
        if (existingScope) {
            this.currentScope = existingScope;
            return;
        }

        const newScope = new Scope(parentScope, startRange);
        this.scopes.set(id, newScope);
        this.currentScope = newScope;
    }

    exitScope(node: SyntaxNode, optionalScope: Scope | null = null, hasChildScope: boolean = false): void {
        if (!this.currentScope.parentScope) {
            TreeProvider.addError(this.supplyRange(node), "Cannot exit global scope", node.text)
            return;
        }
        if (hasChildScope) {
            this.currentScope.parentScope.childScopeId = this.currentScope.id
        }
        if (!optionalScope) {
            this.currentScope = this.currentScope.parentScope
        } else if (optionalScope.parentScope) {
            this.currentScope = optionalScope.parentScope
        }
    }

}