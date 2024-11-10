import { CharStreams, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer';
import KotlinParser from '../generated/KotlinParser';
import KotlinParserListenerImpl, { syntaxErrors } from './KotlinParserListenerImpl';
import * as vscode from 'vscode';

function processFileContent(content: string): void {
    const chars = CharStreams.fromString(content);
    const lexer = new KotlinLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KotlinParser(tokens);

    syntaxErrors.length = 0; // Clear previous errors
    const tree = parser.kotlinFile();

    const listener = new KotlinParserListenerImpl();
    ParseTreeWalker.DEFAULT.walk(listener, tree);
}

function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
    const diagnostics: vscode.Diagnostic[] = syntaxErrors.map(error => {
        const range = new vscode.Range(
            error.line - 1, // Convert 1-based line number to 0-based
            error.column,
            error.line - 1,
            error.column + 1 // Only underlines the error character
        );
        return new vscode.Diagnostic(range, error.message, vscode.DiagnosticSeverity.Error);
    });

    collection.set(document.uri, diagnostics);
}

function setupFileChangeListener(context: vscode.ExtensionContext, collection: vscode.DiagnosticCollection) {
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'kotlinscript' && event.document.uri.fsPath.endsWith('.kts')) {
            const content = event.document.getText();
            processFileContent(content);
            updateDiagnostics(event.document, collection);
        }
    });
}

export function activate(context: vscode.ExtensionContext): void {
    const collection = vscode.languages.createDiagnosticCollection('kotlinscript');
    context.subscriptions.push(collection);

    vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'kotlinscript' && document.uri.fsPath.endsWith('.kts')) {
            const content = document.getText();
            processFileContent(content);
            updateDiagnostics(document, collection);
        }
    });

    vscode.workspace.onDidCloseTextDocument(document => {
        if (document.languageId === 'kotlinscript') {
            collection.delete(document.uri);
        }
    });

    setupFileChangeListener(context, collection);
}

export function deactivate(): void {
    // Cleanup if necessary
}
