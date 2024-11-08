const { Token, TokenType } = require('./tokentype');

class Tokenizer {
    constructor(input) {
        this.input = input;
        this.currentPosition = 0;
        this.currentLine = 1;
        this.currentColumn = 1;
    }
    tokenize() {
        const tokens = [];
        while (this.currentPosition < this.input.length) {
            const char = this.input[this.currentPosition];
            if (/\s/.test(char)) {
                this.consumeWhitespace();
            } else if (/[a-zA-Z_]/.test(char)) {
                tokens.push(this.consumeIdentifierOrKeyword());
            } else if (/[0-9]/.test(char)) {
                tokens.push(this.consumeNumberLiteral());
            } else if (char === '"' || char === "'") {
                tokens.push(this.consumeStringLiteral(char));
            } else if (this.isOperator(char)) {
                tokens.push(this.consumeOperator());
            } else if (char === '.') {
                tokens.push(new Token(TokenType.PERIOD, '.', this.currentLine, this.currentColumn));
                this.advancePosition();
            } else if (this.isSeparator(char)) {
                tokens.push(this.consumeSeparator());
            } else {
                this.advancePosition();
            }
        }
        tokens.push(new Token(TokenType.EOF, "", this.currentLine, this.currentColumn));
        return tokens;
    }


    consumeWhitespace() {
        while (/\s/.test(this.peek())) {
            this.advancePosition();
        }
    }

    consumeIdentifierOrKeyword() {
        let startColumn = this.currentColumn;
        let value = '';
        while (/[a-zA-Z_0-9]/.test(this.peek())) {
            value += this.input[this.currentPosition];
            this.advancePosition();
        }
        const type = this.isKeyword(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        return new Token(type, value, this.currentLine, startColumn);
    }

    consumeNumberLiteral() {
        let startColumn = this.currentColumn;
        let value = '';
        while (/[0-9.]/.test(this.peek())) {
            value += this.input[this.currentPosition];
            this.advancePosition();
        }
        return new Token(TokenType.NUMBER_LITERAL, value, this.currentLine, startColumn);
    }

    consumeStringLiteral(quoteType) {
        let startColumn = this.currentColumn;
        let value = quoteType;
        this.advancePosition();
        while (this.peek() !== quoteType) {
            value += this.input[this.currentPosition];
            this.advancePosition();
        }
        value += quoteType;
        this.advancePosition();
        return new Token(TokenType.STRING_LITERAL, value, this.currentLine, startColumn);
    }

    consumeOperator() {
        let startColumn = this.currentColumn;
        let value = this.input[this.currentPosition];
        this.advancePosition();
        return new Token(TokenType.OPERATOR, value, this.currentLine, startColumn);
    }

    consumeSeparator() {
        let startColumn = this.currentColumn;
        let value = this.input[this.currentPosition];
        this.advancePosition();
        return new Token(TokenType.SEPARATOR, value, this.currentLine, startColumn);
    }

    advancePosition() {
        this.currentPosition++;
        this.currentColumn++;
        if (this.input[this.currentPosition - 1] === '\n') {
            this.currentLine++;
            this.currentColumn = 1;
        }
    }

    peek() {
        return this.input[this.currentPosition];
    }

    isKeyword(value) {
        const keywords = ['fun', 'val', 'var', 'if', 'else', 'return', 'import'];
        return keywords.includes(value);
    }

    isOperator(char) {
        const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>='];
        return operators.includes(char);
    }

    isSeparator(char) {
        const separators = ['(', ')', '{', '}', ',', ';'];
        return separators.includes(char);
    }
}

module.exports = Tokenizer;
