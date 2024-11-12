import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer';
import KotlinParser from '../generated/KotlinParser';
import * as vscode from 'vscode';
import KotlinParserListenerImpl from './KotlinParserListenerImpl';
import { KotlinScriptErrorStrategy } from './KotlinScriptErrorStrategy';
let diagnosticCollection: vscode.DiagnosticCollection;
let bracketDecorationType = vscode.window.createTextEditorDecorationType({
    color: 'red', // Customize color for unmatched brackets
    fontWeight: 'bold'
});
function checkBracketsAndDecorate(document: vscode.TextDocument) {
    const text = document.getText();
    const stack: { char: string, position: vscode.Position }[] = [];
    const unmatchedBrackets: vscode.Range[] = [];
    const bracketPairs: { [key: string]: string } = { '(': ')', '{': '}', '[': ']' };
    const openingBrackets = new Set(Object.keys(bracketPairs));
    const closingBrackets = new Set(Object.values(bracketPairs));

    for (let line = 0; line < document.lineCount; line++) {
        const lineText = document.lineAt(line).text;
        for (let charIndex = 0; charIndex < lineText.length; charIndex++) {
            const char = lineText[charIndex];
            const position = new vscode.Position(line, charIndex);

            if (openingBrackets.has(char)) {
                stack.push({ char, position });
            } else if (closingBrackets.has(char)) {
                if (stack.length === 0 || bracketPairs[stack[stack.length - 1].char] !== char) {
                    unmatchedBrackets.push(new vscode.Range(position, position.translate(0, 1)));
                } else {
                    stack.pop();
                }
            }
        }
    }

    // Remaining unmatched opening brackets
    for (const unmatched of stack) {
        unmatchedBrackets.push(new vscode.Range(unmatched.position, unmatched.position.translate(0, 1)));
    }

    // Apply decorations to unmatched brackets
    const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
    if (editor) {
        editor.setDecorations(bracketDecorationType, unmatchedBrackets);
    }
}
function processFileContent(content: string, document: vscode.TextDocument): void {
    try {
        const chars = new CharStream(content);
        const lexer = new KotlinLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new KotlinParser(tokens);
        const errorStrat = new KotlinScriptErrorStrategy(document);
        parser._errHandler = errorStrat;
        const listener = new KotlinParserListenerImpl(document, errorStrat);
        const tree = parser.kotlinFile();
        ParseTreeWalker.DEFAULT.walk(listener, tree);
        //errorStrat.getDiagnostics().forEach((diag, i) => console.log("Diag message: " + diag.message + ". Diag index: " + i))
        diagnosticCollection.set(document.uri, errorStrat.getDiagnostics());
    } catch (error) {
        console.error(error)
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
                    processFileContent(content, event.document);
                }, 500);
            } catch (error) {
                console.error(error)
            }

        }
    });
}


export function activate(context: vscode.ExtensionContext): void {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('kotlinscript');
    context.subscriptions.push(diagnosticCollection);
    setupFileChangeListener();
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'kotlin') { // Only apply to Kotlin files, adjust if needed
            checkBracketsAndDecorate(event.document);
        }
    }));

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'kotlin') {
            checkBracketsAndDecorate(editor.document);
        }
    }));

    if (vscode.window.activeTextEditor) {
        checkBracketsAndDecorate(vscode.window.activeTextEditor.document);
    }
}

export function deactivate(): void {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
