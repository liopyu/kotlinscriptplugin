import KotlinParserListener from "../generated/KotlinParserListener";
import { LoopStatementContext, StringLiteralContext, CollectionLiteralContext, ImportHeaderContext, NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext, TypeReferenceContext } from "../generated/KotlinParser";
import { RecognitionException, ParseTreeListener, ParserRuleContext } from "antlr4";
import type { TextDocument } from "vscode";
import vscode from "vscode"
import { Diagnostic, DiagnosticSeverity, Uri, Range, Position } from "vscode"


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

    constructor(document: TextDocument) {
        super();
        this.document = document;
    }

    enterEveryRule(ctx: ParserRuleContext): void {
        const startToken = ctx.start;

        if (ctx.exception) {
            const error = ctx.exception as RecognitionException;
            const line = startToken.line - 1;  // Convert to 0-based for vscode
            const col = startToken.column;

            const message = error.message || "Syntax error";
            const range = new Range(new Position(line, col), new Position(line, col + startToken.text.length));

            const diagnostic = new Diagnostic(range, message, DiagnosticSeverity.Error);
            this.diagnostics.push(diagnostic);
        }
    }

    getDiagnostics(): vscode.Diagnostic[] {
        return this.diagnostics;
    }
}
