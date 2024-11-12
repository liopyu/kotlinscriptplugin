import KotlinParserListener from "../generated/KotlinParserListener";
import { AssignmentContext, FunctionBodyContext, ImportListContext, LoopStatementContext, StringLiteralContext, CollectionLiteralContext, ImportHeaderContext, NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext, TypeReferenceContext, VariableDeclarationContext, MultiVariableDeclarationContext, PackageHeaderContext } from "../generated/KotlinParser";
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
const globalLogging = true;
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
export const parsedVariables = new Map<string, string>();
export default class KotlinParserListenerImpl extends KotlinParserListener {
    private diagnostics: vscode.Diagnostic[] = [];
    private document: TextDocument;
    private errorStrategy: KotlinScriptErrorStrategy; // Reference to the error strategy for accessing error messages

    constructor(document: TextDocument, errorStrategy: KotlinScriptErrorStrategy) {
        super();
        this.document = document;
        this.errorStrategy = errorStrategy;
    }
    enterPackageHeader = (ctx: PackageHeaderContext) => {

    }
    exitPackageHeader = (ctx: PackageHeaderContext) => {

    }
    enterImportList = (ctx: ImportListContext) => {

    }
    exitImportList = (ctx: ImportListContext) => {

    }
    enterVariableDeclaration = (ctx: VariableDeclarationContext) => {

    }
    exitVariableDeclaration = (ctx: VariableDeclarationContext) => {

    }
    enterFunctionDeclaration = (ctx: FunctionDeclarationContext) => {

    }
    exitFunctionDeclaration = (ctx: FunctionDeclarationContext) => {

    }
    enterClassDeclaration = (ctx: ClassDeclarationContext) => {

    }
    exitClassDeclaration = (ctx: ClassDeclarationContext) => {

    }
    enterLoopStatement = (ctx: LoopStatementContext) => {

    }
    exitLoopStatement = (ctx: LoopStatementContext) => {

    }
    enterAssignment = (ctx: AssignmentContext) => {

    }
    exitAssignment = (ctx: AssignmentContext) => {

    }

}

class Scope {
    parentScope: Scope | null;
    symbols: Map<string, Symbol>;

    constructor(parentScope: Scope | null) {
        this.parentScope = parentScope;
        this.symbols = new Map();
    }

    define(symbol: Symbol): void {
        this.symbols.set(symbol.name, symbol);
    }

    getEnclosingScope(): Scope | null {
        return this.parentScope;
    }

}
let currentScope: Scope = new Scope(null);

function enterScope(newScope: Scope) {
    newScope.parentScope = currentScope;
    currentScope = newScope;
}

function exitScope() {
    if (currentScope.parentScope) {
        currentScope = currentScope.parentScope;
    }
}
class Symbol {
    name: string;
    type: string | null;
    constructor(name: string, type: string | null = null) {
        this.name = name;
        this.type = type;
    }
}

class FunctionSymbol extends Symbol {
    public args: Symbol[];
    public returnType: string | null;
    constructor(name: string, args: Symbol[], returnType: string | null) {
        super(name, returnType);
        this.args = args;
        this.returnType = returnType;
    }
}

class VariableSymbol extends Symbol { }
class ClassSymbol extends Symbol { }
class InterfaceSymbol extends Symbol { }
