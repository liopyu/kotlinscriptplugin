import * as vscode from 'vscode';
import { typingSuggestions } from './extension'
import TSParser, { QueryCapture, SyntaxNode, Tree } from 'web-tree-sitter';
import {
    VariableSymbol,
    ImportSymbol,
    Scope,
    TypingSuggestion,
    VariableNode,
    TypingsMember
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
    RangeMode,
    VariableParameter
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
import { currentEditor, SemanticTokensProvider } from './semantictokensprovider';
import { getImportFromClassOrPath, getNamedSiblings, logNode } from './utils';
export class TreeProvider {
    public semanticTokensProvider: SemanticTokensProvider | undefined = undefined
    public varId: number
    public hasPackageHeader: boolean = false;
    public currentScope: Scope
    public scopes: Map<string, Scope> = new Map()
    public ranges: Map<VariableType, vscode.Range[]> = new Map();
    public simpleRanges: vscode.Range[] = []
    public init: boolean = false;
    public readonly parser: TSParser;
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
    public duplicateVars: Map<string, VariableSymbol> = new Map()

    constructor(parser: TSParser, document: vscode.TextDocument) {
        this.parser = parser;
        this.document = document
        this.currentScope = new Scope(null, null);
        this.scopes.set(this.currentScope.id, this.currentScope)

        this.currentScope.document = document
        this.semanticTokensProvider = documentData.get(this.document.uri.toString())?.semanticTokensProvider
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
        let editor = currentEditor(this.document);
        const uri = editor?.document.uri;
        if (uri) {
            this.diagnosticsMap.set(uri.toString(), []);
            this.diagnosticCollection.set(uri, []);
        }
        //this.varId = 0
        /* this.scopes.clear()
        this.currentScope = new Scope(null, null);
        this.scopes.set(this.currentScope.id, this.currentScope) */
        this.isUpdating = false;
    }
    public validateDiagnostics(): void {


        if (this.diagnostics.length > 0) {
            this.addDiagnostics(this.diagnostics);
        }

        this.diagnosticsValues.clear();
        this.diagnostics = [];
    }

    public validateImports(tree: TSParser.Tree, i: SyntaxNode[], modifiedRange: vscode.Range): void {
        let importNodes = tree.rootNode.descendantsOfType("import_list");
        const nodes: SyntaxNode[] = []
        if (importNodes.length === 0) {
            this.imports.clear();
            return;
        }

        const validIdentifiers = new Set<string>();

        for (const node of importNodes) {
            const identifierNodes = this.findChildren(node, ["identifier"]);
            identifierNodes.forEach(node => {
                const normalizedText = node.text.replace(/\s+/g, '').trim();
                // console.log("Normalized Text: " + normalizedText)
                validIdentifiers.add(normalizedText);
            });
        }

        const importsToRemove: string[] = [];

        for (const [importKey, importSymbol] of this.imports.entries()) {
            if (!validIdentifiers.has(importSymbol.path)) {
                importsToRemove.push(importKey);
            }
        }

        importsToRemove.forEach(importKey => this.imports.delete(importKey));
    }

    public validateVariables(tree: TSParser.Tree, modifiedRange: vscode.Range, builder: vscode.SemanticTokensBuilder): void {
        const variablesToRemove: string[] = [];
        const modifiedVariables: Map<string, VariableSymbol> = new Map()
        // console.log("Starting variable validation...");

        let editor = currentEditor(this.document);
        if (!editor) {
            console.log("No active editor detected. Skipping variable validation.");
            return;
        }
        for (let [scopeKey, scope] of this.scopes) {
            for (let [variableKey, variableSymbol] of scope.variables.entries()) {
                const [variableName, scopeId, rangeKey] = variableKey.split("@");
                const expectedRange = variableSymbol.range;

                const adjustedExpectedRange = this.adjustRangeForShifts(expectedRange, modifiedRange, editor, true);
                // this.processVariableDeclaration(variableSymbol.node, null, variableSymbol.range, builder)
                // if (t) return
                /*  console.log(`Checking scoped variable '${variableName}'`);
                 console.log(`→ Original Range: ${expectedRange.start.line}:${expectedRange.start.character} - ${expectedRange.end.line}:${expectedRange.end.character}`);
                 console.log(`→ Adjusted Range: ${adjustedExpectedRange.start.line}:${adjustedExpectedRange.start.character} - ${adjustedExpectedRange.end.line}:${adjustedExpectedRange.end.character}`); */
                const desc = tree.rootNode.descendantForPosition({
                    row: adjustedExpectedRange.start.line,
                    column: adjustedExpectedRange.start.character - 1,
                });
                const node = this.findParent(desc, "variable_declaration", adjustedExpectedRange)
                if (!node) {
                    //console.log(`→ Removing stale scoped variable (no matching node): ${variableKey}`);
                    variablesToRemove.push(variableKey);
                    continue;
                }
                let supposedText = editor.document.getText(this.supplyRange(desc));
                /*  console.log(`→ Found text: "${supposedText.trim()}"`);
                 console.log(`→ Expected text: "${variableName.trim()}"`); */

                if (supposedText !== variableName) {
                    //console.log(`→ Removing stale scoped variable (text mismatch): ${variableKey}`);
                    variablesToRemove.push(variableKey);
                    continue;
                }

                const actualRange = this.supplyRange(desc);
                actualRange.start.translate(-1, -1)
                actualRange.end.translate(-1, -1)
                // console.log(actualRange)
                const actualRangeKey = this.getRangeKey(actualRange);
                if (!this.rangesEqual(adjustedExpectedRange, actualRange) || actualRangeKey !== rangeKey) {
                    variableSymbol.setRange(actualRange);
                    const newVarKey = `${variableName}@${scopeId}@${actualRangeKey}`;
                    variablesToRemove.push(variableKey);
                    scope.variables.delete(variableKey);
                    scope.variables.set(newVarKey, variableSymbol);
                    variableSymbol.scope.undefine(variableSymbol);
                    variableSymbol.varKey = newVarKey;
                    variableSymbol.scope.define(variableSymbol);
                    //console.log(`→ Updating range for variable: ${variableKey} to ${newVarKey}`);
                    variableKey = newVarKey;
                    modifiedVariables.set(newVarKey, variableSymbol)
                    continue;
                }
            }

            for (const variableKey of variablesToRemove) {
                const symbol = scope.variables.get(variableKey);
                if (symbol) {
                    symbol.scope.undefine(symbol);
                    //console.log(`→ Final removal of variable: ${variableKey}`);
                    scope.variables.delete(variableKey);

                    for (const [key, variable] of symbol.scope.variables) {
                        if (!scope.variables.has(key)) {
                            modifiedVariables.set(key, variable);
                        }
                    }
                }
            }
        }


    }
    private calculateColumnShift(modifiedText: string): number {
        const lines = modifiedText.split('\n');

        // Find the longest shift based on content displacement
        let maxShift = 0;

        for (const line of lines) {
            // Use content's actual start point, not just leading whitespace
            const contentStartIndex = line.search(/\S/); // First non-whitespace character
            if (contentStartIndex !== -1) {
                maxShift = Math.max(maxShift, contentStartIndex);
            }
        }

        return maxShift;
    }
    public adjustRangeForShiftsWithColumn(
        range: vscode.Range,
        modifiedRange: vscode.Range,
        editor: vscode.TextEditor
    ): vscode.Range {
        const semanticTokensProvider = this.semanticTokensProvider;
        if (!semanticTokensProvider) return range;

        const newLineShift = editor.document.lineCount - semanticTokensProvider.previousLineCount;
        const modifiedText = editor.document.getText(modifiedRange);

        const columnShift = this.calculateColumnShift(modifiedText);

        const shouldShift = modifiedRange.start.line < range.start.line ||
            (modifiedRange.start.line === range.start.line && modifiedRange.start.character <= range.start.character);

        const shiftAmount = shouldShift ? newLineShift : 0;

        return new vscode.Range(
            new vscode.Position(
                Math.max(0, range.start.line + shiftAmount),
                shouldShift
                    ? Math.max(0, range.start.character + columnShift)
                    : range.start.character
            ),
            new vscode.Position(
                Math.max(0, range.end.line + shiftAmount),
                shouldShift
                    ? Math.max(0, range.end.character + columnShift)
                    : range.end.character
            )
        );
    }

    public adjustRangeForShiftsNoColumnNegative(
        range: vscode.Range,
        modifiedRange: vscode.Range,
        editor: vscode.TextEditor
    ): vscode.Range {
        const semanticTokensProvider = this.semanticTokensProvider;
        if (!semanticTokensProvider) return range;

        const newLineShift = editor.document.lineCount - semanticTokensProvider.previousLineCount;

        const shouldShift = modifiedRange.start.line < range.start.line ||
            (modifiedRange.start.line === range.start.line && modifiedRange.start.character <= range.start.character);

        const shiftAmount = shouldShift ? newLineShift : 0;

        return new vscode.Range(
            new vscode.Position(
                Math.max(0, range.start.line - shiftAmount),
                range.start.character
            ),
            new vscode.Position(
                Math.max(0, range.end.line - shiftAmount),
                range.end.character
            )
        );
    }
    public adjustRangeForShiftsNoColumn(
        range: vscode.Range,
        modifiedRange: vscode.Range,
        editor: vscode.TextEditor
    ): vscode.Range {
        const semanticTokensProvider = this.semanticTokensProvider;
        if (!semanticTokensProvider) return range;

        const newLineShift = editor.document.lineCount - semanticTokensProvider.previousLineCount;

        const shouldShift = modifiedRange.start.line < range.start.line ||
            (modifiedRange.start.line === range.start.line && modifiedRange.start.character <= range.start.character);

        const shiftAmount = shouldShift ? newLineShift : 0;

        return new vscode.Range(
            new vscode.Position(
                Math.max(0, range.start.line + shiftAmount),
                range.start.character
            ),
            new vscode.Position(
                Math.max(0, range.end.line + shiftAmount),
                range.end.character
            )
        );
    }

    public adjustRangeForShifts(
        range: vscode.Range,
        modifiedRange: vscode.Range,
        editor: vscode.TextEditor,
        useOffset: boolean
    ): vscode.Range {
        const semanticTokensProvider = this.semanticTokensProvider;
        if (!semanticTokensProvider) return range;

        const newLineShift = editor.document.lineCount - semanticTokensProvider.previousLineCount;
        const modifiedText = editor.document.getText(modifiedRange);

        const columnShift = modifiedText.split('\n').reduce((maxShift, line) => {
            const leadingWhitespace = line.match(/^\s+/)?.[0]?.length || 0;
            return Math.max(maxShift, leadingWhitespace);
        }, 0);

        // semanticTokensProvider.previousLineCount = editor.document.lineCount;

        // Detect changes occurring after or overlapping the range
        const shouldShift =
            modifiedRange.start.line < range.start.line || // New line added after
            (modifiedRange.start.line === range.start.line && modifiedRange.start.character <= range.start.character);
        //console.log("Shifting lines? - " + shouldShift)
        /* console.log("Modified Range: " + modifiedRange.start.line)
        console.log("Original Range: " + range.start.line) */
        const lineOffset = useOffset ? 0 : -1;

        return new vscode.Range(
            new vscode.Position(
                Math.max(0, range.start.line + (shouldShift ? newLineShift : 0) + lineOffset),
                shouldShift
                    ? Math.max(0, range.start.character + columnShift)
                    : range.start.character
            ),
            new vscode.Position(
                Math.max(0, range.end.line + (shouldShift ? newLineShift : 0) + lineOffset),
                shouldShift
                    ? Math.max(0, range.end.character + columnShift)
                    : range.end.character
            )
        );
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
        builder: vscode.SemanticTokensBuilder, variableParameter: VariableParameter | null = null): void {
        //console.log("PropertyDeclaration: " + node.type + ", " + node.text)
        const valueNodes = this.findChildren(node, expressionTypes, "property_declaration");

        const variables = variableParameter == VariableParameter.LAMBDA_PARAMETERS ? this.extractLambdaParams(node) :
            variableParameter == VariableParameter.FUNCTION_VALUE_PARAMETERS ? this.extractFunctionValueParams(node) :
                variableParameter == VariableParameter.CATCH_BLOCK ? this.extractCatchBlockParams(node) : this.extractVariables(node);
        if (valueNodes.length > 0) {
            valueNodes.forEach(valueNode => {
                if (!this.isValueInDeclaration(valueNode)) return;
                variables.forEach((range, variableNode) => {
                    if (variableNode.variable?.parent?.type != "lambda_parameters")
                        this.processVariableDeclaration(variableNode, valueNode, range, builder)
                });
            });
        } else {
            variables.forEach((range, variableNode) => {
                this.processVariableDeclaration(variableNode, null, range, builder);
            })
        }

    }
    public extractCatchBlockParams(node: SyntaxNode): Map<VariableNode, vscode.Range> {
        const variables: Map<VariableNode, vscode.Range> = new Map();

        const declarationNodes = this.findChildren(node, ["simple_identifier"]);
        declarationNodes.forEach(variable => {
            const variableNode = this.extractVariableNode(variable);
            if (variableNode && variableNode.variable) {
                variables.set(variableNode, this.supplyRange(variableNode.variable));
            }
        });
        return variables;
    }
    public extractFunctionValueParams(node: SyntaxNode): Map<VariableNode, vscode.Range> {
        const variables: Map<VariableNode, vscode.Range> = new Map();

        const declarationNodes = this.findChildren(node, ["parameter"]);
        declarationNodes.forEach(variable => {
            const variableNode = this.extractVariableNode(variable);
            if (variableNode && variableNode.variable) {
                variables.set(variableNode, this.supplyRange(variableNode.variable));
            }
        });
        return variables;
    }
    public extractLambdaParams(node: SyntaxNode): Map<VariableNode, vscode.Range> {
        const variables: Map<VariableNode, vscode.Range> = new Map();

        const declarationNodes = this.findChildren(node, variableDeclarationTypes);
        declarationNodes.forEach(declaration => {
            const variableNodes = declaration.type === "multi_variable_declaration"
                ? this.findChildren(declaration, ["variable_declaration"])
                : [declaration];

            variableNodes.forEach(variable => {
                const variableNode = this.extractVariableNode(variable);
                if (variableNode && variableNode.variable) {
                    variables.set(variableNode, this.supplyRange(variableNode.variable));
                }
            });
        });

        return variables;
    }
    public extractVariables(node: SyntaxNode): Map<VariableNode, vscode.Range> {
        const variables: Map<VariableNode, vscode.Range> = new Map();

        const declarationNodes = this.findChildren(node, variableDeclarationTypes);
        declarationNodes.forEach(declaration => {
            const variableNodes = declaration.type === "multi_variable_declaration"
                ? this.findChildren(declaration, ["variable_declaration"])
                : [declaration];

            variableNodes.forEach(variable => {
                const variableNode = this.extractVariableNode(variable);
                if (variableNode && variableNode.variable) {
                    variables.set(variableNode, this.supplyRange(variableNode.variable));
                }
            });
        });

        return variables;
    }
    public extractVariableNode(declaration: SyntaxNode): VariableNode {
        const node = declaration.firstChild
        const isFunctionVariable = getNamedSiblings(node, true).some(sib => sib.type == "function_type")
        const funcVariable = isFunctionVariable ? this.findChild(node?.parent, "function_type", "variable_declaration") : node;
        const userTypeNode = declaration.parent?.type == "catch_block" ? this.findChild(declaration.parent, "user_type") : this.findChild(declaration, "user_type");
        const userType = this.findChild(funcVariable, "user_type", "function_type") ?? userTypeNode;
        let dec = userType && declaration.firstChild ? declaration.firstChild : declaration;
        let newnode = new VariableNode(dec, userType, this)
        //log("user type: " + userType + " of variable: " + dec.text)
        return newnode
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
        return (
            node.type == "init" ||
            node.type == "->" ||
            // node.type == "!!" ||
            node.type == "is" ||
            // node.type == "?:" ||
            node.type == "in" ||
            node.type == "companion" && node.parent?.type == "companion_object" ||
            (node.type == "simple_identifier" &&
                typingSuggestions.some(suggestion => node.text == suggestion.simpleName) &&
                node.parent?.type == "infix_expression") ||
            ((node.type == "as" || node.type == "as?") && node.parent?.type == "as_expression") ||
            // (node.type == "?" && node.parent?.type == "nullable_type") ||
            // (node.type == "?." && node.parent?.type == "navigation_suffix") ||
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
        /* if (node.type == "try_expression" && node.firstChild && node.firstChild.type == "{") {
            return true
        } */
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
    public findLastChildInRange(
        node: SyntaxNode,
        type: string,
        expectedParent: string | null = null,
        range: vscode.Range
    ): SyntaxNode | null {
        let lastFound: SyntaxNode | null = null;

        for (const child of node.children) {
            if (child.type === type) {
                if (!expectedParent || (child.parent && child.parent.type === expectedParent)) {
                    if (this.semanticTokensProvider?.rangesIntersect(range, this.supplyRange(child))) {
                        lastFound = child; // Update to the latest found child
                    }
                }
            }

            const found = this.findLastChildInRange(child, type, expectedParent, range);
            if (found) {
                lastFound = found; // Continue updating to the latest found child
            }
        }

        return lastFound;
    }

    public findChildInRange(
        node: SyntaxNode,
        type: string,
        expectedParent: string | null = null,
        range: vscode.Range
    ): SyntaxNode | null {
        for (const child of node.children) {
            if (child.type === type) {
                if (!expectedParent || (child.parent && child.parent.type === expectedParent)) {
                    if (this.semanticTokensProvider?.rangesIntersect(range, this.supplyRange(child))) {
                        return child;
                    }
                }
            }
            const found = this.findChildInRange(child, type, expectedParent, range);
            if (found) {
                return found;
            }
        }
        return null;
    }
    public findChildInRangeFromList(
        node: SyntaxNode,
        types: string[],
        expectedParents: string[] | null = null,
        range: vscode.Range,
        startPositionCheck: boolean = false
    ): SyntaxNode | null {
        for (const child of node.children) {
            if (types.includes(child.type)) {
                if (
                    !expectedParents ||
                    (child.parent && expectedParents.includes(child.parent.type))
                ) {
                    const currentRange = this.supplyRange(child);
                    const hasMatchingStart = startPositionCheck && this.positionsEqual(range.start, currentRange.start);
                    const hasIntersection = this.semanticTokensProvider?.rangesIntersect(range, currentRange);
                    if (hasMatchingStart || hasIntersection) {
                        return child;
                    }
                }
            }
            const found = this.findChildInRangeFromList(child, types, expectedParents, range, startPositionCheck);
            if (found) {
                return found;
            }
        }
        return null;
    }


    public findChild(node: SyntaxNode | null | undefined, type: string, expectedParent: string | null = null): SyntaxNode | null {
        if (!node) return null;
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
    public findParentNoRange(node: TSParser.SyntaxNode | null, type: string): TSParser.SyntaxNode | null {
        let currentNode = node;
        while (currentNode) {
            if (currentNode.type === type) {
                if (this.semanticTokensProvider)
                    return currentNode;
            }
            currentNode = currentNode.parent;
        }

        return null;
    }
    public findParentFromList(
        node: TSParser.SyntaxNode | null,
        types: string[],
        range: vscode.Range,
        startPositionCheck: boolean = false
    ): TSParser.SyntaxNode | null {
        let currentNode = node;
        while (currentNode) {
            if (types.includes(currentNode.type)) {
                if (this.semanticTokensProvider) {
                    let currentRange = this.supplyRange(currentNode)
                    const hasMatchingStart = startPositionCheck && this.positionsEqual(range.start, currentRange.start);
                    const hasIntersection = this.semanticTokensProvider.rangesIntersect(range, currentRange);
                    if (hasMatchingStart || hasIntersection) {
                        return currentNode;
                    }
                }
            }
            currentNode = currentNode.parent;
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
        let editor = currentEditor(this.document);
        const uri = editor?.document.uri;
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
    public static addError(document: vscode.TextDocument, range: vscode.Range, message: string, errorText: string, severity: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Error) {
        let editor = currentEditor(document);
        if (editor) {
            const documentUri = editor.document.uri.toString();
            const data = documentData.get(documentUri);
            if (data) {
                const treeProvider = data.semanticTokensProvider?.treeProvider
                if (!treeProvider) return
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
        variableNode: VariableNode,
        valueNode: TSParser.SyntaxNode | null,
        range: vscode.Range,
        builder: vscode.SemanticTokensBuilder,
        isParamVar: boolean = false
    ): void {
        const identifierNode = variableNode.variable
        const typeNode = variableNode.kotlinType
        const variableName = identifierNode.text;
        const rangeMode = this.semanticTokensProvider?.rangeMode;
        var scope = this.semanticTokensProvider?.currentScopeFromRange(range) ?? this.currentScope;
        /* log("Variable:" + variableName + ", CurrentScopeFromRange: " + this.semanticTokensProvider?.currentScopeFromRange(range)?.id)
        log("Variable: " + variableName + ", Current Scope: " + this.currentScope?.id) */
        if (!scope) return;
        let varKey = `${variableName}@${scope.id}@${this.getRangeKey(range)}`;
        if (reservedCharacters.includes(variableName)) {
            if (variableName == "_" && ["lambda_parameters", "multi_variable_declaration"].includes(identifierNode.parent?.type ?? "")) {
                builder.push(range, "enumMember");
                return;
            } else {
                const errorMessage = `Cannot define reserved identifier: '${variableName}'`;
                TreeProvider.addError(this.document, range, errorMessage, variableName);
                return;
            }
        }
        const existingVars = Array.from(scope.variables.values()).filter(v => v.name === variableName);
        const isExactDuplicate = existingVars.some(v => v.varKey === varKey);
        if (existingVars.length > 0 && !isExactDuplicate && identifierNode.parent?.type != "lambda_parameters") {
            const errorMessage = `Variable "${variableName}" is already defined in the current scope.`;
            TreeProvider.addError(this.document, range, errorMessage, variableName, vscode.DiagnosticSeverity.Error);
            builder.push(range, "enumMember");
            return;
        }
        const typedType = getImportFromClassOrPath(typeNode?.classPath ?? "", this)
        const variableSymbol = new VariableSymbol(
            variableName,
            typeNode ? (typedType ?? typeNode.classPath) : null,
            range,
            identifierNode,
            valueNode ? valueNode.text : "",
            scope,
            varKey,
            isParamVar
        );
        scope.define(variableSymbol);
        builder.push(range, "enumMember");
    }


    public processImportDeclaration(node: TSParser.SyntaxNode, range: vscode.Range) {
        const importName = node.text.replace(/\s+/g, '').trim();
        if (!this.imports.has(importName)) {
            this.imports.set(importName, new ImportSymbol(importName, range, node));
        }
    }

    getscopedVariables(scope: Scope): Map<string, VariableSymbol> {
        return scope.variables;
    }
    getimports(): Map<string, ImportSymbol> {
        return this.imports;
    }
    enterScope(parentScope: Scope, startRange: vscode.Position | null, endRange: vscode.Position | null = null, paramScope: boolean = false): void {
        if (!parentScope) {
            throw new Error("Parent scope is required to enter a new scope.");
        }

        const depth = parentScope.depth + 1;
        const id = `${startRange?.line}:${startRange?.character}:${depth}`;


        let existingScope = this.scopes.get(id);
        if (existingScope) {
            if (endRange)
                existingScope.setEndPoint(endRange)
            this.currentScope.childScopeId = existingScope.id
            this.currentScope = existingScope;
            return;
        }

        const newScope = new Scope(parentScope, startRange);
        if (endRange)
            newScope.setEndPoint(endRange)
        this.scopes.set(id, newScope);
        this.currentScope.childScopeId = newScope.id
        this.currentScope = newScope;
    }

    exitScope(node: SyntaxNode): void {
        //logNode(node, "exitScope")
        let parentScope = this.currentScope.parentScope
        if (!parentScope) {
            TreeProvider.addError(this.document, this.supplyRange(node), "Cannot exit global scope", node.text)
            return;
        }
        this.currentScope.setEndPoint(this.supplyRange(node).end)
        if (this.currentScope.childScopeId != null) {
            let childScope = this.scopes.get(this.currentScope.childScopeId)
            if (childScope) {
                this.currentScope = childScope
            }
        }
        this.currentScope = parentScope
        //log("Entering parent scope: " + this.currentScope.id)
    }
    public rangeToString(range: vscode.Range | undefined): string {
        if (!range) return "undefined"
        return `${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}`;
    }
    public positionsEqual(pos1: vscode.Position, pos2: vscode.Position): boolean {
        return pos1.line === pos2.line && pos1.character === pos2.character;
    }
    public traverseBrackets(node: TSParser.SyntaxNode) {
        let editor = currentEditor(this.document);
        if (!editor) return;

        let green: vscode.Range[] = [];
        let blue: vscode.Range[] = [];
        let purple: vscode.Range[] = [];

        let stack: { range: vscode.Range, depth: number }[] = [];
        let depth = 0;

        const traverse = (node: TSParser.SyntaxNode) => {
            let range = this.supplyRange(node);
            let openingBracket = node.type === "{" && node.text === "{";
            let closingBracket = node.type === "}" && node.text === "}";

            if (openingBracket) {

                stack.push({ range, depth });
                depth++;
            } else if (closingBracket) {
                if (stack.length > 0) {
                    let matchedBracket = stack.pop();
                    depth--;
                    let colorIndex = matchedBracket!.depth % 3; // Ensures color cycling

                    if (colorIndex === 0) green.push(matchedBracket!.range);
                    else if (colorIndex === 1) blue.push(matchedBracket!.range);
                    else purple.push(matchedBracket!.range);

                    // Match closing bracket with same color
                    if (colorIndex === 0) green.push(range);
                    else if (colorIndex === 1) blue.push(range);
                    else purple.push(range);
                }
            }

            node.children.forEach(child => traverse(child));
        };

        traverse(node);

        editor.setDecorations(DelimiterDecorationType, green);
        editor.setDecorations(DefaultBlueDecorationType, blue);
        editor.setDecorations(OtherDecorationType, purple);
    }

}