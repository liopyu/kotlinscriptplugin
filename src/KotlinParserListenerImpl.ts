import KotlinParserListener from "../generated/KotlinParserListener";
import { NavigationSuffixContext, ValueArgumentContext, ConstructorInvocationContext, KotlinFileContext, FunctionDeclarationContext, FunctionValueParameterContext, ParameterContext, ClassDeclarationContext, SimpleIdentifierContext } from "../generated/KotlinParser";
import { ParseTreeListener, ParserRuleContext } from "antlr4";
export const parsedFunctions = new Map<string, { returnType: string, parameters: { name: string, type: string }[] }>();
export const parsedClasses = new Map<string, { properties: { name: string, type: string }[], methods: { name: string, returnType: string, parameters: { name: string, type: string }[] }[] }>();
export const importedClassesUsage = new Map<string, string[]>();
export const instantiatedClasses = new Map<string, { arguments: { name: string; value: string }[] }>();
export default class KotlinParserListenerImpl extends KotlinParserListener {
    enterEveryRule(ctx: ParserRuleContext): void {
        const startToken = ctx.start;
        const stopToken = ctx.stop;
        /* 
                console.log(`Entering rule: ${ctx.constructor.name}`);
        
                if (startToken) {
                    console.log(`Start Token: Text = ${startToken.text}, Type = ${startToken.type}, Position = ${startToken.line}:${startToken.column}`);
                }
        
                if (stopToken) {
                    console.log(`Stop Token: Text = ${stopToken.text}, Type = ${stopToken.type}, Position = ${stopToken.line}:${stopToken.column}`);
                } */
    }
    exitSimpleIdentifier = (ctx: SimpleIdentifierContext): void => {
        const identifier = ctx.Identifier();
        //console.log(`Found simple identifier: ${identifier}`);
    }
    exitEveryRule(ctx: ParserRuleContext): void {
        const startToken = ctx.start;
        const stopToken = ctx.stop;
        //if (ctx.constructor.name == "SimpleIdentifierContext") {
        console.log(`Exiting rule: ${ctx.constructor.name}`);

        if (startToken) {
            console.log(`Start Token: Text = ${startToken.text}, Type = ${startToken.type}, Position = ${startToken.line}:${startToken.column}`);
        }

        if (stopToken) {
            console.log(`Stop Token: Text = ${stopToken.text}, Type = ${stopToken.type}, Position = ${stopToken.line}:${stopToken.column}`);
        }
        // }
    }
    enterNavigationSuffix = (ctx: NavigationSuffixContext): void => {
        const identifier = ctx.simpleIdentifier()?.getText();
        if (identifier) {
            console.log(`Navigating to member of: ${identifier}`);

            // Check if `identifier` matches an imported class, like `Minecraft`
            if (importedClassesUsage.has(identifier)) {
                console.log(`Member navigation detected for imported class: ${identifier}`);
                // You can then populate potential completions based on known members of `Minecraft` or other imported classes
            }
        }
    };

    exitNavigationSuffix = (ctx: NavigationSuffixContext): void => {
        console.log("Exiting NavigationSuffix");
        // Additional processing, if needed, once navigation is complete
    };
    exitConstructorInvocation = (ctx: ConstructorInvocationContext): void => {
        console.log("Entering exitConstructorInvocation");

        const className = ctx.userType()?.getText() || "UnknownClass";
        const argumentsList: { name: string; value: string }[] = [];

        const valueArgsCtx = ctx.valueArguments();
        if (valueArgsCtx) {
            console.log(`Processing ${valueArgsCtx.getChildCount()} arguments for class ${className}`);

            for (let i = 0; i < valueArgsCtx.getChildCount(); i++) {
                const argCtx = valueArgsCtx.getTypedRuleContext(ValueArgumentContext, i);
                if (argCtx) {
                    const argValue = argCtx.expression()?.getText() || "value";
                    console.log(`Argument ${i + 1}: ${argValue}`);
                    argumentsList.push({ name: `arg${i + 1}`, value: argValue });
                }
            }
        } else {
            console.log(`No arguments found for class ${className}`);
        }

        instantiatedClasses.set(className, { arguments: argumentsList });
        console.log(`Instantiated class stored: ${className} with arguments:`, argumentsList);
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
        console.log(`Stored class: ${className} with properties and methods:`, { properties, methods });
    };





    enterKotlinFile = (ctx: KotlinFileContext): void => {
        console.log("Entering Kotlin file for parsing");
        ctx.children?.forEach(child => {
            // Handle top-level elements here as needed
        });
        console.log("Completed parsing Kotlin file.");
    };
    getParsedFunctions() {
        return parsedFunctions;
    }
    exitFunctionDeclaration = (ctx: FunctionDeclarationContext): void => {
        console.log("Exiting function declaration");

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

        console.log(`Stored function: ${functionName} with return type ${returnType} and parameters:`, parameters);
    };
}
