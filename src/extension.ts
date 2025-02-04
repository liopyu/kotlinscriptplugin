import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import TSParser, { QueryCapture, SyntaxNode, Tree } from 'web-tree-sitter';
import {
	VariableSymbol,
	ImportSymbol,
	MethodDecorationType,
	SimpleDecorationType,
	DefaultBlueDecorationType,
	SubVariableDecorationType,
	ImportDecorationType,
	DelimiterDecorationType,
	VariableDecorationType,
	OtherDecorationType,
	VariableType,
	Scope,
	TypingSuggestion
} from './symbols';
const t = true
const individualLogging = false;
const globalLogging = false;
const editor = vscode.window.activeTextEditor;
function logContent(...data: any[]) {
	if (individualLogging) {
		console.log(data)
	}
}
function logGlobals(...data: any[]) {
	if (globalLogging) {
		console.log(data)
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
]
const TOKEN_MODIFIERS: string[] = [];
const LEGEND = new vscode.SemanticTokensLegend(TOKEN_TYPES, TOKEN_MODIFIERS);
const expressionTypes: string[] = [
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
]
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
]
const standinReserved = [
	"_", "__", "...", "___",
]
const reservedCharacters = [
	"_", "__", "...", "___",
	"abstract", "as", "break", "class", "continue",
	"do", "else", "false", "for", "fun",
	"if", "in", "interface",
	"is", "null", "object",
	"package",
	"return", "super", "this", "throw", "true", "try",
	"typealias", "val", "var", "when", "while"
]
const reservedFunctions = [
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
]
export class TreeProvider {
	public semanticTokensProvider: SemanticTokensProvider | undefined = undefined
	public varId: number
	public hasPackageHeader: boolean = false;
	public currentScope: Scope = new Scope(null);
	public scopes: Map<Number, Scope> = new Map()
	public ranges: Map<VariableType, vscode.Range[]> = new Map();
	public simpleRanges: vscode.Range[] = []
	public init: boolean = false;
	public readonly parser: TSParser;
	public scopedVariables: Map<string, VariableSymbol> = new Map();
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
	constructor(parser: TSParser, document: vscode.TextDocument) {
		this.parser = parser;
		logGlobals("initializing tokens provider")
		this.scopes.set(this.currentScope.id, this.currentScope)
		this.varId = 0
		const fullText = document.getText();
		this.tree = this.parser.parse(fullText);
		this.updateTokens()
	}
	updateTokens() {
		this.isUpdating = true;
		logGlobals("Updating tokens for changed ranges...");

		if (!this.tree) {
			console.error("Tree is not initialized.");
			this.isUpdating = false;
			return;
		}

		console.log("rootnode: " + this.tree.rootNode)
		this.tree.rootNode.children.forEach(c => {
			console.log("Child - Text: " + c.text + ", Type: " + c.type)
			c.children.forEach(cc => {
				console.log("GrandChild - Text: " + cc.text + ", Type: " + cc.type)
				cc.children.forEach(ccc => {
					console.log("GreatGrandChild - Text: " + ccc.text + ", Type: " + ccc.type)
				})
			})
		})
		this.defaultBlue = []
		this.variableBlue = []
		this.purpleType = []
		this.importRanges = []
		this.varId = 0
		this.scopes.clear()
		this.currentScope = new Scope(null);
		this.scopes.set(this.currentScope.id, this.currentScope)
		this.isUpdating = false;
		/* if (editor) {
			this.validateDiagnostics(editor?.document)
		} */
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
	private isErrorStillRelevant(range: vscode.Range, errorMessage: string): boolean {
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
				}), "identifier")
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
			logContent(`Removed stale import '${importKey}'`);
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
				variablesToRemove.push(variableKey); // Add old key for removal
				const newVarKey = `${variableName}@${scopeId}@${actualRangeKey}`;
				this.scopedVariables.set(newVarKey, variableSymbol); // Add updated key
				continue;
			}

			// Check if the variable is still valid in the tree (e.g., as a property or variable declaration)
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
			/* console.log(
				`Removed stale variable '${this.fromKey(variableKey)}' from scope: ${symbol?.scope.depth}`
			); */

			if (symbol) {
				symbol.scope.undefine(symbol);
			}

			this.scopedVariables.delete(variableKey);
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
	public enter: vscode.Range[] = [];
	public exit: vscode.Range[] = [];


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
				if (this.isBlockNode(child) || child.type == "{") {
					continue
				}
				if (types.includes(child.type)) {
					if (!expectedParent || (child.parent && child.parent.type === expectedParent)) {
						result.push(child);
					}
				}
				if (!this.isBlockExitNode(child)) {
					traverse(child);
				}

				if (this.isBlockExitNode(child)) {
					continue
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
	public findParent(node: TSParser.SyntaxNode | null, type: string): TSParser.SyntaxNode | null {
		let currentNode = node;
		while (currentNode) {
			if (currentNode.type === type) {
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
		builder: vscode.SemanticTokensBuilder
	): void {
		const variableName = identifierNode.text;

		// Generate varKey using the new range-based key format
		const varKey = `${variableName}@${this.currentScope.id}@${this.getRangeKey(range)}`;

		// Check for reserved characters
		if (reservedCharacters.includes(variableName)) {
			if (standinReserved.includes(variableName) && identifierNode.parent?.type == "lambda_parameters") {
				builder.push(range, "enumMember");
				return
			} else {
				const errorMessage = `Cannot define reserved identifier: '${variableName}'`;
				TreeProvider.addError(range, errorMessage, variableName);
				return;
			}
		}
		//console.log("VariableName: " + variableName + ", Current Scope: " + this.currentScope.id)
		// Check if a variable with the same name exists in the current scope
		if (this.currentScope.countVariablesByName(variableName) > 0 && identifierNode.parent?.type != "lambda_parameters") {
			const errorMessage = `Variable "${variableName}" is already defined in the current scope and may cause ambiguity.`;
			TreeProvider.addError(range, errorMessage, variableName, vscode.DiagnosticSeverity.Warning);
		}

		// Define the variable symbol
		const variableSymbol = new VariableSymbol(
			variableName,
			range,
			identifierNode,
			variableNode ? variableNode.text : "",
			this.currentScope,
			varKey
		);

		// Add the variable to the scope and semantic tokens
		this.currentScope.define(variableSymbol);
		builder.push(range, "enumMember");
		this.scopedVariables.set(varKey, variableSymbol);
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
	enterScope(parentScope: Scope): void {
		if (!parentScope) {
			throw new Error("Parent scope is required to enter a new scope.");
		}
		const newScope = new Scope(parentScope);
		this.scopes.set(newScope.id, newScope)
		this.currentScope = newScope;
	}


	exitScope(node: SyntaxNode): void {
		if (!this.currentScope.parentScope) {
			TreeProvider.addError(this.supplyRange(node), "Cannot exit global scope", node.text)
			return;
		}
		this.currentScope = this.currentScope.parentScope;
	}

}
export class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {

	public readonly highlightQuery: TSParser.Query;
	public readonly treeProvider: TreeProvider;
	constructor(treeProvider: TreeProvider, highlightQuery: TSParser.Query) {
		this.treeProvider = treeProvider;
		this.highlightQuery = highlightQuery;
	}
	private tempInterpolatedRanges: vscode.Range[] = [];
	public errorType: vscode.Range[] = []
	updateTokens() {
		const tree = this.treeProvider.tree
		const builder = new vscode.SemanticTokensBuilder(LEGEND);
		if (!tree) return builder.build()
		const matches = this.highlightQuery.matches(tree.rootNode);
		console.log("Updating SemanticTokens")
		this.treeProvider.updateTokens()
		this.tempInterpolatedRanges = []
		this.errorType = []
		this.map = []
		if (editor) {
			this.treeProvider.validateDiagnostics(editor?.document)
		}
		this.traverseTree(tree.rootNode)
		//console.log("RootNode" + tree.rootNode)
		matches.forEach(match => {
			match.captures.forEach(capture => {
				const node = capture.node;
				//console.log("Node Id: " + node.id + " Type: " + node.type + " Text: " + node.text)
				//console.log("Type: " + node.type + " Text: " + node.text)
				let idNode = tree.rootNode.descendantForPosition(node.startPosition);
				//console.log("trueidnodeType: " + idNode?.type + ", Text: " + idNode?.text + ", Position: " + JSON.stringify(idNode?.startPosition))
				var range = this.treeProvider.supplyRange(node)
				/* console.log(`Token processed: name="${capture.name}", flatName: ${capture.node.type}, ParentName: ${capture.node.parent?.type}, GrandParentName: ${capture.node.parent?.parent?.type}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.type}`);
				console.log(`Token processed: name="${capture.name}", flatName: ${capture.node.text}, ParentName: ${capture.node.parent?.text}, GrandParentName: ${capture.node.parent?.parent?.text}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.text}`);
 */
				if (this.treeProvider.isBlockNode(node) || (node.text == "{" || node.text == "${")) {
					//console.log("Entering Scope: " + node.text)
					this.treeProvider.enterScope(this.treeProvider.currentScope);
					this.treeProvider.enter.push(this.treeProvider.supplyRange(node));
				}
				if (capture.name == "keyword.return" && node.firstChild) {
					range = this.treeProvider.supplyRange(node.firstChild)
				} else if (capture.name == 'namespace' && node.firstChild) {
					range = this.treeProvider.supplyRange(node.firstChild)
				} else if (capture.node.type == "import") {
					const parent = this.treeProvider.findParent(capture.node, "import_header")
					if (parent) {
						this.treeProvider.processImportDeclarations(parent);
						const importNode = this.treeProvider.findChild(parent, "identifier")
						if (importNode) {
							builder.push(this.treeProvider.supplyRange(importNode), "type")
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
				} else if (this.treeProvider.isBlockExitNode(node) || (capture.name == "punctuation.bracket" && node.text == "}" && node.type == "}")) {
					//console.log("Exiting Scope: " + node.text)
					this.treeProvider.exitScope(node);
					this.treeProvider.exit.push(this.treeProvider.supplyRange(node));
				} else if (node.parent?.parent?.type == "lambda_parameters") {
					var grand = node.parent?.parent
					if (grand) {
						const variables = this.treeProvider.extractVariables(grand);
						variables.forEach((range, variableNode) => {
							this.treeProvider.processVariableDeclaration(variableNode, null, range, builder);
						})
					}
				} else if (capture.name == "repeat") {
					var n = this.treeProvider.findParent(node, "for_statement")
					if (n) {
						const variables = this.treeProvider.extractVariables(n);
						variables.forEach((range, variableNode) => {
							this.treeProvider.processVariableDeclaration(variableNode, null, range, builder);
						})
					}
				}
				this.processTokenType(capture, range, builder);
			});
		});
		if (this.treeProvider.tree) {
			this.treeProvider.validateImports(this.treeProvider.tree)
			this.treeProvider.validateVariables(this.treeProvider.tree);
		}
		if (this.treeProvider.diagnostics.length > 0) {
			this.treeProvider.addDiagnostics(this.treeProvider.diagnostics);
		}
		return builder.build();
	}

	provideDocumentSemanticTokens = (): vscode.ProviderResult<vscode.SemanticTokens> => this.updateTokens();
	public processTokenType(capture: QueryCapture, range: vscode.Range, builder: vscode.SemanticTokensBuilder): void {
		let tokenType: string = '';
		let name = capture.name
		const node = capture.node
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
				} else {
					this.handleSimpleIdentifier(capture.node, builder);
				}
				break;
			case 'property':
				if (capture.node.parent?.parent?.type == "navigation_expression") {
					const foundNode = capture.node.parent?.parent
					const normalizedText = foundNode.text.replace(/\s+/g, '').trim();
					var splitNodes = this.treeProvider.findChildren(foundNode, ["simple_identifier"])
					const isUpperCase = /^[A-Z_0-9]+$/.test(foundNode.text) && !this.treeProvider.hasParent(foundNode, "import_list") && !/^(_|__|___)$/.test(node.text)
					if (!isUpperCase) {
						this.treeProvider.imports.forEach((i, key) => {
							const barePath = this.treeProvider.givePath(normalizedText, i.segmentCount);
							if (barePath == key) {
								builder.push(this.treeProvider.supplyRange(splitNodes[i.segmentCount - 1]), 'type')
							}
						})
					} else {
						tokenType = 'enumMember'
					}
				} else if (capture.node.parent?.parent?.parent?.type === "call_expression") {
					tokenType = 'method';
				} else tokenType = 'variable';
				break
			case 'function':
				if (reservedFunctions.includes(capture?.node?.text)) {
					tokenType = 'function';
				} else {
					return
				}
				break;
			case 'constructor':
				if (capture?.node?.text === "constructor") {
					tokenType = 'keyword';
				} else {
					return
				}
				break;
			case 'keyword':
				if (node.type === "var" || node.type === "val") {
					const pD = this.treeProvider.findParent(node, "property_declaration")
					if (pD) {
						if (!(this.treeProvider.findChild(pD, "val") && this.treeProvider.findChild(pD, "val")?.text != "val")) {
							this.treeProvider.processPropertyDeclaration(pD, builder);
						}
					}
				}
				tokenType = 'keyword';
				break
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
				const getExcludedRanges = (range: vscode.Range, exclusions: vscode.Range[]): vscode.Range[] => {
					const result: vscode.Range[] = [];
					let currentStart = range.start;
					exclusions
						.filter(exclusion =>
							(exclusion.start.isAfterOrEqual(range.start) && exclusion.start.isBeforeOrEqual(range.end)) ||
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
			default:
				console.error(`Unrecognized token name: "${name}" in range=[${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}]..`);
				tokenType = 'variable';
				return;
		}
		if (name === 'comment.multiline' && range.start.line !== range.end.line) {
			for (let line = range.start.line; line <= range.end.line; line++) {
				const startCharacter = line === range.start.line ? range.start.character : 0;
				const endCharacter =
					line === range.end.line
						? range.end.character
						: this.getLineLength(line);

				const singleLineRange = new vscode.Range(line, startCharacter, line, endCharacter);
				builder.push(singleLineRange, tokenType);
				//console.log(`Multi-line token split: name="${name}", type="${tokenType}", range=[${line}:${startCharacter} - ${line}:${endCharacter}]`);
			}
		} else {
			if (tokenType === '') return
			builder.push(range, tokenType);
			/* console.log(`Token processed: name="${name}", flatName: ${capture.node.text}, ParentName: ${capture.node.parent?.text}, GrandParentName: ${capture.node.parent?.parent?.text}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.text}, type="${tokenType}", range=[${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}]`);
			console.log(`Token processed: name="${name}", flatName: ${capture.node.type}, ParentName: ${capture.node.parent?.type}, GrandParentName: ${capture.node.parent?.parent?.type}, GreatGrandParentName: ${capture.node.parent?.parent?.parent?.type}`);
			 */
			//console.log(`Token processed: name="${name}", flatName: ${capture.node.type}, FirstChild: ${capture.node.firstChild?.type}, SecondChild: ${capture.node.child(1)?.type}, ThirdChild: ${capture.node.child(2)?.type}`);

		}
	}
	/* public traverseTree(node: SyntaxNode): void {
		console.log("Current Node:", { type: node.type, text: node.text });
		// If the current node is an ERROR node
		if (node.type === "ERROR") {
			console.log("Error Node Detected:", { type: node.type, text: node.text });

			// Check if this ERROR node is caused by explicit delegation
			const containsExplicitDelegation = node.children.some(
				(child) => child.type === "explicit_delegation"
			);

			if (containsExplicitDelegation) {
				console.log("Skipping explicit delegation error check, but continuing traversal.");
				// Do not return here; continue traversing its children to catch other errors
			} else {
				// Handle other errors within the ERROR node
				const erroringNode = node.firstChild?.nextSibling ? node.firstChild.nextSibling : node.firstChild;
				if (erroringNode) {
					const range = this.treeProvider.supplyRange(node);
					const expectedType = this.getExpectedNextType(erroringNode);

					const actualText = erroringNode.text || "none";
					const errorMessage = expectedType
						? `Unexpected token: "${actualText}", expected: "${expectedType}"`
						: `Unexpected token: "${actualText}"`;

					console.log("Adding error:", { errorMessage });
					TreeProvider.addError(range, errorMessage, node.text);
				}
			}
		}

		// Continue traversing all child nodes, even within ERROR nodes
		node.children.forEach((child) => {
			this.traverseTree(child);
		});
	} */
	public traverseTree(node: SyntaxNode): void {
		const erroringNode = node.firstChild?.nextSibling ? node.firstChild.nextSibling : node.firstChild
		if (node.isError && erroringNode) {
			const range = this.treeProvider.supplyRange(node);
			const expectedType = this.getExpectedNextType(erroringNode);

			const actualText = erroringNode.text || "none";

			const errorMessage = expectedType ? `Unexpected token: "${actualText}", expected: "${expectedType}"` : `Unexpected token: "${actualText}"`;
			TreeProvider.addError(range, errorMessage, node.text)
		}
		node.children.forEach(child => this.traverseTree(child));
	}

	private map: string[] = []

	private getExpectedNextType(node: SyntaxNode): string | null {
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
				return "identifier";

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
				/* if (!this.map.includes(node.type)) {
					console.log("Unknown type: " + node.type);
					this.map.push(node.type);
				} */
				return null;
		}
	}
	public isMultipleDefinedVariable(node: SyntaxNode): boolean {
		//console.log(this.treeProvider.currentScope.countVariablesByName(node.text))
		return this.treeProvider.currentScope.countVariablesByName(node.text) > 1;
	}

	public handleSimpleIdentifier(node: SyntaxNode, builder: vscode.SemanticTokensBuilder, byPassSI: boolean = false): void {
		/* console.log("handling simple identifier: " + node.type + ": " + node.text)
		console.log("handling simple identifier parent: " + node.parent?.type + ": " + node.parent?.text) */
		if (((node.type === "simple_identifier" && node.parent?.type != "catch_block") || byPassSI) &&
			!this.treeProvider.isSpecialHandleWord(node)
		) {
			const isUpperCase = /^[A-Z_0-9]+$/.test(node.text) && !this.treeProvider.hasParent(node, "import_list") && !/^(_|__|___)$/.test(node.text)
			var isRecordedImport = false
			this.treeProvider.imports.forEach((i, key) => {
				if (!isRecordedImport && node.text == i.simpleName) {
					isRecordedImport = true
				}
			})
			if (isUpperCase && !this.treeProvider.hasParent(node, "import_header")) {
				builder.push(this.treeProvider.supplyRange(node), "enumMember")
				return
			} else if (node.parent?.type !== "navigation_suffix") {
				if (this.treeProvider.currentScope.hasVariableInScopeChain(node.text)) {
					if (
						node.parent?.type != "variable_declaration"
					) {
						if (this.isMultipleDefinedVariable(node)) {
							const errorMessage = `Ambiguous variable declaration: '${node.text}'`;
							TreeProvider.addError(this.treeProvider.supplyRange(node), errorMessage, node.text);
						}
						builder.push(this.treeProvider.supplyRange(node), "enumMember")
						return
					}
				} else if (isRecordedImport && !this.treeProvider.hasParent(node, "import_header")) {
					builder.push(this.treeProvider.supplyRange(node), "type")
					return
				}

			} else {
				if (node.parent?.parent?.parent?.type == "call_expression") {
					return builder.push(this.treeProvider.supplyRange(node), "function")
				}
			}
		}
		if (node.parent?.type == "function_declaration") {
			return builder.push(this.treeProvider.supplyRange(node), "function")
		}
		return builder.push(this.treeProvider.supplyRange(node), "variable")
	}

	public getLineLength(line: number): number {
		const document = vscode.window.activeTextEditor?.document;
		if (!document) {
			console.error(`Failed to access document for line length calculation.`);
			return 0;
		}
		return document.lineAt(line).text.length;
	}


}


class ImportDefinitionProvider implements vscode.DefinitionProvider {
	public readonly imports: Map<string, ImportSymbol>;
	constructor(imports: Map<string, ImportSymbol>) {
		this.imports = imports;
	}
	provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
		const wordRange = document.getWordRangeAtPosition(position);
		const word = document.getText(wordRange);
		const importSymbol = this.imports.get(word);
		if (!importSymbol) {
			return null;
		}
		return new vscode.Location(
			document.uri,
			importSymbol.range
		);
	}
}
class KotlinScriptDefinitionProvider implements vscode.DefinitionProvider {
	public readonly scopedVariables: Map<string, VariableSymbol>;

	constructor(scopedVariables: Map<string, VariableSymbol>) {
		this.scopedVariables = scopedVariables;
	}

	provideDefinition(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Definition> {
		const wordRange = document.getWordRangeAtPosition(position);
		const word = document.getText(wordRange);

		let matchingSymbol: VariableSymbol | undefined;

		for (const [key, variableSymbol] of this.scopedVariables.entries()) {
			matchingSymbol = variableSymbol
		}

		if (!matchingSymbol) {
			return null;
		}

		return new vscode.Location(document.uri, matchingSymbol.range);
	}
}

const documentData = new Map<string, CustomData>();
interface CustomData {
	treeProvider: TreeProvider;
	document: vscode.TextDocument;
}
function applyTreeEdit(tree: TSParser.Tree, change: vscode.TextDocumentContentChangeEvent): void {
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
function updateTokensForDocument(
	document: vscode.TextDocument
) {
	//if (t) return
	const documentUri = document.uri.toString();
	const data = documentData.get(documentUri);
	if (!data) return;
	const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === documentUri);
	if (editor) {
		const { treeProvider } = data;
		const changes = document.getText();
		if (treeProvider.tree) {
			const newTree = treeProvider.parser.parse(changes, treeProvider.tree);
			treeProvider.tree = newTree;
		}
		if (!treeProvider.isUpdating) {
			treeProvider.updateTokens();
		}
		/* const variableDefinitionProvider = new KotlinScriptDefinitionProvider(treeProvider.getscopedVariables());
		context.subscriptions.push(
			vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
		); */
	}
}
const semanticTokensEnabled = true
let availableClasses: Set<string>;

export async function loadAvailableClasses(ktsDirectory: string): Promise<Set<string>> {
	const availableClasses = new Set<string>();

	const typingsPath = path.join(ktsDirectory, 'typings');
	const jsonFilePath = path.join(typingsPath, 'available_classes.json');
	const binaryFilePath = path.join(typingsPath, 'available_classes.bin');

	try {
		if (fs.existsSync(binaryFilePath)) {
			console.log('Loading classes from binary file...');
			const buffer = fs.readFileSync(binaryFilePath);
			buffer
				.toString('utf-8')
				.split('\n')
				.forEach(cls => availableClasses.add(cls));
			console.log(`Loaded ${availableClasses.size} classes from binary file.`);
			return availableClasses;
		}

		// Fallback to JSON file
		if (fs.existsSync(jsonFilePath)) {
			console.log('Loading classes from JSON file...');
			const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
			const classes = JSON.parse(fileContent);

			if (Array.isArray(classes)) {
				classes.forEach(cls => availableClasses.add(cls));
				const buffer = Buffer.from(classes.join('\n'), 'utf-8');
				fs.writeFileSync(binaryFilePath, buffer);
			} else {
				throw new Error('Invalid JSON format: expected an array of classes');
			}

			console.log(`Loaded ${availableClasses.size} classes from JSON file.`);
			return availableClasses;
		}
		console.warn('No available_classes.json or binary file found.');
		return availableClasses;
	} catch (error) {
		console.error(`Error loading available classes: ${error}`);
		return availableClasses;
	}
}
export async function loadTypingSuggestions(ktsDirectory: string): Promise<TypingSuggestion[]> {
	const suggestions: TypingSuggestion[] = [];

	const typingsPath = path.join(ktsDirectory, 'typings');
	const jsonFilePath = path.join(typingsPath, 'kotlin_suggestions.json');

	try {
		// Check if the JSON file exists
		if (fs.existsSync(jsonFilePath)) {
			console.log('Loading typing suggestions from JSON file...');
			const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
			const parsedData = JSON.parse(fileContent);

			// Validate and process the JSON content
			if (Array.isArray(parsedData)) {
				parsedData.forEach(item => {
					// Ensure the required fields are present and valid
					if (item.fullyQualifiedName?.startsWith('kotlin.')) {
						suggestions.push(
							new TypingSuggestion(
								item.fullyQualifiedName,
								item.simpleName || '',
								item.source || null,
								item.type || null,
								item.path || null
							)
						);
					}
				});
				console.log(`Loaded ${suggestions.length} typing suggestions.`);
			} else {
				throw new Error('Invalid JSON format: expected an array of suggestions.');
			}
		} else {
			console.warn(`No kotlin_suggestions.json found at ${jsonFilePath}.`);
		}
	} catch (error) {
		console.error(`Error loading typing suggestions: ${error}`);
	}

	return suggestions;
}
class TypingSuggestionProvider implements vscode.CompletionItemProvider {
	private suggestions: TypingSuggestion[];

	constructor(suggestions: TypingSuggestion[]) {
		this.suggestions = suggestions;
	}

	async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.CompletionContext
	): Promise<vscode.CompletionItem[] | undefined> {
		const linePrefix = document.lineAt(position).text.substring(0, position.character);
		const documentUri = document.uri.toString();
		const data = documentData.get(documentUri);
		//if (t) return

		if (!data) {
			console.log("No tree provider data found for this document.");
			return;
		}

		const treeProvider = data.treeProvider;
		const tree = treeProvider.tree
		if (!tree) {
			console.log("No syntax tree available for this document.");
			return;
		}
		const line = position.line;
		const character = position.character - 1;
		const node = tree.rootNode.descendantForPosition({
			row: line,
			column: character,
		});

		//console.log("Type: " + node.type + ", ParentType: " + node.parent?.type)
		if (!(
			(node.type === "simple_identifier" && node.parent?.type == "statements") ||
			(node.type === "simple_identifier" && node.parent?.type === "property_declaration") ||
			(node.type === "simple_identifier" && node.parent?.type === "for_statement") ||
			(node.type === "simple_identifier" && node.parent?.type === "if_expression") ||
			(node.type === "simple_identifier" && node.parent?.type === "value_argument") ||
			(node.type === "simple_identifier" && node.parent?.type === "source_file") ||
			(node.type === "simple_identifier" && node.parent?.type === "when_subject") ||
			(node.type === "simple_identifier" && node.parent?.type === "infix_expression") ||
			(node.type === "simple_identifier" && node.parent?.type === "indexing_suffix") ||
			(node.type === "simple_identifier" && node.parent?.type === "control_structure_body") ||
			(node.type === "simple_identifier" && node.parent?.type === "function_body") ||
			(node.type === "simple_identifier" && node.parent?.type === "function_value_parameters") ||
			(node.type === "simple_identifier" && node.parent?.type === "explicit_delegation") ||
			(node.type === "simple_identifier" && node.parent?.type === "property_delegate") ||
			(node.type === "simple_identifier" && node.parent?.type === "callable_reference")

		)) {
			//console.log("Skipping suggestions: Invalid context.");
			return undefined;
		}

		const completionItems = this.suggestions.map(suggestion => {
			const item = new vscode.CompletionItem(
				suggestion.simpleName,
				vscode.CompletionItemKind.Function
			);
			item.detail = suggestion.fullyQualifiedName;
			item.documentation = suggestion.source
				? `Source: ${suggestion.source}\nType: ${suggestion.type}`
				: `Type: ${suggestion.type}`;
			item.insertText = suggestion.simpleName;
			return item;
		});

		return completionItems;
	}
}

function name(context: vscode.ExtensionContext, lang: TSParser.Language) {
	const highlightsPath = context.asAbsolutePath('parsers/kotlin_highlights.scm');
	console.log(`Highlights file path: ${highlightsPath}`);
	if (!fs.existsSync(highlightsPath)) {
		console.error('Highlights file does not exist. Ensure the file is in the correct location.');
		return;
	}
	const queryText = fs.readFileSync(highlightsPath, 'utf-8');
	console.log('Highlight query loaded:', queryText.slice(0, 100), '...'); // Log the first 100 characters
	const highlightQuery = lang.query(queryText);
	console.log('Highlight query successfully compiled.');
}

export async function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('kotlinscript');
	const ktsDirectory = config.get<string>('ktsDirectory', 'config/scripts');
	const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
	await TSParser.init();
	availableClasses = await loadAvailableClasses(absoluteKtsDirectory);
	const typingSuggestions = await loadTypingSuggestions(absoluteKtsDirectory);
	console.log(`Typing suggestions loaded: ${typingSuggestions.length}`);
	/* typingSuggestions.forEach(suggestion => {
		console.log(`- ${suggestion.fullyQualifiedName}`);
	}); */
	const parser = new TSParser();
	const wasmPath = context.asAbsolutePath('tree-sitter-kotlin.wasm');
	const lang = await TSParser.Language.load(wasmPath);
	parser.setLanguage(lang);
	const highlightsPath = context.asAbsolutePath('parsers/kotlin_highlights.scm');
	const queryText = fs.readFileSync(highlightsPath, 'utf-8');
	const highlightQuery = lang.query(queryText);
	function addDocumentIfNotExists(document: vscode.TextDocument) {
		const documentUri = document.uri.toString();
		if (!document.fileName.endsWith(".kts")) return
		if (!documentData.has(documentUri)) {
			logGlobals("Adding document");
			const treeProvider = new TreeProvider(parser, document);
			documentData.set(documentUri, {
				treeProvider: treeProvider,
				document: document
			});
		}
	}
	const selector: vscode.DocumentSelector = {
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
			}
		}
	});
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			new TypingSuggestionProvider(typingSuggestions),
			''
		)
	);
	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		updateTokensForDocument(event.textEditor.document);
	});

	// Runs on start
	if (editor) {
		addDocumentIfNotExists(editor.document);
		var doc = documentData.get(editor.document.uri.toString())
		if (doc) {
			if (semanticTokensEnabled) {
				doc.treeProvider.semanticTokensProvider = new SemanticTokensProvider(doc.treeProvider, highlightQuery);
				context.subscriptions.push(
					vscode.languages.registerDocumentSemanticTokensProvider(selector, doc.treeProvider.semanticTokensProvider, LEGEND)
				);
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
				logGlobals("Removed document")
			}
		}
	});
}
export function deactivate() {
	logGlobals(`Deactivating KotlinScript extension...`);
}












