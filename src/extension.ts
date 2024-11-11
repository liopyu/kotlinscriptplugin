import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer';
import KotlinParser from '../generated/KotlinParser';
import * as vscode from 'vscode';
import KotlinParserListenerImpl from './KotlinParserListenerImpl';

let diagnosticCollection: vscode.DiagnosticCollection;

function processFileContent(content: string, document: vscode.TextDocument): void {
    const chars = new CharStream(content);
    const lexer = new KotlinLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KotlinParser(tokens);

    const listener = new KotlinParserListenerImpl(document);
    const tree = parser.kotlinFile();
    ParseTreeWalker.DEFAULT.walk(listener, tree);

    // Set diagnostics
    diagnosticCollection.set(document.uri, listener.getDiagnostics());
}

function setupFileChangeListener() {
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'kotlinscript' && event.document.uri.fsPath.endsWith('.kts')) {
            const content = event.document.getText();
            processFileContent(content, event.document);
        }
    });
}

export function activate(context: vscode.ExtensionContext): void {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('kotlinscript');
    context.subscriptions.push(diagnosticCollection);
    setupFileChangeListener();
}

export function deactivate(): void {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
