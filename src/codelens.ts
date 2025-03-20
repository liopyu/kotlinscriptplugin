import * as vscode from 'vscode';
import { absoluteKtsDirectory, availableClasses, typingSuggestions } from './extension';
import { documentData } from './constants';
import { ImportSymbol } from './symbols';
import { log, warn, error } from './extension';
import { console } from './extension'
const indexedClassMap: Map<string, Map<string, string[]>> = new Map();

export function buildClassMap(availableClasses: Set<string>): void {
    for (const fullClassPath of availableClasses) {
        const simpleName = fullClassPath.replace(/\$/g, '.').split('.').pop()?.trim();
        if (!simpleName) {
            continue;
        }
        const firstLetter = simpleName.charAt(0).toUpperCase();
        if (!indexedClassMap.has(firstLetter)) {
            indexedClassMap.set(firstLetter, new Map());
        }
        const letterBucket = indexedClassMap.get(firstLetter)!;
        if (!letterBucket.has(simpleName)) {
            letterBucket.set(simpleName, []);
        }
        letterBucket.get(simpleName)?.push(fullClassPath);
    }
}

export class ImportCodeLensProvider implements vscode.CodeLensProvider<vscode.CodeLens> {
    public imports: Map<string, ImportSymbol> = new Map();
    private onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
    readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;
    private decorationType = vscode.window.createTextEditorDecorationType({
        color: 'hsl(0, 62.00%, 64.90%)'
    });

    private cursorDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline solid rgba(242, 243, 210, 0.61)'
    });
    public refresh(): void {
        this.onDidChangeCodeLensesEmitter.fire();
    }
    provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        if (!document.fileName.endsWith('.kts') && !document.uri.fsPath.startsWith(absoluteKtsDirectory)) {
            return [];
        }
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        if (!data) {
            return;
        }
        const treeProvider = data.treeProvider;
        const tree = treeProvider.tree;
        if (!tree) {
            return;
        }

        this.imports = treeProvider.imports;
        this.applyDecorations(document);

        const codeLenses: vscode.CodeLens[] = [];
        const cursorPosition = vscode.window.activeTextEditor?.selection.active;
        if (!cursorPosition) return [];

        const regex = /(?<!\.\s*?)\b\w+\b/g;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = regex.exec(line.text)) !== null) {
                const className = match[0];

                if (!this.findMatchingClasses(className).length) {
                    continue;
                }

                const range = new vscode.Range(i, match.index, i, match.index + className.length);

                if (this.isClassImported(className)) {
                    continue;
                }

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

        const firstLetter = symbol.charAt(0).toUpperCase();
        const letterBucket = indexedClassMap.get(firstLetter);

        if (!letterBucket) {
            return [];
        }

        const matches = Array.from(letterBucket.values())
            .flat()
            .filter(cls => {
                const processedName = cls.replace(/\$/g, '.').split('.').pop()?.trim();
                const isMatch = processedName === symbol.trim();
                return isMatch;
            });

        return matches;
    }

    private isClassImported(className: string): boolean {
        for (const [fullPath, importSymbol] of this.imports.entries()) {
            if (importSymbol.simpleName === className.replace(/\$/g, '.')) {
                return true;
            }
        }

        return typingSuggestions.some(suggestion =>
            suggestion.simpleName === className.replace(/\$/g, '.') &&
            (!suggestion.requiresImport || this.imports.has(suggestion.fullyQualifiedName))
        );
    }



    public clearDecorations(): void {
        vscode.window.activeTextEditor?.setDecorations(this.decorationType, []);
        vscode.window.activeTextEditor?.setDecorations(this.cursorDecorationType, []);
    }
    public applyDecorations(document: vscode.TextDocument): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const cursorPosition = editor.selection.active;
        const regex = /(?<!\.\s*?)\b\w+\b/g;
        const redDecorations: vscode.DecorationOptions[] = [];
        const whiteLineDecorations: vscode.DecorationOptions[] = [];
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;
            while ((match = regex.exec(line.text)) !== null) {
                const className = match[0];
                if (this.isClassImported(className) || !this.findMatchingClasses(className).length) continue;
                const range = new vscode.Range(i, match.index, i, match.index + className.length);
                redDecorations.push({ range });
                if (range.contains(cursorPosition)) {
                    whiteLineDecorations.push({ range });
                }
            }
        }
        editor.setDecorations(this.decorationType, redDecorations);
        editor.setDecorations(this.cursorDecorationType, whiteLineDecorations);
    }


}
