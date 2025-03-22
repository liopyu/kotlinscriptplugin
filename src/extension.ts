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
import { ImportDefinitionProvider, PeriodTypingSuggestionProvider, TypingSuggestionProvider } from './suggestionprovider';
import { SemanticTokensProvider } from './semantictokensprovider';
import { buildClassMap, ImportCodeLensProvider } from './codelens';


export let availableClasses: Set<string>;
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
const config = vscode.workspace.getConfiguration('kotlinscript');
const ktsDirectory = config.get<string>('ktsDirectory', 'config/scripts');
export const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
export async function activate(context: vscode.ExtensionContext) {
	util = utils.Utils.getInstance(context);
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

	function addDocumentIfNotExists(document: vscode.TextDocument, editor: vscode.TextEditor) {
		const documentUri = document.uri.toString();
		if (!document.fileName.endsWith(".kts")) return;
		if (!documentData.has(documentUri)) {
			const treeProvider = new TreeProvider(parser, document);
			const importCodeLensProvider = new ImportCodeLensProvider(editor.document);
			let newProvider = new SemanticTokensProvider(treeProvider, highlightQuery, importCodeLensProvider)
			treeProvider.semanticTokensProvider = newProvider
			const documentSpecificSelector: vscode.DocumentSelector = [
				{ language: 'kotlin', scheme: 'file', pattern: document.uri.fsPath }
			];
			documentData.set(documentUri, {
				semanticTokensProvider: newProvider
			});
			console.log("Registering new provider: " + document.uri.toString())
			context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(
				documentSpecificSelector,
				newProvider,
				LEGEND
			));
			context.subscriptions.push(
				vscode.languages.registerCodeLensProvider(
					documentSpecificSelector,
					importCodeLensProvider
				)
			);
		}
	}
	vscode.workspace.onDidCloseTextDocument(document => {
		const documentUri = document.uri.toString();
		console.log("Closed document: " + documentUri);
		if (documentData.has(documentUri)) {
			const data = documentData.get(documentUri);
			console.log("Data found: " + data);
			if (data?.semanticTokensProvider?.treeProvider?.diagnosticCollection) {
				console.log("Clearing diagnostics for closed document: " + documentUri);
				data.semanticTokensProvider?.treeProvider.diagnosticCollection.clear();
			}

			documentData.delete(documentUri);
		}
	});
	vscode.workspace.onDidChangeTextDocument(event => {
		const documentUri = event.document.uri.toString();
		const data = documentData.get(documentUri);
		if (!data) return;
		let treeProvider = data.semanticTokensProvider?.treeProvider
		if (!treeProvider) return
		let lastChangedRange: vscode.Range | null = null;
		event.contentChanges.forEach(change => {
			if (treeProvider.tree) {
				utils.applyTreeEdit(treeProvider, change, event.document);
			}
			const insertedTextLines = change.text.split("\n");
			const startPosition = new vscode.Position(change.range.start.line, change.range.start.character);
			const endPosition = new vscode.Position(
				change.range.start.line + insertedTextLines.length - 1,
				insertedTextLines.length === 1
					? change.range.start.character + insertedTextLines[0].length
					: insertedTextLines[insertedTextLines.length - 1].length
			);
			const range = new vscode.Range(startPosition, endPosition);
			if (!lastChangedRange || range.start.isBefore(lastChangedRange.start)) {
				lastChangedRange = range;
			}
		});
		if (event.contentChanges.length > 0 && treeProvider.tree) {
			treeProvider.tree = treeProvider.parser.parse(event.document.getText(), treeProvider.tree);
		}
		if (lastChangedRange && data.semanticTokensProvider) {
			data.semanticTokensProvider.setLastChangedRange(lastChangedRange);
		}
	});

	buildClassMap(availableClasses);


	vscode.window.onDidChangeTextEditorSelection((event) => {
		const document = event.textEditor.document;
		const documentUri = document?.uri.toString();
		if (documentUri) {
			let data = documentData.get(documentUri)
			if (data)
				if (document && document.languageId === 'kotlin' && (document.fileName.endsWith('.kts') || document.uri.fsPath.startsWith(absoluteKtsDirectory))) {
					data.semanticTokensProvider?.codeLens?.refresh();
					data.semanticTokensProvider?.codeLens?.applyDecorations(document);
				}
		}
	});

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.insertImport', async (document: vscode.TextDocument, className: string) => {
			const matchingClasses = Array.from(availableClasses).filter(cls => {
				const processedName = cls.replace(/\$/g, '.').split('.').pop()?.trim();
				return processedName === className.trim();
			});

			if (matchingClasses.length === 0) {
				vscode.window.showErrorMessage(`No matching classes found for '${className}'.`);
				return;
			}

			const selectedClass = matchingClasses.length === 1
				? matchingClasses[0]
				: await vscode.window.showQuickPick(
					matchingClasses.map(cls => cls.replace(/\$/g, '.')),
					{ placeHolder: `Select the correct import for '${className}'` }
				);

			if (!selectedClass) return;

			const edit = new vscode.WorkspaceEdit();
			const importStatement = `import ${selectedClass.replace(/\$/g, '.')}\n`;

			const lines = document.getText().split('\n');
			let packageLineIndex = -1;
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();
				if (line.startsWith('package ')) {
					packageLineIndex = i;
					for (let j = i + 1; j < lines.length; j++) {
						const nextLine = lines[j].trim();
						if (nextLine.startsWith('.')) {
							packageLineIndex = j;
						} else if (nextLine !== '') {
							break;
						}
					}
					break;
				}
			}

			const insertPosition = packageLineIndex !== -1
				? new vscode.Position(packageLineIndex + 1, 0)
				: new vscode.Position(0, 0);

			if (!new RegExp(`^${importStatement}`, 'gm').test(document.getText())) {
				edit.insert(document.uri, insertPosition, importStatement);
				await vscode.workspace.applyEdit(edit);
				const documentUri = document.uri.toString();
				const data = documentData.get(documentUri);
				if (!data) return;
				let treeProvider = data.semanticTokensProvider?.treeProvider
				if (!treeProvider) return


				let classPath = selectedClass.replace(/\$/g, '.')
				const newP = insertPosition.translate(0, 8)
				const nodeAtPosition = treeProvider.tree?.rootNode.descendantForPosition({
					row: newP.line,
					column: newP.character,
				});
				if (nodeAtPosition/*  && !t */) {
					let importList = treeProvider.tree?.rootNode.descendantsOfType("import_list");
					let importRange = treeProvider.supplyRange(nodeAtPosition);
					let packageHeader = treeProvider.tree?.rootNode.descendantsOfType("package_header")[0];
					if (importList && importList.length !== 0) {
						let importListFirst = importList[0];
						let importListLast = importList[importList.length - 1];
						const safeStart = packageHeader
							? treeProvider.supplyRange(packageHeader).start
							: treeProvider.supplyRange(importListFirst).start;
						const safeEnd = treeProvider.supplyRange(importListLast).end;
						importRange = new vscode.Range(
							new vscode.Position(Math.max(0, safeStart.line), Math.max(0, safeStart.character)),
							new vscode.Position(
								Math.min(document.lineCount - 1, safeEnd.line),
								Math.min(document.lineAt(safeEnd.line).text.length, safeEnd.character)
							)
						);
					}
					treeProvider.semanticTokensProvider?.setLastChangedRange(importRange);
					treeProvider.semanticTokensProvider?.updateTokens(document)
				}

				data.semanticTokensProvider?.codeLens?.clearDecorations();
			}
		})
	);


	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			new TypingSuggestionProvider(typingSuggestions),
			''
		)
	);
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			new PeriodTypingSuggestionProvider(typingSuggestions),
			'.'
		)
	);
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			new ImportDefinitionProvider(),
			'.'
		)
	);
	function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
		let timeoutId: NodeJS.Timeout;
		return function (...args: Parameters<T>) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(...args), delay);
		} as T;
	}
	const debouncedUpdateTokens = debounce((document: vscode.TextDocument) => {
		const documentUri = document?.uri.toString();
		if (documentUri) {
			let data = documentData.get(documentUri)
			if (data)
				if (document && document.languageId === 'kotlin' && (document.fileName.endsWith('.kts') || document.uri.fsPath.startsWith(absoluteKtsDirectory))) {
					data.semanticTokensProvider?.codeLens?.refresh();
					data.semanticTokensProvider?.codeLens?.applyDecorations(document);
				}
		}
	}, 200);

	vscode.window.onDidChangeTextEditorVisibleRanges(event => {
		//console.log("Visible ranges changed")
		debouncedUpdateTokens(event.textEditor.document);
	});


	// Runs on start
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		addDocumentIfNotExists(editor.document, editor);
	}


	vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		console.log("Changed active text editors")
		const document = editor?.document;
		const documentUri = document?.uri.toString();
		if (editor) {
			addDocumentIfNotExists(editor.document, editor);
		}
		if (documentUri) {
			let data = documentData.get(documentUri)
			if (data)
				if (document && document.languageId === 'kotlin' && (document.fileName.endsWith('.kts') || document.uri.fsPath.startsWith(absoluteKtsDirectory))) {
					console.log("Changed active document: " + documentUri)
					//data.document = document
					//data.semanticTokensProvider?.treeProvider?.document = document
					data.semanticTokensProvider?.codeLens?.refresh();
					data.semanticTokensProvider?.codeLens?.applyDecorations(document);
				}
		}
	});



	vscode.window.onDidChangeVisibleTextEditors(editors => {
		console.log("Changed visible text editors")
		const openUris = new Set(editors.map(editor => editor.document.uri.toString()));
		for (const editor of editors) {
			console.log("Open Document: " + editor.document.uri.toString())
			if (editor) {
				addDocumentIfNotExists(editor.document, editor);
			}
		}
	});
}
export function deactivate() {
	if (util.flushInterval) clearInterval(util.flushInterval);
	if (util.logBuffer.length > 0) {
		fs.appendFileSync(util.logFile, util.logBuffer.join(''));
		util.logBuffer = [];
	}
}
