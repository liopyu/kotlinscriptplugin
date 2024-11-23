import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import TSParser, { SyntaxNode, Tree } from 'web-tree-sitter';
import {
	VariableSymbol,
	ImportSymbol,
	applyDecorations,
	MethodDecorationType,
	SimpleDecorationType,
	ImportDecorationType,
	VariableDecorationType,
	OtherDecorationType,
	VariableType,
	Scope
} from './symbols';
const individualLogging = true;
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
	'keyword', 'type', 'function', 'string', 'variable', 'property', 'parameter', 'comment', 'operator', 'return'
];
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
let blockParents = [
	"anonymous_initializer",
	"secondary_constructor",
	"control_structure_body",
	"try_expression",
	"catch_block",
	"finally_block",
	"when_expression"
];
let blocks = [
	"annotated_lambda",
	"lambda_literal",
	"function_body",
	"control_structure_body",
	"class_body",
]
export class TreeProvider {
	public hasPackageHeader: boolean = false;
	public currentScope: Scope = new Scope(null);
	public scopes: Scope[] = [];
	public ranges: Map<VariableType, vscode.Range[]> = new Map();
	public simpleRanges: vscode.Range[] = []
	public readonly parser: TSParser;
	public scopedVariables: Map<string, VariableSymbol> = new Map();
	private imports: Map<string, ImportSymbol> = new Map();
	public tree: TSParser.Tree | undefined = undefined;
	private currentImports: Set<string> = new Set();
	public isUpdating: boolean = false;
	constructor(parser: TSParser, document: vscode.TextDocument) {
		this.parser = parser;
		logGlobals("initializing tokens provider")
		this.scopes.push(this.currentScope)

		const fullText = document.getText();
		this.tree = this.parser.parse(fullText);
		var allRanges = [new vscode.Range(0, 0, document.lineCount, 0)]
		this.updateTokens(allRanges)
	}
	updateTokens(changedRanges: vscode.Range[]): void {
		this.isUpdating = true;
		logGlobals("Updating tokens for changed ranges...");
		if (!this.tree) {
			console.error("Tree is not initialized.");
			this.isUpdating = false;
			return;
		}
		this.validateVariables(this.tree);
		this.traverseTree(this.tree.rootNode, changedRanges);
		if (editor && !semanticTokensEnabled) {
			editor.setDecorations(OtherDecorationType, this.enter)
			editor.setDecorations(ImportDecorationType, this.exit)
			this.enter = []
			this.exit = []
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
	private validateVariables(tree: TSParser.Tree): void {
		const variablesToRemove: string[] = [];
		for (const [variableName, variableSymbol] of this.scopedVariables.entries()) {
			const expectedRange = variableSymbol.range;
			const node = tree.rootNode.descendantForPosition({
				row: expectedRange.start.line,
				column: expectedRange.start.character,
			});
			if (!node || node.text !== variableName) {
				console.log(`Node mismatch for variable: ${variableName}`);
				variablesToRemove.push(variableName);
				continue;
			}
			const actualRange = this.supplyRange(node);
			if (!this.rangesEqual(expectedRange, actualRange)) {
				console.log(`Range mismatch for variable '${variableName}': updating to ${actualRange}`);
				variableSymbol.setRange(actualRange);
				continue;
			}
			let currentNode: TSParser.SyntaxNode | null = node;
			let isValid = false;
			while (currentNode) {
				if (currentNode.type === 'property_declaration' || currentNode.type === 'variable_declaration') {
					isValid = true;
					break;
				}
				currentNode = currentNode.parent;
			}
			if (!isValid) {
				console.log(`Invalid context for variable: ${variableName}`);
				variablesToRemove.push(variableName);
			}
		}
		for (const variableName of variablesToRemove) {
			this.scopedVariables.delete(variableName);
			if (rangesToDecorate.has(variableName)) {
				rangesToDecorate.delete(variableName);
			}
			logContent(`Removed stale variable '${variableName}'`);
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

		valueNodes.forEach(valueNode => {
			if (!this.isValueInDeclaration(valueNode)) return;

			const variables = this.extractVariables(node);

			variables.forEach((range, variableNode) => {
				this.processVariableDeclaration(variableNode, valueNode, range);
			});
		});
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
		const importNodes = this.findChildren(node, ["import_declaration"]);
		importNodes.forEach(importNode => {
			const range = this.supplyRange(importNode);
			this.processImportDeclaration(importNode, range, this.currentImports);
		});
	};
	private enter: vscode.Range[] = [];
	private exit: vscode.Range[] = [];

	private traverseTree(node: SyntaxNode, ranges: vscode.Range[]): void {
		const nodeRange = this.supplyRange(node)
		const isInRange = ranges.some(range => range.intersection(nodeRange) !== undefined);
		if (!isInRange) {
			return;
		}
		console.log("Node Type: " + node.type + ", Node Text: " + node.text + ", Node Child: " + node.firstChild?.type + ", Node Parent: " + node.parent?.type)
		if (node.type === "property_declaration") {
			this.processPropertyDeclaration(node);
		} else if (this.isImportDeclaration(node)) {
			this.processImportDeclarations(node);
		} else if (this.isBlockNode(node)) {
			this.enterScope(this.currentScope)
			this.enter.push(this.supplyRange(node))
		} else if (this.isBlockExitNode(node)) {
			this.exitScope();
			this.exit.push(this.supplyRange(node))
		}

		node.children.forEach(child => this.traverseTree(child, ranges));
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

	private findChildren(
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
	private isRangeVisible(range: vscode.Range): boolean {
		const visibleRanges = vscode.window.activeTextEditor?.visibleRanges;
		return visibleRanges ? visibleRanges.some(visibleRange => visibleRange.intersection(range) !== undefined) : false;
	}
	private processVariableDeclaration(identifierNode: TSParser.SyntaxNode, variableNode: TSParser.SyntaxNode, range: vscode.Range) {
		const variableName = identifierNode.text;
		if (this.scopedVariables.has(variableName)) return
		const variableSymbol = new VariableSymbol(variableName, range, identifierNode, variableNode.text, this.currentScope);
		this.currentScope.define(variableSymbol);
		this.scopedVariables.set(variableName, variableSymbol);
	}
	private processImportDeclaration(node: TSParser.SyntaxNode, range: vscode.Range, currentImports: Set<string>) {
		const importName = node.text;
		currentImports.add(importName);

		if (this.imports.has(importName)) {
			this.imports.delete(importName);
		} else {
			this.imports.set(importName, new ImportSymbol(importName, range, node));
		}
	}

	private isImportDeclaration(node: TSParser.SyntaxNode): boolean {
		const isSimpleIdentifier = node.type === 'simple_identifier';
		const hasParentIdentifier = node.parent?.type === 'identifier';
		const hasGrandparentImportHeader = node.parent?.parent?.type === 'import_header';
		const isLastChild = node.nextSibling === null;
		return isSimpleIdentifier && hasParentIdentifier && hasGrandparentImportHeader && isLastChild;
	}
	getscopedVariables(): Map<string, VariableSymbol> {
		return this.scopedVariables;
	}
	getimports(): Map<string, ImportSymbol> {
		return this.imports;
	}
	enterScope(newScope: Scope) {
		this.scopes.push(newScope);
		newScope.parentScope = this.currentScope;
		this.currentScope = newScope;
	}
	exitScope() {
		if (this.currentScope.parentScope) {
			this.currentScope = this.currentScope.parentScope;
		}
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
		matches.forEach(match => {
			match.captures.forEach(capture => {
				const node = capture.node;
				const range = new vscode.Range(
					node.startPosition.row,
					node.startPosition.column,
					node.endPosition.row,
					node.endPosition.column
				);
				this.processTokenType(capture.name, range, builder);
			});
		});
		return builder.build();
	}
	provideDocumentSemanticTokens(): vscode.ProviderResult<vscode.SemanticTokens> {
		return this.updateTokens()
	}
	private processTokenType(name: string, range: vscode.Range, builder: vscode.SemanticTokensBuilder) {
		let tokenType = '';

		switch (name) {
			case 'keyword':
			case 'include':
			case 'keyword.function':
			case 'return':
			case 'conditional':
				tokenType = 'keyword';
				break;
			case 'type':
			case 'type.builtin':
				tokenType = 'type';
				break;
			case 'function':
			case 'function.builtin':
				tokenType = 'function';
				break;
			case 'string':
			case 'string.escape':
			case 'string.regex':
				tokenType = 'string';
				break;
			//Variables are handled separately
			/* case 'variable':
				tokenType = 'variable';
				break; */
			case 'property':
				tokenType = 'property';
				break;
			case 'parameter':
				tokenType = 'parameter';
				break;
			case 'comment':
				tokenType = 'comment';
				break;
			case 'operator':
				tokenType = 'operator';
				break;
			default:
				return;
		}

		builder.push(range, tokenType);
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
	provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
		const wordRange = document.getWordRangeAtPosition(position);
		const word = document.getText(wordRange);
		const variableSymbol = this.scopedVariables.get(word);
		if (!variableSymbol) {
			return null;
		}
		return new vscode.Location(
			document.uri,
			variableSymbol.range
		);
	}
}
const rangesToDecorate: Map<string, vscode.Range[]> = new Map();
let init: boolean = false;

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

			if (isVisible || !init) {
				filteredRanges.push(range);
			}

			if (filteredRanges.length > 0) {
				rangesToDecorate.set(name, filteredRanges);
			}
		}
	});

	init = true;

	const allRanges = Array.from(rangesToDecorate.values()).flat();
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
		if (!treeProvider.isUpdating) {
			treeProvider.updateTokens(editor.visibleRanges);
		}
		updateDecorationsForVisibleRanges(editor, treeProvider);
		const variableDefinitionProvider = new KotlinScriptDefinitionProvider(treeProvider.getscopedVariables());
		context.subscriptions.push(
			vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
		);
	}
}
const semanticTokensEnabled = true
export async function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('kotlinscript');
	const ktsDirectory = config.get<string>('ktsDirectory', 'config/scripts');
	const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
	await TSParser.init();
	var semanticTokensProvider: SemanticTokensProvider | undefined = undefined
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
	const debouncedChangeTokens = debounce((event: vscode.TextDocumentChangeEvent) => {
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
	}, 100);
	vscode.workspace.onDidChangeTextDocument(event => {
		debouncedChangeTokens(event);
	});
	const debouncedUpdateTokens = debounce(
		(document: vscode.TextDocument, context: vscode.ExtensionContext, selector: vscode.DocumentSelector) => {
			updateTokensForDocument(document, context, selector);
		},
		1000
	);
	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		debouncedUpdateTokens(event.textEditor.document, context, selector);
	});

	// Runs on start
	if (editor) {
		addDocumentIfNotExists(editor.document);
		var doc = documentData.get(editor.document.uri.toString())
		if (doc) {
			debouncedUpdateTokens(editor.document, context, selector);
			if (semanticTokensEnabled) {
				semanticTokensProvider = new SemanticTokensProvider(doc.treeProvider, highlightQuery);
				context.subscriptions.push(
					vscode.languages.registerDocumentSemanticTokensProvider(selector, semanticTokensProvider, LEGEND)
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
