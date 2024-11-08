

const { FunctionNode, VariableNode, CallExpressionNode, ImportNode, IdentifierNode } = require('./ast');
const { TokenType, Token } = require('./tokentype');
const Scope = require('./scope');
class Parser {
    constructor(tokens, tokenizer) {
        this.tokens = tokens;
        this.current = 0;
        this.tokenizer = tokenizer;
        this.scopes = new Array();
        this.globalScope = new Scope();
        this.currentScope = this.globalScope
        this.scopes.push(this.currentScope)
    }

    /**
     * @returns {Array<Scope>}
     */
    getScopes() { return this.scopes; }
    /**
     * @argument {Scope} scope
     * @returns {Map<String,IdentifierNode>}
     */
    getVariables(scope) {
        return scope.variables
    }
    enterScope() {
        const newScope = new Scope(this.currentScope);
        this.scopes.push(newScope);
        this.currentScope = newScope;
    }

    exitScope() {
        this.currentScope = this.currentScope.parent;
    }
    parse() {
        const nodes = [];
        while (this.current < this.tokens.length && this.peek() !== undefined) {
            const token = this.peek();
            if (token.type === TokenType.KEYWORD) {
                switch (token.value) {
                    case 'fun':
                        nodes.push(this.parseFunction());
                        break;
                    case 'val':
                    case 'var':
                        nodes.push(this.parseVariableDeclaration());
                        break;
                    case 'import':
                        nodes.push(this.parseImportStatement());
                        break;
                    default:
                        this.current++;
                        break;
                }
            } else if (token.value === '{') {
                this.advance();
                this.enterScope();
                nodes.push(...this.parse());
                this.exitScope();
                this.advance();
            } else if (token.value === '}') {
                break;
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
        return null;
    }

    parseVariableDeclaration() {
        const kind = this.advance().value;
        const nameToken = this.advance();
        const name = nameToken ? nameToken.value : "";

        this.advance();
        const valueToken = this.advance();
        const value = valueToken ? valueToken.value : "";
        const node = new VariableNode(name, value);

        this.currentScope.declareVariable(name, node);
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
        this.advance();
        const nameToken = this.advance();
        const name = nameToken ? nameToken.value : "";

        this.advance();

        const params = [];
        this.enterScope()
        while (this.peek() && this.peek().value !== ')') {
            const paramToken = this.advance();
            if (paramToken && paramToken.type === TokenType.IDENTIFIER) {
                params.push(paramToken.value);

            }
        }
        this.advance();

        let body = [];
        let subtype = "Fun0";
        let returnType = "kotlin.Unit";

        if (this.peek() && this.peek().value === '=') {

            this.advance();
            const expression = this.parseExpression();
            const flatName = expression.value
            body.push(flatName);
            subtype = "Fun0";
            returnType = this.getReturnType(expression, flatName);
        } else if (this.peek() && this.peek().value === '{') {
            this.advance();
            while (this.peek() && this.peek().value !== '}') {
                const statement = this.parseStatement();
                if (statement) {

                    if (statement.type === TokenType.KEYWORD && statement.value === "return") {

                        this.advance();


                        if (this.peek() && !/\s/.test(this.peek().value)) {
                            returnType = "/* Placeholder: parse return expression */";
                        }
                    }
                    body.push(statement);
                } else {
                    this.advance();
                }
            }

            this.advance();
            subtype = "Fun1";
        }

        this.exitScope();
        return new FunctionNode(name, params, body, subtype, returnType);
    }
    getReturnType(expression, flatName) {
        if (this.isReturnableVariable(expression) && this.currentScope.lookupVariable(flatName)) {
            const variable = this.currentScope.lookupVariable(flatName);
            return variable.clazz;
        } else if (expression.type == TokenType.NUMBER_LITERAL) {
            return "kotlin.Number";
        } else if (expression.type == TokenType.STRING_LITERAL) {
            return "kotlin.String";
        }
        return "kotlin.Unit";
    }



    parseStatement() {
        const token = this.peek();

        if (!token) return null;

        switch (token.type) {
            case TokenType.KEYWORD:
                if (token.value === 'val' || token.value === 'var') {
                    return this.parseVariableDeclaration();
                }
                if (token.value === 'return') {
                    return token;
                }
                break;
            case TokenType.IDENTIFIER:
                return this.parseIdentifierOrCall();
            case TokenType.STRING_LITERAL:
            case TokenType.NUMBER_LITERAL:
                return this.parseLiteral();
            default:
                return null;
        }
    }


    parseLiteral() {
        const token = this.advance();
        return { type: "Literal", value: token.value };
    }

    parseIdentifierOrCall() {
        const token = this.advance();
        const name = token.value;

        if (this.peek() && this.peek().value === '(') {
            return this.parseCallExpression(name);
        }
        if (this.getVariables(this.currentScope).has(name)) {
            return this.getVariables(this.currentScope).get(name);
        } else
            return new IdentifierNode(name, null, "kotlin.Unit")
    }

    parseCallExpression(identifier) {
        const callee = identifier;

        this.advance();

        const args = [];
        while (this.peek() && this.peek().value !== ')') {
            const argToken = this.advance();
            if (argToken) {
                args.push(argToken.value);
            }
        }
        this.advance();

        return new CallExpressionNode(callee, args, identifier);
    }


    parseImportStatement() {
        this.advance();

        let importPath = '';
        let expectingIdentifier = true;

        while (this.peek()) {
            const token = this.peek();

            if (expectingIdentifier && token.type === TokenType.IDENTIFIER) {
                importPath += this.advance().value;
                expectingIdentifier = false;
            } else if (!expectingIdentifier && token.value === '.') {
                importPath += this.advance().value;
                expectingIdentifier = true;
            } else {
                break;
            }
        }
        const node = new ImportNode(importPath.trim());
        // TODO: Add error handling for duplicate imports
        this.getVariables(this.globalScope).set(node.getClassName(), node);
        return node
    }



}

module.exports = Parser;
