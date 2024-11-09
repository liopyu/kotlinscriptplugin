import { CharStream, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer';
import KotlinParser from '../generated/KotlinParser';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import KotlinParserListenerImpl from './KotlinParserListenerImpl';

// Import parsedFunctions from KotlinParserListenerImpl
import { instantiatedClasses, parsedFunctions, parsedClasses, importedClassesUsage } from './KotlinParserListenerImpl';

// Process file content to build up typings
function processFileContent(content: string): void {
    console.log("Processing file content...");
    const chars = new CharStream(content);
    const lexer = new KotlinLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KotlinParser(tokens);
    const tree = parser.kotlinFile();

    const listener = new KotlinParserListenerImpl();
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    /* listener.enterEveryRule(parser._ctx)
    listener.exitEveryRule(parser._ctx) */
    /* console.log("Parsed functions:", parsedFunctions);
    console.log("Parsed classes:", parsedClasses);
    console.log("Parsed instantiatedClasses:", instantiatedClasses);
console.log("Parsed importedClassesUsage:", importedClassesUsage); */
}

// Setup file change listener to re-parse `.kts` files in real-time
function setupFileChangeListener() {
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'kotlinscript' && event.document.uri.fsPath.endsWith('.kts')) {
            console.log("File content changed, re-parsing...");
            const content = event.document.getText();
            processFileContent(content);
        }
    });
}

// Setup completion provider using parsed function data
function setupCompletionProvider(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerCompletionItemProvider(
        { language: 'kotlinscript', pattern: '**/*.kts', scheme: 'file' },
        {
            provideCompletionItems(document, position) {
                console.log("Providing function completion items...");
                const completionItems: vscode.CompletionItem[] = [];

                // Use parsed functions for completion suggestions
                parsedFunctions.forEach((funcData, funcName) => {
                    const item = new vscode.CompletionItem(
                        funcName,
                        vscode.CompletionItemKind.Function
                    );
                    item.detail = `Function: ${funcName}`;
                    item.documentation = `Parameters: ${JSON.stringify(funcData.parameters)}\nReturn Type: ${funcData.returnType}`;
                    completionItems.push(item);
                });

                return completionItems;
            }
        },
        "."
    );
    context.subscriptions.push(provider);

    console.log("CompletionItemProvider registered for .kts files.");
}

export function activate(context: vscode.ExtensionContext): void {
    console.log('Extension "kotlinscript" is now active.');
    /* 
        // Parse initial files in the instance folder
        const instancePath = path.join(
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
            'config',
            'scripts'
        );
    
        if (fs.existsSync(instancePath)) {
            fs.readdirSync(instancePath)
                .filter(file => file.endsWith('.kts'))
                .forEach(file => {
                    const content = fs.readFileSync(path.join(instancePath, file), 'utf8');
                    processFileContent(content); // Initial parse on activation
                });
        }
     */
    setupFileChangeListener();
    //setupCompletionProvider(context);
}

export function deactivate(): void {
    console.log('Extension "kotlinscript" is now deactivated.');
}
