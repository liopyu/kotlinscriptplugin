import KotlinParserListener from "../generated/KotlinParserListener";
import { StringLiteralContext, CollectionLiteralContext, ImportHeaderContext, NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext, TypeReferenceContext } from "../generated/KotlinParser";
import { ParseTreeListener, ParserRuleContext } from "antlr4";
export const parsedFunctions = new Map<string, { returnType: string, parameters: { name: string, type: string }[] }>();
export const parsedClasses = new Map<string, { properties: { name: string, type: string }[], methods: { name: string, returnType: string, parameters: { name: string, type: string }[] }[] }>();
export const importedClassesUsage = new Map<string, string[]>();
export const instantiatedClasses = new Map<string, { arguments: { name: string; value: string }[] }>();
export const importedClasses = new Map<string, string>();
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
    enterStringLiteral = (ctx: StringLiteralContext): void => {
        console.log(ctx.getText())
    }
    /**
     * Will need for type references
     * @param ctx 
     */
    enterTypeReference = (ctx: TypeReferenceContext): void => {
        console.log(ctx.getText())
    }
    /**
     * Enter point for all rules
     * @param ctx 
     */
    enterEveryRule(ctx: ParserRuleContext): void {
        if (!enterGlobals) return
        const startToken = ctx.start;
        const stopToken = ctx.stop;
        logGlobals(`Entering rule: ${ctx.constructor.name}`);

        if (startToken) {
            logGlobals(`Start Token: Text = ${startToken.text}, Type = ${startToken.type}, Position = ${startToken.line}:${startToken.column}`);
        }

        if (stopToken) {
            logGlobals(`Stop Token: Text = ${stopToken.text}, Type = ${stopToken.type}, Position = ${stopToken.line}:${stopToken.column}`);
        }
    }

    /**
     * Exit point for all rules
     * @param ctx 
     */
    exitEveryRule(ctx: ParserRuleContext): void {
        if (!exitGlobals) return
        const startToken = ctx.start;
        const stopToken = ctx.stop;
        logGlobals(`Exiting rule: ${ctx.constructor.name}`);

        if (startToken) {
            logGlobals(`Start Token: Text = ${startToken.text}, Type = ${startToken.type}, Position = ${startToken.line}:${startToken.column}`);
        }

        if (stopToken) {
            logGlobals(`Stop Token: Text = ${stopToken.text}, Type = ${stopToken.type}, Position = ${stopToken.line}:${stopToken.column}`);
        }
    }
    exitImportHeader = (ctx: ImportHeaderContext): void => {
        const fullPathParts: string[] = [];

        const identifierCtx = ctx.identifier();
        if (identifierCtx) {
            // Use childCount to iterate over each simpleIdentifier by index with null checks
            for (let i = 0; i < identifierCtx.getChildCount(); i++) {
                const idCtx = identifierCtx.simpleIdentifier(i) as SimpleIdentifierContext;
                if (idCtx) { // Check for null before using getText()
                    fullPathParts.push(idCtx.getText());
                }
            }
        }

        const fullPath = fullPathParts.join(".");
        const className = fullPathParts[fullPathParts.length - 1] || "UnknownClass";

        if (className !== "UnknownClass") {
            importedClasses.set(className, fullPath);
            console.log(`Captured import: ${className} from path: ${fullPath}`);
        }
    };
    exitSimpleIdentifier = (ctx: SimpleIdentifierContext): void => {
        const identifier = ctx.Identifier();
    }
}
