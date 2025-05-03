import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as utils from './utils'
import TSParser, { QueryCapture, SyntaxNode, Tree } from 'web-tree-sitter';
import {
	VariableSymbol,
	ImportSymbol,
	Scope,
	TypingSuggestion,
	TypingsMember,
	Field,
	Method
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
import { ImportDefinitionProvider, indexedClassMap, PeriodTypingSuggestionProvider, TypingSuggestionProvider } from './suggestionprovider';
import { SemanticTokensProvider } from './semantictokensprovider';
import { buildClassMap, ImportCodeLensProvider } from './codelens';


export let availableClasses: Set<string>;
export let typingSuggestions: TypingSuggestion[] = []
export let available_members: TypingsMember[] = []
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
	available_members = await utils.loadTypingMembers(absoluteKtsDirectory);
	utils.writeAlphabeticalTypingsIndex(absoluteKtsDirectory);

	log(`Loaded ${availableClasses.size} classes from JSON file.`);
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
			treeProvider.updateTokens()
			const importCodeLensProvider = new ImportCodeLensProvider(editor.document);
			let newProvider = new SemanticTokensProvider(treeProvider, highlightQuery, importCodeLensProvider)
			treeProvider.semanticTokensProvider = newProvider
			const documentSpecificSelector: vscode.DocumentSelector = [
				{ language: 'kotlin', scheme: 'file', pattern: document.uri.fsPath }
			];
			documentData.set(documentUri, {
				semanticTokensProvider: newProvider
			});
			//console.log("Registering new provider: " + document.uri.toString())
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
		vscode.commands.registerCommand('extension.gotoTypingDefinition', (args) => {
			const typeName = args.type;
			const baseType = typeName.split('<')[0];
			const className = baseType.substring(baseType.lastIndexOf('.') + 1);
			const indexLetter = className[0].toUpperCase();
			const indexFile = path.join(absoluteKtsDirectory, 'typings', 'members', `${indexLetter}-index.json`);

			if (!fs.existsSync(indexFile)) {
				vscode.window.showWarningMessage(`Index file for type "${typeName}" not found.`);
				return;
			}

			let json: Record<string, TypingsMember>;
			try {
				const rawJson = fs.readFileSync(indexFile, 'utf-8');
				json = JSON.parse(rawJson);
			} catch (e) {
				vscode.window.showErrorMessage(`Failed to parse index file: ${e}`);
				return;
			}

			const fqName = Object.keys(json).find(k => k === baseType);
			if (!fqName) {
				vscode.window.showWarningMessage(`Type "${typeName}" not found in index.`);
				return;
			}


			const fqUri = vscode.Uri.parse(`kotlin-preview:/${encodeURIComponent(baseType)}.md`);
			vscode.workspace.openTextDocument(fqUri).then(() => {
				vscode.commands.executeCommand('markdown.showPreview', fqUri);
			});

		})
	);
	function getTypingsMember(classPath: string): TypingsMember | undefined {
		//console.log("ClassPath: " + classPath)
		let className = classPath.includes(".") ? classPath.split(".").pop() ?? "" : classPath
		const matchedTyping: TypingsMember | undefined = indexedClassMap
			.get(className.charAt(0).toUpperCase())
			?.get(classPath);
		return matchedTyping
	}
	let currentType: string | null = null;
	let recentTypeHistory: string[] = [];
	vscode.workspace.registerTextDocumentContentProvider('kotlin-preview', {
		provideTextDocumentContent(uri) {
			const fqName = decodeURIComponent(uri.path.replace(/^\/+/, '').replace(/\.md$/, ''));
			if (fqName !== currentType) {
				const exists = recentTypeHistory.includes(fqName);
				if (!exists) {
					recentTypeHistory.push(fqName);
					if (recentTypeHistory.length > 10) {
						const removed = recentTypeHistory.shift();
					}
				}
			}

			currentType = fqName;
			return generateKotlinDeclarationPreview(fqName, getTypingsMember(fqName));
			//return generateKotlinPreview(fqName, getTypingsMember(fqName));
		}
	});
	function generateKotlinDeclarationPreview(fqName: string, member: TypingsMember | undefined): string {
		const packageName = fqName.substring(0, fqName.lastIndexOf('.'));
		const className = fqName.substring(fqName.lastIndexOf('.') + 1);
		const lines: string[] = [];
		if (!recentTypeHistory.includes(fqName) && member) {
			recentTypeHistory.push(fqName);
			if (recentTypeHistory.length > 10) {
				recentTypeHistory.shift();
			}
		}
		if (recentTypeHistory.length > 1) {
			lines.push(`<details open>`);
			lines.push('<summary><strong>History</strong></summary>');
			lines.push('');
			for (const type of recentTypeHistory) {
				const short = type.split('.').pop();
				lines.push(`- [${short}](./${type}.md)`);
			}
			lines.push('</details>');
			lines.push('');
		}

		if (!member) {
			lines.push(`// No member found for \`${fqName}\``);
			return lines.join('\n');
		}
		const encodeTypeCommand = (type: string): string => {
			const rawType = type.split('<')[0].trim();
			const simple = rawType.substring(rawType.lastIndexOf('.') + 1);
			const generics = type.includes('<') ? type.substring(type.indexOf('<')) : '';
			return `${simple}${generics}`;
		};
		const fields = member.fields;
		const methods = member.methods;
		const superclass = encodeTypeCommand(member.superclass || '');
		const interfaces = member.interfaces || [];
		const implemented = interfaces.map(encodeTypeCommand);

		const inheritanceClause = [
			superclass && superclass !== 'Any' ? superclass : null,
			...implemented
		].filter(Boolean).join(', ');
		lines.push('```kotlin');
		lines.push(`package ${packageName}`);
		lines.push('');
		lines.push(`${member.modifiers}${member.modifiers.includes("interface") ? " " : " class "}${className}${inheritanceClause ? " : " + inheritanceClause : ""} {`);

		if (fields.length) {
			lines.push('');
			for (const f of fields) {
				const modifier = f.modifiers.trim();
				const type = encodeTypeCommand(f.returns);
				lines.push(`    ${modifier} val ${f.name}: ${type}`);
			}
		}

		if (methods.length) {
			lines.push('');
			for (const m of methods) {
				const modifier = m.modifiers.trim();
				const name = m.name.replace(/\(.*$/, '');
				const args = m.args.map((arg, i) => `arg${i}: ${encodeTypeCommand(arg)}`).join(', ');
				const returns = encodeTypeCommand(m.returns);
				lines.push(`    ${modifier} fun ${name}(${args}): ${returns} {}`);
			}
		}

		lines.push('}');
		lines.push('```');

		return lines.join('\n') + "\n" + generateKotlinPreview(fqName, getTypingsMember(fqName));
	}

	function generateKotlinPreview(fqName: string, member: TypingsMember | undefined): string {
		const packageName = fqName.substring(0, fqName.lastIndexOf('.'));
		const className = fqName.substring(fqName.lastIndexOf('.') + 1);
		const lines: string[] = [];

		if (!member) {
			return ""
		}
		const fields: Field[] = member.fields;
		const methods: Method[] = member.methods;
		const interfaces: TypingsMember[] = []
		const leftOverInterfaces: string[] = []
		member.interfaces.forEach(i => {
			let mem = getTypingsMember(i)
			if (mem)
				interfaces.push(mem)
			else leftOverInterfaces.push(i)
		})
		const superclass: String = member.superclass
		const encodeTypeCommand = (type: string): string => {
			const rawType = type.split('<')[0].trim();
			const simple = rawType.substring(rawType.lastIndexOf('.') + 1);
			const generics = type.includes('<') ? type.substring(type.indexOf('<')) : '';
			return `[${simple}](./${rawType}.md)${generics}`;
		};


		lines.push(`# ${fqName}`);
		lines.push('');
		lines.push(`**Package:** \`${packageName}\``);
		if (superclass != "") {
			lines.push('');
			lines.push(`**Extends:** \`${superclass}\``);
		}
		if (member.interfaces.length) {
			lines.push('');
			lines.push(`**Implements:**\n` + [
				...interfaces.map(i => `- ${encodeTypeCommand(i.classPath)}`),
				...leftOverInterfaces.map(i => `- \`${i}\``)
			].join('\n'));
		}
		lines.push('');
		lines.push(`## Fields`);
		lines.push(fields.length ? '' : '_(none)_');
		for (const f of fields) {
			lines.push(`- ${f.name}: ${encodeTypeCommand(f.returns)}`);
		}
		lines.push('');
		lines.push(`## Methods`);
		lines.push(methods.length ? '' : '_(none)_');
		for (const m of methods) {
			const args = m.args.map((arg, idx) => `arg${idx}: ${encodeTypeCommand(arg)}`).join(', ');
			lines.push(`- ${m.name.replace(/\(.*$/, '')}(${args}): ${encodeTypeCommand(m.returns)}`);
		}

		return lines.join('\n');
	}


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
		debouncedUpdateTokens(event.textEditor.document);
	});

	//Runs on start
	vscode.window.visibleTextEditors.forEach(editor => {
		addDocumentIfNotExists(editor.document, editor);
	})

	vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		const document = editor?.document;
		const documentUri = document?.uri.toString();
		if (editor) {
			addDocumentIfNotExists(editor.document, editor);
		}
		if (documentUri) {
			let data = documentData.get(documentUri)
			if (data)
				if (document && document.languageId === 'kotlin' && (document.fileName.endsWith('.kts') || document.uri.fsPath.startsWith(absoluteKtsDirectory))) {
					data.semanticTokensProvider?.codeLens?.refresh();
					data.semanticTokensProvider?.codeLens?.applyDecorations(document);
				}
		}
	});



	vscode.window.onDidChangeVisibleTextEditors(editors => {
		const openUris = new Set(editors.map(editor => editor.document.uri.toString()));
		for (const editor of editors) {
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
