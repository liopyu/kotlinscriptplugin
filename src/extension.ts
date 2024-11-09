import { CharStream, CommonTokenStream } from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer';
import KotlinParser from '../generated/KotlinParser';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function processFileContent(content: string): void {
    const chars = new CharStream(content);
    const lexer = new KotlinLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KotlinParser(tokens);
    const tree = parser.kotlinFile();
    console.log("Parsed tree:", tree);
}

function processFilesInInstanceFolder(instancePath: string): void {
    fs.readdirSync(instancePath)
        .filter(file => file.endsWith('.kts'))
        .forEach(file => {
            const filePath = path.join(instancePath, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                console.log(`Processing file: ${filePath}`);
                processFileContent(content);
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
            }
        });
}

export function activate(context: vscode.ExtensionContext): void {
    console.log('Congratulations, your extension "kotlinscript" is now active!');

    const instancePath = path.join(
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
        'config',
        'scripts'
    );

    if (!fs.existsSync(instancePath)) {
        console.log(`Instance path ${instancePath} does not exist.`);
        return;
    }

    processFilesInInstanceFolder(instancePath);
}

export function deactivate(): void {
    console.log('Your extension "kotlinscript" is now deactivated.');
}
