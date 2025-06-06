/*
 * MIT License
 *
 * Copyright (c) 2019 fwcd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Using an adapted version of https://kotlinlang.org/docs/reference/grammar.html

const PREC = {
  POSTFIX: 16,
  PREFIX: 15,
  TYPE_RHS: 14,
  AS: 13,
  MULTIPLICATIVE: 12,
  ADDITIVE: 11,
  RANGE: 10,
  INFIX: 9,
  ELVIS: 8,
  CHECK: 7,
  COMPARISON: 6,
  EQUALITY: 5,
  CONJUNCTION: 4,
  DISJUNCTION: 3,
  VAR_DECL: 3,
  SPREAD: 2,
  SIMPLE_USER_TYPE: 2,
  ASSIGNMENT: 1,
  BLOCK: 1,
  ARGUMENTS: 1,
  LAMBDA_LITERAL: 0,
  RETURN_OR_THROW: 0,
  COMMENT: 0
};
const DEC_DIGITS = token(sep1(/[0-9]+/, /_+/));
const HEX_DIGITS = token(sep1(/[0-9a-fA-F]+/, /_+/));
const BIN_DIGITS = token(sep1(/[01]/, /_+/));
const REAL_EXPONENT = token(seq(/[eE]/, optional(/[+-]/), DEC_DIGITS));

module.exports = grammar({
  name: "kotlin",

  conflicts: $ => [
    // Ambiguous when used in an explicit delegation expression,
    // since the '{' could either be interpreted as the class body
    // or as the anonymous function body. Consider the following sequence:
    [$._annotated_delegation_specifier, $._type_modifier],
    // Member access operator '::' conflicts with callable reference
    [$._primary_expression, $.callable_reference],

    // @Type(... could either be an annotation constructor invocation or an annotated expression
    [$.constructor_invocation, $._unescaped_annotation],

    // "expect" as a plaform modifier conflicts with expect as an identifier
    [$.platform_modifier, $.simple_identifier],
    // "data", "inner" as class modifier or id
    [$.class_modifier, $.simple_identifier],

    // "<x>.<y> = z assignment conflicts with <x>.<y>() function call"
    [$._postfix_unary_expression, $._expression],

    // ambiguity between generics and comparison operations (foo < b > c)
    [$.call_expression, $.range_expression, $.comparison_expression],
    [$.call_expression, $.elvis_expression, $.comparison_expression],
    [$.call_expression, $.check_expression, $.comparison_expression],
    [$.call_expression, $.additive_expression, $.comparison_expression],
    [$.call_expression, $.infix_expression, $.comparison_expression],
    [$.call_expression, $.multiplicative_expression, $.comparison_expression],
    [$.type_arguments, $._comparison_operator],

    // ambiguity between prefix expressions and annotations before functions
    [$._statement, $.prefix_expression],
    [$._statement, $.prefix_expression, $.modifiers],
    [$.prefix_expression, $.when_subject],
    [$.prefix_expression, $.value_argument],

    // ambiguity between multiple user types and class property/function declarations
    [$.user_type],
    [$.user_type, $.anonymous_function],
    //[$.user_type, $.function_type],

    // ambiguity between annotated_lambda with modifiers and modifiers from var declarations
    [$.annotated_lambda, $.modifiers],

    // ambiguity between simple identifier 'set/get' with actual setter/getter functions.
    [$.setter, $.simple_identifier],
    [$.getter, $.simple_identifier],

    // ambiguity between parameter modifiers in anonymous functions
    [$.parameter_modifiers, $._type_modifier],

    // ambiguity between type modifiers before an @
    [$.type_modifiers],
    // ambiguity between associating type modifiers
    [$.not_nullable_type],

    [$.receiver_type],
    [$.receiver_type, $._type],
  ],

  externals: $ => [
    $._automatic_semicolon,
    $._import_list_delimiter,
    $.safe_nav,
    $.multiline_comment,
    $._string_start,
    $._string_end,
    $.string_content,
  ],

  extras: $ => [
    $.line_comment,
    $.multiline_comment,
    /\s+/ // Whitespace
  ],

  word: $ => $._alpha_identifier,

  rules: {
    // ====================
    // Syntax grammar
    // ====================

    // ==========
    // General
    // ==========

    // start
    source_file: $ => seq(
      optional($.shebang_line),
      repeat($.file_annotation),
      optional($.package_header),
      repeat($.import_list),
      repeat(seq($._statement, $._semi))
    ),

    shebang_line: $ => seq("#!", /[^\r\n]*/),

    file_annotation: $ => seq(
      "@", "file", ":",
      choice(
        seq("[", repeat1($._unescaped_annotation), "]"),
        $._unescaped_annotation
      ),
      $._semi
    ),

    package_header: $ => seq("package", $.identifier, $._semi),

    import_list: $ => seq(
      repeat1($.import_header),
      $._import_list_delimiter
    ),

    import_header: $ => seq(
      "import",
      alias($._import_identifier, $.identifier),
      optional(choice(seq(".", $.wildcard_import), $.import_alias)),
      $._semi
    ),

    wildcard_import: _ => token.immediate("*"),

    import_alias: $ => seq("as", alias($.simple_identifier, $.type_identifier)),

    top_level_object: $ => seq($._declaration, optional($._semi)),

    type_alias: $ => seq(
      optional($.modifiers),
      "typealias",
      alias($.simple_identifier, $.type_identifier),
      optional($.type_parameters),
      "=",
      $._type
    ),

    _declaration: $ => choice(
      $.class_declaration,
      $.object_declaration,
      $.function_declaration,
      $.property_declaration,
      // TODO: it would be better to have getter/setter only in
      // property_declaration but it's difficult to get ASI
      // (Automatic Semicolon Insertion) working in the lexer for
      // getter/setter. Indeed, they can also have modifiers in
      // front, which means it's not enough to lookahead for 'get' or 'set' in
      // the lexer, you also need to handle modifier keywords. It is thus
      // simpler to accept them here.
      $.getter,
      $.setter,
      $.type_alias
    ),

    // ==========
    // Classes
    // ==========

    class_declaration: $ => prec.right(choice(
      seq(
        optional($.modifiers),
        choice("class", "interface"),
        alias($.simple_identifier, $.type_identifier),
        optional($.type_parameters),
        optional($.primary_constructor),
        optional(seq(":", $._delegation_specifiers)),
        optional($.type_constraints),
        optional($.class_body)
      ),
      seq(
        optional($.modifiers),
        "enum", "class",
        alias($.simple_identifier, $.type_identifier),
        optional($.type_parameters),
        optional($.primary_constructor),
        optional(seq(":", $._delegation_specifiers)),
        optional($.type_constraints),
        optional($.enum_class_body)
      )
    )),

    primary_constructor: $ => seq(
      optional(seq(optional($.modifiers), "constructor")),
      $._class_parameters
    ),

    class_body: $ => seq("{", optional($._class_member_declarations), "}"),

    _class_parameters: $ => seq(
      "(",
      optional(sep1($.class_parameter, ",")),
      optional(","),
      ")"
    ),

    binding_pattern_kind: $ => choice("val", "var"),

    class_parameter: $ => seq(
      optional($.modifiers),
      optional($.binding_pattern_kind),
      $.simple_identifier,
      ":",
      $._type,
      optional(seq("=", $._expression))
    ),

    _delegation_specifiers: $ => prec.left(sep1(
      choice(
        $.delegation_specifier,
        prec(1, $._annotated_delegation_specifier) // Ensure priority
      ),
      ","
    )),

    delegation_specifier: $ => prec.left(choice(
      $.constructor_invocation,
      $.explicit_delegation,
      $.user_type,
      $.function_type
    )),

    constructor_invocation: $ => seq($.user_type, $.value_arguments),

    _annotated_delegation_specifier: $ => prec(2, seq( // Higher precedence than `_type_modifier`
      repeat1($.annotation),
      $.delegation_specifier
    )),

    explicit_delegation: $ => seq(
      choice(
        $.user_type,
        $.function_type
      ),
      "by",
      $._expression
    ),

    type_parameters: $ => seq("<", sep1($.type_parameter, ","), ">"),

    type_parameter: $ => seq(
      optional($.type_parameter_modifiers),
      alias($.simple_identifier, $.type_identifier),
      optional(seq(":", $._type))
    ),

    type_constraints: $ => prec.right(seq("where", sep1($.type_constraint, ","))),

    type_constraint: $ => seq(
      repeat($.annotation),
      alias($.simple_identifier, $.type_identifier),
      ":",
      $._type
    ),

    // ==========
    // Class members
    // ==========

    _class_member_declarations: $ => repeat1(seq($._class_member_declaration, $._semi)),

    _class_member_declaration: $ => choice(
      $._declaration,
      $.companion_object,
      $.anonymous_initializer,
      $.secondary_constructor
    ),

    anonymous_initializer: $ => seq("init", alias($._block, "block")),

    companion_object: $ => seq(
      optional($.modifiers),
      "companion",
      "object",
      optional(alias($.simple_identifier, $.type_identifier)),
      optional(seq(":", $._delegation_specifiers)),
      optional($.class_body)
    ),

    function_value_parameters: $ => seq(
      "(",
      optional(sep1($._function_value_parameter, ",")),
      optional(","),
      ")"
    ),

    _function_value_parameter: $ => seq(
      optional($.parameter_modifiers),
      $.parameter,
      optional(seq("=", $._expression))
    ),

    receiver_type: $ => seq(
      optional($.type_modifiers),
      choice(
        $.parenthesized_type,
        $.nullable_type,
        $._type_reference,
      )
    ),

    function_declaration: $ => prec.right(seq( // TODO
      optional($.modifiers),
      "fun",
      optional($.type_parameters),
      optional(seq(field("receiver", $.receiver_type), optional('.'))),
      $.simple_identifier,
      $.function_value_parameters,
      optional(seq(":", $._type)),
      optional($.type_constraints),
      optional($.function_body)
    )),

    function_body: $ => choice(alias($._block, "block"), seq("=", $._expression)),

    variable_declaration: $ => prec.left(PREC.VAR_DECL, seq(
      // repeat($.annotation), TODO
      $.simple_identifier,
      optional(seq(":", $._type))
    )),

    property_declaration: $ => prec.right(seq(
      optional($.modifiers),
      $.binding_pattern_kind,
      optional($.type_parameters),
      optional(seq(field("receiver", $.receiver_type), optional('.'))),
      choice($.variable_declaration, $.multi_variable_declaration),
      optional($.type_constraints),
      optional(choice(
        seq("=", $._expression),
        $.property_delegate
      )),
      optional(';'),
      choice(
        // TODO: Getter-setter combinations
        optional($.getter),
        optional($.setter)
      )
    )),

    property_delegate: $ => seq("by", $._expression),

    getter: $ => prec.right(seq(
      optional($.modifiers),
      "get",
      optional(seq(
        "(", ")",
        optional(seq(":", $._type)),
        $.function_body
      ))
    )),

    setter: $ => prec.right(seq(
      optional($.modifiers),
      "set",
      optional(seq(
        "(",
        $.parameter_with_optional_type,
        ")",
        optional(seq(":", $._type)),
        $.function_body
      ))
    )),

    parameters_with_optional_type: $ => seq("(", sep1($.parameter_with_optional_type, ","), ")"),

    parameter_with_optional_type: $ => seq(
      optional($.parameter_modifiers),
      $.simple_identifier,
      optional(seq(":", $._type))
    ),

    parameter: $ => seq($.simple_identifier, ":", $._type),
    object_declaration: $ => prec.right(PREC.ASSIGNMENT, seq(
      optional($.modifiers),
      "object",
      optional(alias($.simple_identifier, $.type_identifier)), // Optional type identifier
      optional(seq(
        ":",
        $._delegation_specifiers // Handle delegation specifiers
      )),
      optional($.class_body) // Optional class body
    )),


    secondary_constructor: $ => seq(
      optional($.modifiers),
      "constructor",
      $.function_value_parameters,
      optional(seq(":", $.constructor_delegation_call)),
      optional(alias($._block, "block"))
    ),

    constructor_delegation_call: $ => seq(choice("this", "super"), $.value_arguments),

    // ==========
    // Enum classes
    // ==========

    enum_class_body: $ => seq(
      "{",
      optional($._enum_entries),
      optional(seq(";", optional($._class_member_declarations))),
      "}"
    ),

    _enum_entries: $ => seq(sep1($.enum_entry, ","), optional(",")),

    enum_entry: $ => seq(
      optional($.modifiers),
      $.simple_identifier,
      optional($.value_arguments),
      optional($.class_body)
    ),

    // ==========
    // Types
    // ==========

    _type: $ => seq(
      optional($.type_modifiers),
      choice(
        $.function_type,
        $.parenthesized_type,
        $.nullable_type,
        $._type_reference,
        $.not_nullable_type
      )
    ),

    _type_reference: $ => prec.left(1, choice(
      $.user_type,
      "dynamic"
    )),

    not_nullable_type: $ => seq(
      optional($.type_modifiers),
      choice($.user_type, $.parenthesized_user_type),
      '&',
      optional($.type_modifiers),
      choice($.user_type, $.parenthesized_user_type),
    ),

    nullable_type: $ => seq(
      choice($._type_reference, $.parenthesized_type),
      repeat1($._quest)
    ),

    _quest: $ => "?",

    // TODO: Figure out a better solution than right associativity
    //       to prevent nested types from being recognized as
    //       unary expresions with navigation suffixes.

    user_type: $ => sep1($._simple_user_type, "."),

    _simple_user_type: $ => prec.right(PREC.SIMPLE_USER_TYPE, seq(
      alias($.simple_identifier, $.type_identifier),
      optional($.type_arguments)
    )),

    type_projection: $ => choice(
      seq(optional($.type_projection_modifiers), $._type),
      token("*")
    ),


    type_projection_modifiers: $ => repeat1($._type_projection_modifier),

    _type_projection_modifier: $ => $.variance_modifier,

    function_type: $ => seq(
      optional(seq(field("receiver", $.receiver_type), token("."))),
      $.function_type_parameters,
      "->",
      $._type
    ),

    // A higher-than-default precedence resolves the ambiguity with 'parenthesized_type'
    function_type_parameters: $ => prec.left(1, seq(
      "(",
      optional(sep1(choice($.parameter, $._type), ",")),
      ")"
    )),

    parenthesized_type: $ => seq("(", $._type, ")"),

    parenthesized_user_type: $ => seq(
      "(",
      choice($.user_type, $.parenthesized_user_type),
      ")"
    ),

    // ==========
    // Statements
    // ==========

    statements: $ => seq(
      $._statement,
      repeat(seq($._semi, $._statement)),
      optional($._semi),
    ),

    _statement: $ => choice(
      $._declaration,
      seq(
        repeat(choice($.label, $.annotation)),
        choice(
          $.assignment,
          $._loop_statement,
          $._expression
        )
      )
    ),

    label: $ => token(seq(
      /[a-zA-Z_][a-zA-Z_0-9]*/,
      "@"
    )),

    control_structure_body: $ => choice(alias($._block, "block"), $._statement),

    _block: $ => prec(PREC.BLOCK, seq("{", optional($.statements), "}")),

    _loop_statement: $ => choice(
      $.for_statement,
      $.while_statement,
      $.do_while_statement
    ),

    for_statement: $ => prec.right(seq(
      "for",
      "(",
      repeat($.annotation),
      choice($.variable_declaration, $.multi_variable_declaration),
      "in",
      $._expression,
      ")",
      optional($.control_structure_body)
    )),

    while_statement: $ => seq(
      "while",
      "(",
      $._expression,
      ")",
      choice(";", $.control_structure_body)
    ),

    do_while_statement: $ => prec.right(seq(
      "do",
      optional($.control_structure_body),
      "while",
      "(",
      $._expression,
      ")",
    )),

    // See also https://github.com/tree-sitter/tree-sitter/issues/160
    // generic EOF/newline token
    _semi: $ => $._automatic_semicolon,

    assignment: $ => choice(
      prec.left(PREC.ASSIGNMENT, seq($.directly_assignable_expression, $._assignment_and_operator, $._expression)),
      prec.left(PREC.ASSIGNMENT, seq($.directly_assignable_expression, "=", $._expression)),
      // TODO
    ),

    // ==========
    // Expressions
    // ==========

    _expression: $ => choice(
      $._unary_expression,
      $._binary_expression,
      $._primary_expression
    ),

    // Unary expressions

    _unary_expression: $ => choice(
      $.postfix_expression,
      $.indexing_expression,
      $.navigation_expression,
      $.prefix_expression,
      $.as_expression,
      $.spread_expression
    ),

    postfix_expression: $ => prec.left(PREC.POSTFIX, seq($._expression, $._postfix_unary_operator)),

    call_expression: $ => prec.left(PREC.POSTFIX, seq($._expression, $.call_suffix)),

    indexing_expression: $ => prec.left(PREC.POSTFIX, seq($._expression, $.indexing_suffix)),

    navigation_expression: $ => prec.left(PREC.POSTFIX, seq(
      $._expression,
      optional($.type_arguments),
      $.navigation_suffix
    )),


    prefix_expression: $ => prec.right(seq(choice($.annotation, $.label, $._prefix_unary_operator), $._expression)),

    as_expression: $ => prec.left(PREC.AS, seq($._expression, $._as_operator, $._type)),

    spread_expression: $ => prec.left(PREC.SPREAD, seq("*", $._expression)),

    // Binary expressions

    _binary_expression: $ => choice(
      $.multiplicative_expression,
      $.additive_expression,
      $.range_expression,
      $.infix_expression,
      $.elvis_expression,
      $.check_expression,
      $.comparison_expression,
      $.equality_expression,
      $.comparison_expression,
      $.equality_expression,
      $.conjunction_expression,
      $.disjunction_expression
    ),

    multiplicative_expression: $ => prec.left(PREC.MULTIPLICATIVE, seq($._expression, $._multiplicative_operator, $._expression)),

    additive_expression: $ => prec.left(PREC.ADDITIVE, seq($._expression, $._additive_operator, $._expression)),

    range_expression: $ => prec.left(PREC.RANGE, seq($._expression, "..", $._expression)),

    infix_expression: $ => prec.left(PREC.INFIX, seq($._expression, $.simple_identifier, $._expression)),

    elvis_expression: $ => prec.left(PREC.ELVIS, seq($._expression, "?:", $._expression)),

    check_expression: $ => prec.left(PREC.CHECK, seq($._expression, choice(
      seq($._in_operator, $._expression),
      seq($._is_operator, $._type)))),

    comparison_expression: $ => prec.left(PREC.COMPARISON, seq($._expression, $._comparison_operator, $._expression)),

    equality_expression: $ => prec.left(PREC.EQUALITY, seq($._expression, $._equality_operator, $._expression)),

    conjunction_expression: $ => prec.left(PREC.CONJUNCTION, seq($._expression, "&&", $._expression)),

    disjunction_expression: $ => prec.left(PREC.DISJUNCTION, seq($._expression, "||", $._expression)),

    // Suffixes

    indexing_suffix: $ => seq("[", sep1($._expression, ","), "]"),

    navigation_suffix: $ => seq(
      $._member_access_operator,
      choice(
        $.simple_identifier,
        $.parenthesized_expression,
        "class"
      )
    ),

    call_suffix: $ => prec.left(seq(
      optional(seq(
        token.immediate("<"),
        sep1($.type_projection, ","),
        token.immediate(">")
      )),
      choice(
        prec(PREC.ARGUMENTS, seq(optional($.value_arguments), $.annotated_lambda)),
        $.value_arguments
      )
    )),


    annotated_lambda: $ => seq(
      repeat($.annotation),
      optional($.label),
      $.lambda_literal
    ),

    type_arguments: $ => seq(
      token.immediate("<"),
      sep1($.type_projection, token.immediate(",")),
      token.immediate(">")
    ),


    value_arguments: $ => seq(
      "(",
      optional(
        seq(
          sep1($.value_argument, ","),
          optional(","),
        )
      ),
      ")"
    ),

    value_argument: $ => seq(
      optional($.annotation),
      optional(seq($.simple_identifier, "=")),
      optional("*"),
      $._expression
    ),

    _primary_expression: $ => choice(
      $.parenthesized_expression,
      $.simple_identifier,
      $._literal_constant,
      $.string_literal,
      $.callable_reference,
      $.call_expression,
      $._function_literal,
      $.object_literal,
      $.collection_literal,
      $.this_expression,
      $.super_expression,
      $.if_expression,
      $.when_expression,
      $.try_expression,
      $.jump_expression
    ),

    parenthesized_expression: $ => seq("(", $._expression, ")"),

    // https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-collectionLiteral
    collection_literal: $ => seq(
      "[",
      $._expression,
      repeat(seq(",", $._expression)),
      optional(","),
      "]"),

    _literal_constant: $ => choice(
      $.boolean_literal,
      $.integer_literal,
      $.hex_literal,
      $.bin_literal,
      $.character_literal,
      $.real_literal,
      $.null_literal,
      $.long_literal,
      $.unsigned_literal
    ),

    string_literal: $ => seq(
      $._string_start,
      repeat(choice($.string_content, $._interpolation)),
      $._string_end,
    ),

    line_string_expression: $ => seq("${", $._expression, "}"),

    _interpolation: $ => choice(
      seq("${", alias($._expression, $.interpolated_expression), "}"),
      seq("$", alias($.simple_identifier, $.interpolated_identifier))
    ),

    /* lambda_literal: $ => prec(PREC.LAMBDA_LITERAL, seq(
      "{",
      optional(seq(optional($.lambda_parameters), "->")),
      optional($.statements),
      "}"
    )), */
    lambda_literal: $ => prec(PREC.LAMBDA_LITERAL,
      alias($._lambda_block, $.block)
    ),

    _lambda_block: $ => seq(
      "{",
      optional(seq(optional($.lambda_parameters), "->")),
      optional($.statements),
      "}"
    ),


    multi_variable_declaration: $ => seq(
      '(',
      sep1($.variable_declaration, ','),
      ')'
    ),

    lambda_parameters: $ => sep1($._lambda_parameter, ","),

    _lambda_parameter: $ => choice(
      $.variable_declaration,
      $.multi_variable_declaration
    ),

    anonymous_function: $ => prec.right(seq(
      "fun",
      optional(seq(sep1($._simple_user_type, "."), ".")), // TODO
      $.function_value_parameters,
      optional(seq(":", $._type)),
      optional($.function_body)
    )),

    _function_literal: $ => choice(
      $.lambda_literal,
      $.anonymous_function
    ),

    object_literal: $ => prec.right(PREC.POSTFIX, seq(
      "object",
      optional(seq(":", $._delegation_specifiers)),
      optional($.class_body)
    )),



    this_expression: $ => choice(
      "this",
      $._this_at
    ),

    super_expression: $ => prec.right(choice(
      "super",
      seq("super", "<", $._type, ">"),
      $._super_at
    )),

    if_expression: $ => prec.right(seq(
      "if",
      "(", field('condition', $._expression), ")",
      choice(
        field('consequence', $.control_structure_body),
        seq(
          optional(field('consequence', $.control_structure_body)),
          optional(";"),
          "else",
          choice(field('alternative', $.control_structure_body), ";")
        ),
        ";"
      )
    )),

    when_subject: $ => seq(
      "(",
      optional(seq(
        repeat($.annotation),
        "val",
        $.variable_declaration,
        "="
      )),
      $._expression,
      ")",
    ),

    /*  when_expression: $ => seq(
       "when",
       optional($.when_subject),
       alias(seq("{", repeat($.when_entry), "}"), $.block)
     ), */
    when_expression: $ => seq(
      "when",
      optional($.when_subject),
      alias($._when_block, $.block)
    ),

    _when_block: $ => seq(
      "{",
      repeat($.when_entry),
      "}"
    ),


    when_entry: $ => seq(
      choice(
        seq($.when_condition, repeat(seq(",", $.when_condition))),
        "else"
      ),
      "->",
      $.control_structure_body,
      optional($._semi)
    ),

    when_condition: $ => choice(
      $._expression,
      $.range_test,
      $.type_test
    ),

    range_test: $ => seq($._in_operator, $._expression),

    type_test: $ => seq($._is_operator, $._type),

    try_expression: $ => seq(
      "try",
      alias($._block, "block"),
      choice(
        seq(repeat1($.catch_block), optional($.finally_block)),
        $.finally_block
      )
    ),

    catch_block: $ => seq(
      "catch",
      "(",
      repeat($.annotation),
      $.simple_identifier,
      ":",
      $._type,
      ")",
      alias($._block, "block"),
    ),

    finally_block: $ => seq("finally", alias($._block, "block")),

    jump_expression: $ => choice(
      prec.right(PREC.RETURN_OR_THROW, seq("throw", $._expression)),
      prec.right(PREC.RETURN_OR_THROW, seq(choice("return", $._return_at), optional($._expression))),
      "continue",
      $._continue_at,
      "break",
      $._break_at
    ),

    callable_reference: $ => seq(
      optional(alias($.simple_identifier, $.type_identifier)), // TODO
      "::",
      choice($.simple_identifier, "class")
    ),

    _assignment_and_operator: $ => choice("+=", "-=", "*=", "/=", "%="),

    _equality_operator: $ => choice("!=", "!==", "==", "==="),

    _comparison_operator: $ => choice("<", ">", "<=", ">="),

    _in_operator: $ => choice("in", "!in"),

    _is_operator: $ => choice("is", "!is"),

    _additive_operator: $ => choice("+", "-"),

    _multiplicative_operator: $ => choice("*", "/", "%"),

    _as_operator: $ => choice("as", "as?"),

    _prefix_unary_operator: $ => choice("++", "--", "-", "+", "!"),

    _postfix_unary_operator: $ => choice("++", "--", "!!"),

    _member_access_operator: $ => choice(".", "::", alias($.safe_nav, '?.')),

    _indexing_suffix: $ => seq(
      '[',
      $._expression,
      repeat(seq(',', $._expression)),
      optional(','),
      ']'
    ),

    _postfix_unary_suffix: $ => choice(
      $._postfix_unary_operator,
      $.navigation_suffix,
      $.indexing_suffix
    ),

    _postfix_unary_expression: $ => seq($._primary_expression, repeat($._postfix_unary_suffix)),

    directly_assignable_expression: $ => prec(
      PREC.ASSIGNMENT,
      choice(
        $._postfix_unary_expression,
        $.simple_identifier
        // TODO
      )
    ),

    // ==========
    // Modifiers
    // ==========

    modifiers: $ => prec.left(repeat1(choice($.annotation, $._modifier))),

    parameter_modifiers: $ => repeat1(choice($.annotation, $.parameter_modifier)),

    _modifier: $ => choice(
      $.class_modifier,
      $.member_modifier,
      $.visibility_modifier,
      $.function_modifier,
      $.property_modifier,
      $.inheritance_modifier,
      $.parameter_modifier,
      $.platform_modifier
    ),

    type_modifiers: $ => repeat1($._type_modifier),

    _type_modifier: $ => choice($.annotation, "suspend"),

    class_modifier: $ => choice(
      "sealed",
      "annotation",
      "data",
      "inner",
      "value",
    ),

    member_modifier: $ => choice(
      "override",
      "lateinit"
    ),

    visibility_modifier: $ => choice(
      "public",
      "private",
      "internal",
      "protected"
    ),

    variance_modifier: $ => choice(
      "in",
      "out"
    ),

    type_parameter_modifiers: $ => repeat1($._type_parameter_modifier),

    _type_parameter_modifier: $ => choice(
      $.reification_modifier,
      $.variance_modifier,
      $.annotation
    ),

    function_modifier: $ => choice(
      "tailrec",
      "operator",
      "infix",
      "inline",
      "external",
      "suspend"
    ),

    property_modifier: $ => "const",

    inheritance_modifier: $ => choice(
      "abstract",
      "final",
      "open"
    ),

    parameter_modifier: $ => choice(
      "vararg",
      "noinline",
      "crossinline"
    ),

    reification_modifier: $ => "reified",

    platform_modifier: $ => choice(
      "expect",
      "actual"
    ),

    // ==========
    // Annotations
    // ==========

    annotation: $ => choice(
      $._single_annotation,
      $._multi_annotation
    ),

    _single_annotation: $ => seq(
      "@",
      optional($.use_site_target),
      $._unescaped_annotation
    ),

    _multi_annotation: $ => seq(
      "@",
      optional($.use_site_target),
      "[",
      repeat1($._unescaped_annotation),
      "]"
    ),

    use_site_target: $ => seq(
      choice("field", "property", "get", "set", "receiver", "param", "setparam", "delegate"),
      ":"
    ),

    _unescaped_annotation: $ => choice(
      $.constructor_invocation,
      $.user_type
    ),

    // ==========
    // Identifiers
    // ==========

    simple_identifier: $ => choice(
      $._lexical_identifier,
      "expect",
      "data",
      "inner",
      "value",
      "actual",
      "set",
      "get"
      // TODO: More soft keywords
    ),

    identifier: $ => sep1($.simple_identifier, "."),

    // Adapted from tree-sitter-java, helps to avoid a conflic with
    // wildcard_import node while being compatible with identifier
    _import_identifier: $ => choice(
      $.simple_identifier,
      seq($._import_identifier, ".", $.simple_identifier),
    ),

    // ====================
    // Lexical grammar
    // ====================


    // ==========
    // General
    // ==========

    line_comment: $ => token(seq('//', /.*/)),

    // ==========
    // Separators and operations
    // ==========


    // ==========
    // Keywords
    // ==========

    _return_at: $ => seq(
      "return@",
      alias($._lexical_identifier, $.label)
    ),

    _continue_at: $ => seq(
      "continue@",
      alias($._lexical_identifier, $.label)
    ),

    _break_at: $ => seq(
      "break@",
      alias($._lexical_identifier, $.label)
    ),

    _this_at: $ => seq(
      "this@",
      alias($._lexical_identifier, $.type_identifier)
    ),

    _super_at: $ => choice(
      seq(
        "super@",
        alias($._lexical_identifier, $.type_identifier)
      ),
      seq(
        "super",
        "<", $._type, ">",
        token.immediate("@"),
        alias($._lexical_identifier, $.type_identifier)
      )
    ),

    // ==========
    // Literals
    // ==========

    real_literal: $ => token(choice(
      seq(
        choice(
          seq(DEC_DIGITS, REAL_EXPONENT),
          seq(optional(DEC_DIGITS), ".", DEC_DIGITS, optional(REAL_EXPONENT))
        ),
        optional(/[fF]/)
      ),
      seq(DEC_DIGITS, /[fF]/)
    )),

    integer_literal: $ => token(seq(optional(/[1-9]/), DEC_DIGITS)),

    hex_literal: $ => token(seq("0", /[xX]/, HEX_DIGITS)),

    bin_literal: $ => token(seq("0", /[bB]/, BIN_DIGITS)),

    unsigned_literal: $ => seq(
      choice($.integer_literal, $.hex_literal, $.bin_literal),
      /[uU]L?/
    ),

    long_literal: $ => seq(
      choice($.integer_literal, $.hex_literal, $.bin_literal),
      "L"
    ),

    boolean_literal: $ => choice("true", "false"),

    character_literal: $ => seq(
      "'",
      choice($.character_escape_seq, /[^\n\r'\\]/),
      "'"
    ),

    character_escape_seq: $ => choice(
      $._uni_character_literal,
      $._escaped_identifier
    ),

    null_literal: $ => "null",

    // ==========
    // Identifiers
    // ==========

    _lexical_identifier: $ => choice(
      $._alpha_identifier,
      $._backtick_identifier,
    ),

    _alpha_identifier: $ => /[\p{L}_][\p{L}_\p{Nd}]*/,

    _backtick_identifier: $ => /`[^\r\n`]+`/,

    _uni_character_literal: $ => seq(
      "\\u",
      /[0-9a-fA-F]{4}/
    ),

    _escaped_identifier: $ => /\\[tbrn'"\\$]/,

  }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}