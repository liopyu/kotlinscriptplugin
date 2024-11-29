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
	Scope
} from './symbols';
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
	private imports: Map<string, ImportSymbol> = new Map();
	public tree: TSParser.Tree | undefined = undefined;
	public isUpdating: boolean = false;
	public purpleType: vscode.Range[] = []
	public defaultBlue: vscode.Range[] = []
	public variableBlue: vscode.Range[] = []
	public importRanges: vscode.Range[] = []
	constructor(parser: TSParser, document: vscode.TextDocument) {
		this.parser = parser;
		logGlobals("initializing tokens provider")
		this.scopes.set(this.currentScope.id, this.currentScope)
		this.varId = 0
		const fullText = document.getText();
		this.tree = this.parser.parse(fullText);
		var allRanges = [new vscode.Range(0, 0, document.lineCount, 0)]
		this.updateTokens(allRanges)
	}
	updateTokens(changedRanges: vscode.Range[]): void {
		var t = true
		//if (t) return
		this.isUpdating = true;
		logGlobals("Updating tokens for changed ranges...");
		if (!this.tree) {
			console.error("Tree is not initialized.");
			this.isUpdating = false;
			return;
		}
		this.defaultBlue = []
		this.variableBlue = []
		this.purpleType = []
		this.importRanges = []
		this.varId = 0
		this.scopes.clear()
		this.imports.clear()
		this.currentScope = new Scope(null);
		this.scopes.set(this.currentScope.id, this.currentScope)

		this.traverseTree(this.tree.rootNode, changedRanges);
		this.validateVariables(this.tree);
		// TODO: this should be done in the semantic tokens provider or limited to visible ranges 
		if (editor) {
			editor.setDecorations(DefaultBlueDecorationType, this.defaultBlue);
			editor.setDecorations(SubVariableDecorationType, this.variableBlue);
			this.imports.forEach((i, n) => {
				this.importRanges.push(i.range)
			})
			editor.setDecorations(ImportDecorationType, this.importRanges);
			editor.setDecorations(DelimiterDecorationType, this.purpleType);
		}

		this.isUpdating = false;
	}

	public getAffectedRange(node: TSParser.SyntaxNode): TSParser.SyntaxNode {
		let current = node;
		while (current.parent && current.parent.type !== "source_file") {
			current = current.parent;
		}
		return current;
	}
	private nameFromKey(string: string) {
		const parts = string.split("@");
		return parts[0];
	}
	private scopeIdFromKey(string: string) {
		const parts = string.split("@");
		return parts[1];
	}
	private variableIdFromKey(string: string) {
		const parts = string.split("@");
		return parts[2];
	}
	private validateVariables(tree: TSParser.Tree): void {
		const variablesToRemove: string[] = [];

		for (const [variableKey, variableSymbol] of this.scopedVariables.entries()) {
			const variableName = this.nameFromKey(variableKey)
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

			let currentNode: TSParser.SyntaxNode | null = node;
			let isValid = false;

			while (currentNode) {
				if (
					currentNode.type === 'property_declaration' ||
					currentNode.type === 'variable_declaration'
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
			if (!variableSymbol.scope.variables.has(variableName)) {
				variablesToRemove.push(variableKey);
			}
		}

		for (const variableKey of variablesToRemove) {
			var symbol = this.scopedVariables.get(variableKey)
			logContent(`Removed stale variable '${this.nameFromKey(variableKey)}' from scope: ` + symbol?.scope.depth);
			if (symbol)
				symbol.scope.undefine(symbol)
			if (this.rangesToDecorate.has(variableKey)) {
				this.rangesToDecorate.delete(variableKey);
			}
			this.scopedVariables.delete(variableKey);
		}
	}



	private rangesEqual(range1: vscode.Range, range2: vscode.Range): boolean {
		return range1.start.line === range2.start.line &&
			range1.start.character === range2.start.character &&
			range1.end.line === range2.end.line &&
			range1.end.character === range2.end.character;
	}
	private processPropertyDeclaration(node: SyntaxNode): void {
		const valueNodes = this.findChildren(node, expressionTypes, "property_declaration");
		const variables = this.extractVariables(node);
		if (valueNodes.length > 0) {
			valueNodes.forEach(valueNode => {
				if (!this.isValueInDeclaration(valueNode)) return;
				variables.forEach((range, variableNode) => {
					this.processVariableDeclaration(variableNode, valueNode, range);
				});
			});
		} else {
			variables.forEach((range, variableNode) => {
				this.processVariableDeclaration(variableNode, null, range);
			})
		}
	}
	private extractVariables(node: SyntaxNode): Map<SyntaxNode, vscode.Range> {
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
	private extractVariableNode(declaration: SyntaxNode): SyntaxNode | null {
		const userTypeNode = this.findChild(declaration, "user_type");
		return userTypeNode ? declaration.firstChild : declaration;
	}
	private processImportDeclarations(node: SyntaxNode) {
		const importNode = this.findChild(node, "identifier");
		if (!importNode) return
		const range = this.supplyRange(importNode);
		this.processImportDeclaration(importNode, range);
	};
	private enter: vscode.Range[] = [];
	private exit: vscode.Range[] = [];

	private traverseTree(node: SyntaxNode, ranges: vscode.Range[]): void {
		const nodeRange = this.supplyRange(node);
		const isInRange = ranges.some(range => range.intersection(nodeRange) !== undefined);
		if (!isInRange) {
			return;
		}
		/* console.log("Type: " + node.type + ", ParentType: " + node.parent?.type + ", GrandparentType: " + node.parent?.parent?.type)
		console.log("Text: " + node.text + ", ParentText: " + node.parent?.text + ", GrandparentText: " + node.parent?.parent?.text) */
		if (node.type == "lambda_parameters") {
			const variables = this.extractVariables(node);
			variables.forEach((range, variableNode) => {
				this.processVariableDeclaration(variableNode, null, range);
			})
		}

		this.handleSimpleIdentifier(node)

		if (this.isSpecialHandleWord(node)) {
			this.defaultBlue.push(this.supplyRange(node))
		}
		if (node.type == "string_literal") {
			var c1 = this.findChildren(node, ["${"])
			var c2 = this.findChildren(node, ["$"])
			var c3 = this.findChildren(node, ["}"])
			var c4 = this.findChildren(node, ["interpolated_identifier"])
			c1.forEach(c => this.purpleType.push(this.supplyRange(c)))
			c2.forEach(c => this.purpleType.push(this.supplyRange(c)))
			c3.forEach(c => this.purpleType.push(this.supplyRange(c)))
			c4.forEach(c => {
				var resolvedVariable = this.currentScope.hasVariableInScopeChain(c.text)
				if (resolvedVariable) {
					this.handleSimpleIdentifier(c, true)
				}
			})
		}

		if (node.type === "property_declaration") {
			if (!(this.findChild(node, "val") && this.findChild(node, "val")?.text != "val")) {
				this.processPropertyDeclaration(node);
			}
		} else if (node.type == 'import_header') {
			this.processImportDeclarations(node);
		}


		if (this.isBlockNode(node) || node.text == "{") {
			this.enterScope(this.currentScope);
			this.enter.push(this.supplyRange(node));
		}


		if (this.isBlockExitNode(node) || node.text == "}") {
			this.exitScope();
			this.exit.push(this.supplyRange(node));
		}

		node.children.forEach(child => this.traverseTree(child, ranges));
	}
	private givePath(path: string, segments: number): string {
		const parts = path.split('.');
		if (segments <= 0 || segments > parts.length) {
			return ""
		}
		return parts.slice(0, segments).join('.');
	}

	private handleSimpleIdentifier(node: SyntaxNode, byPassSI: boolean = false): void {
		if (node.type == "navigation_expression") {
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
			const isUpperCase = /^[A-Z_0-9]+$/.test(node.text) && !this.hasParent(node, "import_list");
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
				} else if (isRecordedImport) {
					this.importRanges.push(this.supplyRange(node))

				} else if (isUpperCase) {
					this.variableBlue.push(this.supplyRange(node));
				}
			} else if (isUpperCase) {
				this.variableBlue.push(this.supplyRange(node));
			}
		}
	}

	private isSpecialHandleWord(node: SyntaxNode): boolean {
		return (node.type == "->" ||
			node.type == "!!" ||
			node.type == "is" ||
			node.type == "?:" ||
			node.type == "in" ||
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
	private isBlockNode(node: SyntaxNode): boolean {
		if (blocks.includes(node.type)) {
			return true;
		}
		if (node.type === "{" && node.parent && blockParents.includes(node.parent.type)) {
			return true;
		}
		return false;
	}
	private isBlockExitNode(node: SyntaxNode): boolean {
		if (node.type !== "}") return false;
		const parent = node.parent;
		if (!parent) return false;
		const hasOpeningBracket = parent.children.some(child => child.type === "{");
		const isExplicitBlock = blocks.includes(parent.type);
		return hasOpeningBracket || isExplicitBlock;
	}
	private hasParent(node: SyntaxNode, parentType: string): boolean {
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

	private findChild(node: SyntaxNode, type: string, expectedParent: string | null = null): SyntaxNode | null {
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
	private isValueInDeclaration(node: TSParser.SyntaxNode): boolean {
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

	private processVariableDeclaration(
		identifierNode: TSParser.SyntaxNode,
		variableNode: TSParser.SyntaxNode | null,
		range: vscode.Range
	): void {
		const variableName = identifierNode.text;
		if (this.currentScope.variables.has(variableName)) {
			logContent("Variable already defined in current scope: " + variableName + ", Depth: " + this.currentScope.depth +
				", Position: " + range.start.line + ":" + range.start.character
			)
			return;
		}
		this.varId++
		const variableSymbol = new VariableSymbol(
			variableName,
			range,
			identifierNode,
			variableNode ? variableNode.text : "",
			this.currentScope
		);
		//console.log("Defining variable in current scope: " + variableName + ", Depth: " + this.currentScope.depth)
		this.currentScope.define(variableSymbol);
		this.scopedVariables.set(`${variableName}@${this.currentScope.id}@${this.varId}`, variableSymbol);
	}



	private processImportDeclaration(node: TSParser.SyntaxNode, range: vscode.Range) {
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


	exitScope(): void {
		if (!this.currentScope.parentScope) {
			return;
		}
		this.currentScope = this.currentScope.parentScope;
	}

}
export class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {

	private readonly highlightQuery: TSParser.Query;
	private readonly treeProvider: TreeProvider;
	constructor(treeProvider: TreeProvider, highlightQuery: TSParser.Query) {
		this.treeProvider = treeProvider;
		this.highlightQuery = highlightQuery;
	}
	updateTokens() {
		const tree = this.treeProvider.tree
		const builder = new vscode.SemanticTokensBuilder(LEGEND);
		if (!tree) return builder.build()
		const matches = this.highlightQuery.matches(tree.rootNode);
		console.log("updating semantic tokens...");
		matches.forEach(match => {
			match.captures.forEach(capture => {
				const node = capture.node;
				var range = this.treeProvider.supplyRange(node)
				if (capture.name == "keyword.return" && node.firstChild) {
					range = this.treeProvider.supplyRange(node.firstChild)
				} else if (capture.name == 'namespace' && node.firstChild) {
					range = this.treeProvider.supplyRange(node.firstChild)
				}
				this.processTokenType(capture, range, builder);
			});
		});
		return builder.build();
	}


	provideDocumentSemanticTokens = (): vscode.ProviderResult<vscode.SemanticTokens> => this.updateTokens();
	private processTokenType(capture: QueryCapture, range: vscode.Range, builder: vscode.SemanticTokensBuilder): void {
		let tokenType: string = '';
		let name = capture.name
		//console.log("Name: " + name + ", Type: " + capture.node.type)
		switch (name) {
			case 'function':
				if (reservedWords.includes(capture?.node?.text)) {
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
			case 'namespace':
			case 'keyword':
			case 'exception':
			case 'include':
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
			case 'property':
				if (capture.node.parent?.parent?.parent?.type === "call_expression") {
					tokenType = 'method';
				} else {
					tokenType = 'property';
				}
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
				tokenType = 'regexp';
				break;
			case 'variable':
				if (capture?.node.parent?.type == "function_declaration") {
					tokenType = 'function';
				} else {
					tokenType = 'variable';
					return
				}
				break;
			case 'variable.builtin':
			case 'variableIdentifier':
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
				const interpolatedNodes = [
					...this.treeProvider.findChildren(capture.node, ['interpolated_expression']),
					...this.treeProvider.findChildren(capture.node, ['interpolated_identifier']),
				];
				const excludedRanges: vscode.Range[] = [];

				let currentLine = stringRange.start.line;
				let currentCharacter = stringRange.start.character;

				interpolatedNodes.forEach((interpolatedNode) => {
					const interpolatedRange = this.treeProvider.supplyRange(interpolatedNode);
					if (
						interpolatedRange.start.line > currentLine ||
						interpolatedRange.start.character > currentCharacter
					) {
						excludedRanges.push(
							new vscode.Range(
								currentLine,
								currentCharacter,
								interpolatedRange.start.line,
								interpolatedRange.start.character
							)
						);
					}
					currentLine = interpolatedRange.end.line;
					currentCharacter = interpolatedRange.end.character;
				});
				if (
					currentLine < stringRange.end.line ||
					currentCharacter < stringRange.end.character
				) {
					excludedRanges.push(
						new vscode.Range(
							currentLine,
							currentCharacter,
							stringRange.end.line,
							stringRange.end.character
						)
					);
				}
				excludedRanges.forEach((range) => {
					for (let line = range.start.line; line <= range.end.line; line++) {
						const startCharacter = line === range.start.line ? range.start.character : 0;
						const endCharacter =
							line === range.end.line
								? range.end.character
								: this.getLineLength(line);

						const singleLineRange = new vscode.Range(
							line,
							startCharacter,
							line,
							endCharacter
						);
						builder.push(singleLineRange, 'string');
					}
				});

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
		 */}
	}
	/**
 * Helper function to get the length of a line from the document.
 * This ensures endCharacter is accurately calculated.
 */
	private getLineLength(line: number): number {
		const document = vscode.window.activeTextEditor?.document;
		if (!document) {
			console.error(`Failed to access document for line length calculation.`);
			return 0;
		}
		return document.lineAt(line).text.length;
	}


}


class ImportDefinitionProvider implements vscode.DefinitionProvider {
	private readonly imports: Map<string, ImportSymbol>;
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
	private readonly scopedVariables: Map<string, VariableSymbol>;

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
			const [variableName, scopeDepth] = key.split("@");

			if (variableName === word) {
				matchingSymbol = Array.from(this.scopedVariables.entries())
					.filter(([key, _]) => key.startsWith(`${word}@`))
					.sort((a, b) => parseInt(a[0].split("@")[1]) - parseInt(b[0].split("@")[1]))
					.map(([_, symbol]) => symbol)[0];
				break;
			}
		}

		if (!matchingSymbol) {
			return null;
		}

		return new vscode.Location(document.uri, matchingSymbol.range);
	}
}




function updateDecorationsForVisibleRanges(editor: vscode.TextEditor, parser: TreeProvider) {
	const visibleRanges = editor.visibleRanges;
	parser.getscopedVariables().forEach((variable, name) => {
		const range = variable.range;
		if (range) {
			const filteredRanges: vscode.Range[] = [];
			const isVisible = visibleRanges.some(visibleRange => {
				const overlaps =
					range.start.line < visibleRange.end.line &&
					range.end.line > visibleRange.start.line ||
					(
						range.start.line === visibleRange.end.line &&
						range.start.character <= visibleRange.end.character
					) ||
					(
						range.end.line === visibleRange.start.line &&
						range.end.character >= visibleRange.start.character
					);
				return overlaps;
			});

			if (isVisible || !parser.init) {
				filteredRanges.push(range);
			}

			if (filteredRanges.length > 0) {
				parser.rangesToDecorate.set(name, filteredRanges);
			}
		}
	});

	parser.init = true;

	const allRanges = Array.from(parser.rangesToDecorate.values()).flat();
	editor.setDecorations(VariableDecorationType, allRanges);
}

function debounce(fn: Function, delay: number): (...args: any[]) => void {
	let timeout: NodeJS.Timeout | null = null;
	return (...args: any[]) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
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
	document: vscode.TextDocument,
	context: vscode.ExtensionContext,
	selector: vscode.DocumentSelector
) {
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
		/* if (!treeProvider.isUpdating) {
			treeProvider.updateTokens(editor.visibleRanges);
		} */
		if (!treeProvider.isUpdating) {
			const documentLineCount = document.lineCount;
			const lineBoundary = 1000;
			const startLine = Math.max(0, editor.visibleRanges[0].start.line - lineBoundary);
			const endLine = Math.min(documentLineCount - 1, editor.visibleRanges[0].end.line + lineBoundary);

			const affectedRanges = [
				new vscode.Range(
					startLine,
					0,
					endLine,
					Number.MAX_SAFE_INTEGER
				),
			];
			treeProvider.updateTokens(affectedRanges);
		}
		updateDecorationsForVisibleRanges(editor, treeProvider);
		/* const variableDefinitionProvider = new KotlinScriptDefinitionProvider(treeProvider.getscopedVariables());
		context.subscriptions.push(
			vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
		); */
	}
}
const semanticTokensEnabled = true
export async function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('kotlinscript');
	const ktsDirectory = config.get<string>('ktsDirectory', 'config/scripts');
	const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
	await TSParser.init();

	const parser = new TSParser();
	const wasmPath = context.asAbsolutePath('parsers/tree-sitter-kotlin.wasm');
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
				const affectedRanges: vscode.Range[] = [];
				event.contentChanges.forEach(change => {
					const editedLine = change.range.start.line;
					const startLine = Math.max(0, editedLine - lineBoundary);
					const endLine = Math.min(documentLineCount - 1, editedLine + lineBoundary);
					affectedRanges.push(new vscode.Range(
						startLine,
						0,
						endLine,
						Number.MAX_SAFE_INTEGER
					));
				});
				treeProvider.updateTokens(affectedRanges);
				updateDecorationsForVisibleRanges(editor, treeProvider);
			}
		}
	});

	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		updateTokensForDocument(event.textEditor.document, context, selector);
	});

	// Runs on start
	if (editor) {
		addDocumentIfNotExists(editor.document);
		var doc = documentData.get(editor.document.uri.toString())
		if (doc) {
			updateTokensForDocument(editor.document, context, selector);
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
