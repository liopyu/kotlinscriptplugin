

const { FunctionNode, VariableNode, CallExpressionNode, ImportNode, IdentifierNode } = require('./ast');
const { TokenType, Token } = require('./tokentype');
class Parser {
    constructor(tokens, tokenizer) {
        this.tokens = tokens;
        this.current = 0;
        this.variables = new Map();
        this.tokenizer = tokenizer;
    }
    /**
     * 
     * @returns {Map<String,IdentifierNode>}
     */
    getVariables() {
        return this.variables
    }
    parse() {
        const nodes = [];
        while (this.current < this.tokens.length && this.peek() !== undefined) {
            const token = this.peek();
            if (token.type === TokenType.KEYWORD) {
                if (token.value === 'fun') {
                    nodes.push(this.parseFunction());
                } else if (token.value === 'val' || token.value === 'var') {
                    nodes.push(this.parseVariableDeclaration());
                } else if (token.value === 'import') {
                    nodes.push(this.parseImportStatement());
                }
            } else {
                this.current++;
            }
        }
        return nodes;
    }

    /**
     * 
     * @returns {Token}
     */
    peek() {
        return this.tokens[this.current];
    }

    advance() {
        if (this.current < this.tokens.length) {
            return this.tokens[this.current++];
        }
        return null; // Return null if there are no more tokens
    }

    parseVariableDeclaration() {
        const kind = this.advance().value; // 'val' or 'var'
        const nameToken = this.advance();
        const name = nameToken ? nameToken.value : ""; // Get variable name

        this.advance(); // Skip '='
        const valueToken = this.advance();
        const value = valueToken ? valueToken.value : ""; // Get the assigned value
        const node = new VariableNode(name, value);
        //TODO: Add error handling for duplicate variables
        this.variables.set(name, node);
        return node
    }
    isReturnableVariable(token) {
        if (token == null) return true
        if (token.type === TokenType.IDENTIFIER || token.type === TokenType.NUMBER_LITERAL || token.type === TokenType.STRING_LITERAL) {
            return true;
        }
        return false;
    }
    /**
     * 
     * @returns {Token}
     */
    parseExpression() {
        const token = this.advance();
        if (token && this.isReturnableVariable(token)) {
            return token;
        }
        return null;
    }

    parseFunction() {
        this.advance(); // Skip 'fun' keyword
        const nameToken = this.advance();
        const name = nameToken ? nameToken.value : ""; // Get function name

        this.advance(); // Skip '('

        const params = [];
        while (this.peek() && this.peek().value !== ')') {
            const paramToken = this.advance();
            if (paramToken && paramToken.type === TokenType.IDENTIFIER) {
                params.push(paramToken.value); // Add valid identifier params only
            }
        }
        this.advance(); // Skip ')'

        let body = [];
        let subtype = "Fun0"; // Default to Fun0 (single-expression function)
        let returnType = "kotlin.Unit"; // Default returnType to kotlin.Unit

        if (this.peek() && this.peek().value === '=') {
            // Single-expression function
            this.advance(); // Skip '='
            const expression = this.parseExpression();
            const flatName = expression.value
            body.push(flatName);
            subtype = "Fun0";
            if (this.isReturnableVariable(expression) && this.getVariables().has(flatName)) {
                let variable = this.getVariables().get(flatName)
                returnType = variable.type
            } else if (expression.type == TokenType.NUMBER_LITERAL) {
                returnType = "kotlin.Number";
            } else if (expression.type == TokenType.STRING_LITERAL) {
                returnType = "kotlin.String";
            }
        } else if (this.peek() && this.peek().value === '{') {
            this.advance();

            while (this.peek() && this.peek().value !== '}') {
                const statement = this.parseStatement();
                if (statement) {
                    // Check if it's a return statement
                    if (statement.type === TokenType.KEYWORD && statement.value === "return") {
                        // Move past 'return'
                        this.advance();

                        // Check if there's a value after 'return'
                        if (this.peek() && !/\s/.test(this.peek().value)) {
                            returnType = "/* Placeholder: parse return expression */"; // Placeholder
                        }
                    }
                    body.push(statement);
                } else {
                    this.advance(); // Skip any undefined or unrecognized token
                }
            }
            this.advance(); // Skip '}'
            subtype = "Fun1"; // Indicate block function
        }

        return new FunctionNode(name, params, body, subtype, returnType);
    }




    parseStatement() {
        const token = this.peek();

        if (!token) return null;

        switch (token.type) {
            case TokenType.NUMBER_LITERAL:
            case TokenType.STRING_LITERAL:
                return this.parseLiteral(); // Parse as a literal
            case TokenType.IDENTIFIER:
                return this.parseIdentifierOrCall(); // Parse as an identifier or function call
            default:
                return null; // Return null if no valid statement is found
        }
    }
    parseLiteral() {
        const token = this.advance();
        return { type: "Literal", value: token.value };
    }

    parseIdentifierOrCall() {
        const token = this.advance(); // Get the identifier token
        const name = token.value;

        if (this.peek() && this.peek().value === '(') {
            return this.parseCallExpression(name); // Parse as a function call
        }
        if (this.variables.has(name)) {
            return this.variables.get(name); // Return the variable node if it exists
        } else
            return new IdentifierNode(name, null, "kotlin.Unit")
    }

    parseCallExpression(identifier) {
        const calleeToken = this.advance(); // Advance past the function name (e.g., 'println')
        const callee = calleeToken ? calleeToken.value : ""; // Use the callee token's value

        this.advance(); // Skip '('

        const args = [];
        while (this.peek() && this.peek().value !== ')') {
            const argToken = this.advance();
            if (argToken) {
                args.push(argToken.value); // Collect argument values
            }
        }
        this.advance(); // Skip ')'

        return new CallExpressionNode(callee, args, identifier);
    }

    parseImportStatement() {
        this.advance(); // Skip the 'import' keyword

        let importPath = '';
        let expectingIdentifier = true; // Start by expecting an identifier

        // Collect parts of the import path, e.g., "net.minecraft.client.Minecraft"
        while (this.peek()) {
            const token = this.peek();

            if (expectingIdentifier && token.type === TokenType.IDENTIFIER) {
                importPath += this.advance().value;
                expectingIdentifier = false; // After an identifier, expect a dot if there's more
            } else if (!expectingIdentifier && token.value === '.') {
                importPath += this.advance().value;
                expectingIdentifier = true; // After a dot, expect another identifier
            } else {
                break; // End of the import statement if pattern doesn't match
            }
        }
        const node = new ImportNode(importPath.trim());
        // TODO: Add error handling for duplicate imports and only grab the class name
        this.variables.set(node.path, node);
        return node
    }



}

module.exports = Parser;
