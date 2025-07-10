
import * as vscode from 'vscode';
import { Field, ImportSymbol, Method, Scope, TypingsMember, TypingSuggestion, VariableNode, VariableSymbol } from './symbols';
import { TreeProvider } from './treeprovider';
import { SyntaxNode, Tree } from 'web-tree-sitter';
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
    semanticTokensEnabled,
    kotlinCorePackages
} from './constants'
import { getTypingsMember, isMethodCall, logNode, prepareContext, resolveBaseType, resolveTypingsFromSuffixes } from './utils';
import { syntheticTypingsMembers } from './semantictokensprovider';

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
            .filter(suggestion => ((suggestion.parentType == null || suggestion.parentType == "kotlin.Unit") ||
                (suggestion.parentType != null && ["lambda", "infix_lambda"].includes(suggestion.type ? suggestion.type : "")))
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

export let indexedClassMap: Map<string, Map<string, TypingsMember>> = new Map();
export class PeriodTypingSuggestionProvider implements vscode.CompletionItemProvider {
    public suggestions: TypingSuggestion[];
    public suggestionProviderChange: boolean = false
    constructor(suggestions: TypingSuggestion[]) {
        this.suggestions = suggestions;
        this.buildClassMap(available_members)
    }
    private buildClassMap(availableMembers: TypingsMember[]): void {
        for (const member of availableMembers) {
            const normalizedPath = member.classPath.replace(/\$/g, '.');
            const simpleName = normalizedPath.split('.').pop()?.trim();
            if (!simpleName) continue;

            const firstLetter = simpleName.charAt(0).toUpperCase();
            let letterBucket = indexedClassMap.get(firstLetter);
            if (!letterBucket) {
                letterBucket = new Map<string, TypingsMember>();
                indexedClassMap.set(firstLetter, letterBucket);
            }

            letterBucket.set(normalizedPath, member);
        }
    }

    private getImportFromClassOrPath(classOrPath: string, treeProvider: TreeProvider): string | null {
        for (const [_, importSymbol] of treeProvider.imports.entries()) {
            if (importSymbol.path === classOrPath || importSymbol.simpleName === classOrPath) {
                return importSymbol.path;
            }
        }
        return null;

    }




    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[] | undefined> {
        const setup = prepareContext(document, position);
        if (!setup) {
            return;
        }
        const { treeProvider, range, scope, node } = setup;
        const iNode = treeProvider.findParent(node, "navigation_expression", range);
        if (!iNode) {
            return
        }
        let {
            baseType,
            isStaticClassCall,
            isCallOffClass,
            potentialVariable
        } = resolveBaseType(treeProvider, document, iNode, scope);
        if (!baseType) {
            return;
        }

        const { currentType, foundTypingsMember, currentIsStatic } = resolveTypingsFromSuffixes(
            treeProvider,
            iNode,
            baseType,
            isCallOffClass,
            potentialVariable
        );
        if (!foundTypingsMember) {
            return;
        }
        log("found currentType: " + currentType)
        console.log("potentialvariable: " + potentialVariable?.text + ", calloffclass: " + isCallOffClass)
        if (potentialVariable && !isCallOffClass) {
            isCallOffClass = false;
            isStaticClassCall = false;
        }
        if (
            potentialVariable?.text &&
            !potentialVariable.text.endsWith(".Companion") &&
            (!isStaticClassCall && !isCallOffClass)
        ) {
            isCallOffClass = false;
            isStaticClassCall = false;

            if (foundTypingsMember.hasInvokeOperator && isMethodCall(potentialVariable?.parent)) {
                const invokeMethod = foundTypingsMember.methods.find(m => {
                    //log("Method: " + m.name + ", isStatic: " + m.isStatic)
                    return m.name === "invoke"
                });
                if (invokeMethod) {
                    //log("invoke method: " + invokeMethod.name)
                    //   console.log(`[provideCompletionItems] Found invoke() operator, refining type to: ${invokeMethod.returns}`);
                    const invokedTypingsMember = getTypingsMember(invokeMethod.returns);
                    if (invokedTypingsMember) {
                        console.log(`[provideCompletionItems] Switching context to type: ${invokedTypingsMember.classPath}`);
                        return this.buildCompletionItems(invokedTypingsMember, false, false, treeProvider);
                    }
                }
            }
        }
        console.log(`[provideCompletionItems] Found TypingsMember: ${foundTypingsMember.classPath}, preparing completions.`);
        return this.buildCompletionItems(foundTypingsMember, isCallOffClass, isStaticClassCall, treeProvider);
    }







    private buildCompletionItems(foundTypingsMember: TypingsMember, isCallOffClass: boolean, isStaticClassCall: boolean, treeProvider: TreeProvider): vscode.CompletionItem[] {
        console.log("[buildCompletionItems] Building completions for:", foundTypingsMember.classPath);
        console.log(`[buildCompletionItems] isCallOffClass: ${isCallOffClass}, isStaticClassCall: ${isStaticClassCall}`);
        const snippetCompletions: vscode.CompletionItem[] = [];
        for (const method of foundTypingsMember.methods) {
            if (isCallOffClass) {
                if (isStaticClassCall && !method.isStatic) continue;
                if (!isStaticClassCall && method.isStatic) continue;
            } else {
                if (method.isStatic) continue;
            }
            const cleanName = method.name.replace(/\(.*\)$/, '');
            const label = method.args.length > 0
                ? `${cleanName}(${method.args.map((arg, idx) => `arg${idx}: ${arg}`).join(', ')})`
                : `${cleanName}()`;
            const methodCompletion = new vscode.CompletionItem(
                label,
                vscode.CompletionItemKind.Method
            );
            methodCompletion.insertText = `${cleanName}()`;
            const doc = new vscode.MarkdownString(undefined, true);
            doc.isTrusted = true;

            if (method.args.length > 0) {
                const argsBlock = method.args
                    .map((arg, idx) => `   arg${idx}: ${arg}`)
                    .join(', \n');
                doc.appendCodeblock(``, 'kotlin');
            } else {
                doc.appendCodeblock(`${cleanName}()`, 'kotlin');
            }

            if (method.args.length > 0) {
                doc.appendMarkdown(`\n\n**Args:**\n`);

                method.args.forEach((arg, idx) => {
                    const raw = arg.trim();

                    const match = raw.match(/^([^<]+)(<.*>)?$/);
                    const baseType = match?.[1] || raw;
                    const generics = match?.[2] || '';

                    const typeOnly = baseType.split('.').pop() || baseType;
                    const commandUri = `command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: baseType }))}`;

                    doc.appendMarkdown(`- \`arg${idx}\`: [${typeOnly}](${commandUri})${generics}\n`);
                });

            }

            const rawReturn = method.returns.split('<')[0].trim();

            const returnTypeDisplay = rawReturn.substring(rawReturn.lastIndexOf('.') + 1);

            doc.appendMarkdown(
                `\n\n**Returns:** [${returnTypeDisplay}](command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: rawReturn, typingsMember: getTypingsMember(rawReturn) }))})`
            );


            methodCompletion.documentation = doc;

            snippetCompletions.push(methodCompletion);
        }

        for (const field of foundTypingsMember.fields) {
            if (isCallOffClass) {
                if (isStaticClassCall && !field.isStatic) continue;
                if (!isStaticClassCall && field.isStatic) continue;
            } else {
                if (field.isStatic) continue;
            }

            const fieldCompletion = new vscode.CompletionItem(
                field.name,
                vscode.CompletionItemKind.Field
            );
            fieldCompletion.detail = `Returns: ${field.returns}`;

            const doc = new vscode.MarkdownString(undefined, true);
            doc.isTrusted = true;
            const rawReturn = field.returns.split('<')[0].trim();
            const returnTypeDisplay = rawReturn.substring(rawReturn.lastIndexOf('.') + 1);
            const commandUri = `command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: rawReturn }))}`;

            doc.appendCodeblock(`${field.name}: ${field.returns}`, 'kotlin');
            doc.appendMarkdown(`\n\n**Type:** [${returnTypeDisplay}](${commandUri})`);

            fieldCompletion.documentation = doc;
            snippetCompletions.push(fieldCompletion);
        }


        // console.log(`[buildCompletionItems] Built ${snippetCompletions.length} completion items.`);
        return snippetCompletions;
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
        let isTypeNode = (node.type == "type_identifier")
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


        if (importPrefix.length > 0 && node.parent && !isTypeNode) {
            const prefixParts = importPrefix.split('.');
            const lastPrefixPart = prefixParts.pop() ?? '';
            const basePrefix = prefixParts.join('.') + (prefixParts.length ? '.' : '');
            const baseClasses = Array.from(availableClasses)
                .map(cls => cls.replace(/\$/g, '.'))
                .filter(cls => cls.startsWith(basePrefix));

            const syntheticClasses = Array.from(syntheticTypingsMembers.keys())
                .filter(cls => cls.startsWith(basePrefix) && syntheticTypingsMembers.get(cls)?.syntheticOriginUri !== documentUri)
            const matchingClasses = [...syntheticClasses, ...baseClasses]
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
        return [...snippetCompletions, ...importCompletionItems];
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
/* 
if (!t && iNode) {
    let i = iNode?.parent?.firstChild;
    if (!i) return
    if (!expressionTypes.includes(i.type)) return
    if (i) {
        let iRange = treeProvider.supplyRange(i);
        if (linePrefix.trim().endsWith("t")) {
            const item = new vscode.CompletionItem("try-catch block", vscode.CompletionItemKind.Snippet);
            const lines = i.text.split('\n');
            const baseIndentation = lines[0].match(/^\sinsert"*"here/)?.[0] ?? "";
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
} */