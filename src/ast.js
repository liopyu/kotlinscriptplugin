import Scope from "./scope";
export class ASTNode {
    constructor(type = "Any") {
        this.type = type;
    }
    setType(type) {
        this.type = type;
    }
}
export class Scopable extends ASTNode {
    constructor(type, scope) {
        super(type);
        this.scope = scope;
    }
    setScope(scope) {
        this.scope = scope;
    }
}
export class ExpressionNode extends Scopable {
    constructor(type = "Expression", scope) {
        super(type, scope);
    }
}

export class ReturnNode extends Scopable {
    /**
     * 
     * @param {ExpressionNode} node 
     * @param {Scope} scope 
     */
    constructor(node = new ExpressionNode(), scope) {
        super("ReturnStatement", scope);
        this.node = node;
    }
    setNode(node) {
        this.node = node;
    }
}

export class LiteralNode extends ExpressionNode {
    constructor(type = "Literal", value, scope) {
        super(type, scope);
        this.value = value;
    }
    setValue(value) {
        this.value = value;
    }
}
export class StringLiteralNode extends LiteralNode {
    constructor(value, scope) {
        super("StringLiteral", value, scope);
    }
}
export class NumberLiteralNode extends LiteralNode {
    constructor(value, scope) {
        super("NumberLiteral", value, scope);
    }
}
export class BlockNode extends ExpressionNode {
    constructor(statements, scope, blockType = "kotlin.Standard") {
        super("Block", scope)
        this.statements = statements;
        this.blockType = blockType;
    }
    setStatements(statements) {
        this.statements = statements;
    }
}
export class FunctionNode extends ExpressionNode {
    constructor(name, params, body, subtype, returnType = "kotlin.Unit", expectedReturn = "kotlin.Unit", blockNodes = new Array, scope) {
        super("Function", scope);
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


export class VariableNode extends ExpressionNode {
    constructor(name, value, scope, type = "VariableDeclaration") {
        super(type, scope);
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
export class IdentifierNode extends VariableNode {
    constructor(value, clazz, name, scope) {
        super(name, value, scope, "Identifier");
        this.clazz = clazz;
    }
    setClazz(clazz) {
        this.clazz = clazz;
    }
}

export class OperatorNode extends ASTNode {
    constructor(operator) {
        super("Operator");
        this.operator = operator;
    }
}

export class CallExpressionNode extends ASTNode {
    constructor(callee, args, value) {
        super("CallExpression");
        this.callee = callee;
        this.args = args;
        this.value = value;
    }
}

export class ImportNode extends IdentifierNode {
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
