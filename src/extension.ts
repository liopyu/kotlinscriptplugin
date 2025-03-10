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
import { SemanticTokensProvider } from './semantictokensprovider';


let availableClasses: Set<string>;
export let typingSuggestions: TypingSuggestion[] = []
let util: utils.Utils
export let console = {
	log,
	warn,
	error
}
export function log(...args: any[]) {
	util.log(...args)
}
export function error(...args: any[]) {
	util.error(...args)
}
export function warn(...args: any[]) {
	util.warn(...args)
}

export async function activate(context: vscode.ExtensionContext) {
	util = utils.Utils.getInstance(context);
	const config = vscode.workspace.getConfiguration('kotlinscript');
	const ktsDirectory = config.get<string>('ktsDirectory', 'config/scripts');
	const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
	await TSParser.init();
	availableClasses = await utils.loadAvailableClasses(absoluteKtsDirectory);
	typingSuggestions = await utils.loadTypingSuggestions(absoluteKtsDirectory);
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

	const selector: vscode.DocumentSelector = [
		{ language: 'kotlin', scheme: 'file', pattern: '**/*.kts' },
		{ language: 'kotlin', scheme: 'file', pattern: path.join(absoluteKtsDirectory, '**/*.kts') }
	];

	function addDocumentIfNotExists(document: vscode.TextDocument) {
		const documentUri = document.uri.toString();
		if (!document.fileName.endsWith(".kts")) return;

		if (!documentData.has(documentUri)) {
			const treeProvider = new TreeProvider(parser, document);
			documentData.set(documentUri, {
				treeProvider: treeProvider,
				document: document
			});
		}
	}

	vscode.workspace.onDidCloseTextDocument(document => {
		const documentUri = document.uri.toString();
		console.log("Closed document: " + documentUri);
		if (documentData.has(documentUri)) {
			const data = documentData.get(documentUri);
			console.log("Data found: " + data);
			if (data?.treeProvider?.diagnosticCollection) {
				console.log("Clearing diagnostics for closed document: " + documentUri);
				data.treeProvider.diagnosticCollection.clear();
			}

			documentData.delete(documentUri);
		}
	});
	vscode.workspace.onDidChangeTextDocument(event => {
		const documentUri = event.document.uri.toString();
		const data = documentData.get(documentUri);
		if (!data) return;

		const { treeProvider, treeProvider: { semanticTokensProvider } } = data;

		let lastChangedRange: vscode.Range | null = null;

		event.contentChanges.forEach(change => {
			if (treeProvider.tree) {
				utils.applyTreeEdit(treeProvider, change, event.document);
			}

			const startPosition = new vscode.Position(change.range.start.line, change.range.start.character);
			const endPosition = new vscode.Position(
				change.range.start.line + (change.text.split("\n").length - 1),
				change.text.length > 0 ? change.range.start.character + change.text.length : change.range.end.character
			);

			const range = new vscode.Range(startPosition, endPosition);

			if (!lastChangedRange || range.start.isBefore(lastChangedRange.start)) {
				lastChangedRange = range;
			}
		});

		if (event.contentChanges.length > 0 && treeProvider.tree) {
			treeProvider.tree = treeProvider.parser.parse(event.document.getText(), treeProvider.tree);
		}

		if (lastChangedRange && semanticTokensProvider) {
			semanticTokensProvider.setLastChangedRange(lastChangedRange);
		}
		/* if (semanticTokensProvider) {
			console.log("OnDidChangeTextDocument")
			semanticTokensProvider.isUpdating = true
			semanticTokensProvider.provideDocumentSemanticTokens()
			semanticTokensProvider.isUpdating = false
		}
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			treeProvider.validateScopes(editor.document);
		} */
		/* if (!semanticTokensProvider) return;

		// Always clear the previous timer before setting a new one
		if (semanticTokensProvider.finalUpdateTimer) {
			clearTimeout(semanticTokensProvider.finalUpdateTimer);
		}

		semanticTokensProvider.finalUpdateTimer = setTimeout(() => {
			console.log("Final update triggered");
			semanticTokensProvider.updateTokens();
			semanticTokensProvider.finalUpdateTimer = null;
		}, semanticTokensProvider.finalUpdateDelay); */
	});


	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			new TypingSuggestionProvider(typingSuggestions),
			''
		)
	);

	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		utils.updateTokensForDocument(event.textEditor.document);
	});

	// Runs on start
	let editor = vscode.window.activeTextEditor;
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


	let semanticTokensProvider: vscode.Disposable | null = null;

	vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		if (editor && editor.document.fileName.endsWith(".kts")) {
			addDocumentIfNotExists(editor.document);

			const doc = documentData.get(editor.document.uri.toString());
			if (doc) {
				if (semanticTokensProvider) {
					semanticTokensProvider.dispose();
				}

				doc.treeProvider.semanticTokensProvider = new SemanticTokensProvider(doc.treeProvider, highlightQuery);
				semanticTokensProvider = vscode.languages.registerDocumentSemanticTokensProvider(
					selector,
					doc.treeProvider.semanticTokensProvider,
					LEGEND
				);

				context.subscriptions.push(semanticTokensProvider);

			}
		}
	});



	vscode.window.onDidChangeVisibleTextEditors(editors => {
		const openUris = new Set(editors.map(editor => editor.document.uri.toString()));

		for (const editor of editors) {
			if (editor.document.fileName.endsWith(".kts")) {
				addDocumentIfNotExists(editor.document);
			}
		}

		for (const documentUri of documentData.keys()) {
			if (!openUris.has(documentUri)) {
				documentData.delete(documentUri);
			}
		}
	});

	/* context.subscriptions.push(
		vscode.languages.registerOnTypeFormattingEditProvider(selector, new KotlinOnTypeFormattingProvider(), "\n")
	); */
}
export function deactivate() {
	if (util.flushInterval) clearInterval(util.flushInterval);
	if (util.logBuffer.length > 0) {
		fs.appendFileSync(util.logFile, util.logBuffer.join(''));
		util.logBuffer = [];
	}
}
