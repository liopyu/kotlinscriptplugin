
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
import { getTypingsMember, logNode } from './utils';
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
            if (className.includes(".")) {
                if (importSymbol.path == className) {
                    foundInImports = true
                    break
                }
            }

            if (importSymbol.simpleName === className) {
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
    private getImportFromClassOrPath(classOrPath: string, treeProvider: TreeProvider): string | null {
        for (const [_, importSymbol] of treeProvider.imports.entries()) {
            if (importSymbol.path === classOrPath || importSymbol.simpleName === classOrPath) {
                return importSymbol.path;
            }
        }
        return null;

    }
    private getTypingsSuggestionFromSimpleName(simpleName: string): TypingSuggestion | undefined {
        const className = simpleName.split(".").pop() ?? "";
        let matchedTyping = typingSuggestions.find(s => s.simpleName === className || s.fullyQualifiedName === simpleName);
        if (matchedTyping) {
            return matchedTyping;
        }
        for (const basePackage of kotlinCorePackages) {
            const potentialFQName = `${basePackage}.${className}`;
            matchedTyping = typingSuggestions.find(s => s.fullyQualifiedName === potentialFQName);
            if (matchedTyping) {
                return matchedTyping;
            }
        }
        return undefined;
    }
    private isMethodCall(node: SyntaxNode | null): boolean {
        if (!node) return false;

        if (node.type === "call_expression") {
            //  console.log(`[isMethodCall] Direct call_expression: ${node.text}`);
            return true;
        }

        if (node.type === "navigation_expression") {
            const callExpr = node.child(0);
            if (callExpr?.type === "call_expression") {
                // console.log(`[isMethodCall] navigation_expression contains call_expression: ${callExpr.text}`);
                return true;
            }
        }

        if (node.type === "navigation_suffix" && node.parent?.type === "navigation_expression") {
            const callExpr = node.parent.parent;
            const hasCallSuffix = callExpr?.type === "call_expression" &&
                callExpr.children.some(c => c.type === "call_suffix");
            if (hasCallSuffix) {
                // console.log(`[isMethodCall] navigation_suffix leads into call_expression: ${node.text}`);
                return true;
            }
        }

        return false;
    }


    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[] | undefined> {
        const setup = this.prepareContext(document, position);
        if (!setup) {
            return;
        }
        const { data, treeProvider, tree, range, iNode, scope, node } = setup;
        let {
            baseType,
            className,
            isStaticClassCall,
            isCallOffClass,
            potentialVariable,
            scopedVariable
        } = this.resolveBaseType(treeProvider, document, iNode, scope);
        if (!baseType) {
            return;
        }

        const { currentType, foundTypingsMember, currentIsStatic } = this.resolveTypingsFromSuffixes(
            treeProvider,
            iNode,
            baseType,
            isCallOffClass,
            potentialVariable
        );
        if (!foundTypingsMember) {
            return;
        }
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

            if (foundTypingsMember.hasInvokeOperator && this.isMethodCall(potentialVariable?.parent)) {
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


    private prepareContext(document: vscode.TextDocument, position: vscode.Position) {

        // console.log("[prepareContext] Preparing editor context...");
        const documentUri = document.uri.toString();
        const data = documentData.get(documentUri);
        if (!data) {
            // console.log("[prepareContext] No semantic token data found for document.");
            return null;
        }

        const treeProvider = data.semanticTokensProvider?.treeProvider;
        if (!treeProvider) {
            // console.log("[prepareContext] No tree provider available.");
            return null;
        }

        const tree = treeProvider.tree;
        if (!tree) {
            //  console.log("[prepareContext] No tree available inside tree provider.");
            return null;
        }

        const line = position.line;
        const character = position.character - 1;
        //console.log(`[prepareContext] Position line=${line}, character=${character}`);

        const startPosition = new vscode.Position(line, character);
        const endPosition = new vscode.Position(line, character + 1);
        const range = new vscode.Range(startPosition, endPosition);

        const scope = data.semanticTokensProvider?.currentScopeFromRange(range);
        const node = tree.rootNode.descendantForPosition({ row: line, column: character });

        const iNode = treeProvider.findParent(node, "navigation_expression", range);
        if (!iNode) {
            //   console.log("[prepareContext] No navigation_expression iNode found.");
            return null;
        }

        // console.log("[prepareContext] Successfully prepared context.");

        return { data, treeProvider, tree, range, iNode, scope, node };

    }
    private resolveBaseType(
        treeProvider: TreeProvider,
        document: vscode.TextDocument,
        iNode: SyntaxNode,
        scope: Scope | undefined
    ) {
        // console.log("[resolveBaseType] Starting base type resolution...");

        let className;
        let isStaticClassCall = false;
        let potentialVariable;
        let baseType: string | null = null;

        let lastChild = treeProvider.findLastChildInRange(iNode, "navigation_expression", null, treeProvider.supplyRange(iNode));
        let firstChild = treeProvider.findChild(iNode, "navigation_expression");

        if (!lastChild) {
            // console.log("[resolveBaseType] No lastChild found, using simple_identifier from current node");
            potentialVariable = treeProvider.findChild(iNode, "simple_identifier", null);
        } else if (firstChild) {
            //  console.log("[resolveBaseType] Found firstChild navigation_expression");
            potentialVariable = treeProvider.findChild(firstChild, "simple_identifier", null);
        }

        const scopedVariable = scope?.resolveVariable(potentialVariable?.text ?? "");
        if (scopedVariable) {
            //console.log("[resolveBaseType] Found scoped variable: " + scopedVariable.name);
            const classPath = this.getImportFromClassOrPath(scopedVariable.type, treeProvider);
            baseType = classPath ?? scopedVariable.type;
        } else {
            //console.log("[resolveBaseType] No scoped variable found, falling back to resolveBaseTypeFromImports");
            ({ baseType, className, isStaticClassCall } = this.resolveBaseTypeFromImports(treeProvider, document, iNode));
        }
        // TODO: fix this
        const isCallOffClass = treeProvider.findChild(iNode, "navigation_expression") == null;
        // logNode(treeProvider.findChild(iNode, "navigation_expression"), "iscalloffclassnode")
        if (isCallOffClass && !this.isMethodCall(iNode)) {
            console.log("[resolveBaseType] Call is directly off class, setting isStaticClassCall = true");
            isStaticClassCall = true;
        }

        // console.log("[resolveBaseType] Final resolved baseType: " + baseType);
        // console.log("[resolveBaseType] isCallOffClass: " + isCallOffClass);
        // console.log("[resolveBaseType] isStaticClassCall: " + isStaticClassCall);

        return {
            baseType,
            className,
            isStaticClassCall,
            isCallOffClass,
            potentialVariable,
            scopedVariable
        };
    }
    private resolveBaseTypeFromImports(treeProvider: TreeProvider, document: vscode.TextDocument, iNode: SyntaxNode) {
        // console.log("[resolveBaseTypeFromImports] Starting import-based resolution...");

        let className: SyntaxNode | null | undefined;
        let isStaticClassCall = true;
        let isCallOffClass = true;
        let baseType: string | null = null;

        const potentialImports = [...treeProvider.findChildren(iNode, ["navigation_expression"], null), iNode];
        //console.log(`[resolveBaseTypeFromImports] Checking ${potentialImports.length} potential imports...`);

        for (const syntaxNode of potentialImports) {
            const rawText = syntaxNode.text;
            const simpleIdentifier = treeProvider.findChild(syntaxNode, "simple_identifier", null);
            const candidates = [rawText, simpleIdentifier?.text].filter(Boolean) as string[];

            for (const name of candidates) {
                if (this.isClassImported(name, document)) {
                    baseType = this.getImportFromClassOrPath(name, treeProvider) ?? name;
                    className = simpleIdentifier;
                    if (this.isMethodCall(syntaxNode)) isStaticClassCall = false;
                    //   console.log(`[resolveBaseTypeFromImports] Resolved from import: ${name}`);
                    return { baseType, className, isStaticClassCall, isCallOffClass };
                }
            }

            if (!baseType) {
                // console.log("[resolveBaseTypeFromImports] No import match, checking TypingSuggestion fallback...");
                // logNode(syntaxNode, "INode");

                let fallbackKey = rawText.includes("(") ? rawText.substring(0, rawText.indexOf("(")) : rawText;
                const fallbackSuggestion = this.getTypingsSuggestionFromSimpleName(fallbackKey);

                if (fallbackSuggestion?.returnType) {
                    baseType = fallbackSuggestion.returnType;
                    className = simpleIdentifier;
                    isStaticClassCall = true;
                    isCallOffClass = false;
                    //  console.log(`[resolveBaseTypeFromImports] Fallback TypingSuggestion used: ${baseType}`);
                    return { baseType, className, isStaticClassCall, isCallOffClass };
                }
            }
        }

        //console.log("[resolveBaseTypeFromImports] Resolution failed, returning null baseType.");
        return { baseType, className, isStaticClassCall, isCallOffClass };
    }

    private resolveTypingsFromSuffixes(
        treeProvider: TreeProvider,
        iNode: SyntaxNode,
        baseType: string,
        isCallOffClass: boolean,
        potentialVariable: SyntaxNode | undefined | null
    ) {
        //  console.log(`[resolveTypingsFromSuffixes] BaseType at start: ${baseType}`);
        // console.log(`[resolveTypingsFromSuffixes] isCallOffClass: ${isCallOffClass}`);

        const suffixes = treeProvider.findChildren(iNode, ["navigation_suffix"], null) ?? [];
        const refinedSuffixes: string[] = [];

        for (const suffix of suffixes) {
            const identifier = treeProvider.findChild(suffix, "simple_identifier", null);
            if (!identifier || identifier.text === potentialVariable?.text) continue;

            const isCall = this.isMethodCall(suffix);
            refinedSuffixes.push(identifier.text + (isCall ? "()" : ""));
            //console.log(`[resolveTypingsFromSuffixes] Found suffix: ${identifier.text}, isMethodCall: ${isCall}`);
        }

        // console.log("[resolveTypingsFromSuffixes] Found refined suffixes:", refinedSuffixes);

        let currentType = baseType;
        let currentIsStatic = false;
        let foundTypingsMember = getTypingsMember(currentType);

        if (!isCallOffClass) {
            //  console.log(`[resolveTypingsFromSuffixes] Resolving instance chain from baseType: ${currentType}`);

            for (const element of refinedSuffixes) {
                if (!foundTypingsMember) {
                    console.log(`[resolveTypingsFromSuffixes] Stopped - no TypingsMember found for: ${currentType}`);
                    break;
                }

                // console.log(`[resolveTypingsFromSuffixes] Processing suffix: ${element}`);
                const isMethod = element.endsWith("()");
                if (isMethod) {
                    const method = foundTypingsMember.methods.find(m => m.name === element);
                    if (!method) {
                        console.log(`[resolveTypingsFromSuffixes] Method not found: ${element} in ${foundTypingsMember.classPath}`);
                        break;
                    }
                    console.log(`[resolveTypingsFromSuffixes] Matched method '${method.name}' -> returns ${method.returns}`);
                    currentType = method.returns;
                    currentIsStatic = method.isStatic;
                } else {
                    const field = foundTypingsMember.fields.find(f => f.name === element);
                    if (!field) {
                        //console.log(`[resolveTypingsFromSuffixes] Field not found: ${element} in ${foundTypingsMember.classPath}`);
                        break;
                    }
                    // console.log(`[resolveTypingsFromSuffixes] Matched field '${field.name}' -> returns ${field.returns}`);
                    currentType = field.returns;
                    currentIsStatic = field.isStatic;
                }

                foundTypingsMember = getTypingsMember(currentType);
            }
        } else {
            //  console.log(`[resolveTypingsFromSuffixes] Static call context, checking baseType: ${baseType}`);
            if (!foundTypingsMember) {
                const fallback = typingSuggestions.find(
                    s => s.simpleName === iNode.text || s.fullyQualifiedName === iNode.text
                );
                if (fallback?.returnType) {
                    //  console.log(`[resolveTypingsFromSuffixes] Fallback TypingSuggestion used: ${fallback.returnType}`);
                    currentType = fallback.returnType;
                    foundTypingsMember = getTypingsMember(currentType);
                }
            } else {
                // console.log(`[resolveTypingsFromSuffixes] Found TypingsMember: ${foundTypingsMember.classPath}`);
            }
        }
        // console.log(`[resolveTypingsFromSuffixes] Final resolved currentType: ${currentType}`);
        return { currentType, foundTypingsMember, currentIsStatic };
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