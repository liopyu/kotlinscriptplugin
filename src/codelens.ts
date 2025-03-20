import * as vscode from 'vscode';
import { availableClasses } from './extension';
import { documentData } from './constants';
import { ImportSymbol } from './symbols';

const classMap: Map<string, string[]> = new Map();

export function buildClassMap(availableClasses: Set<string>): void {
    for (const fullClassPath of availableClasses) {
        const simpleName = fullClassPath.replace(/\$/g, '.').split('.').pop();
        if (!simpleName) continue;

        classMap.set(simpleName, [...(classMap.get(simpleName) || []), fullClassPath]);
    }
}


export class ImportCodeLensProvider implements vscode.CodeLensProvider<vscode.CodeLens> {
    public imports: Map<string, ImportSymbol> = new Map();
    private onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
    readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;
    // ✅ Initialized properly to avoid null errors
    private decorationType = vscode.window.createTextEditorDecorationType({
        color: 'rgb(232, 105, 105)'  // Light red text
    });

    private cursorDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline solid rgba(255, 255, 255, 0.4)'  // Thin white underline
    });
    public refresh(): void {
        this.onDidChangeCodeLensesEmitter.fire();
    }
    provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        if (!data) {
            console.log("No tree provider data found for this document.");
            return;
        }
        const treeProvider = data.treeProvider;
        const tree = treeProvider.tree;
        if (!tree) {
            console.log("No syntax tree available for this document.");
            return;
        }

        this.imports = treeProvider.imports;
        this.applyDecorations(document); // Ensure decorations update on activation

        const codeLenses: vscode.CodeLens[] = [];
        const cursorPosition = vscode.window.activeTextEditor?.selection.active;
        if (!cursorPosition) return [];

        const regex = /\b\w+\b/g; // Match all words

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = regex.exec(line.text)) !== null) {
                const className = match[0];

                // ✅ Skip if no matching class in `classMap`
                if (!this.findMatchingClasses(className).length) continue;

                const range = new vscode.Range(i, match.index, i, match.index + className.length);

                // ✅ Skip if class is already imported
                if (this.isClassImported(className)) continue;

                // ✅ Only apply CodeLens if cursor is inside the word
                if (range.contains(cursorPosition)) {
                    codeLenses.push(new vscode.CodeLens(range));
                }
            }
        }

        return codeLenses;
    }

    async resolveCodeLens(
        codeLens: vscode.CodeLens,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens> {

        const document = vscode.window.activeTextEditor?.document;
        if (!document) return codeLens;

        const wordRange = document.getWordRangeAtPosition(codeLens.range.start);
        const className = document.getText(wordRange);

        codeLens.command = {
            title: `💠 Import Class ↪ ${className}`,
            command: 'extension.insertImport',
            arguments: [document, className]
        };

        return codeLens;
    }

    private findMatchingClasses(symbol: string): string[] {
        return classMap.get(symbol) || [];
    }

    private isClassImported(className: string): boolean {
        for (const [fullPath, importSymbol] of this.imports.entries()) {
            if (importSymbol.simpleName === className.replace(/\$/g, '.')) {
                return true;
            }
        }
        return false;
    }

    public clearDecorations(): void {
        vscode.window.activeTextEditor?.setDecorations(this.decorationType, []);
        vscode.window.activeTextEditor?.setDecorations(this.cursorDecorationType, []);
    }
    public applyDecorations(document: vscode.TextDocument): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const cursorPosition = editor.selection.active;
        const regex = /\b\w+\b/g; // Match all words

        const redDecorations: vscode.DecorationOptions[] = [];
        const whiteLineDecorations: vscode.DecorationOptions[] = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = regex.exec(line.text)) !== null) {
                const className = match[0];

                // ✅ Skip decoration if class is imported or not found in classMap
                if (this.isClassImported(className) || !this.findMatchingClasses(className).length) continue;

                const range = new vscode.Range(i, match.index, i, match.index + className.length);

                // Always apply red text for unresolved imports
                redDecorations.push({ range });

                // ✅ Apply white underline only if cursor is inside AND class is valid
                if (range.contains(cursorPosition)) {
                    whiteLineDecorations.push({ range });
                }
            }
        }

        // editor.setDecorations(this.decorationType, redDecorations);
        editor.setDecorations(this.cursorDecorationType, whiteLineDecorations);
    }


}
