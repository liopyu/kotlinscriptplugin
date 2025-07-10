import * as vscode from 'vscode';
import { absoluteKtsDirectory, availableClasses, typingSuggestions } from './extension';
import { documentData, expressionTypes } from './constants';
import { ImportSymbol } from './symbols';
import { log, warn, error } from './extension';
import { console } from './extension'
import { currentEditor, syntheticTypingsMembers } from './semantictokensprovider';
import { getCurrentTreeProvider, getImportFromClassOrPath, logNode } from './utils';
const regex = /(?<!\.\s*?)\b\w+\b/g;
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
    public document: vscode.TextDocument;
    constructor(document: vscode.TextDocument) {
        this.document = document;
    }
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
        // Array.from(indexedClassMap.keys()).forEach(k => console.log(`${k}, ${indexedClassMap.get(k)?.size || 0}`));

        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        if (!data) {
            return;
        }
        const treeProvider = data.semanticTokensProvider?.treeProvider;
        if (!treeProvider) return
        const tree = treeProvider.tree;
        if (!tree) {
            return;
        }

        this.imports = treeProvider.imports;
        this.applyDecorations(document);

        const codeLenses: vscode.CodeLens[] = [];
        let editor = currentEditor(treeProvider.document);
        const cursorPosition = editor?.selection.active;
        if (!cursorPosition) return [];
        const visibleRanges = editor?.visibleRanges ?? [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = regex.exec(line.text)) !== null) {
                const className = match[0];
                const range = new vscode.Range(i, match.index, i, match.index + className.length);
                if (!visibleRanges.some(vr => vr.intersection(range))) {
                    continue;
                }
                if (!this.findMatchingClasses(className).length) {
                    continue;
                }
                if (this.isClassImported(className)) {
                    continue;
                }
                if (!this.isInCorrectNode(range)) {
                    continue
                }
                const scope = treeProvider.semanticTokensProvider?.currentScopeFromRange(range);
                if (scope?.resolveVariable(className)) {
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
        let editor = currentEditor(this.document);
        const document = editor?.document;
        if (!document) return codeLens;

        const wordRange = document.getWordRangeAtPosition(codeLens.range.start);
        const className = document.getText(wordRange);

        codeLens.command = {
            title: `💠 Import Class ↪ ${className}`,
            command: 'extension.insertImport',
            arguments: [document, className, codeLens.range]
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
                const processedName = cls.replace(/\$/g, '.').split('.').pop()?.trim()
                const isMatch = processedName === symbol.trim();
                return isMatch;
            })
        const syntheticMatches = Array.from(syntheticTypingsMembers.keys())
            .filter(cls => {
                const processedName = cls.replace(/\$/g, '.').split('.').pop()?.trim()
                const isMatch = processedName === symbol.trim();
                return isMatch;
            })
        /* syntheticMatches.forEach(match => {
            console.log(match)
        }) */
        return [...matches, ...syntheticMatches]
    }
    private isClassImported(className: string): boolean {
        const treeProvider = getCurrentTreeProvider(this.document)
        if (!treeProvider) return false
        if (getImportFromClassOrPath(className, treeProvider) != null) {
            return true;
        }
        let foundInTypingSuggestions = false;
        const isInTypingSuggestions = typingSuggestions.some(suggestion => {
            const processedName = className.replace(/\$/g, '.');
            const suggestionMatch = suggestion.simpleName === processedName;
            const requiresImportCondition = !suggestion.requiresImport || this.imports.has(suggestion.fullyQualifiedName);
            if (suggestionMatch && requiresImportCondition) {
                foundInTypingSuggestions = true;
                return true;
            }
            return false;
        });
        if (foundInTypingSuggestions) {
        }
        return isInTypingSuggestions;
    }



    private isInCorrectNode(range: vscode.Range): boolean {
        let editor = currentEditor(this.document);
        if (!editor) return false;
        const treeProvider = documentData.get(editor.document.uri.toString())?.semanticTokensProvider?.treeProvider
        const rootNode = treeProvider?.tree?.rootNode;
        if (!rootNode) return false;
        const nodeAtPosition = rootNode.descendantForPosition({
            row: range.start.line,
            column: range.start.character - 1,
        });
        const childNode = treeProvider.findChildInRange((nodeAtPosition.type == ":" && nodeAtPosition?.parent) ? nodeAtPosition?.parent : nodeAtPosition, "simple_identifier", null, range) ||
            treeProvider.findChildInRange((nodeAtPosition.type == ":" && nodeAtPosition?.parent) ? nodeAtPosition?.parent : nodeAtPosition, "type_identifier", null, range)
        const delegation_specifiers = treeProvider.findParent(childNode, "delegation_specifier", range)
        const delegation_specifiers2 = treeProvider.findChildInRange(nodeAtPosition, "delegation_specifier", null, range)
        //logNode(nodeAtPosition, "nodeAtPosition")
        //logNode(nodeAtPosition?.parent, "nodeAtPosition parent")
        if (!childNode || ((["class_declaration"].includes(nodeAtPosition.type) && childNode.type == "type_identifier" && !delegation_specifiers)) ||
            (childNode.type != "type_identifier" && !expressionTypes.includes(childNode.parent?.type ?? "")
                && ![
                    "assignment",
                    "jump_expression",
                    "statements",
                    "property_declaration",
                    "for_statement",
                    "if_expression",
                    "value_argument",
                    "source_file",
                    "when_subject",
                    "infix_expression",
                    "indexing_suffix",
                    "control_structure_body",
                    "function_body",
                    "function_value_parameters",
                    "explicit_delegation",
                    "property_delegate"
                ].includes(childNode.parent?.type ?? "")) ||
            [
                "object_declaration"

            ].includes(nodeAtPosition.type)

        ) {
            //log("not in correct node")
            return false;
        }
        return true
    }

    public clearDecorations(): void {
        let editor = currentEditor(this.document);
        editor?.setDecorations(this.decorationType, []);
        editor?.setDecorations(this.cursorDecorationType, []);
    }
    public applyDecorations(document: vscode.TextDocument): void {
        let editor = currentEditor(this.document);
        if (!editor) return;
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        if (!data) {
            return;
        }
        const treeProvider = data.semanticTokensProvider?.treeProvider;
        const cursorPosition = editor.selection.active;
        const redDecorations: vscode.DecorationOptions[] = [];
        const whiteLineDecorations: vscode.DecorationOptions[] = [];

        const visibleRanges = editor.visibleRanges;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = regex.exec(line.text)) !== null) {
                const className = match[0];
                const range = new vscode.Range(i, match.index, i, match.index + className.length);

                if (!visibleRanges.some(vr => vr.intersection(range))) {
                    continue;
                }

                if (!this.isInCorrectNode(range) || this.isClassImported(className) || !this.findMatchingClasses(className).length) {
                    continue;
                }
                const scope = treeProvider?.semanticTokensProvider?.currentScopeFromRange(range);
                if (scope?.resolveVariable(className)) {
                    continue;
                }

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
