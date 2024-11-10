import KotlinParserListener from "../generated/KotlinParserListener";
import { NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext } from "../generated/KotlinParser";
import { ParseTreeListener, ParserRuleContext } from "antlr4";
export const parsedFunctions = new Map<string, { returnType: string, parameters: { name: string, type: string }[] }>();
export const parsedClasses = new Map<string, { properties: { name: string, type: string }[], methods: { name: string, returnType: string, parameters: { name: string, type: string }[] }[] }>();
export const importedClassesUsage = new Map<string, string[]>();
export const instantiatedClasses = new Map<string, { arguments: { name: string; value: string }[] }>();

const individualLogging = false;
const globalLogging = true;
const exitGlobals = true;
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
    exitSimpleIdentifier = (ctx: SimpleIdentifierContext): void => {
        const identifier = ctx.Identifier();
        //logContent(`Found simple identifier: ${identifier}`);
    }
    enterNavigationSuffix = (ctx: NavigationSuffixContext): void => {
        const identifier = ctx.simpleIdentifier()?.getText();
        if (identifier) {
            logContent(`Navigating to member of: ${identifier}`);

            // Check if `identifier` matches an imported class, like `Minecraft`
            if (importedClassesUsage.has(identifier)) {
                logContent(`Member navigation detected for imported class: ${identifier}`);
                // You can then populate potential completions based on known members of `Minecraft` or other imported classes
            }
        }
    };

    exitNavigationSuffix = (ctx: NavigationSuffixContext): void => {
        logContent("Exiting NavigationSuffix");
        // Additional processing, if needed, once navigation is complete
    };
    exitConstructorInvocation = (ctx: ConstructorInvocationContext): void => {
        logContent("Entering exitConstructorInvocation");

        const className = ctx.userType()?.getText() || "UnknownClass";
        const argumentsList: { name: string; value: string }[] = [];

        const valueArgsCtx = ctx.valueArguments();
        if (valueArgsCtx) {
            logContent(`Processing ${valueArgsCtx.getChildCount()} arguments for class ${className}`);

            for (let i = 0; i < valueArgsCtx.getChildCount(); i++) {
                const argCtx = valueArgsCtx.getTypedRuleContext(ValueArgumentContext, i);
                if (argCtx) {
                    const argValue = argCtx.expression()?.getText() || "value";
                    logContent(`Argument ${i + 1}: ${argValue}`);
                    argumentsList.push({ name: `arg${i + 1}`, value: argValue });
                }
            }
        } else {
            logContent(`No arguments found for class ${className}`);
        }

        instantiatedClasses.set(className, { arguments: argumentsList });
        logContent(`Instantiated class stored: ${className} with arguments:`, argumentsList);
    };

    exitClassDeclaration = (ctx: ClassDeclarationContext): void => {
        const className = ctx.simpleIdentifier()?.getText() || "AnonymousClass";
        const properties: { name: string; type: string; isMutable: boolean }[] = [];
        const methods: { name: string; returnType: string; parameters: { name: string; type: string }[] }[] = [];

        const classBodyCtx = ctx.classBody();
        if (classBodyCtx) {
            classBodyCtx.classMemberDeclarations()?.classMemberDeclaration_list()?.forEach(memberCtx => {
                const declarationCtx = memberCtx.declaration();

                // Check for property declaration
                if (declarationCtx?.propertyDeclaration()) {
                    const propertyDeclarationCtx = declarationCtx.propertyDeclaration();
                    const isMutable = propertyDeclarationCtx.VAR() !== null;
                    const propertyName = propertyDeclarationCtx.variableDeclaration()?.simpleIdentifier()?.getText() || "property";
                    const propertyType = propertyDeclarationCtx.variableDeclaration()?.type_()?.getText() || "Any";

                    properties.push({ name: propertyName, type: propertyType, isMutable });
                }

                // Check for function declaration
                if (declarationCtx?.functionDeclaration()) {
                    const methodName = declarationCtx.functionDeclaration().simpleIdentifier()?.getText() || "method";
                    const returnType = declarationCtx.functionDeclaration().type_()?.getText() || "Unit";

                    const parameters: { name: string; type: string }[] = [];
                    const functionParamsCtx = declarationCtx.functionDeclaration().functionValueParameters();

                    if (functionParamsCtx) {
                        for (let i = 0; i < functionParamsCtx.getChildCount(); i++) {
                            const paramCtx = functionParamsCtx.getTypedRuleContext(FunctionValueParameterContext, i);
                            if (paramCtx) {
                                const parameterCtx = paramCtx.parameter();
                                const paramName = parameterCtx?.simpleIdentifier()?.getText() || "param";
                                const paramType = parameterCtx?.type_()?.getText() || "Any";
                                parameters.push({ name: paramName, type: paramType });
                            }
                        }
                    }

                    methods.push({ name: methodName, returnType, parameters });
                }
            });
        }

        parsedClasses.set(className, { properties, methods });
        logContent(`Stored class: ${className} with properties and methods:`, { properties, methods });
    };





    enterKotlinFile = (ctx: KotlinFileContext): void => {
        logContent("Entering Kotlin file for parsing");
        ctx.children?.forEach(child => {
            // Handle top-level elements here as needed
        });
        logContent("Completed parsing Kotlin file.");
    };
    getParsedFunctions() {
        return parsedFunctions;
    }
    exitFunctionDeclaration = (ctx: FunctionDeclarationContext): void => {
        logContent("Exiting function declaration");

        const functionName = ctx.simpleIdentifier()?.getText() || "anonymous";
        const parameters: { name: string; type: string }[] = [];
        const functionParamsCtx = ctx.functionValueParameters();

        if (functionParamsCtx) {
            // Retrieve each parameter by index if needed
            for (let i = 0; i < functionParamsCtx.getChildCount(); i++) {
                const paramCtx = functionParamsCtx.getTypedRuleContext(FunctionValueParameterContext, i) as FunctionValueParameterContext;

                if (paramCtx) {
                    const parameterCtx = paramCtx.parameter() as ParameterContext;
                    const name = parameterCtx?.simpleIdentifier()?.getText() || "param";
                    const type = parameterCtx?.type_()?.getText() || "Any";
                    parameters.push({ name, type });
                }
            }
        }

        const returnType = ctx.type_()?.getText() || "Unit";

        // Store the function typing information for IntelliSense or auto-completion
        parsedFunctions.set(functionName, { returnType, parameters });

        logContent(`Stored function: ${functionName} with return type ${returnType} and parameters:`, parameters);
    };
}
