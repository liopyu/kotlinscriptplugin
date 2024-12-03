/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = exports.SemanticTokensProvider = exports.TreeProvider = void 0;
const fs = __importStar(__webpack_require__(1));
const path = __importStar(__webpack_require__(2));
const vscode = __importStar(__webpack_require__(3));
const web_tree_sitter_1 = __importDefault(__webpack_require__(4));
const symbols_1 = __webpack_require__(5);
const t = true;
const individualLogging = false;
const globalLogging = false;
const editor = vscode.window.activeTextEditor;
function logContent(...data) {
    if (individualLogging) {
        console.log(data);
    }
}
function logGlobals(...data) {
    if (globalLogging) {
        console.log(data);
    }
}
const TOKEN_TYPES = [
    "type",
    "function",
    "variable",
    "number",
    'parameter',
    "string",
    "comment",
    "operator",
    "keyword",
    "property",
    "regexp",
    "label",
    "macro",
    "method",
    "event",
    "decorator",
    "enumMember",
    "typeParameter",
    "interface",
    "struct",
    "namespace",
    "enum",
    "class"
];
const TOKEN_MODIFIERS = [];
const LEGEND = new vscode.SemanticTokensLegend(TOKEN_TYPES, TOKEN_MODIFIERS);
const expressionTypes = [
    "postfix_expression",
    "call_expression",
    "indexing_expression",
    "navigation_expression",
    "prefix_expression",
    "as_expression",
    "spread_expression",
    "multiplicative_expression",
    "additive_expression",
    "range_expression",
    "infix_expression",
    "elvis_expression",
    "check_expression",
    "comparison_expression",
    "equality_expression",
    "comparison_expression",
    "equality_expression",
    "conjunction_expression",
    "disjunction_expression",
    "parenthesized_expression",
    "simple_identifier",
    "expression",
    "property_delegate",
    "literal_constant",
    "boolean_literal",
    "integer_literal",
    "hex_literal",
    "bin_literal",
    "character_literal",
    "real_literal",
    "null_literal",
    "long_literal",
    "unsigned_literal",
    "string_literal",
    "callable_reference",
    "function_literal",
    "object_literal",
    "collection_literal",
    "this_expression",
    "super_expression",
    "if_expression",
    "when_expression",
    "try_expression",
    "jump_expression",
    "lambda_literal",
    "anonymous_function"
];
const variableDeclarationTypes = [
    "multi_variable_declaration",
    "variable_declaration"
];
const blockParents = [
    "anonymous_initializer",
    "secondary_constructor",
    "control_structure_body",
    "try_expression",
    "catch_block",
    "finally_block",
    "when_expression"
];
const blocks = [
    "annotated_lambda",
    "lambda_literal",
    "function_body",
    "control_structure_body",
    "class_body",
];
const reservedWords = [
    "arrayOf",
    "arrayOfNulls",
    "byteArrayOf",
    "shortArrayOf",
    "intArrayOf",
    "longArrayOf",
    "ubyteArrayOf",
    "ushortArrayOf",
    "uintArrayOf",
    "ulongArrayOf",
    "floatArrayOf",
    "doubleArrayOf",
    "booleanArrayOf",
    "charArrayOf",
    "emptyArray",
    "mapOf",
    "setOf",
    "listOf",
    "emptyMap",
    "emptySet",
    "emptyList",
    "mutableMapOf",
    "mutableSetOf",
    "mutableListOf",
    "print",
    "println",
    "error",
    "TODO",
    "run",
    "runCatching",
    "repeat",
    "lazy",
    "lazyOf",
    "enumValues",
    "enumValueOf",
    "assert",
    "check",
    "checkNotNull",
    "require",
    "requireNotNull",
    "with",
    "suspend",
    "synchronized",
];
class TreeProvider {
    semanticTokensProvider = undefined;
    varId;
    hasPackageHeader = false;
    currentScope = new symbols_1.Scope(null);
    scopes = new Map();
    ranges = new Map();
    simpleRanges = [];
    init = false;
    parser;
    scopedVariables = new Map();
    rangesToDecorate = new Map();
    imports = new Map();
    tree = undefined;
    isUpdating = false;
    purpleType = [];
    defaultBlue = [];
    variableBlue = [];
    importRanges = [];
    constructor(parser, document) {
        this.parser = parser;
        logGlobals("initializing tokens provider");
        this.scopes.set(this.currentScope.id, this.currentScope);
        this.varId = 0;
        const fullText = document.getText();
        this.tree = this.parser.parse(fullText);
        this.updateTokens();
    }
    updateTokens() {
        this.isUpdating = true;
        logGlobals("Updating tokens for changed ranges...");
        if (!this.tree) {
            console.error("Tree is not initialized.");
            this.isUpdating = false;
            return;
        }
        this.defaultBlue = [];
        this.variableBlue = [];
        this.purpleType = [];
        this.importRanges = [];
        this.varId = 0;
        this.scopes.clear();
        this.currentScope = new symbols_1.Scope(null);
        this.scopes.set(this.currentScope.id, this.currentScope);
        //if (t) return
        this.validateImports(this.tree);
        this.validateVariables(this.tree);
        this.isUpdating = false;
    }
    validateImports(tree) {
        const importsToRemove = [];
        for (const [importKey, importSymbol] of this.imports.entries()) {
            const expectedRange = importSymbol.range;
            const identifierNode = this.findParent(tree.rootNode.descendantForPosition({
                row: expectedRange.start.line,
                column: expectedRange.start.character,
            }), "identifier");
            if (!identifierNode) {
                importsToRemove.push(importKey);
                continue;
            }
            const actualRange = this.supplyRange(identifierNode);
            const normalizedText = identifierNode.text.replace(/\s+/g, '').trim();
            if (!this.rangesEqual(expectedRange, actualRange)) {
                if (normalizedText == importSymbol.path) {
                    importSymbol.setRange(actualRange);
                    continue;
                }
            }
            if (normalizedText !== importSymbol.path) {
                importsToRemove.push(importKey);
            }
        }
        for (const importKey of importsToRemove) {
            this.imports.delete(importKey);
            logContent(`Removed stale import '${importKey}'`);
        }
    }
    validateVariables(tree) {
        const variablesToRemove = [];
        for (const [variableKey, variableSymbol] of this.scopedVariables.entries()) {
            const variableName = this.nameFromKey(variableKey);
            const expectedRange = variableSymbol.range;
            const node = tree.rootNode.descendantForPosition({
                row: expectedRange.start.line,
                column: expectedRange.start.character,
            });
            if (!node) {
                variablesToRemove.push(variableKey);
                continue;
            }
            if (node.text !== variableName) {
                variablesToRemove.push(variableKey);
                continue;
            }
            const actualRange = this.supplyRange(node);
            if (!this.rangesEqual(expectedRange, actualRange)) {
                variableSymbol.setRange(actualRange);
                continue;
            }
            let currentNode = node;
            let isValid = false;
            while (currentNode) {
                if (currentNode.type === 'property_declaration' ||
                    currentNode.type === 'variable_declaration') {
                    isValid = true;
                    break;
                }
                currentNode = currentNode.parent;
            }
            if (!isValid) {
                variablesToRemove.push(variableKey);
                continue;
            }
            if (!variableSymbol.scope.variables.has(variableName)) {
                variablesToRemove.push(variableKey);
            }
        }
        for (const variableKey of variablesToRemove) {
            var symbol = this.scopedVariables.get(variableKey);
            logContent(`Removed stale variable '${this.nameFromKey(variableKey)}' from scope: ` + symbol?.scope.depth);
            if (symbol)
                symbol.scope.undefine(symbol);
            if (this.rangesToDecorate.has(variableKey)) {
                this.rangesToDecorate.delete(variableKey);
            }
            this.scopedVariables.delete(variableKey);
        }
    }
    getAffectedRange(node) {
        let current = node;
        while (current.parent && current.parent.type !== "source_file") {
            current = current.parent;
        }
        return current;
    }
    nameFromKey(string) {
        const parts = string.split("@");
        return parts[0];
    }
    scopeIdFromKey(string) {
        const parts = string.split("@");
        return parts[1];
    }
    variableIdFromKey(string) {
        const parts = string.split("@");
        return parts[2];
    }
    rangesEqual(range1, range2) {
        return range1.start.line === range2.start.line &&
            range1.start.character === range2.start.character &&
            range1.end.line === range2.end.line &&
            range1.end.character === range2.end.character;
    }
    processPropertyDeclaration(node, builder) {
        const valueNodes = this.findChildren(node, expressionTypes, "property_declaration");
        const variables = this.extractVariables(node);
        if (valueNodes.length > 0) {
            valueNodes.forEach(valueNode => {
                if (!this.isValueInDeclaration(valueNode))
                    return;
                variables.forEach((range, variableNode) => {
                    if (["_", "__", "...", "___"].includes(variableNode.text))
                        return;
                    this.processVariableDeclaration(variableNode, valueNode, range, builder);
                });
            });
        }
        else {
            variables.forEach((range, variableNode) => {
                if (["_", "__", "...", "___"].includes(variableNode.text))
                    return;
                this.processVariableDeclaration(variableNode, null, range, builder);
            });
        }
    }
    extractVariables(node) {
        const variables = new Map();
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
    extractVariableNode(declaration) {
        const userTypeNode = this.findChild(declaration, "user_type");
        return userTypeNode ? declaration.firstChild : declaration;
    }
    processImportDeclarations(node) {
        const importNode = this.findChild(node, "identifier");
        if (!importNode)
            return;
        const range = this.supplyRange(importNode);
        this.processImportDeclaration(importNode, range);
    }
    ;
    enter = [];
    exit = [];
    givePath(path, segments) {
        const parts = path.split('.');
        if (segments <= 0 || segments > parts.length) {
            return "";
        }
        return parts.slice(0, segments).join('.');
    }
    handleSimpleIdentifier(node, byPassSI = false) {
        if (node.type == "navigation_expression" && !this.hasParent(node, "import_header")) {
            const normalizedText = node.text.replace(/\s+/g, '').trim();
            var splitNodes = this.findChildren(node, ["simple_identifier"]);
            this.imports.forEach((i, key) => {
                const barePath = this.givePath(normalizedText, i.segmentCount);
                if (barePath == key) {
                    this.importRanges.push(this.supplyRange(splitNodes[i.segmentCount - 1]));
                }
            });
        }
        else if (((node.type === "simple_identifier" && node.parent?.type != "catch_block") || byPassSI) &&
            !this.isSpecialHandleWord(node)) {
            const isUpperCase = /^[A-Z_0-9]+$/.test(node.text) && !this.hasParent(node, "import_list");
            const variableRange = this.currentScope.resolveVariable(node.text)?.range;
            var isRecordedImport = false;
            this.imports.forEach((i, key) => {
                if (!isRecordedImport && node.text == i.simpleName) {
                    isRecordedImport = true;
                }
            });
            if (node.parent?.type !== "navigation_suffix") {
                if (this.currentScope.hasVariableInScopeChain(node.text)) {
                    if (variableRange && !this.rangesEqual(variableRange, this.supplyRange(node))) {
                        this.variableBlue.push(this.supplyRange(node));
                    }
                    else if (isUpperCase) {
                        this.variableBlue.push(this.supplyRange(node));
                    }
                }
                else if (isRecordedImport && !this.hasParent(node, "import_header")) {
                    this.importRanges.push(this.supplyRange(node));
                }
                else if (isUpperCase) {
                    this.variableBlue.push(this.supplyRange(node));
                }
            }
            else if (isUpperCase) {
                this.variableBlue.push(this.supplyRange(node));
            }
        }
    }
    isSpecialHandleWord(node) {
        return (node.type == "->" ||
            node.type == "!!" ||
            node.type == "is" ||
            node.type == "?:" ||
            node.type == "in" ||
            ((node.text == "or" || node.text == "and") && node.type == "simple_identifier" && node.parent?.type == "infix_expression") ||
            node.type == "companion" && node.parent?.type == "companion_object" ||
            (node.type == "simple_identifier" &&
                node.text == "to" &&
                node.parent?.type == "infix_expression") ||
            ((node.type == "as" || node.type == "as?") && node.parent?.type == "as_expression") ||
            (node.type == "?" && node.parent?.type == "nullable_type") ||
            (node.type == "?." && node.parent?.type == "navigation_suffix") ||
            node.type == "by" ||
            (node.text == "it" &&
                this.hasParent(node, "lambda_literal") &&
                !this.currentScope.hasVariableInScopeChain("it") &&
                node.parent?.type != "navigation_suffix"));
    }
    isBlockNode(node) {
        if (blocks.includes(node.type)) {
            return true;
        }
        if (node.type === "{" && node.parent && blockParents.includes(node.parent.type)) {
            return true;
        }
        return false;
    }
    isBlockExitNode(node) {
        if (node.type !== "}")
            return false;
        const parent = node.parent;
        if (!parent)
            return false;
        const hasOpeningBracket = parent.children.some(child => child.type === "{");
        const isExplicitBlock = blocks.includes(parent.type);
        return hasOpeningBracket || isExplicitBlock;
    }
    hasParent(node, parentType) {
        let currentNode = node.parent;
        while (currentNode) {
            if (currentNode.type === parentType) {
                return true;
            }
            currentNode = currentNode.parent;
        }
        return false;
    }
    findChildren(node, types, expectedParent = null) {
        const result = [];
        const traverse = (currentNode) => {
            for (const child of currentNode.children) {
                if (types.includes(child.type)) {
                    if (!expectedParent || (child.parent && child.parent.type === expectedParent)) {
                        result.push(child);
                    }
                }
                traverse(child);
            }
        };
        traverse(node);
        return result;
    }
    findChild(node, type, expectedParent = null) {
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
    findParent(node, type) {
        let currentNode = node;
        while (currentNode) {
            if (currentNode.type === type) {
                return currentNode;
            }
            currentNode = currentNode.parent;
        }
        return null;
    }
    isValueInDeclaration(node) {
        // Detects the `10` in `var x = 10`
        return node.parent?.type === 'property_declaration' && expressionTypes.includes(node.type);
    }
    supplyRangeFromRange(range) {
        return new vscode.Range(range.startPosition.row, range.startPosition.column, range.endPosition.row, range.endPosition.column);
    }
    supplyRange(node) {
        return new vscode.Range(node.startPosition.row, node.startPosition.column, node.endPosition.row, node.endPosition.column);
    }
    processVariableDeclaration(identifierNode, variableNode, range, builder) {
        const variableName = identifierNode.text;
        if (this.currentScope.variables.has(variableName)) {
            logContent("Variable already defined in current scope: " + variableName + ", Depth: " + this.currentScope.depth +
                ", Position: " + range.start.line + ":" + range.start.character);
            return;
        }
        this.varId++;
        const variableSymbol = new symbols_1.VariableSymbol(variableName, range, identifierNode, variableNode ? variableNode.text : "", this.currentScope);
        //console.log("Defining variable in current scope: " + variableName + ", Depth: " + this.currentScope.depth)
        this.currentScope.define(variableSymbol);
        builder.push(range, "enumMember");
        this.scopedVariables.set(`${variableName}@${this.currentScope.id}@${this.varId}`, variableSymbol);
    }
    processImportDeclaration(node, range) {
        const importName = node.text.replace(/\s+/g, '').trim();
        if (!this.imports.has(importName)) {
            this.imports.set(importName, new symbols_1.ImportSymbol(importName, range, node));
        }
    }
    getscopedVariables() {
        return this.scopedVariables;
    }
    getimports() {
        return this.imports;
    }
    enterScope(parentScope) {
        if (!parentScope) {
            throw new Error("Parent scope is required to enter a new scope.");
        }
        const newScope = new symbols_1.Scope(parentScope);
        this.scopes.set(newScope.id, newScope);
        this.currentScope = newScope;
    }
    exitScope() {
        if (!this.currentScope.parentScope) {
            console.error("cannot exit gloabl scope:");
            return;
        }
        this.currentScope = this.currentScope.parentScope;
    }
}
exports.TreeProvider = TreeProvider;
class SemanticTokensProvider {
    highlightQuery;
    treeProvider;
    constructor(treeProvider, highlightQuery) {
        this.treeProvider = treeProvider;
        this.highlightQuery = highlightQuery;
    }
    tempInterpolatedRanges = [];
    updateTokens() {
        const tree = this.treeProvider.tree;
        const builder = new vscode.SemanticTokensBuilder(LEGEND);
        if (!tree)
            return builder.build();
        const matches = this.highlightQuery.matches(tree.rootNode);
        console.log("updating semantic tokens...");
        this.treeProvider.updateTokens();
        this.tempInterpolatedRanges = [];
        matches.forEach(match => {
            match.captures.forEach(capture => {
                const node = capture.node;
                var range = this.treeProvider.supplyRange(node);
                /* console.log(`Token processed: name="${capture.name}", flatName: ${capture.node.type}, ParentName: ${capture.node.parent?.type}, GrandParentName: ${capture.node.parent?.parent?.type}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.type}`);
                console.log(`Token processed: name="${capture.name}", flatName: ${capture.node.text}, ParentName: ${capture.node.parent?.text}, GrandParentName: ${capture.node.parent?.parent?.text}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.text}`);
 */
                if (capture.name == "keyword.return" && node.firstChild) {
                    range = this.treeProvider.supplyRange(node.firstChild);
                }
                else if (capture.name == 'namespace' && node.firstChild) {
                    range = this.treeProvider.supplyRange(node.firstChild);
                }
                else if (capture.node.type == "import") {
                    const parent = this.treeProvider.findParent(capture.node, "import_header");
                    if (parent) {
                        this.treeProvider.processImportDeclarations(parent);
                        const importNode = this.treeProvider.findChild(parent, "identifier");
                        if (importNode) {
                            builder.push(this.treeProvider.supplyRange(importNode), "type");
                        }
                    }
                }
                else if (this.treeProvider.isSpecialHandleWord(capture.node)) {
                    builder.push(this.treeProvider.supplyRange(capture.node), "keyword");
                }
                else if (node.type == "string_literal") {
                    var c1 = this.treeProvider.findChildren(node, ["${"]);
                    var c2 = this.treeProvider.findChildren(node, ["$"]);
                    var c3 = this.treeProvider.findChildren(node, ["}"]);
                    var c4 = this.treeProvider.findChildren(node, ["interpolated_identifier"]);
                    var c5 = this.treeProvider.findChildren(node, ["interpolated_expression"]);
                    c1.forEach(c => {
                        builder.push(this.treeProvider.supplyRange(c), "keyword");
                        this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c));
                    });
                    c2.forEach(c => {
                        builder.push(this.treeProvider.supplyRange(c), "keyword");
                        this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c));
                    });
                    c3.forEach(c => {
                        builder.push(this.treeProvider.supplyRange(c), "keyword");
                        this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c));
                    });
                    c4.forEach(c => {
                        var resolvedVariable = this.treeProvider.currentScope.hasVariableInScopeChain(c.text);
                        if (resolvedVariable) {
                            this.handleSimpleIdentifier(c, builder, true);
                        }
                        this.tempInterpolatedRanges.push(this.treeProvider.supplyRange(c));
                    });
                    c5.forEach(c => {
                        const range = this.treeProvider.supplyRange(c);
                        const nestedStrings = this.treeProvider.findChildren(c, ["string_literal"]);
                        nestedStrings.forEach(nestedString => {
                            const nestedRange = this.treeProvider.supplyRange(nestedString);
                            this.tempInterpolatedRanges.push(nestedRange);
                        });
                        this.tempInterpolatedRanges.push(range);
                    });
                }
                else if (this.treeProvider.isBlockNode(node) || (node.text == "{" || node.text == "${")) {
                    this.treeProvider.enterScope(this.treeProvider.currentScope);
                    this.treeProvider.enter.push(this.treeProvider.supplyRange(node));
                }
                else if (this.treeProvider.isBlockExitNode(node) || (capture.name == "punctuation.bracket" && node.text == "}" && node.type == "}")) {
                    this.treeProvider.exitScope();
                    this.treeProvider.exit.push(this.treeProvider.supplyRange(node));
                }
                else if (node.parent?.parent?.type == "lambda_parameters") {
                    var grand = node.parent?.parent;
                    if (grand) {
                        const variables = this.treeProvider.extractVariables(grand);
                        variables.forEach((range, variableNode) => {
                            if (["_", "__", "...", "___"].includes(variableNode.text))
                                return;
                            this.treeProvider.processVariableDeclaration(variableNode, null, range, builder);
                        });
                    }
                }
                else if (capture.name == "repeat") {
                    var n = this.treeProvider.findParent(node, "for_statement");
                    if (n) {
                        const variables = this.treeProvider.extractVariables(n);
                        variables.forEach((range, variableNode) => {
                            if (["_", "__", "...", "___"].includes(variableNode.text))
                                return;
                            this.treeProvider.processVariableDeclaration(variableNode, null, range, builder);
                        });
                    }
                }
                this.processTokenType(capture, range, builder);
            });
        });
        if (this.treeProvider.tree) {
            this.treeProvider.validateImports(this.treeProvider.tree);
            this.treeProvider.validateVariables(this.treeProvider.tree);
        }
        return builder.build();
    }
    provideDocumentSemanticTokens = () => this.updateTokens();
    processTokenType(capture, range, builder) {
        let tokenType = '';
        let name = capture.name;
        const node = capture.node;
        /* console.log(`Token processed: name="${name}", flatName: ${capture.node.type}, ParentName: ${capture.node.parent?.type}, GrandParentName: ${capture.node.parent?.parent?.type}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.type}`);
        console.log(`Token processed: name="${name}", flatName: ${capture.node.text}, ParentName: ${capture.node.parent?.text}, GrandParentName: ${capture.node.parent?.parent?.text}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.text}, type="${tokenType}", range=[${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}]`);
 */
        switch (name) {
            case 'variableIdentifier':
            case 'variable':
                if (node.parent?.type == "call_expression") {
                    for (const [key, i] of this.treeProvider.imports.entries()) {
                        const name = node.text;
                        if (name == i.simpleName && !this.treeProvider.currentScope.hasVariableInScopeChain(node.text)) {
                            builder.push(this.treeProvider.supplyRange(node), 'type');
                            break;
                        }
                    }
                    return builder.push(this.treeProvider.supplyRange(node), "function");
                }
                else {
                    this.handleSimpleIdentifier(capture.node, builder);
                }
                break;
            case 'property':
                if (capture.node.parent?.parent?.type == "navigation_expression") {
                    const foundNode = capture.node.parent?.parent;
                    const normalizedText = foundNode.text.replace(/\s+/g, '').trim();
                    var splitNodes = this.treeProvider.findChildren(foundNode, ["simple_identifier"]);
                    const isUpperCase = /^[A-Z_0-9]+$/.test(foundNode.text) && !this.treeProvider.hasParent(foundNode, "import_list");
                    if (!isUpperCase) {
                        this.treeProvider.imports.forEach((i, key) => {
                            const barePath = this.treeProvider.givePath(normalizedText, i.segmentCount);
                            if (barePath == key) {
                                builder.push(this.treeProvider.supplyRange(splitNodes[i.segmentCount - 1]), 'type');
                            }
                        });
                    }
                    else {
                        tokenType = 'enumMember';
                    }
                }
                else if (capture.node.parent?.parent?.parent?.type === "call_expression") {
                    tokenType = 'method';
                }
                else
                    tokenType = 'variable';
                break;
            case 'function':
                if (reservedWords.includes(capture?.node?.text)) {
                    tokenType = 'function';
                }
                else {
                    return;
                }
                break;
            case 'constructor':
                if (capture?.node?.text === "constructor") {
                    tokenType = 'keyword';
                }
                else {
                    return;
                }
                break;
            case 'keyword':
                if (node.type === "var" || node.type === "val") {
                    const pD = this.treeProvider.findParent(node, "property_declaration");
                    if (pD) {
                        if (!(this.treeProvider.findChild(pD, "val") && this.treeProvider.findChild(pD, "val")?.text != "val")) {
                            this.treeProvider.processPropertyDeclaration(pD, builder);
                        }
                    }
                }
                tokenType = 'keyword';
                break;
            case 'include':
            case 'namespace':
            case 'exception':
            case 'keyword.function':
            case 'return':
            case 'keyword.return':
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
            case 'variable.builtin':
            case 'none':
                tokenType = 'variable';
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
                const getExcludedRanges = (range, exclusions) => {
                    const result = [];
                    let currentStart = range.start;
                    exclusions
                        .filter(exclusion => (exclusion.start.isAfterOrEqual(range.start) && exclusion.start.isBeforeOrEqual(range.end)) ||
                        (exclusion.end.isAfterOrEqual(range.start) && exclusion.end.isBeforeOrEqual(range.end)))
                        .sort((a, b) => a.start.compareTo(b.start)) // sort exclusions by start position
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
                            const endCharacter = line === nonOverlap.end.line
                                ? nonOverlap.end.character
                                : capture.node.text.split('\n')[line - nonOverlap.start.line].length;
                            const singleLineRange = new vscode.Range(line, startCharacter, line, endCharacter);
                            builder.push(singleLineRange, 'string');
                        }
                    }
                    else {
                        builder.push(nonOverlap, 'string');
                    }
                });
                this.tempInterpolatedRanges = [];
                break;
            case 'punctuation.special':
                break;
            default:
                console.error(`Unrecognized token name: "${name}" in range=[${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}]..`);
                tokenType = 'variable';
                return;
        }
        if (name === 'comment.multiline' && range.start.line !== range.end.line) {
            for (let line = range.start.line; line <= range.end.line; line++) {
                const startCharacter = line === range.start.line ? range.start.character : 0;
                const endCharacter = line === range.end.line
                    ? range.end.character
                    : this.getLineLength(line);
                const singleLineRange = new vscode.Range(line, startCharacter, line, endCharacter);
                builder.push(singleLineRange, tokenType);
                //console.log(`Multi-line token split: name="${name}", type="${tokenType}", range=[${line}:${startCharacter} - ${line}:${endCharacter}]`);
            }
        }
        else {
            if (tokenType === '')
                return;
            builder.push(range, tokenType);
            /* console.log(`Token processed: name="${name}", flatName: ${capture.node.text}, ParentName: ${capture.node.parent?.text}, GrandParentName: ${capture.node.parent?.parent?.text}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.text}, type="${tokenType}", range=[${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}]`);
            console.log(`Token processed: name="${name}", flatName: ${capture.node.type}, ParentName: ${capture.node.parent?.type}, GrandParentName: ${capture.node.parent?.parent?.type}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.type}`);
             */ //console.log(`Token processed: name="${name}", flatName: ${capture.node.type}, FirstChild: ${capture.node.firstChild?.type}, SecondChild: ${capture.node.child(1)?.type}, ThirdChild: ${capture.node.child(2)?.type}`);
        }
    }
    handleSimpleIdentifier(node, builder, byPassSI = false) {
        /* console.log("handling simple identifier: " + node.type + ": " + node.text)
        console.log("handling simple identifier parent: " + node.parent?.type + ": " + node.parent?.text) */
        if (((node.type === "simple_identifier" && node.parent?.type != "catch_block") || byPassSI) &&
            !this.treeProvider.isSpecialHandleWord(node)) {
            const isUpperCase = /^[A-Z_0-9]+$/.test(node.text) && !this.treeProvider.hasParent(node, "import_list");
            var isRecordedImport = false;
            this.treeProvider.imports.forEach((i, key) => {
                if (!isRecordedImport && node.text == i.simpleName) {
                    isRecordedImport = true;
                }
            });
            if (isUpperCase && !this.treeProvider.hasParent(node, "import_header")) {
                builder.push(this.treeProvider.supplyRange(node), "enumMember");
                return;
            }
            else if (node.parent?.type !== "navigation_suffix") {
                const variableRange = this.treeProvider.currentScope.resolveVariable(node.text)?.range;
                if (this.treeProvider.currentScope.hasVariableInScopeChain(node.text)) {
                    if (variableRange && !this.treeProvider.rangesEqual(variableRange, this.treeProvider.supplyRange(node))) {
                        builder.push(this.treeProvider.supplyRange(node), "enumMember");
                        return;
                    }
                }
                else if (isRecordedImport && !this.treeProvider.hasParent(node, "import_header")) {
                    builder.push(this.treeProvider.supplyRange(node), "type");
                    return;
                }
            }
            else {
                if (node.parent?.parent?.parent?.type == "call_expression") {
                    return builder.push(this.treeProvider.supplyRange(node), "function");
                }
            }
        }
        if (node.parent?.type == "function_declaration") {
            return builder.push(this.treeProvider.supplyRange(node), "function");
        }
        return builder.push(this.treeProvider.supplyRange(node), "variable");
    }
    getLineLength(line) {
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            console.error(`Failed to access document for line length calculation.`);
            return 0;
        }
        return document.lineAt(line).text.length;
    }
}
exports.SemanticTokensProvider = SemanticTokensProvider;
class ImportDefinitionProvider {
    imports;
    constructor(imports) {
        this.imports = imports;
    }
    provideDefinition(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        const word = document.getText(wordRange);
        const importSymbol = this.imports.get(word);
        if (!importSymbol) {
            return null;
        }
        return new vscode.Location(document.uri, importSymbol.range);
    }
}
class KotlinScriptDefinitionProvider {
    scopedVariables;
    constructor(scopedVariables) {
        this.scopedVariables = scopedVariables;
    }
    provideDefinition(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        const word = document.getText(wordRange);
        let matchingSymbol;
        for (const [key, variableSymbol] of this.scopedVariables.entries()) {
            matchingSymbol = variableSymbol;
        }
        if (!matchingSymbol) {
            return null;
        }
        return new vscode.Location(document.uri, matchingSymbol.range);
    }
}
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        return new Promise((resolve) => {
            timeout = setTimeout(() => resolve(func(...args)), delay);
        });
    };
}
const documentData = new Map();
function applyTreeEdit(tree, change) {
    const startPosition = { row: change.range.start.line, column: change.range.start.character };
    const oldEndPosition = { row: change.range.end.line, column: change.range.end.character };
    const newEndPosition = {
        row: startPosition.row + change.text.split('\n').length - 1,
        column: change.text.split('\n').pop()?.length || 0
    };
    const startIndex = change.rangeOffset;
    const oldEndIndex = startIndex + (change.rangeLength || 0);
    const newEndIndex = startIndex + change.text.length;
    tree.edit({
        startIndex,
        oldEndIndex,
        newEndIndex,
        startPosition,
        oldEndPosition,
        newEndPosition,
    });
}
function updateTokensForDocument(document) {
    //if (t) return
    const documentUri = document.uri.toString();
    const data = documentData.get(documentUri);
    if (!data)
        return;
    const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === documentUri);
    if (editor) {
        const { treeProvider } = data;
        const changes = document.getText();
        if (treeProvider.tree) {
            const newTree = treeProvider.parser.parse(changes, treeProvider.tree);
            treeProvider.tree = newTree;
        }
        /* if (!treeProvider.isUpdating) {
            treeProvider.updateTokens(editor.visibleRanges);
        } */
        if (!treeProvider.isUpdating) {
            const documentLineCount = document.lineCount;
            const lineBoundary = 1000;
            const startLine = Math.max(0, editor.visibleRanges[0].start.line - lineBoundary);
            const endLine = Math.min(documentLineCount - 1, editor.visibleRanges[0].end.line + lineBoundary);
            const affectedRanges = [
                new vscode.Range(startLine, 0, endLine, Number.MAX_SAFE_INTEGER),
            ];
            treeProvider.updateTokens();
        }
        /* const variableDefinitionProvider = new KotlinScriptDefinitionProvider(treeProvider.getscopedVariables());
        context.subscriptions.push(
            vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
        ); */
    }
}
const semanticTokensEnabled = true;
async function activate(context) {
    const config = vscode.workspace.getConfiguration('kotlinscript');
    const ktsDirectory = config.get('ktsDirectory', 'config/scripts');
    const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
    await web_tree_sitter_1.default.init();
    const parser = new web_tree_sitter_1.default();
    const wasmPath = context.asAbsolutePath('parsers/tree-sitter-kotlin.wasm');
    const lang = await web_tree_sitter_1.default.Language.load(wasmPath);
    parser.setLanguage(lang);
    const highlightsPath = context.asAbsolutePath('parsers/kotlin_highlights.scm');
    const queryText = fs.readFileSync(highlightsPath, 'utf-8');
    const highlightQuery = lang.query(queryText);
    function addDocumentIfNotExists(document) {
        const documentUri = document.uri.toString();
        if (!document.fileName.endsWith(".kts"))
            return;
        if (!documentData.has(documentUri)) {
            logGlobals("Adding document");
            const treeProvider = new TreeProvider(parser, document);
            documentData.set(documentUri, {
                treeProvider: treeProvider,
                document: document
            });
        }
    }
    const selector = {
        language: 'kotlin',
        scheme: 'file',
        pattern: new vscode.RelativePattern(absoluteKtsDirectory, '*.kts')
    };
    vscode.workspace.onDidChangeTextDocument(event => {
        //if (t) return
        const documentUri = event.document.uri.toString();
        const data = documentData.get(documentUri);
        if (data) {
            const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === documentUri);
            if (editor) {
                const { treeProvider } = data;
                event.contentChanges.forEach(change => {
                    if (treeProvider.tree) {
                        applyTreeEdit(treeProvider.tree, change);
                    }
                });
                const newTree = treeProvider.parser.parse(event.document.getText(), treeProvider.tree);
                treeProvider.tree = newTree;
                const documentLineCount = event.document.lineCount;
                const lineBoundary = 1000;
                const affectedRanges = [];
                event.contentChanges.forEach(change => {
                    const editedLine = change.range.start.line;
                    const startLine = Math.max(0, editedLine - lineBoundary);
                    const endLine = Math.min(documentLineCount - 1, editedLine + lineBoundary);
                    affectedRanges.push(new vscode.Range(startLine, 0, endLine, Number.MAX_SAFE_INTEGER));
                });
                treeProvider.updateTokens();
            }
        }
    });
    vscode.window.onDidChangeTextEditorVisibleRanges(event => {
        updateTokensForDocument(event.textEditor.document);
    });
    // Runs on start
    if (editor) {
        addDocumentIfNotExists(editor.document);
        var doc = documentData.get(editor.document.uri.toString());
        if (doc) {
            //updateTokensForDocument(editor.document);
            if (semanticTokensEnabled) {
                doc.treeProvider.semanticTokensProvider = new SemanticTokensProvider(doc.treeProvider, highlightQuery);
                context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(selector, doc.treeProvider.semanticTokensProvider, LEGEND));
            }
        }
    }
    // For changes to a different document
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            addDocumentIfNotExists(editor.document);
        }
    });
    // For changes to all visible documents
    vscode.window.onDidChangeVisibleTextEditors(editors => {
        const openUris = new Set(editors.map(editor => editor.document.uri.toString()));
        for (const editor of editors) {
            addDocumentIfNotExists(editor.document);
        }
        for (const documentUri of documentData.keys()) {
            if (!openUris.has(documentUri)) {
                documentData.delete(documentUri);
                logGlobals("Removed document");
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
    logGlobals(`Deactivating KotlinScript extension...`);
}
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 3 */
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != "undefined" ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == "object";

var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";

// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";

if (ENVIRONMENT_IS_NODE) {}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /src/lib/binding_web/prefix.js
var TreeSitter = function() {
  var initPromise;
  var document = typeof window == "object" ? {
    currentScript: window.document.currentScript
  } : null;
  class Parser {
    constructor() {
      this.initialize();
    }
    initialize() {
      throw new Error("cannot construct a Parser before calling `init()`");
    }
    static init(moduleOptions) {
      if (initPromise) return initPromise;
      Module = Object.assign({}, Module, moduleOptions);
      return initPromise = new Promise(resolveInitPromise => {
        // end include: /src/lib/binding_web/prefix.js
        // Sometimes an existing Module object exists with properties
        // meant to overwrite the default module functionality. Here
        // we collect those properties and reapply _after_ we configure
        // the current environment's defaults to avoid having to be so
        // defensive during initialization.
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        // `/` should be present at the end if `scriptDirectory` is not empty
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        // Hooks that are implemented differently in different runtime environments.
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          // These modules will usually be used on Node.js. Load them eagerly to avoid
          // the complexity of lazy-loading.
          var fs = __webpack_require__(1);
          var nodePath = __webpack_require__(2);
          scriptDirectory = __dirname + "/";
          // include: node_shell_read.js
          readBinary = filename => {
            // We need to re-wrap `file://` strings to URLs. Normalizing isn't
            // necessary in that case, the path should already be absolute.
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            var ret = fs.readFileSync(filename);
            return ret;
          };
          readAsync = (filename, binary = true) => {
            // See the comment in the `readBinary` function.
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return new Promise((resolve, reject) => {
              fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
                if (err) reject(err); else resolve(binary ? data.buffer : data);
              });
            });
          };
          // end include: node_shell_read.js
          if (!Module["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          if (true) {
            module["exports"] = Module;
          }
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
        } else // Note that this includes Node.js workers when relevant (pthreads is enabled).
        // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
        // ENVIRONMENT_IS_NODE.
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            // Check worker, not web, since window could be polyfilled
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            // web
            scriptDirectory = document.currentScript.src;
          }
          // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
          // otherwise, slice off the final part of the url to find the script directory.
          // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
          // and scriptDirectory will correctly be replaced with an empty string.
          // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
          // they are removed because they could contain a slash.
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          {
            // include: web_or_worker_shell_read.js
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = url => {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
              };
            }
            readAsync = url => {
              // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
              // See https://github.com/github/fetch/pull/92#issuecomment-140665932
              // Cordova or Electron apps are typically loaded from a file:// url.
              // So use XHR on webview if URL is a file URL.
              if (isFileURI(url)) {
                return new Promise((reject, resolve) => {
                  var xhr = new XMLHttpRequest;
                  xhr.open("GET", url, true);
                  xhr.responseType = "arraybuffer";
                  xhr.onload = () => {
                    if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                      // file URLs can return 0
                      resolve(xhr.response);
                    }
                    reject(xhr.status);
                  };
                  xhr.onerror = reject;
                  xhr.send(null);
                });
              }
              return fetch(url, {
                credentials: "same-origin"
              }).then(response => {
                if (response.ok) {
                  return response.arrayBuffer();
                }
                return Promise.reject(new Error(response.status + " : " + response.url));
              });
            };
          }
        } else // end include: web_or_worker_shell_read.js
        {}
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        // Merge back in the overrides
        Object.assign(Module, moduleOverrides);
        // Free the object hierarchy contained in the overrides, this lets the GC
        // reclaim data used.
        moduleOverrides = null;
        // Emit code to handle expected values on the Module object. This applies Module.x
        // to the proper local x. This has two benefits: first, we only emit it if it is
        // expected to arrive, and second, by using a local everywhere else that can be
        // minified.
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        if (Module["quit"]) quit_ = Module["quit"];
        // perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
        // end include: shell.js
        // include: preamble.js
        // === Preamble library stuff ===
        // Documentation for the public APIs defined in this file must be updated in:
        //    site/source/docs/api_reference/preamble.js.rst
        // A prebuilt local version of the documentation is available at:
        //    site/build/text/docs/api_reference/preamble.js.txt
        // You can also build docs locally as HTML or other formats in site/
        // An online HTML version (which may be of a different version of Emscripten)
        //    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
        var dynamicLibraries = Module["dynamicLibraries"] || [];
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        // Wasm globals
        var wasmMemory;
        //========================================
        // Runtime essentials
        //========================================
        // whether we are quitting the application. no code should run after this.
        // set in exit() and abort()
        var ABORT = false;
        // set by exit() and abort().  Passed to 'onExit' handler.
        // NOTE: This is also used as the process return code code in shell environments
        // but only when noExitRuntime is false.
        var EXITSTATUS;
        // Memory management
        var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;
        var HEAP_DATA_VIEW;
        // include: runtime_shared.js
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module["HEAP_DATA_VIEW"] = HEAP_DATA_VIEW = new DataView(b);
          Module["HEAP8"] = HEAP8 = new Int8Array(b);
          Module["HEAP16"] = HEAP16 = new Int16Array(b);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module["HEAP32"] = HEAP32 = new Int32Array(b);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
        }
        // end include: runtime_shared.js
        // In non-standalone/normal mode, we create the memory here.
        // include: runtime_init_memory.js
        // Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)
        // check for full engine support (use string 'subarray' to avoid closure compiler confusion)
        if (Module["wasmMemory"]) {
          wasmMemory = Module["wasmMemory"];
        } else {
          var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 33554432;
          wasmMemory = new WebAssembly.Memory({
            "initial": INITIAL_MEMORY / 65536,
            // In theory we should not need to emit the maximum if we want "unlimited"
            // or 4GB of memory, but VMs error on that atm, see
            // https://github.com/emscripten-core/emscripten/issues/14130
            // And in the pthreads case we definitely need to emit a maximum. So
            // always emit one.
            "maximum": 2147483648 / 65536
          });
        }
        updateMemoryViews();
        // end include: runtime_init_memory.js
        // include: runtime_stack_check.js
        // end include: runtime_stack_check.js
        // include: runtime_assertions.js
        // end include: runtime_assertions.js
        var __ATPRERUN__ = [];
        // functions called before the runtime is initialized
        var __ATINIT__ = [];
        // functions called during startup
        var __ATMAIN__ = [];
        // functions called during shutdown
        var __ATPOSTRUN__ = [];
        // functions called after the main() is called
        var __RELOC_FUNCS__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true;
          callRuntimeCallbacks(__RELOC_FUNCS__);
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        // include: runtime_math.js
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
        // end include: runtime_math.js
        // A counter of dependencies for calling run(). If we need to
        // do asynchronous work before running, increment this and
        // decrement it. Incrementing must happen in a place like
        // Module.preRun (used by emcc to add file preloading).
        // Note that you can add dependencies in preRun, even though
        // it happens right before run - run will be postponed until
        // the dependencies are met.
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        // overridden to take different actions when all run dependencies are fulfilled
        function getUniqueRunDependency(id) {
          return id;
        }
        function addRunDependency(id) {
          runDependencies++;
          Module["monitorRunDependencies"]?.(runDependencies);
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module["monitorRunDependencies"]?.(runDependencies);
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        /** @param {string|number=} what */ function abort(what) {
          Module["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          // TODO(sbc): Should we remove printing and leave it up to whoever
          // catches the exception?
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what += ". Build with -sASSERTIONS for more info.";
          // Use a wasm runtime error, because a JS error might be seen as a foreign
          // exception, which means we'd run destructors on it. We need the error to
          // simply make the program stop.
          // FIXME This approach does not work in Wasm EH because it currently does not assume
          // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
          // a trap or not based on a hidden field within the object. So at the moment
          // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
          // allows this in the wasm spec.
          // Suppress closure compiler warning here. Closure compiler's builtin extern
          // definition for WebAssembly.RuntimeError claims it takes no arguments even
          // though it can.
          // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
          /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
          // Throw the error whether or not MODULARIZE is set because abort is used
          // in code paths apart from instantiation where an exception is expected
          // to be thrown when abort is called.
          throw e;
        }
        // include: memoryprofiler.js
        // end include: memoryprofiler.js
        // include: URIUtils.js
        // Prefix of data URIs emitted by SINGLE_FILE and related options.
        var dataURIPrefix = "data:application/octet-stream;base64,";
        /**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */ var isDataURI = filename => filename.startsWith(dataURIPrefix);
        /**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");
        // end include: URIUtils.js
        // include: runtime_exceptions.js
        // end include: runtime_exceptions.js
        function findWasmBinary() {
          var f = "tree-sitter.wasm";
          if (!isDataURI(f)) {
            return locateFile(f);
          }
          return f;
        }
        var wasmBinaryFile;
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          // If we don't have the binary yet, load it asynchronously using readAsync.
          if (!wasmBinary) {
            // Fetch the binary using readAsync
            return readAsync(binaryFile).then(response => new Uint8Array(/** @type{!ArrayBuffer} */ (response)), // Fall back to getBinarySync if readAsync fails
            () => getBinarySync(binaryFile));
          }
          // Otherwise, getBinarySync should be able to get it synchronously
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, reason => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
          !isFileURI(binaryFile) && // Avoid instantiateStreaming() on Node.js environment for now, as while
          // Node.js v18.1.0 implements it, it does not have a full fetch()
          // implementation yet.
          // Reference:
          //   https://github.com/emscripten-core/emscripten/pull/16917
          !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, {
              credentials: "same-origin"
            }).then(response => {
              // Suppress closure warning here since the upstream definition for
              // instantiateStreaming only allows Promise<Repsponse> rather than
              // an actual Response.
              // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
              /** @suppress {checkTypes} */ var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(callback, function(reason) {
                // We expect the most common failure cause to be a bad MIME type for the binary,
                // in which case falling back to ArrayBuffer instantiation should work.
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              });
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function getWasmImports() {
          // prepare imports
          return {
            "env": wasmImports,
            "wasi_snapshot_preview1": wasmImports,
            "GOT.mem": new Proxy(wasmImports, GOTHandler),
            "GOT.func": new Proxy(wasmImports, GOTHandler)
          };
        }
        // Create the wasm instance.
        // Receives the wasm imports, returns the exports.
        function createWasm() {
          var info = getWasmImports();
          // Load the wasm module and create an instance of using native support in the JS engine.
          // handle a generated wasm instance, receiving its exports and
          // performing other necessary setup
          /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
            wasmExports = instance.exports;
            wasmExports = relocateExports(wasmExports, 1024);
            var metadata = getDylinkMetadata(module);
            if (metadata.neededDynlibs) {
              dynamicLibraries = metadata.neededDynlibs.concat(dynamicLibraries);
            }
            mergeLibSymbols(wasmExports, "main");
            LDSO.init();
            loadDylibs();
            addOnInit(wasmExports["__wasm_call_ctors"]);
            __RELOC_FUNCS__.push(wasmExports["__wasm_apply_data_relocs"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          // wait for the pthread pool (if any)
          addRunDependency("wasm-instantiate");
          // Prefer streaming instantiation if available.
          function receiveInstantiationResult(result) {
            // 'result' is a ResultObject object which has both the module and instance.
            // receiveInstance() will swap in the exports (to Module.asm) so they can be called
            receiveInstance(result["instance"], result["module"]);
          }
          // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
          // to manually instantiate the Wasm module themselves. This allows pages to
          // run the instantiation parallel to any other async startup actions they are
          // performing.
          // Also pthreads and wasm workers initialize the wasm instance through this
          // path.
          if (Module["instantiateWasm"]) {
            try {
              return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              return false;
            }
          }
          if (!wasmBinaryFile) wasmBinaryFile = findWasmBinary();
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult);
          return {};
        }
        // include: runtime_debug.js
        // end include: runtime_debug.js
        // === Body ===
        var ASM_CONSTS = {};
        // end include: preamble.js
        /** @constructor */ function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var GOT = {};
        var currentModuleWeakSymbols = new Set([]);
        var GOTHandler = {
          get(obj, symName) {
            var rtn = GOT[symName];
            if (!rtn) {
              rtn = GOT[symName] = new WebAssembly.Global({
                "value": "i32",
                "mutable": true
              });
            }
            if (!currentModuleWeakSymbols.has(symName)) {
              // Any non-weak reference to a symbol marks it as `required`, which
              // enabled `reportUndefinedSymbols` to report undefeind symbol errors
              // correctly.
              rtn.required = true;
            }
            return rtn;
          }
        };
        var LE_HEAP_LOAD_F32 = byteOffset => HEAP_DATA_VIEW.getFloat32(byteOffset, true);
        var LE_HEAP_LOAD_F64 = byteOffset => HEAP_DATA_VIEW.getFloat64(byteOffset, true);
        var LE_HEAP_LOAD_I16 = byteOffset => HEAP_DATA_VIEW.getInt16(byteOffset, true);
        var LE_HEAP_LOAD_I32 = byteOffset => HEAP_DATA_VIEW.getInt32(byteOffset, true);
        var LE_HEAP_LOAD_U32 = byteOffset => HEAP_DATA_VIEW.getUint32(byteOffset, true);
        var LE_HEAP_STORE_F32 = (byteOffset, value) => HEAP_DATA_VIEW.setFloat32(byteOffset, value, true);
        var LE_HEAP_STORE_F64 = (byteOffset, value) => HEAP_DATA_VIEW.setFloat64(byteOffset, value, true);
        var LE_HEAP_STORE_I16 = (byteOffset, value) => HEAP_DATA_VIEW.setInt16(byteOffset, value, true);
        var LE_HEAP_STORE_I32 = (byteOffset, value) => HEAP_DATA_VIEW.setInt32(byteOffset, value, true);
        var LE_HEAP_STORE_U32 = (byteOffset, value) => HEAP_DATA_VIEW.setUint32(byteOffset, value, true);
        var callRuntimeCallbacks = callbacks => {
          while (callbacks.length > 0) {
            // Pass the module as the first argument.
            callbacks.shift()(Module);
          }
        };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;
        /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          // TextDecoder needs to know the byte length in advance, it doesn't stop on
          // null terminator by itself.  Also, use the length info to avoid running tiny
          // strings through TextDecoder, since .subarray() allocates garbage.
          // (As a tiny code save trick, compare endPtr against endIdx using a negation,
          // so that undefined means Infinity)
          while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          // If building with TextDecoder, we have already computed the string length
          // above, so test loop end condition against that
          while (idx < endPtr) {
            // For UTF8 byte structure, see:
            // http://en.wikipedia.org/wiki/UTF-8#Description
            // https://www.ietf.org/rfc/rfc2279.txt
            // https://tools.ietf.org/html/rfc3629
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode(((u0 & 31) << 6) | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            } else {
              u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
            }
          }
          return str;
        };
        var getDylinkMetadata = binary => {
          var offset = 0;
          var end = 0;
          function getU8() {
            return binary[offset++];
          }
          function getLEB() {
            var ret = 0;
            var mul = 1;
            while (1) {
              var byte = binary[offset++];
              ret += ((byte & 127) * mul);
              mul *= 128;
              if (!(byte & 128)) break;
            }
            return ret;
          }
          function getString() {
            var len = getLEB();
            offset += len;
            return UTF8ArrayToString(binary, offset - len, len);
          }
          /** @param {string=} message */ function failIf(condition, message) {
            if (condition) throw new Error(message);
          }
          var name = "dylink.0";
          if (binary instanceof WebAssembly.Module) {
            var dylinkSection = WebAssembly.Module.customSections(binary, name);
            if (dylinkSection.length === 0) {
              name = "dylink";
              dylinkSection = WebAssembly.Module.customSections(binary, name);
            }
            failIf(dylinkSection.length === 0, "need dylink section");
            binary = new Uint8Array(dylinkSection[0]);
            end = binary.length;
          } else {
            var int32View = new Uint32Array(new Uint8Array(binary.subarray(0, 24)).buffer);
            var magicNumberFound = int32View[0] == 1836278016 || int32View[0] == 6386541;
            failIf(!magicNumberFound, "need to see wasm magic number");
            // \0asm
            // we should see the dylink custom section right after the magic number and wasm version
            failIf(binary[8] !== 0, "need the dylink section to be first");
            offset = 9;
            var section_size = getLEB();
            //section size
            end = offset + section_size;
            name = getString();
          }
          var customSection = {
            neededDynlibs: [],
            tlsExports: new Set,
            weakImports: new Set
          };
          if (name == "dylink") {
            customSection.memorySize = getLEB();
            customSection.memoryAlign = getLEB();
            customSection.tableSize = getLEB();
            customSection.tableAlign = getLEB();
            // shared libraries this module needs. We need to load them first, so that
            // current module could resolve its imports. (see tools/shared.py
            // WebAssembly.make_shared_library() for "dylink" section extension format)
            var neededDynlibsCount = getLEB();
            for (var i = 0; i < neededDynlibsCount; ++i) {
              var libname = getString();
              customSection.neededDynlibs.push(libname);
            }
          } else {
            failIf(name !== "dylink.0");
            var WASM_DYLINK_MEM_INFO = 1;
            var WASM_DYLINK_NEEDED = 2;
            var WASM_DYLINK_EXPORT_INFO = 3;
            var WASM_DYLINK_IMPORT_INFO = 4;
            var WASM_SYMBOL_TLS = 256;
            var WASM_SYMBOL_BINDING_MASK = 3;
            var WASM_SYMBOL_BINDING_WEAK = 1;
            while (offset < end) {
              var subsectionType = getU8();
              var subsectionSize = getLEB();
              if (subsectionType === WASM_DYLINK_MEM_INFO) {
                customSection.memorySize = getLEB();
                customSection.memoryAlign = getLEB();
                customSection.tableSize = getLEB();
                customSection.tableAlign = getLEB();
              } else if (subsectionType === WASM_DYLINK_NEEDED) {
                var neededDynlibsCount = getLEB();
                for (var i = 0; i < neededDynlibsCount; ++i) {
                  libname = getString();
                  customSection.neededDynlibs.push(libname);
                }
              } else if (subsectionType === WASM_DYLINK_EXPORT_INFO) {
                var count = getLEB();
                while (count--) {
                  var symname = getString();
                  var flags = getLEB();
                  if (flags & WASM_SYMBOL_TLS) {
                    customSection.tlsExports.add(symname);
                  }
                }
              } else if (subsectionType === WASM_DYLINK_IMPORT_INFO) {
                var count = getLEB();
                while (count--) {
                  var modname = getString();
                  var symname = getString();
                  var flags = getLEB();
                  if ((flags & WASM_SYMBOL_BINDING_MASK) == WASM_SYMBOL_BINDING_WEAK) {
                    customSection.weakImports.add(symname);
                  }
                }
              } else {
                // unknown subsection
                offset += subsectionSize;
              }
            }
          }
          return customSection;
        };
        /**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
          if (type.endsWith("*")) type = "*";
          switch (type) {
           case "i1":
            return HEAP8[ptr];

           case "i8":
            return HEAP8[ptr];

           case "i16":
            return LE_HEAP_LOAD_I16(((ptr) >> 1) * 2);

           case "i32":
            return LE_HEAP_LOAD_I32(((ptr) >> 2) * 4);

           case "i64":
            abort("to do getValue(i64) use WASM_BIGINT");

           case "float":
            return LE_HEAP_LOAD_F32(((ptr) >> 2) * 4);

           case "double":
            return LE_HEAP_LOAD_F64(((ptr) >> 3) * 8);

           case "*":
            return LE_HEAP_LOAD_U32(((ptr) >> 2) * 4);

           default:
            abort(`invalid type for getValue: ${type}`);
          }
        }
        var newDSO = (name, handle, syms) => {
          var dso = {
            refcount: Infinity,
            name: name,
            exports: syms,
            global: true
          };
          LDSO.loadedLibsByName[name] = dso;
          if (handle != undefined) {
            LDSO.loadedLibsByHandle[handle] = dso;
          }
          return dso;
        };
        var LDSO = {
          loadedLibsByName: {},
          loadedLibsByHandle: {},
          init() {
            newDSO("__main__", 0, wasmImports);
          }
        };
        var ___heap_base = 78112;
        var zeroMemory = (address, size) => {
          HEAPU8.fill(0, address, address + size);
          return address;
        };
        var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
        var getMemory = size => {
          // After the runtime is initialized, we must only use sbrk() normally.
          if (runtimeInitialized) {
            // Currently we don't support freeing of static data when modules are
            // unloaded via dlclose.  This function is tagged as `noleakcheck` to
            // avoid having this reported as leak.
            return zeroMemory(_malloc(size), size);
          }
          var ret = ___heap_base;
          // Keep __heap_base stack aligned.
          var end = ret + alignMemory(size, 16);
          ___heap_base = end;
          GOT["__heap_base"].value = end;
          return ret;
        };
        var isInternalSym = symName => [ "__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js" ].includes(symName) || symName.startsWith("__em_js__");
        var uleb128Encode = (n, target) => {
          if (n < 128) {
            target.push(n);
          } else {
            target.push((n % 128) | 128, n >> 7);
          }
        };
        var sigToWasmTypes = sig => {
          var typeNames = {
            "i": "i32",
            "j": "i64",
            "f": "f32",
            "d": "f64",
            "e": "externref",
            "p": "i32"
          };
          var type = {
            parameters: [],
            results: sig[0] == "v" ? [] : [ typeNames[sig[0]] ]
          };
          for (var i = 1; i < sig.length; ++i) {
            type.parameters.push(typeNames[sig[i]]);
          }
          return type;
        };
        var generateFuncType = (sig, target) => {
          var sigRet = sig.slice(0, 1);
          var sigParam = sig.slice(1);
          var typeCodes = {
            "i": 127,
            // i32
            "p": 127,
            // i32
            "j": 126,
            // i64
            "f": 125,
            // f32
            "d": 124,
            // f64
            "e": 111
          };
          // Parameters, length + signatures
          target.push(96);
          /* form: func */ uleb128Encode(sigParam.length, target);
          for (var i = 0; i < sigParam.length; ++i) {
            target.push(typeCodes[sigParam[i]]);
          }
          // Return values, length + signatures
          // With no multi-return in MVP, either 0 (void) or 1 (anything else)
          if (sigRet == "v") {
            target.push(0);
          } else {
            target.push(1, typeCodes[sigRet]);
          }
        };
        var convertJsFunctionToWasm = (func, sig) => {
          // If the type reflection proposal is available, use the new
          // "WebAssembly.Function" constructor.
          // Otherwise, construct a minimal wasm module importing the JS function and
          // re-exporting it.
          if (typeof WebAssembly.Function == "function") {
            return new WebAssembly.Function(sigToWasmTypes(sig), func);
          }
          // The module is static, with the exception of the type section, which is
          // generated based on the signature passed in.
          var typeSectionBody = [ 1 ];
          // count: 1
          generateFuncType(sig, typeSectionBody);
          // Rest of the module is static
          var bytes = [ 0, 97, 115, 109, // magic ("\0asm")
          1, 0, 0, 0, // version: 1
          1 ];
          // Write the overall length of the type section followed by the body
          uleb128Encode(typeSectionBody.length, bytes);
          bytes.push(...typeSectionBody);
          // The rest of the module is static
          bytes.push(2, 7, // import section
          // (import "e" "f" (func 0 (type 0)))
          1, 1, 101, 1, 102, 0, 0, 7, 5, // export section
          // (export "f" (func 0 (type 0)))
          1, 1, 102, 0, 0);
          // We can compile this wasm module synchronously because it is very small.
          // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
          var module = new WebAssembly.Module(new Uint8Array(bytes));
          var instance = new WebAssembly.Instance(module, {
            "e": {
              "f": func
            }
          });
          var wrappedFunc = instance.exports["f"];
          return wrappedFunc;
        };
        var wasmTableMirror = [];
        /** @type {WebAssembly.Table} */ var wasmTable = new WebAssembly.Table({
          "initial": 28,
          "element": "anyfunc"
        });
        var getWasmTableEntry = funcPtr => {
          var func = wasmTableMirror[funcPtr];
          if (!func) {
            if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
            wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
          }
          return func;
        };
        var updateTableMap = (offset, count) => {
          if (functionsInTableMap) {
            for (var i = offset; i < offset + count; i++) {
              var item = getWasmTableEntry(i);
              // Ignore null values.
              if (item) {
                functionsInTableMap.set(item, i);
              }
            }
          }
        };
        var functionsInTableMap;
        var getFunctionAddress = func => {
          // First, create the map if this is the first use.
          if (!functionsInTableMap) {
            functionsInTableMap = new WeakMap;
            updateTableMap(0, wasmTable.length);
          }
          return functionsInTableMap.get(func) || 0;
        };
        var freeTableIndexes = [];
        var getEmptyTableSlot = () => {
          // Reuse a free index if there is one, otherwise grow.
          if (freeTableIndexes.length) {
            return freeTableIndexes.pop();
          }
          // Grow the table
          try {
            wasmTable.grow(1);
          } catch (err) {
            if (!(err instanceof RangeError)) {
              throw err;
            }
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
          }
          return wasmTable.length - 1;
        };
        var setWasmTableEntry = (idx, func) => {
          wasmTable.set(idx, func);
          // With ABORT_ON_WASM_EXCEPTIONS wasmTable.get is overridden to return wrapped
          // functions so we need to call it here to retrieve the potential wrapper correctly
          // instead of just storing 'func' directly into wasmTableMirror
          wasmTableMirror[idx] = wasmTable.get(idx);
        };
        /** @param {string=} sig */ var addFunction = (func, sig) => {
          // Check if the function is already in the table, to ensure each function
          // gets a unique index.
          var rtn = getFunctionAddress(func);
          if (rtn) {
            return rtn;
          }
          // It's not in the table, add it now.
          var ret = getEmptyTableSlot();
          // Set the new value.
          try {
            // Attempting to call this with JS function will cause of table.set() to fail
            setWasmTableEntry(ret, func);
          } catch (err) {
            if (!(err instanceof TypeError)) {
              throw err;
            }
            var wrapped = convertJsFunctionToWasm(func, sig);
            setWasmTableEntry(ret, wrapped);
          }
          functionsInTableMap.set(func, ret);
          return ret;
        };
        var updateGOT = (exports, replace) => {
          for (var symName in exports) {
            if (isInternalSym(symName)) {
              continue;
            }
            var value = exports[symName];
            if (symName.startsWith("orig$")) {
              symName = symName.split("$")[1];
              replace = true;
            }
            GOT[symName] ||= new WebAssembly.Global({
              "value": "i32",
              "mutable": true
            });
            if (replace || GOT[symName].value == 0) {
              if (typeof value == "function") {
                GOT[symName].value = addFunction(value);
              } else if (typeof value == "number") {
                GOT[symName].value = value;
              } else {
                err(`unhandled export type for '${symName}': ${typeof value}`);
              }
            }
          }
        };
        /** @param {boolean=} replace */ var relocateExports = (exports, memoryBase, replace) => {
          var relocated = {};
          for (var e in exports) {
            var value = exports[e];
            if (typeof value == "object") {
              // a breaking change in the wasm spec, globals are now objects
              // https://github.com/WebAssembly/mutable-global/issues/1
              value = value.value;
            }
            if (typeof value == "number") {
              value += memoryBase;
            }
            relocated[e] = value;
          }
          updateGOT(relocated, replace);
          return relocated;
        };
        var isSymbolDefined = symName => {
          // Ignore 'stub' symbols that are auto-generated as part of the original
          // `wasmImports` used to instantiate the main module.
          var existing = wasmImports[symName];
          if (!existing || existing.stub) {
            return false;
          }
          return true;
        };
        var dynCallLegacy = (sig, ptr, args) => {
          sig = sig.replace(/p/g, "i");
          var f = Module["dynCall_" + sig];
          return f(ptr, ...args);
        };
        var dynCall = (sig, ptr, args = []) => {
          // Without WASM_BIGINT support we cannot directly call function with i64 as
          // part of their signature, so we rely on the dynCall functions generated by
          // wasm-emscripten-finalize
          if (sig.includes("j")) {
            return dynCallLegacy(sig, ptr, args);
          }
          var rtn = getWasmTableEntry(ptr)(...args);
          return rtn;
        };
        var stackSave = () => _emscripten_stack_get_current();
        var stackRestore = val => __emscripten_stack_restore(val);
        var createInvokeFunction = sig => (ptr, ...args) => {
          var sp = stackSave();
          try {
            return dynCall(sig, ptr, args);
          } catch (e) {
            stackRestore(sp);
            // Create a try-catch guard that rethrows the Emscripten EH exception.
            // Exceptions thrown from C++ will be a pointer (number) and longjmp
            // will throw the number Infinity. Use the compact and fast "e !== e+0"
            // test to check if e was not a Number.
            if (e !== e + 0) throw e;
            _setThrew(1, 0);
          }
        };
        var resolveGlobalSymbol = (symName, direct = false) => {
          var sym;
          // First look for the orig$ symbol which is the symbol without i64
          // legalization performed.
          if (direct && ("orig$" + symName in wasmImports)) {
            symName = "orig$" + symName;
          }
          if (isSymbolDefined(symName)) {
            sym = wasmImports[symName];
          } else // Asm.js-style exception handling: invoke wrapper generation
          if (symName.startsWith("invoke_")) {
            // Create (and cache) new invoke_ functions on demand.
            sym = wasmImports[symName] = createInvokeFunction(symName.split("_")[1]);
          }
          return {
            sym: sym,
            name: symName
          };
        };
        /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        /**
      * @param {string=} libName
      * @param {Object=} localScope
      * @param {number=} handle
      */ var loadWebAssemblyModule = (binary, flags, libName, localScope, handle) => {
          var metadata = getDylinkMetadata(binary);
          currentModuleWeakSymbols = metadata.weakImports;
          // loadModule loads the wasm module after all its dependencies have been loaded.
          // can be called both sync/async.
          function loadModule() {
            // The first thread to load a given module needs to allocate the static
            // table and memory regions.  Later threads re-use the same table region
            // and can ignore the memory region (since memory is shared between
            // threads already).
            // If `handle` is specified than it is assumed that the calling thread has
            // exclusive access to it for the duration of this function.  See the
            // locking in `dynlink.c`.
            var firstLoad = !handle || !HEAP8[(handle) + (8)];
            if (firstLoad) {
              // alignments are powers of 2
              var memAlign = Math.pow(2, metadata.memoryAlign);
              // prepare memory
              var memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0;
              // TODO: add to cleanups
              var tableBase = metadata.tableSize ? wasmTable.length : 0;
              if (handle) {
                HEAP8[(handle) + (8)] = 1;
                LE_HEAP_STORE_U32((((handle) + (12)) >> 2) * 4, memoryBase);
                LE_HEAP_STORE_I32((((handle) + (16)) >> 2) * 4, metadata.memorySize);
                LE_HEAP_STORE_U32((((handle) + (20)) >> 2) * 4, tableBase);
                LE_HEAP_STORE_I32((((handle) + (24)) >> 2) * 4, metadata.tableSize);
              }
            } else {
              memoryBase = LE_HEAP_LOAD_U32((((handle) + (12)) >> 2) * 4);
              tableBase = LE_HEAP_LOAD_U32((((handle) + (20)) >> 2) * 4);
            }
            var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length;
            if (tableGrowthNeeded > 0) {
              wasmTable.grow(tableGrowthNeeded);
            }
            // This is the export map that we ultimately return.  We declare it here
            // so it can be used within resolveSymbol.  We resolve symbols against
            // this local symbol map in the case there they are not present on the
            // global Module object.  We need this fallback because Modules sometime
            // need to import their own symbols
            var moduleExports;
            function resolveSymbol(sym) {
              var resolved = resolveGlobalSymbol(sym).sym;
              if (!resolved && localScope) {
                resolved = localScope[sym];
              }
              if (!resolved) {
                resolved = moduleExports[sym];
              }
              return resolved;
            }
            // TODO kill ↓↓↓ (except "symbols local to this module", it will likely be
            // not needed if we require that if A wants symbols from B it has to link
            // to B explicitly: similarly to -Wl,--no-undefined)
            // wasm dynamic libraries are pure wasm, so they cannot assist in
            // their own loading. When side module A wants to import something
            // provided by a side module B that is loaded later, we need to
            // add a layer of indirection, but worse, we can't even tell what
            // to add the indirection for, without inspecting what A's imports
            // are. To do that here, we use a JS proxy (another option would
            // be to inspect the binary directly).
            var proxyHandler = {
              get(stubs, prop) {
                // symbols that should be local to this module
                switch (prop) {
                 case "__memory_base":
                  return memoryBase;

                 case "__table_base":
                  return tableBase;
                }
                if (prop in wasmImports && !wasmImports[prop].stub) {
                  // No stub needed, symbol already exists in symbol table
                  return wasmImports[prop];
                }
                // Return a stub function that will resolve the symbol
                // when first called.
                if (!(prop in stubs)) {
                  var resolved;
                  stubs[prop] = (...args) => {
                    resolved ||= resolveSymbol(prop);
                    return resolved(...args);
                  };
                }
                return stubs[prop];
              }
            };
            var proxy = new Proxy({}, proxyHandler);
            var info = {
              "GOT.mem": new Proxy({}, GOTHandler),
              "GOT.func": new Proxy({}, GOTHandler),
              "env": proxy,
              "wasi_snapshot_preview1": proxy
            };
            function postInstantiation(module, instance) {
              // add new entries to functionsInTableMap
              updateTableMap(tableBase, metadata.tableSize);
              moduleExports = relocateExports(instance.exports, memoryBase);
              if (!flags.allowUndefined) {
                reportUndefinedSymbols();
              }
              function addEmAsm(addr, body) {
                var args = [];
                var arity = 0;
                for (;arity < 16; arity++) {
                  if (body.indexOf("$" + arity) != -1) {
                    args.push("$" + arity);
                  } else {
                    break;
                  }
                }
                args = args.join(",");
                var func = `(${args}) => { ${body} };`;
                ASM_CONSTS[start] = eval(func);
              }
              // Add any EM_ASM function that exist in the side module
              if ("__start_em_asm" in moduleExports) {
                var start = moduleExports["__start_em_asm"];
                var stop = moduleExports["__stop_em_asm"];
                while (start < stop) {
                  var jsString = UTF8ToString(start);
                  addEmAsm(start, jsString);
                  start = HEAPU8.indexOf(0, start) + 1;
                }
              }
              function addEmJs(name, cSig, body) {
                // The signature here is a C signature (e.g. "(int foo, char* bar)").
                // See `create_em_js` in emcc.py` for the build-time version of this
                // code.
                var jsArgs = [];
                cSig = cSig.slice(1, -1);
                if (cSig != "void") {
                  cSig = cSig.split(",");
                  for (var i in cSig) {
                    var jsArg = cSig[i].split(" ").pop();
                    jsArgs.push(jsArg.replace("*", ""));
                  }
                }
                var func = `(${jsArgs}) => ${body};`;
                moduleExports[name] = eval(func);
              }
              for (var name in moduleExports) {
                if (name.startsWith("__em_js__")) {
                  var start = moduleExports[name];
                  var jsString = UTF8ToString(start);
                  // EM_JS strings are stored in the data section in the form
                  // SIG<::>BODY.
                  var parts = jsString.split("<::>");
                  addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]);
                  delete moduleExports[name];
                }
              }
              // initialize the module
              var applyRelocs = moduleExports["__wasm_apply_data_relocs"];
              if (applyRelocs) {
                if (runtimeInitialized) {
                  applyRelocs();
                } else {
                  __RELOC_FUNCS__.push(applyRelocs);
                }
              }
              var init = moduleExports["__wasm_call_ctors"];
              if (init) {
                if (runtimeInitialized) {
                  init();
                } else {
                  // we aren't ready to run compiled code yet
                  __ATINIT__.push(init);
                }
              }
              return moduleExports;
            }
            if (flags.loadAsync) {
              if (binary instanceof WebAssembly.Module) {
                var instance = new WebAssembly.Instance(binary, info);
                return Promise.resolve(postInstantiation(binary, instance));
              }
              return WebAssembly.instantiate(binary, info).then(result => postInstantiation(result.module, result.instance));
            }
            var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary);
            var instance = new WebAssembly.Instance(module, info);
            return postInstantiation(module, instance);
          }
          // now load needed libraries and the module itself.
          if (flags.loadAsync) {
            return metadata.neededDynlibs.reduce((chain, dynNeeded) => chain.then(() => loadDynamicLibrary(dynNeeded, flags, localScope)), Promise.resolve()).then(loadModule);
          }
          metadata.neededDynlibs.forEach(needed => loadDynamicLibrary(needed, flags, localScope));
          return loadModule();
        };
        var mergeLibSymbols = (exports, libName) => {
          // add symbols into global namespace TODO: weak linking etc.
          for (var [sym, exp] of Object.entries(exports)) {
            // When RTLD_GLOBAL is enabled, the symbols defined by this shared object
            // will be made available for symbol resolution of subsequently loaded
            // shared objects.
            // We should copy the symbols (which include methods and variables) from
            // SIDE_MODULE to MAIN_MODULE.
            const setImport = target => {
              if (!isSymbolDefined(target)) {
                wasmImports[target] = exp;
              }
            };
            setImport(sym);
            // Special case for handling of main symbol:  If a side module exports
            // `main` that also acts a definition for `__main_argc_argv` and vice
            // versa.
            const main_alias = "__main_argc_argv";
            if (sym == "main") {
              setImport(main_alias);
            }
            if (sym == main_alias) {
              setImport("main");
            }
            if (sym.startsWith("dynCall_") && !Module.hasOwnProperty(sym)) {
              Module[sym] = exp;
            }
          }
        };
        /** @param {boolean=} noRunDep */ var asyncLoad = (url, onload, onerror, noRunDep) => {
          var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
          readAsync(url).then(arrayBuffer => {
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep);
          }, err => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          });
          if (dep) addRunDependency(dep);
        };
        /**
       * @param {number=} handle
       * @param {Object=} localScope
       */ function loadDynamicLibrary(libName, flags = {
          global: true,
          nodelete: true
        }, localScope, handle) {
          // when loadDynamicLibrary did not have flags, libraries were loaded
          // globally & permanently
          var dso = LDSO.loadedLibsByName[libName];
          if (dso) {
            // the library is being loaded or has been loaded already.
            if (!flags.global) {
              if (localScope) {
                Object.assign(localScope, dso.exports);
              }
            } else if (!dso.global) {
              // The library was previously loaded only locally but not
              // we have a request with global=true.
              dso.global = true;
              mergeLibSymbols(dso.exports, libName);
            }
            // same for "nodelete"
            if (flags.nodelete && dso.refcount !== Infinity) {
              dso.refcount = Infinity;
            }
            dso.refcount++;
            if (handle) {
              LDSO.loadedLibsByHandle[handle] = dso;
            }
            return flags.loadAsync ? Promise.resolve(true) : true;
          }
          // allocate new DSO
          dso = newDSO(libName, handle, "loading");
          dso.refcount = flags.nodelete ? Infinity : 1;
          dso.global = flags.global;
          // libName -> libData
          function loadLibData() {
            // for wasm, we can use fetch for async, but for fs mode we can only imitate it
            if (handle) {
              var data = LE_HEAP_LOAD_U32((((handle) + (28)) >> 2) * 4);
              var dataSize = LE_HEAP_LOAD_U32((((handle) + (32)) >> 2) * 4);
              if (data && dataSize) {
                var libData = HEAP8.slice(data, data + dataSize);
                return flags.loadAsync ? Promise.resolve(libData) : libData;
              }
            }
            var libFile = locateFile(libName);
            if (flags.loadAsync) {
              return new Promise(function(resolve, reject) {
                asyncLoad(libFile, resolve, reject);
              });
            }
            // load the binary synchronously
            if (!readBinary) {
              throw new Error(`${libFile}: file not found, and synchronous loading of external files is not available`);
            }
            return readBinary(libFile);
          }
          // libName -> exports
          function getExports() {
            // module not preloaded - load lib data and create new module from it
            if (flags.loadAsync) {
              return loadLibData().then(libData => loadWebAssemblyModule(libData, flags, libName, localScope, handle));
            }
            return loadWebAssemblyModule(loadLibData(), flags, libName, localScope, handle);
          }
          // module for lib is loaded - update the dso & global namespace
          function moduleLoaded(exports) {
            if (dso.global) {
              mergeLibSymbols(exports, libName);
            } else if (localScope) {
              Object.assign(localScope, exports);
            }
            dso.exports = exports;
          }
          if (flags.loadAsync) {
            return getExports().then(exports => {
              moduleLoaded(exports);
              return true;
            });
          }
          moduleLoaded(getExports());
          return true;
        }
        var reportUndefinedSymbols = () => {
          for (var [symName, entry] of Object.entries(GOT)) {
            if (entry.value == 0) {
              var value = resolveGlobalSymbol(symName, true).sym;
              if (!value && !entry.required) {
                // Ignore undefined symbols that are imported as weak.
                continue;
              }
              if (typeof value == "function") {
                /** @suppress {checkTypes} */ entry.value = addFunction(value, value.sig);
              } else if (typeof value == "number") {
                entry.value = value;
              } else {
                throw new Error(`bad export type for '${symName}': ${typeof value}`);
              }
            }
          }
        };
        var loadDylibs = () => {
          if (!dynamicLibraries.length) {
            reportUndefinedSymbols();
            return;
          }
          // Load binaries asynchronously
          addRunDependency("loadDylibs");
          dynamicLibraries.reduce((chain, lib) => chain.then(() => loadDynamicLibrary(lib, {
            loadAsync: true,
            global: true,
            nodelete: true,
            allowUndefined: true
          })), Promise.resolve()).then(() => {
            // we got them all, wonderful
            reportUndefinedSymbols();
            removeRunDependency("loadDylibs");
          });
        };
        var noExitRuntime = Module["noExitRuntime"] || true;
        /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
          if (type.endsWith("*")) type = "*";
          switch (type) {
           case "i1":
            HEAP8[ptr] = value;
            break;

           case "i8":
            HEAP8[ptr] = value;
            break;

           case "i16":
            LE_HEAP_STORE_I16(((ptr) >> 1) * 2, value);
            break;

           case "i32":
            LE_HEAP_STORE_I32(((ptr) >> 2) * 4, value);
            break;

           case "i64":
            abort("to do setValue(i64) use WASM_BIGINT");

           case "float":
            LE_HEAP_STORE_F32(((ptr) >> 2) * 4, value);
            break;

           case "double":
            LE_HEAP_STORE_F64(((ptr) >> 3) * 8, value);
            break;

           case "*":
            LE_HEAP_STORE_U32(((ptr) >> 2) * 4, value);
            break;

           default:
            abort(`invalid type for setValue: ${type}`);
          }
        }
        var ___memory_base = new WebAssembly.Global({
          "value": "i32",
          "mutable": false
        }, 1024);
        var ___stack_pointer = new WebAssembly.Global({
          "value": "i32",
          "mutable": true
        }, 78112);
        var ___table_base = new WebAssembly.Global({
          "value": "i32",
          "mutable": false
        }, 1);
        var __abort_js = () => {
          abort("");
        };
        __abort_js.sig = "v";
        var nowIsMonotonic = 1;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        __emscripten_get_now_is_monotonic.sig = "i";
        var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
        __emscripten_memcpy_js.sig = "vppp";
        var _emscripten_date_now = () => Date.now();
        _emscripten_date_now.sig = "d";
        var _emscripten_get_now;
        // Modern environment where performance.now() is supported:
        // N.B. a shorter form "_emscripten_get_now = performance.now;" is
        // unfortunately not allowed even in current browsers (e.g. FF Nightly 75).
        _emscripten_get_now = () => performance.now();
        _emscripten_get_now.sig = "d";
        var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
        // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
        // for any code that deals with heap sizes, which would require special
        // casing all heap size related code to treat 0 specially.
        2147483648;
        var growMemory = size => {
          var b = wasmMemory.buffer;
          var pages = (size - b.byteLength + 65535) / 65536;
          try {
            // round size grow request up to wasm page size (fixed 64KB per spec)
            wasmMemory.grow(pages);
            // .grow() takes a delta compared to the previous size
            updateMemoryViews();
            return 1;
          } /*success*/ catch (e) {}
        };
        // implicit 0 return to save code size (caller will cast "undefined" into 0
        // anyhow)
        var _emscripten_resize_heap = requestedSize => {
          var oldSize = HEAPU8.length;
          // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
          requestedSize >>>= 0;
          // With multithreaded builds, races can happen (another thread might increase the size
          // in between), so return a failure, and let the caller retry.
          // Memory resize rules:
          // 1.  Always increase heap size to at least the requested size, rounded up
          //     to next page multiple.
          // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
          //     geometrically: increase the heap size according to
          //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
          //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
          // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
          //     linearly: increase the heap size by at least
          //     MEMORY_GROWTH_LINEAR_STEP bytes.
          // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
          //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
          // 4.  If we were unable to allocate as much memory, it may be due to
          //     over-eager decision to excessively reserve due to (3) above.
          //     Hence if an allocation fails, cut down on the amount of excess
          //     growth, in an attempt to succeed to perform a smaller allocation.
          // A limit is set for how much we can grow. We should not exceed that
          // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            return false;
          }
          var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          // Loop through potential heap size increases. If we attempt a too eager
          // reservation that fails, cut down on the attempted size and reserve a
          // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
            // ensure geometric growth
            // but limit overreserving (default to capping at +96MB overgrowth at most)
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          return false;
        };
        _emscripten_resize_heap.sig = "ip";
        var _fd_close = fd => 52;
        _fd_close.sig = "ii";
        var convertI32PairToI53Checked = (lo, hi) => ((hi + 2097152) >>> 0 < 4194305 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          return 70;
        }
        _fd_seek.sig = "iiiiip";
        var printCharBuffers = [ null, [], [] ];
        var printChar = (stream, curr) => {
          var buffer = printCharBuffers[stream];
          if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
            buffer.length = 0;
          } else {
            buffer.push(curr);
          }
        };
        var _fd_write = (fd, iov, iovcnt, pnum) => {
          // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
          var num = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = LE_HEAP_LOAD_U32(((iov) >> 2) * 4);
            var len = LE_HEAP_LOAD_U32((((iov) + (4)) >> 2) * 4);
            iov += 8;
            for (var j = 0; j < len; j++) {
              printChar(fd, HEAPU8[ptr + j]);
            }
            num += len;
          }
          LE_HEAP_STORE_U32(((pnum) >> 2) * 4, num);
          return 0;
        };
        _fd_write.sig = "iippp";
        function _tree_sitter_log_callback(isLexMessage, messageAddress) {
          if (currentLogCallback) {
            const message = UTF8ToString(messageAddress);
            currentLogCallback(message, isLexMessage !== 0);
          }
        }
        function _tree_sitter_parse_callback(inputBufferAddress, index, row, column, lengthAddress) {
          const INPUT_BUFFER_SIZE = 10 * 1024;
          const string = currentParseCallback(index, {
            row: row,
            column: column
          });
          if (typeof string === "string") {
            setValue(lengthAddress, string.length, "i32");
            stringToUTF16(string, inputBufferAddress, INPUT_BUFFER_SIZE);
          } else {
            setValue(lengthAddress, 0, "i32");
          }
        }
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = code => {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            Module["onExit"]?.(code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        };
        _proc_exit.sig = "vi";
        /** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
          EXITSTATUS = status;
          _proc_exit(status);
        };
        var handleException = e => {
          // Certain exception types we do not treat as errors since they are used for
          // internal control flow.
          // 1. ExitStatus, which is thrown by exit()
          // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
          //    that wish to return to JS event loop.
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          quit_(1, e);
        };
        var lengthBytesUTF8 = str => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
            // unit, not a Unicode code point of the character! So decode
            // UTF16->UTF32->UTF8.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            var c = str.charCodeAt(i);
            // possibly a lead surrogate
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
          // undefined and false each don't write out any bytes.
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          // -1 for string null terminator.
          for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
            // unit, not a Unicode code point of the character! So decode
            // UTF16->UTF32->UTF8.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
            // and https://www.ietf.org/rfc/rfc2279.txt
            // and https://tools.ietf.org/html/rfc3629
            var u = str.charCodeAt(i);
            // possibly a lead surrogate
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | (u1 & 1023);
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | (u >> 6);
              heap[outIdx++] = 128 | (u & 63);
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | (u >> 12);
              heap[outIdx++] = 128 | ((u >> 6) & 63);
              heap[outIdx++] = 128 | (u & 63);
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++] = 240 | (u >> 18);
              heap[outIdx++] = 128 | ((u >> 12) & 63);
              heap[outIdx++] = 128 | ((u >> 6) & 63);
              heap[outIdx++] = 128 | (u & 63);
            }
          }
          // Null-terminate the pointer to the buffer.
          heap[outIdx] = 0;
          return outIdx - startIdx;
        };
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        var stackAlloc = sz => __emscripten_stack_alloc(sz);
        var stringToUTF8OnStack = str => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
          // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
          maxBytesToWrite ??= 2147483647;
          if (maxBytesToWrite < 2) return 0;
          maxBytesToWrite -= 2;
          // Null terminator.
          var startPtr = outPtr;
          var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
          for (var i = 0; i < numCharsToWrite; ++i) {
            // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
            var codeUnit = str.charCodeAt(i);
            // possibly a lead surrogate
            LE_HEAP_STORE_I16(((outPtr) >> 1) * 2, codeUnit);
            outPtr += 2;
          }
          // Null-terminate the pointer to the HEAP.
          LE_HEAP_STORE_I16(((outPtr) >> 1) * 2, 0);
          return outPtr - startPtr;
        };
        var AsciiToString = ptr => {
          var str = "";
          while (1) {
            var ch = HEAPU8[ptr++];
            if (!ch) return str;
            str += String.fromCharCode(ch);
          }
        };
        var wasmImports = {
          /** @export */ __heap_base: ___heap_base,
          /** @export */ __indirect_function_table: wasmTable,
          /** @export */ __memory_base: ___memory_base,
          /** @export */ __stack_pointer: ___stack_pointer,
          /** @export */ __table_base: ___table_base,
          /** @export */ _abort_js: __abort_js,
          /** @export */ _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
          /** @export */ _emscripten_memcpy_js: __emscripten_memcpy_js,
          /** @export */ emscripten_get_now: _emscripten_get_now,
          /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
          /** @export */ fd_close: _fd_close,
          /** @export */ fd_seek: _fd_seek,
          /** @export */ fd_write: _fd_write,
          /** @export */ memory: wasmMemory,
          /** @export */ tree_sitter_log_callback: _tree_sitter_log_callback,
          /** @export */ tree_sitter_parse_callback: _tree_sitter_parse_callback
        };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["__wasm_call_ctors"])();
        var ___wasm_apply_data_relocs = () => (___wasm_apply_data_relocs = wasmExports["__wasm_apply_data_relocs"])();
        var _malloc = Module["_malloc"] = a0 => (_malloc = Module["_malloc"] = wasmExports["malloc"])(a0);
        var _calloc = Module["_calloc"] = (a0, a1) => (_calloc = Module["_calloc"] = wasmExports["calloc"])(a0, a1);
        var _realloc = Module["_realloc"] = (a0, a1) => (_realloc = Module["_realloc"] = wasmExports["realloc"])(a0, a1);
        var _free = Module["_free"] = a0 => (_free = Module["_free"] = wasmExports["free"])(a0);
        var _ts_language_symbol_count = Module["_ts_language_symbol_count"] = a0 => (_ts_language_symbol_count = Module["_ts_language_symbol_count"] = wasmExports["ts_language_symbol_count"])(a0);
        var _ts_language_state_count = Module["_ts_language_state_count"] = a0 => (_ts_language_state_count = Module["_ts_language_state_count"] = wasmExports["ts_language_state_count"])(a0);
        var _ts_language_version = Module["_ts_language_version"] = a0 => (_ts_language_version = Module["_ts_language_version"] = wasmExports["ts_language_version"])(a0);
        var _ts_language_field_count = Module["_ts_language_field_count"] = a0 => (_ts_language_field_count = Module["_ts_language_field_count"] = wasmExports["ts_language_field_count"])(a0);
        var _ts_language_next_state = Module["_ts_language_next_state"] = (a0, a1, a2) => (_ts_language_next_state = Module["_ts_language_next_state"] = wasmExports["ts_language_next_state"])(a0, a1, a2);
        var _ts_language_symbol_name = Module["_ts_language_symbol_name"] = (a0, a1) => (_ts_language_symbol_name = Module["_ts_language_symbol_name"] = wasmExports["ts_language_symbol_name"])(a0, a1);
        var _ts_language_symbol_for_name = Module["_ts_language_symbol_for_name"] = (a0, a1, a2, a3) => (_ts_language_symbol_for_name = Module["_ts_language_symbol_for_name"] = wasmExports["ts_language_symbol_for_name"])(a0, a1, a2, a3);
        var _strncmp = Module["_strncmp"] = (a0, a1, a2) => (_strncmp = Module["_strncmp"] = wasmExports["strncmp"])(a0, a1, a2);
        var _ts_language_symbol_type = Module["_ts_language_symbol_type"] = (a0, a1) => (_ts_language_symbol_type = Module["_ts_language_symbol_type"] = wasmExports["ts_language_symbol_type"])(a0, a1);
        var _ts_language_field_name_for_id = Module["_ts_language_field_name_for_id"] = (a0, a1) => (_ts_language_field_name_for_id = Module["_ts_language_field_name_for_id"] = wasmExports["ts_language_field_name_for_id"])(a0, a1);
        var _ts_lookahead_iterator_new = Module["_ts_lookahead_iterator_new"] = (a0, a1) => (_ts_lookahead_iterator_new = Module["_ts_lookahead_iterator_new"] = wasmExports["ts_lookahead_iterator_new"])(a0, a1);
        var _ts_lookahead_iterator_delete = Module["_ts_lookahead_iterator_delete"] = a0 => (_ts_lookahead_iterator_delete = Module["_ts_lookahead_iterator_delete"] = wasmExports["ts_lookahead_iterator_delete"])(a0);
        var _ts_lookahead_iterator_reset_state = Module["_ts_lookahead_iterator_reset_state"] = (a0, a1) => (_ts_lookahead_iterator_reset_state = Module["_ts_lookahead_iterator_reset_state"] = wasmExports["ts_lookahead_iterator_reset_state"])(a0, a1);
        var _ts_lookahead_iterator_reset = Module["_ts_lookahead_iterator_reset"] = (a0, a1, a2) => (_ts_lookahead_iterator_reset = Module["_ts_lookahead_iterator_reset"] = wasmExports["ts_lookahead_iterator_reset"])(a0, a1, a2);
        var _ts_lookahead_iterator_next = Module["_ts_lookahead_iterator_next"] = a0 => (_ts_lookahead_iterator_next = Module["_ts_lookahead_iterator_next"] = wasmExports["ts_lookahead_iterator_next"])(a0);
        var _ts_lookahead_iterator_current_symbol = Module["_ts_lookahead_iterator_current_symbol"] = a0 => (_ts_lookahead_iterator_current_symbol = Module["_ts_lookahead_iterator_current_symbol"] = wasmExports["ts_lookahead_iterator_current_symbol"])(a0);
        var _memset = Module["_memset"] = (a0, a1, a2) => (_memset = Module["_memset"] = wasmExports["memset"])(a0, a1, a2);
        var _memcpy = Module["_memcpy"] = (a0, a1, a2) => (_memcpy = Module["_memcpy"] = wasmExports["memcpy"])(a0, a1, a2);
        var _ts_parser_delete = Module["_ts_parser_delete"] = a0 => (_ts_parser_delete = Module["_ts_parser_delete"] = wasmExports["ts_parser_delete"])(a0);
        var _ts_parser_reset = Module["_ts_parser_reset"] = a0 => (_ts_parser_reset = Module["_ts_parser_reset"] = wasmExports["ts_parser_reset"])(a0);
        var _ts_parser_set_language = Module["_ts_parser_set_language"] = (a0, a1) => (_ts_parser_set_language = Module["_ts_parser_set_language"] = wasmExports["ts_parser_set_language"])(a0, a1);
        var _ts_parser_timeout_micros = Module["_ts_parser_timeout_micros"] = a0 => (_ts_parser_timeout_micros = Module["_ts_parser_timeout_micros"] = wasmExports["ts_parser_timeout_micros"])(a0);
        var _ts_parser_set_timeout_micros = Module["_ts_parser_set_timeout_micros"] = (a0, a1, a2) => (_ts_parser_set_timeout_micros = Module["_ts_parser_set_timeout_micros"] = wasmExports["ts_parser_set_timeout_micros"])(a0, a1, a2);
        var _ts_parser_set_included_ranges = Module["_ts_parser_set_included_ranges"] = (a0, a1, a2) => (_ts_parser_set_included_ranges = Module["_ts_parser_set_included_ranges"] = wasmExports["ts_parser_set_included_ranges"])(a0, a1, a2);
        var _memmove = Module["_memmove"] = (a0, a1, a2) => (_memmove = Module["_memmove"] = wasmExports["memmove"])(a0, a1, a2);
        var _memcmp = Module["_memcmp"] = (a0, a1, a2) => (_memcmp = Module["_memcmp"] = wasmExports["memcmp"])(a0, a1, a2);
        var _ts_query_new = Module["_ts_query_new"] = (a0, a1, a2, a3, a4) => (_ts_query_new = Module["_ts_query_new"] = wasmExports["ts_query_new"])(a0, a1, a2, a3, a4);
        var _ts_query_delete = Module["_ts_query_delete"] = a0 => (_ts_query_delete = Module["_ts_query_delete"] = wasmExports["ts_query_delete"])(a0);
        var _iswspace = Module["_iswspace"] = a0 => (_iswspace = Module["_iswspace"] = wasmExports["iswspace"])(a0);
        var _iswalnum = Module["_iswalnum"] = a0 => (_iswalnum = Module["_iswalnum"] = wasmExports["iswalnum"])(a0);
        var _ts_query_pattern_count = Module["_ts_query_pattern_count"] = a0 => (_ts_query_pattern_count = Module["_ts_query_pattern_count"] = wasmExports["ts_query_pattern_count"])(a0);
        var _ts_query_capture_count = Module["_ts_query_capture_count"] = a0 => (_ts_query_capture_count = Module["_ts_query_capture_count"] = wasmExports["ts_query_capture_count"])(a0);
        var _ts_query_string_count = Module["_ts_query_string_count"] = a0 => (_ts_query_string_count = Module["_ts_query_string_count"] = wasmExports["ts_query_string_count"])(a0);
        var _ts_query_capture_name_for_id = Module["_ts_query_capture_name_for_id"] = (a0, a1, a2) => (_ts_query_capture_name_for_id = Module["_ts_query_capture_name_for_id"] = wasmExports["ts_query_capture_name_for_id"])(a0, a1, a2);
        var _ts_query_string_value_for_id = Module["_ts_query_string_value_for_id"] = (a0, a1, a2) => (_ts_query_string_value_for_id = Module["_ts_query_string_value_for_id"] = wasmExports["ts_query_string_value_for_id"])(a0, a1, a2);
        var _ts_query_predicates_for_pattern = Module["_ts_query_predicates_for_pattern"] = (a0, a1, a2) => (_ts_query_predicates_for_pattern = Module["_ts_query_predicates_for_pattern"] = wasmExports["ts_query_predicates_for_pattern"])(a0, a1, a2);
        var _ts_query_disable_capture = Module["_ts_query_disable_capture"] = (a0, a1, a2) => (_ts_query_disable_capture = Module["_ts_query_disable_capture"] = wasmExports["ts_query_disable_capture"])(a0, a1, a2);
        var _ts_tree_copy = Module["_ts_tree_copy"] = a0 => (_ts_tree_copy = Module["_ts_tree_copy"] = wasmExports["ts_tree_copy"])(a0);
        var _ts_tree_delete = Module["_ts_tree_delete"] = a0 => (_ts_tree_delete = Module["_ts_tree_delete"] = wasmExports["ts_tree_delete"])(a0);
        var _ts_init = Module["_ts_init"] = () => (_ts_init = Module["_ts_init"] = wasmExports["ts_init"])();
        var _ts_parser_new_wasm = Module["_ts_parser_new_wasm"] = () => (_ts_parser_new_wasm = Module["_ts_parser_new_wasm"] = wasmExports["ts_parser_new_wasm"])();
        var _ts_parser_enable_logger_wasm = Module["_ts_parser_enable_logger_wasm"] = (a0, a1) => (_ts_parser_enable_logger_wasm = Module["_ts_parser_enable_logger_wasm"] = wasmExports["ts_parser_enable_logger_wasm"])(a0, a1);
        var _ts_parser_parse_wasm = Module["_ts_parser_parse_wasm"] = (a0, a1, a2, a3, a4) => (_ts_parser_parse_wasm = Module["_ts_parser_parse_wasm"] = wasmExports["ts_parser_parse_wasm"])(a0, a1, a2, a3, a4);
        var _ts_parser_included_ranges_wasm = Module["_ts_parser_included_ranges_wasm"] = a0 => (_ts_parser_included_ranges_wasm = Module["_ts_parser_included_ranges_wasm"] = wasmExports["ts_parser_included_ranges_wasm"])(a0);
        var _ts_language_type_is_named_wasm = Module["_ts_language_type_is_named_wasm"] = (a0, a1) => (_ts_language_type_is_named_wasm = Module["_ts_language_type_is_named_wasm"] = wasmExports["ts_language_type_is_named_wasm"])(a0, a1);
        var _ts_language_type_is_visible_wasm = Module["_ts_language_type_is_visible_wasm"] = (a0, a1) => (_ts_language_type_is_visible_wasm = Module["_ts_language_type_is_visible_wasm"] = wasmExports["ts_language_type_is_visible_wasm"])(a0, a1);
        var _ts_tree_root_node_wasm = Module["_ts_tree_root_node_wasm"] = a0 => (_ts_tree_root_node_wasm = Module["_ts_tree_root_node_wasm"] = wasmExports["ts_tree_root_node_wasm"])(a0);
        var _ts_tree_root_node_with_offset_wasm = Module["_ts_tree_root_node_with_offset_wasm"] = a0 => (_ts_tree_root_node_with_offset_wasm = Module["_ts_tree_root_node_with_offset_wasm"] = wasmExports["ts_tree_root_node_with_offset_wasm"])(a0);
        var _ts_tree_edit_wasm = Module["_ts_tree_edit_wasm"] = a0 => (_ts_tree_edit_wasm = Module["_ts_tree_edit_wasm"] = wasmExports["ts_tree_edit_wasm"])(a0);
        var _ts_tree_included_ranges_wasm = Module["_ts_tree_included_ranges_wasm"] = a0 => (_ts_tree_included_ranges_wasm = Module["_ts_tree_included_ranges_wasm"] = wasmExports["ts_tree_included_ranges_wasm"])(a0);
        var _ts_tree_get_changed_ranges_wasm = Module["_ts_tree_get_changed_ranges_wasm"] = (a0, a1) => (_ts_tree_get_changed_ranges_wasm = Module["_ts_tree_get_changed_ranges_wasm"] = wasmExports["ts_tree_get_changed_ranges_wasm"])(a0, a1);
        var _ts_tree_cursor_new_wasm = Module["_ts_tree_cursor_new_wasm"] = a0 => (_ts_tree_cursor_new_wasm = Module["_ts_tree_cursor_new_wasm"] = wasmExports["ts_tree_cursor_new_wasm"])(a0);
        var _ts_tree_cursor_delete_wasm = Module["_ts_tree_cursor_delete_wasm"] = a0 => (_ts_tree_cursor_delete_wasm = Module["_ts_tree_cursor_delete_wasm"] = wasmExports["ts_tree_cursor_delete_wasm"])(a0);
        var _ts_tree_cursor_reset_wasm = Module["_ts_tree_cursor_reset_wasm"] = a0 => (_ts_tree_cursor_reset_wasm = Module["_ts_tree_cursor_reset_wasm"] = wasmExports["ts_tree_cursor_reset_wasm"])(a0);
        var _ts_tree_cursor_reset_to_wasm = Module["_ts_tree_cursor_reset_to_wasm"] = (a0, a1) => (_ts_tree_cursor_reset_to_wasm = Module["_ts_tree_cursor_reset_to_wasm"] = wasmExports["ts_tree_cursor_reset_to_wasm"])(a0, a1);
        var _ts_tree_cursor_goto_first_child_wasm = Module["_ts_tree_cursor_goto_first_child_wasm"] = a0 => (_ts_tree_cursor_goto_first_child_wasm = Module["_ts_tree_cursor_goto_first_child_wasm"] = wasmExports["ts_tree_cursor_goto_first_child_wasm"])(a0);
        var _ts_tree_cursor_goto_last_child_wasm = Module["_ts_tree_cursor_goto_last_child_wasm"] = a0 => (_ts_tree_cursor_goto_last_child_wasm = Module["_ts_tree_cursor_goto_last_child_wasm"] = wasmExports["ts_tree_cursor_goto_last_child_wasm"])(a0);
        var _ts_tree_cursor_goto_first_child_for_index_wasm = Module["_ts_tree_cursor_goto_first_child_for_index_wasm"] = a0 => (_ts_tree_cursor_goto_first_child_for_index_wasm = Module["_ts_tree_cursor_goto_first_child_for_index_wasm"] = wasmExports["ts_tree_cursor_goto_first_child_for_index_wasm"])(a0);
        var _ts_tree_cursor_goto_first_child_for_position_wasm = Module["_ts_tree_cursor_goto_first_child_for_position_wasm"] = a0 => (_ts_tree_cursor_goto_first_child_for_position_wasm = Module["_ts_tree_cursor_goto_first_child_for_position_wasm"] = wasmExports["ts_tree_cursor_goto_first_child_for_position_wasm"])(a0);
        var _ts_tree_cursor_goto_next_sibling_wasm = Module["_ts_tree_cursor_goto_next_sibling_wasm"] = a0 => (_ts_tree_cursor_goto_next_sibling_wasm = Module["_ts_tree_cursor_goto_next_sibling_wasm"] = wasmExports["ts_tree_cursor_goto_next_sibling_wasm"])(a0);
        var _ts_tree_cursor_goto_previous_sibling_wasm = Module["_ts_tree_cursor_goto_previous_sibling_wasm"] = a0 => (_ts_tree_cursor_goto_previous_sibling_wasm = Module["_ts_tree_cursor_goto_previous_sibling_wasm"] = wasmExports["ts_tree_cursor_goto_previous_sibling_wasm"])(a0);
        var _ts_tree_cursor_goto_descendant_wasm = Module["_ts_tree_cursor_goto_descendant_wasm"] = (a0, a1) => (_ts_tree_cursor_goto_descendant_wasm = Module["_ts_tree_cursor_goto_descendant_wasm"] = wasmExports["ts_tree_cursor_goto_descendant_wasm"])(a0, a1);
        var _ts_tree_cursor_goto_parent_wasm = Module["_ts_tree_cursor_goto_parent_wasm"] = a0 => (_ts_tree_cursor_goto_parent_wasm = Module["_ts_tree_cursor_goto_parent_wasm"] = wasmExports["ts_tree_cursor_goto_parent_wasm"])(a0);
        var _ts_tree_cursor_current_node_type_id_wasm = Module["_ts_tree_cursor_current_node_type_id_wasm"] = a0 => (_ts_tree_cursor_current_node_type_id_wasm = Module["_ts_tree_cursor_current_node_type_id_wasm"] = wasmExports["ts_tree_cursor_current_node_type_id_wasm"])(a0);
        var _ts_tree_cursor_current_node_state_id_wasm = Module["_ts_tree_cursor_current_node_state_id_wasm"] = a0 => (_ts_tree_cursor_current_node_state_id_wasm = Module["_ts_tree_cursor_current_node_state_id_wasm"] = wasmExports["ts_tree_cursor_current_node_state_id_wasm"])(a0);
        var _ts_tree_cursor_current_node_is_named_wasm = Module["_ts_tree_cursor_current_node_is_named_wasm"] = a0 => (_ts_tree_cursor_current_node_is_named_wasm = Module["_ts_tree_cursor_current_node_is_named_wasm"] = wasmExports["ts_tree_cursor_current_node_is_named_wasm"])(a0);
        var _ts_tree_cursor_current_node_is_missing_wasm = Module["_ts_tree_cursor_current_node_is_missing_wasm"] = a0 => (_ts_tree_cursor_current_node_is_missing_wasm = Module["_ts_tree_cursor_current_node_is_missing_wasm"] = wasmExports["ts_tree_cursor_current_node_is_missing_wasm"])(a0);
        var _ts_tree_cursor_current_node_id_wasm = Module["_ts_tree_cursor_current_node_id_wasm"] = a0 => (_ts_tree_cursor_current_node_id_wasm = Module["_ts_tree_cursor_current_node_id_wasm"] = wasmExports["ts_tree_cursor_current_node_id_wasm"])(a0);
        var _ts_tree_cursor_start_position_wasm = Module["_ts_tree_cursor_start_position_wasm"] = a0 => (_ts_tree_cursor_start_position_wasm = Module["_ts_tree_cursor_start_position_wasm"] = wasmExports["ts_tree_cursor_start_position_wasm"])(a0);
        var _ts_tree_cursor_end_position_wasm = Module["_ts_tree_cursor_end_position_wasm"] = a0 => (_ts_tree_cursor_end_position_wasm = Module["_ts_tree_cursor_end_position_wasm"] = wasmExports["ts_tree_cursor_end_position_wasm"])(a0);
        var _ts_tree_cursor_start_index_wasm = Module["_ts_tree_cursor_start_index_wasm"] = a0 => (_ts_tree_cursor_start_index_wasm = Module["_ts_tree_cursor_start_index_wasm"] = wasmExports["ts_tree_cursor_start_index_wasm"])(a0);
        var _ts_tree_cursor_end_index_wasm = Module["_ts_tree_cursor_end_index_wasm"] = a0 => (_ts_tree_cursor_end_index_wasm = Module["_ts_tree_cursor_end_index_wasm"] = wasmExports["ts_tree_cursor_end_index_wasm"])(a0);
        var _ts_tree_cursor_current_field_id_wasm = Module["_ts_tree_cursor_current_field_id_wasm"] = a0 => (_ts_tree_cursor_current_field_id_wasm = Module["_ts_tree_cursor_current_field_id_wasm"] = wasmExports["ts_tree_cursor_current_field_id_wasm"])(a0);
        var _ts_tree_cursor_current_depth_wasm = Module["_ts_tree_cursor_current_depth_wasm"] = a0 => (_ts_tree_cursor_current_depth_wasm = Module["_ts_tree_cursor_current_depth_wasm"] = wasmExports["ts_tree_cursor_current_depth_wasm"])(a0);
        var _ts_tree_cursor_current_descendant_index_wasm = Module["_ts_tree_cursor_current_descendant_index_wasm"] = a0 => (_ts_tree_cursor_current_descendant_index_wasm = Module["_ts_tree_cursor_current_descendant_index_wasm"] = wasmExports["ts_tree_cursor_current_descendant_index_wasm"])(a0);
        var _ts_tree_cursor_current_node_wasm = Module["_ts_tree_cursor_current_node_wasm"] = a0 => (_ts_tree_cursor_current_node_wasm = Module["_ts_tree_cursor_current_node_wasm"] = wasmExports["ts_tree_cursor_current_node_wasm"])(a0);
        var _ts_node_symbol_wasm = Module["_ts_node_symbol_wasm"] = a0 => (_ts_node_symbol_wasm = Module["_ts_node_symbol_wasm"] = wasmExports["ts_node_symbol_wasm"])(a0);
        var _ts_node_field_name_for_child_wasm = Module["_ts_node_field_name_for_child_wasm"] = (a0, a1) => (_ts_node_field_name_for_child_wasm = Module["_ts_node_field_name_for_child_wasm"] = wasmExports["ts_node_field_name_for_child_wasm"])(a0, a1);
        var _ts_node_children_by_field_id_wasm = Module["_ts_node_children_by_field_id_wasm"] = (a0, a1) => (_ts_node_children_by_field_id_wasm = Module["_ts_node_children_by_field_id_wasm"] = wasmExports["ts_node_children_by_field_id_wasm"])(a0, a1);
        var _ts_node_first_child_for_byte_wasm = Module["_ts_node_first_child_for_byte_wasm"] = a0 => (_ts_node_first_child_for_byte_wasm = Module["_ts_node_first_child_for_byte_wasm"] = wasmExports["ts_node_first_child_for_byte_wasm"])(a0);
        var _ts_node_first_named_child_for_byte_wasm = Module["_ts_node_first_named_child_for_byte_wasm"] = a0 => (_ts_node_first_named_child_for_byte_wasm = Module["_ts_node_first_named_child_for_byte_wasm"] = wasmExports["ts_node_first_named_child_for_byte_wasm"])(a0);
        var _ts_node_grammar_symbol_wasm = Module["_ts_node_grammar_symbol_wasm"] = a0 => (_ts_node_grammar_symbol_wasm = Module["_ts_node_grammar_symbol_wasm"] = wasmExports["ts_node_grammar_symbol_wasm"])(a0);
        var _ts_node_child_count_wasm = Module["_ts_node_child_count_wasm"] = a0 => (_ts_node_child_count_wasm = Module["_ts_node_child_count_wasm"] = wasmExports["ts_node_child_count_wasm"])(a0);
        var _ts_node_named_child_count_wasm = Module["_ts_node_named_child_count_wasm"] = a0 => (_ts_node_named_child_count_wasm = Module["_ts_node_named_child_count_wasm"] = wasmExports["ts_node_named_child_count_wasm"])(a0);
        var _ts_node_child_wasm = Module["_ts_node_child_wasm"] = (a0, a1) => (_ts_node_child_wasm = Module["_ts_node_child_wasm"] = wasmExports["ts_node_child_wasm"])(a0, a1);
        var _ts_node_named_child_wasm = Module["_ts_node_named_child_wasm"] = (a0, a1) => (_ts_node_named_child_wasm = Module["_ts_node_named_child_wasm"] = wasmExports["ts_node_named_child_wasm"])(a0, a1);
        var _ts_node_child_by_field_id_wasm = Module["_ts_node_child_by_field_id_wasm"] = (a0, a1) => (_ts_node_child_by_field_id_wasm = Module["_ts_node_child_by_field_id_wasm"] = wasmExports["ts_node_child_by_field_id_wasm"])(a0, a1);
        var _ts_node_next_sibling_wasm = Module["_ts_node_next_sibling_wasm"] = a0 => (_ts_node_next_sibling_wasm = Module["_ts_node_next_sibling_wasm"] = wasmExports["ts_node_next_sibling_wasm"])(a0);
        var _ts_node_prev_sibling_wasm = Module["_ts_node_prev_sibling_wasm"] = a0 => (_ts_node_prev_sibling_wasm = Module["_ts_node_prev_sibling_wasm"] = wasmExports["ts_node_prev_sibling_wasm"])(a0);
        var _ts_node_next_named_sibling_wasm = Module["_ts_node_next_named_sibling_wasm"] = a0 => (_ts_node_next_named_sibling_wasm = Module["_ts_node_next_named_sibling_wasm"] = wasmExports["ts_node_next_named_sibling_wasm"])(a0);
        var _ts_node_prev_named_sibling_wasm = Module["_ts_node_prev_named_sibling_wasm"] = a0 => (_ts_node_prev_named_sibling_wasm = Module["_ts_node_prev_named_sibling_wasm"] = wasmExports["ts_node_prev_named_sibling_wasm"])(a0);
        var _ts_node_descendant_count_wasm = Module["_ts_node_descendant_count_wasm"] = a0 => (_ts_node_descendant_count_wasm = Module["_ts_node_descendant_count_wasm"] = wasmExports["ts_node_descendant_count_wasm"])(a0);
        var _ts_node_parent_wasm = Module["_ts_node_parent_wasm"] = a0 => (_ts_node_parent_wasm = Module["_ts_node_parent_wasm"] = wasmExports["ts_node_parent_wasm"])(a0);
        var _ts_node_descendant_for_index_wasm = Module["_ts_node_descendant_for_index_wasm"] = a0 => (_ts_node_descendant_for_index_wasm = Module["_ts_node_descendant_for_index_wasm"] = wasmExports["ts_node_descendant_for_index_wasm"])(a0);
        var _ts_node_named_descendant_for_index_wasm = Module["_ts_node_named_descendant_for_index_wasm"] = a0 => (_ts_node_named_descendant_for_index_wasm = Module["_ts_node_named_descendant_for_index_wasm"] = wasmExports["ts_node_named_descendant_for_index_wasm"])(a0);
        var _ts_node_descendant_for_position_wasm = Module["_ts_node_descendant_for_position_wasm"] = a0 => (_ts_node_descendant_for_position_wasm = Module["_ts_node_descendant_for_position_wasm"] = wasmExports["ts_node_descendant_for_position_wasm"])(a0);
        var _ts_node_named_descendant_for_position_wasm = Module["_ts_node_named_descendant_for_position_wasm"] = a0 => (_ts_node_named_descendant_for_position_wasm = Module["_ts_node_named_descendant_for_position_wasm"] = wasmExports["ts_node_named_descendant_for_position_wasm"])(a0);
        var _ts_node_start_point_wasm = Module["_ts_node_start_point_wasm"] = a0 => (_ts_node_start_point_wasm = Module["_ts_node_start_point_wasm"] = wasmExports["ts_node_start_point_wasm"])(a0);
        var _ts_node_end_point_wasm = Module["_ts_node_end_point_wasm"] = a0 => (_ts_node_end_point_wasm = Module["_ts_node_end_point_wasm"] = wasmExports["ts_node_end_point_wasm"])(a0);
        var _ts_node_start_index_wasm = Module["_ts_node_start_index_wasm"] = a0 => (_ts_node_start_index_wasm = Module["_ts_node_start_index_wasm"] = wasmExports["ts_node_start_index_wasm"])(a0);
        var _ts_node_end_index_wasm = Module["_ts_node_end_index_wasm"] = a0 => (_ts_node_end_index_wasm = Module["_ts_node_end_index_wasm"] = wasmExports["ts_node_end_index_wasm"])(a0);
        var _ts_node_to_string_wasm = Module["_ts_node_to_string_wasm"] = a0 => (_ts_node_to_string_wasm = Module["_ts_node_to_string_wasm"] = wasmExports["ts_node_to_string_wasm"])(a0);
        var _ts_node_children_wasm = Module["_ts_node_children_wasm"] = a0 => (_ts_node_children_wasm = Module["_ts_node_children_wasm"] = wasmExports["ts_node_children_wasm"])(a0);
        var _ts_node_named_children_wasm = Module["_ts_node_named_children_wasm"] = a0 => (_ts_node_named_children_wasm = Module["_ts_node_named_children_wasm"] = wasmExports["ts_node_named_children_wasm"])(a0);
        var _ts_node_descendants_of_type_wasm = Module["_ts_node_descendants_of_type_wasm"] = (a0, a1, a2, a3, a4, a5, a6) => (_ts_node_descendants_of_type_wasm = Module["_ts_node_descendants_of_type_wasm"] = wasmExports["ts_node_descendants_of_type_wasm"])(a0, a1, a2, a3, a4, a5, a6);
        var _ts_node_is_named_wasm = Module["_ts_node_is_named_wasm"] = a0 => (_ts_node_is_named_wasm = Module["_ts_node_is_named_wasm"] = wasmExports["ts_node_is_named_wasm"])(a0);
        var _ts_node_has_changes_wasm = Module["_ts_node_has_changes_wasm"] = a0 => (_ts_node_has_changes_wasm = Module["_ts_node_has_changes_wasm"] = wasmExports["ts_node_has_changes_wasm"])(a0);
        var _ts_node_has_error_wasm = Module["_ts_node_has_error_wasm"] = a0 => (_ts_node_has_error_wasm = Module["_ts_node_has_error_wasm"] = wasmExports["ts_node_has_error_wasm"])(a0);
        var _ts_node_is_error_wasm = Module["_ts_node_is_error_wasm"] = a0 => (_ts_node_is_error_wasm = Module["_ts_node_is_error_wasm"] = wasmExports["ts_node_is_error_wasm"])(a0);
        var _ts_node_is_missing_wasm = Module["_ts_node_is_missing_wasm"] = a0 => (_ts_node_is_missing_wasm = Module["_ts_node_is_missing_wasm"] = wasmExports["ts_node_is_missing_wasm"])(a0);
        var _ts_node_is_extra_wasm = Module["_ts_node_is_extra_wasm"] = a0 => (_ts_node_is_extra_wasm = Module["_ts_node_is_extra_wasm"] = wasmExports["ts_node_is_extra_wasm"])(a0);
        var _ts_node_parse_state_wasm = Module["_ts_node_parse_state_wasm"] = a0 => (_ts_node_parse_state_wasm = Module["_ts_node_parse_state_wasm"] = wasmExports["ts_node_parse_state_wasm"])(a0);
        var _ts_node_next_parse_state_wasm = Module["_ts_node_next_parse_state_wasm"] = a0 => (_ts_node_next_parse_state_wasm = Module["_ts_node_next_parse_state_wasm"] = wasmExports["ts_node_next_parse_state_wasm"])(a0);
        var _ts_query_matches_wasm = Module["_ts_query_matches_wasm"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) => (_ts_query_matches_wasm = Module["_ts_query_matches_wasm"] = wasmExports["ts_query_matches_wasm"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
        var _ts_query_captures_wasm = Module["_ts_query_captures_wasm"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) => (_ts_query_captures_wasm = Module["_ts_query_captures_wasm"] = wasmExports["ts_query_captures_wasm"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
        var _iswalpha = Module["_iswalpha"] = a0 => (_iswalpha = Module["_iswalpha"] = wasmExports["iswalpha"])(a0);
        var _iswblank = Module["_iswblank"] = a0 => (_iswblank = Module["_iswblank"] = wasmExports["iswblank"])(a0);
        var _iswdigit = Module["_iswdigit"] = a0 => (_iswdigit = Module["_iswdigit"] = wasmExports["iswdigit"])(a0);
        var _iswlower = Module["_iswlower"] = a0 => (_iswlower = Module["_iswlower"] = wasmExports["iswlower"])(a0);
        var _iswupper = Module["_iswupper"] = a0 => (_iswupper = Module["_iswupper"] = wasmExports["iswupper"])(a0);
        var _iswxdigit = Module["_iswxdigit"] = a0 => (_iswxdigit = Module["_iswxdigit"] = wasmExports["iswxdigit"])(a0);
        var _memchr = Module["_memchr"] = (a0, a1, a2) => (_memchr = Module["_memchr"] = wasmExports["memchr"])(a0, a1, a2);
        var _strlen = Module["_strlen"] = a0 => (_strlen = Module["_strlen"] = wasmExports["strlen"])(a0);
        var _strcmp = Module["_strcmp"] = (a0, a1) => (_strcmp = Module["_strcmp"] = wasmExports["strcmp"])(a0, a1);
        var _strncat = Module["_strncat"] = (a0, a1, a2) => (_strncat = Module["_strncat"] = wasmExports["strncat"])(a0, a1, a2);
        var _strncpy = Module["_strncpy"] = (a0, a1, a2) => (_strncpy = Module["_strncpy"] = wasmExports["strncpy"])(a0, a1, a2);
        var _towlower = Module["_towlower"] = a0 => (_towlower = Module["_towlower"] = wasmExports["towlower"])(a0);
        var _towupper = Module["_towupper"] = a0 => (_towupper = Module["_towupper"] = wasmExports["towupper"])(a0);
        var _setThrew = (a0, a1) => (_setThrew = wasmExports["setThrew"])(a0, a1);
        var __emscripten_stack_restore = a0 => (__emscripten_stack_restore = wasmExports["_emscripten_stack_restore"])(a0);
        var __emscripten_stack_alloc = a0 => (__emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"])(a0);
        var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
        var dynCall_jiji = Module["dynCall_jiji"] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module["dynCall_jiji"] = wasmExports["dynCall_jiji"])(a0, a1, a2, a3, a4);
        var _orig$ts_parser_timeout_micros = Module["_orig$ts_parser_timeout_micros"] = a0 => (_orig$ts_parser_timeout_micros = Module["_orig$ts_parser_timeout_micros"] = wasmExports["orig$ts_parser_timeout_micros"])(a0);
        var _orig$ts_parser_set_timeout_micros = Module["_orig$ts_parser_set_timeout_micros"] = (a0, a1) => (_orig$ts_parser_set_timeout_micros = Module["_orig$ts_parser_set_timeout_micros"] = wasmExports["orig$ts_parser_set_timeout_micros"])(a0, a1);
        // include: postamble.js
        // === Auto-generated postamble setup entry stuff ===
        Module["AsciiToString"] = AsciiToString;
        Module["stringToUTF16"] = stringToUTF16;
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
          if (!calledRun) run();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        // try this again later, after new deps are fulfilled
        function callMain(args = []) {
          var entryFunction = resolveGlobalSymbol("main").sym;
          // Main modules can't tell if they have main() at compile time, since it may
          // arrive from a dynamic library.
          if (!entryFunction) return;
          args.unshift(thisProgram);
          var argc = args.length;
          var argv = stackAlloc((argc + 1) * 4);
          var argv_ptr = argv;
          args.forEach(arg => {
            LE_HEAP_STORE_U32(((argv_ptr) >> 2) * 4, stringToUTF8OnStack(arg));
            argv_ptr += 4;
          });
          LE_HEAP_STORE_U32(((argv_ptr) >> 2) * 4, 0);
          try {
            var ret = entryFunction(argc, argv);
            // if we're not running an evented main loop, it's time to exit
            exitJS(ret, /* implicit = */ true);
            return ret;
          } catch (e) {
            return handleException(e);
          }
        }
        function run(args = arguments_) {
          if (runDependencies > 0) {
            return;
          }
          preRun();
          // a preRun added a dependency, run will be called later
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            // run may have just been called through dependencies being fulfilled just in this very frame,
            // or while the async setStatus time below was happening
            if (calledRun) return;
            calledRun = true;
            Module["calledRun"] = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            Module["onRuntimeInitialized"]?.();
            if (shouldRunNow) callMain(args);
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        // shouldRunNow refers to calling main(), not run().
        var shouldRunNow = true;
        if (Module["noInitialRun"]) shouldRunNow = false;
        run();
        // end include: postamble.js
        // include: /src/lib/binding_web/binding.js
        /* eslint-disable-next-line spaced-comment */ /// <reference types="emscripten" />
        /* eslint-disable-next-line spaced-comment */ /// <reference path="tree-sitter-web.d.ts"/>
        const C = Module;
        const INTERNAL = {};
        const SIZE_OF_INT = 4;
        const SIZE_OF_CURSOR = 4 * SIZE_OF_INT;
        const SIZE_OF_NODE = 5 * SIZE_OF_INT;
        const SIZE_OF_POINT = 2 * SIZE_OF_INT;
        const SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT;
        const ZERO_POINT = {
          row: 0,
          column: 0
        };
        const QUERY_WORD_REGEX = /[\w-.]*/g;
        const PREDICATE_STEP_TYPE_CAPTURE = 1;
        const PREDICATE_STEP_TYPE_STRING = 2;
        const LANGUAGE_FUNCTION_REGEX = /^_?tree_sitter_\w+/;
        let VERSION;
        let MIN_COMPATIBLE_VERSION;
        let TRANSFER_BUFFER;
        let currentParseCallback;
        // eslint-disable-next-line no-unused-vars
        let currentLogCallback;
        // eslint-disable-next-line no-unused-vars
        class ParserImpl {
          static init() {
            TRANSFER_BUFFER = C._ts_init();
            VERSION = getValue(TRANSFER_BUFFER, "i32");
            MIN_COMPATIBLE_VERSION = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
          }
          initialize() {
            C._ts_parser_new_wasm();
            this[0] = getValue(TRANSFER_BUFFER, "i32");
            this[1] = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
          }
          delete() {
            C._ts_parser_delete(this[0]);
            C._free(this[1]);
            this[0] = 0;
            this[1] = 0;
          }
          setLanguage(language) {
            let address;
            if (!language) {
              address = 0;
              language = null;
            } else if (language.constructor === Language) {
              address = language[0];
              const version = C._ts_language_version(address);
              if (version < MIN_COMPATIBLE_VERSION || VERSION < version) {
                throw new Error(`Incompatible language version ${version}. ` + `Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`);
              }
            } else {
              throw new Error("Argument must be a Language");
            }
            this.language = language;
            C._ts_parser_set_language(this[0], address);
            return this;
          }
          getLanguage() {
            return this.language;
          }
          parse(callback, oldTree, options) {
            if (typeof callback === "string") {
              currentParseCallback = (index, _) => callback.slice(index);
            } else if (typeof callback === "function") {
              currentParseCallback = callback;
            } else {
              throw new Error("Argument must be a string or a function");
            }
            if (this.logCallback) {
              currentLogCallback = this.logCallback;
              C._ts_parser_enable_logger_wasm(this[0], 1);
            } else {
              currentLogCallback = null;
              C._ts_parser_enable_logger_wasm(this[0], 0);
            }
            let rangeCount = 0;
            let rangeAddress = 0;
            if (options?.includedRanges) {
              rangeCount = options.includedRanges.length;
              rangeAddress = C._calloc(rangeCount, SIZE_OF_RANGE);
              let address = rangeAddress;
              for (let i = 0; i < rangeCount; i++) {
                marshalRange(address, options.includedRanges[i]);
                address += SIZE_OF_RANGE;
              }
            }
            const treeAddress = C._ts_parser_parse_wasm(this[0], this[1], oldTree ? oldTree[0] : 0, rangeAddress, rangeCount);
            if (!treeAddress) {
              currentParseCallback = null;
              currentLogCallback = null;
              throw new Error("Parsing failed");
            }
            const result = new Tree(INTERNAL, treeAddress, this.language, currentParseCallback);
            currentParseCallback = null;
            currentLogCallback = null;
            return result;
          }
          reset() {
            C._ts_parser_reset(this[0]);
          }
          getIncludedRanges() {
            C._ts_parser_included_ranges_wasm(this[0]);
            const count = getValue(TRANSFER_BUFFER, "i32");
            const buffer = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const result = new Array(count);
            if (count > 0) {
              let address = buffer;
              for (let i = 0; i < count; i++) {
                result[i] = unmarshalRange(address);
                address += SIZE_OF_RANGE;
              }
              C._free(buffer);
            }
            return result;
          }
          getTimeoutMicros() {
            return C._ts_parser_timeout_micros(this[0]);
          }
          setTimeoutMicros(timeout) {
            C._ts_parser_set_timeout_micros(this[0], timeout);
          }
          setLogger(callback) {
            if (!callback) {
              callback = null;
            } else if (typeof callback !== "function") {
              throw new Error("Logger callback must be a function");
            }
            this.logCallback = callback;
            return this;
          }
          getLogger() {
            return this.logCallback;
          }
        }
        class Tree {
          constructor(internal, address, language, textCallback) {
            assertInternal(internal);
            this[0] = address;
            this.language = language;
            this.textCallback = textCallback;
          }
          copy() {
            const address = C._ts_tree_copy(this[0]);
            return new Tree(INTERNAL, address, this.language, this.textCallback);
          }
          delete() {
            C._ts_tree_delete(this[0]);
            this[0] = 0;
          }
          edit(edit) {
            marshalEdit(edit);
            C._ts_tree_edit_wasm(this[0]);
          }
          get rootNode() {
            C._ts_tree_root_node_wasm(this[0]);
            return unmarshalNode(this);
          }
          rootNodeWithOffset(offsetBytes, offsetExtent) {
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(address, offsetBytes, "i32");
            marshalPoint(address + SIZE_OF_INT, offsetExtent);
            C._ts_tree_root_node_with_offset_wasm(this[0]);
            return unmarshalNode(this);
          }
          getLanguage() {
            return this.language;
          }
          walk() {
            return this.rootNode.walk();
          }
          getChangedRanges(other) {
            if (other.constructor !== Tree) {
              throw new TypeError("Argument must be a Tree");
            }
            C._ts_tree_get_changed_ranges_wasm(this[0], other[0]);
            const count = getValue(TRANSFER_BUFFER, "i32");
            const buffer = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const result = new Array(count);
            if (count > 0) {
              let address = buffer;
              for (let i = 0; i < count; i++) {
                result[i] = unmarshalRange(address);
                address += SIZE_OF_RANGE;
              }
              C._free(buffer);
            }
            return result;
          }
          getIncludedRanges() {
            C._ts_tree_included_ranges_wasm(this[0]);
            const count = getValue(TRANSFER_BUFFER, "i32");
            const buffer = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const result = new Array(count);
            if (count > 0) {
              let address = buffer;
              for (let i = 0; i < count; i++) {
                result[i] = unmarshalRange(address);
                address += SIZE_OF_RANGE;
              }
              C._free(buffer);
            }
            return result;
          }
        }
        class Node {
          constructor(internal, tree) {
            assertInternal(internal);
            this.tree = tree;
          }
          get typeId() {
            marshalNode(this);
            return C._ts_node_symbol_wasm(this.tree[0]);
          }
          get grammarId() {
            marshalNode(this);
            return C._ts_node_grammar_symbol_wasm(this.tree[0]);
          }
          get type() {
            return this.tree.language.types[this.typeId] || "ERROR";
          }
          get grammarType() {
            return this.tree.language.types[this.grammarId] || "ERROR";
          }
          get endPosition() {
            marshalNode(this);
            C._ts_node_end_point_wasm(this.tree[0]);
            return unmarshalPoint(TRANSFER_BUFFER);
          }
          get endIndex() {
            marshalNode(this);
            return C._ts_node_end_index_wasm(this.tree[0]);
          }
          get text() {
            return getText(this.tree, this.startIndex, this.endIndex);
          }
          get parseState() {
            marshalNode(this);
            return C._ts_node_parse_state_wasm(this.tree[0]);
          }
          get nextParseState() {
            marshalNode(this);
            return C._ts_node_next_parse_state_wasm(this.tree[0]);
          }
          get isNamed() {
            marshalNode(this);
            return C._ts_node_is_named_wasm(this.tree[0]) === 1;
          }
          get hasError() {
            marshalNode(this);
            return C._ts_node_has_error_wasm(this.tree[0]) === 1;
          }
          get hasChanges() {
            marshalNode(this);
            return C._ts_node_has_changes_wasm(this.tree[0]) === 1;
          }
          get isError() {
            marshalNode(this);
            return C._ts_node_is_error_wasm(this.tree[0]) === 1;
          }
          get isMissing() {
            marshalNode(this);
            return C._ts_node_is_missing_wasm(this.tree[0]) === 1;
          }
          get isExtra() {
            marshalNode(this);
            return C._ts_node_is_extra_wasm(this.tree[0]) === 1;
          }
          equals(other) {
            return this.id === other.id;
          }
          child(index) {
            marshalNode(this);
            C._ts_node_child_wasm(this.tree[0], index);
            return unmarshalNode(this.tree);
          }
          namedChild(index) {
            marshalNode(this);
            C._ts_node_named_child_wasm(this.tree[0], index);
            return unmarshalNode(this.tree);
          }
          childForFieldId(fieldId) {
            marshalNode(this);
            C._ts_node_child_by_field_id_wasm(this.tree[0], fieldId);
            return unmarshalNode(this.tree);
          }
          childForFieldName(fieldName) {
            const fieldId = this.tree.language.fields.indexOf(fieldName);
            if (fieldId !== -1) return this.childForFieldId(fieldId);
            return null;
          }
          fieldNameForChild(index) {
            marshalNode(this);
            const address = C._ts_node_field_name_for_child_wasm(this.tree[0], index);
            if (!address) {
              return null;
            }
            const result = AsciiToString(address);
            // must not free, the string memory is owned by the language
            return result;
          }
          childrenForFieldName(fieldName) {
            const fieldId = this.tree.language.fields.indexOf(fieldName);
            if (fieldId !== -1 && fieldId !== 0) return this.childrenForFieldId(fieldId);
            return [];
          }
          childrenForFieldId(fieldId) {
            marshalNode(this);
            C._ts_node_children_by_field_id_wasm(this.tree[0], fieldId);
            const count = getValue(TRANSFER_BUFFER, "i32");
            const buffer = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const result = new Array(count);
            if (count > 0) {
              let address = buffer;
              for (let i = 0; i < count; i++) {
                result[i] = unmarshalNode(this.tree, address);
                address += SIZE_OF_NODE;
              }
              C._free(buffer);
            }
            return result;
          }
          firstChildForIndex(index) {
            marshalNode(this);
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(address, index, "i32");
            C._ts_node_first_child_for_byte_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          firstNamedChildForIndex(index) {
            marshalNode(this);
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(address, index, "i32");
            C._ts_node_first_named_child_for_byte_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get childCount() {
            marshalNode(this);
            return C._ts_node_child_count_wasm(this.tree[0]);
          }
          get namedChildCount() {
            marshalNode(this);
            return C._ts_node_named_child_count_wasm(this.tree[0]);
          }
          get firstChild() {
            return this.child(0);
          }
          get firstNamedChild() {
            return this.namedChild(0);
          }
          get lastChild() {
            return this.child(this.childCount - 1);
          }
          get lastNamedChild() {
            return this.namedChild(this.namedChildCount - 1);
          }
          get children() {
            if (!this._children) {
              marshalNode(this);
              C._ts_node_children_wasm(this.tree[0]);
              const count = getValue(TRANSFER_BUFFER, "i32");
              const buffer = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              this._children = new Array(count);
              if (count > 0) {
                let address = buffer;
                for (let i = 0; i < count; i++) {
                  this._children[i] = unmarshalNode(this.tree, address);
                  address += SIZE_OF_NODE;
                }
                C._free(buffer);
              }
            }
            return this._children;
          }
          get namedChildren() {
            if (!this._namedChildren) {
              marshalNode(this);
              C._ts_node_named_children_wasm(this.tree[0]);
              const count = getValue(TRANSFER_BUFFER, "i32");
              const buffer = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              this._namedChildren = new Array(count);
              if (count > 0) {
                let address = buffer;
                for (let i = 0; i < count; i++) {
                  this._namedChildren[i] = unmarshalNode(this.tree, address);
                  address += SIZE_OF_NODE;
                }
                C._free(buffer);
              }
            }
            return this._namedChildren;
          }
          descendantsOfType(types, startPosition, endPosition) {
            if (!Array.isArray(types)) types = [ types ];
            if (!startPosition) startPosition = ZERO_POINT;
            if (!endPosition) endPosition = ZERO_POINT;
            // Convert the type strings to numeric type symbols.
            const symbols = [];
            const typesBySymbol = this.tree.language.types;
            for (let i = 0, n = typesBySymbol.length; i < n; i++) {
              if (types.includes(typesBySymbol[i])) {
                symbols.push(i);
              }
            }
            // Copy the array of symbols to the WASM heap.
            const symbolsAddress = C._malloc(SIZE_OF_INT * symbols.length);
            for (let i = 0, n = symbols.length; i < n; i++) {
              setValue(symbolsAddress + i * SIZE_OF_INT, symbols[i], "i32");
            }
            // Call the C API to compute the descendants.
            marshalNode(this);
            C._ts_node_descendants_of_type_wasm(this.tree[0], symbolsAddress, symbols.length, startPosition.row, startPosition.column, endPosition.row, endPosition.column);
            // Instantiate the nodes based on the data returned.
            const descendantCount = getValue(TRANSFER_BUFFER, "i32");
            const descendantAddress = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const result = new Array(descendantCount);
            if (descendantCount > 0) {
              let address = descendantAddress;
              for (let i = 0; i < descendantCount; i++) {
                result[i] = unmarshalNode(this.tree, address);
                address += SIZE_OF_NODE;
              }
            }
            // Free the intermediate buffers
            C._free(descendantAddress);
            C._free(symbolsAddress);
            return result;
          }
          get nextSibling() {
            marshalNode(this);
            C._ts_node_next_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get previousSibling() {
            marshalNode(this);
            C._ts_node_prev_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get nextNamedSibling() {
            marshalNode(this);
            C._ts_node_next_named_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get previousNamedSibling() {
            marshalNode(this);
            C._ts_node_prev_named_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get descendantCount() {
            marshalNode(this);
            return C._ts_node_descendant_count_wasm(this.tree[0]);
          }
          get parent() {
            marshalNode(this);
            C._ts_node_parent_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          descendantForIndex(start, end = start) {
            if (typeof start !== "number" || typeof end !== "number") {
              throw new Error("Arguments must be numbers");
            }
            marshalNode(this);
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(address, start, "i32");
            setValue(address + SIZE_OF_INT, end, "i32");
            C._ts_node_descendant_for_index_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          namedDescendantForIndex(start, end = start) {
            if (typeof start !== "number" || typeof end !== "number") {
              throw new Error("Arguments must be numbers");
            }
            marshalNode(this);
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(address, start, "i32");
            setValue(address + SIZE_OF_INT, end, "i32");
            C._ts_node_named_descendant_for_index_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          descendantForPosition(start, end = start) {
            if (!isPoint(start) || !isPoint(end)) {
              throw new Error("Arguments must be {row, column} objects");
            }
            marshalNode(this);
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            marshalPoint(address, start);
            marshalPoint(address + SIZE_OF_POINT, end);
            C._ts_node_descendant_for_position_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          namedDescendantForPosition(start, end = start) {
            if (!isPoint(start) || !isPoint(end)) {
              throw new Error("Arguments must be {row, column} objects");
            }
            marshalNode(this);
            const address = TRANSFER_BUFFER + SIZE_OF_NODE;
            marshalPoint(address, start);
            marshalPoint(address + SIZE_OF_POINT, end);
            C._ts_node_named_descendant_for_position_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          walk() {
            marshalNode(this);
            C._ts_tree_cursor_new_wasm(this.tree[0]);
            return new TreeCursor(INTERNAL, this.tree);
          }
          toString() {
            marshalNode(this);
            const address = C._ts_node_to_string_wasm(this.tree[0]);
            const result = AsciiToString(address);
            C._free(address);
            return result;
          }
        }
        class TreeCursor {
          constructor(internal, tree) {
            assertInternal(internal);
            this.tree = tree;
            unmarshalTreeCursor(this);
          }
          delete() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_delete_wasm(this.tree[0]);
            this[0] = this[1] = this[2] = 0;
          }
          reset(node) {
            marshalNode(node);
            marshalTreeCursor(this, TRANSFER_BUFFER + SIZE_OF_NODE);
            C._ts_tree_cursor_reset_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
          }
          resetTo(cursor) {
            marshalTreeCursor(this, TRANSFER_BUFFER);
            marshalTreeCursor(cursor, TRANSFER_BUFFER + SIZE_OF_CURSOR);
            C._ts_tree_cursor_reset_to_wasm(this.tree[0], cursor.tree[0]);
            unmarshalTreeCursor(this);
          }
          get nodeType() {
            return this.tree.language.types[this.nodeTypeId] || "ERROR";
          }
          get nodeTypeId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
          }
          get nodeStateId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_state_id_wasm(this.tree[0]);
          }
          get nodeId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
          }
          get nodeIsNamed() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1;
          }
          get nodeIsMissing() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1;
          }
          get nodeText() {
            marshalTreeCursor(this);
            const startIndex = C._ts_tree_cursor_start_index_wasm(this.tree[0]);
            const endIndex = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
            return getText(this.tree, startIndex, endIndex);
          }
          get startPosition() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_start_position_wasm(this.tree[0]);
            return unmarshalPoint(TRANSFER_BUFFER);
          }
          get endPosition() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_end_position_wasm(this.tree[0]);
            return unmarshalPoint(TRANSFER_BUFFER);
          }
          get startIndex() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_start_index_wasm(this.tree[0]);
          }
          get endIndex() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_end_index_wasm(this.tree[0]);
          }
          get currentNode() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_current_node_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get currentFieldId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
          }
          get currentFieldName() {
            return this.tree.language.fields[this.currentFieldId];
          }
          get currentDepth() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_depth_wasm(this.tree[0]);
          }
          get currentDescendantIndex() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_descendant_index_wasm(this.tree[0]);
          }
          gotoFirstChild() {
            marshalTreeCursor(this);
            const result = C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
          gotoLastChild() {
            marshalTreeCursor(this);
            const result = C._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
          gotoFirstChildForIndex(goalIndex) {
            marshalTreeCursor(this);
            setValue(TRANSFER_BUFFER + SIZE_OF_CURSOR, goalIndex, "i32");
            const result = C._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
          gotoFirstChildForPosition(goalPosition) {
            marshalTreeCursor(this);
            marshalPoint(TRANSFER_BUFFER + SIZE_OF_CURSOR, goalPosition);
            const result = C._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
          gotoNextSibling() {
            marshalTreeCursor(this);
            const result = C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
          gotoPreviousSibling() {
            marshalTreeCursor(this);
            const result = C._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
          gotoDescendant(goalDescendantindex) {
            marshalTreeCursor(this);
            C._ts_tree_cursor_goto_descendant_wasm(this.tree[0], goalDescendantindex);
            unmarshalTreeCursor(this);
          }
          gotoParent() {
            marshalTreeCursor(this);
            const result = C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return result === 1;
          }
        }
        class Language {
          constructor(internal, address) {
            assertInternal(internal);
            this[0] = address;
            this.types = new Array(C._ts_language_symbol_count(this[0]));
            for (let i = 0, n = this.types.length; i < n; i++) {
              if (C._ts_language_symbol_type(this[0], i) < 2) {
                this.types[i] = UTF8ToString(C._ts_language_symbol_name(this[0], i));
              }
            }
            this.fields = new Array(C._ts_language_field_count(this[0]) + 1);
            for (let i = 0, n = this.fields.length; i < n; i++) {
              const fieldName = C._ts_language_field_name_for_id(this[0], i);
              if (fieldName !== 0) {
                this.fields[i] = UTF8ToString(fieldName);
              } else {
                this.fields[i] = null;
              }
            }
          }
          get version() {
            return C._ts_language_version(this[0]);
          }
          get fieldCount() {
            return this.fields.length - 1;
          }
          get stateCount() {
            return C._ts_language_state_count(this[0]);
          }
          fieldIdForName(fieldName) {
            const result = this.fields.indexOf(fieldName);
            if (result !== -1) {
              return result;
            } else {
              return null;
            }
          }
          fieldNameForId(fieldId) {
            return this.fields[fieldId] || null;
          }
          idForNodeType(type, named) {
            const typeLength = lengthBytesUTF8(type);
            const typeAddress = C._malloc(typeLength + 1);
            stringToUTF8(type, typeAddress, typeLength + 1);
            const result = C._ts_language_symbol_for_name(this[0], typeAddress, typeLength, named);
            C._free(typeAddress);
            return result || null;
          }
          get nodeTypeCount() {
            return C._ts_language_symbol_count(this[0]);
          }
          nodeTypeForId(typeId) {
            const name = C._ts_language_symbol_name(this[0], typeId);
            return name ? UTF8ToString(name) : null;
          }
          nodeTypeIsNamed(typeId) {
            return C._ts_language_type_is_named_wasm(this[0], typeId) ? true : false;
          }
          nodeTypeIsVisible(typeId) {
            return C._ts_language_type_is_visible_wasm(this[0], typeId) ? true : false;
          }
          nextState(stateId, typeId) {
            return C._ts_language_next_state(this[0], stateId, typeId);
          }
          lookaheadIterator(stateId) {
            const address = C._ts_lookahead_iterator_new(this[0], stateId);
            if (address) return new LookaheadIterable(INTERNAL, address, this);
            return null;
          }
          query(source) {
            const sourceLength = lengthBytesUTF8(source);
            const sourceAddress = C._malloc(sourceLength + 1);
            stringToUTF8(source, sourceAddress, sourceLength + 1);
            const address = C._ts_query_new(this[0], sourceAddress, sourceLength, TRANSFER_BUFFER, TRANSFER_BUFFER + SIZE_OF_INT);
            if (!address) {
              const errorId = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              const errorByte = getValue(TRANSFER_BUFFER, "i32");
              const errorIndex = UTF8ToString(sourceAddress, errorByte).length;
              const suffix = source.substr(errorIndex, 100).split("\n")[0];
              let word = suffix.match(QUERY_WORD_REGEX)[0];
              let error;
              switch (errorId) {
               case 2:
                error = new RangeError(`Bad node name '${word}'`);
                break;

               case 3:
                error = new RangeError(`Bad field name '${word}'`);
                break;

               case 4:
                error = new RangeError(`Bad capture name @${word}`);
                break;

               case 5:
                error = new TypeError(`Bad pattern structure at offset ${errorIndex}: '${suffix}'...`);
                word = "";
                break;

               default:
                error = new SyntaxError(`Bad syntax at offset ${errorIndex}: '${suffix}'...`);
                word = "";
                break;
              }
              error.index = errorIndex;
              error.length = word.length;
              C._free(sourceAddress);
              throw error;
            }
            const stringCount = C._ts_query_string_count(address);
            const captureCount = C._ts_query_capture_count(address);
            const patternCount = C._ts_query_pattern_count(address);
            const captureNames = new Array(captureCount);
            const stringValues = new Array(stringCount);
            for (let i = 0; i < captureCount; i++) {
              const nameAddress = C._ts_query_capture_name_for_id(address, i, TRANSFER_BUFFER);
              const nameLength = getValue(TRANSFER_BUFFER, "i32");
              captureNames[i] = UTF8ToString(nameAddress, nameLength);
            }
            for (let i = 0; i < stringCount; i++) {
              const valueAddress = C._ts_query_string_value_for_id(address, i, TRANSFER_BUFFER);
              const nameLength = getValue(TRANSFER_BUFFER, "i32");
              stringValues[i] = UTF8ToString(valueAddress, nameLength);
            }
            const setProperties = new Array(patternCount);
            const assertedProperties = new Array(patternCount);
            const refutedProperties = new Array(patternCount);
            const predicates = new Array(patternCount);
            const textPredicates = new Array(patternCount);
            for (let i = 0; i < patternCount; i++) {
              const predicatesAddress = C._ts_query_predicates_for_pattern(address, i, TRANSFER_BUFFER);
              const stepCount = getValue(TRANSFER_BUFFER, "i32");
              predicates[i] = [];
              textPredicates[i] = [];
              const steps = [];
              let stepAddress = predicatesAddress;
              for (let j = 0; j < stepCount; j++) {
                const stepType = getValue(stepAddress, "i32");
                stepAddress += SIZE_OF_INT;
                const stepValueId = getValue(stepAddress, "i32");
                stepAddress += SIZE_OF_INT;
                if (stepType === PREDICATE_STEP_TYPE_CAPTURE) {
                  steps.push({
                    type: "capture",
                    name: captureNames[stepValueId]
                  });
                } else if (stepType === PREDICATE_STEP_TYPE_STRING) {
                  steps.push({
                    type: "string",
                    value: stringValues[stepValueId]
                  });
                } else if (steps.length > 0) {
                  if (steps[0].type !== "string") {
                    throw new Error("Predicates must begin with a literal value");
                  }
                  const operator = steps[0].value;
                  let isPositive = true;
                  let matchAll = true;
                  let captureName;
                  switch (operator) {
                   case "any-not-eq?":
                   case "not-eq?":
                    isPositive = false;

                   case "any-eq?":
                   case "eq?":
                    if (steps.length !== 3) {
                      throw new Error(`Wrong number of arguments to \`#${operator}\` predicate. Expected 2, got ${steps.length - 1}`);
                    }
                    if (steps[1].type !== "capture") {
                      throw new Error(`First argument of \`#${operator}\` predicate must be a capture. Got "${steps[1].value}"`);
                    }
                    matchAll = !operator.startsWith("any-");
                    if (steps[2].type === "capture") {
                      const captureName1 = steps[1].name;
                      const captureName2 = steps[2].name;
                      textPredicates[i].push(captures => {
                        const nodes1 = [];
                        const nodes2 = [];
                        for (const c of captures) {
                          if (c.name === captureName1) nodes1.push(c.node);
                          if (c.name === captureName2) nodes2.push(c.node);
                        }
                        const compare = (n1, n2, positive) => positive ? n1.text === n2.text : n1.text !== n2.text;
                        return matchAll ? nodes1.every(n1 => nodes2.some(n2 => compare(n1, n2, isPositive))) : nodes1.some(n1 => nodes2.some(n2 => compare(n1, n2, isPositive)));
                      });
                    } else {
                      captureName = steps[1].name;
                      const stringValue = steps[2].value;
                      const matches = n => n.text === stringValue;
                      const doesNotMatch = n => n.text !== stringValue;
                      textPredicates[i].push(captures => {
                        const nodes = [];
                        for (const c of captures) {
                          if (c.name === captureName) nodes.push(c.node);
                        }
                        const test = isPositive ? matches : doesNotMatch;
                        return matchAll ? nodes.every(test) : nodes.some(test);
                      });
                    }
                    break;

                   case "any-not-match?":
                   case "not-match?":
                    isPositive = false;

                   case "any-match?":
                   case "match?":
                    if (steps.length !== 3) {
                      throw new Error(`Wrong number of arguments to \`#${operator}\` predicate. Expected 2, got ${steps.length - 1}.`);
                    }
                    if (steps[1].type !== "capture") {
                      throw new Error(`First argument of \`#${operator}\` predicate must be a capture. Got "${steps[1].value}".`);
                    }
                    if (steps[2].type !== "string") {
                      throw new Error(`Second argument of \`#${operator}\` predicate must be a string. Got @${steps[2].value}.`);
                    }
                    captureName = steps[1].name;
                    const regex = new RegExp(steps[2].value);
                    matchAll = !operator.startsWith("any-");
                    textPredicates[i].push(captures => {
                      const nodes = [];
                      for (const c of captures) {
                        if (c.name === captureName) nodes.push(c.node.text);
                      }
                      const test = (text, positive) => positive ? regex.test(text) : !regex.test(text);
                      if (nodes.length === 0) return !isPositive;
                      return matchAll ? nodes.every(text => test(text, isPositive)) : nodes.some(text => test(text, isPositive));
                    });
                    break;

                   case "set!":
                    if (steps.length < 2 || steps.length > 3) {
                      throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${steps.length - 1}.`);
                    }
                    if (steps.some(s => s.type !== "string")) {
                      throw new Error(`Arguments to \`#set!\` predicate must be a strings.".`);
                    }
                    if (!setProperties[i]) setProperties[i] = {};
                    setProperties[i][steps[1].value] = steps[2] ? steps[2].value : null;
                    break;

                   case "is?":
                   case "is-not?":
                    if (steps.length < 2 || steps.length > 3) {
                      throw new Error(`Wrong number of arguments to \`#${operator}\` predicate. Expected 1 or 2. Got ${steps.length - 1}.`);
                    }
                    if (steps.some(s => s.type !== "string")) {
                      throw new Error(`Arguments to \`#${operator}\` predicate must be a strings.".`);
                    }
                    const properties = operator === "is?" ? assertedProperties : refutedProperties;
                    if (!properties[i]) properties[i] = {};
                    properties[i][steps[1].value] = steps[2] ? steps[2].value : null;
                    break;

                   case "not-any-of?":
                    isPositive = false;

                   case "any-of?":
                    if (steps.length < 2) {
                      throw new Error(`Wrong number of arguments to \`#${operator}\` predicate. Expected at least 1. Got ${steps.length - 1}.`);
                    }
                    if (steps[1].type !== "capture") {
                      throw new Error(`First argument of \`#${operator}\` predicate must be a capture. Got "${steps[1].value}".`);
                    }
                    for (let i = 2; i < steps.length; i++) {
                      if (steps[i].type !== "string") {
                        throw new Error(`Arguments to \`#${operator}\` predicate must be a strings.".`);
                      }
                    }
                    captureName = steps[1].name;
                    const values = steps.slice(2).map(s => s.value);
                    textPredicates[i].push(captures => {
                      const nodes = [];
                      for (const c of captures) {
                        if (c.name === captureName) nodes.push(c.node.text);
                      }
                      if (nodes.length === 0) return !isPositive;
                      return nodes.every(text => values.includes(text)) === isPositive;
                    });
                    break;

                   default:
                    predicates[i].push({
                      operator: operator,
                      operands: steps.slice(1)
                    });
                  }
                  steps.length = 0;
                }
              }
              Object.freeze(setProperties[i]);
              Object.freeze(assertedProperties[i]);
              Object.freeze(refutedProperties[i]);
            }
            C._free(sourceAddress);
            return new Query(INTERNAL, address, captureNames, textPredicates, predicates, Object.freeze(setProperties), Object.freeze(assertedProperties), Object.freeze(refutedProperties));
          }
          static load(input) {
            let bytes;
            if (input instanceof Uint8Array) {
              bytes = Promise.resolve(input);
            } else {
              const url = input;
              if (typeof process !== "undefined" && process.versions && process.versions.node) {
                const fs = __webpack_require__(1);
                bytes = Promise.resolve(fs.readFileSync(url));
              } else {
                bytes = fetch(url).then(response => response.arrayBuffer().then(buffer => {
                  if (response.ok) {
                    return new Uint8Array(buffer);
                  } else {
                    const body = new TextDecoder("utf-8").decode(buffer);
                    throw new Error(`Language.load failed with status ${response.status}.\n\n${body}`);
                  }
                }));
              }
            }
            return bytes.then(bytes => loadWebAssemblyModule(bytes, {
              loadAsync: true
            })).then(mod => {
              const symbolNames = Object.keys(mod);
              const functionName = symbolNames.find(key => LANGUAGE_FUNCTION_REGEX.test(key) && !key.includes("external_scanner_"));
              if (!functionName) {
                console.log(`Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(symbolNames, null, 2)}`);
              }
              const languageAddress = mod[functionName]();
              return new Language(INTERNAL, languageAddress);
            });
          }
        }
        class LookaheadIterable {
          constructor(internal, address, language) {
            assertInternal(internal);
            this[0] = address;
            this.language = language;
          }
          get currentTypeId() {
            return C._ts_lookahead_iterator_current_symbol(this[0]);
          }
          get currentType() {
            return this.language.types[this.currentTypeId] || "ERROR";
          }
          delete() {
            C._ts_lookahead_iterator_delete(this[0]);
            this[0] = 0;
          }
          resetState(stateId) {
            return C._ts_lookahead_iterator_reset_state(this[0], stateId);
          }
          reset(language, stateId) {
            if (C._ts_lookahead_iterator_reset(this[0], language[0], stateId)) {
              this.language = language;
              return true;
            }
            return false;
          }
          [Symbol.iterator]() {
            const self = this;
            return {
              next() {
                if (C._ts_lookahead_iterator_next(self[0])) {
                  return {
                    done: false,
                    value: self.currentType
                  };
                }
                return {
                  done: true,
                  value: ""
                };
              }
            };
          }
        }
        class Query {
          constructor(internal, address, captureNames, textPredicates, predicates, setProperties, assertedProperties, refutedProperties) {
            assertInternal(internal);
            this[0] = address;
            this.captureNames = captureNames;
            this.textPredicates = textPredicates;
            this.predicates = predicates;
            this.setProperties = setProperties;
            this.assertedProperties = assertedProperties;
            this.refutedProperties = refutedProperties;
            this.exceededMatchLimit = false;
          }
          delete() {
            C._ts_query_delete(this[0]);
            this[0] = 0;
          }
          matches(node, {startPosition: startPosition = ZERO_POINT, endPosition: endPosition = ZERO_POINT, startIndex: startIndex = 0, endIndex: endIndex = 0, matchLimit: matchLimit = 4294967295, maxStartDepth: maxStartDepth = 4294967295, timeoutMicros: timeoutMicros = 0} = {}) {
            if (typeof matchLimit !== "number") {
              throw new Error("Arguments must be numbers");
            }
            marshalNode(node);
            C._ts_query_matches_wasm(this[0], node.tree[0], startPosition.row, startPosition.column, endPosition.row, endPosition.column, startIndex, endIndex, matchLimit, maxStartDepth, timeoutMicros);
            const rawCount = getValue(TRANSFER_BUFFER, "i32");
            const startAddress = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const didExceedMatchLimit = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
            const result = new Array(rawCount);
            this.exceededMatchLimit = Boolean(didExceedMatchLimit);
            let filteredCount = 0;
            let address = startAddress;
            for (let i = 0; i < rawCount; i++) {
              const pattern = getValue(address, "i32");
              address += SIZE_OF_INT;
              const captureCount = getValue(address, "i32");
              address += SIZE_OF_INT;
              const captures = new Array(captureCount);
              address = unmarshalCaptures(this, node.tree, address, captures);
              if (this.textPredicates[pattern].every(p => p(captures))) {
                result[filteredCount] = {
                  pattern: pattern,
                  captures: captures
                };
                const setProperties = this.setProperties[pattern];
                if (setProperties) result[filteredCount].setProperties = setProperties;
                const assertedProperties = this.assertedProperties[pattern];
                if (assertedProperties) result[filteredCount].assertedProperties = assertedProperties;
                const refutedProperties = this.refutedProperties[pattern];
                if (refutedProperties) result[filteredCount].refutedProperties = refutedProperties;
                filteredCount++;
              }
            }
            result.length = filteredCount;
            C._free(startAddress);
            return result;
          }
          captures(node, {startPosition: startPosition = ZERO_POINT, endPosition: endPosition = ZERO_POINT, startIndex: startIndex = 0, endIndex: endIndex = 0, matchLimit: matchLimit = 4294967295, maxStartDepth: maxStartDepth = 4294967295, timeoutMicros: timeoutMicros = 0} = {}) {
            if (typeof matchLimit !== "number") {
              throw new Error("Arguments must be numbers");
            }
            marshalNode(node);
            C._ts_query_captures_wasm(this[0], node.tree[0], startPosition.row, startPosition.column, endPosition.row, endPosition.column, startIndex, endIndex, matchLimit, maxStartDepth, timeoutMicros);
            const count = getValue(TRANSFER_BUFFER, "i32");
            const startAddress = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const didExceedMatchLimit = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
            const result = [];
            this.exceededMatchLimit = Boolean(didExceedMatchLimit);
            const captures = [];
            let address = startAddress;
            for (let i = 0; i < count; i++) {
              const pattern = getValue(address, "i32");
              address += SIZE_OF_INT;
              const captureCount = getValue(address, "i32");
              address += SIZE_OF_INT;
              const captureIndex = getValue(address, "i32");
              address += SIZE_OF_INT;
              captures.length = captureCount;
              address = unmarshalCaptures(this, node.tree, address, captures);
              if (this.textPredicates[pattern].every(p => p(captures))) {
                const capture = captures[captureIndex];
                const setProperties = this.setProperties[pattern];
                if (setProperties) capture.setProperties = setProperties;
                const assertedProperties = this.assertedProperties[pattern];
                if (assertedProperties) capture.assertedProperties = assertedProperties;
                const refutedProperties = this.refutedProperties[pattern];
                if (refutedProperties) capture.refutedProperties = refutedProperties;
                result.push(capture);
              }
            }
            C._free(startAddress);
            return result;
          }
          predicatesForPattern(patternIndex) {
            return this.predicates[patternIndex];
          }
          disableCapture(captureName) {
            const captureNameLength = lengthBytesUTF8(captureName);
            const captureNameAddress = C._malloc(captureNameLength + 1);
            stringToUTF8(captureName, captureNameAddress, captureNameLength + 1);
            C._ts_query_disable_capture(this[0], captureNameAddress, captureNameLength);
            C._free(captureNameAddress);
          }
          didExceedMatchLimit() {
            return this.exceededMatchLimit;
          }
        }
        function getText(tree, startIndex, endIndex) {
          const length = endIndex - startIndex;
          let result = tree.textCallback(startIndex, null, endIndex);
          startIndex += result.length;
          while (startIndex < endIndex) {
            const string = tree.textCallback(startIndex, null, endIndex);
            if (string && string.length > 0) {
              startIndex += string.length;
              result += string;
            } else {
              break;
            }
          }
          if (startIndex > endIndex) {
            result = result.slice(0, length);
          }
          return result;
        }
        function unmarshalCaptures(query, tree, address, result) {
          for (let i = 0, n = result.length; i < n; i++) {
            const captureIndex = getValue(address, "i32");
            address += SIZE_OF_INT;
            const node = unmarshalNode(tree, address);
            address += SIZE_OF_NODE;
            result[i] = {
              name: query.captureNames[captureIndex],
              node: node
            };
          }
          return address;
        }
        function assertInternal(x) {
          if (x !== INTERNAL) throw new Error("Illegal constructor");
        }
        function isPoint(point) {
          return (point && typeof point.row === "number" && typeof point.column === "number");
        }
        function marshalNode(node) {
          let address = TRANSFER_BUFFER;
          setValue(address, node.id, "i32");
          address += SIZE_OF_INT;
          setValue(address, node.startIndex, "i32");
          address += SIZE_OF_INT;
          setValue(address, node.startPosition.row, "i32");
          address += SIZE_OF_INT;
          setValue(address, node.startPosition.column, "i32");
          address += SIZE_OF_INT;
          setValue(address, node[0], "i32");
        }
        function unmarshalNode(tree, address = TRANSFER_BUFFER) {
          const id = getValue(address, "i32");
          address += SIZE_OF_INT;
          if (id === 0) return null;
          const index = getValue(address, "i32");
          address += SIZE_OF_INT;
          const row = getValue(address, "i32");
          address += SIZE_OF_INT;
          const column = getValue(address, "i32");
          address += SIZE_OF_INT;
          const other = getValue(address, "i32");
          const result = new Node(INTERNAL, tree);
          result.id = id;
          result.startIndex = index;
          result.startPosition = {
            row: row,
            column: column
          };
          result[0] = other;
          return result;
        }
        function marshalTreeCursor(cursor, address = TRANSFER_BUFFER) {
          setValue(address + 0 * SIZE_OF_INT, cursor[0], "i32");
          setValue(address + 1 * SIZE_OF_INT, cursor[1], "i32");
          setValue(address + 2 * SIZE_OF_INT, cursor[2], "i32");
          setValue(address + 3 * SIZE_OF_INT, cursor[3], "i32");
        }
        function unmarshalTreeCursor(cursor) {
          cursor[0] = getValue(TRANSFER_BUFFER + 0 * SIZE_OF_INT, "i32");
          cursor[1] = getValue(TRANSFER_BUFFER + 1 * SIZE_OF_INT, "i32");
          cursor[2] = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
          cursor[3] = getValue(TRANSFER_BUFFER + 3 * SIZE_OF_INT, "i32");
        }
        function marshalPoint(address, point) {
          setValue(address, point.row, "i32");
          setValue(address + SIZE_OF_INT, point.column, "i32");
        }
        function unmarshalPoint(address) {
          const result = {
            row: getValue(address, "i32") >>> 0,
            column: getValue(address + SIZE_OF_INT, "i32") >>> 0
          };
          return result;
        }
        function marshalRange(address, range) {
          marshalPoint(address, range.startPosition);
          address += SIZE_OF_POINT;
          marshalPoint(address, range.endPosition);
          address += SIZE_OF_POINT;
          setValue(address, range.startIndex, "i32");
          address += SIZE_OF_INT;
          setValue(address, range.endIndex, "i32");
          address += SIZE_OF_INT;
        }
        function unmarshalRange(address) {
          const result = {};
          result.startPosition = unmarshalPoint(address);
          address += SIZE_OF_POINT;
          result.endPosition = unmarshalPoint(address);
          address += SIZE_OF_POINT;
          result.startIndex = getValue(address, "i32") >>> 0;
          address += SIZE_OF_INT;
          result.endIndex = getValue(address, "i32") >>> 0;
          return result;
        }
        function marshalEdit(edit) {
          let address = TRANSFER_BUFFER;
          marshalPoint(address, edit.startPosition);
          address += SIZE_OF_POINT;
          marshalPoint(address, edit.oldEndPosition);
          address += SIZE_OF_POINT;
          marshalPoint(address, edit.newEndPosition);
          address += SIZE_OF_POINT;
          setValue(address, edit.startIndex, "i32");
          address += SIZE_OF_INT;
          setValue(address, edit.oldEndIndex, "i32");
          address += SIZE_OF_INT;
          setValue(address, edit.newEndIndex, "i32");
          address += SIZE_OF_INT;
        }
        // end include: /src/lib/binding_web/binding.js
        // include: /src/lib/binding_web/suffix.js
        for (const name of Object.getOwnPropertyNames(ParserImpl.prototype)) {
          Object.defineProperty(Parser.prototype, name, {
            value: ParserImpl.prototype[name],
            enumerable: false,
            writable: false
          });
        }
        Parser.Language = Language;
        Module.onRuntimeInitialized = () => {
          ParserImpl.init();
          resolveInitPromise();
        };
      });
    }
  }
  return Parser;
}();

if (true) {
  module.exports = TreeSitter;
}


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImportSymbol = exports.FunctionSymbol = exports.VariableSymbol = exports.Scope = exports.applyDecorations = exports.DefaultBlueDecorationType = exports.DelimiterDecorationType = exports.OtherDecorationType = exports.MethodDecorationType = exports.ImportDecorationType = exports.SubVariableDecorationType = exports.VariableDecorationType = exports.SimpleDecorationType = exports.VariableType = void 0;
const vscode = __importStar(__webpack_require__(3));
var VariableType;
(function (VariableType) {
    VariableType[VariableType["SIMPLE"] = 0] = "SIMPLE";
    VariableType[VariableType["VARIABLE"] = 1] = "VARIABLE";
    VariableType[VariableType["IMPORT"] = 2] = "IMPORT";
    VariableType[VariableType["METHOD"] = 3] = "METHOD";
})(VariableType || (exports.VariableType = VariableType = {}));
exports.SimpleDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ADD8E6',
});
exports.VariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
    //textDecoration: 'underline'
});
exports.SubVariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
    //textDecoration: 'underline'
});
exports.ImportDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4ec9b0',
});
exports.MethodDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#FFD700',
});
exports.OtherDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ca27ea',
});
exports.DelimiterDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#a258ab',
});
exports.DefaultBlueDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#569CD6',
});
function applyDecorations(parser, document) {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === document) {
        if (parser.ranges.has(VariableType.IMPORT)) {
            editor.setDecorations(exports.ImportDecorationType, parser.ranges.get(VariableType.IMPORT));
        }
        if (parser.ranges.has(VariableType.SIMPLE)) {
            editor.setDecorations(exports.SimpleDecorationType, parser.ranges.get(VariableType.SIMPLE));
        }
        if (parser.ranges.has(VariableType.VARIABLE)) {
            editor.setDecorations(exports.VariableDecorationType, parser.ranges.get(VariableType.VARIABLE));
        }
        if (parser.ranges.has(VariableType.METHOD)) {
            editor.setDecorations(exports.MethodDecorationType, parser.ranges.get(VariableType.METHOD));
        }
    }
}
exports.applyDecorations = applyDecorations;
class Symbol {
    name;
    type;
    range;
    constructor(name, type = "kotlin.Unit") {
        this.name = name;
        this.type = type;
        this.range = null;
    }
    setRange(range) {
        this.range = range;
    }
}
class Scope {
    parentScope;
    symbols;
    variables;
    depth;
    id;
    constructor(parentScope) {
        this.depth = (parentScope ? parentScope.depth + 1 : 0);
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();
        this.id = parentScope ? parentScope.id + 1 : 0;
    }
    define(symbol) {
        if (symbol instanceof VariableSymbol) {
            this.variables.set(symbol.name, symbol);
        }
        else {
            this.symbols.set(symbol.name, symbol);
        }
    }
    undefine(symbol) {
        if (symbol instanceof VariableSymbol) {
            this.variables.delete(symbol.name);
        }
        else {
            this.symbols.delete(symbol.name);
        }
    }
    resolveVariable(name) {
        const result = this.variables.get(name);
        if (result)
            return result;
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
    hasVariableInScopeChain(name) {
        let currentScope = this; // Start with the current scope
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
exports.Scope = Scope;
class VariableSymbol extends Symbol {
    isImport;
    name;
    range;
    node;
    childNodes;
    value;
    scope;
    constructor(name, range, node, value, scope, isImport = false) {
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
exports.VariableSymbol = VariableSymbol;
class FunctionSymbol extends Symbol {
    args;
    returnType;
    constructor(name, args, returnType) {
        super(name, returnType);
        this.args = args;
        this.returnType = returnType;
    }
}
exports.FunctionSymbol = FunctionSymbol;
class ImportSymbol extends Symbol {
    simpleName;
    path;
    range;
    node;
    segmentCount = 0;
    constructor(path, range, node) {
        var somePath = path.split(".").pop();
        super(somePath ? somePath : "", path);
        this.path = path;
        this.range = range;
        this.node = node;
        this.simpleName = this.getClassName();
    }
    getClassName() {
        var name = this.path.split('.');
        var finalName = name.pop();
        this.segmentCount = name.length + 1;
        return finalName ? finalName : "";
    }
}
exports.ImportSymbol = ImportSymbol;
function getClassName(type) {
    if (type != null) {
        const parts = type.split('.');
        return parts[parts.length - 1];
    }
    return "kotlin.Unit";
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map