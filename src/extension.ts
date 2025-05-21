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
import {
	HoverProviderKS
} from "./hoverprovider"
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
	vscode.languages.registerHoverProvider(selector, new HoverProviderKS());
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
	function convertJavaGenericToKotlin(type: string): string {
		if (!type.includes('<')) return type;

		const processSegment = (segment: string): string => {
			segment = segment.trim();

			if (/^\?\s+extends\s+/.test(segment)) {
				return 'out ' + segment.replace(/^\?\s+extends\s+/, '');
			}

			if (/^\?\s+super\s+/.test(segment)) {
				return 'in ' + segment.replace(/^\?\s+super\s+/, '');
			}

			if (segment === '?') {
				return '*';
			}

			if (/^\w+\s+extends\s+/.test(segment)) {
				const [param, base] = segment.split(/\s+extends\s+/);
				return `${param.trim()} : ${base.trim()}`;
			}

			return segment;
		};

		const match = type.match(/^(.+?)<(.+)>$/);
		if (!match) return type;

		const outer = match[1].trim();
		const inner = match[2];
		const args = splitGenerics(inner).map(processSegment).join(', ');

		return `${outer}<${args}>`;
	}

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
	const renderKeyword = (kw: string) => `<span class="kw">${kw}</span>`;
	const renderIdentifier = (name: string) => `<span class="ident">${name}</span>`;
	const renderMethodName = (name: string) => `<span class="method-name">${name}</span>`;
	const renderArgName = (name: string) => `<span class="arg-name">${name}</span>`;
	const renderType = (type: string | null, disableHover = false): string => {
		if (!type) return '';
		type = convertJavaGenericToKotlin(type);
		const classes = ['type-link'];
		if (disableHover) classes.push('no-hover');

		const renderSegment = (segment: string): string => {
			segment = segment.trim();

			const arrayMatch = segment.match(/^(.+?)(\[\])$/);
			if (arrayMatch) {
				const base = arrayMatch[1];
				const suffix = arrayMatch[2];
				return `${renderSegment(base)}${suffix}`;
			}

			const genericMatch = segment.match(/^(.+?)<(.+)>$/);
			if (genericMatch) {
				const outerRaw = genericMatch[1].trim();
				const outerSimple = outerRaw.split('.').pop();
				const inner = genericMatch[2];

				const renderedInner = splitGenerics(inner).map(renderSegment).join(', ');
				return `<span class="${classes.join(' ')}" data-type="${outerRaw}">${outerSimple}</span>&lt;${renderedInner}&gt;`;
			}

			const modifierMatch = segment.match(/^(in|out)\s+(.+)$/);
			if (modifierMatch) {
				const modifier = modifierMatch[1];
				const baseType = modifierMatch[2].trim();
				const baseSimple = baseType.split('.').pop();

				const isGenericLetter = /^[A-Z]$/.test(baseType);
				const isUnqualified = !baseType.includes('.');
				if (isGenericLetter && isUnqualified) {
					return `${renderKeyword(modifier)} ${renderIdentifier(baseSimple ?? "")}`;
				}

				return `${renderKeyword(modifier)} <span class="${classes.join(' ')}" data-type="${baseType}">${baseSimple}</span>`;
			}



			if (segment === '*') {
				return renderKeyword(`*`);
			}

			const raw = segment.split('<')[0];
			const simple = raw.split('.').pop();

			const isGenericLetter = /^[A-Z]$/.test(raw);
			const isUnqualified = !raw.includes('.');

			if (isGenericLetter && isUnqualified) {
				return renderIdentifier(`${simple}`);
			}

			return `<span class="${classes.join(' ')}" data-type="${raw}">${simple}</span>`;
		};



		return renderSegment(type);
	};
	function splitGenerics(input: string): string[] {
		const parts: string[] = [];
		let current = '';
		let depth = 0;
		let insideAngle = false;

		for (let i = 0; i < input.length; i++) {
			const char = input[i];

			if (char === '<') depth++;
			if (char === '>') depth--;
			if (char === ',' && depth === 0) {
				parts.push(current.trim());
				current = '';
				continue;
			}
			current += char;
		}
		if (current) parts.push(current.trim());
		return parts;
	}

	const renderAnnotation = (text: string) => `<span class="annotation">@${text}</span>`;

	const renderAnnotations = (mods: string, indent: number = 2) =>
		extractAnnotations(mods)
			.map(a => `<div style="padding-left: ${indent}em">${renderAnnotation(a.replace('@', ''))}</div>`)
			.join('\n');





	const renderField = (f: Field, indent: number) => {
		const annotations = renderAnnotations(f.modifiers, indent);
		const modStr = renderModifiers(f.modifiers);
		const type = renderType(f.returns);
		return `${annotations}<div style="padding-left: ${indent}em">${modStr}${renderKeyword('val')} ${renderIdentifier(f.name)}: ${type};</div>`;
	};

	const renderMethod = (m: Method, indent: number, isInterface: boolean) => {
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
	function generateClassHtml(member: TypingsMember): string {
		const lines: string[] = [];
		const packagePath = member.classPath.substring(0, member.classPath.lastIndexOf('.'));
		const className = member.classPath.split('.').pop()!;
		const superclass = member.superclass?.trim() || '';
		const interfaces = member.interfaces ?? [];
		const isInterface = member.modifiers.includes('interface');
		const classKeyword = isInterface ? 'interface' : 'class';


		const inheritance = [superclass !== 'java.lang.Object' ? superclass : null, ...interfaces]
			.filter(Boolean)
			.map(i => renderType(i, false))
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
		const typeParams = member.typeParameters?.length
			? `&lt;${member.typeParameters
				.map(p => {
					const normalized = convertJavaGenericToKotlin(p);
					const [left, right] = normalized.split(/\s*:\s*/);
					const leftParts = left.trim().split(/\s+/);

					let renderedLeft = '';
					if (leftParts.length === 2) {
						renderedLeft = `${renderKeyword(leftParts[0])} ${renderIdentifier(leftParts[1])}`;

					} else {
						renderedLeft = renderIdentifier(left.trim());

					}

					if (!right) return renderedLeft;
					return `${renderedLeft} : ${renderType(right.trim())}`;
				})
				.join(', ')}&gt;`
			: '';

		lines.push(`<div id="current-class">${topModifiers} ${renderKeyword(classKeyword)} ${renderIdentifier(classSimpleName)}${typeParams}${inheritance ? ' : ' + inheritance : ''} {</div>`);


		const instanceFields = member.fields.filter(f => !f.modifiers.includes('static'));
		const staticFields = member.fields.filter(f => f.modifiers.includes('static'));
		const instanceMethods = member.methods.filter(m => !m.modifiers.includes('static'));
		const staticMethods = member.methods.filter(m => m.modifiers.includes('static'));

		instanceFields.forEach(f => lines.push(renderField(f, 2)));
		instanceMethods.forEach(m => lines.push(renderMethod(m, 2, isInterface)));

		if (staticFields.length || staticMethods.length) {
			lines.push(`<br><div style="padding-left: 2em">${renderKeyword('companion object')} {</div>`);
			staticFields.forEach(f => lines.push(renderField(f, 4)));
			staticMethods.forEach(m => lines.push(renderMethod(m, 4, isInterface)));
			lines.push(`<div style="padding-left: 2em">}</div>`);
		}

		lines.push(`<div>}</div>`);
		lines.push(`</div>`);

		return lines.map(line => {
			const plain = line.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			return `<div class="line" data-text="${plain}" style="opacity: 0;">${line}</div>`;
		}).join('\n');


	}

	const classPanels = new Map<string, vscode.WebviewPanel>();
	const packagePanels = new Map<string, vscode.WebviewPanel>();

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.gotoTypingDefinition', (args) => {
			handleTypingDefinition(args.type);
		})
	);

	function handleTypingDefinition(typeName: string) {
		const baseType = typeName.split('<')[0];

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

		let panel = packagePanels.get(packageName);



		if (panel) {
			panel.reveal();
			return
		}
		panel = vscode.window.createWebviewPanel(
			'kotlinPackagePreview',
			`Package: ${packageName}`,
			vscode.ViewColumn.Active,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);
		let html = generatePackageHtml(panel.webview, context.extensionUri, listHtml, `Package: ${packageName}`);
		panel.webview.html = html;

		panel.webview.onDidReceiveMessage(msg => {
			if (msg.command === 'openType') {
				vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: msg.type });
			}
			if (msg.command === 'openPackage') {
				vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: msg.package });
			}
			if (msg.command === 'requestPreview') {
				const typeName = msg.type;
				const previewHtml = generateMiniPreview(typeName, utils.getTypingsMember(typeName));
				if (panel)
					panel.webview.postMessage({
						command: 'previewResponse',
						type: typeName,
						html: previewHtml
					});
			}

		});

		panel.onDidDispose(() => {
			packagePanels.delete(packageName);
		});

		packagePanels.set(packageName, panel);

	}
	function generateMiniPreview(typeName: string, member: TypingsMember | undefined): string {
		if (!member) {
			return `<div style="color: #999;">No preview available for <code>${typeName}</code></div>`;
		}

		const rawName = typeName.split('<')[0];
		const simpleName = rawName.split('.').pop() || "";
		const packageName = rawName.split('.').slice(0, -1).join('.');
		const isInterface = member.modifiers?.includes('interface');
		let modifiers = stripAnnotationModifiers(member.modifiers ?? []);

		if (isInterface) {
			modifiers = modifiers.replace(/\binterface\b/g, '').replace(/\babstract\b/g, '');
		}

		const topModifiers = modifiers
			.replace(/\bpublic\b/g, '')
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.map(renderKeyword)
			.join(' ');

		const classKeyword = isInterface ? 'interface' : 'class';
		const firstLine = `<h3>Package: ${renderPackageSegments(packageName)}</h3>`;

		let html = firstLine;
		html += `<div style="margin-bottom:6px">${topModifiers} ${renderKeyword(classKeyword)} ${renderIdentifier(simpleName)}</div>`;

		// Fields
		if (member.fields?.length > 0) {
			html += `<div style="margin-bottom: 6px;"><u style="color:#c586c0">Fields</u><ul style="margin:0;padding-left:14px">`;
			for (const field of member.fields) {
				const type = renderType(field.returns);
				html += `<li><code style="color:#9cdcfe">${field.name}</code>: ${type}</li>`;
			}
			html += `</ul></div>`;
		}

		// Methods
		if (member.methods?.length > 0) {
			html += `<div><u style="color:#c586c0">Methods</u><ul style="margin:0;padding-left:14px">`;
			for (const method of member.methods) {
				const methodName = method.name.split('(')[0];
				const args = method.args.map((arg, i) =>
					`${renderArgName('arg' + i)}: ${renderType(arg, true)}`
				).join(', ');
				const ret = renderType(method.returns, true);
				html += `<li>${renderMethodName(methodName)}(${args}): ${ret}</li>`;
			}
			html += `</ul></div>`;
		}

		html += `<div style="margin-top: 8px; font-size: 11px; color: #666;">Hold <b>Ctrl</b> and click to open</div>`;
		html += `</div>`;

		return html;
	}
	function openClassPanel(baseType: string, className: string, typingsMember: TypingsMember) {
		const existing = classPanels.get(baseType);
		if (existing) {
			existing.reveal();
			return;
		}
		const isInterface = typingsMember.modifiers.includes('interface');
		const panel = vscode.window.createWebviewPanel(
			'kotlinClassPreview',
			`${isInterface ? "Interface" : "Class"}: ${className}`,
			vscode.ViewColumn.Active,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);
		const classHtml = generateClassHtml(typingsMember);
		const htmlContent = generateClassHtmlContent(panel.webview, context.extensionUri, classHtml);
		//console.log(htmlContent)
		panel.webview.html = htmlContent;
		const availableMembersMap: Record<string, TypingsMember> = {};
		panel.webview.onDidReceiveMessage(message => {
			if (message.command === 'getSharedSet') {
				panel.webview.postMessage({
					command: 'sharedSetData',
					entries: Array.from(availableClasses)
				});
			}
		});

		classPanels.set(baseType, panel);
		panel.webview.onDidReceiveMessage(message => {
			if (message.command === 'openType') {
				vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: message.type });
			}
			if (message.command === 'openPackage') {
				vscode.commands.executeCommand('extension.gotoTypingDefinition', { type: message.package });
			}

			if (message.command === 'requestPreview') {
				const typeName = message.type;
				const previewHtml = generateMiniPreview(typeName, utils.getTypingsMember(typeName));
				panel.webview.postMessage({
					command: 'previewResponse',
					type: typeName,
					html: previewHtml
				});
			}
		});
		panel.onDidDispose(() => {
			classPanels.delete(baseType);
		});
	}
	const htmlComment = (arg: string) => {
		return `<!--${arg}-->`
	}
	const hoverPreviewDiv = `
	<div id="hover-preview" style="
	  position: fixed;
	  overflow: auto;
	  background: #2b2b2b;
	  color: #ddd;
	  border: 1px solid #444;
	  border-radius: 6px;
	  font-size: 13px;
	  padding: 8px;
	  display: none;
	  z-index: 50;
	  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
	  pointer-events: auto;
	">
	  <div id="hover-content"></div>
	</div>`;

	const consoleDiv = `
  <div id="console-output" style="
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 160px;
    background: #111;
    color: #ccc;
    font-family: monospace;
    font-size: 12px;
    overflow-y: auto;
    padding: 24px 10px 6px;
    border-top: 1px solid #333;
    z-index: 200;
  ">
    <button id="console-minimize" style="
      position: absolute;
      top: 4px;
      right: 8px;
      background: #333;
      color: #ccc;
      border: 1px solid #555;
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
    ">–</button>
    <div id="console-content"></div>
  </div>

  <div id="console-bar" style="
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 24px;
    background: #222;
    color: #ccc;
    font-family: monospace;
    font-size: 12px;
    border-top: 1px solid #333;
    z-index: 200;
  ">
  	<span>Console</span>
    <button id="console-restore" style="
      position: absolute;
      top: 1px;
      right: 8px;
      background: #333;
      color: #ccc;
      border: 1px solid #555;
      padding: 1px 6px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
    ">+</button>
  </div>`;
	const searchBarContent = `
	<div id="search-bar" style="
	  display: none;
	  position: fixed;
	  top: 8px;
	  right: 8px;
	  z-index: 200;
	  background: #2c2c2c;
	  padding: 4px 8px;
	  border-radius: 4px;
	  display: flex;
	  gap: 4px;
	  align-items: center;
	">
	  <input type="text" id="search-input" placeholder="Search..." style="
		width: 180px;
		background: #1e1e1e;
		color: white;
		border: 1px solid #555;
		padding: 4px;
	  " />
	  <button id="toggle-case" title="Match Case">Aa</button>
	  <button id="toggle-whole" title="Whole Word">⛶</button>
	  <button id="toggle-regex" title="Regex">*</button>
	  <span id="search-count" style="
		color: white;
		min-width: 30px;
		text-align: center;
		font-size: 13px;
		font-family: Arial, sans-serif;
	  ">No Results</span>
	  <button id="search-prev" title="Previous Match">↑</button>
	  <button id="search-next" title="Next Match">↓</button>
	  <button id="search-close" title="Close Search" style="margin-left: auto;">✖</button>
	</div>`;

	const keyframePop = `
	@keyframes pop {
	  0% { transform: scale(1); }
	  50% { transform: scale(1.04); }
	  100% { transform: scale(1.035); }
	}`;

	const bodyDiv = `
	body {
	  margin: 0;
	  font-family: Consolas, monospace;
	  background: #1e1e1e;
	  color: rgb(210, 222, 174);
	  padding: 16px;
	}`;
	const hoverTypeLink = `
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
	}`
	const mainDiv = `
	#main {
	  cursor: text;
	  flex-grow: 1;
	  height: 100vh;
	  overflow: visible;
	  padding: 16px;
	  box-sizing: border-box;
	}
  
	.kw {
	  color: rgba(76, 156, 222, 0.93);
	  font-weight: bold;
	}
  
	.annotation {
	  color: rgb(238, 223, 154);
	}
  
	.type-link {
	  color: rgba(108, 220, 175, 0.92);
	  cursor: default;
	  text-decoration: none;
	  pointer-events: auto;
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
  
	.ident {
	  color: #9cdcfe;
	}
  
	.method-name {
	  color: rgba(231, 229, 151, 0.92);
	}
  
	.arg-name {
	  color: rgba(104, 208, 237, 0.97);
	}
  
	.line {
	  opacity: 0;
	  transition: opacity 0.05s linear;
	}`;

	const searchBarDiv = `
	.highlight-box {
	  position: absolute;
	  background-color: rgba(255, 160, 80, 0.35);
	  border-radius: 2px;
	}
  
	.highlight-box.current {
	  outline: 1px solid #3794ff;
	  background-color: rgba(55, 148, 255, 0.3);
	  box-shadow: 0 0 4px #3794ff99;
	  z-index: 60;
	}
  
	.debug-overlay-wrapper {
	  position: fixed;
	  pointer-events: none;
	  z-index: 10000;
	}
  
	.debug-overlay-wrapper > div {
	  position: absolute;
	  pointer-events: auto;
	  background: rgba(255, 0, 0, 0.2);
	}
  
	#search-bar button {
	  background-color: rgba(30, 30, 30, 0.27);
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
	}`;
	const classSearchBarCSS = `
		#class-search-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: #2b2b2b;
		border-bottom: 1px solid #444;
		z-index: 150;
		position: relative;
		}

		#class-search-results {
		position: absolute;
		top: 100%;
		left: 0;
		background: #1e1e1e;
		color: white;
		border: 1px solid #555;
		border-radius: 4px;
		display: none;
		max-height: 200px;
		overflow-y: auto;
		width: 100%;
		z-index: 160;
		font-family: monospace;
		font-size: 13px;
		}
`
	const classSearchBarDiv = `
	<div id="class-search-bar" style="
	  display: flex;
	  align-items: center;
	  gap: 8px;
	  padding: 8px 12px;
	  background: #2b2b2b;
	  border-bottom: 1px solid #444;
	  z-index: 150;
	">
	  <input id="class-search-input" type="text" placeholder="Search classes..." style="
		flex-grow: 1;
		padding: 6px 10px;
		background: #1e1e1e;
		color: white;
		border: 1px solid #555;
		border-radius: 6px;
		font-family: inherit;
	  ">
	  <div id="class-search-results" style="
		position: absolute;
		top: 42px;
		left: 12px;
		background: #1e1e1e;
		color: white;
		border: 1px solid #555;
		border-radius: 4px;
		display: none;
		max-height: 200px;
		overflow-y: auto;
		width: calc(100% - 24px);
		z-index: 160;
		font-family: monospace;
		font-size: 13px;
	  "></div>
	</div>`;

	function generateClassHtmlContent(
		webview: vscode.Webview,
		extensionUri: vscode.Uri,
		classHtml: string
	): string {
		const viewer = (viewerName: string) => {
			return webview.asWebviewUri(
				vscode.Uri.joinPath(extensionUri, 'dist', `${viewerName}.js`)
			);
		};
		return `<!DOCTYPE html>
		  <html lang="en">
		  <head>
			<meta charset="UTF-8">
			<style>
			  ${classSearchBarCSS}
			  ${keyframePop}
			  ${bodyDiv}
			  ${mainDiv}
			  ${searchBarDiv}
			</style>
		  </head>
		  <body>
		    ${classSearchBarDiv}
			${searchBarContent}
			${consoleDiv}
			<div id="main">${classHtml}</div>
			${hoverPreviewDiv}
			<script src="${viewer("constantsPreview")}"></script>
			<script src="${viewer("consoleViewer")}"></script>
			<script src="${viewer("classPreview")}"></script>
			<script src="${viewer("searchBarViewer")}"></script>
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

	function generatePackageHtml(webview: vscode.Webview,
		extensionUri: vscode.Uri, content: string, title: string): string {
		const viewer = (viewerName: string) => {
			return webview.asWebviewUri(
				vscode.Uri.joinPath(extensionUri, 'dist', `${viewerName}.js`)
			);
		}
		return `<!DOCTYPE html>
				<html lang="en">
				<head>
				<meta charset="UTF-8">
				<style>
					${keyframePop}
					${bodyDiv}
					${hoverTypeLink}
					${mainDiv}
					${searchBarDiv}
				</style>
				</head>
				<body>
				${hoverPreviewDiv}
				${searchBarContent}
				${consoleDiv}
				<h3>Package: ${renderPackageSegments(title.replace("Package: ", "").trim())}</h3>
				${content}
				<script src="${viewer("constantsPreview")}"></script>
				<script src="${viewer("consoleViewer")}"></script>
				<script src="${viewer("packagePreview")}"></script>
				<script src="${viewer("searchBarViewer")}"></script>
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