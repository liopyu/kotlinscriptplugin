const TokenType = {
    KEYWORD: "KEYWORD",
    IDENTIFIER: "IDENTIFIER",
    OPERATOR: "OPERATOR",
    LITERAL: "LITERAL",
    SEPARATOR: "SEPARATOR",
    COMMENT: "COMMENT",
    STRING_LITERAL: "STRING_LITERAL",
    NUMBER_LITERAL: "NUMBER_LITERAL",
    WHITESPACE: "WHITESPACE",
    PERIOD: "PERIOD",
    EOF: "EOF"
};

class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

module.exports = { TokenType, Token };
