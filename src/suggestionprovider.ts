
import * as vscode from 'vscode';
import { ImportSymbol, TypingsMember, TypingSuggestion } from './symbols';
import { TreeProvider } from './treeprovider';
import { SyntaxNode } from 'web-tree-sitter';
import { log, error, warn, availableClasses, typingSuggestions, available_members } from './extension';
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

        const treeProvider = data.semanticTokensProvider?.treeProvider;
        if (!treeProvider) return
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
            .filter(suggestion => (suggestion.parentType == null ||
                (suggestion.parentType != null && ["lambda", "infix_lambda"].includes(suggestion.type ? suggestion.type : ""))) &&
                !suggestion.isClass || (suggestion.isClass && !imports.has(suggestion.fullyQualifiedName))
            )
            .map(suggestion => {
                const item = new vscode.CompletionItem(
                    suggestion.simpleName,
                    suggestion.isClass ? vscode.CompletionItemKind.Class : vscode.CompletionItemKind.Function
                );
                item.detail = suggestion.fullyQualifiedName;
                item.documentation = suggestion.source
                    ? `Source: ${suggestion.source}\nType: ${suggestion.type}`
                    : `Type: ${suggestion.type}`;
                item.insertText = (suggestion.isClass && !imports.has(suggestion.fullyQualifiedName)) ? (!suggestion.requiresImport ? suggestion.simpleName : suggestion.fullyQualifiedName) : completeSuggestion(suggestion, treeProvider, node);
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
    public indexedClassMap: Map<string, Map<string, TypingsMember>> = new Map();
    constructor(suggestions: TypingSuggestion[]) {
        this.suggestions = suggestions;
        this.buildClassMap(available_members)
    }
    private buildClassMap(availableMembers: TypingsMember[]): void {
        for (const member of availableMembers) {
            const simpleName = member.classPath.replace(/\$/g, '.').split('.').pop()?.trim();
            if (!simpleName) {
                continue;
            }

            const firstLetter = simpleName.charAt(0).toUpperCase();
            if (!this.indexedClassMap.has(firstLetter)) {
                this.indexedClassMap.set(firstLetter, new Map());
            }

            const letterBucket = this.indexedClassMap.get(firstLetter)!;
            letterBucket.set(member.classPath, member);
        }
    }
    private isClassImported(className: string, document: vscode.TextDocument): boolean {
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        //if (t) return

        if (!data) {
            return false;
        }

        const treeProvider = data.semanticTokensProvider?.treeProvider;
        if (!treeProvider) return false
        let foundInImports = false;
        for (const [fullPath, importSymbol] of treeProvider?.imports.entries()) {
            if (importSymbol.simpleName === className.replace(/\$/g, '.')) {
                foundInImports = true;
                break;
            }
        }
        if (foundInImports) {
            return true;
        }
        let foundInTypingSuggestions = false;
        const isInTypingSuggestions = typingSuggestions.some(suggestion => {
            const processedName = className.replace(/\$/g, '.');
            const suggestionMatch = suggestion.simpleName === processedName;
            const requiresImportCondition = !suggestion.requiresImport || treeProvider.imports.has(suggestion.fullyQualifiedName);
            if (suggestionMatch && requiresImportCondition) {
                foundInTypingSuggestions = true;
                return true;
            }
            return false;
        });
        return isInTypingSuggestions;
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
        const treeProvider = data.semanticTokensProvider?.treeProvider;
        if (!treeProvider) return
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
        log("Root node: " + tree.rootNode)
        log('Node text: ' + node?.text + ", node type: " + node?.type)
        log('Child text: ' + node?.firstChild?.text + ", node type: " + node?.firstChild?.type)
        const range = new vscode.Range(startPosition, endPosition);
        let snippetCompletions: vscode.CompletionItem[] = []
        let iNode = node.parent

        log('Parent Node text: ' + iNode?.text + ", parent node type: " + iNode?.type)
        log("grandparent node text: " + iNode?.parent?.text + ", parent node type: " + iNode?.parent?.type)
        /* this.indexedClassMap
            .get("E")
            ?.get(className) */
        let i = iNode?.parent?.firstChild;
        if ((iNode?.type == "navigation_suffix" /* || iNode?.type == "call_expression" */) && i) {
            let identNode = i
            let isStaticCall = true
            console.log("Ident node: " + identNode.type + ", ident node text: " + (identNode.text))

            if (identNode.type == "call_expression" && identNode?.firstChild) {
                identNode = identNode?.firstChild
                isStaticCall = false
            }
            if ((identNode && this.isClassImported(identNode.text, document)) || treeProvider.imports.get(identNode?.text)) {
                let className = identNode.text.split(".")[identNode.text.split(".").length - 1];
                console.log("I node type: " + identNode.type + ", i node text: " + identNode.text)
                let classPath = className
                for (const [k, importSymbol] of treeProvider.imports.entries()) {
                    if (importSymbol.path == identNode?.text || importSymbol.simpleName == identNode?.text) {
                        classPath = importSymbol.path
                    }
                }
                const matchedTyping = this.indexedClassMap
                    .get(className.charAt(0).toUpperCase())
                    ?.get(classPath);
                if (matchedTyping) {
                    for (const method of matchedTyping.methods) {
                        if (isStaticCall && !method.isStatic) continue
                        const methodCompletion = new vscode.CompletionItem(
                            `${method.name.replace("()", "") + (method.args.length ? `(${method.args?.join(', ') || ''})` : "()")}`,
                            vscode.CompletionItemKind.Method
                        );
                        methodCompletion.kind = vscode.CompletionItemKind.Method
                        methodCompletion.detail = `Returns: ${method.returns}`;
                        methodCompletion.insertText = method.name
                        snippetCompletions.push(methodCompletion);
                    }
                    for (const field of matchedTyping.fields) {
                        if (isStaticCall && !field.isStatic) continue
                        const fieldCompletion = new vscode.CompletionItem(
                            field.name,
                            vscode.CompletionItemKind.Field
                        );
                        fieldCompletion.kind = vscode.CompletionItemKind.Field
                        fieldCompletion.detail = `Returns: ${field.returns}`;
                        snippetCompletions.push(fieldCompletion);
                    }
                }
            }
        } else if (iNode) {
            let i = iNode?.parent?.firstChild;
            if (!i) return
            if (!expressionTypes.includes(i.type)) return
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

        return [...snippetCompletions];
    }
}
export class ImportDefinitionProvider implements vscode.CompletionItemProvider {
    constructor() {
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
        if (!data) {
            console.log("No tree provider data found for this document.");
            return;
        }
        const treeProvider = data.semanticTokensProvider?.treeProvider;
        if (!treeProvider) return
        const tree = treeProvider.tree;
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
        let snippetCompletions: vscode.CompletionItem[] = [];
        const importPrefix = linePrefix.trim().split(/\s+/).pop() || "";
        let onlySuggestImmediateNextPackageName = (treeProvider.findParent(node, "import_header", treeProvider.supplyRange(node)) == null)
        let isTypeNode = (node.type == "type_identifier"/*  || treeProvider.findParent(node, "type_identifier", treeProvider.supplyRange(node)) == null */)
        //log("Node type: " + node.type + ", Node Text: " + node.text + ", testNode: " + (isTypeNode))


        const importCompletionItems = !isTypeNode ? [] : Array.from(treeProvider.imports).map(([key, symbol]) => {
            let keyword = symbol.getClassName()
            const item = new vscode.CompletionItem(
                keyword,
                vscode.CompletionItemKind.Class
            );
            item.detail = keyword;
            item.sortText = "0";
            return item;
        });
        /* treeProvider.imports.forEach((k, i) => {
            console.log(i)
        }) */
        const tSuggestions = !isTypeNode ? [] : typingSuggestions
            .filter(suggestion => {
                return !suggestion.requiresImport &&
                    suggestion.isClass &&
                    !treeProvider.imports.has(suggestion.fullyQualifiedName)
            })
            .map(suggestion => {
                const item = new vscode.CompletionItem(
                    suggestion.simpleName,
                    vscode.CompletionItemKind.Class
                );
                item.detail = suggestion.fullyQualifiedName;
                item.documentation = suggestion.source
                    ? `Source: ${suggestion.source}\nType: ${suggestion.type}`
                    : `Type: ${suggestion.type}`;
                item.insertText = suggestion.simpleName
                return item;
            });
        if (importPrefix.length > 0 && node.parent && !isTypeNode) {
            const prefixParts = importPrefix.split('.');
            const lastPrefixPart = prefixParts.pop() ?? '';
            const basePrefix = prefixParts.join('.') + (prefixParts.length ? '.' : '');
            const matchingClasses = Array.from(availableClasses)
                .map(cls => cls.replace(/\$/g, '.'))
                .filter(cls => cls.startsWith(basePrefix));
            if (onlySuggestImmediateNextPackageName) {
                const nextSegments = new Set(
                    matchingClasses
                        .map(cls => cls.slice(basePrefix.length).split('.')[0])
                        .filter(segment => segment && segment !== lastPrefixPart)
                );

                nextSegments.forEach(segment => {
                    const completionItem = new vscode.CompletionItem(segment, vscode.CompletionItemKind.Module);
                    const lineText = document.lineAt(position).text;
                    const textAfterCursor = lineText.substring(position.character).trim();
                    let trimmedSegment = segment;
                    if (textAfterCursor.startsWith(segment)) {
                        trimmedSegment = segment.slice(textAfterCursor.length);
                    }
                    completionItem.insertText = trimmedSegment;
                    completionItem.detail = "Kotlin Class Path Segment";
                    snippetCompletions.push(completionItem);
                });
            } else {
                matchingClasses.forEach(cls => {
                    const completionItem = new vscode.CompletionItem(cls, vscode.CompletionItemKind.Class);
                    completionItem.insertText = cls.slice(basePrefix.length);
                    completionItem.detail = "Kotlin Class";
                    snippetCompletions.push(completionItem);
                });
            }
        }
        return [...snippetCompletions, ...importCompletionItems, ...tSuggestions];
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
