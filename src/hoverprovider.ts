
import * as vscode from 'vscode';
import { Field, ImportSymbol, Method, Scope, TypingsMember, TypingSuggestion, VariableNode, VariableSymbol } from './symbols';
import { TreeProvider } from './treeprovider';
import { SyntaxNode, Tree } from 'web-tree-sitter';
import { log, error, warn, availableClasses, typingSuggestions, available_members } from './extension';
import { console } from './extension'
import {
    t,
    documentData,
} from './constants'
import { buildTypingsMemberFromClassNode, getCurrentTreeProvider, getImportFromClassOrPath, getKotlinBoxedType, getMethodFromFunctionDeclaration, getNamedSiblings, getTypingsMember, logNode, logNodeTree, prepareContext, resolveBaseType, resolveTypingsFromSuffixes, splitTopLevelArgs, stripAnnotations } from './utils';
export class HoverProviderKS implements vscode.HoverProvider {

    constructor(
        public document: vscode.TextDocument,
        public treeProvider: TreeProvider
    ) { }
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        try {
            const treeProvider = this.treeProvider
            if (!treeProvider || !treeProvider.tree) return;
            if (position.character === 0) return;
            const node = treeProvider.tree.rootNode.descendantForPosition({
                row: position.line,
                column: position.character
            });
            const startChar = Math.max(position.character, 0);
            const range = new vscode.Range(position.line, startChar, position.line, position.character);
            const scope = treeProvider.semanticTokensProvider?.currentScopeFromRange(range) ?? treeProvider.currentScope
            const debug = false


            if (node.type === "type_identifier" && node.parent?.type === "class_declaration") {
                const typingsMember = buildTypingsMemberFromClassNode(node, treeProvider);
                const hoverRange = new vscode.Range(
                    new vscode.Position(node.startPosition.row, node.startPosition.column),
                    new vscode.Position(node.endPosition.row, node.endPosition.column)
                );
                return new vscode.Hover(this.buildHoverMarkdownNativeClass(typingsMember), hoverRange);
            }
            if (node.type === "simple_identifier" && node.parent?.type === "function_declaration") {
                const hoverContent = this.buildFunctionHoverMarkdown(node.text, node.parent, treeProvider);
                if (hoverContent) {
                    return new vscode.Hover(hoverContent, new vscode.Range(
                        new vscode.Position(node.startPosition.row, node.startPosition.column),
                        new vscode.Position(node.endPosition.row, node.endPosition.column)
                    ));
                }
            }
            /* logNode(node, "Hover Node")
            logNode(node.nextNamedSibling, "Hover Node sibling")
            logNode(node.parent, "Hover Node Parent") */
            if (!["type_identifier", "simple_identifier"].includes(node.type)) return;

            const isFunctionVariable = getNamedSiblings(node, true).some(sib => sib.type == "function_type");
            const funcVariable = isFunctionVariable
                ? treeProvider.findChild(node?.parent, "function_type", "variable_declaration")
                : node;
            const userType = treeProvider.findChild(funcVariable, "user_type", "function_type") ?? node;
            const baseType = this.resolveTypeFromVarOrPath(userType, treeProvider, scope);
            const navNode = node.parent?.parent;
            let typingsMember = !baseType
                ? getTypingsMember(navNode?.text ?? "")
                : getTypingsMember(baseType);
            let effectiveBaseType = baseType || (
                navNode?.type === "navigation_expression"
                    ? typingsMember?.classPath
                    : getImportFromClassOrPath(navNode?.text ?? "", treeProvider)
            );
            const simpleVarNode = node.parent?.type == "variable_declaration" ? node.parent : undefined;
            const variableNode = funcVariable ?? simpleVarNode;
            const variable = variableNode != undefined ? scope?.resolveVariable(node.text) : undefined;
            if (debug) {
                logNode(node, "Hover Node")
                logNode(node.nextNamedSibling, "Hover Node sibling")
                logNode(node.parent, "Hover Node Parent")
                log("isFunctionVariable: " + isFunctionVariable);
                log("funcVariable.text: " + funcVariable?.text);
                log("userType.text: " + userType?.text);
                log("baseType: " + baseType);
                log("navNode.type: " + navNode?.type);
                log("navNode.text: " + navNode?.text);
                log("typingsMember: " + typingsMember?.classPath);
                log("effectiveBaseType: " + effectiveBaseType);
                log("simpleVarNode.text: " + simpleVarNode?.text);
                log("variableNode.text: " + variableNode?.text);
                log("resolved variable type: " + variable?.type);
                log("Found member: " + typingsMember?.classPath);
            }
            if (!effectiveBaseType || !typingsMember) {
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
                effectiveBaseType = currentType
                typingsMember = foundTypingsMember
            }
            return new vscode.Hover(this.buildHoverMarkdownType(effectiveBaseType, typingsMember, variable));

        } catch (error) {
            console.log("Error in HoverProviderKS:" + error);
        }
    }
    private buildFunctionHoverMarkdown(
        functionName: string,
        funcNode: SyntaxNode,
        treeProvider: TreeProvider
    ): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString(undefined, true);
        markdown.isTrusted = true;

        const functionValueParamsNode = treeProvider.findChild(funcNode, "function_value_parameters", "function_declaration");
        let paramNodes;
        if (functionValueParamsNode)
            paramNodes = getNamedSiblings(
                treeProvider.findChild(functionValueParamsNode, "parameter", "function_value_parameters"),
                true
            );

        const paramLines = paramNodes?.map(paramNode => {
            const name = treeProvider.findChild(paramNode, "simple_identifier", "parameter")?.text ?? "arg";
            const typeNode = treeProvider.findChild(paramNode, "user_type", "parameter");
            const typeName = typeNode?.text ?? "Unknown";
            const resolvedType = getImportFromClassOrPath(typeName, treeProvider) ?? typeName;
            const resolvedTypeName = this.getClassName(resolvedType);

            const commandLink = this.buildCommandLink(resolvedTypeName, 'extension.gotoTypingDefinition', {
                type: resolvedType,
                documentUri: this.document.uri.toString()
            });

            return `@param ${name} — ${commandLink}`;
        }) ?? [];


        const returnTypeNode = treeProvider.findChildInRange(
            funcNode,
            "user_type",
            "function_declaration",
            treeProvider.supplyRange(funcNode)
        );
        const returnTypeRaw = returnTypeNode?.text ?? "Unit";
        const resolvedReturn = getImportFromClassOrPath(returnTypeRaw, treeProvider) ?? returnTypeRaw;
        const returnTypeName = this.getClassName(resolvedReturn);

        const returnLink = this.buildCommandLink(returnTypeName, 'extension.gotoTypingDefinition', {
            type: resolvedReturn,
            documentUri: this.document.uri.toString()
        });

        paramLines.push(`@returns ${returnLink}`);

        const hoverText = [
            "```kotlin",
            `fun ${functionName}()`,
            "```",
            ...paramLines
        ].join("\n\n");

        markdown.appendMarkdown(hoverText);
        return markdown;

    }



    private resolveTypeFromVarOrPath(node: SyntaxNode, treeProvider: TreeProvider, scope: Scope | undefined): string | null | undefined {
        const varText = node.text;
        const scoped = scope?.resolveVariable(varText);
        // log("Scoped Variable: " + scoped?.type)
        if (scoped?.type) return getImportFromClassOrPath(scoped.type, treeProvider) || scoped.type;
        return getImportFromClassOrPath(varText, treeProvider);
    }

    private buildHoverMarkdownNativeClass(typingsMember: TypingsMember | null): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString(undefined, true);
        const classPath = typingsMember?.classPath;
        markdown.isTrusted = true;
        const isInterface = typingsMember?.modifiers?.includes('interface');
        const classKeyword = isInterface ? 'interface' : 'class';
        let modifiers = this.stripAnnotationModifiers(typingsMember?.modifiers || "");

        if (isInterface) {
            modifiers = modifiers
                .replace(/\binterface\b/g, '')
                .replace(/\babstract\b/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        const className = this.getClassName(classPath || "");
        const typeParams = typingsMember?.typeParameters?.length
            ? `<${typingsMember.typeParameters.join(', ')}>`
            : '';

        const baseTypes: string[] = [];

        if (typingsMember?.superclass) {
            baseTypes.push(this.getClassName(typingsMember.superclass));
        }

        if (Array.isArray(typingsMember?.interfaces)) {
            baseTypes.push(...typingsMember.interfaces.map(i => this.getClassName(i)));
        }

        const inheritance = baseTypes.length ? ` : ${baseTypes.join(', ')}` : '';

        const classLine = `${modifiers} ${classKeyword} ${className}${typeParams}${inheritance}`.trim();
        const packagePath = classPath?.includes(".") ? classPath.substring(0, classPath.lastIndexOf(".")) : "";
        if (packagePath) {
            markdown.appendCodeblock(`package ${packagePath}`, 'kotlin');
            markdown.appendMarkdown('\n\n');
        }

        markdown.appendCodeblock(classLine, 'kotlin');

        const args = { type: classPath || "", documentUri: this.document.uri.toString() };
        const commandLink = this.buildCommandLink("Go to Definitions", 'extension.gotoTypingDefinition', args);
        markdown.appendMarkdown(`\n\n${commandLink}`);

        return markdown;
    }
    private buildCommandLink(displayText: string, commandId: string, args: Record<string, string>): string {
        const encodedArgs = Object.entries(args).map(([key, value]) =>
            `"${key}":"${encodeURIComponent(value)}"`
        ).join(',');

        const encodedJson = encodeURIComponent(`{${encodedArgs}}`);
        return `[${displayText}](command:${commandId}?${encodedJson})`;
    }

    private buildHoverMarkdownType(classPath: string, typingsMember: TypingsMember, variableSymbol: VariableSymbol | undefined = undefined): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString(undefined, true);
        markdown.isTrusted = true;
        if (variableSymbol) {
            const varNode = variableSymbol.node;
            let bindingPatternKind: string | null = null;

            const possibleBinding = varNode.parent?.parent?.firstNamedChild;
            getNamedSiblings(possibleBinding, true).forEach(sibling => {
                if (sibling.type === "binding_pattern_kind") {
                    bindingPatternKind = sibling.text;
                }
            });

            const kind = bindingPatternKind ?? "val";
            const variableLine = `${kind} ${variableSymbol.name}: ${variableSymbol.type}`;
            markdown.appendCodeblock(variableLine, 'kotlin');

            const returnType = classPath
            const returnName = this.getClassName(returnType);
            const args = { type: classPath, documentUri: this.document.uri.toString() };
            const returnLink = this.buildCommandLink(returnName, 'extension.gotoTypingDefinition', args);
            markdown.appendMarkdown(`\n\n**Returns**\n${returnLink}`);

            return markdown;
        }


        const isInterface = typingsMember.modifiers?.includes('interface');
        const classKeyword = isInterface ? 'interface' : 'class';
        let modifiers = this.stripAnnotationModifiers(typingsMember.modifiers);
        if (isInterface) {
            modifiers = modifiers
                .replace(/\binterface\b/g, '')
                .replace(/\babstract\b/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
        const className = this.getClassName(classPath);
        const typeParams = typingsMember.typeParameters?.length
            ? `<${typingsMember.typeParameters.join(', ')}>`
            : '';
        const interfaceNames = Array.of()
        if (Array.isArray(typingsMember.interfaces)) {
            typingsMember.interfaces.forEach(i => {
                interfaceNames.push(this.getClassName(i));
            });
        }

        let superclassName = this.getClassName(typingsMember.superclass)
        const inheritance = [
            ...(superclassName ? [superclassName] : []),
            ...(Array.isArray(interfaceNames) ? interfaceNames : [])
        ].filter(Boolean).join(', ');
        const headerLine = `${modifiers} ${classKeyword} ${className}${typeParams}${inheritance ? ` : ${inheritance}` : ''}`;
        markdown.appendCodeblock(headerLine, 'kotlin');
        const args = {
            type: classPath, documentUri: this.document.uri.toString()
        };
        const commandLink = this.buildCommandLink("Go to Definitions", 'extension.gotoTypingDefinition', args);
        markdown.appendMarkdown(`\n\n${commandLink}`);
        return markdown;
    }
    private getClassName(path: string): string {
        return path.substring(path.lastIndexOf('.') + 1)
    }

    private annotationModifiers: Record<string, string> = {
        "synchronized": "@Synchronized",
        "transient": "@Transient",
        "volatile": "@Volatile",
        "static": "@JvmStatic"
    };
    private stripAnnotationModifiers(modStr: string): string {
        const mods = modStr.split(/\s+/).filter(m => !this.annotationModifiers[m]);
        return mods.join(" ").trim();
    }
}
