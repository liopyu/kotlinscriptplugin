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
    public duplicateVars: Map<string, VariableSymbol> = new Map()
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
        const uri = vscode.window.activeTextEditor?.document.uri;
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
    public validateVariables(tree: TSParser.Tree, modifiedRange: vscode.Range): void {
        const variablesToRemove: string[] = [];
        const modifiedVariables: Map<string, VariableSymbol> = new Map()
        //console.log("Starting variable validation...");

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            console.log("No active editor detected. Skipping variable validation.");
            return;
        }

        /*  for (const [variableName, variableSymbol] of this.duplicateVars) {
             const originalRange = this.supplyRange(variableSymbol.node);
             const isStillDuplicate = variableSymbol.scope.countVariablesByName(variableName)
             console.log(isStillDuplicate)
             let supposedText = editor.document.getText(originalRange);
             if (variableName !== supposedText) {
                 console.log(`→ Removing stale duplicate variable: ${variableName}`);
                 this.duplicateVars.delete(variableName);
             }
         } */

        for (let [variableKey, variableSymbol] of this.scopedVariables.entries()) {
            const [variableName, scopeId, rangeKey] = variableKey.split("@");
            const expectedRange = variableSymbol.range;

            const adjustedExpectedRange = this.adjustRangeForShifts(expectedRange, modifiedRange, vscode.window.activeTextEditor!, true);

            /*   console.log(`Checking scoped variable '${variableName}'`);
              console.log(`→ Original Range: ${expectedRange.start.line}:${expectedRange.start.character} - ${expectedRange.end.line}:${expectedRange.end.character}`);
              console.log(`→ Adjusted Range: ${adjustedExpectedRange.start.line}:${adjustedExpectedRange.start.character} - ${adjustedExpectedRange.end.line}:${adjustedExpectedRange.end.character}`);
   */
            const desc = tree.rootNode.descendantForPosition({
                row: adjustedExpectedRange.start.line,
                column: adjustedExpectedRange.start.character,
            });
            const node = this.findParent(desc, "variable_declaration", adjustedExpectedRange)
            if (!node) {
                // console.log(`→ Removing stale scoped variable (no matching node): ${variableKey}`);
                variablesToRemove.push(variableKey);
                continue;
            }
            let supposedText = editor.document.getText(this.supplyRange(desc));
            /* console.log(`→ Found text: "${supposedText.trim()}"`);
            console.log(`→ Expected text: "${variableName.trim()}"`); */

            if (supposedText !== variableName) {
                // console.log(`→ Removing stale scoped variable (text mismatch): ${variableKey}`);
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
                /* this.scopedVariables.delete(variableKey);
                this.scopedVariables.set(newVarKey, variableSymbol); */
                variableSymbol.scope.undefine(variableSymbol);
                variableSymbol.varKey = newVarKey;
                variableSymbol.scope.define(variableSymbol);
                //console.log(`→ Updating range for variable: ${variableKey} to ${newVarKey}`);
                //variableKey = newVarKey;
                modifiedVariables.set(newVarKey, variableSymbol)
                continue;
            }
        }

        for (const variableKey of variablesToRemove) {
            const symbol = this.scopedVariables.get(variableKey);
            if (symbol) {
                symbol.scope.undefine(symbol);
                //console.log(`→ Final removal of variable: ${variableKey}`);
                this.scopedVariables.delete(variableKey);

                // Collect variables to add
                for (const [key, variable] of symbol.scope.variables) {
                    if (!this.scopedVariables.has(key)) {
                        modifiedVariables.set(key, variable);
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
        useOffset: boolean // New parameter to control offset logic
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
            const errorMessage = `Variable "${variableName}" is already defined in the current scope.`;
            TreeProvider.addError(range, errorMessage, variableName, vscode.DiagnosticSeverity.Error);
            builder.push(range, "enumMember");
            /* const duplicateVariableSymbol = new VariableSymbol(
                variableName,
                range,
                identifierNode,
                variableNode ? variableNode.text : "",
                scope,
                varKey,
                isParamVar
            );
            scope.define(duplicateVariableSymbol);
            this.duplicateVars.set(variableName, duplicateVariableSymbol) */
            return;
        }
        /*  } */
        /* this.duplicateVars.forEach((symbol, key) => console.log(key))
        if (this.duplicateVars.has(variableName)) {
            this.duplicateVars.delete(variableName)
        } */
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
        let parentScope = this.currentScope.parentScope
        if (!parentScope) {
            TreeProvider.addError(this.supplyRange(node), "Cannot exit global scope", node.text)
            return;
        }
        if (this.currentScope.childScopeId != null) {
            let childScope = this.scopes.get(this.currentScope.childScopeId)
            if (childScope) {
                this.currentScope = childScope
            }
        }
        this.currentScope = parentScope
    }
    public rangeToString(range: vscode.Range | undefined): string {
        if (!range) return "undefined"
        return `${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}`;
    }
    public positionsEqual(pos1: vscode.Position, pos2: vscode.Position): boolean {
        return pos1.line === pos2.line && pos1.character === pos2.character;
    }
    public traverseBrackets(node: TSParser.SyntaxNode) {
        let editor = vscode.window.activeTextEditor;
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