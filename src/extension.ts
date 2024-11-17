import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import Parser from 'web-tree-sitter';
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

export class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	public hasPackageHeader: boolean = false;
	public currentScope: Scope = new Scope(null);
	public scopes: Scope[] = [];
	public ranges: Map<VariableType, vscode.Range[]> = new Map();
	public simpleRanges: vscode.Range[] = []
	private readonly parser: Parser;
	private readonly highlightQuery: Parser.Query;
	private scopedVariables: Map<string, VariableSymbol> = new Map();
	private imports: Map<string, ImportSymbol> = new Map();

	constructor(parser: Parser, highlightQuery: Parser.Query) {
		this.parser = parser;
		this.highlightQuery = highlightQuery;
		this.scopes.push(this.currentScope);
	}
	updateTokens(document: vscode.TextDocument) {
		const tree = this.parser.parse(document.getText());
		const builder = new vscode.SemanticTokensBuilder(LEGEND);
		const matches = this.highlightQuery.matches(tree.rootNode);

		const currentVariables: Set<string> = new Set();
		const currentImports = new Set<string>();
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

				if (capture.name === 'variable' && this.isVariableDeclaration(node)) {
					this.processVariableDeclaration(node, range, currentVariables, document);
				} else if (this.isImportDeclaration(node)) {
					this.processImportDeclaration(node, range, currentImports, document);
				}
			});
		});
		this.cleanupStaleEntries(this.scopedVariables, currentVariables);
		this.cleanupStaleEntries(this.imports, currentImports);
		return builder.build();
	}
	provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
		return this.updateTokens(document)
	}


	private processVariableDeclaration(node: Parser.SyntaxNode, range: vscode.Range, currentVariables: Set<string>, document: vscode.TextDocument) {
		const variableName = node.text;

		if (currentVariables.has(variableName)) {
			return;
		}

		currentVariables.add(variableName);

		if (!this.scopedVariables.has(variableName)) {
			variablRanges.set(variableName, []);
			this.enterVariableDeclaration(node, range);
		} else {
			variablRanges.get(variableName)?.push(range);
		}
	}


	enterVariableDeclaration(ctx: Parser.SyntaxNode, range: vscode.Range) {
		try {
			const variableName = ctx ? ctx.text : null;
			if (!variableName) {
				logGlobals("Variable name not found.");
				return;
			}

			logGlobals("Adding definition for variable: " + variableName);
			const variableType = ctx.type ? ctx.type : "Any";


			const variableSymbol = new VariableSymbol(variableName, range, ctx);

			this.currentScope.define(variableSymbol);
			this.scopedVariables.set(variableName, new VariableSymbol(variableName, range, ctx));
			variablRanges.get(variableName)?.push(range)

			logGlobals(`Declared variable: ${variableName} with type: ${variableType}`);
		} catch (error) {
			console.error(error);
		}
	};
	private processImportDeclaration(node: Parser.SyntaxNode, range: vscode.Range, currentImports: Set<string>, document: vscode.TextDocument) {
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

	private isVariableDeclaration(node: Parser.SyntaxNode): boolean {
		return node.parent?.type === 'property_declaration' || node.parent?.type === 'variable_declaration';
	}

	private isImportDeclaration(node: Parser.SyntaxNode): boolean {
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
function updateDecorationsForVisibleRanges(editor: vscode.TextEditor, parser: SemanticTokensProvider) {
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
		//console.log("updating decorations")
	}, 1000);
}
export async function activate(context: vscode.ExtensionContext) {

	const config = vscode.workspace.getConfiguration('kotlinscript');
	const ktsDirectory = config.get<string>('ktsDirectory', 'config/scripts');
	const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);

	await Parser.init();

	const parser = new Parser();
	const wasmPath = context.asAbsolutePath('parsers/tree-sitter-kotlin.wasm');
	const lang = await Parser.Language.load(wasmPath);
	parser.setLanguage(lang);

	const highlightsPath = context.asAbsolutePath('parsers/kotlin_highlights.scm');
	const queryText = fs.readFileSync(highlightsPath, 'utf-8');
	const highlightQuery = lang.query(queryText);

	const semanticTokensProvider = new SemanticTokensProvider(parser, highlightQuery);

	const selector: vscode.DocumentSelector = {
		language: 'kotlin',
		scheme: 'file',
		pattern: new vscode.RelativePattern(absoluteKtsDirectory, '*.kts')
	};
	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		semanticTokensProvider.updateTokens(event.textEditor.document)
		updateDecorationsForVisibleRanges(event.textEditor, semanticTokensProvider);

	});
	if (editor) {
		startPeriodicDecorationUpdate(editor, semanticTokensProvider);
	}
	vscode.workspace.onDidChangeTextDocument(event => {
		if (editor) {
			semanticTokensProvider.updateTokens(editor.document)
			updateDecorationsForVisibleRanges(editor, semanticTokensProvider);
			variablRanges.forEach((range, key) => {
				console.log("variableRanges: " + key)
			})
		}
	});

	if (vscode.window.activeTextEditor) {
		updateDecorationsForVisibleRanges(vscode.window.activeTextEditor, semanticTokensProvider);
	}
	context.subscriptions.push(
		vscode.languages.registerDocumentSemanticTokensProvider(selector, semanticTokensProvider, LEGEND)
	);
	const variableDefinitionProvider = new KotlinScriptDefinitionProvider(semanticTokensProvider.getscopedVariables());
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
	);

	const importDefinitionProvider = new ImportDefinitionProvider(semanticTokensProvider.getimports());
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(selector, importDefinitionProvider)
	);
}


export function deactivate() {
	console.log(`Deactivating KotlinScript extension...`);
}
