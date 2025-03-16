import * as vscode from 'vscode';
import { CustomData } from './interface';
import { TypingSuggestion } from './symbols';
export const t = true
export const TOKEN_TYPES = [
    "type",
    "function",
    "variable",
    "number",
    'parameter',
    "string",
    "comment",
    "operator",
    "keyword",
    "property",
    "regexp",
    "label",
    "macro",
    "method",
    "event",
    "decorator",
    "enumMember",
    "typeParameter",
    "interface",
    "struct",
    "namespace",
    "enum",
    "class"
]
export const TOKEN_MODIFIERS: string[] = [];
export const LEGEND = new vscode.SemanticTokensLegend(TOKEN_TYPES, TOKEN_MODIFIERS);
export const expressionTypes: string[] = [
    "postfix_expression",
    "call_expression",
    "indexing_expression",
    "navigation_expression",
    "prefix_expression",
    "as_expression",
    "spread_expression",
    "multiplicative_expression",
    "additive_expression",
    "range_expression",
    "infix_expression",
    "elvis_expression",
    "check_expression",
    "comparison_expression",
    "equality_expression",
    "comparison_expression",
    "equality_expression",
    "conjunction_expression",
    "disjunction_expression",
    "parenthesized_expression",
    "simple_identifier",
    "expression",
    "property_delegate",
    "literal_export constant",
    "boolean_literal",
    "integer_literal",
    "hex_literal",
    "bin_literal",
    "character_literal",
    "real_literal",
    "null_literal",
    "long_literal",
    "unsigned_literal",
    "string_literal",
    "callable_reference",
    "function_literal",
    "object_literal",
    "collection_literal",
    "this_expression",
    "super_expression",
    "if_expression",
    "when_expression",
    "try_expression",
    "jump_expression",
    "lambda_literal",
    "anonymous_function"
];
export const variableDeclarationTypes = [
    "multi_variable_declaration",
    "variable_declaration"
]
export const blockParents = [
    "anonymous_initializer",
    "secondary_constructor",
    "control_structure_body",
    "try_expression",
    "catch_block",
    "finally_block",
    "when_expression",
    "lambda_literal",
];
export const blocks = [
    "annotated_lambda",
    "lambda_literal",
    "function_body",
    "control_structure_body",
    "class_body",
    "enum_class_body",
    "block",
    /* "catch_block",
    "finally_block", */
]
export const standinReserved = [
    "_", "__", "...", "___",
]
export const reservedCharacters = [
    "_", "__", "...", "___",
    "abstract", "as", "break", "class", "continue",
    "do", "else", "false", "for", "fun",
    "if", "in", "interface",
    "is", "null", "object",
    "package",
    "return", "super", "this", "throw", "true", "try",
    "typealias", "val", "var", "when", "while"
]
export const documentData = new Map<string, CustomData>();
export const semanticTokensEnabled = true