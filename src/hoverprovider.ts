
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
import { buildTypingsMemberFromClassNode, getImportFromClassOrPath, getKotlinBoxedType, getMethodFromFunctionDeclaration, getNamedSiblings, getTypingsMember, logNode, logNodeTree, splitTopLevelArgs, stripAnnotations } from './utils';
export class HoverProviderKS implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        try {
            const treeProvider = documentData.get(document.uri.toString())?.semanticTokensProvider?.treeProvider;
            if (!treeProvider || !treeProvider.tree) return;
            const node = treeProvider.tree.rootNode.descendantForPosition({
                row: position.line,
                column: position.character - 1
            });
            const range = new vscode.Range(position.line, position.character - 1, position.line, position.character);
            const scope = treeProvider.semanticTokensProvider?.currentScopeFromRange(range) ?? treeProvider.currentScope

            /*  logNode(node, "Hover Node")
     
             logNode(node.nextNamedSibling, "Hover Node sibling")
             logNode(node.parent, "Hover Node Parent") */

            if (node.type === "type_identifier" && node.parent?.type === "class_declaration") {
                const typingsMember = buildTypingsMemberFromClassNode(node, treeProvider);
                const hoverRange = new vscode.Range(
                    new vscode.Position(node.startPosition.row, node.startPosition.column),
                    new vscode.Position(node.endPosition.row, node.endPosition.column)
                );
                return new vscode.Hover(this.buildHoverMarkdownNativeClass(typingsMember.classPath, typingsMember), hoverRange);
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


            if (!["type_identifier", "simple_identifier"].includes(node.type)) return;
            const isFunctionVariable = getNamedSiblings(node, true).some(sib => sib.type == "function_type")
            const funcVariable = isFunctionVariable ? treeProvider.findChild(node?.parent, "function_type", "variable_declaration") : node;
            const userType = treeProvider.findChild(funcVariable, "user_type", "function_type") ?? node;
            const baseType = this.resolveBaseType(userType, treeProvider, scope);
            const navNode = node.parent?.parent;
            const typingsMember = !baseType ? getTypingsMember(navNode?.text ?? "") : getTypingsMember(baseType)
            const effectiveBaseType = baseType || (navNode?.type === "navigation_expression" ? typingsMember?.classPath : getImportFromClassOrPath(navNode?.text ?? "", treeProvider));
            if (!effectiveBaseType || !typingsMember) return;
            const simpleVarNode = node.parent?.type == "variable_declaration" ? node.parent : undefined
            const variableNode = funcVariable ?? simpleVarNode
            const variable = variableNode != undefined ? scope?.resolveVariable(node.text) : undefined
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
            const command = `command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: resolvedType }))}`;
            return `@param ${name} — [${resolvedTypeName}](${command})`;
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
        const returnCommand = `command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: resolvedReturn }))}`;
        paramLines.push(`@returns [${returnTypeName}](${returnCommand})`);
        const hoverText = [
            "```kotlin",
            `fun ${functionName}()`,
            "```",
            ...paramLines
        ].join("\n\n");
        markdown.appendMarkdown(hoverText);
        return markdown;
    }



    private resolveBaseType(node: SyntaxNode, treeProvider: TreeProvider, scope: Scope | undefined): string | null | undefined {
        const varText = node.text;
        const scoped = scope?.resolveVariable(varText);
        if (scoped?.type) return getImportFromClassOrPath(scoped.type, treeProvider) || scoped.type;
        return getImportFromClassOrPath(varText, treeProvider);
    }

    private buildHoverMarkdownNativeClass(classPath: string, typingsMember: TypingsMember): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString(undefined, true);
        markdown.isTrusted = true;
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
        const classLine = `${modifiers} ${classKeyword} ${className}${typeParams}`.trim();
        markdown.appendCodeblock(classLine, 'kotlin');
        const args = { type: classPath };
        const commandLink = `[Go to Definitions](command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify(args))})`;
        markdown.appendMarkdown(`\n\n${commandLink}`);
        return markdown;
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
            const returnLink = `[${returnName}](command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: returnType }))})`;
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
        typingsMember.interfaces.forEach(i => {
            interfaceNames.push(this.getClassName(i))
        })
        let superclassName = this.getClassName(typingsMember.superclass)
        const inheritance = [
            ...(superclassName ? [superclassName] : []),
            ...(Array.isArray(interfaceNames) ? interfaceNames : [])
        ].filter(Boolean).join(', ');
        const headerLine = `${modifiers} ${classKeyword} ${className}${typeParams}${inheritance ? ` : ${inheritance}` : ''}`;
        markdown.appendCodeblock(headerLine, 'kotlin');
        const args = {
            type: classPath
        };
        const commandLink = `[Go to Definitions](command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify(args))})`;
        markdown.appendMarkdown(`\n\n${commandLink}`);
        return markdown;
    }
    private getClassName(path: string): String {
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
    private extractAnnotations(modStr: string): string[] {
        const mods = modStr.split(/\s+/);
        return mods.map(m => this.annotationModifiers[m]).filter(Boolean);
    }
    private renderLinkedType(type: string): string {
        const raw = type?.split('<')[0];
        const name = raw?.split('.').pop();
        if (!name || !raw || /^[A-Z]$/.test(raw)) return type;
        return `[${name}](command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify({ type: raw }))})`;
    }



    private buildHoverCommandLink(displayName: string, classPath: string): string {
        const typingsMember = getTypingsMember(classPath);
        if (!typingsMember) return displayName;
        const args = {
            type: classPath,
            typingsMember
        };
        return `[${displayName}](command:extension.gotoTypingDefinition?${encodeURIComponent(JSON.stringify(args))})`;
    }
}
