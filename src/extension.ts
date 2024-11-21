import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import TSParser, { SyntaxNode } from 'web-tree-sitter';
import {
	VariableSymbol,
	ImportSymbol,
	applyDecorations,
	MethodDecorationType,
	SimpleDecorationType,
	ImportDecorationType,
	VariableDecorationType,
	VariableType,
	Scope
} from './symbols';
import { resourceUsage } from 'process';
const individualLogging = false;
const globalLogging = false;
const exitGlobals = false;
const enterGlobals = false;
const editor = vscode.window.activeTextEditor;
const variablRanges: Map<string, vscode.Range[]> = new Map()
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
export class TreeProvider {
	public hasPackageHeader: boolean = false;
	public currentScope: Scope = new Scope(null);
	public scopes: Scope[] = [];
	public ranges: Map<VariableType, vscode.Range[]> = new Map();
	public simpleRanges: vscode.Range[] = []
	public readonly parser: TSParser;
	private readonly highlightQuery: TSParser.Query;
	private scopedVariables: Map<string, VariableSymbol> = new Map();
	private imports: Map<string, ImportSymbol> = new Map();
	private hasInited: boolean = false;
	public tree: TSParser.Tree | undefined = undefined;
	private lastDocument: string | null = null;
	private currentVariables: Set<string> = new Set();
	private currentImports: Set<string> = new Set();
	public isUpdating: boolean = false;
	constructor(parser: TSParser, highlightQuery: TSParser.Query, document: vscode.TextDocument) {
		this.parser = parser;
		console.log("initializing tokens provider")
		this.scopes.push(this.currentScope)
		this.highlightQuery = highlightQuery

		const fullText = document.getText();
		this.tree = this.parser.parse(fullText);
		this.traverseTree(this.tree.rootNode, [new vscode.Range(0, 0, document.lineCount, 0)]);
	}


	updateTokens(visibleRanges: vscode.Range[]): void {
		this.isUpdating = true;

		console.log("Updating tokens for visible ranges...");

		if (!this.tree) {
			console.error("Tree is not initialized.");
			this.isUpdating = false;
			return;
		}

		// Traverse the updated tree
		this.traverseTree(this.tree.rootNode, visibleRanges);

		// Retain existing ranges for variables outside visible ranges
		/* this.cleanupStaleEntries(this.scopedVariables, this.currentVariables);
		this.cleanupStaleEntries(this.imports, this.currentImports); */

		// Clear temporary states
		this.currentVariables.clear();
		this.currentImports.clear();
		this.isUpdating = false;
	}



	private processPropertyDeclaration(node: SyntaxNode) {
		const valueNodes = this.findChildren(node, expressionTypes, "property_declaration");
		valueNodes.forEach(valueNode => {
			if (this.isValueInDeclaration(valueNode)) {
				const variables: Map<SyntaxNode, vscode.Range> = new Map();
				const declarationNodes = this.findChildren(node, variableDeclarationTypes);
				declarationNodes.forEach(declaration => {
					if (declaration.type === "multi_variable_declaration") {
						const individualDeclarations = this.findChildren(declaration, ["variable_declaration"]);
						individualDeclarations.forEach(variable => {
							const userTypeNode = this.findChild(variable, "user_type");
							const variableNode = userTypeNode ? variable.firstChild : variable;
							if (variableNode) {
								const range = this.supplyRange(variableNode);
								if (variableNode) variables.set(variableNode, range);
							}
						});
					} else if (declaration.type === "variable_declaration") {
						const userTypeNode = this.findChild(declaration, "user_type");
						const variableNode = userTypeNode ? declaration.firstChild : declaration;
						if (variableNode) {
							const range = this.supplyRange(variableNode);
							if (variableNode) variables.set(variableNode, range);
						}
					}
				});

				variables.forEach((range, variableNode) => {
					this.processVariableDeclaration(variableNode, valueNode, range, this.currentVariables);
				});
			}
		});
	};

	private processImportDeclarations(node: SyntaxNode) {
		const importNodes = this.findChildren(node, ["import_declaration"]);
		importNodes.forEach(importNode => {
			const range = this.supplyRange(importNode);
			this.processImportDeclaration(importNode, range, this.currentImports);
		});
	};
	private isVisibleParsing(node: SyntaxNode): boolean {
		return this.isRangeVisible(
			new vscode.Range(
				node.startPosition.row,
				node.startPosition.column,
				node.endPosition.row,
				node.endPosition.column
			)
		);
	}
	private adjustRangeForVisibleText(node: SyntaxNode, visibleRanges: vscode.Range[]): vscode.Range {
		const offset = visibleRanges[0].start; // Start of the first visible range
		//consoleLogVisibleRanges(visibleRanges)
		return new vscode.Range(
			node.startPosition.row + offset.line,
			node.startPosition.column + offset.character,
			node.endPosition.row + offset.line,
			node.endPosition.column + offset.character
		);
	}
	private traverseTree(node: SyntaxNode, visibleRanges: vscode.Range[]): void {
		const nodeRange = new vscode.Range(
			node.startPosition.row,
			node.startPosition.column,
			node.endPosition.row,
			node.endPosition.column
		);

		const isInVisibleRange = visibleRanges.some(visibleRange =>
			visibleRange.intersection(nodeRange) !== undefined
		);

		if (!isInVisibleRange) {
			return;
		}

		if (node.type === "property_declaration") {
			this.processPropertyDeclaration(node);
		} else if (this.isImportDeclaration(node)) {
			this.processImportDeclarations(node);
		}
		node.children.forEach(child => this.traverseTree(child, visibleRanges));
	}


	private isValueInDeclaration(node: TSParser.SyntaxNode): boolean {
		// Detects the `10` in `var x = 10`
		return node.parent?.type === 'property_declaration' && expressionTypes.includes(node.type);
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

			if (this.isVisibleParsing(child)) {
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
		}
		return null;
	}


	private supplyRange(node: SyntaxNode) {
		return new vscode.Range(
			node.startPosition.row,
			node.startPosition.column,
			node.endPosition.row,
			node.endPosition.column
		)
	}

	private isRangeVisible(range: vscode.Range): boolean {
		const visibleRanges = vscode.window.activeTextEditor?.visibleRanges;
		//consoleLogVisibleRanges(visibleRanges)
		return visibleRanges ? visibleRanges.some(visibleRange => visibleRange.intersection(range) !== undefined) : false;
	}
	private processVariableDeclaration(identifierNode: TSParser.SyntaxNode, variableNode: TSParser.SyntaxNode, range: vscode.Range, currentVariables: Set<string>) {
		var variableName = identifierNode.text

		if (currentVariables.has(variableName)) return;

		currentVariables.add(variableName);
		try {
			if (!this.scopedVariables.has(variableName)) {
				variablRanges.set(variableName, []);

				//console.log("Adding definition for variable: " + variableName);
				const variableType = variableNode.type ? variableNode.type : "Any";
				const variableValue = variableNode.text;
				// Create the VariableSymbol with the extracted value
				const variableSymbol = new VariableSymbol(variableName, range, identifierNode, variableValue);

				// Define the symbol in the current scope and add to scopedVariables
				this.currentScope.define(variableSymbol);
				this.scopedVariables.set(variableName, variableSymbol);

				// Log the symbol details including its value
				//console.log("Variable Symbol:", variableSymbol);
				variablRanges.get(variableName)?.push(range);

				//console.log(`Declared variable: ${variableName} with type: ${variableType}, value: ${variableValue}`);
			} else {
				variablRanges.get(variableName)?.push(range);
			}
		} catch (error) {
			console.error(error);
		}
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
	private cleanupStaleEntries(map: Map<string, any>, currentEntries: Set<string>): void {
		for (const key of map.keys()) {
			if (!currentEntries.has(key)) {
				map.delete(key);
				// Only delete from variablRanges if no ranges exist for the variable
				if (variablRanges.has(key) && variablRanges.get(key)?.length === 0) {
					variablRanges.delete(key);
				}
			}
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
function updateDecorationsForVisibleRanges(editor: vscode.TextEditor, parser: TreeProvider) {
	const visibleRanges = editor.visibleRanges;
	const rangesToDecorate: vscode.Range[] = [];

	parser.getscopedVariables().forEach(variable => {
		const allRanges = variablRanges.get(variable.name);
		if (allRanges) {
			allRanges.forEach(range => {
				//console.log(`Checking Variable Range: (${range.start.line}, ${range.start.character}) - (${range.end.line}, ${range.end.character})`);
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
					//console.log(`Visible Range: (${visibleRange.start.line}, ${visibleRange.start.character}) - (${visibleRange.end.line}, ${visibleRange.end.character}), Overlaps: ${overlaps}`);
					return overlaps;
				});
				if (isVisible) {
					rangesToDecorate.push(range);
				}
			});
		}
	});


	//console.log(`Total Ranges to Decorate: ${rangesToDecorate.length}`);
	editor.setDecorations(VariableDecorationType, rangesToDecorate);
}



let intervalId: NodeJS.Timeout | undefined;
function startPeriodicDecorationUpdate(provider: TreeProvider) {
	return
	if (intervalId) clearInterval(intervalId);

	intervalId = setInterval(() => {
		if (editor) {
			const visibleText = editor.visibleRanges
				.map(range => editor.document.getText(range))
				.join('\n'); // Combine visible ranges into a single text block
			//consoleLogVisibleRanges(editor.visibleRanges)
			provider.updateTokens(editor.visibleRanges);
			updateDecorationsForVisibleRanges(editor, provider);
		}
	}, 1000);
}

const documentData = new Map<string, CustomData>();
interface CustomData {
	treeProvider: TreeProvider;
	document: vscode.TextDocument;
}
function isRangeVisible(range: vscode.Range): boolean {
	const visibleRanges = vscode.window.activeTextEditor?.visibleRanges;
	return visibleRanges ? visibleRanges.some(visibleRange => visibleRange.intersection(range) !== undefined) : false;
}
function consoleLogVisibleRanges(visibleRanges: vscode.Range[] | undefined) {
	console.log("Visible ranges:");
	if (visibleRanges)
		visibleRanges.forEach(range => {
			console.log("start line: " + range.start.line + " end line: " + range.end.line)
		})
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

function getNodesInRange(rootNode: SyntaxNode, range: vscode.Range): SyntaxNode[] {
	const nodes: SyntaxNode[] = [];
	const traverse = (node: SyntaxNode) => {
		const nodeRange = new vscode.Range(
			node.startPosition.row,
			node.startPosition.column,
			node.endPosition.row,
			node.endPosition.column
		);

		if (
			nodeRange.end.isBefore(range.start) || // Node ends before range starts
			nodeRange.start.isAfter(range.end)    // Node starts after range ends
		) {
			return; // Skip nodes outside the range
		}

		// Add node if it's fully or partially within the range
		nodes.push(node);

		// Traverse children
		node.children.forEach(traverse);
	};

	traverse(rootNode);
	return nodes;
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

		// Apply incremental tree edits based on document content changes
		const changes = document.getText(); // This can be replaced with finer-grained change handling if needed
		if (treeProvider.tree) {
			const newTree = treeProvider.parser.parse(changes, treeProvider.tree);
			treeProvider.tree = newTree;
		}

		// Update tokens and decorations
		if (!treeProvider.isUpdating) {
			treeProvider.updateTokens(editor.visibleRanges);
		}
		updateDecorationsForVisibleRanges(editor, treeProvider);

		// Register updated definition providers
		const variableDefinitionProvider = new KotlinScriptDefinitionProvider(treeProvider.getscopedVariables());
		context.subscriptions.push(
			vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
		);
	}
}

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
			console.log("Adding document");

			const treeProvider = new TreeProvider(parser, highlightQuery, document);

			// Store document and TreeProvider in one map entry
			documentData.set(documentUri, {
				treeProvider: treeProvider,
				document: document
			});
		}
	}

	vscode.workspace.onDidOpenTextDocument(document => {
		addDocumentIfNotExists(document);
		const data = documentData.get(document.uri.toString());
		if (editor && data)
			startPeriodicDecorationUpdate(data.treeProvider);
	});

	vscode.window.onDidChangeVisibleTextEditors(editors => {
		const openUris = new Set(editors.map(editor => editor.document.uri.toString()));

		// Add any documents that are now visible but not in the documentData map
		for (const editor of editors) {
			addDocumentIfNotExists(editor.document);
		}

		// Remove data for documents that are no longer visible
		for (const documentUri of documentData.keys()) {
			if (!openUris.has(documentUri)) {
				documentData.delete(documentUri);
				console.log("Removed document")
			}
		}
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			addDocumentIfNotExists(editor.document);
		}
	});
	const selector: vscode.DocumentSelector = {
		language: 'kotlin',
		scheme: 'file',
		pattern: new vscode.RelativePattern(absoluteKtsDirectory, '*.kts')
	};
	vscode.workspace.onDidChangeTextDocument(event => {
		updateTokensForDocument(event.document, context, selector)
	});


	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		updateTokensForDocument(event.textEditor.document, context, selector)
		/* const documentUri = event.textEditor.document.uri.toString();
		const data = documentData.get(documentUri);

		if (data) {
			const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === documentUri);
			if (editor)
				if (!data.treeProvider.isUpdating) {
					data.treeProvider.updateTokens(event.textEditor.document.getText());
				}
			updateDecorationsForVisibleRanges(event.textEditor, data.treeProvider);
			const variableDefinitionProvider = new KotlinScriptDefinitionProvider(data.treeProvider.getscopedVariables());
			context.subscriptions.push(
				vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
			);
		} */
	});

	if (vscode.window.activeTextEditor) {
		var doc = documentData.get(vscode.window.activeTextEditor.document.uri.toString())
		if (doc) {
			updateDecorationsForVisibleRanges(vscode.window.activeTextEditor, doc.treeProvider);
			const importDefinitionProvider = new ImportDefinitionProvider(doc.treeProvider.getimports());
			context.subscriptions.push(
				vscode.languages.registerDefinitionProvider(selector, importDefinitionProvider)
			);
		}
	}
	if (editor) {
		addDocumentIfNotExists(editor.document);
		var doc = documentData.get(editor.document.uri.toString())
		if (doc) {
			startPeriodicDecorationUpdate(doc.treeProvider);
		}
	}



	/* vscode.workspace.onDidChangeTextDocument(event => {
		var document: vscode.TextDocument = event.document
		var dData = documentData.get(document)
		if (!dData) return console.log("No document")
		dData.treeProvider.scopes.forEach(scope => {
			console.log(scope.depth)
		})
		if (editor) {
			dData.treeProvider.updateTokens()
			updateDecorationsForVisibleRanges(editor, dData.treeProvider);
			variablRanges.forEach((range, key) => {
				console.log("variableRanges: " + key)
			})
		}
	});
	if (editor) {
		const dData = documentData.get(editor.document)
		if (dData) {
			const treeProvider = dData?.treeProvider
			startPeriodicDecorationUpdate(editor, treeProvider);



			if (vscode.window.activeTextEditor) {
				updateDecorationsForVisibleRanges(vscode.window.activeTextEditor, treeProvider);
			}
			// context.subscriptions.push(
			//	vscode.languages.registerDocumentTreeProvider(selector, treeProvider, LEGEND)
			//); 
			
		}
	} */
}


export function deactivate() {
	console.log(`Deactivating KotlinScript extension...`);
}
