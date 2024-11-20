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
	private readonly parser: TSParser;
	private readonly highlightQuery: TSParser.Query;
	private scopedVariables: Map<string, VariableSymbol> = new Map();
	private imports: Map<string, ImportSymbol> = new Map();
	private hasInited: boolean = false;
	private tree: TSParser.Tree;
	private lastDocument: string | null = null;
	constructor(parser: TSParser, highlightQuery: TSParser.Query, document: vscode.TextDocument) {
		this.parser = parser;
		console.log("initializing tokens provider")
		this.scopes.push(this.currentScope)
		this.highlightQuery = highlightQuery
		this.tree = this.parser.parse(document.getText());
	}
	updateTokens(document: vscode.TextDocument): void {
		console.log("parsing new contents...");

		if (!this.lastDocument) {
			this.lastDocument = document.getText();
		}

		this.tree = this.parser.parse(this.lastDocument);
		this.lastDocument = document.getText();
		const newTree = this.parser.parse(document.getText(), this.tree);

		const currentVariables: Set<string> = new Set();
		const currentImports: Set<string> = new Set();

		const processPropertyDeclaration = (node: SyntaxNode): void => {
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
						this.processVariableDeclaration(variableNode, valueNode, range, currentVariables);
					});
				}
			});
		};

		const processImportDeclarations = (node: SyntaxNode): void => {
			const importNodes = this.findChildren(node, ["import_declaration"]);
			importNodes.forEach(importNode => {
				const range = this.supplyRange(importNode);
				this.processImportDeclaration(importNode, range, currentImports);
			});
		};

		const traverseTree = (node: SyntaxNode): void => {
			console.log("Node type: " + node.type + ", Node Text: " + node.text);
			if (node.type === "property_declaration") {
				processPropertyDeclaration(node);
			} else if (this.isImportDeclaration(node)) {
				processImportDeclarations(node);
			}

			node.children.forEach(traverseTree);
		};

		traverseTree(newTree.rootNode);

		this.cleanupStaleEntries(this.scopedVariables, currentVariables);
		this.cleanupStaleEntries(this.imports, currentImports);

		this.tree = newTree;
		newTree.delete();
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


	private supplyRange(node: SyntaxNode) {
		return new vscode.Range(
			node.startPosition.row,
			node.startPosition.column,
			node.endPosition.row,
			node.endPosition.column
		)
	}

	private nodeHasRelevantChanges(node: TSParser.SyntaxNode, changedRanges: TSParser.Range[]): boolean {
		const result = changedRanges.some((range, rangeIndex) => {
			const nodeStart = node.startPosition;
			const nodeEnd = node.endPosition;
			const intersects = (
				(nodeStart.row < range.endPosition.row ||
					(nodeStart.row === range.endPosition.row && nodeStart.column <= range.endPosition.column)) &&
				(nodeEnd.row > range.startPosition.row ||
					(nodeEnd.row === range.startPosition.row && nodeEnd.column >= range.startPosition.column))
			);
			return intersects;
		});
		return result;
	}



	private processVariableDeclaration(identifierNode: TSParser.SyntaxNode, variableNode: TSParser.SyntaxNode, range: vscode.Range, currentVariables: Set<string>) {
		var variableName = identifierNode.text

		if (currentVariables.has(variableName)) return;

		currentVariables.add(variableName);

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

			console.log(`Declared variable: ${variableName} with type: ${variableType}, value: ${variableValue}`);
		} else {
			variablRanges.get(variableName)?.push(range);
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
	private cleanupStaleEntries(map: Map<string, any>, currentEntries: Set<string>) {
		for (const key of map.keys()) {
			if (!currentEntries.has(key)) {
				map.delete(key);
				variablRanges.delete(key)
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


function isRangeVisible(range: vscode.Range): boolean {
	const visibleRanges = vscode.window.activeTextEditor?.visibleRanges;
	return visibleRanges ? visibleRanges.some(visibleRange => visibleRange.intersection(range) !== undefined) : false;
}

function updateDecorationsForVisibleRanges(editor: vscode.TextEditor, parser: TreeProvider) {
	//return
	const visibleRanges = editor.visibleRanges;
	var rangesToDecorate: vscode.Range[] = [];
	parser.getscopedVariables().forEach(variable => {
		const allRanges = variablRanges.get(variable.name)
		if (allRanges) {
			allRanges.filter(range => {
				var r = visibleRanges.some(visibleRange => visibleRange.intersection(range) !== undefined)
				if (r) {
					rangesToDecorate.push(range)
				}
			});
		}
	})
	parser.getimports().forEach(variable => {
		const allRanges = variablRanges.get(variable.name)
		if (allRanges) {
			allRanges.filter(range => {
				var r = visibleRanges.some(visibleRange => visibleRange.intersection(range) !== undefined)
				if (r) {
					rangesToDecorate.push(range)
				}
			});
		}
	})
	editor.setDecorations(VariableDecorationType, rangesToDecorate);
}
let intervalId: NodeJS.Timeout | undefined;
function startPeriodicDecorationUpdate(editor: vscode.TextEditor, provider: any) {
	if (intervalId) clearInterval(intervalId);
	intervalId = setInterval(() => {
		updateDecorationsForVisibleRanges(editor, provider);
	}, 1000);
}
const documentData = new Map<string, CustomData>();
interface CustomData {
	treeProvider: TreeProvider;
	document: vscode.TextDocument;
}
let totalDocuments = 0;
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
		const documentUri = event.document.uri.toString();
		const data = documentData.get(documentUri);
		if (data) {
			/* var editedRanges: vscode.Range[] = []
			event.contentChanges.forEach(content => {
				editedRanges.push(content.range)
			}) */
			data.treeProvider.updateTokens(event.document);
			if (editor) {
				updateDecorationsForVisibleRanges(editor, data.treeProvider);
				const variableDefinitionProvider = new KotlinScriptDefinitionProvider(data.treeProvider.getscopedVariables());
				context.subscriptions.push(
					vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
				);
			}
		}
	});
	/* vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		const documentUri = event.textEditor.document.uri.toString();
		const data = documentData.get(documentUri);
		if (data) {
			data.treeProvider.updateTokens(event.textEditor.document);
			updateDecorationsForVisibleRanges(event.textEditor, data.treeProvider);
			const variableDefinitionProvider = new KotlinScriptDefinitionProvider(data.treeProvider.getscopedVariables());
			context.subscriptions.push(
				vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
			);
		}
	}); */

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
			startPeriodicDecorationUpdate(editor, doc.treeProvider);
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
