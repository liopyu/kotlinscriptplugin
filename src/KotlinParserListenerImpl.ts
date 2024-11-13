import KotlinParserListener from "../generated/KotlinParserListener";
import { AssignmentContext, FunctionBodyContext, ImportListContext, LoopStatementContext, StringLiteralContext, CollectionLiteralContext, ImportHeaderContext, NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext, TypeReferenceContext, VariableDeclarationContext, MultiVariableDeclarationContext, PackageHeaderContext, BlockContext } from "../generated/KotlinParser";
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
const enterGlobals = true;
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
enum VariableType {
    SIMPLE,
    VARIABLE,
    IMPORT
}
export default class KotlinParserListenerImpl extends KotlinParserListener {
    public hasPackageHeader: boolean = false;
    public currentScope: Scope = new Scope(null);
    public scopes: Scope[] = [];
    public ranges: Map<VariableType, vscode.Range[]> = new Map();
    public simpleRanges: vscode.Range[] = []
    public imports: Map<string, ImportSymbol> = new Map()
    public scopedVariables: VariableSymbol[] = []
    public diagnostics: vscode.Diagnostic[] = [];
    private document: TextDocument;
    private errorStrategy: KotlinScriptErrorStrategy;

    constructor(document: TextDocument, errorStrategy: KotlinScriptErrorStrategy) {
        super();
        this.document = document;
        this.errorStrategy = errorStrategy;
        this.scopes.push(this.currentScope);
    }

    exitKotlinFile = (ctx: KotlinFileContext) => {
        try {
            // Ensure arrays are initialized for each variable type
            if (!this.ranges.has(VariableType.IMPORT)) {
                this.ranges.set(VariableType.IMPORT, []);
            }
            if (!this.ranges.has(VariableType.VARIABLE)) {
                this.ranges.set(VariableType.VARIABLE, []);
            }
            if (!this.ranges.has(VariableType.SIMPLE)) {
                this.ranges.set(VariableType.SIMPLE, []);
            }

            // Add import ranges to IMPORT array
            this.scopedVariables.forEach(variable => {
                const range = variable.range;
                if (variable.isImport) {
                    logGlobals(`Applying import decoration for ${variable.name}: Range: [${range.start.line}, ${range.start.character}] , [${range.end.line}, ${range.end.character}]`);
                    this.ranges.get(VariableType.IMPORT)!.push(range);
                } else {
                    logGlobals(`Applying variable decoration for ${variable.name}: Range: [${range.start.line}, ${range.start.character}] , [${range.end.line}, ${range.end.character}]`);
                    this.ranges.get(VariableType.VARIABLE)!.push(range);
                }
            });

            // Add variable ranges from each scope to VARIABLE array
            this.scopes.forEach(scope => {
                scope.variables.forEach(variable => {
                    const range = variable.range;
                    logGlobals(`Applying variable decoration for ${variable.name}: Range: [${range.start.line}, ${range.start.character}] , [${range.end.line}, ${range.end.character}]`);
                    this.ranges.get(VariableType.VARIABLE)!.push(range);
                });
            });

            // Add default identifier ranges to SIMPLE array
            this.simpleRanges.forEach(simpleRange => {
                this.ranges.get(VariableType.SIMPLE)!.push(simpleRange);
                logGlobals(`Applying default decoration: Range: [${simpleRange.start.line}, ${simpleRange.start.character}] , [${simpleRange.end.line}, ${simpleRange.end.character}]`);
            });

            // Exit package scope if it was entered
            if (this.hasPackageHeader) {
                this.exitScope();
            }
        } catch (error) {
            console.error(error);
        }
    };

    enterEveryRule(ctx: ParserRuleContext): void {
        try {
            if (enterGlobals) {
                logContent(`Entering rule: ${ctx?.ruleContext?.getText()}, ${ctx.constructor.name}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    enterSimpleIdentifier = (ctx: SimpleIdentifierContext) => {
        try {
            const identifierText = ctx.getText();
            const startPos = new vscode.Position(ctx.start.line - 1, ctx.start.column);
            const endPos = new vscode.Position(ctx.start.line - 1, ctx.start.column + identifierText.length);
            const range = new vscode.Range(startPos, endPos);

            let isVariable = false;
            let isImport = false;

            // Check if the identifier is a variable in the current scope or parent scope using resolveVariable
            const variable = this.currentScope.resolveVariable(identifierText);
            if (variable) {
                // The variable is in the correct scope
                if (!this.ranges.has(VariableType.VARIABLE)) {
                    this.ranges.set(VariableType.VARIABLE, []);
                }
                this.ranges.get(VariableType.VARIABLE)!.push(range);
                logGlobals(`Decorated variable identifier: ${identifierText} at ${startPos.line}:${startPos.character}`);
                isVariable = true;
            }

            // If not a variable, check if it's an import
            if (!isVariable && this.imports.has(identifierText)) {
                const imp = this.imports.get(identifierText);
                if (imp && !imp.initialRange.intersection(range)) {
                    if (!this.ranges.has(VariableType.IMPORT)) {
                        this.ranges.set(VariableType.IMPORT, []);
                    }
                    this.ranges.get(VariableType.IMPORT)!.push(range);
                    logGlobals(`Decorated import identifier: ${identifierText} at ${startPos.line}:${startPos.character}`);
                    isImport = true;
                }
            }

            // If it's not a variable or import, treat it as a general identifier
            if (!isVariable && !isImport) {
                const isImportContext = ctx.parentCtx?.parentCtx?.constructor.name === "ImportHeaderContext";
                const isVariableContext = ctx.parentCtx?.constructor.name === "VariableDeclarationContext";

                if (!isImportContext && !isVariableContext) {
                    if (!this.ranges.has(VariableType.SIMPLE)) {
                        this.ranges.set(VariableType.SIMPLE, []);
                    }
                    this.ranges.get(VariableType.SIMPLE)!.push(range);
                    logGlobals(`Decorated default identifier: ${identifierText} at ${startPos.line}:${startPos.character}`);
                }
            }
        } catch (error) {
            console.error("Error in enterSimpleIdentifier:", error);
        }
    };




    exitSimpleIdentifier = (ctx: SimpleIdentifierContext) => {
        try {
        } catch (error) {
            console.error("Error in exitSimpleIdentifier:", error);
        }
    }
    enterPackageHeader = (ctx: PackageHeaderContext) => {
        try {
            if (!ctx.identifier()) return
            this.hasPackageHeader = true
            const packageName = ctx.identifier().getText();

            const packageSymbol = new Symbol(packageName);
            this.currentScope.define(packageSymbol);

            logGlobals(`Entering package: ${packageName}`);
            this.enterScope(new Scope(this.currentScope));
        } catch (error) {
            console.error(error);
        }
    };
    enterImportList = (ctx: ImportListContext) => {
        try {
            for (const importHeader of ctx.importHeader_list()) {
                const importPath = importHeader.identifier().getText();
                const identifierText = importHeader.identifier().getText();
                if (!importHeader.identifier()) return;

                // Extract class name from the import path (e.g., if importPath is "com.example.MyClass", name would be "MyClass")
                const name = getClassName(importPath);

                // Get the start and end positions of the specific import path
                const startPos = new vscode.Position(importHeader.start.line - 1, importHeader.start.column);
                // @ts-expect-error 
                const endPos = new vscode.Position(importHeader.stop.line - 1, importHeader.stop.column + identifierText.length);

                const range = new vscode.Range(startPos, endPos);
                const importSymbol = new ImportSymbol(name, importPath, range);

                logGlobals("Storing import path: " + importPath + " with name: " + name);
                this.imports.set(name, importSymbol);
                logGlobals(`Importing: ${importPath}`);
            }
        } catch (error) {
            console.error(error);
        }
    };


    enterVariableDeclaration = (ctx: VariableDeclarationContext) => {
        try {
            const simpleIdentifier = ctx.simpleIdentifier();
            const variableName = simpleIdentifier ? simpleIdentifier.getText() : null;
            if (!variableName) {
                logGlobals("Variable name not found.");
                return;
            }

            logGlobals("Adding definition for variable: " + variableName);
            const variableType = ctx.type_() ? ctx.type_().getText() : "Any";

            // Get the start and end positions of the variable name (SimpleIdentifier)
            const startPos = new vscode.Position(simpleIdentifier.start.line - 1, simpleIdentifier.start.column);
            const endPos = new vscode.Position(
                simpleIdentifier.start.line - 1,
                simpleIdentifier.start.column + variableName.length
            );

            const range = new vscode.Range(startPos, endPos);
            const variableSymbol = new VariableSymbol(variableName, variableType, range);

            this.currentScope.define(variableSymbol);

            logGlobals(`Declared variable: ${variableName} with type: ${variableType}`);
        } catch (error) {
            console.error(error);
        }
    };



    exitVariableDeclaration = (ctx: VariableDeclarationContext) => {
        try {
            /* 
 
            // Optional: Log exiting variable declaration or cleanup if necessary
            const variableName = ctx.simpleIdentifier().getText();
            logGlobals(`Exiting variable declaration for: ${variableName}`); */
        } catch (error) {
            console.error(error);
        }
    };

    enterFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
        try {
            const functionName = ctx.simpleIdentifier().getText();
            const parameters: VariableSymbol[] = [];
            const paramList = ctx.functionValueParameters();

            if (paramList) {
                for (const param of paramList.functionValueParameter_list()) {
                    const paramCtx = param.parameter();
                    const paramName = paramCtx.simpleIdentifier().getText();
                    const paramType = paramCtx.type_() ? paramCtx.type_().getText() : "Any";

                    // Determine the start and end positions of the parameter
                    const startPos = new vscode.Position(paramCtx.simpleIdentifier().start.line - 1, paramCtx.simpleIdentifier().start.column);
                    const endPos = new vscode.Position(
                        paramCtx.simpleIdentifier().start.line - 1,
                        paramCtx.simpleIdentifier().start.column + paramName.length
                    );
                    const range = new vscode.Range(startPos, endPos);

                    // Create the VariableSymbol with the correct range
                    const paramSymbol = new VariableSymbol(paramName, paramType, range);
                    parameters.push(paramSymbol);
                }
            }

            // Define the function symbol with its parameters and return type
            const returnType = ctx.type_() ? ctx.type_().getText() : "Unit";
            const functionSymbol = new FunctionSymbol(functionName, parameters, returnType);
            this.currentScope.define(functionSymbol);

            // Log function entry and push a new scope
            logGlobals(`Entering function: ${functionName} with parameters: ${parameters.map(p => `${p.name}: ${p.type}`).join(", ")}`);
            /* this.enterScope(new Scope(this.currentScope)); */

            // Define each parameter in the function's scope
            parameters.forEach(param => this.currentScope.define(param));
        } catch (error) {
            console.error(error);
        }
    };


    exitFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
        try {
        } catch (error) {
            console.error(error);
        }
    };


    enterBlock = (ctx: BlockContext) => {
        const name = ctx.parentCtx?.constructor.name;
        const blockScope = new Scope(this.currentScope);

        this.enterScope(blockScope);
        logGlobals("Entering a new block scope.");
    };

    exitBlock = (ctx: BlockContext) => {
        const name = ctx.parentCtx?.constructor.name;
        this.exitScope();
        logGlobals("Exiting block scope.");
    };

    enterClassDeclaration = (ctx: ClassDeclarationContext) => {
        try {
            // Get the class name from the SimpleIdentifier context
            const className = ctx.simpleIdentifier().getText();

            // Define the class symbol and assign it to the current scope
            const classSymbol = new ClassSymbol(className);
            this.currentScope.define(classSymbol);

            // Log class entry and create a new scope for the class
            logGlobals(`Entering class: ${className}`);
            const classScope = new Scope(this.currentScope);
            this.enterScope(classScope);

        } catch (error) {
            console.error(error);
        }
    };


    exitClassDeclaration = (ctx: ClassDeclarationContext) => {
        try {
            const className = ctx.simpleIdentifier().getText();
            logGlobals(`Exiting class: ${className}`);

            // Exit the class scope
            this.exitScope();

        } catch (error) {
            console.error(error);
        }
    };


    enterLoopStatement = (ctx: LoopStatementContext) => {
        /*  try {
             const loopScope = new Scope(currentScope);
 
             enterScope(loopScope);
             logGlobals("Entering a loop scope.");
         } catch (error) {
             console.error(error);
         } */
    };

    exitLoopStatement = (ctx: LoopStatementContext) => {
        /*  try {
             exitScope();
             logGlobals("Exiting loop scope.");
         } catch (error) {
             console.error(error);
         } */
    };
    enterScope(newScope: Scope) {
        this.scopes.push(newScope);
        newScope.parentScope = this.currentScope;
        this.currentScope = newScope;
    }

    exitScope() {
        if (this.currentScope.parentScope) {
            this.currentScope = this.currentScope.parentScope;
        }
    }

}
let SimpleDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ADD8E6',
});
let VariableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4bb4ec',
});
let ImportDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#4ec9b0',
});

export function applyDecorations(parser: KotlinParserListenerImpl, document: vscode.TextDocument): void {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === document) {
        if (parser.ranges.has(VariableType.IMPORT)) {
            editor.setDecorations(ImportDecorationType, parser.ranges.get(VariableType.IMPORT)!);
        }
        if (parser.ranges.has(VariableType.SIMPLE)) {
            editor.setDecorations(SimpleDecorationType, parser.ranges.get(VariableType.SIMPLE)!);
        }
        if (parser.ranges.has(VariableType.VARIABLE)) {
            editor.setDecorations(VariableDecorationType, parser.ranges.get(VariableType.VARIABLE)!);
        }
    }
}


export class Scope {
    parentScope: Scope | null;
    symbols: Map<string, Symbol>;
    variables: Map<string, VariableSymbol>;

    constructor(parentScope: Scope | null) {
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();
    }

    define(symbol: Symbol): void {
        if (symbol instanceof VariableSymbol) {
            this.variables.set(symbol.name, symbol);
        } else {
            this.symbols.set(symbol.name, symbol);
        }
    }

    resolveVariable(name: string): VariableSymbol | undefined {
        return this.variables.get(name) || (this.parentScope ? this.parentScope.resolveVariable(name) : undefined);
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

class VariableSymbol extends Symbol {
    public isImport: boolean;
    public range: vscode.Range
    constructor(name: string, type: string | null = null, range: vscode.Range, isImport: boolean = false) {
        super(name, type);
        this.range = range;
        this.isImport = isImport;
    }
}
class ClassSymbol extends Symbol { }
class InterfaceSymbol extends Symbol { }
class ImportSymbol extends Symbol {
    public initialRange: vscode.Range
    constructor(name: string, type: string | null = null, initialRange: vscode.Range) {
        super(name, type);
        this.initialRange = initialRange;
    }

}
function getClassName(type: string): string {
    if (type != null) {
        const parts = type.split('.');
        return parts[parts.length - 1];
    }
    return "kotlin.Unit";
}
