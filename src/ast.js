class ASTNode {
    constructor(type) {
        this.type = type;
    }
}

class FunctionNode extends ASTNode {
    constructor(name, params, body) {
        super("Function");
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

class VariableNode extends ASTNode {
    constructor(name, value) {
        super("VariableDeclaration");
        this.name = name;
        this.value = value;
    }
}


class OperatorNode extends ASTNode {
    constructor(operator) {
        super("Operator");
        this.operator = operator;
    }
}

class CallExpressionNode extends ASTNode {
    constructor(callee, args) {
        super("CallExpression");
        this.callee = callee;
        this.args = args;
    }
}

class ImportNode extends ASTNode {
    constructor(path) {
        super("ImportStatement");
        this.path = path;
    }
}

module.exports = { ASTNode, FunctionNode, VariableNode, CallExpressionNode, ImportNode };