import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as utils from './utils'
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
    documentData,
    semanticTokensEnabled
} from './constants'

import { TreeProvider } from './treeprovider'
import { TypingSuggestionProvider } from './suggestionprovider';
import { typingSuggestions } from './extension';
import { log, warn, error } from './extension';
import { console } from './extension'

export class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    public readonly highlightQuery: TSParser.Query;
    public readonly treeProvider: TreeProvider;
    private globalScope: Scope | undefined
    private tempInterpolatedRanges: vscode.Range[] = [];
    public errorType: vscode.Range[] = []
    private lastChangedRange: vscode.Range | null = null;
    private lastSemanticTokens: vscode.SemanticTokens | null = null;
    public lastSemanticTokensId: string | null = null;
    public init: boolean = false
    private lastDocumentText: string = ""
    public rangeMode: RangeMode = RangeMode.FULL
    public previousLineCount: number = 0
    public reEvaluationRange: vscode.Range | null = null
    constructor(treeProvider: TreeProvider, highlightQuery: TSParser.Query) {
        this.treeProvider = treeProvider;
        this.highlightQuery = highlightQuery;
        this.globalScope = this.treeProvider.scopes.get("0:0:0")
        console.log("Semantic Tokens Provider Initialized")
    }

    updateTokens() {
        const tree = this.treeProvider.tree;
        const builder = new vscode.SemanticTokensBuilder(LEGEND);
        let editor = vscode.window.activeTextEditor;
        if (!tree || !editor) {
            console.log("Either No tree or no editor")
            return builder.build();
        }

        let lastText = editor.document.getText()
        if (this.lastSemanticTokens && lastText === this.lastDocumentText) {
            console.log("document has not changed")
            return this.lastSemanticTokens;
        }

        this.lastDocumentText = lastText
        let globalScopeRange = new vscode.Range(
            new vscode.Position(0, 0),
            editor.document.lineAt(editor.document.lineCount - 1).range.end
        );
        const matches = this.highlightQuery.matches(tree.rootNode);
        this.treeProvider.updateTokens();

        this.tempInterpolatedRanges = [];
        this.errorType = [];

        const modifiedRange = this.lastChangedRange ?? globalScopeRange;
        let modifiedNode = tree.rootNode.descendantForPosition({
            row: modifiedRange.start.line,
            column: modifiedRange.start.character,
        });
        while (
            modifiedNode.parent &&
            modifiedNode.parent.type !== "source_file"
        ) {
            const nodeRange = this.treeProvider.supplyRange(modifiedNode.parent);
            const minLine = modifiedRange.start.line - 20;
            const maxLine = modifiedRange.start.line + 20;
            if (
                nodeRange.start.line <= modifiedRange.start.line &&
                nodeRange.end.line >= modifiedRange.end.line &&
                nodeRange.start.line >= minLine &&
                nodeRange.end.line <= maxLine
            ) {
                modifiedNode = modifiedNode.parent;
                break;
            }
            modifiedNode = modifiedNode.parent;
        }

        /* if (modifiedNode.parent && modifiedNode.parent.type != "source_file") {
            modifiedNode = modifiedNode.parent
        } */

        let modifiedNodeRange = this.treeProvider.supplyRange(modifiedNode)
        if (modifiedNode.type === "source_file") {
            const document = editor.document;
            if (!document) return;
            const totalLines = document.lineCount;
            const expandedStartLine = Math.max(0, modifiedRange.start.line - 20);
            const expandedEndLine = Math.min(totalLines - 1, modifiedRange.end.line + 5);
            modifiedNodeRange = new vscode.Range(
                new vscode.Position(expandedStartLine, 0),
                new vscode.Position(expandedEndLine, document.lineAt(expandedEndLine).range.end.character)
            );
        }

        console.log("Modifying node: " + modifiedNode.type + ", Range: " + this.treeProvider.rangeToString(modifiedNodeRange))
        let verifiedScopes: string[] = []
        this.traverseTree(tree.rootNode, builder, verifiedScopes);

        this.treeProvider.scopes = new Map(
            [...this.treeProvider.scopes].filter(([key]) => verifiedScopes.includes(key))
        );
        const parentScopeRange = this.findClosestParentScopeRange(modifiedRange) ?? globalScopeRange;
        if (this.treeProvider.tree) {
            this.treeProvider.validateImports(this.treeProvider.tree);
            this.treeProvider.validateVariables(this.treeProvider.tree, modifiedRange);
        }
        let filterRanges = true;
        console.log("updating tokens")
        const l: vscode.Range[] = []
        const m: vscode.Range[] = []
        // l.push(parentScopeRange)
        //l.push(modifiedNodeRange)
        //if (this.reEvaluationRange) m.push(this.reEvaluationRange)
        matches.forEach((match, matchIndex) => {
            match.captures.forEach((capture, captureIndex) => {
                const node = capture.node;
                let range = this.treeProvider.supplyRange(node);
                console.log("Node Type: " + node.type + ", text: " + node.text)
                this.handleErrorNodes(node);
                this.handleMissingNodes(node);
                if (!this.init || (this.init && !filterRanges)) {
                    this.rangeMode = RangeMode.FULL;
                    this.setCurrentScope(node, range)
                    this.processTokens(capture, builder, range);
                } else if (filterRanges && ((this.rangesIntersect(modifiedNodeRange, range) || this.rangesIntersect(modifiedRange, range)))) {
                    // l.push(range)
                    this.handleCallExpression(node, builder);
                    this.rangeMode = RangeMode.EDIT;
                    this.setCurrentScope(node, range)
                    this.processTokens(capture, builder, range);
                } else if ((this.reEvaluationRange && this.rangesIntersect(this.reEvaluationRange, range))) {
                    this.rangeMode = RangeMode.REPROCESSING
                    this.handleCallExpression(node, builder);
                    this.setCurrentScope(node, range)
                    this.processTokens(capture, builder, range);
                }
            });
        });

        const existingTokens = this.decodeSemanticTokens(this.lastSemanticTokens);
        const currentTokens = this.decodeSemanticTokens(builder.build());
        const newLineShift = editor.document.lineCount - this.previousLineCount;
        existingTokens.forEach(token => {
            let range = token.range;
            if (range.start.line >= modifiedRange.end.line) {
                token.range = new vscode.Range(
                    new vscode.Position(
                        Math.max(0, range.start.line + newLineShift),
                        range.start.character
                    ),
                    new vscode.Position(
                        Math.max(0, range.end.line + newLineShift),
                        range.end.character
                    )
                );
            }
            if (this.reEvaluationRange && !this.rangesIntersect(this.reEvaluationRange, range)) {
                builder.push(token.range, LEGEND.tokenTypes[token.tokenType] || "variable");
            } else {

            }
        });


        editor.setDecorations(DelimiterDecorationType, l)
        editor.setDecorations(OtherDecorationType, m)

        this.treeProvider.validateDiagnostics()

        this.lastSemanticTokens = builder.build();
        this.init = true
        this.previousLineCount = editor.document.lineCount;
        console.log("Scope count: " + this.treeProvider.scopes.size)
        this.reEvaluationRange = modifiedNodeRange
        return this.lastSemanticTokens;
    }

    public setCurrentScope(node: TSParser.SyntaxNode, range: vscode.Range) {
        console.log(this.rangeMode)
        if (node.type == "{" && node.text == "{") {
            let startPoint = range.start
            let storedScopeId = this.treeProvider.currentScope ? `${startPoint?.line}:${startPoint?.character}:` + (this.treeProvider.currentScope.depth + 1) : `0:0:0`
            let storedScope = this.treeProvider.scopes.get(storedScopeId)
            if (storedScope) {
                console.log("found stored scope: " + storedScopeId)
                this.treeProvider.currentScope = storedScope
            } else {
                console.log([...this.treeProvider.scopes.values()].map(scope => scope.id).join(', '));
                console.log("Did not find existing scope: " + storedScopeId + " for range: " + this.treeProvider.rangeToString(range) + ", defaulting to scope: " + this.currentScopeFromRange(range)?.id)
                //if (this.init)
                this.treeProvider.currentScope = this.currentScopeFromRange(range) ?? this.treeProvider.currentScope
                // console.log("Setting current scope to: " + this.treeProvider.currentScope.id)
            }
        } else if ((node.text == "}" && node.type == "}")) {
            if (this.rangeMode != RangeMode.REPROCESSING) {
                this.treeProvider.exitScope(node);
            }
        }
    }
    public isUpdating: boolean = false
    provideDocumentSemanticTokens(): vscode.ProviderResult<vscode.SemanticTokens> {
        // console.log("updating tokens from provider")
        return this.updateTokens();
    }

    private processTokens(capture: QueryCapture, builder: vscode.SemanticTokensBuilder, range: vscode.Range, reProcessing: boolean = false) {
        const node = capture.node;
        let originalStartCheck = (newNode: TSParser.SyntaxNode, s: string) => ((newNode.text == s && newNode.type == s))

       /*  if (node.type == "{" && node.text == "{") {
            let startPoint = range.start
            let storedScopeId = this.treeProvider.currentScope ? `${startPoint?.line}:${startPoint?.character}:` + (this.treeProvider.currentScope.depth + 1) : `0:0:0`
            let storedScope = this.treeProvider.scopes.get(storedScopeId)
            if (storedScope) {
                console.log("found stored scope: " + storedScopeId)
                this.treeProvider.currentScope = storedScope
            } else {
                console.log("Did not find existing scope: " + storedScopeId)
                this.treeProvider.currentScope = this.currentScopeFromRange(range) ?? this.treeProvider.currentScope
                console.log("Setting current scope to: " + this.treeProvider.currentScope.id)
            }
        } else if ((node.text == "}" && node.type == "}")) {
            if (reProcessing) {
            } else {
                this.treeProvider.exitScope(node);
            }
        } else */ if (node.type == "->") {
            /* console.log("Node Type: " + node.type + ", Node Text: " + node.text)
            log('Parent Node text: ' + node.parent?.text + ", Parent node type: " + node.parent?.type) */
            /*  let lambdaLiteral = node.parent
             const paramNames: string[] = []
             if (lambdaLiteral) {
                 let params = this.treeProvider.findChild(lambdaLiteral, "lambda_parameters")
                 if (params) {
                     let lambdaScopeRange = this.treeProvider.supplyRange(params)
                     //console.log("Params: " + params.text)
                     const variables = this.treeProvider.extractVariables(params);
                     this.treeProvider.enterScope(this.treeProvider.currentScope, lambdaScopeRange.start)
                     variables.forEach((range, variableNode) => {
                         if (paramNames.includes(variableNode.text)) {
                             TreeProvider.addError(range, `Duplicate parameter name: '${variableNode.text}'`, variableNode.text);
                         } else {
                             this.treeProvider.processVariableDeclaration(variableNode, null, range, builder, true);
                             paramNames.push(variableNode.text);
                         }
 
                     })
                     this.treeProvider.exitScope(params, null, true)
                 }
             } */
        } else if (capture.node.type == "import") {
            const parent = this.treeProvider.findParent(capture.node, "import_header", range)
            if (parent) {
                this.treeProvider.processImportDeclarations(parent);
                const importNode = this.treeProvider.findChild(parent, "identifier")
                if (importNode) {
                    importNode.children.forEach(id => {
                        if (id.text != ".")
                            builder.push(this.treeProvider.supplyRange(id), "type")
                    })
                }
            }
        } else if (this.treeProvider.isSpecialHandleWord(capture.node)) {
            builder.push(this.treeProvider.supplyRange(capture.node), "keyword")
        } else if (node.type == "string_literal") {
            var c1 = this.treeProvider.findChildren(node, ["${"])
            var c2 = this.treeProvider.findChildren(node, ["$"])
            var c3 = this.treeProvider.findChildren(node, ["}"])
            var c4 = this.treeProvider.findChildren(node, ["interpolated_identifier"])
            var c5 = this.treeProvider.findChildren(node, ["interpolated_expression"])
            c1.forEach(c => {
                builder.push(this.treeProvider.supplyRange(c), "keyword")
                this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c))
            })
            c2.forEach(c => {
                builder.push(this.treeProvider.supplyRange(c), "keyword")
                this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c))
            })
            c3.forEach(c => {
                builder.push(this.treeProvider.supplyRange(c), "keyword")
                this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c))
            })
            c4.forEach(c => {
                var resolvedVariable = this.treeProvider.currentScope.hasVariableInScopeChain(c.text)
                if (resolvedVariable) {
                    this.handleSimpleIdentifier(c, builder, true)
                }
                this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c))
            })
            c5.forEach(c => {
                const range = this.treeProvider.supplyRange(c);
                const nestedStrings = this.treeProvider.findChildren(c, ["string_literal"]);
                nestedStrings.forEach(nestedString => {
                    const nestedRange = this.treeProvider.supplyRange(nestedString);
                    this.tempInterpolatedRanges.push(nestedRange);
                });
                this.tempInterpolatedRanges.push(range);
            });
        }/*  else if (node.parent?.parent?.type == "lambda_parameters") {
            var grand = node.parent?.parent
            if (grand) {
                const variables = this.treeProvider.extractVariables(grand);
                variables.forEach((range, variableNode) => {
                    this.treeProvider.processVariableDeclaration(variableNode, null, range, builder);
                })
            }
        } */ else if (capture.name == "repeat") {
            var n = this.treeProvider.findParent(node, "for_statement", range)
            if (n) {
                const variables = this.treeProvider.extractVariables(n);
                variables.forEach((range, variableNode) => {
                    this.treeProvider.processVariableDeclaration(variableNode, null, range, builder);
                })
            }
        }
        this.processTokenType(capture, range, builder);
    }

    public rangesIntersect(range1: vscode.Range, range2: vscode.Range): boolean {
        const intersects =
            range1.start.isBeforeOrEqual(range2.end) &&
            range1.end.isAfterOrEqual(range2.start);
        return intersects;
    }

    public getScopeRange(scope: Scope): vscode.Range | null {
        if (!scope || !scope.startPoint || !scope.endPoint) {
            return null;
        }
        const range = new vscode.Range(scope.startPoint, scope.endPoint);
        return range;
    }
    /*  private findClosestParentScopeRange(modifiedRange: vscode.Range): vscode.Range | undefined {
         let currentScope: vscode.Range | undefined;
         this.treeProvider.scopes.forEach((scope) => {
             if (scope?.startPoint && scope?.endPoint) {
                 let scopeRange = new vscode.Range(scope.startPoint, scope.endPoint);
                 if (
                     scopeRange.start.isBeforeOrEqual(modifiedRange.start) &&
                     scopeRange.end.isAfterOrEqual(modifiedRange.end)
                 ) {
                     if (!currentScope || scopeRange.start.isAfter(currentScope.start)) {
                         currentScope = scopeRange;
                     }
                 }
             }
         });
         return currentScope;
     } */


    public findClosestParentScopeRange(range: vscode.Range): vscode.Range | null {
        let innermostScope: Scope | null = this.findInnermostScope(range);
        if (!innermostScope) {
            return null;
        }
        let currentScope: Scope | null = innermostScope;
        let closestValidScope: Scope | null = null;

        while (currentScope) {
            if (currentScope.startPoint && currentScope.endPoint) {
                const scopeRange = new vscode.Range(currentScope.startPoint, currentScope.endPoint)

                if (scopeRange.start.isBefore(range.start) && scopeRange.end.isAfter(range.end)) {
                    closestValidScope = currentScope;
                    break;
                }
            }

            currentScope = currentScope.parentScope;
        }

        if (closestValidScope) {
            const finalRange = this.getScopeRange(closestValidScope);
            return finalRange;
        }

        return null;
    }
    /*  public currentScopeFromRange(modifiedRange: vscode.Range): Scope | undefined {
         let currentScope: Scope | undefined;
 
         this.treeProvider.scopes.forEach((scope) => {
             if (scope?.startPoint && scope?.endPoint) {
                 let scopeRange = new vscode.Range(scope.startPoint, scope.endPoint);
 
                 if (
                     scopeRange.start.isBeforeOrEqual(modifiedRange.start) &&
                     scopeRange.end.isAfterOrEqual(modifiedRange.end)
                 ) {
                     if (!currentScope || (currentScope.startPoint && scopeRange.start.isAfter(currentScope.startPoint))) {
                         currentScope = scope;
                     }
                 }
             }
         });
 
         return currentScope;
     } */

    public currentScopeFromRange(range: vscode.Range): Scope | null | undefined {
        let scope: Scope | null | undefined = this.findInnermostScope(range) || this.globalScope;

        while (scope && scope.parentScope) {
            const scopeRange = this.getScopeRange(scope);
            if (scopeRange?.start.isBefore(range.start) && scopeRange.end.isAfter(range.end)) {
                return scope;
            }
            scope = scope.parentScope;
        }

        return this.globalScope;
    }

    public findInnermostScope(range: vscode.Range): Scope | null {
        let innermostScope: Scope | null = null;
        for (const [, scope] of this.treeProvider.scopes) {
            if (scope.startPoint && scope.endPoint) {
                const scopeRange = new vscode.Range(scope.startPoint, scope.endPoint);

                if (this.rangesIntersect(scopeRange, range)) {
                    if (!innermostScope || this.compareScopeIds(scope.id, innermostScope.id) > 0) {
                        innermostScope = scope;
                    }
                }
            }
        }

        return innermostScope;
    }

    // Helper function to compare scope IDs numerically
    private compareScopeIds(id1: string, id2: string): number {
        const [line1, char1] = id1.split(':').map(Number);
        const [line2, char2] = id2.split(':').map(Number);

        if (line1 !== line2) return line1 - line2;
        return char1 - char2;
    }

    public processTokenType(capture: QueryCapture, range: vscode.Range, builder: vscode.SemanticTokensBuilder): void {
        let tokenType: string = '';
        let name = capture.name
        const node = capture.node
        //log("Capture: " + name + ', Node text: ' + node.text + ", node type: " + node.type)
        /*  log('Node text: ' + node.text + ", node type: " + node.type)
         log('Parent Node text: ' + node.parent?.text + ", Parent node type: " + node.parent?.type)
         log('Tokenized Node text: ' + node.parent?.child(0)?.text + ", Tokenized Node type: " + node.parent?.child(0)?.type) */
        switch (name) {
            case 'keyword.return':
            case 'namespace':
                if (node.firstChild) {
                    let newRange = this.treeProvider.supplyRange(node.firstChild)
                    builder.push(newRange, 'keyword')
                    break;
                }
            case 'variableIdentifier':
            case 'variable':

                if (node.parent?.type === "call_expression") {
                    const name = node.text;
                    const importEntry = [...this.treeProvider.imports.values()].find(
                        i => name === i.simpleName && !this.treeProvider.currentScope.hasVariableInScopeChain(name)
                    );
                    if (importEntry) {
                        builder.push(this.treeProvider.supplyRange(node), 'type');
                    }
                    builder.push(this.treeProvider.supplyRange(node), "function");
                    break;
                }
                this.handleSimpleIdentifier(node, builder);
                break;
            case 'property':
                const grandParent = node.parent?.parent;
                const greatGrandParent = grandParent?.parent;
                if (grandParent?.type === "navigation_expression") {
                    const normalizedText = grandParent.text.replace(/\s+/g, '').trim();
                    const splitNodes = this.treeProvider.findChildren(grandParent, ["simple_identifier"]);
                    const isUpperCase = /^[A-Z_0-9]+$/.test(grandParent.text) &&
                        !this.treeProvider.hasParent(grandParent, "import_list") &&
                        !/^(_|__|___)$/.test(node.text);
                    if (isUpperCase) {
                        tokenType = 'enumMember';
                        break;
                    }
                    for (const [key, i] of this.treeProvider.imports.entries()) {
                        const barePath = this.treeProvider.givePath(normalizedText, i.segmentCount);
                        if (barePath === key) {
                            builder.push(this.treeProvider.supplyRange(splitNodes[i.segmentCount - 1]), 'type');
                            break; // No need to continue iterating once a match is found
                        }
                    }
                } else if (greatGrandParent?.type === "call_expression") {
                    tokenType = 'method';
                } else {
                    tokenType = 'variable';
                }

                break;
            case 'constructor':
                if (capture?.node?.text === "constructor") {
                    tokenType = 'keyword';
                } else {
                    return
                }
                break;
            case 'variable.builtin':
            case 'keyword':

                if ((node.type === "var" || node.type === "val") &&
                    this.treeProvider.findParent(node, "property_declaration", range)) {
                    const pD = this.treeProvider.findParent(node, "property_declaration", range);
                    if (pD) {
                        const valNode = this.treeProvider.findChild(pD, "val");
                        if (!valNode || valNode.text === "val") {
                            this.treeProvider.processPropertyDeclaration(pD, builder);
                        }
                    }
                }
                tokenType = 'keyword';
                break;
            case 'function':
                const suggestion = typingSuggestions.find(suggestion =>
                    !suggestion.requiresImport && suggestion.simpleName === capture?.node?.text
                );
                if (!suggestion) {
                    tokenType = 'function';
                    return;
                }
                tokenType = suggestion.type === 'lambda' ? 'keyword' : 'type';
                break;
            case 'include':
            case 'exception':
            case 'keyword.function':
            case 'conditional':
            case 'attribute':
            case 'class':
            case 'enum_class':
            case 'repeat':
            case 'function.builtin':
                tokenType = 'keyword';
                break;
            case 'type':
            case 'type.builtin':
                tokenType = 'type';
                break;
            case 'function':
                tokenType = 'function';
                break;
            case 'string.escape':
            case 'character':
                tokenType = 'string';
                break;

            case 'parameter':
                if (this.treeProvider.findParent(node, "lambda_parameters", range)) {
                    tokenType = 'enumMember';
                    break
                }
                tokenType = 'parameter';
                break;
            case 'comment':
            case 'comment.multiline':
                tokenType = 'comment';
                break;
            case 'label':
                tokenType = 'label';
                break;

            case 'operator':
                tokenType = 'operator';
                break;

            case 'string.regex':
            case '_function':
                tokenType = 'regexp';
                break;

            case 'number':
            case 'float':
                tokenType = 'number';
                break;

            case 'punctuation.delimiter':
            case 'punctuation.bracket':
                tokenType = 'decorator';
                break;
            case 'constant':
                tokenType = 'enumMember';
                break;
            case 'boolean':
                tokenType = 'macro';
                break;
            case 'string':
                const stringRange = this.treeProvider.supplyRange(capture.node);
                const getExcludedRanges = (range: vscode.Range, exclusions: vscode.Range[]): vscode.Range[] => {
                    const result: vscode.Range[] = [];
                    let currentStart = range.start;
                    exclusions
                        .filter(exclusion =>
                            (exclusion.start.isAfterOrEqual(range.start) && exclusion.start.isBeforeOrEqual(range.end)) ||
                            (exclusion.end.isAfterOrEqual(range.start) && exclusion.end.isBeforeOrEqual(range.end)))
                        .sort((a, b) => a.start.compareTo(b.start))
                        .forEach(exclusion => {
                            if (currentStart.isBefore(exclusion.start)) {
                                result.push(new vscode.Range(currentStart, exclusion.start));
                            }
                            currentStart = exclusion.end.isAfter(currentStart) ? exclusion.end : currentStart;
                        });
                    if (currentStart.isBefore(range.end)) {
                        result.push(new vscode.Range(currentStart, range.end));
                    }

                    return result;
                };
                const nonOverlappingRanges = getExcludedRanges(stringRange, this.tempInterpolatedRanges);
                nonOverlappingRanges.forEach(nonOverlap => {
                    if (nonOverlap.start.line !== nonOverlap.end.line) {
                        for (let line = nonOverlap.start.line; line <= nonOverlap.end.line; line++) {
                            const startCharacter = line === nonOverlap.start.line ? nonOverlap.start.character : 0;
                            const endCharacter =
                                line === nonOverlap.end.line
                                    ? nonOverlap.end.character
                                    : capture.node.text.split('\n')[line - nonOverlap.start.line].length;

                            const singleLineRange = new vscode.Range(line, startCharacter, line, endCharacter);
                            builder.push(singleLineRange, 'string');
                        }
                    } else {
                        builder.push(nonOverlap, 'string');
                    }
                });
                this.tempInterpolatedRanges = [];
                break;
            case 'punctuation.special':
                break
            case 'none':
                tokenType = 'variable';
                break;
            case 'error':
                break
            default:
                console.error(`Unrecognized token name: "${name}" in range=[${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}]..`);
                tokenType = 'variable';
                return;
        }
        if (name === 'comment.multiline' /* && range.start.line !== range.end.line */) {
            for (let line = range.start.line; line <= range.end.line; line++) {
                const startCharacter = line === range.start.line ? range.start.character : 0;
                const lineText = this.getLineText(line);

                // NEW: Check for '*/' within the line
                const endOfCommentIndex = lineText.indexOf("*/");
                const effectiveEnd = endOfCommentIndex !== -1
                    ? endOfCommentIndex + 2  // Ensure '*/' is included
                    : lineText.length;

                const tagRegex = /(@\w+)/g;
                const bracketRegex = /\[([^\]]+)\]/g;
                let lastIndex = 0;
                let matches = [];
                let match;

                const docTags = [
                    "@param", "@throws", "@see", "@author", "@sample",
                    "@exception", "@since", "@suppress", "@return"
                ];

                while ((match = tagRegex.exec(lineText)) !== null) {
                    const matchStart = match.index - startCharacter;
                    const matchEnd = startCharacter + (matchStart + match[0].length);
                    const tagText = match[0];

                    if (!docTags.includes(tagText)) {
                        continue;
                    }

                    matches.push({ index: matchStart, type: 'keyword', length: match[0].length });

                    if (tagText === "@param") {
                        const paramMatch = /\s+(\w+)/.exec(lineText.slice(matchEnd));
                        if (paramMatch) {
                            const paramStart = matchEnd + paramMatch.index + paramMatch[0].indexOf(paramMatch[1]);
                            const paramLength = paramMatch[1].length;
                            matches.push({ index: paramStart, type: 'variable', length: paramLength });
                        }
                    }
                }

                while ((match = bracketRegex.exec(lineText)) !== null) {
                    const matchStart = match.index - startCharacter;
                    const matchEnd = matchStart + match[0].length;

                    matches.push({ index: matchStart, type: 'decorator', length: 1 });

                    if (match[1].length > 0) {
                        matches.push({ index: matchStart + 1, type: 'variable', length: match[1].length });
                    }

                    matches.push({ index: matchStart + match[0].length - 1, type: 'decorator', length: 1 });
                }

                matches.sort((a, b) => a.index - b.index);

                for (const token of matches) {
                    if (token.index > lastIndex) {
                        const commentRange = new vscode.Range(line, startCharacter + lastIndex, line, startCharacter + token.index);
                        builder.push(commentRange, 'comment');
                    }

                    const tokenRange = new vscode.Range(line, startCharacter + token.index, line, startCharacter + token.index + token.length);
                    builder.push(tokenRange, token.type);

                    lastIndex = token.index + token.length;
                }

                if (lastIndex < effectiveEnd) {
                    const commentRange = new vscode.Range(line, startCharacter + lastIndex, line, startCharacter + effectiveEnd);
                    builder.push(commentRange, 'comment');
                }
            }
        }

        else {
            if (tokenType === '') return
            builder.push(range, tokenType);
        }
    }


    public getLineText(line: number): string {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            return editor?.document.lineAt(line).text;
        }
        return ""
    }
    private traverseTree(node: TSParser.SyntaxNode, builder: vscode.SemanticTokensBuilder, verifiedScopes: string[]) {
        let range = this.treeProvider.supplyRange(node);
        // log('Node text: ' + node.text + ", node type: " + node.type)
        let originalStartCheck = (newNode: TSParser.SyntaxNode, s: string) => ((newNode.text == s && newNode.type == s))
        if (this.treeProvider.isBlockNode(node)) {
            let newNode = this.treeProvider.findChildInRange(node, "{", null, range)
            let newEndNode = this.treeProvider.findLastChildInRange(node, "}", null, range)
            if ((newNode && originalStartCheck(newNode, "{")) && (newEndNode && originalStartCheck(newEndNode, "}"))) {
                let newNodeRange = this.treeProvider.supplyRange(newNode);
                let newEndNodeRange = this.treeProvider.supplyRange(newEndNode);
                // console.log("Entered Lambda Literal")
                // log('Node text: ' + newNode.text + ", node type: " + newNode.type)
                let modifiedRange = this.lastChangedRange
                let editor = vscode.window.activeTextEditor
                let startPoint = newNodeRange.start;
                let r
                if (modifiedRange && editor) {
                    r = this.treeProvider.adjustRangeForShiftsNoColumnNegative(range, modifiedRange, editor)
                } else r = newNodeRange
                let endPoint = newEndNodeRange.end;
                let scopeId = `${r?.start.line}:${r?.start.character}:${this.treeProvider.currentScope?.depth + 1}`;
                let storedScope = this.treeProvider.scopes.get(scopeId);
                //console.log("Checking if scope exists: " + scopeId + " for range: " + this.treeProvider.rangeToString(new vscode.Range(startPoint, endPoint)) + ", Is scope defined: " + (storedScope != undefined))
                if (storedScope) {
                    //console.log("Entered Existing Scope: " + storedScope.id)
                    let copy = storedScope
                    let newScopeId = `${startPoint.line}:${startPoint.character}:${this.treeProvider.currentScope?.depth + 1}`;
                    copy.startPoint = startPoint
                    copy.setEndPoint(endPoint)
                    this.treeProvider.scopes.delete(scopeId)
                    this.treeProvider.scopes.set(newScopeId, copy)
                    this.treeProvider.currentScope = copy;
                    verifiedScopes.push(newScopeId)
                } else {
                    this.treeProvider.scopes.delete(scopeId)
                    let newScopeId = `${startPoint.line}:${startPoint.character}:${this.treeProvider.currentScope?.depth + 1}`;
                    verifiedScopes.push(newScopeId)
                    this.treeProvider.enterScope(this.treeProvider.currentScope, startPoint, endPoint);
                    // console.log("Creating New Scope: " + this.treeProvider.currentScope.id)
                }
            } else {
                // console.log("Did not find { or } for block node: " + node.type + " at range: " + this.treeProvider.rangeToString(range) + ". {: " + (newNode == null) + ", }: " + (newEndNode == null))
            }
        } else if ((node.text == "}" && node.type == "}")) {
            this.treeProvider.exitScope(node);
        }

        node.children.forEach(child => this.traverseTree(child, builder, verifiedScopes));
    }



    // ---------------------- MODULAR FUNCTIONS ----------------------

    private handleMissingNodes(node: SyntaxNode): void {
        if (node.isMissing) {
            const nextValidToken: SyntaxNode | null | undefined = this.findFirstBaseToken(this.findNextValidToken(node));
            const nonNullToken: SyntaxNode = nextValidToken ? nextValidToken : node
            const range = this.treeProvider.supplyRange(nonNullToken);
            const errorMessage = `Missing token: ${node.type.replace(/_/g, " ")}`;

            TreeProvider.addError(range, errorMessage, nonNullToken.text);
        }
    }

    private handleCallExpression(node: SyntaxNode, builder: vscode.SemanticTokensBuilder): void {
        if (node.type !== "call_expression") return;
        const firstChildText = node.firstChild?.text;
        const secondChild = node.child(1);
        const isAnnotatedLambda = secondChild?.firstChild?.type === "annotated_lambda";
        const isCallSuffix = secondChild?.type === "call_suffix" && secondChild.text.startsWith("{");
        const matchingSuggestion = typingSuggestions.find(suggestion =>
            suggestion.fullyQualifiedName === firstChildText && isAnnotatedLambda ||
            suggestion.fullyQualifiedName === node.firstChild?.child(1)?.child(1)?.text && isCallSuffix
        );
        if (!matchingSuggestion) return;
        const targetNode = isAnnotatedLambda
            ? node
            : node.firstChild?.child(1)?.child(1);
        if (targetNode) {
            builder.push(this.treeProvider.supplyRange(targetNode), "keyword");
        }
    }


    private handleErrorNodes(node: SyntaxNode): void {
        if (!node.isError) return;

        const erroringNode: SyntaxNode | null | undefined = node.firstChild?.nextSibling || node.firstChild;
        if (!erroringNode) return;


        const expectedType = this.getExpectedNextType(erroringNode);

        const nextValidToken: SyntaxNode | null | undefined = this.findFirstBaseToken(this.findNextValidToken(erroringNode));
        let actualText: string = nextValidToken?.text ?? erroringNode?.text ?? "none";

        const range = this.treeProvider.supplyRange(nextValidToken || erroringNode);
        actualText = this.formatTokenText(actualText);


        const formattedExpectedType = expectedType
            ? expectedType.replace(/_/g, " ").replace(/^./, str => str.toUpperCase())
            : null;

        const errorMessage = formattedExpectedType
            ? `${formattedExpectedType} expected`
            : `Unexpected token: "${actualText}"`;

        TreeProvider.addError(range, errorMessage, node.text);
    }

    // ---------------------- UTILITY FUNCTIONS ----------------------

    private findNextValidToken(errorNode: SyntaxNode | null | undefined): SyntaxNode | null | undefined {
        let currentNode: SyntaxNode | null | undefined = errorNode;
        do {
            currentNode = currentNode?.nextSibling || currentNode?.parent?.nextSibling || null;
        } while (currentNode && (currentNode.isError || currentNode.text.trim() === "" || currentNode.text === errorNode?.text));

        if (currentNode && currentNode.parent?.isError) {
            currentNode = this.findDeepNextValidToken(currentNode);
        }

        if (currentNode) {
        } else {
            currentNode = this.findDeepNextValidToken(errorNode);
        }

        return currentNode;
    }

    private findDeepNextValidToken(node: SyntaxNode | null | undefined): SyntaxNode | null | undefined {
        if (!node) return null;

        let nextNode: SyntaxNode | null | undefined = node.parent?.nextSibling;
        while (nextNode && (nextNode.isError || nextNode.text.trim() === "" || nextNode.text === node.text)) {
            nextNode = nextNode.nextSibling;
        }

        return nextNode;
    }

    private findFirstBaseToken(node: SyntaxNode | null | undefined): SyntaxNode | null | undefined {
        let currentNode: SyntaxNode | null | undefined = node;
        while (currentNode && currentNode.firstChild) {
            currentNode = currentNode.firstChild;
        }
        return currentNode;
    }

    private formatTokenText(text: string): string {
        return text
            .replace(/[\r\n]+/g, " ")
            .replace(/ {4,}/g, " ")
            .trim()
            .substring(0, 25) + (text.length > 25 ? "..." : "");
    }

    public getExpectedNextType(node: SyntaxNode): string | null {
        switch (node.type) {
            case "parameter":
                return "typeAnnotation";
            case "class_declaration":
            case "function_declaration":
            case "object_declaration":
                return "{";
            case "type_alias":
                return "=";
            case "variable_declaration":
                return "typeAnnotation";
            case "assignment":
                return "expression";
            case "if_expression":
            case "while_statement":
            case "do_while_statement":
                return "(";
            case "for_statement":
                return "in";
            case "type_parameter":
                return ":";
            case "when_expression":
                return "{";
            case "annotation":
                return "identifier";
            case "value_arguments":
                return "(";
            case "value_argument":
                return "expression";
            case "primary_expression":
                return "operator";
            case "_block":
            case "control_structure_body":
                return "}";
            case "lambda_literal":
                return "statements";
            case "type_constraint":
                return ":";
            case "type_parameters":
                return ">";
            case "line_comment":
            case "multiline_comment":
                return null;

            case "fun":
                return "function_name";

            case "user_type":
            case "type_identifier":
            case "simple_identifier":
                return null;

            case ":":
                return "type";

            case "{":
                return "statements";

            case "statements":
                return "}";

            case "call_expression":
                return "call_suffix";

            case "call_suffix":
                return null;

            case "(":
                return "parameters";

            case "string_literal":
            case "string_content":
            case "interpolated_identifier":
                return null;

            case ")":
                return null;

            case "}":
                return null;

            case "function_value_parameters":
                return ":";

            case ",":
                return "parameter";

            case "function_body":
                return null;

            case "=":
                return "expression";

            case "additive_expression":
                return "+";

            case "+":
                return "expression";

            case "if":
                return "(";

            case "infix_expression":
                return "operator";

            case "boolean_literal":
                return null;

            case "annotated_lambda":
                return "statements";

            case "property_declaration":
                return "=";

            case "binding_pattern_kind":
                return "identifier";

            case "val":
                return "variable_declaration";

            case "integer_literal":
                return null;

            case "comparison_expression":
                return "operator";

            case ">":
                return null;

            case "anonymous_function":
                return "function_body";

            case "collection_literal":
                return "]";

            case "[":
                return "elements";

            case "]":
                return null;

            case "jump_expression":
                return null;

            case "return":
                return "expression";

            case "class":
                return "class_body";

            case "class_body":
                return "}";

            case "anonymous_initializer":
                return "statements";

            case "init":
                return "statements";

            case "navigation_expression":
                return "navigation_suffix";

            case "super_expression":
                return null;

            case "super":
                return ".";
            case "navigation_suffix":
                return "identifier";
            case ".":
                return "identifier"//this.refineExpectedType(node, "identifier");
            case "type_modifiers":
                return "type";

            case "@":
                return "annotation";

            case ";":
                return null;
            case "$":
                return "interpolation";

            case "true":
                return null;
            case "source_file":
                return null

            default:
                return null;
        }
    }
    public refineExpectedType(node: SyntaxNode, defaultType: string): string {
        let current: SyntaxNode | null = node;
        while (current) {
            if (current.type === "function_declaration") {
                return "function_body";
            }
            current = current.parent;
        }

        return defaultType;
    }

    public isMultipleDefinedVariable(node: SyntaxNode, scope: Scope = this.treeProvider.currentScope): boolean {
        return this.treeProvider.duplicateVars.get(node.text)?.scope.id == scope.id
    }

    public handleSimpleIdentifier(node: SyntaxNode, builder: vscode.SemanticTokensBuilder, byPassSI: boolean = false): void {
        const range = this.treeProvider.supplyRange(node)
        if (
            ((node.type === "simple_identifier" && node.parent?.type !== "catch_block") || byPassSI) &&
            !this.treeProvider.isSpecialHandleWord(node)
        ) {
            const isUpperCase = /^[A-Z_0-9]+$/.test(node.text) &&
                !this.treeProvider.hasParent(node, "import_list") &&
                !/^(_|__|___)$/.test(node.text);

            const isRecordedImport = [...this.treeProvider.imports.values()].some(
                i => node.text === i.simpleName
            );

            if (isUpperCase && !this.treeProvider.hasParent(node, "import_header") && !isRecordedImport) {
                builder.push(range, "enumMember");
                return;
            }
            //log('Node text: ' + node.text + ", node type: " + node.type)
            var scope = /* this.currentScopeFromRange(range) ??  */this.treeProvider.currentScope
            if (node.parent?.type !== "navigation_suffix") {
                if (scope.hasVariableInScopeChain(node.text)) {
                    if (node.parent?.type !== "variable_declaration") {
                        /* if (this.isMultipleDefinedVariable(node, scope)) {
                            const errorMessage = `Ambiguous variable declaration: '${node.text}'`;
                            TreeProvider.addError(range, errorMessage, node.text);
                        } */
                        builder.push(range, "enumMember");
                        return;
                    }
                } else if (isRecordedImport && !this.treeProvider.hasParent(node, "import_header")) {
                    builder.push(range, "type");
                    return;
                }
            } else if (node.parent?.parent?.parent?.type === "call_expression") {
                builder.push(range, "function");
                return;
            }
        }

        if (node.parent?.type === "function_declaration") {
            builder.push(range, "function");
        } else {
            builder.push(range, "variable");
        }
    }
    public getLineLength(line: number): number {
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            console.error(`Failed to access document for line length calculation.`);
            return 0;
        }
        return document.lineAt(line).text.length;
    }
    public setLastChangedRange(range: vscode.Range): void {
        this.lastChangedRange = range
    }

    public isNodeAffected(node: SyntaxNode): boolean {
        if (!this.lastChangedRange) return false;

        const nodeRange = this.treeProvider.supplyRange(node);

        return (
            nodeRange.start.isBeforeOrEqual(this.lastChangedRange.end) &&
            nodeRange.end.isAfterOrEqual(this.lastChangedRange.start)
        );
    }
    private decodeSemanticTokens(tokens: vscode.SemanticTokens | null): { range: vscode.Range, tokenType: number }[] {
        const result: { range: vscode.Range, tokenType: number }[] = [];
        if (!tokens || !tokens.data) return result;

        let currentLine = 0;
        let currentCharacter = 0;

        for (let i = 0; i < tokens.data.length; i += 5) {
            const deltaLine = tokens.data[i];
            const deltaCharacter = tokens.data[i + 1];
            const length = tokens.data[i + 2];
            const tokenType = tokens.data[i + 3];

            currentLine += deltaLine;
            if (deltaLine === 0) {
                currentCharacter += deltaCharacter;
            } else {
                currentCharacter = deltaCharacter;
            }

            const start = new vscode.Position(currentLine, currentCharacter);
            const end = new vscode.Position(currentLine, currentCharacter + length);
            result.push({ range: new vscode.Range(start, end), tokenType });
        }

        return result;
    }
    updateExistingTokens(
        existingTokens: { range: vscode.Range; tokenType: number }[],
        modifiedRange: vscode.Range,
        editor: vscode.TextEditor,
        range: vscode.Range,
        builder: vscode.SemanticTokensBuilder,
        capture: QueryCapture,
        l: vscode.Range[] = []
    ): void {
        const newLineShift = editor.document.lineCount - this.previousLineCount;


        if (newLineShift !== 0) {
            //console.log(`Detected ${newLineShift > 0 ? "added" : "removed"} lines: ${Math.abs(newLineShift)}`);

            existingTokens.forEach(token => {
                if (token.range.start.line >= modifiedRange.start.line) {
                    token.range = new vscode.Range(
                        new vscode.Position(
                            Math.max(0, token.range.start.line + newLineShift),
                            token.range.start.character
                        ),
                        new vscode.Position(
                            Math.max(0, token.range.end.line + newLineShift),
                            token.range.end.character
                        )
                    );
                }
            });
        }
        const existingToken = existingTokens.find(t =>
            (t.range.start.line === range.start.line && t.range.start.character === range.start.character) ||
            (t.range.start.line - newLineShift === range.start.line && t.range.start.character === range.start.character) ||
            (t.range.start.line + newLineShift === range.start.line && t.range.start.character === range.start.character) ||
            t.range.isEqual(range)
        );
        if (existingToken) {
            builder.push(existingToken.range, LEGEND.tokenTypes[existingToken.tokenType] || "variable");
        } else {
            this.rangeMode = RangeMode.REPROCESSING;
            this.processTokens(capture, builder, range, true);
        }
    }
}