import * as vscode from 'vscode';
import Parser from 'web-tree-sitter';
export class VariableSymbol {
    name: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;
    childNodes: Parser.SyntaxNode[];

    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode) {
        this.name = name;
        this.range = range;
        this.node = node;
        this.childNodes = node.children;
    }
}
export class ImportSymbol {
    name: string;
    range: vscode.Range;
    node: Parser.SyntaxNode;

    constructor(name: string, range: vscode.Range, node: Parser.SyntaxNode) {
        this.name = name;
        this.range = range;
        this.node = node;
    }
}
