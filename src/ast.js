class ASTNode {
    constructor(type) {
        this.type = type;
    }
    setType(type) {
        this.type = type;
    }
}
class LiteralNode extends ASTNode {
    constructor(value) {
        super("Literal");
        this.value = value;
    }
    setValue(value) {
        this.value = value;
    }
}
class StringLiteralNode extends LiteralNode {
    constructor(value) {
        super("StringLiteral");
        this.setValue(value)
    }
}
class NumberLiteralNode extends LiteralNode {
    constructor(value) {
        super("NumberLiteral");
        this.setValue(value)
    }
}
class BlockNode extends ASTNode {
    constructor(statements, scope, blockType = "kotlin.Standard") {
        super("Block")
        this.statements = statements;
        this.scope = scope;
        this.blockType = blockType;
    }
    setStatement(statement) {
        this.statement = statement;
    }
}
class FunctionNode extends ASTNode {
    constructor(name, params, body, subtype, returnType = "kotlin.Unit", expectedReturn = "kotlin.Unit", blockNodes = []) {
        super("Function");
        this.name = name;
        this.params = params;
        this.body = body;
        this.subtype = subtype;
        this.returnType = returnType;
        this.expectedReturn = expectedReturn;
        this.blockNodes = blockNodes;
    }
    /**
     * 
     * @param {BlockNode} blockNode 
     * @returns {FunctionNode}
     */
    addBlockNode(blockNode) {
        this.blockNodes.push(blockNode);
        return this
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


module.exports = {
    ASTNode,
    FunctionNode,
    VariableNode,
    CallExpressionNode,
    ImportNode,
    IdentifierNode,
    LiteralNode,
    BlockNode,
    OperatorNode,
    StringLiteralNode,
    NumberLiteralNode
};