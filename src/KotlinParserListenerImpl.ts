import KotlinParserListener from "../generated/KotlinParserListener";
import { LoopStatementContext, StringLiteralContext, CollectionLiteralContext, ImportHeaderContext, NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext, TypeReferenceContext, VariableDeclarationContext } from "../generated/KotlinParser";
import { RecognitionException, ParseTreeListener, ParserRuleContext, ErrorNode } from "antlr4";
import type { TextDocument } from "vscode";
import vscode from "vscode"
import { Diagnostic, DiagnosticSeverity, Uri, Range, Position } from "vscode"
import { KotlinScriptErrorStrategy } from "./KotlinScriptErrorStrategy";

export const parsedFunctions = new Map<string, { returnType: string, parameters: { name: string, type: string }[] }>();
export const parsedClasses = new Map<string, { properties: { name: string, type: string }[], methods: { name: string, returnType: string, parameters: { name: string, type: string }[] }[] }>();
export const importedClassesUsage = new Map<string, string[]>();
export const instantiatedClasses = new Map<string, { arguments: { name: string; value: string }[] }>();
export const importedClasses = new Map<string, string>();
export const syntaxErrors: { line: number, column: number, message: string }[] = [];
const individualLogging = false;
const globalLogging = false;
const exitGlobals = false;
const enterGlobals = false;
function logContent(...data: any[]) {
    if (individualLogging) {
        console.log(data)
    }
}

function logGlobals(...data: any[]) {
    if (globalLogging) {
        console.log(data)
    }
}
export default class KotlinParserListenerImpl extends KotlinParserListener {
    private diagnostics: vscode.Diagnostic[] = [];
    private document: TextDocument;
    private errorStrategy: KotlinScriptErrorStrategy; // Reference to the error strategy for accessing error messages

    constructor(document: TextDocument, errorStrategy: KotlinScriptErrorStrategy) {
        super();
        this.document = document;
        this.errorStrategy = errorStrategy;
    }

    visitErrorNode(node: ErrorNode): void {
        /*  const ctx = node.parentCtx;
         const startToken = ctx.start;
 
         try {
             const line = startToken.line - 1; // Convert to zero-based line index for VSCode
             const col = startToken.column;
             const positionKey = `${startToken.line}:${startToken.column}`;
 
             // Retrieve the custom message from the error strategy if available
             const customMessage = this.errorStrategy.getErrorMessage(startToken.line, startToken.column);
             console.log("Pos: " + positionKey)
             console.log("Custom Message:" + customMessage)
             const message = customMessage || "Syntax error"; // Fallback to a default message if no custom message is found
 
             const range = new Range(new Position(line, col), new Position(line, col + startToken.text.length));
             const diagnostic = new Diagnostic(range, message, DiagnosticSeverity.Error);
             this.diagnostics.push(diagnostic);
         } catch (error) {
             console.error("Error in visitErrorNode: " + error);
         } */
    }

    public getDiagnostics(): Diagnostic[] {
        return this.diagnostics;
    }
}