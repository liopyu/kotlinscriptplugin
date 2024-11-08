class Scope {
    constructor(parent = null) {
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
        this.variables = new Map();
        this.functions = new Map();
    }

    declareVariable(name, value) {
        this.variables.set(name, value);
    }

    declareFunction(name, func) {
        this.functions.set(name, func);
    }
    lookupVariable(name) {
        return this.variables.get(name) || (this.parent && this.parent.lookupVariable(name));
    }
    lookupFunction(name) {
        return this.functions.get(name) || (this.parent && this.parent.lookupFunction(name));
    }

    getDepth() {
        return this.depth;
    }
}

module.exports = Scope;
