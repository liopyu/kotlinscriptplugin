class ASTNode {
    constructor(type) {
        this.type = type;
    }
    setType(type) {
        this.type = type;
    }
}

class FunctionNode extends ASTNode {
    constructor(name, params, body, subtype, returnType = "kotlin.Unit") {
        super("Function");
        this.name = name;
        this.params = params;
        this.body = body;
        this.subtype = subtype;
        this.returnType = returnType;
    }
}


class VariableNode extends ASTNode {
    constructor(name, value) {
        super("VariableDeclaration");
        this.name = name;
        this.value = value;
    }
}
class IdentifierNode extends VariableNode {
    constructor(name, value, clazz) {
        super(name, value);
        this.clazz = clazz;
        this.setType("Identifier")
    }
}

class OperatorNode extends ASTNode {
    constructor(operator) {
        super("Operator");
        this.operator = operator;
    }
}

class CallExpressionNode extends ASTNode {
    constructor(callee, args, value) {
        super("CallExpression");
        this.callee = callee;
        this.args = args;
        this.value = value;
    }
}

class ImportNode extends ASTNode {
    constructor(path) {
        super("ImportStatement");
        this.path = path;
    }
    getClassName() {
        const parts = this.path.split('.');
        return parts[parts.length - 1];
    }
}


module.exports = { ASTNode, FunctionNode, VariableNode, CallExpressionNode, ImportNode, IdentifierNode };