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
        /*   try {
              // Retrieve the package name from the context
              const packageName = ctx.identifier().getText();
  
              // Create a package symbol with the name
              const packageSymbol = new Symbol(packageName);
              currentScope.define(packageSymbol);
  
              // Log and enter the package scope
              console.log(`Entering package: ${packageName}`);
              enterScope(new Scope(currentScope));
          } catch (error) {
              console.error(error);
          } */
    };

    exitPackageHeader = (ctx: PackageHeaderContext) => {
        /*   try {
              // Retrieve the package name for logging or debugging purposes
              const packageName = ctx.identifier().getText();
              console.log(`Exiting package: ${packageName}`);
  
              // Exit the package scope
              exitScope();
          } catch (error) {
              console.error(error);
          } */
    };
    enterImportList = (ctx: ImportListContext) => {
        try {
            /*  // Retrieve each import from the import list
             for (const importHeader of ctx.importHeader_list()) {
                 const importPath = importHeader.identifier().getText();
 
                 // Create an import symbol for the class or package
                 const importSymbol = new Symbol(importPath);
 
                 // Record the import in the global scope or a dedicated imports map
                 currentScope.define(importSymbol); // or store in a dedicated `importsMap`
 
                 console.log(`Importing: ${importPath}`);
             } */
        } catch (error) {
            console.error(error);
        }
    };

    exitImportList = (ctx: ImportListContext) => {
        /*   try {
              // Log exit from import list processing, if needed for debugging
              console.log(`Finished processing imports.`);
          } catch (error) {
              console.error(error);
          } */
    };

    enterVariableDeclaration = (ctx: VariableDeclarationContext) => {
        try {
            // Retrieve the variable name from the context, if available
            const variableName = ctx.simpleIdentifier() ? ctx.simpleIdentifier().getText() : null;
            if (!variableName) {
                console.warn("Variable name not found.");
                return;
            }

            // Determine the variable type, defaulting to 'Any' if unspecified or null
            const variableType = ctx.type_() ? ctx.type_().getText() : "Any";

            // Create a variable symbol with the extracted name and type
            const variableSymbol = new VariableSymbol(variableName, variableType);

            // Define the variable symbol in the current scope
            currentScope.define(variableSymbol);

            // Log the variable for debugging
            console.log(`Declared variable: ${variableName} with type: ${variableType}`);
        } catch (error) {
            console.error(error);
        }
    };


    exitVariableDeclaration = (ctx: VariableDeclarationContext) => {
        try {
            // Optional: Log exiting variable declaration or cleanup if necessary
            const variableName = ctx.simpleIdentifier().getText();
            console.log(`Exiting variable declaration for: ${variableName}`);
        } catch (error) {
            console.error(error);
        }
    };

    enterFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
        try {
            /*    const functionName = ctx.simpleIdentifier().getText();
               const parameters: VariableSymbol[] = [];
               const paramList = ctx.functionValueParameters();
   
               if (paramList) {
                   for (const param of paramList.functionValueParameter_list()) {
                       const paramCtx = param.parameter();
                       const paramName = paramCtx.simpleIdentifier().getText();
                       const paramType = paramCtx.type_() ? paramCtx.type_().getText() : "Any";
                       const paramSymbol = new VariableSymbol(paramName, paramType);
                       parameters.push(paramSymbol);
                   }
               }
   
               const returnType = ctx.type_() ? ctx.type_().getText() : "Unit";
               const functionSymbol = new FunctionSymbol(functionName, parameters, returnType);
               currentScope.define(functionSymbol);
   
               console.log(`Entering function: ${functionName} with parameters: ${parameters.map(p => `${p.name}: ${p.type}`).join(", ")}`);
               enterScope(new Scope(currentScope)); */
        } catch (error) {
            console.error(error);
        }
    };

    exitFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
        /*   try {
              const functionName = ctx.simpleIdentifier().getText();
              console.log(`Exiting function: ${functionName}`);
              exitScope();
          } catch (error) {
              console.error(error);
          } */
    };

    enterBlock = (ctx: BlockContext) => {
        // Create a new scope specifically for this block
        /* const blockScope = new Scope(currentScope);

        // Enter the block scope
        enterScope(blockScope); */
        console.log("Entering a new block scope.");
    };

    exitBlock = (ctx: BlockContext) => {
        // Exit the block scope, reverting to the previous scope
        /*   exitScope(); */
        console.log("Exiting block scope.");
    };

    enterClassDeclaration = (ctx: ClassDeclarationContext) => {
        try {
            /*    // Retrieve the class name from the context
               const className = ctx.simpleIdentifier().getText();
   
               // Create a class symbol with the name
               const classSymbol = new ClassSymbol(className);
   
               // Define the class symbol in the current scope
               currentScope.define(classSymbol);
   
               // Log and enter the class scope
               console.log(`Entering class: ${className}`);
               enterScope(new Scope(currentScope)); */
        } catch (error) {
            console.error(error);
        }
    };

    exitClassDeclaration = (ctx: ClassDeclarationContext) => {
        /*   try {
              // Retrieve the class name for logging or debugging
              const className = ctx.simpleIdentifier().getText();
              console.log(`Exiting class: ${className}`);
  
              // Exit the class scope
              exitScope();
          } catch (error) {
              console.error(error);
          } */
    };

    enterLoopStatement = (ctx: LoopStatementContext) => {
        /*  try {
             // Create a new scope specifically for this loop
             const loopScope = new Scope(currentScope);
 
             // Enter the loop scope
             enterScope(loopScope);
             console.log("Entering a loop scope.");
         } catch (error) {
             console.error(error);
         } */
    };

    exitLoopStatement = (ctx: LoopStatementContext) => {
        /*  try {
             // Exit the loop scope, reverting to the previous scope
             exitScope();
             console.log("Exiting loop scope.");
         } catch (error) {
             console.error(error);
         } */
    };

}
let variableDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#ADD8E6',
});

export function applyVariableDecorations(document: vscode.TextDocument): void {
    const variableRanges: vscode.Range[] = [];
    const text = document.getText();

    // Traverse all variables in current scope and its parents
    let scope: Scope | null = currentScope;  // Start with the current scope
    while (scope) {
        scope.variables.forEach((variableSymbol, variableName) => {
            const regex = new RegExp(`\\b${variableName}\\b`, 'g');
            let match;

            // Find all occurrences of the variable name in the document
            while ((match = regex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + variableName.length);
                variableRanges.push(new vscode.Range(startPos, endPos));
                console.log(`Variable range for '${variableName}': ${startPos.line}:${startPos.character} - ${endPos.line}:${endPos.character}`);
            }
        });

        // Move to the parent scope to check for variables accessible from parent scopes
        scope = scope.parentScope;
    }

    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === document) {
        editor.setDecorations(variableDecorationType, variableRanges);
        console.log(`Applied decorations for ${variableRanges.length} variables`);
    }
}
export class Scope {
    parentScope: Scope | null;
    symbols: Map<string, Symbol>;
    variables: Map<string, VariableSymbol>;

    constructor(parentScope: Scope | null) {
        this.parentScope = parentScope;
        this.symbols = new Map();
        this.variables = new Map();  // Track variables in this specific scope
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
