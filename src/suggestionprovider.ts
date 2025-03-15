
import * as vscode from 'vscode';
import { ImportSymbol, TypingSuggestion } from './symbols';
import { TreeProvider } from './treeprovider';
import { SyntaxNode } from 'web-tree-sitter';
import { log, error, warn } from './extension';
import { console } from './extension'
import {
    t,
    TOKEN_TYPES,
    TOKEN_MODIFIERS,
    LEGEND,
    expressionTypes,
    variableDeclarationTypes,
    blockParents,
    blocks,
    standinReserved,
    reservedCharacters,
    documentData,
    semanticTokensEnabled
} from './constants'
export class TypingSuggestionProvider implements vscode.CompletionItemProvider {
    public suggestions: TypingSuggestion[];

    constructor(suggestions: TypingSuggestion[]) {
        this.suggestions = suggestions;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[] | undefined> {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        //if (t) return

        if (!data) {
            console.log("No tree provider data found for this document.");
            return;
        }

        const treeProvider = data.treeProvider;
        const tree = treeProvider.tree
        if (!tree) {
            console.log("No syntax tree available for this document.");
            return;
        }
        const line = position.line;
        const character = position.character - 1;
        const startPosition = new vscode.Position(line, character);
        const endPosition = new vscode.Position(line, character + 1);
        const node = tree.rootNode.descendantForPosition({
            row: line,
            column: character,
        });
        const range = new vscode.Range(startPosition, endPosition);
        let completionItems: vscode.CompletionItem[] = []
        const kotlinKeywords = [
            "val", "var", "fun", "class", "object", "interface", "return",
            "if", "else", "when", "for", "while", "do", "try", "catch", "finally", "import", "package"
        ];

        const imports = treeProvider.imports
        const variables: string[] = treeProvider.semanticTokensProvider
            ?.currentScopeFromRange(range)
            ?.getAllVariablesFromCurrentScope() || [];

        const variableCompletionItems = variables.map(variableName => {
            const item = new vscode.CompletionItem(
                variableName,
                vscode.CompletionItemKind.Variable
            );
            item.detail = `Variable: ${variableName}`;
            item.sortText = "1";
            return item;
        });

        const importCompletionItems = Array.from(imports).map(([key, symbol]) => {
            let keyword = symbol.getClassName()
            const item = new vscode.CompletionItem(
                keyword,
                vscode.CompletionItemKind.Class
            );
            item.detail = keyword;
            item.sortText = "0";
            return item;
        });

        const keywordCompletionItems = kotlinKeywords.map(keyword => {
            const item = new vscode.CompletionItem(
                keyword,
                vscode.CompletionItemKind.Keyword
            );
            item.detail = keyword;
            item.sortText = "0";
            return item;
        });
        // log("Type: " + node.type + ", ParentType: " + node.parent?.type, ", Text: " + node.text)
        if (node.parent?.type == "infix_expression") {
            completionItems = this.suggestions
                .filter(suggestion => (suggestion.type == "infix_lambda" || suggestion.type == "infix") && !suggestion.simpleName.includes("."))
                .map(suggestion => {
                    const item = new vscode.CompletionItem(
                        suggestion.simpleName,
                        vscode.CompletionItemKind.Function
                    );
                    item.detail = suggestion.simpleName;
                    item.documentation = suggestion.source
                        ? `Source: ${suggestion.source}\nType: ${suggestion.type}`
                        : `Type: ${suggestion.type}`;
                    item.insertText = suggestion.simpleName
                    return item;
                });
            return completionItems;
        }
        if (
            (node.type !== "simple_identifier" ||
                (!expressionTypes.includes(node.parent?.type ?? "")
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
                    ].includes(node.parent?.type ?? "")))
        ) {
            //log("Skipping suggestions: Invalid context.");
            return undefined;
        }


        completionItems = this.suggestions
            .filter(suggestion => suggestion.parentType == null ||
                (suggestion.parentType != null && ["lambda", "infix_lambda"].includes(suggestion.type ? suggestion.type : ""))
            )
            .map(suggestion => {
                const item = new vscode.CompletionItem(
                    suggestion.simpleName,
                    vscode.CompletionItemKind.Function
                );
                item.detail = suggestion.fullyQualifiedName;
                item.documentation = suggestion.source
                    ? `Source: ${suggestion.source}\nType: ${suggestion.type}`
                    : `Type: ${suggestion.type}`;
                item.insertText = completeSuggestion(suggestion, treeProvider, node);
                return item;
            });

        return [...keywordCompletionItems, ...completionItems, ...importCompletionItems, ...variableCompletionItems];
    }
}
function getStr(params: string, provider: PeriodTypingSuggestionProvider): string {
    provider.suggestionProviderChange = true
    return params
}
export class PeriodTypingSuggestionProvider implements vscode.CompletionItemProvider {
    public suggestions: TypingSuggestion[];
    public suggestionProviderChange: boolean = false
    constructor(suggestions: TypingSuggestion[]) {
        this.suggestions = suggestions;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[] | undefined> {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        //if (t) return

        if (!data) {
            console.log("No tree provider data found for this document.");
            return;
        }

        const treeProvider = data.treeProvider;
        const tree = treeProvider.tree
        if (!tree) {
            console.log("No syntax tree available for this document.");
            return;
        }
        const line = position.line;
        const character = position.character - 1;
        const startPosition = new vscode.Position(line, character);
        const endPosition = new vscode.Position(line, character + 1);
        const node = tree.rootNode.descendantForPosition({
            row: line,
            column: character,
        });

        const range = new vscode.Range(startPosition, endPosition);

        let snippetCompletions: vscode.CompletionItem[] = []
        let iNode = node.parent
        /* log('Node text: ' + iNode?.text + ", node type: " + iNode?.type)
        log('Parent Node text: ' + iNode?.parent?.text + ", Parent node type: " + iNode?.parent?.type)
        iNode?.parent?.children.forEach(child => {
            log('Child text: ' + child?.text + ", Child type: " + child?.type) // We finally find the "if_expression"
        }) */
        const kotlinKeywords = [
            "val", "var", "fun", "class", "object", "interface", "return",
            "if", "else", "when", "for", "while", "do", "try", "catch", "finally", "import", "package"
        ];
        if (iNode) {
            let i = iNode?.parent?.firstChild;
            /* log('iNode text: ' + iNode?.text + ", inode type: " + iNode?.type);
            if (!expressionTypes.includes(iNode.type)) return
            log("Providing suggestion for expression: " + iNode.type) */
            // log('iNode text: ' + i?.text + ", inode type: " + i?.type);
            if (!i) return
            if (!expressionTypes.includes(i.type)) return
            //log("Providing suggestion for expression: " + i.type)
            if (i) {
                let iRange = treeProvider.supplyRange(i);

                if (linePrefix.trim().endsWith("t")) {
                    const item = new vscode.CompletionItem("try-catch block", vscode.CompletionItemKind.Snippet);

                    const lines = i.text.split('\n');
                    const baseIndentation = lines[0].match(/^\s*/)?.[0] ?? "";
                    const indentedBlock = lines.map(line => baseIndentation + '\t' + line).join('\n');

                    item.insertText = new vscode.SnippetString(
                        `${baseIndentation}try {\n${indentedBlock}\n${baseIndentation}} catch (e: Exception) {\n${baseIndentation}\tTODO("Not yet implemented")$0\n${baseIndentation}}`
                    );
                    const mergedRange = new vscode.Range(
                        iRange.start,
                        range.end
                    );

                    item.additionalTextEdits = [
                        vscode.TextEdit.replace(mergedRange, "")
                    ];
                    item.additionalTextEdits = [
                        vscode.TextEdit.replace(iRange, ""),

                        vscode.TextEdit.replace(range, "")
                    ];

                    item.detail = "Wraps the current block in a try-catch";
                    item.sortText = "0";
                    snippetCompletions.push(item);
                }
            }
        }




        /* 
        
        
                
        
                const imports = treeProvider.imports
                const variables: string[] = treeProvider.semanticTokensProvider
                    ?.currentScopeFromRange(range)
                    ?.getAllVariablesFromCurrentScope() || [];
        
                const variableCompletionItems = variables.map(variableName => {
                    const item = new vscode.CompletionItem(
                        variableName,
                        vscode.CompletionItemKind.Variable
                    );
                    item.detail = `Variable: ${variableName}`;
                    item.sortText = "1";
                    return item;
                });
        
                const importCompletionItems = Array.from(imports).map(([key, symbol]) => {
                    let keyword = symbol.getClassName()
                    const item = new vscode.CompletionItem(
                        keyword,
                        vscode.CompletionItemKind.Class
                    );
                    item.detail = keyword;
                    item.sortText = "0";
                    return item;
                });
        
                const keywordCompletionItems = kotlinKeywords.map(keyword => {
                    const item = new vscode.CompletionItem(
                        keyword,
                        vscode.CompletionItemKind.Keyword
                    );
                    if (keyword == "try") {
                        item.insertText = "one"
                    }
                    item.detail = keyword;
                    item.sortText = "0";
                    return item;
                });
                // log("Type: " + node.type + ", ParentType: " + node.parent?.type, ", Text: " + node.text)
                if (node.parent?.type == "infix_expression") {
                    completionItems = this.suggestions
                        .filter(suggestion => (suggestion.type == "infix_lambda" || suggestion.type == "infix") && !suggestion.simpleName.includes("."))
                        .map(suggestion => {
                            const item = new vscode.CompletionItem(
                                suggestion.simpleName,
                                vscode.CompletionItemKind.Function
                            );
                            item.detail = suggestion.simpleName;
                            item.documentation = suggestion.source
                                ? `Source: ${suggestion.source}\nType: ${suggestion.type}`
                                : `Type: ${suggestion.type}`;
                            item.insertText = suggestion.simpleName
                            return item;
                        });
                    return completionItems;
                }
                if (
                    (node.type !== "simple_identifier" ||
                        (!expressionTypes.includes(node.parent?.type ?? "")
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
                            ].includes(node.parent?.type ?? "")))
                ) {
                    //log("Skipping suggestions: Invalid context.");
                    return undefined;
                }
        
        
                completionItems = this.suggestions
                    .filter(suggestion => suggestion.parentType == null ||
                        (suggestion.parentType != null && ["lambda", "infix_lambda"].includes(suggestion.type ? suggestion.type : ""))
                    )
                    .map(suggestion => {
                        const item = new vscode.CompletionItem(
                            suggestion.simpleName,
                            vscode.CompletionItemKind.Function
                        );
                        item.detail = suggestion.fullyQualifiedName;
                        item.documentation = suggestion.source
                            ? `Source: ${suggestion.source}\nType: ${suggestion.type}`
                            : `Type: ${suggestion.type}`;
                        item.insertText = completeSuggestion(suggestion, treeProvider, node);
                        return item;
                    }); */

        return [...snippetCompletions];
    }
}
class ImportDefinitionProvider implements vscode.DefinitionProvider {
    public readonly imports: Map<string, ImportSymbol>;
    constructor(imports: Map<string, ImportSymbol>) {
        this.imports = imports;
    }
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition> {
        const wordRange = document.getWordRangeAtPosition(position);
        const word = document.getText(wordRange);
        const importSymbol = this.imports.get(word);
        if (!importSymbol) {
            return null;
        }
        return new vscode.Location(
            document.uri,
            importSymbol.range
        );
    }
}
export function completeSuggestion(suggestion: TypingSuggestion, treeProvider: TreeProvider, currentNode: SyntaxNode): string {
    if (suggestion.requiresImport && !treeProvider.imports.has(suggestion.path + "." + suggestion.simpleName)) {
        return suggestion.fullyQualifiedName + (suggestion.type == "method" ? "()" : "")
    } else if (suggestion.type == "lambda" || suggestion.type == "infix_lambda") {
        return suggestion.simpleName + " {}"
    }
    return suggestion.simpleName + (suggestion.type == "method" ? "()" : "")
}