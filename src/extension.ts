import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as vscode from 'vscode';
import Parser from 'web-tree-sitter';
import {
	VariableSymbol,
	ImportSymbol
} from './symbols';

const TOKEN_TYPES = [
	'keyword', 'type', 'function', 'string', 'variable', 'property', 'parameter', 'comment', 'operator', 'return'
];
const TOKEN_MODIFIERS: string[] = [];
const LEGEND = new vscode.SemanticTokensLegend(TOKEN_TYPES, TOKEN_MODIFIERS);

class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	private readonly parser: Parser;
	private readonly highlightQuery: Parser.Query;
	private declaredVariables: Map<string, VariableSymbol> = new Map();
	private declaredImports: Map<string, ImportSymbol> = new Map();

	constructor(parser: Parser, highlightQuery: Parser.Query) {
		this.parser = parser;
		this.highlightQuery = highlightQuery;
	}

	provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
		const tree = this.parser.parse(document.getText());
		const builder = new vscode.SemanticTokensBuilder(LEGEND);
		const matches = this.highlightQuery.matches(tree.rootNode);

		const currentVariables = new Set<string>();
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

		this.cleanupStaleEntries(this.declaredVariables, currentVariables);
		this.cleanupStaleEntries(this.declaredImports, currentImports);

		return builder.build();
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
			case 'variable':
				tokenType = 'variable';
				break;
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

	private processVariableDeclaration(node: Parser.SyntaxNode, range: vscode.Range, currentVariables: Set<string>, document: vscode.TextDocument) {
		const variableName = node.text;
		currentVariables.add(variableName);

		// Check for duplicate declarations
		if (this.declaredVariables.has(variableName)) {
			this.logDuplicateError(variableName, range, document);
			this.declaredVariables.delete(variableName); // Clear the duplicate from map
		} else {
			this.declaredVariables.set(variableName, new VariableSymbol(variableName, range, node));
		}
	}

	private processImportDeclaration(node: Parser.SyntaxNode, range: vscode.Range, currentImports: Set<string>, document: vscode.TextDocument) {
		const importName = node.text;
		currentImports.add(importName);

		// Check for duplicate import declarations
		if (this.declaredImports.has(importName)) {
			this.logDuplicateError(importName, range, document);
			this.declaredImports.delete(importName); // Clear the duplicate from map
		} else {
			this.declaredImports.set(importName, new ImportSymbol(importName, range, node));
		}
	}
	private logDuplicateError(name: string, range: vscode.Range, document: vscode.TextDocument) {
		const diagnostic = new vscode.Diagnostic(
			range,
			`Duplicate declaration of '${name}'`,
			vscode.DiagnosticSeverity.Error
		);
		vscode.languages.createDiagnosticCollection('kotlinscript').set(document.uri, [diagnostic]);
	}
	private cleanupStaleEntries(map: Map<string, any>, currentEntries: Set<string>) {
		for (const key of map.keys()) {
			if (!currentEntries.has(key)) {
				map.delete(key);
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

	getDeclaredVariables(): Map<string, VariableSymbol> {
		return this.declaredVariables;
	}

	getDeclaredImports(): Map<string, ImportSymbol> {
		return this.declaredImports;
	}
}


class ImportDefinitionProvider implements vscode.DefinitionProvider {
	private readonly declaredImports: Map<string, ImportSymbol>;

	constructor(declaredImports: Map<string, ImportSymbol>) {
		this.declaredImports = declaredImports;
	}

	provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
		const wordRange = document.getWordRangeAtPosition(position);
		const word = document.getText(wordRange);

		const importSymbol = this.declaredImports.get(word);
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
	private readonly declaredVariables: Map<string, VariableSymbol>;

	constructor(declaredVariables: Map<string, VariableSymbol>) {
		this.declaredVariables = declaredVariables;
	}

	provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
		const wordRange = document.getWordRangeAtPosition(position);
		const word = document.getText(wordRange);

		const variableSymbol = this.declaredVariables.get(word);
		if (!variableSymbol) {
			return null;
		}

		return new vscode.Location(
			document.uri,
			variableSymbol.range
		);
	}
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

	context.subscriptions.push(
		vscode.languages.registerDocumentSemanticTokensProvider(selector, semanticTokensProvider, LEGEND)
	);

	const variableDefinitionProvider = new KotlinScriptDefinitionProvider(semanticTokensProvider.getDeclaredVariables());
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(selector, variableDefinitionProvider)
	);

	const importDefinitionProvider = new ImportDefinitionProvider(semanticTokensProvider.getDeclaredImports());
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(selector, importDefinitionProvider)
	);
}


export function deactivate() {
	console.log(`Deactivating KotlinScript extension...`);
}
