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
export let available_members_index: Record<string, Record<string, Record<string, Record<string, TypingsMember>>>> = {};

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
export const package_index: Record<string, TypingsMember[]> = {};
export const absoluteKtsDirectory = path.isAbsolute(ktsDirectory) ? ktsDirectory : path.join(vscode.workspace.rootPath || '', ktsDirectory);
export async function activate(context: vscode.ExtensionContext) {
	util = utils.Utils.getInstance(context);
	await TSParser.init();
	availableClasses = await utils.loadAvailableClasses(absoluteKtsDirectory);
	typingSuggestions = await utils.loadTypingSuggestions(absoluteKtsDirectory);
	available_members = await utils.loadTypingMembers(absoluteKtsDirectory);
	//utils.writeAlphabeticalTypingsIndex(absoluteKtsDirectory);
	await vscode.window.withProgress({
		location: vscode.ProgressLocation.Window,
		title: "[KotlinScript] Indexing classes",
		cancellable: false
	}, async (progress) => {
		const total = available_members.length;

		for (let i = 0; i < total; i++) {
			const member = available_members[i];
			const className = member.classPath.split('.').pop() || member.classPath;
			const first = className[0]?.toUpperCase() || '_';
			const second = className[1]?.toLowerCase() || '_';
			const third = className[2]?.toLowerCase() || '_';
			const threeKey = `${first}${second}${third}`;

			if (!available_members_index[first]) available_members_index[first] = {};
			if (!available_members_index[first][`${first}${second}`]) available_members_index[first][`${first}${second}`] = {};
			if (!available_members_index[first][`${first}${second}`][threeKey]) {
				available_members_index[first][`${first}${second}`][threeKey] = {};
			}

			available_members_index[first][`${first}${second}`][threeKey][member.classPath] = member;

			if (i % 100 === 0 || i === total - 1) {
				const percent = Math.round((i / total) * 100);
				progress.report({ message: ` ${percent}% - ${member.classPath}` });
				await new Promise(res => setTimeout(res, 0));
			}
		}
	});

	for (const member of available_members) {
		const pathParts = member.classPath.split('.');
		const packagePath = pathParts.slice(0, -1).join('.');
		if (!package_index[packagePath]) package_index[packagePath] = [];
		package_index[packagePath].push(member);
	}
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
	const annotationModifiers: Record<string, string> = {
		"synchronized": "@Synchronized",
		"transient": "@Transient",
		"volatile": "@Volatile",
		"static": "@JvmStatic"
	};

	function extractAnnotations(modStr: string): string[] {
		const mods = modStr.split(/\s+/);
		return mods.map(m => annotationModifiers[m]).filter(Boolean);
	}

	function stripAnnotationModifiers(modStr: string): string {
		const mods = modStr.split(/\s+/).filter(m => !annotationModifiers[m]);
		return mods.join(" ").trim();
	}
	function generateClassHtml(member: TypingsMember): string {
		const lines: string[] = [];
		const packagePath = member.classPath.substring(0, member.classPath.lastIndexOf('.'));
		const className = member.classPath.split('.').pop()!;
		const superclass = member.superclass?.trim() || '';
		const interfaces = member.interfaces ?? [];
		const isInterface = member.modifiers.includes('interface');
		const classKeyword = isInterface ? 'interface' : 'class';
		const renderKeyword = (kw: string) => `<span class="kw">${kw}</span>`;
		const renderIdentifier = (name: string) => `<span class="ident">${name}</span>`;
		const renderMethodName = (name: string) => `<span class="method-name">${name}</span>`;
		const renderArgName = (name: string) => `<span class="arg-name">${name}</span>`;
		const renderType = (type: string | null) => {
			const raw = type?.split('<')[0];
			const simple = raw?.split('.').pop();
			const generics = type?.match(/<(.+)>/)?.[1];
			const renderedGenerics = generics
				?.split(',')
				.map(t => t.trim().split('.').pop())
				.join(', ');
			return `<span class="type-link" data-type="${raw}">${simple}</span>${generics ? `&lt;${renderedGenerics}&gt;` : ''}`;
		};

		const renderAnnotation = (text: string) => `<span class="annotation">@${text}</span>`;

		const renderAnnotations = (mods: string, indent: number = 2) =>
			extractAnnotations(mods)
				.map(a => `<div style="padding-left: ${indent}em">${renderAnnotation(a.replace('@', ''))}</div>`)
				.join('\n');


		const renderModifiers = (mods: string) => {
			const stripped = stripAnnotationModifiers(mods)
				.replace(/\bnative\b/g, 'external')
				.replace(/\bpublic\b/g, '');

			return stripped
				.trim()
				.split(/\s+/)
				.filter(Boolean)
				.map(renderKeyword)
				.join(' ') + (stripped.trim() ? ' ' : '');
		};


		const renderField = (f: Field, indent: number) => {
			const annotations = renderAnnotations(f.modifiers, indent);
			const modStr = renderModifiers(f.modifiers);
			const type = renderType(f.returns);
			return `${annotations}<div style="padding-left: ${indent}em">${modStr}${renderKeyword('val')} ${renderIdentifier(f.name)}: ${type};</div>`;
		};

		const renderMethod = (m: Method, indent: number) => {
			const annotations = renderAnnotations(m.modifiers, indent);
			let methodModifiers = m.modifiers;

			if (isInterface) {
				methodModifiers = methodModifiers.replace(/\babstract\b/g, '');
			}

			const modStr = renderModifiers(methodModifiers);
			const methodName = m.name.replace(/\(.*$/, '');
			const args = m.args.map((a, i) =>
				`${renderArgName('arg' + i)}: ${renderType(a)}`
			).join(', ');
			const ret = renderType(m.returns);

			const isAbstract = /\babstract\b/.test(m.modifiers);
			const isExternal = /\bnative\b/.test(m.modifiers);
			const suffix = (isAbstract || isExternal) ? ';' : ' {};';

			return `${annotations}<div style="padding-left: ${indent}em">${modStr}${renderKeyword('fun')} ${renderMethodName(methodName)}(${args}): ${ret}${suffix}</div>`;
		};

		const inheritance = [superclass !== 'java.lang.Object' ? superclass : null, ...interfaces]
			.filter(Boolean)
			.map(renderType)
			.join(', ');
		let strippedModifiers = stripAnnotationModifiers(member.modifiers);

		if (isInterface) {
			strippedModifiers = strippedModifiers
				.replace(/\binterface\b/g, '')
				.replace(/\babstract\b/g, '');
		}

		const topModifiers = strippedModifiers
			.replace(/\bpublic\b/g, '')
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.map(renderKeyword)
			.join(' ');

		const packageSegments = packagePath.split('.');
		const renderedPackage = packageSegments.map((segment, i) => {
			const fullPath = packageSegments.slice(0, i + 1).join('.');
			return `<span class="type-link" data-package="${fullPath}"><span class="ident">${segment}</span></span>`;
		}).join('<span>.</span>');

		lines.push(`<div>${renderKeyword('package')} ${renderedPackage}</div><br>`);

		const classSimpleName = member.classPath.split('.').pop()!;
		lines.push(`<div id="current-class">${topModifiers} ${renderKeyword(classKeyword)} ${renderIdentifier(classSimpleName)}${inheritance ? ' : ' + inheritance : ''} {</div>`);

		const instanceFields = member.fields.filter(f => !f.modifiers.includes('static'));
		const staticFields = member.fields.filter(f => f.modifiers.includes('static'));
		const instanceMethods = member.methods.filter(m => !m.modifiers.includes('static'));
		const staticMethods = member.methods.filter(m => m.modifiers.includes('static'));

		instanceFields.forEach(f => lines.push(renderField(f, 2)));
		instanceMethods.forEach(m => lines.push(renderMethod(m, 2)));

		if (staticFields.length || staticMethods.length) {
			lines.push(`<br><div style="padding-left: 2em">${renderKeyword('companion object')} {</div>`);
			staticFields.forEach(f => lines.push(renderField(f, 4)));
			staticMethods.forEach(m => lines.push(renderMethod(m, 4)));
			lines.push(`<div style="padding-left: 2em">}</div>`);
		}

		lines.push(`<div>}</div>`);
		lines.push(`</div>`);

		/* return lines.map(line => `<div class="line" style="opacity: 0;">${line}</div>`).join('\n'); */
		return lines.map(line => {
			const plain = line.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			return `<div class="line" data-text="${plain}" style="opacity: 0;">${line}</div>`;
		}).join('\n');


	}

	let currentClassFQName: string | undefined;
	const classPanels = new Map<string, vscode.WebviewPanel>();
	const packagePanels = new Map<string, vscode.WebviewPanel>();

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.gotoTypingDefinition', (args) => {
			handleTypingDefinition(args.type);
		})
	);

	function handleTypingDefinition(typeName: string) {
		const baseType = typeName.split('<')[0];
		if (currentClassFQName === baseType) return;

		const className = baseType.substring(baseType.lastIndexOf('.') + 1);
		const typingsMember = utils.getTypingsMember(typeName);

		if (!typingsMember) {
			const classNames = getClassesInPackage(baseType);
			if (classNames.length > 0) {
				openPackagePanel(baseType);
			} else {
				vscode.window.showWarningMessage(`No class or package found for "${typeName}".`);
			}
			return;
		}


		openClassPanel(baseType, className, typingsMember);
	}


	function openPackagePanel(packageName: string) {
		const classNames = getClassesInPackage(packageName);
		if (classNames.length === 0) return;

		const listHtml = classNames.map(name =>
			`<div class="line" style="padding-left: 1em;">
		<span style="color: rgba(255, 255, 255, 0.5); margin-right: 0.5em;">•</span>
		<span class="type-link" data-type="${name}">${name.split('.').pop()}</span>
	</div>`
		).join('\n');


		const html = generateFullHtml(listHtml, `Package: ${packageName}`);

		let panel = packagePanels.get(packageName);
		if (panel) {
			panel.reveal();
		} else {
			panel = vscode.window.createWebviewPanel(
				'kotlinPackagePreview',
				`Package: ${packageName}`,
				vscode.ViewColumn.Active,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
			panel.webview.html = html;

			panel.webview.onDidReceiveMessage(msg => {
				if (msg.command === 'openType') {
					vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: msg.type });
				}
				if (msg.command === 'openPackage') {
					vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: msg.package });
				}
			});

			panel.onDidDispose(() => {
				packagePanels.delete(packageName);
			});

			packagePanels.set(packageName, panel);
		}
	}

	function openClassPanel(baseType: string, className: string, typingsMember: TypingsMember) {
		const existing = classPanels.get(baseType);
		if (existing) {
			existing.reveal();
			return;
		}

		const classHtml = generateClassHtml(typingsMember);

		const htmlContent = generateClassHtmlContent(classHtml);
		console.log(htmlContent)
		const panel = vscode.window.createWebviewPanel(
			'kotlinClassPreview',
			`Kotlin: ${className}`,
			vscode.ViewColumn.Active,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		panel.webview.html = htmlContent;
		currentClassFQName = baseType;
		classPanels.set(baseType, panel);

		const history: string[] = [];

		panel.webview.onDidReceiveMessage(message => {
			if (message.command === 'openType') {
				history.push(currentClassFQName ?? "");
				vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: message.type });
			}
			if (message.command === 'openPackage') {
				vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: message.package });
			}
		});

		panel.onDidDispose(() => {
			classPanels.delete(baseType);
			currentClassFQName = undefined;
		});
	}



	function generateClassHtmlContent(classHtml: string): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
	body {
		margin: 0;
		display: flex;
		font-family: Consolas, 'Courier New', monospace;
		background: #1e1e1e;
		color: rgb(210, 222, 174);
		font-size: 14px;
		font-weight: 0;
		overflow: hidden;
	}
	@keyframes pop {
		0% { transform: scale(1); }
		50% { transform: scale(1.04); }
		100% { transform: scale(1.035); }
	}
mark {
		background-color: rgba(255, 160, 80, 0.35);
		color: inherit;
		padding: 0;
		border-radius: 2px;
	}
mark.current {
	outline: 1px solid #3794ff;
	background-color: rgba(55, 148, 255, 0.2);
}

	#main {
		flex-grow: 1;
		overflow-y: scroll;
		height: 100vh;
		padding: 16px;
		box-sizing: border-box;
	}
	.kw { color: rgba(76, 156, 222, 0.93); font-weight: bold; }
	.annotation { color: rgb(238, 223, 154); }
.type-link {
	color: rgba(108, 220, 175, 0.92); /* dimmed green */
	cursor: default;
	text-decoration: none;
	pointer-events: none;
}

.ctrl-down .type-link {
	cursor: pointer;
	pointer-events: auto;
}

.ctrl-down .type-link:hover {
	color: rgba(158, 234, 203, 0.92);
	text-decoration: underline;
	display: inline-block;
	animation: pop 0.17s ease-in-out forwards;
}


	.ident { color: #9cdcfe; }
	.method-name { color: rgba(231, 229, 151, 0.92); }
	.arg-name { color: rgba(104, 208, 237, 0.97); }
	.line {
		opacity: 0;
		transition: opacity 0.05s linear;
	}
		.highlight-layer {
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
	z-index: 50;
}
.highlight-box {
	position: absolute;
	background-color: rgba(255, 160, 80, 0.35);
	border-radius: 2px;
}
.highlight-box.current {
	outline: 1px solid #3794ff;
	background-color: rgba(55, 148, 255, 0.3); /* lighter blue */
	box-shadow: 0 0 4px #3794ff99;
	z-index: 60;
}

		
			#search-bar button {
		background-color:rgba(30, 30, 30, 0.27);
		color: white;
		border: 1px solid #555;
		border-radius: 6px;
		padding: 4px 8px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		font-size: 13px;
		font-family: inherit;
		user-select: none;
	}

	#search-bar button.active {
		background-color: #094771;
		border-color: #3794ff;
		color: white;
	}
</style>
</head>
<body>
<div id="search-bar" style="display: none; position: fixed; top: 8px; right: 8px; z-index: 100; background: #2c2c2c; padding: 4px 8px; border-radius: 4px; display: flex; gap: 4px; align-items: center;">
	<input type="text" id="search-input" placeholder="Search..." style="width: 180px; background: #1e1e1e; color: white; border: 1px solid #555; padding: 4px;" />
	<button id="toggle-case" title="Match Case">Aa</button>
	<button id="toggle-whole" title="Whole Word">⛶</button>
	<button id="toggle-regex" title="Regex">*</button>
	<span id="search-count" style="color: white; min-width: 30px; text-align: center; font-size: 13px; font-family: Arial, sans-serif;">No Results</span>
	<button id="search-prev" title="Previous Match">↑</button>
	<button id="search-next" title="Next Match">↓</button>
	<button id="search-close" title="Close Search" style="margin-left: auto;">✖</button>
	<div id="console-output" style="position: fixed; bottom: 0; left: 0; right: 0; height: 160px; background: #111; color: #ccc; font-family: monospace; font-size: 12px; overflow-y: auto; padding: 6px 10px; border-top: 1px solid #333; z-index: 200;"></div>

</div>

<div id="main">${classHtml}</div>
<script>
	const vscode = acquireVsCodeApi?.() || { postMessage: console.log };
	document.getElementById('current-class')?.scrollIntoView({ block: 'start' });

	document.addEventListener('click', e => {
		let target = e.target;
		while (target && !target.classList.contains('type-link')) {
			target = target.parentElement;
		}
		if (!target) return;

		const typeName = target.getAttribute('data-type');
		if (typeName) {
			vscode.postMessage({ command: 'openType', type: typeName });
			return;
		}
		const pkg = target.getAttribute('data-package');
		if (pkg) {
			vscode.postMessage({ command: 'openPackage', package: pkg });
		}
	});

	const lines = Array.from(document.querySelectorAll('.line'));
	const highlightLayer = document.createElement('div');
highlightLayer.className = 'highlight-layer';
document.body.appendChild(highlightLayer);

	let index = 0;
	function revealNextLine() {
		if (index < lines.length) {
			lines[index].style.opacity = '1';
			index++;
			setTimeout(revealNextLine, 10);
		}
	}
	revealNextLine();
	let matchCase = false;
let matchWhole = false;
let useRegex = false;
document.getElementById('search-next').addEventListener('click', () => {
	if (allMatchBoxes.length === 0) return;
	allMatchBoxes[matchIndex]?.classList.remove('current');
	matchIndex = (matchIndex + 1) % allMatchBoxes.length;
	allMatchBoxes[matchIndex].classList.add('current');
	allMatchBoxes[matchIndex].scrollIntoView({ block: "center" });
	updateMatchCount();
});

document.getElementById('search-prev').addEventListener('click', () => {
	if (allMatchBoxes.length === 0) return;
	allMatchBoxes[matchIndex]?.classList.remove('current');
	matchIndex = (matchIndex - 1 + allMatchBoxes.length) % allMatchBoxes.length;
	allMatchBoxes[matchIndex].classList.add('current');
	allMatchBoxes[matchIndex].scrollIntoView({ block: "center" });
	updateMatchCount();
});

document.getElementById('search-close').addEventListener('click', function() {
	searchBar.style.display = 'none';
	clearSearchHighlights();
	updateMatchCount();
});


document.getElementById('toggle-case').addEventListener('click', () => {
	matchCase = !matchCase;
	updateToggleUI();
	performSearch(searchInput.value);
});
document.getElementById('toggle-whole').addEventListener('click', () => {
	matchWhole = !matchWhole;
	updateToggleUI();
	performSearch(searchInput.value);
});
document.getElementById('toggle-regex').addEventListener('click', () => {
	useRegex = !useRegex;
	updateToggleUI();
	performSearch(searchInput.value);
});
function updateMatchCount() {
	const countLabel = document.getElementById('search-count');
	if (allMatchBoxes.length === 0) {
		countLabel.textContent = 'No Results';
		return;
	}
	countLabel.textContent = (matchIndex + 1) + " of " + allMatchBoxes.length;
}
document.addEventListener('mousemove', e => {
	document.body.classList.toggle('ctrl-down', e.ctrlKey);
});
document.addEventListener('keydown', e => {
	if (e.key === 'Control') document.body.classList.add('ctrl-down');
});
document.addEventListener('keyup', e => {
	if (e.key === 'Control') document.body.classList.remove('ctrl-down');
});



function updateToggleUI() {
	document.getElementById('toggle-case').classList.toggle('active', matchCase);
	document.getElementById('toggle-whole').classList.toggle('active', matchWhole);
	document.getElementById('toggle-regex').classList.toggle('active', useRegex);
}

function escapeHTML(str) {
	return str.replace(/&/g, '&amp;')
	          .replace(/</g, '&lt;')
	          .replace(/>/g, '&gt;')
	          .replace(/"/g, '&quot;')
	          .replace(/'/g, '&#39;');
}

function clearSearchHighlights() {
	highlightLayer.innerHTML = '';
	allMatchBoxes = [];
	matchIndex = 0;
}

// Search support
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
let lastMatches = [];
let allMarkElements = [];
let matchIndex = 0;
let allMatchBoxes = [];
function highlightWithOverlay(regex) {
	highlightLayer.innerHTML = '';
	allMatchBoxes = [];

	lines.forEach(line => {
		const text = line.textContent;
		regex.lastIndex = 0;

		let match;
		while ((match = regex.exec(text)) !== null) {
			const fullMatch = match[0];
			const coreMatch = match[1] ? fullMatch.slice(match[1].length) : fullMatch;

			const start = match.index + (match[1]?.length ?? 0);
			const end = start + coreMatch.length;

			const range = getRangeFromTextOffsets(line, start, end);
			if (!range) continue;

			const rects = range.getClientRects(); 
const union = Array.from(rects).reduce((acc, rect) => {
	if (!acc) return {
		top: rect.top,
		left: rect.left,
		right: rect.right,
		bottom: rect.bottom
	};

	return {
		top: Math.min(acc.top, rect.top),
		left: Math.min(acc.left, rect.left),
		right: Math.max(acc.right, rect.right),
		bottom: Math.max(acc.bottom, rect.bottom)
	};
}, null);

if (union) {
	const box = document.createElement('div');
	box.className = 'highlight-box';

	const verticalOffset = 2; 
	const heightReduction = 2;

	box.style.top = union.top + window.scrollY + verticalOffset + 'px';
	box.style.left = union.left + window.scrollX + 'px';
	box.style.width = union.right - union.left + 'px';
	box.style.height = union.bottom - union.top - heightReduction + 'px';

	box.dataset.index = allMatchBoxes.length;
	box.dataset.line = line.textContent.slice(0, 40);
	box.dataset.start = start;
	highlightLayer.appendChild(box);
	allMatchBoxes.push(box);
}


		}
	});

	if (allMatchBoxes.length > 0) {
		matchIndex = 0;
		allMatchBoxes[0].classList.add('current');
		allMatchBoxes[0].scrollIntoView({ block: "center" });
	}
	updateMatchCount();
}


function getRangeFromTextOffsets(container, startOffset, endOffset) {
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
	let currentOffset = 0;

	while (walker.nextNode()) {
		const node = walker.currentNode;
		const nodeText = node.textContent;
		const nodeLength = nodeText.length;

		if (startOffset >= currentOffset && startOffset < currentOffset + nodeLength) {
			const startNode = node;
			const startNodeOffset = startOffset - currentOffset;

			let endNode = startNode;
			let endNodeOffset = Math.min(endOffset - currentOffset, nodeLength);

			let tempOffset = currentOffset + nodeLength;

			while (tempOffset < endOffset && walker.nextNode()) {
				endNode = walker.currentNode;
				const remaining = endOffset - tempOffset;
				endNodeOffset = Math.min(remaining, endNode.textContent.length);
				tempOffset += endNode.textContent.length;
			}

			const range = document.createRange();
			range.setStart(startNode, startNodeOffset);
			range.setEnd(endNode, endNodeOffset);
			return range;
		}

		currentOffset += nodeLength;
	}
	return null;
}
function performSearch(term) {
	clearSearchHighlights();
	updateMatchCount();
	if (!term.trim()) return;

	let pattern = term;

	if (!useRegex) {
		pattern = pattern.replace(/[.*+?^\\\${}()|[\\]\\\\]/g, '\\\\$&');
	}
if (matchWhole && !useRegex) {
	pattern = '(^|[^a-zA-Z0-9_])' + pattern + '(?=[^a-zA-Z0-9_]|$)';
	

}


	console.log("Escaped pattern:", pattern);

	const flags = matchCase ? 'g' : 'gi';
	let regex;
	try {
		regex = new RegExp(pattern, flags);
	} catch (err) {
		console.warn("Invalid regex:", pattern, err);
		return;
	}

	console.log("Final regex pattern:", pattern);
	highlightWithOverlay(regex);
}
searchInput.addEventListener('input', () => {
	performSearch(searchInput.value);
	updateMatchCount()
});

document.addEventListener('keydown', e => {
	if (e.ctrlKey && e.key === 'f') {
		e.preventDefault();
		searchBar.style.display = 'block';
		let selectedText = window.getSelection()?.toString()?.trim();

	if (selectedText) {
		searchInput.value = selectedText;
	} else {
		selectedText = searchInput.value;
	}

	searchInput.focus();
	searchInput.select();
	performSearch(selectedText);
	}
	if (e.key === 'Escape') {
		searchBar.style.display = 'none';
		searchInput.value = '';
		clearSearchHighlights();
	}
	if (e.key === 'Enter' && lastMatches.length > 0) {
		matchIndex = (matchIndex + 1) % lastMatches.length;
		lastMatches[matchIndex].scrollIntoView({ block: 'center' });
	}
});
(function () {
	const consoleDiv = document.getElementById('console-output');
	if (!consoleDiv) return;

	function logToConsole(type, args) {
		const line = document.createElement('div');
		line.style.whiteSpace = 'pre-wrap';
		line.style.marginBottom = '4px';

		const prefix = document.createElement('span');
		prefix.textContent = \`[\${ type.toUpperCase() }]\`;
		prefix.style.color = type === 'error' ? '#f55' :
			type === 'warn' ? '#ffa500' : '#66f';

		line.appendChild(prefix);
		line.appendChild(document.createTextNode(args.map(a => {
			try {
				return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
			} catch {
				return String(a);
			}
		}).join(' ')));

		consoleDiv.appendChild(line);
		consoleDiv.scrollTop = consoleDiv.scrollHeight;
	}

	const originalLog = console.log;
	const originalWarn = console.warn;
	const originalError = console.error;

	console.log = function (...args) {
		originalLog.apply(console, args);
		logToConsole('log', args);
	};

	console.warn = function (...args) {
		originalWarn.apply(console, args);
		logToConsole('warn', args);
	};

	console.error = function (...args) {
		originalError.apply(console, args);
		logToConsole('error', args);
	};
})();

</script>
</body>
</html>`;
	}
	function getClassesInPackage(pkg: string): string[] {
		const members = package_index[pkg];
		if (!members || members.length === 0) {
			return [];
		}
		return members.map(m => m.classPath);
	}



	function generateFullHtml(content: string, title: string): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
@keyframes pop {
		0% { transform: scale(1); }
		50% { transform: scale(1.04); }
		100% { transform: scale(1.035); }
	}
	body {
		margin: 0;
		font-family: Consolas, monospace;
		background: #1e1e1e;
		color: rgb(210, 222, 174);
		padding: 16px;
	}
	.type-link {
		color: rgba(108, 220, 175, 0.92);
		cursor: pointer;
		text-decoration: none;
	}
	.type-link:hover {
		color: rgb(227, 240, 184);
		text-decoration: underline;
		display: inline-block;
		animation: pop 0.17s ease-in-out forwards;
	}
	.line {
		margin-bottom: 4px;
		opacity: 0;
		transition: opacity 0.05s linear;
	}
</style>
</head>
<body>
	<h3>Package: ${renderPackageSegments(title.replace("Package: ", "").trim())}</h3>

	${content}
<script>
	const vscode = acquireVsCodeApi?.() || { postMessage: console.log };
document.addEventListener('click', e => {
if (!e.ctrlKey) return; 
	let target = e.target;
	while (target && !target.classList.contains('type-link')) {
		target = target.parentElement;
	}
	if (!target) return;

	const pkg = target.getAttribute('data-package');
	if (pkg) {
		console.log("[WebView] Sending openPackage for:", pkg);
		vscode.postMessage({ command: 'openPackage', package: pkg });
		return; 
	}

	const typeName = target.getAttribute('data-type');
	if (typeName) {
		console.log("[WebView] Sending openType for:", typeName);
		vscode.postMessage({ command: 'openType', type: typeName });
	}
});
const lines = Array.from(document.querySelectorAll('.line'));
	let index = 0;
	function revealNextLine() {
		if (index < lines.length) {
			lines[index].style.opacity = '1';
			index++;
			setTimeout(revealNextLine, 10);
		}
	}
	revealNextLine();

</script>
</body>
</html>`;
	}

	function renderPackageSegments(packagePath: string): string {
		const segments = packagePath.split('.');
		return segments.map((segment, i) => {
			const fullPath = segments.slice(0, i + 1).join('.');
			return `<span class="type-link" data-package="${fullPath}"><span class="ident">${segment}</span></span>`;
		}).join('<span>.</span>');
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
