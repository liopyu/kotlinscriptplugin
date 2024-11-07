const { FunctionNode, VariableNode, CallExpressionNode, ImportNode } = require('./ast');
const { TokenType } = require('./tokentype');

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
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

        return new VariableNode(name, value); // Return correct node with name and value
    }

    parseFunction() {
        this.advance(); // Skip 'fun'
        const nameToken = this.advance();
        const name = nameToken ? nameToken.value : ""; // Function name safely

        this.advance(); // Skip '('

        const params = [];
        while (this.peek() && this.peek().value !== ')') {
            const paramToken = this.advance();
            if (paramToken && paramToken.type === TokenType.IDENTIFIER) {
                params.push(paramToken.value); // Add valid identifier params only
            }
        }
        this.advance(); // Skip ')'
        this.advance(); // Skip '{'

        const body = [];
        while (this.peek() && this.peek().value !== '}') {
            const statement = this.parseStatement();
            if (statement) {
                body.push(statement); // Add parsed statement to function body
            } else {
                this.advance(); // Skip any undefined or unrecognized token
            }
        }
        this.advance(); // Skip '}'

        return new FunctionNode(name, params, body);
    }

    parseStatement() {
        const token = this.peek();
        if (token && token.type === TokenType.IDENTIFIER) {
            // Call parseCallExpression if we detect a function call like 'println'
            return this.parseCallExpression();
        }
        return null; // Return null if no valid statement is found
    }

    parseCallExpression() {
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

        return new CallExpressionNode(callee, args);
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

        return new ImportNode(importPath.trim());
    }



}

module.exports = Parser;
