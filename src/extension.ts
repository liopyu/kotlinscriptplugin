import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer';
import KotlinParser from '../generated/KotlinParser';
import * as vscode from 'vscode';
import KotlinParserListenerImpl from './KotlinParserListenerImpl';
import { KotlinScriptErrorStrategy } from './KotlinScriptErrorStrategy';
import { Scope, applyDecorations } from './KotlinParserListenerImpl';
let diagnosticCollection: vscode.DiagnosticCollection;

function processLineContent(content: string, document: vscode.TextDocument, line: number): void {
    try {
        const chars = new CharStream(content);
        const lexer = new KotlinLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new KotlinParser(tokens);
        const errorStrat = new KotlinScriptErrorStrategy();
        parser._errHandler = errorStrat;
        const listener = new KotlinParserListenerImpl(document, errorStrat);

        const tree = parser.kotlinFile();
        ParseTreeWalker.DEFAULT.walk(listener, tree);

        listener.diagnostics.forEach((diag) => errorStrat.getDiagnostics().push(diag));
        diagnosticCollection.set(document.uri, errorStrat.getDiagnostics());
        applyDecorations(listener, document);

    } catch (error) {
        console.error(error);
    }
}

function setupFileChangeListener() {
    let debounceTimer: NodeJS.Timeout | undefined;

    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'kotlinscript' && event.document.uri.fsPath.endsWith('.kts')) {
            try {
                if (debounceTimer) clearTimeout(debounceTimer);

                debounceTimer = setTimeout(() => {
                    const content = event.document.getText();
                    const changedLines = event.contentChanges.map(change => event.document.lineAt(change.range.start.line));
                    changedLines.forEach(line => {
                        processLineContent(line.text, event.document, line.lineNumber);
                    });

                }, 100);
            } catch (error) {
                console.error(error);
            }
        }
    });
}

export function activate(context: vscode.ExtensionContext): void {
    console.log("Booting up extension!");
    diagnosticCollection = vscode.languages.createDiagnosticCollection('kotlinscript');
    context.subscriptions.push(diagnosticCollection);
    setupFileChangeListener();
}

export function deactivate(): void {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
