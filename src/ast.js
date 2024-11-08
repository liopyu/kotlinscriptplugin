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
    setName(name) {
        this.name = name;
    }
    setValue(value) {
        this.value = value;
    }
}
class IdentifierNode extends VariableNode {
    constructor(name, value, clazz) {
        super(name, value);
        this.clazz = clazz;
        this.setType("Identifier")
    }
    setClazz(clazz) {
        this.clazz = clazz;
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

class ImportNode extends IdentifierNode {
    constructor(path) {
        super("ImportStatement");
        this.setClazz(path)
        this.setName(this.getClassName())
        this.setValue(this.clazz)
        this.setType("ImportStatement")
    }
    getClassName() {
        const parts = this.clazz.split('.');
        return parts[parts.length - 1];
    }
}


module.exports = { ASTNode, FunctionNode, VariableNode, CallExpressionNode, ImportNode, IdentifierNode };