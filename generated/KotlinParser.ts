// Generated from ./src/grammar/KotlinParser.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import KotlinParserListener from "./KotlinParserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class KotlinParser extends Parser {
	public static readonly ShebangLine = 1;
	public static readonly DelimitedComment = 2;
	public static readonly LineComment = 3;
	public static readonly WS = 4;
	public static readonly NL = 5;
	public static readonly RESERVED = 6;
	public static readonly DOT = 7;
	public static readonly COMMA = 8;
	public static readonly LPAREN = 9;
	public static readonly RPAREN = 10;
	public static readonly LSQUARE = 11;
	public static readonly RSQUARE = 12;
	public static readonly LCURL = 13;
	public static readonly RCURL = 14;
	public static readonly MULT = 15;
	public static readonly MOD = 16;
	public static readonly DIV = 17;
	public static readonly ADD = 18;
	public static readonly SUB = 19;
	public static readonly INCR = 20;
	public static readonly DECR = 21;
	public static readonly CONJ = 22;
	public static readonly DISJ = 23;
	public static readonly EXCL_WS = 24;
	public static readonly EXCL_NO_WS = 25;
	public static readonly COLON = 26;
	public static readonly SEMICOLON = 27;
	public static readonly ASSIGNMENT = 28;
	public static readonly ADD_ASSIGNMENT = 29;
	public static readonly SUB_ASSIGNMENT = 30;
	public static readonly MULT_ASSIGNMENT = 31;
	public static readonly DIV_ASSIGNMENT = 32;
	public static readonly MOD_ASSIGNMENT = 33;
	public static readonly ARROW = 34;
	public static readonly DOUBLE_ARROW = 35;
	public static readonly RANGE = 36;
	public static readonly RANGE_UNTIL = 37;
	public static readonly COLONCOLON = 38;
	public static readonly DOUBLE_SEMICOLON = 39;
	public static readonly HASH = 40;
	public static readonly AT_NO_WS = 41;
	public static readonly AT_POST_WS = 42;
	public static readonly AT_PRE_WS = 43;
	public static readonly AT_BOTH_WS = 44;
	public static readonly QUEST_WS = 45;
	public static readonly QUEST_NO_WS = 46;
	public static readonly LANGLE = 47;
	public static readonly RANGLE = 48;
	public static readonly LE = 49;
	public static readonly GE = 50;
	public static readonly EXCL_EQ = 51;
	public static readonly EXCL_EQEQ = 52;
	public static readonly AS_SAFE = 53;
	public static readonly EQEQ = 54;
	public static readonly EQEQEQ = 55;
	public static readonly SINGLE_QUOTE = 56;
	public static readonly AMP = 57;
	public static readonly RETURN_AT = 58;
	public static readonly CONTINUE_AT = 59;
	public static readonly BREAK_AT = 60;
	public static readonly THIS_AT = 61;
	public static readonly SUPER_AT = 62;
	public static readonly FILE = 63;
	public static readonly FIELD = 64;
	public static readonly PROPERTY = 65;
	public static readonly GET = 66;
	public static readonly SET = 67;
	public static readonly RECEIVER = 68;
	public static readonly PARAM = 69;
	public static readonly SETPARAM = 70;
	public static readonly DELEGATE = 71;
	public static readonly PACKAGE = 72;
	public static readonly IMPORT = 73;
	public static readonly CLASS = 74;
	public static readonly INTERFACE = 75;
	public static readonly FUN = 76;
	public static readonly OBJECT = 77;
	public static readonly VAL = 78;
	public static readonly VAR = 79;
	public static readonly TYPE_ALIAS = 80;
	public static readonly CONSTRUCTOR = 81;
	public static readonly BY = 82;
	public static readonly COMPANION = 83;
	public static readonly INIT = 84;
	public static readonly THIS = 85;
	public static readonly SUPER = 86;
	public static readonly TYPEOF = 87;
	public static readonly WHERE = 88;
	public static readonly IF = 89;
	public static readonly ELSE = 90;
	public static readonly WHEN = 91;
	public static readonly TRY = 92;
	public static readonly CATCH = 93;
	public static readonly FINALLY = 94;
	public static readonly FOR = 95;
	public static readonly DO = 96;
	public static readonly WHILE = 97;
	public static readonly THROW = 98;
	public static readonly RETURN = 99;
	public static readonly CONTINUE = 100;
	public static readonly BREAK = 101;
	public static readonly AS = 102;
	public static readonly IS = 103;
	public static readonly IN = 104;
	public static readonly NOT_IS = 105;
	public static readonly NOT_IN = 106;
	public static readonly OUT = 107;
	public static readonly DYNAMIC = 108;
	public static readonly PUBLIC = 109;
	public static readonly PRIVATE = 110;
	public static readonly PROTECTED = 111;
	public static readonly INTERNAL = 112;
	public static readonly ENUM = 113;
	public static readonly SEALED = 114;
	public static readonly ANNOTATION = 115;
	public static readonly DATA = 116;
	public static readonly INNER = 117;
	public static readonly VALUE = 118;
	public static readonly TAILREC = 119;
	public static readonly OPERATOR = 120;
	public static readonly INLINE = 121;
	public static readonly INFIX = 122;
	public static readonly EXTERNAL = 123;
	public static readonly SUSPEND = 124;
	public static readonly OVERRIDE = 125;
	public static readonly ABSTRACT = 126;
	public static readonly FINAL = 127;
	public static readonly OPEN = 128;
	public static readonly CONST = 129;
	public static readonly LATEINIT = 130;
	public static readonly VARARG = 131;
	public static readonly NOINLINE = 132;
	public static readonly CROSSINLINE = 133;
	public static readonly REIFIED = 134;
	public static readonly EXPECT = 135;
	public static readonly ACTUAL = 136;
	public static readonly RealLiteral = 137;
	public static readonly FloatLiteral = 138;
	public static readonly DoubleLiteral = 139;
	public static readonly IntegerLiteral = 140;
	public static readonly HexLiteral = 141;
	public static readonly BinLiteral = 142;
	public static readonly UnsignedLiteral = 143;
	public static readonly LongLiteral = 144;
	public static readonly BooleanLiteral = 145;
	public static readonly NullLiteral = 146;
	public static readonly CharacterLiteral = 147;
	public static readonly Identifier = 148;
	public static readonly IdentifierOrSoftKey = 149;
	public static readonly FieldIdentifier = 150;
	public static readonly QUOTE_OPEN = 151;
	public static readonly TRIPLE_QUOTE_OPEN = 152;
	public static readonly UNICODE_CLASS_LL = 153;
	public static readonly UNICODE_CLASS_LM = 154;
	public static readonly UNICODE_CLASS_LO = 155;
	public static readonly UNICODE_CLASS_LT = 156;
	public static readonly UNICODE_CLASS_LU = 157;
	public static readonly UNICODE_CLASS_ND = 158;
	public static readonly UNICODE_CLASS_NL = 159;
	public static readonly QUOTE_CLOSE = 160;
	public static readonly LineStrRef = 161;
	public static readonly LineStrText = 162;
	public static readonly LineStrEscapedChar = 163;
	public static readonly LineStrExprStart = 164;
	public static readonly TRIPLE_QUOTE_CLOSE = 165;
	public static readonly MultiLineStringQuote = 166;
	public static readonly MultiLineStrRef = 167;
	public static readonly MultiLineStrText = 168;
	public static readonly MultiLineStrExprStart = 169;
	public static readonly Inside_Comment = 170;
	public static readonly Inside_WS = 171;
	public static readonly Inside_NL = 172;
	public static readonly ErrorCharacter = 173;
	public static readonly AnyType = 174;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_kotlinFile = 0;
	public static readonly RULE_script = 1;
	public static readonly RULE_typeCheckExpression = 2;
	public static readonly RULE_topLevelJumpExpression = 3;
	public static readonly RULE_topLevelExpression = 4;
	public static readonly RULE_shebangLine = 5;
	public static readonly RULE_fileAnnotation = 6;
	public static readonly RULE_packageHeader = 7;
	public static readonly RULE_importList = 8;
	public static readonly RULE_importHeader = 9;
	public static readonly RULE_importAlias = 10;
	public static readonly RULE_topLevelObject = 11;
	public static readonly RULE_typeAlias = 12;
	public static readonly RULE_declaration = 13;
	public static readonly RULE_classDeclaration = 14;
	public static readonly RULE_primaryConstructor = 15;
	public static readonly RULE_classBody = 16;
	public static readonly RULE_classParameters = 17;
	public static readonly RULE_classParameter = 18;
	public static readonly RULE_delegationSpecifiers = 19;
	public static readonly RULE_delegationSpecifier = 20;
	public static readonly RULE_constructorInvocation = 21;
	public static readonly RULE_annotatedDelegationSpecifier = 22;
	public static readonly RULE_explicitDelegation = 23;
	public static readonly RULE_typeParameters = 24;
	public static readonly RULE_typeParameter = 25;
	public static readonly RULE_typeConstraints = 26;
	public static readonly RULE_typeConstraint = 27;
	public static readonly RULE_classMemberDeclarations = 28;
	public static readonly RULE_classMemberDeclaration = 29;
	public static readonly RULE_anonymousInitializer = 30;
	public static readonly RULE_companionObject = 31;
	public static readonly RULE_functionValueParameters = 32;
	public static readonly RULE_functionValueParameter = 33;
	public static readonly RULE_functionDeclaration = 34;
	public static readonly RULE_functionBody = 35;
	public static readonly RULE_variableDeclaration = 36;
	public static readonly RULE_multiVariableDeclaration = 37;
	public static readonly RULE_propertyDeclaration = 38;
	public static readonly RULE_propertyDelegate = 39;
	public static readonly RULE_getter = 40;
	public static readonly RULE_setter = 41;
	public static readonly RULE_parametersWithOptionalType = 42;
	public static readonly RULE_functionValueParameterWithOptionalType = 43;
	public static readonly RULE_parameterWithOptionalType = 44;
	public static readonly RULE_parameter = 45;
	public static readonly RULE_objectDeclaration = 46;
	public static readonly RULE_secondaryConstructor = 47;
	public static readonly RULE_constructorDelegationCall = 48;
	public static readonly RULE_enumClassBody = 49;
	public static readonly RULE_enumEntries = 50;
	public static readonly RULE_enumEntry = 51;
	public static readonly RULE_type = 52;
	public static readonly RULE_typeReference = 53;
	public static readonly RULE_nullableType = 54;
	public static readonly RULE_quest = 55;
	public static readonly RULE_userType = 56;
	public static readonly RULE_simpleUserType = 57;
	public static readonly RULE_typeProjection = 58;
	public static readonly RULE_typeProjectionModifiers = 59;
	public static readonly RULE_typeProjectionModifier = 60;
	public static readonly RULE_functionType = 61;
	public static readonly RULE_functionTypeParameters = 62;
	public static readonly RULE_parenthesizedType = 63;
	public static readonly RULE_receiverType = 64;
	public static readonly RULE_parenthesizedUserType = 65;
	public static readonly RULE_definitelyNonNullableType = 66;
	public static readonly RULE_statements = 67;
	public static readonly RULE_statement = 68;
	public static readonly RULE_label = 69;
	public static readonly RULE_controlStructureBody = 70;
	public static readonly RULE_block = 71;
	public static readonly RULE_loopStatement = 72;
	public static readonly RULE_forStatement = 73;
	public static readonly RULE_whileStatement = 74;
	public static readonly RULE_doWhileStatement = 75;
	public static readonly RULE_assignment = 76;
	public static readonly RULE_semi = 77;
	public static readonly RULE_semis = 78;
	public static readonly RULE_expression = 79;
	public static readonly RULE_disjunction = 80;
	public static readonly RULE_conjunction = 81;
	public static readonly RULE_equality = 82;
	public static readonly RULE_comparison = 83;
	public static readonly RULE_genericCallLikeComparison = 84;
	public static readonly RULE_infixOperation = 85;
	public static readonly RULE_elvisExpression = 86;
	public static readonly RULE_elvis = 87;
	public static readonly RULE_infixFunctionCall = 88;
	public static readonly RULE_rangeExpression = 89;
	public static readonly RULE_additiveExpression = 90;
	public static readonly RULE_multiplicativeExpression = 91;
	public static readonly RULE_asExpression = 92;
	public static readonly RULE_prefixUnaryExpression = 93;
	public static readonly RULE_unaryPrefix = 94;
	public static readonly RULE_postfixUnaryExpression = 95;
	public static readonly RULE_postfixUnarySuffix = 96;
	public static readonly RULE_directlyAssignableExpression = 97;
	public static readonly RULE_parenthesizedDirectlyAssignableExpression = 98;
	public static readonly RULE_assignableExpression = 99;
	public static readonly RULE_parenthesizedAssignableExpression = 100;
	public static readonly RULE_assignableSuffix = 101;
	public static readonly RULE_indexingSuffix = 102;
	public static readonly RULE_navigationSuffix = 103;
	public static readonly RULE_callSuffix = 104;
	public static readonly RULE_annotatedLambda = 105;
	public static readonly RULE_typeArguments = 106;
	public static readonly RULE_valueArguments = 107;
	public static readonly RULE_valueArgument = 108;
	public static readonly RULE_primaryExpression = 109;
	public static readonly RULE_parenthesizedExpression = 110;
	public static readonly RULE_collectionLiteral = 111;
	public static readonly RULE_literalConstant = 112;
	public static readonly RULE_stringLiteral = 113;
	public static readonly RULE_lineStringLiteral = 114;
	public static readonly RULE_multiLineStringLiteral = 115;
	public static readonly RULE_lineStringContent = 116;
	public static readonly RULE_lineStringExpression = 117;
	public static readonly RULE_multiLineStringContent = 118;
	public static readonly RULE_multiLineStringExpression = 119;
	public static readonly RULE_lambdaLiteral = 120;
	public static readonly RULE_lambdaParameters = 121;
	public static readonly RULE_lambdaParameter = 122;
	public static readonly RULE_anonymousFunction = 123;
	public static readonly RULE_functionLiteral = 124;
	public static readonly RULE_objectLiteral = 125;
	public static readonly RULE_thisExpression = 126;
	public static readonly RULE_superExpression = 127;
	public static readonly RULE_ifExpression = 128;
	public static readonly RULE_whenSubject = 129;
	public static readonly RULE_whenExpression = 130;
	public static readonly RULE_whenEntry = 131;
	public static readonly RULE_whenCondition = 132;
	public static readonly RULE_rangeTest = 133;
	public static readonly RULE_typeTest = 134;
	public static readonly RULE_tryExpression = 135;
	public static readonly RULE_catchBlock = 136;
	public static readonly RULE_finallyBlock = 137;
	public static readonly RULE_jumpExpression = 138;
	public static readonly RULE_callableReference = 139;
	public static readonly RULE_assignmentAndOperator = 140;
	public static readonly RULE_equalityOperator = 141;
	public static readonly RULE_comparisonOperator = 142;
	public static readonly RULE_inOperator = 143;
	public static readonly RULE_isOperator = 144;
	public static readonly RULE_additiveOperator = 145;
	public static readonly RULE_multiplicativeOperator = 146;
	public static readonly RULE_asOperator = 147;
	public static readonly RULE_prefixUnaryOperator = 148;
	public static readonly RULE_postfixUnaryOperator = 149;
	public static readonly RULE_excl = 150;
	public static readonly RULE_memberAccessOperator = 151;
	public static readonly RULE_safeNav = 152;
	public static readonly RULE_modifiers = 153;
	public static readonly RULE_parameterModifiers = 154;
	public static readonly RULE_modifier = 155;
	public static readonly RULE_typeModifiers = 156;
	public static readonly RULE_typeModifier = 157;
	public static readonly RULE_classModifier = 158;
	public static readonly RULE_memberModifier = 159;
	public static readonly RULE_visibilityModifier = 160;
	public static readonly RULE_varianceModifier = 161;
	public static readonly RULE_typeParameterModifiers = 162;
	public static readonly RULE_typeParameterModifier = 163;
	public static readonly RULE_functionModifier = 164;
	public static readonly RULE_propertyModifier = 165;
	public static readonly RULE_inheritanceModifier = 166;
	public static readonly RULE_parameterModifier = 167;
	public static readonly RULE_reificationModifier = 168;
	public static readonly RULE_platformModifier = 169;
	public static readonly RULE_annotation = 170;
	public static readonly RULE_singleAnnotation = 171;
	public static readonly RULE_multiAnnotation = 172;
	public static readonly RULE_annotationUseSiteTarget = 173;
	public static readonly RULE_unescapedAnnotation = 174;
	public static readonly RULE_simpleIdentifier = 175;
	public static readonly RULE_identifier = 176;
	public static readonly literalNames: (string | null)[] = [ null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'...'", "'.'", 
                                                            "','", "'('", 
                                                            "')'", "'['", 
                                                            "']'", "'{'", 
                                                            "'}'", "'*'", 
                                                            "'%'", "'/'", 
                                                            "'+'", "'-'", 
                                                            "'++'", "'--'", 
                                                            "'&&'", "'||'", 
                                                            null, "'!'", 
                                                            "':'", "';'", 
                                                            "'='", "'+='", 
                                                            "'-='", "'*='", 
                                                            "'/='", "'%='", 
                                                            "'->'", "'=>'", 
                                                            "'..'", "'..<'", 
                                                            "'::'", "';;'", 
                                                            "'#'", "'@'", 
                                                            null, null, 
                                                            null, null, 
                                                            "'?'", "'<'", 
                                                            "'>'", "'<='", 
                                                            "'>='", "'!='", 
                                                            "'!=='", "'as?'", 
                                                            "'=='", "'==='", 
                                                            "'''", "'&'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'file'", 
                                                            "'field'", "'property'", 
                                                            "'get'", "'set'", 
                                                            "'receiver'", 
                                                            "'param'", "'setparam'", 
                                                            "'delegate'", 
                                                            "'package'", 
                                                            "'import'", 
                                                            "'class'", "'interface'", 
                                                            "'fun'", "'object'", 
                                                            "'val'", "'var'", 
                                                            "'typealias'", 
                                                            "'constructor'", 
                                                            "'by'", "'companion'", 
                                                            "'init'", "'this'", 
                                                            "'super'", "'typeof'", 
                                                            "'where'", "'if'", 
                                                            "'else'", "'when'", 
                                                            "'try'", "'catch'", 
                                                            "'finally'", 
                                                            "'for'", "'do'", 
                                                            "'while'", "'throw'", 
                                                            "'return'", 
                                                            "'continue'", 
                                                            "'break'", "'as'", 
                                                            "'is'", "'in'", 
                                                            null, null, 
                                                            "'out'", "'dynamic'", 
                                                            "'public'", 
                                                            "'private'", 
                                                            "'protected'", 
                                                            "'internal'", 
                                                            "'enum'", "'sealed'", 
                                                            "'annotation'", 
                                                            "'data'", "'inner'", 
                                                            "'value'", "'tailrec'", 
                                                            "'operator'", 
                                                            "'inline'", 
                                                            "'infix'", "'external'", 
                                                            "'suspend'", 
                                                            "'override'", 
                                                            "'abstract'", 
                                                            "'final'", "'open'", 
                                                            "'const'", "'lateinit'", 
                                                            "'vararg'", 
                                                            "'noinline'", 
                                                            "'crossinline'", 
                                                            "'reified'", 
                                                            "'expect'", 
                                                            "'actual'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'null'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'\"\"\"'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "ShebangLine", 
                                                             "DelimitedComment", 
                                                             "LineComment", 
                                                             "WS", "NL", 
                                                             "RESERVED", 
                                                             "DOT", "COMMA", 
                                                             "LPAREN", "RPAREN", 
                                                             "LSQUARE", 
                                                             "RSQUARE", 
                                                             "LCURL", "RCURL", 
                                                             "MULT", "MOD", 
                                                             "DIV", "ADD", 
                                                             "SUB", "INCR", 
                                                             "DECR", "CONJ", 
                                                             "DISJ", "EXCL_WS", 
                                                             "EXCL_NO_WS", 
                                                             "COLON", "SEMICOLON", 
                                                             "ASSIGNMENT", 
                                                             "ADD_ASSIGNMENT", 
                                                             "SUB_ASSIGNMENT", 
                                                             "MULT_ASSIGNMENT", 
                                                             "DIV_ASSIGNMENT", 
                                                             "MOD_ASSIGNMENT", 
                                                             "ARROW", "DOUBLE_ARROW", 
                                                             "RANGE", "RANGE_UNTIL", 
                                                             "COLONCOLON", 
                                                             "DOUBLE_SEMICOLON", 
                                                             "HASH", "AT_NO_WS", 
                                                             "AT_POST_WS", 
                                                             "AT_PRE_WS", 
                                                             "AT_BOTH_WS", 
                                                             "QUEST_WS", 
                                                             "QUEST_NO_WS", 
                                                             "LANGLE", "RANGLE", 
                                                             "LE", "GE", 
                                                             "EXCL_EQ", 
                                                             "EXCL_EQEQ", 
                                                             "AS_SAFE", 
                                                             "EQEQ", "EQEQEQ", 
                                                             "SINGLE_QUOTE", 
                                                             "AMP", "RETURN_AT", 
                                                             "CONTINUE_AT", 
                                                             "BREAK_AT", 
                                                             "THIS_AT", 
                                                             "SUPER_AT", 
                                                             "FILE", "FIELD", 
                                                             "PROPERTY", 
                                                             "GET", "SET", 
                                                             "RECEIVER", 
                                                             "PARAM", "SETPARAM", 
                                                             "DELEGATE", 
                                                             "PACKAGE", 
                                                             "IMPORT", "CLASS", 
                                                             "INTERFACE", 
                                                             "FUN", "OBJECT", 
                                                             "VAL", "VAR", 
                                                             "TYPE_ALIAS", 
                                                             "CONSTRUCTOR", 
                                                             "BY", "COMPANION", 
                                                             "INIT", "THIS", 
                                                             "SUPER", "TYPEOF", 
                                                             "WHERE", "IF", 
                                                             "ELSE", "WHEN", 
                                                             "TRY", "CATCH", 
                                                             "FINALLY", 
                                                             "FOR", "DO", 
                                                             "WHILE", "THROW", 
                                                             "RETURN", "CONTINUE", 
                                                             "BREAK", "AS", 
                                                             "IS", "IN", 
                                                             "NOT_IS", "NOT_IN", 
                                                             "OUT", "DYNAMIC", 
                                                             "PUBLIC", "PRIVATE", 
                                                             "PROTECTED", 
                                                             "INTERNAL", 
                                                             "ENUM", "SEALED", 
                                                             "ANNOTATION", 
                                                             "DATA", "INNER", 
                                                             "VALUE", "TAILREC", 
                                                             "OPERATOR", 
                                                             "INLINE", "INFIX", 
                                                             "EXTERNAL", 
                                                             "SUSPEND", 
                                                             "OVERRIDE", 
                                                             "ABSTRACT", 
                                                             "FINAL", "OPEN", 
                                                             "CONST", "LATEINIT", 
                                                             "VARARG", "NOINLINE", 
                                                             "CROSSINLINE", 
                                                             "REIFIED", 
                                                             "EXPECT", "ACTUAL", 
                                                             "RealLiteral", 
                                                             "FloatLiteral", 
                                                             "DoubleLiteral", 
                                                             "IntegerLiteral", 
                                                             "HexLiteral", 
                                                             "BinLiteral", 
                                                             "UnsignedLiteral", 
                                                             "LongLiteral", 
                                                             "BooleanLiteral", 
                                                             "NullLiteral", 
                                                             "CharacterLiteral", 
                                                             "Identifier", 
                                                             "IdentifierOrSoftKey", 
                                                             "FieldIdentifier", 
                                                             "QUOTE_OPEN", 
                                                             "TRIPLE_QUOTE_OPEN", 
                                                             "UNICODE_CLASS_LL", 
                                                             "UNICODE_CLASS_LM", 
                                                             "UNICODE_CLASS_LO", 
                                                             "UNICODE_CLASS_LT", 
                                                             "UNICODE_CLASS_LU", 
                                                             "UNICODE_CLASS_ND", 
                                                             "UNICODE_CLASS_NL", 
                                                             "QUOTE_CLOSE", 
                                                             "LineStrRef", 
                                                             "LineStrText", 
                                                             "LineStrEscapedChar", 
                                                             "LineStrExprStart", 
                                                             "TRIPLE_QUOTE_CLOSE", 
                                                             "MultiLineStringQuote", 
                                                             "MultiLineStrRef", 
                                                             "MultiLineStrText", 
                                                             "MultiLineStrExprStart", 
                                                             "Inside_Comment", 
                                                             "Inside_WS", 
                                                             "Inside_NL", 
                                                             "ErrorCharacter", 
                                                             "AnyType" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"kotlinFile", "script", "typeCheckExpression", "topLevelJumpExpression", 
		"topLevelExpression", "shebangLine", "fileAnnotation", "packageHeader", 
		"importList", "importHeader", "importAlias", "topLevelObject", "typeAlias", 
		"declaration", "classDeclaration", "primaryConstructor", "classBody", 
		"classParameters", "classParameter", "delegationSpecifiers", "delegationSpecifier", 
		"constructorInvocation", "annotatedDelegationSpecifier", "explicitDelegation", 
		"typeParameters", "typeParameter", "typeConstraints", "typeConstraint", 
		"classMemberDeclarations", "classMemberDeclaration", "anonymousInitializer", 
		"companionObject", "functionValueParameters", "functionValueParameter", 
		"functionDeclaration", "functionBody", "variableDeclaration", "multiVariableDeclaration", 
		"propertyDeclaration", "propertyDelegate", "getter", "setter", "parametersWithOptionalType", 
		"functionValueParameterWithOptionalType", "parameterWithOptionalType", 
		"parameter", "objectDeclaration", "secondaryConstructor", "constructorDelegationCall", 
		"enumClassBody", "enumEntries", "enumEntry", "type", "typeReference", 
		"nullableType", "quest", "userType", "simpleUserType", "typeProjection", 
		"typeProjectionModifiers", "typeProjectionModifier", "functionType", "functionTypeParameters", 
		"parenthesizedType", "receiverType", "parenthesizedUserType", "definitelyNonNullableType", 
		"statements", "statement", "label", "controlStructureBody", "block", "loopStatement", 
		"forStatement", "whileStatement", "doWhileStatement", "assignment", "semi", 
		"semis", "expression", "disjunction", "conjunction", "equality", "comparison", 
		"genericCallLikeComparison", "infixOperation", "elvisExpression", "elvis", 
		"infixFunctionCall", "rangeExpression", "additiveExpression", "multiplicativeExpression", 
		"asExpression", "prefixUnaryExpression", "unaryPrefix", "postfixUnaryExpression", 
		"postfixUnarySuffix", "directlyAssignableExpression", "parenthesizedDirectlyAssignableExpression", 
		"assignableExpression", "parenthesizedAssignableExpression", "assignableSuffix", 
		"indexingSuffix", "navigationSuffix", "callSuffix", "annotatedLambda", 
		"typeArguments", "valueArguments", "valueArgument", "primaryExpression", 
		"parenthesizedExpression", "collectionLiteral", "literalConstant", "stringLiteral", 
		"lineStringLiteral", "multiLineStringLiteral", "lineStringContent", "lineStringExpression", 
		"multiLineStringContent", "multiLineStringExpression", "lambdaLiteral", 
		"lambdaParameters", "lambdaParameter", "anonymousFunction", "functionLiteral", 
		"objectLiteral", "thisExpression", "superExpression", "ifExpression", 
		"whenSubject", "whenExpression", "whenEntry", "whenCondition", "rangeTest", 
		"typeTest", "tryExpression", "catchBlock", "finallyBlock", "jumpExpression", 
		"callableReference", "assignmentAndOperator", "equalityOperator", "comparisonOperator", 
		"inOperator", "isOperator", "additiveOperator", "multiplicativeOperator", 
		"asOperator", "prefixUnaryOperator", "postfixUnaryOperator", "excl", "memberAccessOperator", 
		"safeNav", "modifiers", "parameterModifiers", "modifier", "typeModifiers", 
		"typeModifier", "classModifier", "memberModifier", "visibilityModifier", 
		"varianceModifier", "typeParameterModifiers", "typeParameterModifier", 
		"functionModifier", "propertyModifier", "inheritanceModifier", "parameterModifier", 
		"reificationModifier", "platformModifier", "annotation", "singleAnnotation", 
		"multiAnnotation", "annotationUseSiteTarget", "unescapedAnnotation", "simpleIdentifier", 
		"identifier",
	];
	public get grammarFileName(): string { return "KotlinParser.g4"; }
	public get literalNames(): (string | null)[] { return KotlinParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return KotlinParser.symbolicNames; }
	public get ruleNames(): string[] { return KotlinParser.ruleNames; }
	public get serializedATN(): number[] { return KotlinParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, KotlinParser._ATN, KotlinParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public kotlinFile(): KotlinFileContext {
		let localctx: KotlinFileContext = new KotlinFileContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, KotlinParser.RULE_kotlinFile);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 355;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1) {
				{
				this.state = 354;
				this.shebangLine();
				}
			}

			this.state = 360;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 1, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 357;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 362;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 1, this._ctx);
			}
			this.state = 366;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 363;
					this.fileAnnotation();
					}
					}
				}
				this.state = 368;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			}
			this.state = 370;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				{
				this.state = 369;
				this.packageHeader();
				}
				break;
			}
			this.state = 373;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				{
				this.state = 372;
				this.importList();
				}
				break;
			}
			this.state = 379;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 54274592) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 4293918761) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 4293787643) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 2147483647) !== 0) || ((((_la - 140)) & ~0x1F) === 0 && ((1 << (_la - 140)) & 6655) !== 0) || _la===174) {
				{
				this.state = 377;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 5, this._ctx) ) {
				case 1:
					{
					this.state = 375;
					this.topLevelObject();
					}
					break;
				case 2:
					{
					this.state = 376;
					this.topLevelExpression();
					}
					break;
				}
				}
				this.state = 381;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 382;
			this.match(KotlinParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public script(): ScriptContext {
		let localctx: ScriptContext = new ScriptContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, KotlinParser.RULE_script);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 385;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1) {
				{
				this.state = 384;
				this.shebangLine();
				}
			}

			this.state = 390;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 387;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 392;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
			}
			this.state = 396;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 393;
					this.fileAnnotation();
					}
					}
				}
				this.state = 398;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
			}
			this.state = 400;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				{
				this.state = 399;
				this.packageHeader();
				}
				break;
			}
			this.state = 403;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				{
				this.state = 402;
				this.importList();
				}
				break;
			}
			this.state = 411;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 54274592) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 4293918761) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 4293787643) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 2147483647) !== 0) || ((((_la - 140)) & ~0x1F) === 0 && ((1 << (_la - 140)) & 6655) !== 0) || _la===174) {
				{
				{
				this.state = 405;
				this.statement();
				this.state = 407;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 12, this._ctx) ) {
				case 1:
					{
					this.state = 406;
					this.semi();
					}
					break;
				}
				}
				}
				this.state = 413;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 414;
			this.match(KotlinParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeCheckExpression(): TypeCheckExpressionContext {
		let localctx: TypeCheckExpressionContext = new TypeCheckExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, KotlinParser.RULE_typeCheckExpression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 416;
			this.infixOperation();
			this.state = 423;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 103:
			case 105:
				{
				this.state = 417;
				this.isOperator();
				this.state = 418;
				this.type_();
				}
				break;
			case 104:
			case 106:
				{
				this.state = 420;
				this.inOperator();
				this.state = 421;
				this.expression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public topLevelJumpExpression(): TopLevelJumpExpressionContext {
		let localctx: TopLevelJumpExpressionContext = new TopLevelJumpExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, KotlinParser.RULE_topLevelJumpExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 425;
			this.match(KotlinParser.THROW);
			this.state = 429;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 15, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 426;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 431;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 15, this._ctx);
			}
			this.state = 432;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public topLevelExpression(): TopLevelExpressionContext {
		let localctx: TopLevelExpressionContext = new TopLevelExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, KotlinParser.RULE_topLevelExpression);
		try {
			this.state = 437;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 16, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 434;
				this.statement();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 435;
				this.expression();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 436;
				this.match(KotlinParser.NL);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public shebangLine(): ShebangLineContext {
		let localctx: ShebangLineContext = new ShebangLineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, KotlinParser.RULE_shebangLine);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 439;
			this.match(KotlinParser.ShebangLine);
			this.state = 441;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 440;
					this.match(KotlinParser.NL);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 443;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 17, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fileAnnotation(): FileAnnotationContext {
		let localctx: FileAnnotationContext = new FileAnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, KotlinParser.RULE_fileAnnotation);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 445;
			_la = this._input.LA(1);
			if(!(_la===41 || _la===43)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 446;
			this.match(KotlinParser.FILE);
			this.state = 450;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 447;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 452;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 453;
			this.match(KotlinParser.COLON);
			this.state = 457;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 454;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 459;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 469;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 11:
				{
				this.state = 460;
				this.match(KotlinParser.LSQUARE);
				this.state = 462;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 461;
					this.unescapedAnnotation();
					}
					}
					this.state = 464;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 63)) & ~0x1F) === 0 && ((1 << (_la - 63)) & 3258713599) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148);
				this.state = 466;
				this.match(KotlinParser.RSQUARE);
				}
				break;
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 468;
				this.unescapedAnnotation();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 474;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 471;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 476;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public packageHeader(): PackageHeaderContext {
		let localctx: PackageHeaderContext = new PackageHeaderContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, KotlinParser.RULE_packageHeader);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 482;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===72) {
				{
				this.state = 477;
				this.match(KotlinParser.PACKAGE);
				this.state = 478;
				this.identifier();
				this.state = 480;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 23, this._ctx) ) {
				case 1:
					{
					this.state = 479;
					this.semi();
					}
					break;
				}
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public importList(): ImportListContext {
		let localctx: ImportListContext = new ImportListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, KotlinParser.RULE_importList);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 487;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 484;
					this.importHeader();
					}
					}
				}
				this.state = 489;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public importHeader(): ImportHeaderContext {
		let localctx: ImportHeaderContext = new ImportHeaderContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, KotlinParser.RULE_importHeader);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 490;
			this.match(KotlinParser.IMPORT);
			this.state = 491;
			this.identifier();
			this.state = 495;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 7:
				{
				this.state = 492;
				this.match(KotlinParser.DOT);
				this.state = 493;
				this.match(KotlinParser.MULT);
				}
				break;
			case 102:
				{
				this.state = 494;
				this.importAlias();
				}
				break;
			case -1:
			case 5:
			case 9:
			case 11:
			case 13:
			case 18:
			case 19:
			case 20:
			case 21:
			case 24:
			case 25:
			case 27:
			case 38:
			case 41:
			case 43:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 74:
			case 75:
			case 76:
			case 77:
			case 78:
			case 79:
			case 80:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 88:
			case 89:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 97:
			case 98:
			case 99:
			case 100:
			case 101:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 137:
			case 140:
			case 141:
			case 142:
			case 143:
			case 144:
			case 145:
			case 146:
			case 147:
			case 148:
			case 151:
			case 152:
			case 174:
				break;
			default:
				break;
			}
			this.state = 498;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				{
				this.state = 497;
				this.semi();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public importAlias(): ImportAliasContext {
		let localctx: ImportAliasContext = new ImportAliasContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, KotlinParser.RULE_importAlias);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 500;
			this.match(KotlinParser.AS);
			this.state = 501;
			this.simpleIdentifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public topLevelObject(): TopLevelObjectContext {
		let localctx: TopLevelObjectContext = new TopLevelObjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, KotlinParser.RULE_topLevelObject);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 503;
			this.declaration();
			this.state = 505;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 28, this._ctx) ) {
			case 1:
				{
				this.state = 504;
				this.semis();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeAlias(): TypeAliasContext {
		let localctx: TypeAliasContext = new TypeAliasContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, KotlinParser.RULE_typeAlias);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 508;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 507;
				this.modifiers();
				}
			}

			this.state = 510;
			this.match(KotlinParser.TYPE_ALIAS);
			this.state = 514;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 511;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 516;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 517;
			this.simpleIdentifier();
			this.state = 525;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 32, this._ctx) ) {
			case 1:
				{
				this.state = 521;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 518;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 523;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 524;
				this.typeParameters();
				}
				break;
			}
			this.state = 530;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 527;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 532;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 533;
			this.match(KotlinParser.ASSIGNMENT);
			this.state = 537;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 534;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 539;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 540;
			this.type_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let localctx: DeclarationContext = new DeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, KotlinParser.RULE_declaration);
		try {
			this.state = 547;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 35, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 542;
				this.classDeclaration();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 543;
				this.objectDeclaration();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 544;
				this.functionDeclaration();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 545;
				this.propertyDeclaration();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 546;
				this.typeAlias();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classDeclaration(): ClassDeclarationContext {
		let localctx: ClassDeclarationContext = new ClassDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, KotlinParser.RULE_classDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 550;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 549;
				this.modifiers();
				}
			}

			this.state = 563;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 74:
				{
				this.state = 552;
				this.match(KotlinParser.CLASS);
				}
				break;
			case 75:
			case 76:
				{
				this.state = 560;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===76) {
					{
					this.state = 553;
					this.match(KotlinParser.FUN);
					this.state = 557;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 554;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 559;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 562;
				this.match(KotlinParser.INTERFACE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 568;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 565;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 570;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 571;
			this.simpleIdentifier();
			this.state = 579;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 42, this._ctx) ) {
			case 1:
				{
				this.state = 575;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 572;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 577;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 578;
				this.typeParameters();
				}
				break;
			}
			this.state = 588;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 44, this._ctx) ) {
			case 1:
				{
				this.state = 584;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 581;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 586;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
				}
				this.state = 587;
				this.primaryConstructor();
				}
				break;
			}
			this.state = 604;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 47, this._ctx) ) {
			case 1:
				{
				this.state = 593;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 590;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 595;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 596;
				this.match(KotlinParser.COLON);
				this.state = 600;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 46, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 597;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 602;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 46, this._ctx);
				}
				this.state = 603;
				this.delegationSpecifiers();
				}
				break;
			}
			this.state = 613;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 49, this._ctx) ) {
			case 1:
				{
				this.state = 609;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 606;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 611;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 612;
				this.typeConstraints();
				}
				break;
			}
			this.state = 629;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 52, this._ctx) ) {
			case 1:
				{
				this.state = 618;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 615;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 620;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 621;
				this.classBody();
				}
				break;
			case 2:
				{
				this.state = 625;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 622;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 627;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 628;
				this.enumClassBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public primaryConstructor(): PrimaryConstructorContext {
		let localctx: PrimaryConstructorContext = new PrimaryConstructorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, KotlinParser.RULE_primaryConstructor);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 641;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 55, this._ctx) ) {
			case 1:
				{
				this.state = 632;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
					{
					this.state = 631;
					this.modifiers();
					}
				}

				this.state = 634;
				this.match(KotlinParser.CONSTRUCTOR);
				this.state = 638;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 54, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 635;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 640;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 54, this._ctx);
				}
				}
				break;
			}
			this.state = 644;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 56, this._ctx) ) {
			case 1:
				{
				this.state = 643;
				this.classParameters();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classBody(): ClassBodyContext {
		let localctx: ClassBodyContext = new ClassBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, KotlinParser.RULE_classBody);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 646;
			this.match(KotlinParser.LCURL);
			this.state = 650;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 57, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 647;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 652;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 57, this._ctx);
			}
			this.state = 654;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 58, this._ctx) ) {
			case 1:
				{
				this.state = 653;
				this.classMemberDeclarations();
				}
				break;
			}
			this.state = 659;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 656;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 661;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 662;
			this.match(KotlinParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classParameters(): ClassParametersContext {
		let localctx: ClassParametersContext = new ClassParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, KotlinParser.RULE_classParameters);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 664;
			this.match(KotlinParser.LPAREN);
			this.state = 668;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 60, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 665;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 670;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 60, this._ctx);
			}
			this.state = 700;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 66, this._ctx) ) {
			case 1:
				{
				this.state = 671;
				this.classParameter();
				this.state = 688;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 675;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 672;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 677;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 678;
						this.match(KotlinParser.COMMA);
						this.state = 682;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 62, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 679;
								this.match(KotlinParser.NL);
								}
								}
							}
							this.state = 684;
							this._errHandler.sync(this);
							_alt = this._interp.adaptivePredict(this._input, 62, this._ctx);
						}
						this.state = 685;
						this.classParameter();
						}
						}
					}
					this.state = 690;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
				}
				this.state = 698;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 65, this._ctx) ) {
				case 1:
					{
					this.state = 694;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 691;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 696;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 697;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				}
				break;
			}
			this.state = 705;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 702;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 707;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 708;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classParameter(): ClassParameterContext {
		let localctx: ClassParameterContext = new ClassParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, KotlinParser.RULE_classParameter);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 711;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 68, this._ctx) ) {
			case 1:
				{
				this.state = 710;
				this.modifiers();
				}
				break;
			}
			this.state = 714;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===78 || _la===79) {
				{
				this.state = 713;
				_la = this._input.LA(1);
				if(!(_la===78 || _la===79)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 719;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 716;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 721;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 722;
			this.simpleIdentifier();
			this.state = 723;
			this.match(KotlinParser.COLON);
			this.state = 727;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 724;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 729;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 730;
			this.type_();
			this.state = 745;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 74, this._ctx) ) {
			case 1:
				{
				this.state = 734;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 731;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 736;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 737;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 741;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 73, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 738;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 743;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 73, this._ctx);
				}
				this.state = 744;
				this.expression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public delegationSpecifiers(): DelegationSpecifiersContext {
		let localctx: DelegationSpecifiersContext = new DelegationSpecifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, KotlinParser.RULE_delegationSpecifiers);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 747;
			this.annotatedDelegationSpecifier();
			this.state = 764;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 77, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 751;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 748;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 753;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 754;
					this.match(KotlinParser.COMMA);
					this.state = 758;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 76, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 755;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 760;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 76, this._ctx);
					}
					this.state = 761;
					this.annotatedDelegationSpecifier();
					}
					}
				}
				this.state = 766;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 77, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public delegationSpecifier(): DelegationSpecifierContext {
		let localctx: DelegationSpecifierContext = new DelegationSpecifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, KotlinParser.RULE_delegationSpecifier);
		let _la: number;
		try {
			this.state = 779;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 79, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 767;
				this.constructorInvocation();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 768;
				this.explicitDelegation();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 769;
				this.userType();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 770;
				this.functionType();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 771;
				this.match(KotlinParser.SUSPEND);
				this.state = 775;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 772;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 777;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 778;
				this.functionType();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constructorInvocation(): ConstructorInvocationContext {
		let localctx: ConstructorInvocationContext = new ConstructorInvocationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, KotlinParser.RULE_constructorInvocation);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 781;
			this.userType();
			this.state = 785;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 782;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 787;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 788;
			this.valueArguments();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotatedDelegationSpecifier(): AnnotatedDelegationSpecifierContext {
		let localctx: AnnotatedDelegationSpecifierContext = new AnnotatedDelegationSpecifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, KotlinParser.RULE_annotatedDelegationSpecifier);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 793;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 81, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 790;
					this.annotation();
					}
					}
				}
				this.state = 795;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 81, this._ctx);
			}
			this.state = 799;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 796;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 801;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 802;
			this.delegationSpecifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public explicitDelegation(): ExplicitDelegationContext {
		let localctx: ExplicitDelegationContext = new ExplicitDelegationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, KotlinParser.RULE_explicitDelegation);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 806;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 83, this._ctx) ) {
			case 1:
				{
				this.state = 804;
				this.userType();
				}
				break;
			case 2:
				{
				this.state = 805;
				this.functionType();
				}
				break;
			}
			this.state = 811;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 808;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 813;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 814;
			this.match(KotlinParser.BY);
			this.state = 818;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 815;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 820;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
			}
			this.state = 821;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeParameters(): TypeParametersContext {
		let localctx: TypeParametersContext = new TypeParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, KotlinParser.RULE_typeParameters);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 823;
			this.match(KotlinParser.LANGLE);
			this.state = 827;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 86, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 824;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 829;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 86, this._ctx);
			}
			this.state = 830;
			this.typeParameter();
			this.state = 847;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 89, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 834;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 831;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 836;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 837;
					this.match(KotlinParser.COMMA);
					this.state = 841;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 88, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 838;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 843;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 88, this._ctx);
					}
					this.state = 844;
					this.typeParameter();
					}
					}
				}
				this.state = 849;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 89, this._ctx);
			}
			this.state = 857;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 91, this._ctx) ) {
			case 1:
				{
				this.state = 853;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 850;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 855;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 856;
				this.match(KotlinParser.COMMA);
				}
				break;
			}
			this.state = 862;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 859;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 864;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 865;
			this.match(KotlinParser.RANGLE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeParameter(): TypeParameterContext {
		let localctx: TypeParameterContext = new TypeParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, KotlinParser.RULE_typeParameter);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 868;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 93, this._ctx) ) {
			case 1:
				{
				this.state = 867;
				this.typeParameterModifiers();
				}
				break;
			}
			this.state = 873;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 870;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 875;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 876;
			this.simpleIdentifier();
			this.state = 891;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 97, this._ctx) ) {
			case 1:
				{
				this.state = 880;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 877;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 882;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 883;
				this.match(KotlinParser.COLON);
				this.state = 887;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 884;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 889;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 890;
				this.type_();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeConstraints(): TypeConstraintsContext {
		let localctx: TypeConstraintsContext = new TypeConstraintsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, KotlinParser.RULE_typeConstraints);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 893;
			this.match(KotlinParser.WHERE);
			this.state = 897;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 894;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 899;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 900;
			this.typeConstraint();
			this.state = 917;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 101, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 904;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 901;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 906;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 907;
					this.match(KotlinParser.COMMA);
					this.state = 911;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 908;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 913;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 914;
					this.typeConstraint();
					}
					}
				}
				this.state = 919;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 101, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeConstraint(): TypeConstraintContext {
		let localctx: TypeConstraintContext = new TypeConstraintContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, KotlinParser.RULE_typeConstraint);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 923;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===41 || _la===43) {
				{
				{
				this.state = 920;
				this.annotation();
				}
				}
				this.state = 925;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 926;
			this.simpleIdentifier();
			this.state = 930;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 927;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 932;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 933;
			this.match(KotlinParser.COLON);
			this.state = 937;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 934;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 939;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 940;
			this.type_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classMemberDeclarations(): ClassMemberDeclarationsContext {
		let localctx: ClassMemberDeclarationsContext = new ClassMemberDeclarationsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, KotlinParser.RULE_classMemberDeclarations);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 952;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 108, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					this.state = 950;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 107, this._ctx) ) {
					case 1:
						{
						this.state = 942;
						this.classMemberDeclaration();
						this.state = 944;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 105, this._ctx) ) {
						case 1:
							{
							this.state = 943;
							this.semis();
							}
							break;
						}
						}
						break;
					case 2:
						{
						this.state = 946;
						this.topLevelExpression();
						this.state = 948;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 106, this._ctx) ) {
						case 1:
							{
							this.state = 947;
							this.semis();
							}
							break;
						}
						}
						break;
					}
					}
				}
				this.state = 954;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 108, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classMemberDeclaration(): ClassMemberDeclarationContext {
		let localctx: ClassMemberDeclarationContext = new ClassMemberDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, KotlinParser.RULE_classMemberDeclaration);
		try {
			this.state = 959;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 109, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 955;
				this.declaration();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 956;
				this.companionObject();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 957;
				this.anonymousInitializer();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 958;
				this.secondaryConstructor();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public anonymousInitializer(): AnonymousInitializerContext {
		let localctx: AnonymousInitializerContext = new AnonymousInitializerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, KotlinParser.RULE_anonymousInitializer);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 961;
			this.match(KotlinParser.INIT);
			this.state = 965;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 962;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 967;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 968;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public companionObject(): CompanionObjectContext {
		let localctx: CompanionObjectContext = new CompanionObjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, KotlinParser.RULE_companionObject);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 971;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 970;
				this.modifiers();
				}
			}

			this.state = 973;
			this.match(KotlinParser.COMPANION);
			this.state = 977;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 112, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 974;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 979;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 112, this._ctx);
			}
			this.state = 981;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===116) {
				{
				this.state = 980;
				this.match(KotlinParser.DATA);
				}
			}

			this.state = 986;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 983;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 988;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 989;
			this.match(KotlinParser.OBJECT);
			this.state = 997;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 116, this._ctx) ) {
			case 1:
				{
				this.state = 993;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 990;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 995;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 996;
				this.simpleIdentifier();
				}
				break;
			}
			this.state = 1013;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 119, this._ctx) ) {
			case 1:
				{
				this.state = 1002;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 999;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1004;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1005;
				this.match(KotlinParser.COLON);
				this.state = 1009;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 118, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1006;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1011;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 118, this._ctx);
				}
				this.state = 1012;
				this.delegationSpecifiers();
				}
				break;
			}
			this.state = 1022;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 121, this._ctx) ) {
			case 1:
				{
				this.state = 1018;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1015;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1020;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1021;
				this.classBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionValueParameters(): FunctionValueParametersContext {
		let localctx: FunctionValueParametersContext = new FunctionValueParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, KotlinParser.RULE_functionValueParameters);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1024;
			this.match(KotlinParser.LPAREN);
			this.state = 1028;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 122, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1025;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1030;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 122, this._ctx);
			}
			this.state = 1060;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 2143289349) !== 0) || ((((_la - 73)) & ~0x1F) === 0 && ((1 << (_la - 73)) & 3182337) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148) {
				{
				this.state = 1031;
				this.functionValueParameter();
				this.state = 1048;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 125, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1035;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 1032;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 1037;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 1038;
						this.match(KotlinParser.COMMA);
						this.state = 1042;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 1039;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 1044;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 1045;
						this.functionValueParameter();
						}
						}
					}
					this.state = 1050;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 125, this._ctx);
				}
				this.state = 1058;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 127, this._ctx) ) {
				case 1:
					{
					this.state = 1054;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1051;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1056;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1057;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				}
			}

			this.state = 1065;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1062;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1067;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1068;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionValueParameter(): FunctionValueParameterContext {
		let localctx: FunctionValueParameterContext = new FunctionValueParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 66, KotlinParser.RULE_functionValueParameter);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1071;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 130, this._ctx) ) {
			case 1:
				{
				this.state = 1070;
				this.parameterModifiers();
				}
				break;
			}
			this.state = 1073;
			this.parameter();
			this.state = 1088;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 133, this._ctx) ) {
			case 1:
				{
				this.state = 1077;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1074;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1079;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1080;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 1084;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 132, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1081;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1086;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 132, this._ctx);
				}
				this.state = 1087;
				this.expression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionDeclaration(): FunctionDeclarationContext {
		let localctx: FunctionDeclarationContext = new FunctionDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, KotlinParser.RULE_functionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1091;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 1090;
				this.modifiers();
				}
			}

			this.state = 1093;
			this.match(KotlinParser.FUN);
			this.state = 1101;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 136, this._ctx) ) {
			case 1:
				{
				this.state = 1097;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1094;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1099;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1100;
				this.typeParameters();
				}
				break;
			}
			this.state = 1118;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 139, this._ctx) ) {
			case 1:
				{
				this.state = 1106;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1103;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1108;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1109;
				this.receiverType();
				this.state = 1113;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1110;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1115;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1116;
				this.match(KotlinParser.DOT);
				}
				break;
			}
			this.state = 1123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1120;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1125;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1126;
			this.simpleIdentifier();
			this.state = 1130;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1127;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1132;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1133;
			this.functionValueParameters();
			this.state = 1148;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 144, this._ctx) ) {
			case 1:
				{
				this.state = 1137;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1134;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1139;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1140;
				this.match(KotlinParser.COLON);
				this.state = 1144;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1141;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1146;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1147;
				this.type_();
				}
				break;
			}
			this.state = 1157;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 146, this._ctx) ) {
			case 1:
				{
				this.state = 1153;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1150;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1155;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1156;
				this.typeConstraints();
				}
				break;
			}
			this.state = 1166;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 148, this._ctx) ) {
			case 1:
				{
				this.state = 1162;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1159;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1164;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1165;
				this.functionBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionBody(): FunctionBodyContext {
		let localctx: FunctionBodyContext = new FunctionBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, KotlinParser.RULE_functionBody);
		try {
			let _alt: number;
			this.state = 1177;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 13:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1168;
				this.block();
				}
				break;
			case 28:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1169;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 1173;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 149, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1170;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1175;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 149, this._ctx);
				}
				this.state = 1176;
				this.expression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variableDeclaration(): VariableDeclarationContext {
		let localctx: VariableDeclarationContext = new VariableDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, KotlinParser.RULE_variableDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1182;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===41 || _la===43) {
				{
				{
				this.state = 1179;
				this.annotation();
				}
				}
				this.state = 1184;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1188;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1185;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1190;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1191;
			this.simpleIdentifier();
			this.state = 1206;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 155, this._ctx) ) {
			case 1:
				{
				this.state = 1195;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1192;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1197;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1198;
				this.match(KotlinParser.COLON);
				this.state = 1202;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1199;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1204;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1205;
				this.type_();
				}
				break;
			}
			this.state = 1222;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 158, this._ctx) ) {
			case 1:
				{
				this.state = 1211;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1208;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1213;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1214;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 1218;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 157, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1215;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1220;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 157, this._ctx);
				}
				this.state = 1221;
				this.expression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiVariableDeclaration(): MultiVariableDeclarationContext {
		let localctx: MultiVariableDeclarationContext = new MultiVariableDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, KotlinParser.RULE_multiVariableDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1224;
			this.match(KotlinParser.LPAREN);
			this.state = 1228;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 159, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1225;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1230;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 159, this._ctx);
			}
			this.state = 1231;
			this.variableDeclaration();
			this.state = 1248;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1235;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1232;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1237;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1238;
					this.match(KotlinParser.COMMA);
					this.state = 1242;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 161, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 1239;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 1244;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 161, this._ctx);
					}
					this.state = 1245;
					this.variableDeclaration();
					}
					}
				}
				this.state = 1250;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
			}
			this.state = 1258;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 164, this._ctx) ) {
			case 1:
				{
				this.state = 1254;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1251;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1256;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1257;
				this.match(KotlinParser.COMMA);
				}
				break;
			}
			this.state = 1263;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1260;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1265;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1266;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyDeclaration(): PropertyDeclarationContext {
		let localctx: PropertyDeclarationContext = new PropertyDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, KotlinParser.RULE_propertyDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1269;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 1268;
				this.modifiers();
				}
			}

			this.state = 1271;
			_la = this._input.LA(1);
			if(!(_la===78 || _la===79)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1279;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 168, this._ctx) ) {
			case 1:
				{
				this.state = 1275;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1272;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1277;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1278;
				this.typeParameters();
				}
				break;
			}
			this.state = 1296;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 171, this._ctx) ) {
			case 1:
				{
				this.state = 1284;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1281;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1286;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1287;
				this.receiverType();
				this.state = 1291;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1288;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1293;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1294;
				this.match(KotlinParser.DOT);
				}
				break;
			}
			{
			this.state = 1301;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 172, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1298;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1303;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 172, this._ctx);
			}
			this.state = 1306;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 9:
				{
				this.state = 1304;
				this.multiVariableDeclaration();
				}
				break;
			case 5:
			case 41:
			case 43:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 1305;
				this.variableDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
			this.state = 1315;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 175, this._ctx) ) {
			case 1:
				{
				this.state = 1311;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1308;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1313;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1314;
				this.typeConstraints();
				}
				break;
			}
			this.state = 1334;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 179, this._ctx) ) {
			case 1:
				{
				this.state = 1320;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1317;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1322;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1332;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 28:
					{
					this.state = 1323;
					this.match(KotlinParser.ASSIGNMENT);
					this.state = 1327;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 177, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 1324;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 1329;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 177, this._ctx);
					}
					this.state = 1330;
					this.expression();
					}
					break;
				case 82:
					{
					this.state = 1331;
					this.propertyDelegate();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			}
			this.state = 1343;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 181, this._ctx) ) {
			case 1:
				{
				this.state = 1339;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1336;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1341;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1342;
				this.match(KotlinParser.SEMICOLON);
				}
				break;
			}
			this.state = 1348;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 182, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1345;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1350;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 182, this._ctx);
			}
			this.state = 1381;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 191, this._ctx) ) {
			case 1:
				{
				this.state = 1352;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 183, this._ctx) ) {
				case 1:
					{
					this.state = 1351;
					this.getter();
					}
					break;
				}
				this.state = 1364;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 186, this._ctx) ) {
				case 1:
					{
					this.state = 1357;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 184, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 1354;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 1359;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 184, this._ctx);
					}
					this.state = 1361;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===5 || _la===27) {
						{
						this.state = 1360;
						this.semi();
						}
					}

					this.state = 1363;
					this.setter();
					}
					break;
				}
				}
				break;
			case 2:
				{
				this.state = 1367;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 187, this._ctx) ) {
				case 1:
					{
					this.state = 1366;
					this.setter();
					}
					break;
				}
				this.state = 1379;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 190, this._ctx) ) {
				case 1:
					{
					this.state = 1372;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 188, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 1369;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 1374;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 188, this._ctx);
					}
					this.state = 1376;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===5 || _la===27) {
						{
						this.state = 1375;
						this.semi();
						}
					}

					this.state = 1378;
					this.getter();
					}
					break;
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyDelegate(): PropertyDelegateContext {
		let localctx: PropertyDelegateContext = new PropertyDelegateContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, KotlinParser.RULE_propertyDelegate);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1383;
			this.match(KotlinParser.BY);
			this.state = 1387;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 192, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1384;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1389;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 192, this._ctx);
			}
			this.state = 1390;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public getter(): GetterContext {
		let localctx: GetterContext = new GetterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, KotlinParser.RULE_getter);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1393;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 1392;
				this.modifiers();
				}
			}

			this.state = 1395;
			this.match(KotlinParser.GET);
			this.state = 1433;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 200, this._ctx) ) {
			case 1:
				{
				this.state = 1399;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1396;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1401;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1402;
				this.match(KotlinParser.LPAREN);
				this.state = 1406;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1403;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1408;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1409;
				this.match(KotlinParser.RPAREN);
				this.state = 1424;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 198, this._ctx) ) {
				case 1:
					{
					this.state = 1413;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1410;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1415;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1416;
					this.match(KotlinParser.COLON);
					this.state = 1420;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1417;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1422;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1423;
					this.type_();
					}
					break;
				}
				this.state = 1429;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1426;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1431;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1432;
				this.functionBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public setter(): SetterContext {
		let localctx: SetterContext = new SetterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 82, KotlinParser.RULE_setter);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1436;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 1435;
				this.modifiers();
				}
			}

			this.state = 1438;
			this.match(KotlinParser.SET);
			this.state = 1493;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 211, this._ctx) ) {
			case 1:
				{
				this.state = 1442;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1439;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1444;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1445;
				this.match(KotlinParser.LPAREN);
				this.state = 1449;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1446;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1451;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1452;
				this.functionValueParameterWithOptionalType();
				this.state = 1460;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 205, this._ctx) ) {
				case 1:
					{
					this.state = 1456;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1453;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1458;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1459;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				this.state = 1465;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1462;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1467;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1468;
				this.match(KotlinParser.RPAREN);
				this.state = 1483;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 209, this._ctx) ) {
				case 1:
					{
					this.state = 1472;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1469;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1474;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1475;
					this.match(KotlinParser.COLON);
					this.state = 1479;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1476;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1481;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1482;
					this.type_();
					}
					break;
				}
				this.state = 1488;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1485;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1490;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1491;
				this.functionBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parametersWithOptionalType(): ParametersWithOptionalTypeContext {
		let localctx: ParametersWithOptionalTypeContext = new ParametersWithOptionalTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, KotlinParser.RULE_parametersWithOptionalType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1495;
			this.match(KotlinParser.LPAREN);
			this.state = 1499;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 212, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1496;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1501;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 212, this._ctx);
			}
			this.state = 1531;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 2143289349) !== 0) || ((((_la - 73)) & ~0x1F) === 0 && ((1 << (_la - 73)) & 3182337) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148) {
				{
				this.state = 1502;
				this.functionValueParameterWithOptionalType();
				this.state = 1519;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 215, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1506;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 1503;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 1508;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 1509;
						this.match(KotlinParser.COMMA);
						this.state = 1513;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 1510;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 1515;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 1516;
						this.functionValueParameterWithOptionalType();
						}
						}
					}
					this.state = 1521;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 215, this._ctx);
				}
				this.state = 1529;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 217, this._ctx) ) {
				case 1:
					{
					this.state = 1525;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1522;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1527;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1528;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				}
			}

			this.state = 1536;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1533;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1538;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1539;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionValueParameterWithOptionalType(): FunctionValueParameterWithOptionalTypeContext {
		let localctx: FunctionValueParameterWithOptionalTypeContext = new FunctionValueParameterWithOptionalTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, KotlinParser.RULE_functionValueParameterWithOptionalType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1542;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 220, this._ctx) ) {
			case 1:
				{
				this.state = 1541;
				this.parameterModifiers();
				}
				break;
			}
			this.state = 1544;
			this.parameterWithOptionalType();
			this.state = 1559;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 223, this._ctx) ) {
			case 1:
				{
				this.state = 1548;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1545;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1550;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1551;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 1555;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 222, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1552;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1557;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 222, this._ctx);
				}
				this.state = 1558;
				this.expression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterWithOptionalType(): ParameterWithOptionalTypeContext {
		let localctx: ParameterWithOptionalTypeContext = new ParameterWithOptionalTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 88, KotlinParser.RULE_parameterWithOptionalType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1561;
			this.simpleIdentifier();
			this.state = 1565;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 224, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1562;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1567;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 224, this._ctx);
			}
			this.state = 1576;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===26) {
				{
				this.state = 1568;
				this.match(KotlinParser.COLON);
				this.state = 1572;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1569;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1574;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1575;
				this.type_();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let localctx: ParameterContext = new ParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, KotlinParser.RULE_parameter);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1578;
			this.simpleIdentifier();
			this.state = 1582;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1579;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1584;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1585;
			this.match(KotlinParser.COLON);
			this.state = 1589;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1586;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1591;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1592;
			this.type_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectDeclaration(): ObjectDeclarationContext {
		let localctx: ObjectDeclarationContext = new ObjectDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, KotlinParser.RULE_objectDeclaration);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1595;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 1594;
				this.modifiers();
				}
			}

			this.state = 1597;
			this.match(KotlinParser.OBJECT);
			this.state = 1601;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1598;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1603;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1604;
			this.simpleIdentifier();
			this.state = 1619;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 233, this._ctx) ) {
			case 1:
				{
				this.state = 1608;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1605;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1610;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1611;
				this.match(KotlinParser.COLON);
				this.state = 1615;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 232, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1612;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1617;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 232, this._ctx);
				}
				this.state = 1618;
				this.delegationSpecifiers();
				}
				break;
			}
			this.state = 1628;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 235, this._ctx) ) {
			case 1:
				{
				this.state = 1624;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1621;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1626;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1627;
				this.classBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public secondaryConstructor(): SecondaryConstructorContext {
		let localctx: SecondaryConstructorContext = new SecondaryConstructorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, KotlinParser.RULE_secondaryConstructor);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1631;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===41 || _la===43 || ((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 234881023) !== 0)) {
				{
				this.state = 1630;
				this.modifiers();
				}
			}

			this.state = 1633;
			this.match(KotlinParser.CONSTRUCTOR);
			this.state = 1637;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1634;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1639;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1640;
			this.functionValueParameters();
			this.state = 1655;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 240, this._ctx) ) {
			case 1:
				{
				this.state = 1644;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1641;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1646;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1647;
				this.match(KotlinParser.COLON);
				this.state = 1651;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1648;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1653;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1654;
				this.constructorDelegationCall();
				}
				break;
			}
			this.state = 1660;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 241, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1657;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1662;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 241, this._ctx);
			}
			this.state = 1664;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 242, this._ctx) ) {
			case 1:
				{
				this.state = 1663;
				this.block();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constructorDelegationCall(): ConstructorDelegationCallContext {
		let localctx: ConstructorDelegationCallContext = new ConstructorDelegationCallContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, KotlinParser.RULE_constructorDelegationCall);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1666;
			_la = this._input.LA(1);
			if(!(_la===85 || _la===86)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1670;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1667;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1672;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1673;
			this.valueArguments();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumClassBody(): EnumClassBodyContext {
		let localctx: EnumClassBodyContext = new EnumClassBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 98, KotlinParser.RULE_enumClassBody);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1675;
			this.match(KotlinParser.LCURL);
			this.state = 1679;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 244, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1676;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1681;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 244, this._ctx);
			}
			this.state = 1683;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 2143289349) !== 0) || ((((_la - 73)) & ~0x1F) === 0 && ((1 << (_la - 73)) & 3182337) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148) {
				{
				this.state = 1682;
				this.enumEntries();
				}
			}

			this.state = 1699;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 248, this._ctx) ) {
			case 1:
				{
				this.state = 1688;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1685;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1690;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1691;
				this.match(KotlinParser.SEMICOLON);
				this.state = 1695;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 247, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1692;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 1697;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 247, this._ctx);
				}
				this.state = 1698;
				this.classMemberDeclarations();
				}
				break;
			}
			this.state = 1704;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1701;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1706;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1707;
			this.match(KotlinParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumEntries(): EnumEntriesContext {
		let localctx: EnumEntriesContext = new EnumEntriesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, KotlinParser.RULE_enumEntries);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1709;
			this.enumEntry();
			this.state = 1726;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 252, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1713;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1710;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1715;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1716;
					this.match(KotlinParser.COMMA);
					this.state = 1720;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1717;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1722;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1723;
					this.enumEntry();
					}
					}
				}
				this.state = 1728;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 252, this._ctx);
			}
			this.state = 1732;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 253, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1729;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1734;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 253, this._ctx);
			}
			this.state = 1736;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===8) {
				{
				this.state = 1735;
				this.match(KotlinParser.COMMA);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumEntry(): EnumEntryContext {
		let localctx: EnumEntryContext = new EnumEntryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, KotlinParser.RULE_enumEntry);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1745;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 256, this._ctx) ) {
			case 1:
				{
				this.state = 1738;
				this.modifiers();
				this.state = 1742;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1739;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1744;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
			this.state = 1747;
			this.simpleIdentifier();
			this.state = 1755;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 258, this._ctx) ) {
			case 1:
				{
				this.state = 1751;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1748;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1753;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1754;
				this.valueArguments();
				}
				break;
			}
			this.state = 1764;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 260, this._ctx) ) {
			case 1:
				{
				this.state = 1760;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1757;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1762;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1763;
				this.classBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public type_(): TypeContext {
		let localctx: TypeContext = new TypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, KotlinParser.RULE_type);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1767;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 261, this._ctx) ) {
			case 1:
				{
				this.state = 1766;
				this.typeModifiers();
				}
				break;
			}
			this.state = 1774;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 262, this._ctx) ) {
			case 1:
				{
				this.state = 1769;
				this.functionType();
				}
				break;
			case 2:
				{
				this.state = 1770;
				this.parenthesizedType();
				}
				break;
			case 3:
				{
				this.state = 1771;
				this.nullableType();
				}
				break;
			case 4:
				{
				this.state = 1772;
				this.typeReference();
				}
				break;
			case 5:
				{
				this.state = 1773;
				this.definitelyNonNullableType();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeReference(): TypeReferenceContext {
		let localctx: TypeReferenceContext = new TypeReferenceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, KotlinParser.RULE_typeReference);
		try {
			this.state = 1779;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 263, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1776;
				this.userType();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1777;
				this.match(KotlinParser.DYNAMIC);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1778;
				this.match(KotlinParser.AnyType);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public nullableType(): NullableTypeContext {
		let localctx: NullableTypeContext = new NullableTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, KotlinParser.RULE_nullableType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1783;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
			case 174:
				{
				this.state = 1781;
				this.typeReference();
				}
				break;
			case 9:
				{
				this.state = 1782;
				this.parenthesizedType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1788;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1785;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1790;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1792;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1791;
					this.quest();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1794;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 266, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public quest(): QuestContext {
		let localctx: QuestContext = new QuestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, KotlinParser.RULE_quest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1796;
			_la = this._input.LA(1);
			if(!(_la===45 || _la===46)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public userType(): UserTypeContext {
		let localctx: UserTypeContext = new UserTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 112, KotlinParser.RULE_userType);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1798;
			this.simpleUserType();
			this.state = 1815;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 269, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1802;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1799;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1804;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1805;
					this.match(KotlinParser.DOT);
					this.state = 1809;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1806;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1811;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1812;
					this.simpleUserType();
					}
					}
				}
				this.state = 1817;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 269, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simpleUserType(): SimpleUserTypeContext {
		let localctx: SimpleUserTypeContext = new SimpleUserTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 114, KotlinParser.RULE_simpleUserType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1818;
			this.simpleIdentifier();
			this.state = 1826;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 271, this._ctx) ) {
			case 1:
				{
				this.state = 1822;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1819;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1824;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1825;
				this.typeArguments();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeProjection(): TypeProjectionContext {
		let localctx: TypeProjectionContext = new TypeProjectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, KotlinParser.RULE_typeProjection);
		try {
			this.state = 1833;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 9:
			case 41:
			case 43:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 104:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
			case 174:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1829;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 272, this._ctx) ) {
				case 1:
					{
					this.state = 1828;
					this.typeProjectionModifiers();
					}
					break;
				}
				this.state = 1831;
				this.type_();
				}
				break;
			case 15:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1832;
				this.match(KotlinParser.MULT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeProjectionModifiers(): TypeProjectionModifiersContext {
		let localctx: TypeProjectionModifiersContext = new TypeProjectionModifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, KotlinParser.RULE_typeProjectionModifiers);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1836;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1835;
					this.typeProjectionModifier();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1838;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 274, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeProjectionModifier(): TypeProjectionModifierContext {
		let localctx: TypeProjectionModifierContext = new TypeProjectionModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, KotlinParser.RULE_typeProjectionModifier);
		let _la: number;
		try {
			this.state = 1848;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 104:
			case 107:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1840;
				this.varianceModifier();
				this.state = 1844;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1841;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1846;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 41:
			case 43:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1847;
				this.annotation();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionType(): FunctionTypeContext {
		let localctx: FunctionTypeContext = new FunctionTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, KotlinParser.RULE_functionType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1864;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 279, this._ctx) ) {
			case 1:
				{
				this.state = 1850;
				this.receiverType();
				this.state = 1854;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1851;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1856;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1857;
				this.match(KotlinParser.DOT);
				this.state = 1861;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1858;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1863;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
			this.state = 1866;
			this.functionTypeParameters();
			this.state = 1870;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1867;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1872;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1873;
			this.match(KotlinParser.ARROW);
			this.state = 1877;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1874;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1879;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1880;
			this.type_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionTypeParameters(): FunctionTypeParametersContext {
		let localctx: FunctionTypeParametersContext = new FunctionTypeParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, KotlinParser.RULE_functionTypeParameters);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1882;
			this.match(KotlinParser.LPAREN);
			this.state = 1886;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 282, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1883;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 1888;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 282, this._ctx);
			}
			this.state = 1891;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 283, this._ctx) ) {
			case 1:
				{
				this.state = 1889;
				this.parameter();
				}
				break;
			case 2:
				{
				this.state = 1890;
				this.type_();
				}
				break;
			}
			this.state = 1912;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 287, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1896;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1893;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1898;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1899;
					this.match(KotlinParser.COMMA);
					this.state = 1903;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 1900;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 1905;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 1908;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 286, this._ctx) ) {
					case 1:
						{
						this.state = 1906;
						this.parameter();
						}
						break;
					case 2:
						{
						this.state = 1907;
						this.type_();
						}
						break;
					}
					}
					}
				}
				this.state = 1914;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 287, this._ctx);
			}
			this.state = 1922;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 289, this._ctx) ) {
			case 1:
				{
				this.state = 1918;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 1915;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 1920;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1921;
				this.match(KotlinParser.COMMA);
				}
				break;
			}
			this.state = 1927;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1924;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1929;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1930;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parenthesizedType(): ParenthesizedTypeContext {
		let localctx: ParenthesizedTypeContext = new ParenthesizedTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, KotlinParser.RULE_parenthesizedType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1932;
			this.match(KotlinParser.LPAREN);
			this.state = 1936;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1933;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1938;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1939;
			this.type_();
			this.state = 1943;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1940;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1945;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1946;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public receiverType(): ReceiverTypeContext {
		let localctx: ReceiverTypeContext = new ReceiverTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 128, KotlinParser.RULE_receiverType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1949;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 293, this._ctx) ) {
			case 1:
				{
				this.state = 1948;
				this.typeModifiers();
				}
				break;
			}
			this.state = 1954;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 294, this._ctx) ) {
			case 1:
				{
				this.state = 1951;
				this.parenthesizedType();
				}
				break;
			case 2:
				{
				this.state = 1952;
				this.nullableType();
				}
				break;
			case 3:
				{
				this.state = 1953;
				this.typeReference();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parenthesizedUserType(): ParenthesizedUserTypeContext {
		let localctx: ParenthesizedUserTypeContext = new ParenthesizedUserTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, KotlinParser.RULE_parenthesizedUserType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1956;
			this.match(KotlinParser.LPAREN);
			this.state = 1960;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1957;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1962;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1965;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 1963;
				this.userType();
				}
				break;
			case 9:
				{
				this.state = 1964;
				this.parenthesizedUserType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1970;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1967;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1972;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1973;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public definitelyNonNullableType(): DefinitelyNonNullableTypeContext {
		let localctx: DefinitelyNonNullableTypeContext = new DefinitelyNonNullableTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, KotlinParser.RULE_definitelyNonNullableType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1976;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 298, this._ctx) ) {
			case 1:
				{
				this.state = 1975;
				this.typeModifiers();
				}
				break;
			}
			this.state = 1980;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 1978;
				this.userType();
				}
				break;
			case 9:
				{
				this.state = 1979;
				this.parenthesizedUserType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1985;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1982;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1987;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1988;
			this.match(KotlinParser.AMP);
			this.state = 1992;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 1989;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 1994;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1996;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 302, this._ctx) ) {
			case 1:
				{
				this.state = 1995;
				this.typeModifiers();
				}
				break;
			}
			this.state = 2000;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 1998;
				this.userType();
				}
				break;
			case 9:
				{
				this.state = 1999;
				this.parenthesizedUserType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public statements(): StatementsContext {
		let localctx: StatementsContext = new StatementsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, KotlinParser.RULE_statements);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2011;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 305, this._ctx) ) {
			case 1:
				{
				this.state = 2002;
				this.statement();
				this.state = 2008;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 304, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2003;
						this.semis();
						this.state = 2004;
						this.statement();
						}
						}
					}
					this.state = 2010;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 304, this._ctx);
				}
				}
				break;
			}
			this.state = 2014;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 306, this._ctx) ) {
			case 1:
				{
				this.state = 2013;
				this.semis();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let localctx: StatementContext = new StatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, KotlinParser.RULE_statement);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2020;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 308, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					this.state = 2018;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 63:
					case 64:
					case 65:
					case 66:
					case 67:
					case 68:
					case 69:
					case 70:
					case 71:
					case 73:
					case 81:
					case 82:
					case 83:
					case 84:
					case 88:
					case 93:
					case 94:
					case 107:
					case 108:
					case 109:
					case 110:
					case 111:
					case 112:
					case 113:
					case 114:
					case 115:
					case 116:
					case 117:
					case 118:
					case 119:
					case 120:
					case 121:
					case 122:
					case 123:
					case 124:
					case 125:
					case 126:
					case 127:
					case 128:
					case 129:
					case 130:
					case 131:
					case 132:
					case 133:
					case 134:
					case 135:
					case 136:
					case 148:
						{
						this.state = 2016;
						this.label();
						}
						break;
					case 41:
					case 43:
						{
						this.state = 2017;
						this.annotation();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
				}
				this.state = 2022;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 308, this._ctx);
			}
			this.state = 2027;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 309, this._ctx) ) {
			case 1:
				{
				this.state = 2023;
				this.declaration();
				}
				break;
			case 2:
				{
				this.state = 2024;
				this.assignment();
				}
				break;
			case 3:
				{
				this.state = 2025;
				this.loopStatement();
				}
				break;
			case 4:
				{
				this.state = 2026;
				this.expression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public label(): LabelContext {
		let localctx: LabelContext = new LabelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, KotlinParser.RULE_label);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2029;
			this.simpleIdentifier();
			this.state = 2030;
			_la = this._input.LA(1);
			if(!(_la===41 || _la===42)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 2034;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 310, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2031;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2036;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 310, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public controlStructureBody(): ControlStructureBodyContext {
		let localctx: ControlStructureBodyContext = new ControlStructureBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, KotlinParser.RULE_controlStructureBody);
		try {
			this.state = 2039;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 311, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2037;
				this.block();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2038;
				this.statement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let localctx: BlockContext = new BlockContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, KotlinParser.RULE_block);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2041;
			this.match(KotlinParser.LCURL);
			this.state = 2045;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 312, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2042;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2047;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 312, this._ctx);
			}
			this.state = 2049;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 313, this._ctx) ) {
			case 1:
				{
				this.state = 2048;
				this.statements();
				}
				break;
			}
			this.state = 2054;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2051;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2056;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2057;
			this.match(KotlinParser.RCURL);
			this.state = 2061;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 315, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2058;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2063;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 315, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public loopStatement(): LoopStatementContext {
		let localctx: LoopStatementContext = new LoopStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 144, KotlinParser.RULE_loopStatement);
		try {
			this.state = 2067;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2064;
				this.forStatement();
				}
				break;
			case 97:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2065;
				this.whileStatement();
				}
				break;
			case 96:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2066;
				this.doWhileStatement();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forStatement(): ForStatementContext {
		let localctx: ForStatementContext = new ForStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, KotlinParser.RULE_forStatement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2069;
			this.match(KotlinParser.FOR);
			this.state = 2073;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2070;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2075;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2076;
			this.match(KotlinParser.LPAREN);
			this.state = 2080;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 318, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2077;
					this.annotation();
					}
					}
				}
				this.state = 2082;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 318, this._ctx);
			}
			this.state = 2085;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 5:
			case 41:
			case 43:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 2083;
				this.variableDeclaration();
				}
				break;
			case 9:
				{
				this.state = 2084;
				this.multiVariableDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 2087;
			this.match(KotlinParser.IN);
			this.state = 2088;
			this.expression();
			this.state = 2089;
			this.match(KotlinParser.RPAREN);
			this.state = 2093;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 320, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2090;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2095;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 320, this._ctx);
			}
			this.state = 2097;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 321, this._ctx) ) {
			case 1:
				{
				this.state = 2096;
				this.controlStructureBody();
				}
				break;
			}
			this.state = 2102;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 322, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2099;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2104;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 322, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public whileStatement(): WhileStatementContext {
		let localctx: WhileStatementContext = new WhileStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, KotlinParser.RULE_whileStatement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2105;
			this.match(KotlinParser.WHILE);
			this.state = 2109;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2106;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2111;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2112;
			this.match(KotlinParser.LPAREN);
			this.state = 2113;
			this.expression();
			this.state = 2114;
			this.match(KotlinParser.RPAREN);
			this.state = 2118;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 324, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2115;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2120;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 324, this._ctx);
			}
			this.state = 2123;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 5:
			case 9:
			case 11:
			case 13:
			case 18:
			case 19:
			case 20:
			case 21:
			case 24:
			case 25:
			case 38:
			case 41:
			case 43:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 74:
			case 75:
			case 76:
			case 77:
			case 78:
			case 79:
			case 80:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 88:
			case 89:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 97:
			case 98:
			case 99:
			case 100:
			case 101:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 137:
			case 140:
			case 141:
			case 142:
			case 143:
			case 144:
			case 145:
			case 146:
			case 147:
			case 148:
			case 151:
			case 152:
			case 174:
				{
				this.state = 2121;
				this.controlStructureBody();
				}
				break;
			case 27:
				{
				this.state = 2122;
				this.match(KotlinParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 2128;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 326, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2125;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2130;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 326, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public doWhileStatement(): DoWhileStatementContext {
		let localctx: DoWhileStatementContext = new DoWhileStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, KotlinParser.RULE_doWhileStatement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2131;
			this.match(KotlinParser.DO);
			this.state = 2135;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 327, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2132;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2137;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 327, this._ctx);
			}
			this.state = 2139;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 328, this._ctx) ) {
			case 1:
				{
				this.state = 2138;
				this.controlStructureBody();
				}
				break;
			}
			this.state = 2144;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2141;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2146;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2147;
			this.match(KotlinParser.WHILE);
			this.state = 2151;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2148;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2153;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2154;
			this.match(KotlinParser.LPAREN);
			this.state = 2155;
			this.expression();
			this.state = 2156;
			this.match(KotlinParser.RPAREN);
			this.state = 2160;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 331, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2157;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2162;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 331, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let localctx: AssignmentContext = new AssignmentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, KotlinParser.RULE_assignment);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2169;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 332, this._ctx) ) {
			case 1:
				{
				this.state = 2163;
				this.directlyAssignableExpression();
				this.state = 2164;
				this.match(KotlinParser.ASSIGNMENT);
				}
				break;
			case 2:
				{
				this.state = 2166;
				this.assignableExpression();
				this.state = 2167;
				this.assignmentAndOperator();
				}
				break;
			}
			this.state = 2174;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 333, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2171;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2176;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 333, this._ctx);
			}
			this.state = 2177;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public semi(): SemiContext {
		let localctx: SemiContext = new SemiContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, KotlinParser.RULE_semi);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2179;
			_la = this._input.LA(1);
			if(!(_la===5 || _la===27)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 2183;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 334, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2180;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2185;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 334, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public semis(): SemisContext {
		let localctx: SemisContext = new SemisContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, KotlinParser.RULE_semis);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2187;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 2186;
					_la = this._input.LA(1);
					if(!(_la===5 || _la===27)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 2189;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 335, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, KotlinParser.RULE_expression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2191;
			this.disjunction();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public disjunction(): DisjunctionContext {
		let localctx: DisjunctionContext = new DisjunctionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, KotlinParser.RULE_disjunction);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2193;
			this.conjunction();
			this.state = 2210;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 338, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2197;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2194;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2199;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2200;
					this.match(KotlinParser.DISJ);
					this.state = 2204;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 337, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2201;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2206;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 337, this._ctx);
					}
					this.state = 2207;
					this.conjunction();
					}
					}
				}
				this.state = 2212;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 338, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public conjunction(): ConjunctionContext {
		let localctx: ConjunctionContext = new ConjunctionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, KotlinParser.RULE_conjunction);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2213;
			this.equality();
			this.state = 2230;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 341, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2217;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2214;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2219;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2220;
					this.match(KotlinParser.CONJ);
					this.state = 2224;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 340, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2221;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2226;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 340, this._ctx);
					}
					this.state = 2227;
					this.equality();
					}
					}
				}
				this.state = 2232;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 341, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public equality(): EqualityContext {
		let localctx: EqualityContext = new EqualityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 164, KotlinParser.RULE_equality);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2233;
			this.comparison();
			this.state = 2245;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 343, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2234;
					this.equalityOperator();
					this.state = 2238;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 342, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2235;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2240;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 342, this._ctx);
					}
					this.state = 2241;
					this.comparison();
					}
					}
				}
				this.state = 2247;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 343, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparison(): ComparisonContext {
		let localctx: ComparisonContext = new ComparisonContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, KotlinParser.RULE_comparison);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2248;
			this.genericCallLikeComparison();
			this.state = 2260;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 345, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2249;
					this.comparisonOperator();
					this.state = 2253;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 344, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2250;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2255;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 344, this._ctx);
					}
					this.state = 2256;
					this.genericCallLikeComparison();
					}
					}
				}
				this.state = 2262;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 345, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public genericCallLikeComparison(): GenericCallLikeComparisonContext {
		let localctx: GenericCallLikeComparisonContext = new GenericCallLikeComparisonContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, KotlinParser.RULE_genericCallLikeComparison);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2263;
			this.infixOperation();
			this.state = 2267;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 346, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2264;
					this.callSuffix();
					}
					}
				}
				this.state = 2269;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 346, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public infixOperation(): InfixOperationContext {
		let localctx: InfixOperationContext = new InfixOperationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, KotlinParser.RULE_infixOperation);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2270;
			this.elvisExpression();
			this.state = 2291;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 350, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					this.state = 2289;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 104:
					case 106:
						{
						this.state = 2271;
						this.inOperator();
						this.state = 2275;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 347, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 2272;
								this.match(KotlinParser.NL);
								}
								}
							}
							this.state = 2277;
							this._errHandler.sync(this);
							_alt = this._interp.adaptivePredict(this._input, 347, this._ctx);
						}
						this.state = 2278;
						this.elvisExpression();
						}
						break;
					case 103:
					case 105:
						{
						this.state = 2280;
						this.isOperator();
						this.state = 2284;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 2281;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 2286;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 2287;
						this.type_();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
				}
				this.state = 2293;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 350, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elvisExpression(): ElvisExpressionContext {
		let localctx: ElvisExpressionContext = new ElvisExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, KotlinParser.RULE_elvisExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2294;
			this.infixFunctionCall();
			this.state = 2312;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 353, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2298;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2295;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2300;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2301;
					this.elvis();
					this.state = 2305;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 352, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2302;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2307;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 352, this._ctx);
					}
					this.state = 2308;
					this.infixFunctionCall();
					}
					}
				}
				this.state = 2314;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 353, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elvis(): ElvisContext {
		let localctx: ElvisContext = new ElvisContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, KotlinParser.RULE_elvis);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2315;
			this.match(KotlinParser.QUEST_NO_WS);
			this.state = 2316;
			this.match(KotlinParser.COLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public infixFunctionCall(): InfixFunctionCallContext {
		let localctx: InfixFunctionCallContext = new InfixFunctionCallContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, KotlinParser.RULE_infixFunctionCall);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2318;
			this.rangeExpression();
			this.state = 2330;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 355, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2319;
					this.simpleIdentifier();
					this.state = 2323;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 354, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2320;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2325;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 354, this._ctx);
					}
					this.state = 2326;
					this.rangeExpression();
					}
					}
				}
				this.state = 2332;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 355, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rangeExpression(): RangeExpressionContext {
		let localctx: RangeExpressionContext = new RangeExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, KotlinParser.RULE_rangeExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2333;
			this.additiveExpression();
			this.state = 2344;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 357, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2334;
					_la = this._input.LA(1);
					if(!(_la===36 || _la===37)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					this.state = 2338;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 356, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2335;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2340;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 356, this._ctx);
					}
					this.state = 2341;
					this.additiveExpression();
					}
					}
				}
				this.state = 2346;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 357, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public additiveExpression(): AdditiveExpressionContext {
		let localctx: AdditiveExpressionContext = new AdditiveExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, KotlinParser.RULE_additiveExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2347;
			this.multiplicativeExpression();
			this.state = 2359;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 359, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2348;
					this.additiveOperator();
					this.state = 2352;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 358, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2349;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2354;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 358, this._ctx);
					}
					this.state = 2355;
					this.multiplicativeExpression();
					}
					}
				}
				this.state = 2361;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 359, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiplicativeExpression(): MultiplicativeExpressionContext {
		let localctx: MultiplicativeExpressionContext = new MultiplicativeExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, KotlinParser.RULE_multiplicativeExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2362;
			this.asExpression();
			this.state = 2374;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 361, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2363;
					this.multiplicativeOperator();
					this.state = 2367;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 360, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2364;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2369;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 360, this._ctx);
					}
					this.state = 2370;
					this.asExpression();
					}
					}
				}
				this.state = 2376;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 361, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public asExpression(): AsExpressionContext {
		let localctx: AsExpressionContext = new AsExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, KotlinParser.RULE_asExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2377;
			this.prefixUnaryExpression();
			this.state = 2395;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 364, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2381;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2378;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2383;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2384;
					this.asOperator();
					this.state = 2388;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2385;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2390;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2391;
					this.type_();
					}
					}
				}
				this.state = 2397;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 364, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public prefixUnaryExpression(): PrefixUnaryExpressionContext {
		let localctx: PrefixUnaryExpressionContext = new PrefixUnaryExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 186, KotlinParser.RULE_prefixUnaryExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2401;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 365, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2398;
					this.unaryPrefix();
					}
					}
				}
				this.state = 2403;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 365, this._ctx);
			}
			this.state = 2404;
			this.postfixUnaryExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unaryPrefix(): UnaryPrefixContext {
		let localctx: UnaryPrefixContext = new UnaryPrefixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 188, KotlinParser.RULE_unaryPrefix);
		try {
			let _alt: number;
			this.state = 2415;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 41:
			case 43:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2406;
				this.annotation();
				}
				break;
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2407;
				this.label();
				}
				break;
			case 18:
			case 19:
			case 20:
			case 21:
			case 24:
			case 25:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2408;
				this.prefixUnaryOperator();
				this.state = 2412;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 366, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2409;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 2414;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 366, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public postfixUnaryExpression(): PostfixUnaryExpressionContext {
		let localctx: PostfixUnaryExpressionContext = new PostfixUnaryExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 190, KotlinParser.RULE_postfixUnaryExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2417;
			this.primaryExpression();
			this.state = 2421;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 368, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2418;
					this.postfixUnarySuffix();
					}
					}
				}
				this.state = 2423;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 368, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public postfixUnarySuffix(): PostfixUnarySuffixContext {
		let localctx: PostfixUnarySuffixContext = new PostfixUnarySuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, KotlinParser.RULE_postfixUnarySuffix);
		try {
			this.state = 2429;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 369, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2424;
				this.postfixUnaryOperator();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2425;
				this.typeArguments();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2426;
				this.callSuffix();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2427;
				this.indexingSuffix();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2428;
				this.navigationSuffix();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public directlyAssignableExpression(): DirectlyAssignableExpressionContext {
		let localctx: DirectlyAssignableExpressionContext = new DirectlyAssignableExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, KotlinParser.RULE_directlyAssignableExpression);
		try {
			this.state = 2436;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 370, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2431;
				this.postfixUnaryExpression();
				this.state = 2432;
				this.assignableSuffix();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2434;
				this.simpleIdentifier();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2435;
				this.parenthesizedDirectlyAssignableExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parenthesizedDirectlyAssignableExpression(): ParenthesizedDirectlyAssignableExpressionContext {
		let localctx: ParenthesizedDirectlyAssignableExpressionContext = new ParenthesizedDirectlyAssignableExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 196, KotlinParser.RULE_parenthesizedDirectlyAssignableExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2438;
			this.match(KotlinParser.LPAREN);
			this.state = 2442;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 371, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2439;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2444;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 371, this._ctx);
			}
			this.state = 2445;
			this.directlyAssignableExpression();
			this.state = 2449;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2446;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2451;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2452;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public assignableExpression(): AssignableExpressionContext {
		let localctx: AssignableExpressionContext = new AssignableExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 198, KotlinParser.RULE_assignableExpression);
		try {
			this.state = 2456;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 373, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2454;
				this.prefixUnaryExpression();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2455;
				this.parenthesizedAssignableExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parenthesizedAssignableExpression(): ParenthesizedAssignableExpressionContext {
		let localctx: ParenthesizedAssignableExpressionContext = new ParenthesizedAssignableExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 200, KotlinParser.RULE_parenthesizedAssignableExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2458;
			this.match(KotlinParser.LPAREN);
			this.state = 2462;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 374, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2459;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2464;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 374, this._ctx);
			}
			this.state = 2465;
			this.assignableExpression();
			this.state = 2469;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2466;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2471;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2472;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public assignableSuffix(): AssignableSuffixContext {
		let localctx: AssignableSuffixContext = new AssignableSuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, KotlinParser.RULE_assignableSuffix);
		try {
			this.state = 2477;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 47:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2474;
				this.typeArguments();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2475;
				this.indexingSuffix();
				}
				break;
			case 5:
			case 7:
			case 38:
			case 46:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2476;
				this.navigationSuffix();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public indexingSuffix(): IndexingSuffixContext {
		let localctx: IndexingSuffixContext = new IndexingSuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 204, KotlinParser.RULE_indexingSuffix);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2479;
			this.match(KotlinParser.LSQUARE);
			this.state = 2483;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 377, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2480;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2485;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 377, this._ctx);
			}
			this.state = 2486;
			this.expression();
			this.state = 2503;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 380, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2490;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2487;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2492;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2493;
					this.match(KotlinParser.COMMA);
					this.state = 2497;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 379, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2494;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2499;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 379, this._ctx);
					}
					this.state = 2500;
					this.expression();
					}
					}
				}
				this.state = 2505;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 380, this._ctx);
			}
			this.state = 2513;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 382, this._ctx) ) {
			case 1:
				{
				this.state = 2509;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2506;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2511;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2512;
				this.match(KotlinParser.COMMA);
				}
				break;
			}
			this.state = 2518;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2515;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2520;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2521;
			this.match(KotlinParser.RSQUARE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public navigationSuffix(): NavigationSuffixContext {
		let localctx: NavigationSuffixContext = new NavigationSuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 206, KotlinParser.RULE_navigationSuffix);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2523;
			this.memberAccessOperator();
			this.state = 2527;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2524;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2529;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2533;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 2530;
				this.simpleIdentifier();
				}
				break;
			case 9:
				{
				this.state = 2531;
				this.parenthesizedExpression();
				}
				break;
			case 74:
				{
				this.state = 2532;
				this.match(KotlinParser.CLASS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public callSuffix(): CallSuffixContext {
		let localctx: CallSuffixContext = new CallSuffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 208, KotlinParser.RULE_callSuffix);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2536;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===47) {
				{
				this.state = 2535;
				this.typeArguments();
				}
			}

			this.state = 2543;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 388, this._ctx) ) {
			case 1:
				{
				this.state = 2539;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===9) {
					{
					this.state = 2538;
					this.valueArguments();
					}
				}

				this.state = 2541;
				this.annotatedLambda();
				}
				break;
			case 2:
				{
				this.state = 2542;
				this.valueArguments();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotatedLambda(): AnnotatedLambdaContext {
		let localctx: AnnotatedLambdaContext = new AnnotatedLambdaContext(this, this._ctx, this.state);
		this.enterRule(localctx, 210, KotlinParser.RULE_annotatedLambda);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2548;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===41 || _la===43) {
				{
				{
				this.state = 2545;
				this.annotation();
				}
				}
				this.state = 2550;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2552;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 63)) & ~0x1F) === 0 && ((1 << (_la - 63)) & 3258713599) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148) {
				{
				this.state = 2551;
				this.label();
				}
			}

			this.state = 2557;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2554;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2559;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2560;
			this.lambdaLiteral();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeArguments(): TypeArgumentsContext {
		let localctx: TypeArgumentsContext = new TypeArgumentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 212, KotlinParser.RULE_typeArguments);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2562;
			this.match(KotlinParser.LANGLE);
			this.state = 2566;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2563;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2568;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2569;
			this.typeProjection();
			this.state = 2586;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 395, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2573;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2570;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2575;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2576;
					this.match(KotlinParser.COMMA);
					this.state = 2580;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2577;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2582;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2583;
					this.typeProjection();
					}
					}
				}
				this.state = 2588;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 395, this._ctx);
			}
			this.state = 2596;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 397, this._ctx) ) {
			case 1:
				{
				this.state = 2592;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2589;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2594;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2595;
				this.match(KotlinParser.COMMA);
				}
				break;
			}
			this.state = 2601;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2598;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2603;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2604;
			this.match(KotlinParser.RANGLE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueArguments(): ValueArgumentsContext {
		let localctx: ValueArgumentsContext = new ValueArgumentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 214, KotlinParser.RULE_valueArguments);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2606;
			this.match(KotlinParser.LPAREN);
			this.state = 2610;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 399, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2607;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2612;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 399, this._ctx);
			}
			this.state = 2648;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 54307360) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 4293918761) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 4058904779) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 2147483647) !== 0) || ((((_la - 140)) & ~0x1F) === 0 && ((1 << (_la - 140)) & 6655) !== 0) || _la===174) {
				{
				this.state = 2613;
				this.valueArgument();
				this.state = 2630;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 402, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2617;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 2614;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 2619;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 2620;
						this.match(KotlinParser.COMMA);
						this.state = 2624;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 401, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 2621;
								this.match(KotlinParser.NL);
								}
								}
							}
							this.state = 2626;
							this._errHandler.sync(this);
							_alt = this._interp.adaptivePredict(this._input, 401, this._ctx);
						}
						this.state = 2627;
						this.valueArgument();
						}
						}
					}
					this.state = 2632;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 402, this._ctx);
				}
				this.state = 2640;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 404, this._ctx) ) {
				case 1:
					{
					this.state = 2636;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2633;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2638;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2639;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				this.state = 2645;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2642;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2647;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 2650;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueArgument(): ValueArgumentContext {
		let localctx: ValueArgumentContext = new ValueArgumentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 216, KotlinParser.RULE_valueArgument);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2653;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 407, this._ctx) ) {
			case 1:
				{
				this.state = 2652;
				this.annotation();
				}
				break;
			}
			this.state = 2658;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 408, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2655;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2660;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 408, this._ctx);
			}
			this.state = 2675;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 411, this._ctx) ) {
			case 1:
				{
				this.state = 2661;
				this.simpleIdentifier();
				this.state = 2665;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2662;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2667;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2668;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 2672;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 410, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2669;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 2674;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 410, this._ctx);
				}
				}
				break;
			}
			this.state = 2678;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===15) {
				{
				this.state = 2677;
				this.match(KotlinParser.MULT);
				}
			}

			this.state = 2683;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 413, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2680;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2685;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 413, this._ctx);
			}
			this.state = 2686;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public primaryExpression(): PrimaryExpressionContext {
		let localctx: PrimaryExpressionContext = new PrimaryExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, KotlinParser.RULE_primaryExpression);
		try {
			this.state = 2702;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 414, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2688;
				this.parenthesizedExpression();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2689;
				this.simpleIdentifier();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2690;
				this.literalConstant();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2691;
				this.stringLiteral();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2692;
				this.callableReference();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2693;
				this.functionLiteral();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 2694;
				this.objectLiteral();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 2695;
				this.collectionLiteral();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 2696;
				this.thisExpression();
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 2697;
				this.superExpression();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 2698;
				this.ifExpression();
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 2699;
				this.whenExpression();
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 2700;
				this.tryExpression();
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 2701;
				this.jumpExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parenthesizedExpression(): ParenthesizedExpressionContext {
		let localctx: ParenthesizedExpressionContext = new ParenthesizedExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 220, KotlinParser.RULE_parenthesizedExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2704;
			this.match(KotlinParser.LPAREN);
			this.state = 2708;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 415, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2705;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2710;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 415, this._ctx);
			}
			this.state = 2711;
			this.expression();
			this.state = 2715;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2712;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2717;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2718;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public collectionLiteral(): CollectionLiteralContext {
		let localctx: CollectionLiteralContext = new CollectionLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 222, KotlinParser.RULE_collectionLiteral);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2720;
			this.match(KotlinParser.LSQUARE);
			this.state = 2724;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 417, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2721;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2726;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 417, this._ctx);
			}
			this.state = 2762;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 54274592) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 4293918761) !== 0) || ((((_la - 70)) & ~0x1F) === 0 && ((1 << (_la - 70)) & 4058904779) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 2147483647) !== 0) || ((((_la - 140)) & ~0x1F) === 0 && ((1 << (_la - 140)) & 6655) !== 0) || _la===174) {
				{
				this.state = 2727;
				this.expression();
				this.state = 2744;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 420, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2731;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 2728;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 2733;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 2734;
						this.match(KotlinParser.COMMA);
						this.state = 2738;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 419, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 2735;
								this.match(KotlinParser.NL);
								}
								}
							}
							this.state = 2740;
							this._errHandler.sync(this);
							_alt = this._interp.adaptivePredict(this._input, 419, this._ctx);
						}
						this.state = 2741;
						this.expression();
						}
						}
					}
					this.state = 2746;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 420, this._ctx);
				}
				this.state = 2754;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 422, this._ctx) ) {
				case 1:
					{
					this.state = 2750;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2747;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2752;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2753;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				this.state = 2759;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2756;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2761;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 2764;
			this.match(KotlinParser.RSQUARE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public literalConstant(): LiteralConstantContext {
		let localctx: LiteralConstantContext = new LiteralConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 224, KotlinParser.RULE_literalConstant);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2766;
			_la = this._input.LA(1);
			if(!(((((_la - 137)) & ~0x1F) === 0 && ((1 << (_la - 137)) & 2041) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stringLiteral(): StringLiteralContext {
		let localctx: StringLiteralContext = new StringLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 226, KotlinParser.RULE_stringLiteral);
		try {
			this.state = 2770;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 151:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2768;
				this.lineStringLiteral();
				}
				break;
			case 152:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2769;
				this.multiLineStringLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lineStringLiteral(): LineStringLiteralContext {
		let localctx: LineStringLiteralContext = new LineStringLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 228, KotlinParser.RULE_lineStringLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2772;
			this.match(KotlinParser.QUOTE_OPEN);
			this.state = 2777;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 161)) & ~0x1F) === 0 && ((1 << (_la - 161)) & 15) !== 0)) {
				{
				this.state = 2775;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 161:
				case 162:
				case 163:
					{
					this.state = 2773;
					this.lineStringContent();
					}
					break;
				case 164:
					{
					this.state = 2774;
					this.lineStringExpression();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 2779;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2780;
			this.match(KotlinParser.QUOTE_CLOSE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiLineStringLiteral(): MultiLineStringLiteralContext {
		let localctx: MultiLineStringLiteralContext = new MultiLineStringLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 230, KotlinParser.RULE_multiLineStringLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2782;
			this.match(KotlinParser.TRIPLE_QUOTE_OPEN);
			this.state = 2788;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 166)) & ~0x1F) === 0 && ((1 << (_la - 166)) & 15) !== 0)) {
				{
				this.state = 2786;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 428, this._ctx) ) {
				case 1:
					{
					this.state = 2783;
					this.multiLineStringContent();
					}
					break;
				case 2:
					{
					this.state = 2784;
					this.multiLineStringExpression();
					}
					break;
				case 3:
					{
					this.state = 2785;
					this.match(KotlinParser.MultiLineStringQuote);
					}
					break;
				}
				}
				this.state = 2790;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2791;
			this.match(KotlinParser.TRIPLE_QUOTE_CLOSE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lineStringContent(): LineStringContentContext {
		let localctx: LineStringContentContext = new LineStringContentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 232, KotlinParser.RULE_lineStringContent);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2793;
			_la = this._input.LA(1);
			if(!(((((_la - 161)) & ~0x1F) === 0 && ((1 << (_la - 161)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lineStringExpression(): LineStringExpressionContext {
		let localctx: LineStringExpressionContext = new LineStringExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 234, KotlinParser.RULE_lineStringExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2795;
			this.match(KotlinParser.LineStrExprStart);
			this.state = 2799;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 430, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2796;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2801;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 430, this._ctx);
			}
			this.state = 2802;
			this.expression();
			this.state = 2806;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2803;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2808;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2809;
			this.match(KotlinParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiLineStringContent(): MultiLineStringContentContext {
		let localctx: MultiLineStringContentContext = new MultiLineStringContentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 236, KotlinParser.RULE_multiLineStringContent);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2811;
			_la = this._input.LA(1);
			if(!(((((_la - 166)) & ~0x1F) === 0 && ((1 << (_la - 166)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiLineStringExpression(): MultiLineStringExpressionContext {
		let localctx: MultiLineStringExpressionContext = new MultiLineStringExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 238, KotlinParser.RULE_multiLineStringExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2813;
			this.match(KotlinParser.MultiLineStrExprStart);
			this.state = 2817;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 432, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2814;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2819;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 432, this._ctx);
			}
			this.state = 2820;
			this.expression();
			this.state = 2824;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2821;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2826;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2827;
			this.match(KotlinParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambdaLiteral(): LambdaLiteralContext {
		let localctx: LambdaLiteralContext = new LambdaLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 240, KotlinParser.RULE_lambdaLiteral);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2829;
			this.match(KotlinParser.LCURL);
			this.state = 2833;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 434, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2830;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 2835;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 434, this._ctx);
			}
			this.state = 2852;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 438, this._ctx) ) {
			case 1:
				{
				this.state = 2837;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 435, this._ctx) ) {
				case 1:
					{
					this.state = 2836;
					this.lambdaParameters();
					}
					break;
				}
				this.state = 2842;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2839;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2844;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2845;
				this.match(KotlinParser.ARROW);
				this.state = 2849;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 437, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2846;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 2851;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 437, this._ctx);
				}
				}
				break;
			}
			this.state = 2854;
			this.statements();
			this.state = 2858;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2855;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2860;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2861;
			this.match(KotlinParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambdaParameters(): LambdaParametersContext {
		let localctx: LambdaParametersContext = new LambdaParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 242, KotlinParser.RULE_lambdaParameters);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2863;
			this.lambdaParameter();
			this.state = 2880;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 442, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2867;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2864;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2869;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2870;
					this.match(KotlinParser.COMMA);
					this.state = 2874;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 441, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 2871;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 2876;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 441, this._ctx);
					}
					this.state = 2877;
					this.lambdaParameter();
					}
					}
				}
				this.state = 2882;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 442, this._ctx);
			}
			this.state = 2890;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 444, this._ctx) ) {
			case 1:
				{
				this.state = 2886;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2883;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2888;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2889;
				this.match(KotlinParser.COMMA);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambdaParameter(): LambdaParameterContext {
		let localctx: LambdaParameterContext = new LambdaParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 244, KotlinParser.RULE_lambdaParameter);
		let _la: number;
		try {
			this.state = 2910;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 5:
			case 41:
			case 43:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2892;
				this.variableDeclaration();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2893;
				this.multiVariableDeclaration();
				this.state = 2908;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 447, this._ctx) ) {
				case 1:
					{
					this.state = 2897;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2894;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2899;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2900;
					this.match(KotlinParser.COLON);
					this.state = 2904;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 2901;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 2906;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 2907;
					this.type_();
					}
					break;
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public anonymousFunction(): AnonymousFunctionContext {
		let localctx: AnonymousFunctionContext = new AnonymousFunctionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 246, KotlinParser.RULE_anonymousFunction);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2913;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===124) {
				{
				this.state = 2912;
				this.match(KotlinParser.SUSPEND);
				}
			}

			this.state = 2918;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2915;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2920;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2921;
			this.match(KotlinParser.FUN);
			this.state = 2937;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 453, this._ctx) ) {
			case 1:
				{
				this.state = 2925;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2922;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2927;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2928;
				this.type_();
				this.state = 2932;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2929;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2934;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2935;
				this.match(KotlinParser.DOT);
				}
				break;
			}
			this.state = 2942;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2939;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2944;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2945;
			this.parametersWithOptionalType();
			this.state = 2960;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 457, this._ctx) ) {
			case 1:
				{
				this.state = 2949;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2946;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2951;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2952;
				this.match(KotlinParser.COLON);
				this.state = 2956;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2953;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2958;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2959;
				this.type_();
				}
				break;
			}
			this.state = 2969;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 459, this._ctx) ) {
			case 1:
				{
				this.state = 2965;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2962;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2967;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2968;
				this.typeConstraints();
				}
				break;
			}
			this.state = 2978;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 461, this._ctx) ) {
			case 1:
				{
				this.state = 2974;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2971;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2976;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2977;
				this.functionBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionLiteral(): FunctionLiteralContext {
		let localctx: FunctionLiteralContext = new FunctionLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 248, KotlinParser.RULE_functionLiteral);
		try {
			this.state = 2982;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 13:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2980;
				this.lambdaLiteral();
				}
				break;
			case 5:
			case 76:
			case 124:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2981;
				this.anonymousFunction();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectLiteral(): ObjectLiteralContext {
		let localctx: ObjectLiteralContext = new ObjectLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 250, KotlinParser.RULE_objectLiteral);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2985;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===116) {
				{
				this.state = 2984;
				this.match(KotlinParser.DATA);
				}
			}

			this.state = 2990;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 2987;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 2992;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2993;
			this.match(KotlinParser.OBJECT);
			this.state = 3014;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 468, this._ctx) ) {
			case 1:
				{
				this.state = 2997;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 2994;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 2999;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3000;
				this.match(KotlinParser.COLON);
				this.state = 3004;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 466, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3001;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3006;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 466, this._ctx);
				}
				this.state = 3007;
				this.delegationSpecifiers();
				this.state = 3011;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 467, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3008;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3013;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 467, this._ctx);
				}
				}
				break;
			}
			this.state = 3023;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 470, this._ctx) ) {
			case 1:
				{
				this.state = 3019;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3016;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3021;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3022;
				this.classBody();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public thisExpression(): ThisExpressionContext {
		let localctx: ThisExpressionContext = new ThisExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 252, KotlinParser.RULE_thisExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3025;
			_la = this._input.LA(1);
			if(!(_la===61 || _la===85)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public superExpression(): SuperExpressionContext {
		let localctx: SuperExpressionContext = new SuperExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 254, KotlinParser.RULE_superExpression);
		let _la: number;
		try {
			this.state = 3051;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 86:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3027;
				this.match(KotlinParser.SUPER);
				this.state = 3044;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 473, this._ctx) ) {
				case 1:
					{
					this.state = 3028;
					this.match(KotlinParser.LANGLE);
					this.state = 3032;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 3029;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 3034;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 3035;
					this.type_();
					this.state = 3039;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 3036;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 3041;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 3042;
					this.match(KotlinParser.RANGLE);
					}
					break;
				}
				this.state = 3048;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 474, this._ctx) ) {
				case 1:
					{
					this.state = 3046;
					this.match(KotlinParser.AT_NO_WS);
					this.state = 3047;
					this.simpleIdentifier();
					}
					break;
				}
				}
				break;
			case 62:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3050;
				this.match(KotlinParser.SUPER_AT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public ifExpression(): IfExpressionContext {
		let localctx: IfExpressionContext = new IfExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 256, KotlinParser.RULE_ifExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3053;
			this.match(KotlinParser.IF);
			this.state = 3057;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3054;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3059;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3060;
			this.match(KotlinParser.LPAREN);
			this.state = 3064;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 477, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3061;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3066;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 477, this._ctx);
			}
			this.state = 3067;
			this.expression();
			this.state = 3071;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3068;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3073;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3074;
			this.match(KotlinParser.RPAREN);
			this.state = 3078;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 479, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3075;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3080;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 479, this._ctx);
			}
			this.state = 3112;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 486, this._ctx) ) {
			case 1:
				{
				this.state = 3081;
				this.controlStructureBody();
				}
				break;
			case 2:
				{
				this.state = 3083;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 480, this._ctx) ) {
				case 1:
					{
					this.state = 3082;
					this.controlStructureBody();
					}
					break;
				}
				this.state = 3088;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 481, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3085;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3090;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 481, this._ctx);
				}
				this.state = 3092;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===27) {
					{
					this.state = 3091;
					this.match(KotlinParser.SEMICOLON);
					}
				}

				this.state = 3097;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3094;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3099;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3100;
				this.match(KotlinParser.ELSE);
				this.state = 3104;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 484, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3101;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3106;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 484, this._ctx);
				}
				this.state = 3109;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 5:
				case 9:
				case 11:
				case 13:
				case 18:
				case 19:
				case 20:
				case 21:
				case 24:
				case 25:
				case 38:
				case 41:
				case 43:
				case 58:
				case 59:
				case 60:
				case 61:
				case 62:
				case 63:
				case 64:
				case 65:
				case 66:
				case 67:
				case 68:
				case 69:
				case 70:
				case 71:
				case 73:
				case 74:
				case 75:
				case 76:
				case 77:
				case 78:
				case 79:
				case 80:
				case 81:
				case 82:
				case 83:
				case 84:
				case 85:
				case 86:
				case 88:
				case 89:
				case 91:
				case 92:
				case 93:
				case 94:
				case 95:
				case 96:
				case 97:
				case 98:
				case 99:
				case 100:
				case 101:
				case 107:
				case 108:
				case 109:
				case 110:
				case 111:
				case 112:
				case 113:
				case 114:
				case 115:
				case 116:
				case 117:
				case 118:
				case 119:
				case 120:
				case 121:
				case 122:
				case 123:
				case 124:
				case 125:
				case 126:
				case 127:
				case 128:
				case 129:
				case 130:
				case 131:
				case 132:
				case 133:
				case 134:
				case 135:
				case 136:
				case 137:
				case 140:
				case 141:
				case 142:
				case 143:
				case 144:
				case 145:
				case 146:
				case 147:
				case 148:
				case 151:
				case 152:
				case 174:
					{
					this.state = 3107;
					this.controlStructureBody();
					}
					break;
				case 27:
					{
					this.state = 3108;
					this.match(KotlinParser.SEMICOLON);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			case 3:
				{
				this.state = 3111;
				this.match(KotlinParser.SEMICOLON);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public whenSubject(): WhenSubjectContext {
		let localctx: WhenSubjectContext = new WhenSubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 258, KotlinParser.RULE_whenSubject);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3114;
			this.match(KotlinParser.LPAREN);
			this.state = 3148;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 492, this._ctx) ) {
			case 1:
				{
				this.state = 3118;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===41 || _la===43) {
					{
					{
					this.state = 3115;
					this.annotation();
					}
					}
					this.state = 3120;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3124;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3121;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3126;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3127;
				this.match(KotlinParser.VAL);
				this.state = 3131;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 489, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3128;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3133;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 489, this._ctx);
				}
				this.state = 3134;
				this.variableDeclaration();
				this.state = 3138;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3135;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3140;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3141;
				this.match(KotlinParser.ASSIGNMENT);
				this.state = 3145;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 491, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3142;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3147;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 491, this._ctx);
				}
				}
				break;
			}
			this.state = 3150;
			this.expression();
			this.state = 3151;
			this.match(KotlinParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public whenExpression(): WhenExpressionContext {
		let localctx: WhenExpressionContext = new WhenExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 260, KotlinParser.RULE_whenExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3153;
			this.match(KotlinParser.WHEN);
			this.state = 3157;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 493, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3154;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3159;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 493, this._ctx);
			}
			this.state = 3161;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===9) {
				{
				this.state = 3160;
				this.whenSubject();
				}
			}

			this.state = 3166;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3163;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3168;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3169;
			this.match(KotlinParser.LCURL);
			this.state = 3173;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 496, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3170;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3175;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 496, this._ctx);
			}
			this.state = 3185;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 498, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3176;
					this.whenEntry();
					this.state = 3180;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 497, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 3177;
							this.match(KotlinParser.NL);
							}
							}
						}
						this.state = 3182;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 497, this._ctx);
					}
					}
					}
				}
				this.state = 3187;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 498, this._ctx);
			}
			this.state = 3191;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3188;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3193;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3194;
			this.match(KotlinParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public whenEntry(): WhenEntryContext {
		let localctx: WhenEntryContext = new WhenEntryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 262, KotlinParser.RULE_whenEntry);
		let _la: number;
		try {
			let _alt: number;
			this.state = 3260;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 5:
			case 9:
			case 11:
			case 13:
			case 18:
			case 19:
			case 20:
			case 21:
			case 24:
			case 25:
			case 38:
			case 41:
			case 43:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 76:
			case 77:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 88:
			case 89:
			case 91:
			case 92:
			case 93:
			case 94:
			case 98:
			case 99:
			case 100:
			case 101:
			case 103:
			case 104:
			case 105:
			case 106:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 137:
			case 140:
			case 141:
			case 142:
			case 143:
			case 144:
			case 145:
			case 146:
			case 147:
			case 148:
			case 151:
			case 152:
			case 174:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3196;
				this.whenCondition();
				this.state = 3213;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 502, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3200;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 3197;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 3202;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 3203;
						this.match(KotlinParser.COMMA);
						this.state = 3207;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 501, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 3204;
								this.match(KotlinParser.NL);
								}
								}
							}
							this.state = 3209;
							this._errHandler.sync(this);
							_alt = this._interp.adaptivePredict(this._input, 501, this._ctx);
						}
						this.state = 3210;
						this.whenCondition();
						}
						}
					}
					this.state = 3215;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 502, this._ctx);
				}
				this.state = 3223;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 504, this._ctx) ) {
				case 1:
					{
					this.state = 3219;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 3216;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 3221;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 3222;
					this.match(KotlinParser.COMMA);
					}
					break;
				}
				this.state = 3228;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3225;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3230;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3231;
				this.match(KotlinParser.ARROW);
				this.state = 3235;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 506, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3232;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3237;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 506, this._ctx);
				}
				this.state = 3238;
				this.controlStructureBody();
				this.state = 3240;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 507, this._ctx) ) {
				case 1:
					{
					this.state = 3239;
					this.semi();
					}
					break;
				}
				}
				break;
			case 90:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3242;
				this.match(KotlinParser.ELSE);
				this.state = 3246;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3243;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3248;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3249;
				this.match(KotlinParser.ARROW);
				this.state = 3253;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 509, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3250;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3255;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 509, this._ctx);
				}
				this.state = 3256;
				this.controlStructureBody();
				this.state = 3258;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 510, this._ctx) ) {
				case 1:
					{
					this.state = 3257;
					this.semi();
					}
					break;
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public whenCondition(): WhenConditionContext {
		let localctx: WhenConditionContext = new WhenConditionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 264, KotlinParser.RULE_whenCondition);
		try {
			this.state = 3265;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 5:
			case 9:
			case 11:
			case 13:
			case 18:
			case 19:
			case 20:
			case 21:
			case 24:
			case 25:
			case 38:
			case 41:
			case 43:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 76:
			case 77:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 88:
			case 89:
			case 91:
			case 92:
			case 93:
			case 94:
			case 98:
			case 99:
			case 100:
			case 101:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 137:
			case 140:
			case 141:
			case 142:
			case 143:
			case 144:
			case 145:
			case 146:
			case 147:
			case 148:
			case 151:
			case 152:
			case 174:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3262;
				this.expression();
				}
				break;
			case 104:
			case 106:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3263;
				this.rangeTest();
				}
				break;
			case 103:
			case 105:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3264;
				this.typeTest();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rangeTest(): RangeTestContext {
		let localctx: RangeTestContext = new RangeTestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 266, KotlinParser.RULE_rangeTest);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3267;
			this.inOperator();
			this.state = 3271;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 513, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3268;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3273;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 513, this._ctx);
			}
			this.state = 3274;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeTest(): TypeTestContext {
		let localctx: TypeTestContext = new TypeTestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 268, KotlinParser.RULE_typeTest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3276;
			this.isOperator();
			this.state = 3280;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3277;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3282;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3283;
			this.type_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tryExpression(): TryExpressionContext {
		let localctx: TryExpressionContext = new TryExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 270, KotlinParser.RULE_tryExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3285;
			this.match(KotlinParser.TRY);
			this.state = 3289;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3286;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3291;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3292;
			this.block();
			this.state = 3320;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 521, this._ctx) ) {
			case 1:
				{
				this.state = 3300;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 3296;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (_la===5) {
							{
							{
							this.state = 3293;
							this.match(KotlinParser.NL);
							}
							}
							this.state = 3298;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
						this.state = 3299;
						this.catchBlock();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 3302;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 517, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				this.state = 3311;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 519, this._ctx) ) {
				case 1:
					{
					this.state = 3307;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 3304;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 3309;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 3310;
					this.finallyBlock();
					}
					break;
				}
				}
				break;
			case 2:
				{
				this.state = 3316;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3313;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3318;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3319;
				this.finallyBlock();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public catchBlock(): CatchBlockContext {
		let localctx: CatchBlockContext = new CatchBlockContext(this, this._ctx, this.state);
		this.enterRule(localctx, 272, KotlinParser.RULE_catchBlock);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3322;
			this.match(KotlinParser.CATCH);
			this.state = 3326;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3323;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3328;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3329;
			this.match(KotlinParser.LPAREN);
			this.state = 3333;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===41 || _la===43) {
				{
				{
				this.state = 3330;
				this.annotation();
				}
				}
				this.state = 3335;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3336;
			this.simpleIdentifier();
			this.state = 3337;
			this.match(KotlinParser.COLON);
			this.state = 3338;
			this.type_();
			this.state = 3346;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===5 || _la===8) {
				{
				this.state = 3342;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3339;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3344;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3345;
				this.match(KotlinParser.COMMA);
				}
			}

			this.state = 3348;
			this.match(KotlinParser.RPAREN);
			this.state = 3352;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3349;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3354;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3355;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public finallyBlock(): FinallyBlockContext {
		let localctx: FinallyBlockContext = new FinallyBlockContext(this, this._ctx, this.state);
		this.enterRule(localctx, 274, KotlinParser.RULE_finallyBlock);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3357;
			this.match(KotlinParser.FINALLY);
			this.state = 3361;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3358;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3363;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3364;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public jumpExpression(): JumpExpressionContext {
		let localctx: JumpExpressionContext = new JumpExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 276, KotlinParser.RULE_jumpExpression);
		let _la: number;
		try {
			let _alt: number;
			this.state = 3382;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 98:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3366;
				this.match(KotlinParser.THROW);
				this.state = 3370;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 528, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3367;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3372;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 528, this._ctx);
				}
				this.state = 3373;
				this.expression();
				}
				break;
			case 58:
			case 99:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3374;
				_la = this._input.LA(1);
				if(!(_la===58 || _la===99)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 3376;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 529, this._ctx) ) {
				case 1:
					{
					this.state = 3375;
					this.expression();
					}
					break;
				}
				}
				break;
			case 100:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3378;
				this.match(KotlinParser.CONTINUE);
				}
				break;
			case 59:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3379;
				this.match(KotlinParser.CONTINUE_AT);
				}
				break;
			case 101:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3380;
				this.match(KotlinParser.BREAK);
				}
				break;
			case 60:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 3381;
				this.match(KotlinParser.BREAK_AT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public callableReference(): CallableReferenceContext {
		let localctx: CallableReferenceContext = new CallableReferenceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 278, KotlinParser.RULE_callableReference);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3385;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===9 || ((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 2143289349) !== 0) || ((((_la - 73)) & ~0x1F) === 0 && ((1 << (_la - 73)) & 3182337) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148 || _la===174) {
				{
				this.state = 3384;
				this.receiverType();
				}
			}

			this.state = 3387;
			this.match(KotlinParser.COLONCOLON);
			this.state = 3391;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3388;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3393;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3396;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 73:
			case 81:
			case 82:
			case 83:
			case 84:
			case 88:
			case 93:
			case 94:
			case 107:
			case 108:
			case 109:
			case 110:
			case 111:
			case 112:
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
			case 125:
			case 126:
			case 127:
			case 128:
			case 129:
			case 130:
			case 131:
			case 132:
			case 133:
			case 134:
			case 135:
			case 136:
			case 148:
				{
				this.state = 3394;
				this.simpleIdentifier();
				}
				break;
			case 74:
				{
				this.state = 3395;
				this.match(KotlinParser.CLASS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public assignmentAndOperator(): AssignmentAndOperatorContext {
		let localctx: AssignmentAndOperatorContext = new AssignmentAndOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 280, KotlinParser.RULE_assignmentAndOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3398;
			_la = this._input.LA(1);
			if(!(((((_la - 29)) & ~0x1F) === 0 && ((1 << (_la - 29)) & 31) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public equalityOperator(): EqualityOperatorContext {
		let localctx: EqualityOperatorContext = new EqualityOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 282, KotlinParser.RULE_equalityOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3400;
			_la = this._input.LA(1);
			if(!(((((_la - 51)) & ~0x1F) === 0 && ((1 << (_la - 51)) & 27) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparisonOperator(): ComparisonOperatorContext {
		let localctx: ComparisonOperatorContext = new ComparisonOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 284, KotlinParser.RULE_comparisonOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3402;
			_la = this._input.LA(1);
			if(!(((((_la - 47)) & ~0x1F) === 0 && ((1 << (_la - 47)) & 15) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inOperator(): InOperatorContext {
		let localctx: InOperatorContext = new InOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 286, KotlinParser.RULE_inOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3404;
			_la = this._input.LA(1);
			if(!(_la===104 || _la===106)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public isOperator(): IsOperatorContext {
		let localctx: IsOperatorContext = new IsOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 288, KotlinParser.RULE_isOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3406;
			_la = this._input.LA(1);
			if(!(_la===103 || _la===105)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public additiveOperator(): AdditiveOperatorContext {
		let localctx: AdditiveOperatorContext = new AdditiveOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 290, KotlinParser.RULE_additiveOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3408;
			_la = this._input.LA(1);
			if(!(_la===18 || _la===19)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiplicativeOperator(): MultiplicativeOperatorContext {
		let localctx: MultiplicativeOperatorContext = new MultiplicativeOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 292, KotlinParser.RULE_multiplicativeOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3410;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 229376) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public asOperator(): AsOperatorContext {
		let localctx: AsOperatorContext = new AsOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 294, KotlinParser.RULE_asOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3412;
			_la = this._input.LA(1);
			if(!(_la===53 || _la===102)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public prefixUnaryOperator(): PrefixUnaryOperatorContext {
		let localctx: PrefixUnaryOperatorContext = new PrefixUnaryOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 296, KotlinParser.RULE_prefixUnaryOperator);
		try {
			this.state = 3419;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3414;
				this.match(KotlinParser.INCR);
				}
				break;
			case 21:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3415;
				this.match(KotlinParser.DECR);
				}
				break;
			case 19:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3416;
				this.match(KotlinParser.SUB);
				}
				break;
			case 18:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3417;
				this.match(KotlinParser.ADD);
				}
				break;
			case 24:
			case 25:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3418;
				this.excl();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public postfixUnaryOperator(): PostfixUnaryOperatorContext {
		let localctx: PostfixUnaryOperatorContext = new PostfixUnaryOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 298, KotlinParser.RULE_postfixUnaryOperator);
		try {
			this.state = 3425;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3421;
				this.match(KotlinParser.INCR);
				}
				break;
			case 21:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3422;
				this.match(KotlinParser.DECR);
				}
				break;
			case 25:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3423;
				this.match(KotlinParser.EXCL_NO_WS);
				this.state = 3424;
				this.excl();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public excl(): ExclContext {
		let localctx: ExclContext = new ExclContext(this, this._ctx, this.state);
		this.enterRule(localctx, 300, KotlinParser.RULE_excl);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3427;
			_la = this._input.LA(1);
			if(!(_la===24 || _la===25)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public memberAccessOperator(): MemberAccessOperatorContext {
		let localctx: MemberAccessOperatorContext = new MemberAccessOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 302, KotlinParser.RULE_memberAccessOperator);
		let _la: number;
		try {
			this.state = 3444;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 538, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3432;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3429;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3434;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3435;
				this.match(KotlinParser.DOT);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3439;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3436;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3441;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 3442;
				this.safeNav();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3443;
				this.match(KotlinParser.COLONCOLON);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public safeNav(): SafeNavContext {
		let localctx: SafeNavContext = new SafeNavContext(this, this._ctx, this.state);
		this.enterRule(localctx, 304, KotlinParser.RULE_safeNav);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3446;
			this.match(KotlinParser.QUEST_NO_WS);
			this.state = 3447;
			this.match(KotlinParser.DOT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public modifiers(): ModifiersContext {
		let localctx: ModifiersContext = new ModifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 306, KotlinParser.RULE_modifiers);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3451;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 3451;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 41:
					case 43:
						{
						this.state = 3449;
						this.annotation();
						}
						break;
					case 109:
					case 110:
					case 111:
					case 112:
					case 113:
					case 114:
					case 115:
					case 116:
					case 117:
					case 118:
					case 119:
					case 120:
					case 121:
					case 122:
					case 123:
					case 124:
					case 125:
					case 126:
					case 127:
					case 128:
					case 129:
					case 130:
					case 131:
					case 132:
					case 133:
					case 135:
					case 136:
						{
						this.state = 3450;
						this.modifier();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 3453;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 540, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterModifiers(): ParameterModifiersContext {
		let localctx: ParameterModifiersContext = new ParameterModifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 308, KotlinParser.RULE_parameterModifiers);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3457;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 3457;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 41:
					case 43:
						{
						this.state = 3455;
						this.annotation();
						}
						break;
					case 131:
					case 132:
					case 133:
						{
						this.state = 3456;
						this.parameterModifier();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 3459;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 542, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public modifier(): ModifierContext {
		let localctx: ModifierContext = new ModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 310, KotlinParser.RULE_modifier);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3469;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 113:
			case 114:
			case 115:
			case 116:
			case 117:
			case 118:
				{
				this.state = 3461;
				this.classModifier();
				}
				break;
			case 125:
			case 130:
				{
				this.state = 3462;
				this.memberModifier();
				}
				break;
			case 109:
			case 110:
			case 111:
			case 112:
				{
				this.state = 3463;
				this.visibilityModifier();
				}
				break;
			case 119:
			case 120:
			case 121:
			case 122:
			case 123:
			case 124:
				{
				this.state = 3464;
				this.functionModifier();
				}
				break;
			case 129:
				{
				this.state = 3465;
				this.propertyModifier();
				}
				break;
			case 126:
			case 127:
			case 128:
				{
				this.state = 3466;
				this.inheritanceModifier();
				}
				break;
			case 131:
			case 132:
			case 133:
				{
				this.state = 3467;
				this.parameterModifier();
				}
				break;
			case 135:
			case 136:
				{
				this.state = 3468;
				this.platformModifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 3474;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 544, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3471;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3476;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 544, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeModifiers(): TypeModifiersContext {
		let localctx: TypeModifiersContext = new TypeModifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 312, KotlinParser.RULE_typeModifiers);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3478;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 3477;
					this.typeModifier();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 3480;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 545, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeModifier(): TypeModifierContext {
		let localctx: TypeModifierContext = new TypeModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 314, KotlinParser.RULE_typeModifier);
		let _la: number;
		try {
			this.state = 3490;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 41:
			case 43:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3482;
				this.annotation();
				}
				break;
			case 124:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3483;
				this.match(KotlinParser.SUSPEND);
				this.state = 3487;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3484;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3489;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public classModifier(): ClassModifierContext {
		let localctx: ClassModifierContext = new ClassModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 316, KotlinParser.RULE_classModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3492;
			_la = this._input.LA(1);
			if(!(((((_la - 113)) & ~0x1F) === 0 && ((1 << (_la - 113)) & 63) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public memberModifier(): MemberModifierContext {
		let localctx: MemberModifierContext = new MemberModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 318, KotlinParser.RULE_memberModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3494;
			_la = this._input.LA(1);
			if(!(_la===125 || _la===130)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public visibilityModifier(): VisibilityModifierContext {
		let localctx: VisibilityModifierContext = new VisibilityModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 320, KotlinParser.RULE_visibilityModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3496;
			_la = this._input.LA(1);
			if(!(((((_la - 109)) & ~0x1F) === 0 && ((1 << (_la - 109)) & 15) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public varianceModifier(): VarianceModifierContext {
		let localctx: VarianceModifierContext = new VarianceModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 322, KotlinParser.RULE_varianceModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3498;
			_la = this._input.LA(1);
			if(!(_la===104 || _la===107)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeParameterModifiers(): TypeParameterModifiersContext {
		let localctx: TypeParameterModifiersContext = new TypeParameterModifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 324, KotlinParser.RULE_typeParameterModifiers);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3501;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 3500;
					this.typeParameterModifier();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 3503;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 548, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public typeParameterModifier(): TypeParameterModifierContext {
		let localctx: TypeParameterModifierContext = new TypeParameterModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 326, KotlinParser.RULE_typeParameterModifier);
		try {
			let _alt: number;
			this.state = 3520;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 134:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3505;
				this.reificationModifier();
				this.state = 3509;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 549, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3506;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3511;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 549, this._ctx);
				}
				}
				break;
			case 104:
			case 107:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3512;
				this.varianceModifier();
				this.state = 3516;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 550, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 3513;
						this.match(KotlinParser.NL);
						}
						}
					}
					this.state = 3518;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 550, this._ctx);
				}
				}
				break;
			case 41:
			case 43:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3519;
				this.annotation();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionModifier(): FunctionModifierContext {
		let localctx: FunctionModifierContext = new FunctionModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 328, KotlinParser.RULE_functionModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3522;
			_la = this._input.LA(1);
			if(!(((((_la - 119)) & ~0x1F) === 0 && ((1 << (_la - 119)) & 63) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyModifier(): PropertyModifierContext {
		let localctx: PropertyModifierContext = new PropertyModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 330, KotlinParser.RULE_propertyModifier);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3524;
			this.match(KotlinParser.CONST);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inheritanceModifier(): InheritanceModifierContext {
		let localctx: InheritanceModifierContext = new InheritanceModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 332, KotlinParser.RULE_inheritanceModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3526;
			_la = this._input.LA(1);
			if(!(((((_la - 126)) & ~0x1F) === 0 && ((1 << (_la - 126)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterModifier(): ParameterModifierContext {
		let localctx: ParameterModifierContext = new ParameterModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 334, KotlinParser.RULE_parameterModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3528;
			_la = this._input.LA(1);
			if(!(((((_la - 131)) & ~0x1F) === 0 && ((1 << (_la - 131)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public reificationModifier(): ReificationModifierContext {
		let localctx: ReificationModifierContext = new ReificationModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 336, KotlinParser.RULE_reificationModifier);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3530;
			this.match(KotlinParser.REIFIED);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public platformModifier(): PlatformModifierContext {
		let localctx: PlatformModifierContext = new PlatformModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 338, KotlinParser.RULE_platformModifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3532;
			_la = this._input.LA(1);
			if(!(_la===135 || _la===136)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotation(): AnnotationContext {
		let localctx: AnnotationContext = new AnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 340, KotlinParser.RULE_annotation);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3536;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 552, this._ctx) ) {
			case 1:
				{
				this.state = 3534;
				this.singleAnnotation();
				}
				break;
			case 2:
				{
				this.state = 3535;
				this.multiAnnotation();
				}
				break;
			}
			this.state = 3541;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 553, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3538;
					this.match(KotlinParser.NL);
					}
					}
				}
				this.state = 3543;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 553, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public singleAnnotation(): SingleAnnotationContext {
		let localctx: SingleAnnotationContext = new SingleAnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 342, KotlinParser.RULE_singleAnnotation);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3553;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 555, this._ctx) ) {
			case 1:
				{
				this.state = 3544;
				this.annotationUseSiteTarget();
				this.state = 3548;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3545;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3550;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 2:
				{
				this.state = 3551;
				this.match(KotlinParser.AT_NO_WS);
				}
				break;
			case 3:
				{
				this.state = 3552;
				this.match(KotlinParser.AT_PRE_WS);
				}
				break;
			}
			this.state = 3555;
			this.unescapedAnnotation();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiAnnotation(): MultiAnnotationContext {
		let localctx: MultiAnnotationContext = new MultiAnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 344, KotlinParser.RULE_multiAnnotation);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3566;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 557, this._ctx) ) {
			case 1:
				{
				this.state = 3557;
				this.annotationUseSiteTarget();
				this.state = 3561;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===5) {
					{
					{
					this.state = 3558;
					this.match(KotlinParser.NL);
					}
					}
					this.state = 3563;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 2:
				{
				this.state = 3564;
				this.match(KotlinParser.AT_NO_WS);
				}
				break;
			case 3:
				{
				this.state = 3565;
				this.match(KotlinParser.AT_PRE_WS);
				}
				break;
			}
			this.state = 3568;
			this.match(KotlinParser.LSQUARE);
			this.state = 3570;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 3569;
				this.unescapedAnnotation();
				}
				}
				this.state = 3572;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 63)) & ~0x1F) === 0 && ((1 << (_la - 63)) & 3258713599) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148);
			this.state = 3574;
			this.match(KotlinParser.RSQUARE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotationUseSiteTarget(): AnnotationUseSiteTargetContext {
		let localctx: AnnotationUseSiteTargetContext = new AnnotationUseSiteTargetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 346, KotlinParser.RULE_annotationUseSiteTarget);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3576;
			_la = this._input.LA(1);
			if(!(_la===41 || _la===43)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 3577;
			_la = this._input.LA(1);
			if(!(((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & 255) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 3581;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===5) {
				{
				{
				this.state = 3578;
				this.match(KotlinParser.NL);
				}
				}
				this.state = 3583;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 3584;
			this.match(KotlinParser.COLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unescapedAnnotation(): UnescapedAnnotationContext {
		let localctx: UnescapedAnnotationContext = new UnescapedAnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 348, KotlinParser.RULE_unescapedAnnotation);
		try {
			this.state = 3588;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 560, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3586;
				this.constructorInvocation();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3587;
				this.userType();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simpleIdentifier(): SimpleIdentifierContext {
		let localctx: SimpleIdentifierContext = new SimpleIdentifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 350, KotlinParser.RULE_simpleIdentifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3590;
			_la = this._input.LA(1);
			if(!(((((_la - 63)) & ~0x1F) === 0 && ((1 << (_la - 63)) & 3258713599) !== 0) || ((((_la - 107)) & ~0x1F) === 0 && ((1 << (_la - 107)) & 1073741823) !== 0) || _la===148)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifier(): IdentifierContext {
		let localctx: IdentifierContext = new IdentifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 352, KotlinParser.RULE_identifier);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3592;
			this.simpleIdentifier();
			this.state = 3603;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 562, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 3596;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===5) {
						{
						{
						this.state = 3593;
						this.match(KotlinParser.NL);
						}
						}
						this.state = 3598;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 3599;
					this.match(KotlinParser.DOT);
					this.state = 3600;
					this.simpleIdentifier();
					}
					}
				}
				this.state = 3605;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 562, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,174,3607,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,
	7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
	7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,2,115,
	7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,7,120,2,121,
	7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,2,126,7,126,2,127,
	7,127,2,128,7,128,2,129,7,129,2,130,7,130,2,131,7,131,2,132,7,132,2,133,
	7,133,2,134,7,134,2,135,7,135,2,136,7,136,2,137,7,137,2,138,7,138,2,139,
	7,139,2,140,7,140,2,141,7,141,2,142,7,142,2,143,7,143,2,144,7,144,2,145,
	7,145,2,146,7,146,2,147,7,147,2,148,7,148,2,149,7,149,2,150,7,150,2,151,
	7,151,2,152,7,152,2,153,7,153,2,154,7,154,2,155,7,155,2,156,7,156,2,157,
	7,157,2,158,7,158,2,159,7,159,2,160,7,160,2,161,7,161,2,162,7,162,2,163,
	7,163,2,164,7,164,2,165,7,165,2,166,7,166,2,167,7,167,2,168,7,168,2,169,
	7,169,2,170,7,170,2,171,7,171,2,172,7,172,2,173,7,173,2,174,7,174,2,175,
	7,175,2,176,7,176,1,0,3,0,356,8,0,1,0,5,0,359,8,0,10,0,12,0,362,9,0,1,0,
	5,0,365,8,0,10,0,12,0,368,9,0,1,0,3,0,371,8,0,1,0,3,0,374,8,0,1,0,1,0,5,
	0,378,8,0,10,0,12,0,381,9,0,1,0,1,0,1,1,3,1,386,8,1,1,1,5,1,389,8,1,10,
	1,12,1,392,9,1,1,1,5,1,395,8,1,10,1,12,1,398,9,1,1,1,3,1,401,8,1,1,1,3,
	1,404,8,1,1,1,1,1,3,1,408,8,1,5,1,410,8,1,10,1,12,1,413,9,1,1,1,1,1,1,2,
	1,2,1,2,1,2,1,2,1,2,1,2,3,2,424,8,2,1,3,1,3,5,3,428,8,3,10,3,12,3,431,9,
	3,1,3,1,3,1,4,1,4,1,4,3,4,438,8,4,1,5,1,5,4,5,442,8,5,11,5,12,5,443,1,6,
	1,6,1,6,5,6,449,8,6,10,6,12,6,452,9,6,1,6,1,6,5,6,456,8,6,10,6,12,6,459,
	9,6,1,6,1,6,4,6,463,8,6,11,6,12,6,464,1,6,1,6,1,6,3,6,470,8,6,1,6,5,6,473,
	8,6,10,6,12,6,476,9,6,1,7,1,7,1,7,3,7,481,8,7,3,7,483,8,7,1,8,5,8,486,8,
	8,10,8,12,8,489,9,8,1,9,1,9,1,9,1,9,1,9,3,9,496,8,9,1,9,3,9,499,8,9,1,10,
	1,10,1,10,1,11,1,11,3,11,506,8,11,1,12,3,12,509,8,12,1,12,1,12,5,12,513,
	8,12,10,12,12,12,516,9,12,1,12,1,12,5,12,520,8,12,10,12,12,12,523,9,12,
	1,12,3,12,526,8,12,1,12,5,12,529,8,12,10,12,12,12,532,9,12,1,12,1,12,5,
	12,536,8,12,10,12,12,12,539,9,12,1,12,1,12,1,13,1,13,1,13,1,13,1,13,3,13,
	548,8,13,1,14,3,14,551,8,14,1,14,1,14,1,14,5,14,556,8,14,10,14,12,14,559,
	9,14,3,14,561,8,14,1,14,3,14,564,8,14,1,14,5,14,567,8,14,10,14,12,14,570,
	9,14,1,14,1,14,5,14,574,8,14,10,14,12,14,577,9,14,1,14,3,14,580,8,14,1,
	14,5,14,583,8,14,10,14,12,14,586,9,14,1,14,3,14,589,8,14,1,14,5,14,592,
	8,14,10,14,12,14,595,9,14,1,14,1,14,5,14,599,8,14,10,14,12,14,602,9,14,
	1,14,3,14,605,8,14,1,14,5,14,608,8,14,10,14,12,14,611,9,14,1,14,3,14,614,
	8,14,1,14,5,14,617,8,14,10,14,12,14,620,9,14,1,14,1,14,5,14,624,8,14,10,
	14,12,14,627,9,14,1,14,3,14,630,8,14,1,15,3,15,633,8,15,1,15,1,15,5,15,
	637,8,15,10,15,12,15,640,9,15,3,15,642,8,15,1,15,3,15,645,8,15,1,16,1,16,
	5,16,649,8,16,10,16,12,16,652,9,16,1,16,3,16,655,8,16,1,16,5,16,658,8,16,
	10,16,12,16,661,9,16,1,16,1,16,1,17,1,17,5,17,667,8,17,10,17,12,17,670,
	9,17,1,17,1,17,5,17,674,8,17,10,17,12,17,677,9,17,1,17,1,17,5,17,681,8,
	17,10,17,12,17,684,9,17,1,17,5,17,687,8,17,10,17,12,17,690,9,17,1,17,5,
	17,693,8,17,10,17,12,17,696,9,17,1,17,3,17,699,8,17,3,17,701,8,17,1,17,
	5,17,704,8,17,10,17,12,17,707,9,17,1,17,1,17,1,18,3,18,712,8,18,1,18,3,
	18,715,8,18,1,18,5,18,718,8,18,10,18,12,18,721,9,18,1,18,1,18,1,18,5,18,
	726,8,18,10,18,12,18,729,9,18,1,18,1,18,5,18,733,8,18,10,18,12,18,736,9,
	18,1,18,1,18,5,18,740,8,18,10,18,12,18,743,9,18,1,18,3,18,746,8,18,1,19,
	1,19,5,19,750,8,19,10,19,12,19,753,9,19,1,19,1,19,5,19,757,8,19,10,19,12,
	19,760,9,19,1,19,5,19,763,8,19,10,19,12,19,766,9,19,1,20,1,20,1,20,1,20,
	1,20,1,20,5,20,774,8,20,10,20,12,20,777,9,20,1,20,3,20,780,8,20,1,21,1,
	21,5,21,784,8,21,10,21,12,21,787,9,21,1,21,1,21,1,22,5,22,792,8,22,10,22,
	12,22,795,9,22,1,22,5,22,798,8,22,10,22,12,22,801,9,22,1,22,1,22,1,23,1,
	23,3,23,807,8,23,1,23,5,23,810,8,23,10,23,12,23,813,9,23,1,23,1,23,5,23,
	817,8,23,10,23,12,23,820,9,23,1,23,1,23,1,24,1,24,5,24,826,8,24,10,24,12,
	24,829,9,24,1,24,1,24,5,24,833,8,24,10,24,12,24,836,9,24,1,24,1,24,5,24,
	840,8,24,10,24,12,24,843,9,24,1,24,5,24,846,8,24,10,24,12,24,849,9,24,1,
	24,5,24,852,8,24,10,24,12,24,855,9,24,1,24,3,24,858,8,24,1,24,5,24,861,
	8,24,10,24,12,24,864,9,24,1,24,1,24,1,25,3,25,869,8,25,1,25,5,25,872,8,
	25,10,25,12,25,875,9,25,1,25,1,25,5,25,879,8,25,10,25,12,25,882,9,25,1,
	25,1,25,5,25,886,8,25,10,25,12,25,889,9,25,1,25,3,25,892,8,25,1,26,1,26,
	5,26,896,8,26,10,26,12,26,899,9,26,1,26,1,26,5,26,903,8,26,10,26,12,26,
	906,9,26,1,26,1,26,5,26,910,8,26,10,26,12,26,913,9,26,1,26,5,26,916,8,26,
	10,26,12,26,919,9,26,1,27,5,27,922,8,27,10,27,12,27,925,9,27,1,27,1,27,
	5,27,929,8,27,10,27,12,27,932,9,27,1,27,1,27,5,27,936,8,27,10,27,12,27,
	939,9,27,1,27,1,27,1,28,1,28,3,28,945,8,28,1,28,1,28,3,28,949,8,28,5,28,
	951,8,28,10,28,12,28,954,9,28,1,29,1,29,1,29,1,29,3,29,960,8,29,1,30,1,
	30,5,30,964,8,30,10,30,12,30,967,9,30,1,30,1,30,1,31,3,31,972,8,31,1,31,
	1,31,5,31,976,8,31,10,31,12,31,979,9,31,1,31,3,31,982,8,31,1,31,5,31,985,
	8,31,10,31,12,31,988,9,31,1,31,1,31,5,31,992,8,31,10,31,12,31,995,9,31,
	1,31,3,31,998,8,31,1,31,5,31,1001,8,31,10,31,12,31,1004,9,31,1,31,1,31,
	5,31,1008,8,31,10,31,12,31,1011,9,31,1,31,3,31,1014,8,31,1,31,5,31,1017,
	8,31,10,31,12,31,1020,9,31,1,31,3,31,1023,8,31,1,32,1,32,5,32,1027,8,32,
	10,32,12,32,1030,9,32,1,32,1,32,5,32,1034,8,32,10,32,12,32,1037,9,32,1,
	32,1,32,5,32,1041,8,32,10,32,12,32,1044,9,32,1,32,5,32,1047,8,32,10,32,
	12,32,1050,9,32,1,32,5,32,1053,8,32,10,32,12,32,1056,9,32,1,32,3,32,1059,
	8,32,3,32,1061,8,32,1,32,5,32,1064,8,32,10,32,12,32,1067,9,32,1,32,1,32,
	1,33,3,33,1072,8,33,1,33,1,33,5,33,1076,8,33,10,33,12,33,1079,9,33,1,33,
	1,33,5,33,1083,8,33,10,33,12,33,1086,9,33,1,33,3,33,1089,8,33,1,34,3,34,
	1092,8,34,1,34,1,34,5,34,1096,8,34,10,34,12,34,1099,9,34,1,34,3,34,1102,
	8,34,1,34,5,34,1105,8,34,10,34,12,34,1108,9,34,1,34,1,34,5,34,1112,8,34,
	10,34,12,34,1115,9,34,1,34,1,34,3,34,1119,8,34,1,34,5,34,1122,8,34,10,34,
	12,34,1125,9,34,1,34,1,34,5,34,1129,8,34,10,34,12,34,1132,9,34,1,34,1,34,
	5,34,1136,8,34,10,34,12,34,1139,9,34,1,34,1,34,5,34,1143,8,34,10,34,12,
	34,1146,9,34,1,34,3,34,1149,8,34,1,34,5,34,1152,8,34,10,34,12,34,1155,9,
	34,1,34,3,34,1158,8,34,1,34,5,34,1161,8,34,10,34,12,34,1164,9,34,1,34,3,
	34,1167,8,34,1,35,1,35,1,35,5,35,1172,8,35,10,35,12,35,1175,9,35,1,35,3,
	35,1178,8,35,1,36,5,36,1181,8,36,10,36,12,36,1184,9,36,1,36,5,36,1187,8,
	36,10,36,12,36,1190,9,36,1,36,1,36,5,36,1194,8,36,10,36,12,36,1197,9,36,
	1,36,1,36,5,36,1201,8,36,10,36,12,36,1204,9,36,1,36,3,36,1207,8,36,1,36,
	5,36,1210,8,36,10,36,12,36,1213,9,36,1,36,1,36,5,36,1217,8,36,10,36,12,
	36,1220,9,36,1,36,3,36,1223,8,36,1,37,1,37,5,37,1227,8,37,10,37,12,37,1230,
	9,37,1,37,1,37,5,37,1234,8,37,10,37,12,37,1237,9,37,1,37,1,37,5,37,1241,
	8,37,10,37,12,37,1244,9,37,1,37,5,37,1247,8,37,10,37,12,37,1250,9,37,1,
	37,5,37,1253,8,37,10,37,12,37,1256,9,37,1,37,3,37,1259,8,37,1,37,5,37,1262,
	8,37,10,37,12,37,1265,9,37,1,37,1,37,1,38,3,38,1270,8,38,1,38,1,38,5,38,
	1274,8,38,10,38,12,38,1277,9,38,1,38,3,38,1280,8,38,1,38,5,38,1283,8,38,
	10,38,12,38,1286,9,38,1,38,1,38,5,38,1290,8,38,10,38,12,38,1293,9,38,1,
	38,1,38,3,38,1297,8,38,1,38,5,38,1300,8,38,10,38,12,38,1303,9,38,1,38,1,
	38,3,38,1307,8,38,1,38,5,38,1310,8,38,10,38,12,38,1313,9,38,1,38,3,38,1316,
	8,38,1,38,5,38,1319,8,38,10,38,12,38,1322,9,38,1,38,1,38,5,38,1326,8,38,
	10,38,12,38,1329,9,38,1,38,1,38,3,38,1333,8,38,3,38,1335,8,38,1,38,5,38,
	1338,8,38,10,38,12,38,1341,9,38,1,38,3,38,1344,8,38,1,38,5,38,1347,8,38,
	10,38,12,38,1350,9,38,1,38,3,38,1353,8,38,1,38,5,38,1356,8,38,10,38,12,
	38,1359,9,38,1,38,3,38,1362,8,38,1,38,3,38,1365,8,38,1,38,3,38,1368,8,38,
	1,38,5,38,1371,8,38,10,38,12,38,1374,9,38,1,38,3,38,1377,8,38,1,38,3,38,
	1380,8,38,3,38,1382,8,38,1,39,1,39,5,39,1386,8,39,10,39,12,39,1389,9,39,
	1,39,1,39,1,40,3,40,1394,8,40,1,40,1,40,5,40,1398,8,40,10,40,12,40,1401,
	9,40,1,40,1,40,5,40,1405,8,40,10,40,12,40,1408,9,40,1,40,1,40,5,40,1412,
	8,40,10,40,12,40,1415,9,40,1,40,1,40,5,40,1419,8,40,10,40,12,40,1422,9,
	40,1,40,3,40,1425,8,40,1,40,5,40,1428,8,40,10,40,12,40,1431,9,40,1,40,3,
	40,1434,8,40,1,41,3,41,1437,8,41,1,41,1,41,5,41,1441,8,41,10,41,12,41,1444,
	9,41,1,41,1,41,5,41,1448,8,41,10,41,12,41,1451,9,41,1,41,1,41,5,41,1455,
	8,41,10,41,12,41,1458,9,41,1,41,3,41,1461,8,41,1,41,5,41,1464,8,41,10,41,
	12,41,1467,9,41,1,41,1,41,5,41,1471,8,41,10,41,12,41,1474,9,41,1,41,1,41,
	5,41,1478,8,41,10,41,12,41,1481,9,41,1,41,3,41,1484,8,41,1,41,5,41,1487,
	8,41,10,41,12,41,1490,9,41,1,41,1,41,3,41,1494,8,41,1,42,1,42,5,42,1498,
	8,42,10,42,12,42,1501,9,42,1,42,1,42,5,42,1505,8,42,10,42,12,42,1508,9,
	42,1,42,1,42,5,42,1512,8,42,10,42,12,42,1515,9,42,1,42,5,42,1518,8,42,10,
	42,12,42,1521,9,42,1,42,5,42,1524,8,42,10,42,12,42,1527,9,42,1,42,3,42,
	1530,8,42,3,42,1532,8,42,1,42,5,42,1535,8,42,10,42,12,42,1538,9,42,1,42,
	1,42,1,43,3,43,1543,8,43,1,43,1,43,5,43,1547,8,43,10,43,12,43,1550,9,43,
	1,43,1,43,5,43,1554,8,43,10,43,12,43,1557,9,43,1,43,3,43,1560,8,43,1,44,
	1,44,5,44,1564,8,44,10,44,12,44,1567,9,44,1,44,1,44,5,44,1571,8,44,10,44,
	12,44,1574,9,44,1,44,3,44,1577,8,44,1,45,1,45,5,45,1581,8,45,10,45,12,45,
	1584,9,45,1,45,1,45,5,45,1588,8,45,10,45,12,45,1591,9,45,1,45,1,45,1,46,
	3,46,1596,8,46,1,46,1,46,5,46,1600,8,46,10,46,12,46,1603,9,46,1,46,1,46,
	5,46,1607,8,46,10,46,12,46,1610,9,46,1,46,1,46,5,46,1614,8,46,10,46,12,
	46,1617,9,46,1,46,3,46,1620,8,46,1,46,5,46,1623,8,46,10,46,12,46,1626,9,
	46,1,46,3,46,1629,8,46,1,47,3,47,1632,8,47,1,47,1,47,5,47,1636,8,47,10,
	47,12,47,1639,9,47,1,47,1,47,5,47,1643,8,47,10,47,12,47,1646,9,47,1,47,
	1,47,5,47,1650,8,47,10,47,12,47,1653,9,47,1,47,3,47,1656,8,47,1,47,5,47,
	1659,8,47,10,47,12,47,1662,9,47,1,47,3,47,1665,8,47,1,48,1,48,5,48,1669,
	8,48,10,48,12,48,1672,9,48,1,48,1,48,1,49,1,49,5,49,1678,8,49,10,49,12,
	49,1681,9,49,1,49,3,49,1684,8,49,1,49,5,49,1687,8,49,10,49,12,49,1690,9,
	49,1,49,1,49,5,49,1694,8,49,10,49,12,49,1697,9,49,1,49,3,49,1700,8,49,1,
	49,5,49,1703,8,49,10,49,12,49,1706,9,49,1,49,1,49,1,50,1,50,5,50,1712,8,
	50,10,50,12,50,1715,9,50,1,50,1,50,5,50,1719,8,50,10,50,12,50,1722,9,50,
	1,50,5,50,1725,8,50,10,50,12,50,1728,9,50,1,50,5,50,1731,8,50,10,50,12,
	50,1734,9,50,1,50,3,50,1737,8,50,1,51,1,51,5,51,1741,8,51,10,51,12,51,1744,
	9,51,3,51,1746,8,51,1,51,1,51,5,51,1750,8,51,10,51,12,51,1753,9,51,1,51,
	3,51,1756,8,51,1,51,5,51,1759,8,51,10,51,12,51,1762,9,51,1,51,3,51,1765,
	8,51,1,52,3,52,1768,8,52,1,52,1,52,1,52,1,52,1,52,3,52,1775,8,52,1,53,1,
	53,1,53,3,53,1780,8,53,1,54,1,54,3,54,1784,8,54,1,54,5,54,1787,8,54,10,
	54,12,54,1790,9,54,1,54,4,54,1793,8,54,11,54,12,54,1794,1,55,1,55,1,56,
	1,56,5,56,1801,8,56,10,56,12,56,1804,9,56,1,56,1,56,5,56,1808,8,56,10,56,
	12,56,1811,9,56,1,56,5,56,1814,8,56,10,56,12,56,1817,9,56,1,57,1,57,5,57,
	1821,8,57,10,57,12,57,1824,9,57,1,57,3,57,1827,8,57,1,58,3,58,1830,8,58,
	1,58,1,58,3,58,1834,8,58,1,59,4,59,1837,8,59,11,59,12,59,1838,1,60,1,60,
	5,60,1843,8,60,10,60,12,60,1846,9,60,1,60,3,60,1849,8,60,1,61,1,61,5,61,
	1853,8,61,10,61,12,61,1856,9,61,1,61,1,61,5,61,1860,8,61,10,61,12,61,1863,
	9,61,3,61,1865,8,61,1,61,1,61,5,61,1869,8,61,10,61,12,61,1872,9,61,1,61,
	1,61,5,61,1876,8,61,10,61,12,61,1879,9,61,1,61,1,61,1,62,1,62,5,62,1885,
	8,62,10,62,12,62,1888,9,62,1,62,1,62,3,62,1892,8,62,1,62,5,62,1895,8,62,
	10,62,12,62,1898,9,62,1,62,1,62,5,62,1902,8,62,10,62,12,62,1905,9,62,1,
	62,1,62,3,62,1909,8,62,5,62,1911,8,62,10,62,12,62,1914,9,62,1,62,5,62,1917,
	8,62,10,62,12,62,1920,9,62,1,62,3,62,1923,8,62,1,62,5,62,1926,8,62,10,62,
	12,62,1929,9,62,1,62,1,62,1,63,1,63,5,63,1935,8,63,10,63,12,63,1938,9,63,
	1,63,1,63,5,63,1942,8,63,10,63,12,63,1945,9,63,1,63,1,63,1,64,3,64,1950,
	8,64,1,64,1,64,1,64,3,64,1955,8,64,1,65,1,65,5,65,1959,8,65,10,65,12,65,
	1962,9,65,1,65,1,65,3,65,1966,8,65,1,65,5,65,1969,8,65,10,65,12,65,1972,
	9,65,1,65,1,65,1,66,3,66,1977,8,66,1,66,1,66,3,66,1981,8,66,1,66,5,66,1984,
	8,66,10,66,12,66,1987,9,66,1,66,1,66,5,66,1991,8,66,10,66,12,66,1994,9,
	66,1,66,3,66,1997,8,66,1,66,1,66,3,66,2001,8,66,1,67,1,67,1,67,1,67,5,67,
	2007,8,67,10,67,12,67,2010,9,67,3,67,2012,8,67,1,67,3,67,2015,8,67,1,68,
	1,68,5,68,2019,8,68,10,68,12,68,2022,9,68,1,68,1,68,1,68,1,68,3,68,2028,
	8,68,1,69,1,69,1,69,5,69,2033,8,69,10,69,12,69,2036,9,69,1,70,1,70,3,70,
	2040,8,70,1,71,1,71,5,71,2044,8,71,10,71,12,71,2047,9,71,1,71,3,71,2050,
	8,71,1,71,5,71,2053,8,71,10,71,12,71,2056,9,71,1,71,1,71,5,71,2060,8,71,
	10,71,12,71,2063,9,71,1,72,1,72,1,72,3,72,2068,8,72,1,73,1,73,5,73,2072,
	8,73,10,73,12,73,2075,9,73,1,73,1,73,5,73,2079,8,73,10,73,12,73,2082,9,
	73,1,73,1,73,3,73,2086,8,73,1,73,1,73,1,73,1,73,5,73,2092,8,73,10,73,12,
	73,2095,9,73,1,73,3,73,2098,8,73,1,73,5,73,2101,8,73,10,73,12,73,2104,9,
	73,1,74,1,74,5,74,2108,8,74,10,74,12,74,2111,9,74,1,74,1,74,1,74,1,74,5,
	74,2117,8,74,10,74,12,74,2120,9,74,1,74,1,74,3,74,2124,8,74,1,74,5,74,2127,
	8,74,10,74,12,74,2130,9,74,1,75,1,75,5,75,2134,8,75,10,75,12,75,2137,9,
	75,1,75,3,75,2140,8,75,1,75,5,75,2143,8,75,10,75,12,75,2146,9,75,1,75,1,
	75,5,75,2150,8,75,10,75,12,75,2153,9,75,1,75,1,75,1,75,1,75,5,75,2159,8,
	75,10,75,12,75,2162,9,75,1,76,1,76,1,76,1,76,1,76,1,76,3,76,2170,8,76,1,
	76,5,76,2173,8,76,10,76,12,76,2176,9,76,1,76,1,76,1,77,1,77,5,77,2182,8,
	77,10,77,12,77,2185,9,77,1,78,4,78,2188,8,78,11,78,12,78,2189,1,79,1,79,
	1,80,1,80,5,80,2196,8,80,10,80,12,80,2199,9,80,1,80,1,80,5,80,2203,8,80,
	10,80,12,80,2206,9,80,1,80,5,80,2209,8,80,10,80,12,80,2212,9,80,1,81,1,
	81,5,81,2216,8,81,10,81,12,81,2219,9,81,1,81,1,81,5,81,2223,8,81,10,81,
	12,81,2226,9,81,1,81,5,81,2229,8,81,10,81,12,81,2232,9,81,1,82,1,82,1,82,
	5,82,2237,8,82,10,82,12,82,2240,9,82,1,82,1,82,5,82,2244,8,82,10,82,12,
	82,2247,9,82,1,83,1,83,1,83,5,83,2252,8,83,10,83,12,83,2255,9,83,1,83,1,
	83,5,83,2259,8,83,10,83,12,83,2262,9,83,1,84,1,84,5,84,2266,8,84,10,84,
	12,84,2269,9,84,1,85,1,85,1,85,5,85,2274,8,85,10,85,12,85,2277,9,85,1,85,
	1,85,1,85,1,85,5,85,2283,8,85,10,85,12,85,2286,9,85,1,85,1,85,5,85,2290,
	8,85,10,85,12,85,2293,9,85,1,86,1,86,5,86,2297,8,86,10,86,12,86,2300,9,
	86,1,86,1,86,5,86,2304,8,86,10,86,12,86,2307,9,86,1,86,1,86,5,86,2311,8,
	86,10,86,12,86,2314,9,86,1,87,1,87,1,87,1,88,1,88,1,88,5,88,2322,8,88,10,
	88,12,88,2325,9,88,1,88,1,88,5,88,2329,8,88,10,88,12,88,2332,9,88,1,89,
	1,89,1,89,5,89,2337,8,89,10,89,12,89,2340,9,89,1,89,5,89,2343,8,89,10,89,
	12,89,2346,9,89,1,90,1,90,1,90,5,90,2351,8,90,10,90,12,90,2354,9,90,1,90,
	1,90,5,90,2358,8,90,10,90,12,90,2361,9,90,1,91,1,91,1,91,5,91,2366,8,91,
	10,91,12,91,2369,9,91,1,91,1,91,5,91,2373,8,91,10,91,12,91,2376,9,91,1,
	92,1,92,5,92,2380,8,92,10,92,12,92,2383,9,92,1,92,1,92,5,92,2387,8,92,10,
	92,12,92,2390,9,92,1,92,1,92,5,92,2394,8,92,10,92,12,92,2397,9,92,1,93,
	5,93,2400,8,93,10,93,12,93,2403,9,93,1,93,1,93,1,94,1,94,1,94,1,94,5,94,
	2411,8,94,10,94,12,94,2414,9,94,3,94,2416,8,94,1,95,1,95,5,95,2420,8,95,
	10,95,12,95,2423,9,95,1,96,1,96,1,96,1,96,1,96,3,96,2430,8,96,1,97,1,97,
	1,97,1,97,1,97,3,97,2437,8,97,1,98,1,98,5,98,2441,8,98,10,98,12,98,2444,
	9,98,1,98,1,98,5,98,2448,8,98,10,98,12,98,2451,9,98,1,98,1,98,1,99,1,99,
	3,99,2457,8,99,1,100,1,100,5,100,2461,8,100,10,100,12,100,2464,9,100,1,
	100,1,100,5,100,2468,8,100,10,100,12,100,2471,9,100,1,100,1,100,1,101,1,
	101,1,101,3,101,2478,8,101,1,102,1,102,5,102,2482,8,102,10,102,12,102,2485,
	9,102,1,102,1,102,5,102,2489,8,102,10,102,12,102,2492,9,102,1,102,1,102,
	5,102,2496,8,102,10,102,12,102,2499,9,102,1,102,5,102,2502,8,102,10,102,
	12,102,2505,9,102,1,102,5,102,2508,8,102,10,102,12,102,2511,9,102,1,102,
	3,102,2514,8,102,1,102,5,102,2517,8,102,10,102,12,102,2520,9,102,1,102,
	1,102,1,103,1,103,5,103,2526,8,103,10,103,12,103,2529,9,103,1,103,1,103,
	1,103,3,103,2534,8,103,1,104,3,104,2537,8,104,1,104,3,104,2540,8,104,1,
	104,1,104,3,104,2544,8,104,1,105,5,105,2547,8,105,10,105,12,105,2550,9,
	105,1,105,3,105,2553,8,105,1,105,5,105,2556,8,105,10,105,12,105,2559,9,
	105,1,105,1,105,1,106,1,106,5,106,2565,8,106,10,106,12,106,2568,9,106,1,
	106,1,106,5,106,2572,8,106,10,106,12,106,2575,9,106,1,106,1,106,5,106,2579,
	8,106,10,106,12,106,2582,9,106,1,106,5,106,2585,8,106,10,106,12,106,2588,
	9,106,1,106,5,106,2591,8,106,10,106,12,106,2594,9,106,1,106,3,106,2597,
	8,106,1,106,5,106,2600,8,106,10,106,12,106,2603,9,106,1,106,1,106,1,107,
	1,107,5,107,2609,8,107,10,107,12,107,2612,9,107,1,107,1,107,5,107,2616,
	8,107,10,107,12,107,2619,9,107,1,107,1,107,5,107,2623,8,107,10,107,12,107,
	2626,9,107,1,107,5,107,2629,8,107,10,107,12,107,2632,9,107,1,107,5,107,
	2635,8,107,10,107,12,107,2638,9,107,1,107,3,107,2641,8,107,1,107,5,107,
	2644,8,107,10,107,12,107,2647,9,107,3,107,2649,8,107,1,107,1,107,1,108,
	3,108,2654,8,108,1,108,5,108,2657,8,108,10,108,12,108,2660,9,108,1,108,
	1,108,5,108,2664,8,108,10,108,12,108,2667,9,108,1,108,1,108,5,108,2671,
	8,108,10,108,12,108,2674,9,108,3,108,2676,8,108,1,108,3,108,2679,8,108,
	1,108,5,108,2682,8,108,10,108,12,108,2685,9,108,1,108,1,108,1,109,1,109,
	1,109,1,109,1,109,1,109,1,109,1,109,1,109,1,109,1,109,1,109,1,109,1,109,
	3,109,2703,8,109,1,110,1,110,5,110,2707,8,110,10,110,12,110,2710,9,110,
	1,110,1,110,5,110,2714,8,110,10,110,12,110,2717,9,110,1,110,1,110,1,111,
	1,111,5,111,2723,8,111,10,111,12,111,2726,9,111,1,111,1,111,5,111,2730,
	8,111,10,111,12,111,2733,9,111,1,111,1,111,5,111,2737,8,111,10,111,12,111,
	2740,9,111,1,111,5,111,2743,8,111,10,111,12,111,2746,9,111,1,111,5,111,
	2749,8,111,10,111,12,111,2752,9,111,1,111,3,111,2755,8,111,1,111,5,111,
	2758,8,111,10,111,12,111,2761,9,111,3,111,2763,8,111,1,111,1,111,1,112,
	1,112,1,113,1,113,3,113,2771,8,113,1,114,1,114,1,114,5,114,2776,8,114,10,
	114,12,114,2779,9,114,1,114,1,114,1,115,1,115,1,115,1,115,5,115,2787,8,
	115,10,115,12,115,2790,9,115,1,115,1,115,1,116,1,116,1,117,1,117,5,117,
	2798,8,117,10,117,12,117,2801,9,117,1,117,1,117,5,117,2805,8,117,10,117,
	12,117,2808,9,117,1,117,1,117,1,118,1,118,1,119,1,119,5,119,2816,8,119,
	10,119,12,119,2819,9,119,1,119,1,119,5,119,2823,8,119,10,119,12,119,2826,
	9,119,1,119,1,119,1,120,1,120,5,120,2832,8,120,10,120,12,120,2835,9,120,
	1,120,3,120,2838,8,120,1,120,5,120,2841,8,120,10,120,12,120,2844,9,120,
	1,120,1,120,5,120,2848,8,120,10,120,12,120,2851,9,120,3,120,2853,8,120,
	1,120,1,120,5,120,2857,8,120,10,120,12,120,2860,9,120,1,120,1,120,1,121,
	1,121,5,121,2866,8,121,10,121,12,121,2869,9,121,1,121,1,121,5,121,2873,
	8,121,10,121,12,121,2876,9,121,1,121,5,121,2879,8,121,10,121,12,121,2882,
	9,121,1,121,5,121,2885,8,121,10,121,12,121,2888,9,121,1,121,3,121,2891,
	8,121,1,122,1,122,1,122,5,122,2896,8,122,10,122,12,122,2899,9,122,1,122,
	1,122,5,122,2903,8,122,10,122,12,122,2906,9,122,1,122,3,122,2909,8,122,
	3,122,2911,8,122,1,123,3,123,2914,8,123,1,123,5,123,2917,8,123,10,123,12,
	123,2920,9,123,1,123,1,123,5,123,2924,8,123,10,123,12,123,2927,9,123,1,
	123,1,123,5,123,2931,8,123,10,123,12,123,2934,9,123,1,123,1,123,3,123,2938,
	8,123,1,123,5,123,2941,8,123,10,123,12,123,2944,9,123,1,123,1,123,5,123,
	2948,8,123,10,123,12,123,2951,9,123,1,123,1,123,5,123,2955,8,123,10,123,
	12,123,2958,9,123,1,123,3,123,2961,8,123,1,123,5,123,2964,8,123,10,123,
	12,123,2967,9,123,1,123,3,123,2970,8,123,1,123,5,123,2973,8,123,10,123,
	12,123,2976,9,123,1,123,3,123,2979,8,123,1,124,1,124,3,124,2983,8,124,1,
	125,3,125,2986,8,125,1,125,5,125,2989,8,125,10,125,12,125,2992,9,125,1,
	125,1,125,5,125,2996,8,125,10,125,12,125,2999,9,125,1,125,1,125,5,125,3003,
	8,125,10,125,12,125,3006,9,125,1,125,1,125,5,125,3010,8,125,10,125,12,125,
	3013,9,125,3,125,3015,8,125,1,125,5,125,3018,8,125,10,125,12,125,3021,9,
	125,1,125,3,125,3024,8,125,1,126,1,126,1,127,1,127,1,127,5,127,3031,8,127,
	10,127,12,127,3034,9,127,1,127,1,127,5,127,3038,8,127,10,127,12,127,3041,
	9,127,1,127,1,127,3,127,3045,8,127,1,127,1,127,3,127,3049,8,127,1,127,3,
	127,3052,8,127,1,128,1,128,5,128,3056,8,128,10,128,12,128,3059,9,128,1,
	128,1,128,5,128,3063,8,128,10,128,12,128,3066,9,128,1,128,1,128,5,128,3070,
	8,128,10,128,12,128,3073,9,128,1,128,1,128,5,128,3077,8,128,10,128,12,128,
	3080,9,128,1,128,1,128,3,128,3084,8,128,1,128,5,128,3087,8,128,10,128,12,
	128,3090,9,128,1,128,3,128,3093,8,128,1,128,5,128,3096,8,128,10,128,12,
	128,3099,9,128,1,128,1,128,5,128,3103,8,128,10,128,12,128,3106,9,128,1,
	128,1,128,3,128,3110,8,128,1,128,3,128,3113,8,128,1,129,1,129,5,129,3117,
	8,129,10,129,12,129,3120,9,129,1,129,5,129,3123,8,129,10,129,12,129,3126,
	9,129,1,129,1,129,5,129,3130,8,129,10,129,12,129,3133,9,129,1,129,1,129,
	5,129,3137,8,129,10,129,12,129,3140,9,129,1,129,1,129,5,129,3144,8,129,
	10,129,12,129,3147,9,129,3,129,3149,8,129,1,129,1,129,1,129,1,130,1,130,
	5,130,3156,8,130,10,130,12,130,3159,9,130,1,130,3,130,3162,8,130,1,130,
	5,130,3165,8,130,10,130,12,130,3168,9,130,1,130,1,130,5,130,3172,8,130,
	10,130,12,130,3175,9,130,1,130,1,130,5,130,3179,8,130,10,130,12,130,3182,
	9,130,5,130,3184,8,130,10,130,12,130,3187,9,130,1,130,5,130,3190,8,130,
	10,130,12,130,3193,9,130,1,130,1,130,1,131,1,131,5,131,3199,8,131,10,131,
	12,131,3202,9,131,1,131,1,131,5,131,3206,8,131,10,131,12,131,3209,9,131,
	1,131,5,131,3212,8,131,10,131,12,131,3215,9,131,1,131,5,131,3218,8,131,
	10,131,12,131,3221,9,131,1,131,3,131,3224,8,131,1,131,5,131,3227,8,131,
	10,131,12,131,3230,9,131,1,131,1,131,5,131,3234,8,131,10,131,12,131,3237,
	9,131,1,131,1,131,3,131,3241,8,131,1,131,1,131,5,131,3245,8,131,10,131,
	12,131,3248,9,131,1,131,1,131,5,131,3252,8,131,10,131,12,131,3255,9,131,
	1,131,1,131,3,131,3259,8,131,3,131,3261,8,131,1,132,1,132,1,132,3,132,3266,
	8,132,1,133,1,133,5,133,3270,8,133,10,133,12,133,3273,9,133,1,133,1,133,
	1,134,1,134,5,134,3279,8,134,10,134,12,134,3282,9,134,1,134,1,134,1,135,
	1,135,5,135,3288,8,135,10,135,12,135,3291,9,135,1,135,1,135,5,135,3295,
	8,135,10,135,12,135,3298,9,135,1,135,4,135,3301,8,135,11,135,12,135,3302,
	1,135,5,135,3306,8,135,10,135,12,135,3309,9,135,1,135,3,135,3312,8,135,
	1,135,5,135,3315,8,135,10,135,12,135,3318,9,135,1,135,3,135,3321,8,135,
	1,136,1,136,5,136,3325,8,136,10,136,12,136,3328,9,136,1,136,1,136,5,136,
	3332,8,136,10,136,12,136,3335,9,136,1,136,1,136,1,136,1,136,5,136,3341,
	8,136,10,136,12,136,3344,9,136,1,136,3,136,3347,8,136,1,136,1,136,5,136,
	3351,8,136,10,136,12,136,3354,9,136,1,136,1,136,1,137,1,137,5,137,3360,
	8,137,10,137,12,137,3363,9,137,1,137,1,137,1,138,1,138,5,138,3369,8,138,
	10,138,12,138,3372,9,138,1,138,1,138,1,138,3,138,3377,8,138,1,138,1,138,
	1,138,1,138,3,138,3383,8,138,1,139,3,139,3386,8,139,1,139,1,139,5,139,3390,
	8,139,10,139,12,139,3393,9,139,1,139,1,139,3,139,3397,8,139,1,140,1,140,
	1,141,1,141,1,142,1,142,1,143,1,143,1,144,1,144,1,145,1,145,1,146,1,146,
	1,147,1,147,1,148,1,148,1,148,1,148,1,148,3,148,3420,8,148,1,149,1,149,
	1,149,1,149,3,149,3426,8,149,1,150,1,150,1,151,5,151,3431,8,151,10,151,
	12,151,3434,9,151,1,151,1,151,5,151,3438,8,151,10,151,12,151,3441,9,151,
	1,151,1,151,3,151,3445,8,151,1,152,1,152,1,152,1,153,1,153,4,153,3452,8,
	153,11,153,12,153,3453,1,154,1,154,4,154,3458,8,154,11,154,12,154,3459,
	1,155,1,155,1,155,1,155,1,155,1,155,1,155,1,155,3,155,3470,8,155,1,155,
	5,155,3473,8,155,10,155,12,155,3476,9,155,1,156,4,156,3479,8,156,11,156,
	12,156,3480,1,157,1,157,1,157,5,157,3486,8,157,10,157,12,157,3489,9,157,
	3,157,3491,8,157,1,158,1,158,1,159,1,159,1,160,1,160,1,161,1,161,1,162,
	4,162,3502,8,162,11,162,12,162,3503,1,163,1,163,5,163,3508,8,163,10,163,
	12,163,3511,9,163,1,163,1,163,5,163,3515,8,163,10,163,12,163,3518,9,163,
	1,163,3,163,3521,8,163,1,164,1,164,1,165,1,165,1,166,1,166,1,167,1,167,
	1,168,1,168,1,169,1,169,1,170,1,170,3,170,3537,8,170,1,170,5,170,3540,8,
	170,10,170,12,170,3543,9,170,1,171,1,171,5,171,3547,8,171,10,171,12,171,
	3550,9,171,1,171,1,171,3,171,3554,8,171,1,171,1,171,1,172,1,172,5,172,3560,
	8,172,10,172,12,172,3563,9,172,1,172,1,172,3,172,3567,8,172,1,172,1,172,
	4,172,3571,8,172,11,172,12,172,3572,1,172,1,172,1,173,1,173,1,173,5,173,
	3580,8,173,10,173,12,173,3583,9,173,1,173,1,173,1,174,1,174,3,174,3589,
	8,174,1,175,1,175,1,176,1,176,5,176,3595,8,176,10,176,12,176,3598,9,176,
	1,176,1,176,5,176,3602,8,176,10,176,12,176,3605,9,176,1,176,0,0,177,0,2,
	4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,
	54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,
	102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,
	138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,172,
	174,176,178,180,182,184,186,188,190,192,194,196,198,200,202,204,206,208,
	210,212,214,216,218,220,222,224,226,228,230,232,234,236,238,240,242,244,
	246,248,250,252,254,256,258,260,262,264,266,268,270,272,274,276,278,280,
	282,284,286,288,290,292,294,296,298,300,302,304,306,308,310,312,314,316,
	318,320,322,324,326,328,330,332,334,336,338,340,342,344,346,348,350,352,
	0,31,2,0,41,41,43,43,1,0,78,79,1,0,85,86,1,0,45,46,1,0,41,42,2,0,5,5,27,
	27,1,0,36,37,2,0,137,137,140,147,1,0,161,163,1,0,166,168,2,0,61,61,85,85,
	2,0,58,58,99,99,1,0,29,33,2,0,51,52,54,55,1,0,47,50,2,0,104,104,106,106,
	2,0,103,103,105,105,1,0,18,19,1,0,15,17,2,0,53,53,102,102,1,0,24,25,1,0,
	113,118,2,0,125,125,130,130,1,0,109,112,2,0,104,104,107,107,1,0,119,124,
	1,0,126,128,1,0,131,133,1,0,135,136,1,0,64,71,7,0,63,71,73,73,81,84,88,
	88,93,94,107,136,148,148,4052,0,355,1,0,0,0,2,385,1,0,0,0,4,416,1,0,0,0,
	6,425,1,0,0,0,8,437,1,0,0,0,10,439,1,0,0,0,12,445,1,0,0,0,14,482,1,0,0,
	0,16,487,1,0,0,0,18,490,1,0,0,0,20,500,1,0,0,0,22,503,1,0,0,0,24,508,1,
	0,0,0,26,547,1,0,0,0,28,550,1,0,0,0,30,641,1,0,0,0,32,646,1,0,0,0,34,664,
	1,0,0,0,36,711,1,0,0,0,38,747,1,0,0,0,40,779,1,0,0,0,42,781,1,0,0,0,44,
	793,1,0,0,0,46,806,1,0,0,0,48,823,1,0,0,0,50,868,1,0,0,0,52,893,1,0,0,0,
	54,923,1,0,0,0,56,952,1,0,0,0,58,959,1,0,0,0,60,961,1,0,0,0,62,971,1,0,
	0,0,64,1024,1,0,0,0,66,1071,1,0,0,0,68,1091,1,0,0,0,70,1177,1,0,0,0,72,
	1182,1,0,0,0,74,1224,1,0,0,0,76,1269,1,0,0,0,78,1383,1,0,0,0,80,1393,1,
	0,0,0,82,1436,1,0,0,0,84,1495,1,0,0,0,86,1542,1,0,0,0,88,1561,1,0,0,0,90,
	1578,1,0,0,0,92,1595,1,0,0,0,94,1631,1,0,0,0,96,1666,1,0,0,0,98,1675,1,
	0,0,0,100,1709,1,0,0,0,102,1745,1,0,0,0,104,1767,1,0,0,0,106,1779,1,0,0,
	0,108,1783,1,0,0,0,110,1796,1,0,0,0,112,1798,1,0,0,0,114,1818,1,0,0,0,116,
	1833,1,0,0,0,118,1836,1,0,0,0,120,1848,1,0,0,0,122,1864,1,0,0,0,124,1882,
	1,0,0,0,126,1932,1,0,0,0,128,1949,1,0,0,0,130,1956,1,0,0,0,132,1976,1,0,
	0,0,134,2011,1,0,0,0,136,2020,1,0,0,0,138,2029,1,0,0,0,140,2039,1,0,0,0,
	142,2041,1,0,0,0,144,2067,1,0,0,0,146,2069,1,0,0,0,148,2105,1,0,0,0,150,
	2131,1,0,0,0,152,2169,1,0,0,0,154,2179,1,0,0,0,156,2187,1,0,0,0,158,2191,
	1,0,0,0,160,2193,1,0,0,0,162,2213,1,0,0,0,164,2233,1,0,0,0,166,2248,1,0,
	0,0,168,2263,1,0,0,0,170,2270,1,0,0,0,172,2294,1,0,0,0,174,2315,1,0,0,0,
	176,2318,1,0,0,0,178,2333,1,0,0,0,180,2347,1,0,0,0,182,2362,1,0,0,0,184,
	2377,1,0,0,0,186,2401,1,0,0,0,188,2415,1,0,0,0,190,2417,1,0,0,0,192,2429,
	1,0,0,0,194,2436,1,0,0,0,196,2438,1,0,0,0,198,2456,1,0,0,0,200,2458,1,0,
	0,0,202,2477,1,0,0,0,204,2479,1,0,0,0,206,2523,1,0,0,0,208,2536,1,0,0,0,
	210,2548,1,0,0,0,212,2562,1,0,0,0,214,2606,1,0,0,0,216,2653,1,0,0,0,218,
	2702,1,0,0,0,220,2704,1,0,0,0,222,2720,1,0,0,0,224,2766,1,0,0,0,226,2770,
	1,0,0,0,228,2772,1,0,0,0,230,2782,1,0,0,0,232,2793,1,0,0,0,234,2795,1,0,
	0,0,236,2811,1,0,0,0,238,2813,1,0,0,0,240,2829,1,0,0,0,242,2863,1,0,0,0,
	244,2910,1,0,0,0,246,2913,1,0,0,0,248,2982,1,0,0,0,250,2985,1,0,0,0,252,
	3025,1,0,0,0,254,3051,1,0,0,0,256,3053,1,0,0,0,258,3114,1,0,0,0,260,3153,
	1,0,0,0,262,3260,1,0,0,0,264,3265,1,0,0,0,266,3267,1,0,0,0,268,3276,1,0,
	0,0,270,3285,1,0,0,0,272,3322,1,0,0,0,274,3357,1,0,0,0,276,3382,1,0,0,0,
	278,3385,1,0,0,0,280,3398,1,0,0,0,282,3400,1,0,0,0,284,3402,1,0,0,0,286,
	3404,1,0,0,0,288,3406,1,0,0,0,290,3408,1,0,0,0,292,3410,1,0,0,0,294,3412,
	1,0,0,0,296,3419,1,0,0,0,298,3425,1,0,0,0,300,3427,1,0,0,0,302,3444,1,0,
	0,0,304,3446,1,0,0,0,306,3451,1,0,0,0,308,3457,1,0,0,0,310,3469,1,0,0,0,
	312,3478,1,0,0,0,314,3490,1,0,0,0,316,3492,1,0,0,0,318,3494,1,0,0,0,320,
	3496,1,0,0,0,322,3498,1,0,0,0,324,3501,1,0,0,0,326,3520,1,0,0,0,328,3522,
	1,0,0,0,330,3524,1,0,0,0,332,3526,1,0,0,0,334,3528,1,0,0,0,336,3530,1,0,
	0,0,338,3532,1,0,0,0,340,3536,1,0,0,0,342,3553,1,0,0,0,344,3566,1,0,0,0,
	346,3576,1,0,0,0,348,3588,1,0,0,0,350,3590,1,0,0,0,352,3592,1,0,0,0,354,
	356,3,10,5,0,355,354,1,0,0,0,355,356,1,0,0,0,356,360,1,0,0,0,357,359,5,
	5,0,0,358,357,1,0,0,0,359,362,1,0,0,0,360,358,1,0,0,0,360,361,1,0,0,0,361,
	366,1,0,0,0,362,360,1,0,0,0,363,365,3,12,6,0,364,363,1,0,0,0,365,368,1,
	0,0,0,366,364,1,0,0,0,366,367,1,0,0,0,367,370,1,0,0,0,368,366,1,0,0,0,369,
	371,3,14,7,0,370,369,1,0,0,0,370,371,1,0,0,0,371,373,1,0,0,0,372,374,3,
	16,8,0,373,372,1,0,0,0,373,374,1,0,0,0,374,379,1,0,0,0,375,378,3,22,11,
	0,376,378,3,8,4,0,377,375,1,0,0,0,377,376,1,0,0,0,378,381,1,0,0,0,379,377,
	1,0,0,0,379,380,1,0,0,0,380,382,1,0,0,0,381,379,1,0,0,0,382,383,5,0,0,1,
	383,1,1,0,0,0,384,386,3,10,5,0,385,384,1,0,0,0,385,386,1,0,0,0,386,390,
	1,0,0,0,387,389,5,5,0,0,388,387,1,0,0,0,389,392,1,0,0,0,390,388,1,0,0,0,
	390,391,1,0,0,0,391,396,1,0,0,0,392,390,1,0,0,0,393,395,3,12,6,0,394,393,
	1,0,0,0,395,398,1,0,0,0,396,394,1,0,0,0,396,397,1,0,0,0,397,400,1,0,0,0,
	398,396,1,0,0,0,399,401,3,14,7,0,400,399,1,0,0,0,400,401,1,0,0,0,401,403,
	1,0,0,0,402,404,3,16,8,0,403,402,1,0,0,0,403,404,1,0,0,0,404,411,1,0,0,
	0,405,407,3,136,68,0,406,408,3,154,77,0,407,406,1,0,0,0,407,408,1,0,0,0,
	408,410,1,0,0,0,409,405,1,0,0,0,410,413,1,0,0,0,411,409,1,0,0,0,411,412,
	1,0,0,0,412,414,1,0,0,0,413,411,1,0,0,0,414,415,5,0,0,1,415,3,1,0,0,0,416,
	423,3,170,85,0,417,418,3,288,144,0,418,419,3,104,52,0,419,424,1,0,0,0,420,
	421,3,286,143,0,421,422,3,158,79,0,422,424,1,0,0,0,423,417,1,0,0,0,423,
	420,1,0,0,0,424,5,1,0,0,0,425,429,5,98,0,0,426,428,5,5,0,0,427,426,1,0,
	0,0,428,431,1,0,0,0,429,427,1,0,0,0,429,430,1,0,0,0,430,432,1,0,0,0,431,
	429,1,0,0,0,432,433,3,158,79,0,433,7,1,0,0,0,434,438,3,136,68,0,435,438,
	3,158,79,0,436,438,5,5,0,0,437,434,1,0,0,0,437,435,1,0,0,0,437,436,1,0,
	0,0,438,9,1,0,0,0,439,441,5,1,0,0,440,442,5,5,0,0,441,440,1,0,0,0,442,443,
	1,0,0,0,443,441,1,0,0,0,443,444,1,0,0,0,444,11,1,0,0,0,445,446,7,0,0,0,
	446,450,5,63,0,0,447,449,5,5,0,0,448,447,1,0,0,0,449,452,1,0,0,0,450,448,
	1,0,0,0,450,451,1,0,0,0,451,453,1,0,0,0,452,450,1,0,0,0,453,457,5,26,0,
	0,454,456,5,5,0,0,455,454,1,0,0,0,456,459,1,0,0,0,457,455,1,0,0,0,457,458,
	1,0,0,0,458,469,1,0,0,0,459,457,1,0,0,0,460,462,5,11,0,0,461,463,3,348,
	174,0,462,461,1,0,0,0,463,464,1,0,0,0,464,462,1,0,0,0,464,465,1,0,0,0,465,
	466,1,0,0,0,466,467,5,12,0,0,467,470,1,0,0,0,468,470,3,348,174,0,469,460,
	1,0,0,0,469,468,1,0,0,0,470,474,1,0,0,0,471,473,5,5,0,0,472,471,1,0,0,0,
	473,476,1,0,0,0,474,472,1,0,0,0,474,475,1,0,0,0,475,13,1,0,0,0,476,474,
	1,0,0,0,477,478,5,72,0,0,478,480,3,352,176,0,479,481,3,154,77,0,480,479,
	1,0,0,0,480,481,1,0,0,0,481,483,1,0,0,0,482,477,1,0,0,0,482,483,1,0,0,0,
	483,15,1,0,0,0,484,486,3,18,9,0,485,484,1,0,0,0,486,489,1,0,0,0,487,485,
	1,0,0,0,487,488,1,0,0,0,488,17,1,0,0,0,489,487,1,0,0,0,490,491,5,73,0,0,
	491,495,3,352,176,0,492,493,5,7,0,0,493,496,5,15,0,0,494,496,3,20,10,0,
	495,492,1,0,0,0,495,494,1,0,0,0,495,496,1,0,0,0,496,498,1,0,0,0,497,499,
	3,154,77,0,498,497,1,0,0,0,498,499,1,0,0,0,499,19,1,0,0,0,500,501,5,102,
	0,0,501,502,3,350,175,0,502,21,1,0,0,0,503,505,3,26,13,0,504,506,3,156,
	78,0,505,504,1,0,0,0,505,506,1,0,0,0,506,23,1,0,0,0,507,509,3,306,153,0,
	508,507,1,0,0,0,508,509,1,0,0,0,509,510,1,0,0,0,510,514,5,80,0,0,511,513,
	5,5,0,0,512,511,1,0,0,0,513,516,1,0,0,0,514,512,1,0,0,0,514,515,1,0,0,0,
	515,517,1,0,0,0,516,514,1,0,0,0,517,525,3,350,175,0,518,520,5,5,0,0,519,
	518,1,0,0,0,520,523,1,0,0,0,521,519,1,0,0,0,521,522,1,0,0,0,522,524,1,0,
	0,0,523,521,1,0,0,0,524,526,3,48,24,0,525,521,1,0,0,0,525,526,1,0,0,0,526,
	530,1,0,0,0,527,529,5,5,0,0,528,527,1,0,0,0,529,532,1,0,0,0,530,528,1,0,
	0,0,530,531,1,0,0,0,531,533,1,0,0,0,532,530,1,0,0,0,533,537,5,28,0,0,534,
	536,5,5,0,0,535,534,1,0,0,0,536,539,1,0,0,0,537,535,1,0,0,0,537,538,1,0,
	0,0,538,540,1,0,0,0,539,537,1,0,0,0,540,541,3,104,52,0,541,25,1,0,0,0,542,
	548,3,28,14,0,543,548,3,92,46,0,544,548,3,68,34,0,545,548,3,76,38,0,546,
	548,3,24,12,0,547,542,1,0,0,0,547,543,1,0,0,0,547,544,1,0,0,0,547,545,1,
	0,0,0,547,546,1,0,0,0,548,27,1,0,0,0,549,551,3,306,153,0,550,549,1,0,0,
	0,550,551,1,0,0,0,551,563,1,0,0,0,552,564,5,74,0,0,553,557,5,76,0,0,554,
	556,5,5,0,0,555,554,1,0,0,0,556,559,1,0,0,0,557,555,1,0,0,0,557,558,1,0,
	0,0,558,561,1,0,0,0,559,557,1,0,0,0,560,553,1,0,0,0,560,561,1,0,0,0,561,
	562,1,0,0,0,562,564,5,75,0,0,563,552,1,0,0,0,563,560,1,0,0,0,564,568,1,
	0,0,0,565,567,5,5,0,0,566,565,1,0,0,0,567,570,1,0,0,0,568,566,1,0,0,0,568,
	569,1,0,0,0,569,571,1,0,0,0,570,568,1,0,0,0,571,579,3,350,175,0,572,574,
	5,5,0,0,573,572,1,0,0,0,574,577,1,0,0,0,575,573,1,0,0,0,575,576,1,0,0,0,
	576,578,1,0,0,0,577,575,1,0,0,0,578,580,3,48,24,0,579,575,1,0,0,0,579,580,
	1,0,0,0,580,588,1,0,0,0,581,583,5,5,0,0,582,581,1,0,0,0,583,586,1,0,0,0,
	584,582,1,0,0,0,584,585,1,0,0,0,585,587,1,0,0,0,586,584,1,0,0,0,587,589,
	3,30,15,0,588,584,1,0,0,0,588,589,1,0,0,0,589,604,1,0,0,0,590,592,5,5,0,
	0,591,590,1,0,0,0,592,595,1,0,0,0,593,591,1,0,0,0,593,594,1,0,0,0,594,596,
	1,0,0,0,595,593,1,0,0,0,596,600,5,26,0,0,597,599,5,5,0,0,598,597,1,0,0,
	0,599,602,1,0,0,0,600,598,1,0,0,0,600,601,1,0,0,0,601,603,1,0,0,0,602,600,
	1,0,0,0,603,605,3,38,19,0,604,593,1,0,0,0,604,605,1,0,0,0,605,613,1,0,0,
	0,606,608,5,5,0,0,607,606,1,0,0,0,608,611,1,0,0,0,609,607,1,0,0,0,609,610,
	1,0,0,0,610,612,1,0,0,0,611,609,1,0,0,0,612,614,3,52,26,0,613,609,1,0,0,
	0,613,614,1,0,0,0,614,629,1,0,0,0,615,617,5,5,0,0,616,615,1,0,0,0,617,620,
	1,0,0,0,618,616,1,0,0,0,618,619,1,0,0,0,619,621,1,0,0,0,620,618,1,0,0,0,
	621,630,3,32,16,0,622,624,5,5,0,0,623,622,1,0,0,0,624,627,1,0,0,0,625,623,
	1,0,0,0,625,626,1,0,0,0,626,628,1,0,0,0,627,625,1,0,0,0,628,630,3,98,49,
	0,629,618,1,0,0,0,629,625,1,0,0,0,629,630,1,0,0,0,630,29,1,0,0,0,631,633,
	3,306,153,0,632,631,1,0,0,0,632,633,1,0,0,0,633,634,1,0,0,0,634,638,5,81,
	0,0,635,637,5,5,0,0,636,635,1,0,0,0,637,640,1,0,0,0,638,636,1,0,0,0,638,
	639,1,0,0,0,639,642,1,0,0,0,640,638,1,0,0,0,641,632,1,0,0,0,641,642,1,0,
	0,0,642,644,1,0,0,0,643,645,3,34,17,0,644,643,1,0,0,0,644,645,1,0,0,0,645,
	31,1,0,0,0,646,650,5,13,0,0,647,649,5,5,0,0,648,647,1,0,0,0,649,652,1,0,
	0,0,650,648,1,0,0,0,650,651,1,0,0,0,651,654,1,0,0,0,652,650,1,0,0,0,653,
	655,3,56,28,0,654,653,1,0,0,0,654,655,1,0,0,0,655,659,1,0,0,0,656,658,5,
	5,0,0,657,656,1,0,0,0,658,661,1,0,0,0,659,657,1,0,0,0,659,660,1,0,0,0,660,
	662,1,0,0,0,661,659,1,0,0,0,662,663,5,14,0,0,663,33,1,0,0,0,664,668,5,9,
	0,0,665,667,5,5,0,0,666,665,1,0,0,0,667,670,1,0,0,0,668,666,1,0,0,0,668,
	669,1,0,0,0,669,700,1,0,0,0,670,668,1,0,0,0,671,688,3,36,18,0,672,674,5,
	5,0,0,673,672,1,0,0,0,674,677,1,0,0,0,675,673,1,0,0,0,675,676,1,0,0,0,676,
	678,1,0,0,0,677,675,1,0,0,0,678,682,5,8,0,0,679,681,5,5,0,0,680,679,1,0,
	0,0,681,684,1,0,0,0,682,680,1,0,0,0,682,683,1,0,0,0,683,685,1,0,0,0,684,
	682,1,0,0,0,685,687,3,36,18,0,686,675,1,0,0,0,687,690,1,0,0,0,688,686,1,
	0,0,0,688,689,1,0,0,0,689,698,1,0,0,0,690,688,1,0,0,0,691,693,5,5,0,0,692,
	691,1,0,0,0,693,696,1,0,0,0,694,692,1,0,0,0,694,695,1,0,0,0,695,697,1,0,
	0,0,696,694,1,0,0,0,697,699,5,8,0,0,698,694,1,0,0,0,698,699,1,0,0,0,699,
	701,1,0,0,0,700,671,1,0,0,0,700,701,1,0,0,0,701,705,1,0,0,0,702,704,5,5,
	0,0,703,702,1,0,0,0,704,707,1,0,0,0,705,703,1,0,0,0,705,706,1,0,0,0,706,
	708,1,0,0,0,707,705,1,0,0,0,708,709,5,10,0,0,709,35,1,0,0,0,710,712,3,306,
	153,0,711,710,1,0,0,0,711,712,1,0,0,0,712,714,1,0,0,0,713,715,7,1,0,0,714,
	713,1,0,0,0,714,715,1,0,0,0,715,719,1,0,0,0,716,718,5,5,0,0,717,716,1,0,
	0,0,718,721,1,0,0,0,719,717,1,0,0,0,719,720,1,0,0,0,720,722,1,0,0,0,721,
	719,1,0,0,0,722,723,3,350,175,0,723,727,5,26,0,0,724,726,5,5,0,0,725,724,
	1,0,0,0,726,729,1,0,0,0,727,725,1,0,0,0,727,728,1,0,0,0,728,730,1,0,0,0,
	729,727,1,0,0,0,730,745,3,104,52,0,731,733,5,5,0,0,732,731,1,0,0,0,733,
	736,1,0,0,0,734,732,1,0,0,0,734,735,1,0,0,0,735,737,1,0,0,0,736,734,1,0,
	0,0,737,741,5,28,0,0,738,740,5,5,0,0,739,738,1,0,0,0,740,743,1,0,0,0,741,
	739,1,0,0,0,741,742,1,0,0,0,742,744,1,0,0,0,743,741,1,0,0,0,744,746,3,158,
	79,0,745,734,1,0,0,0,745,746,1,0,0,0,746,37,1,0,0,0,747,764,3,44,22,0,748,
	750,5,5,0,0,749,748,1,0,0,0,750,753,1,0,0,0,751,749,1,0,0,0,751,752,1,0,
	0,0,752,754,1,0,0,0,753,751,1,0,0,0,754,758,5,8,0,0,755,757,5,5,0,0,756,
	755,1,0,0,0,757,760,1,0,0,0,758,756,1,0,0,0,758,759,1,0,0,0,759,761,1,0,
	0,0,760,758,1,0,0,0,761,763,3,44,22,0,762,751,1,0,0,0,763,766,1,0,0,0,764,
	762,1,0,0,0,764,765,1,0,0,0,765,39,1,0,0,0,766,764,1,0,0,0,767,780,3,42,
	21,0,768,780,3,46,23,0,769,780,3,112,56,0,770,780,3,122,61,0,771,775,5,
	124,0,0,772,774,5,5,0,0,773,772,1,0,0,0,774,777,1,0,0,0,775,773,1,0,0,0,
	775,776,1,0,0,0,776,778,1,0,0,0,777,775,1,0,0,0,778,780,3,122,61,0,779,
	767,1,0,0,0,779,768,1,0,0,0,779,769,1,0,0,0,779,770,1,0,0,0,779,771,1,0,
	0,0,780,41,1,0,0,0,781,785,3,112,56,0,782,784,5,5,0,0,783,782,1,0,0,0,784,
	787,1,0,0,0,785,783,1,0,0,0,785,786,1,0,0,0,786,788,1,0,0,0,787,785,1,0,
	0,0,788,789,3,214,107,0,789,43,1,0,0,0,790,792,3,340,170,0,791,790,1,0,
	0,0,792,795,1,0,0,0,793,791,1,0,0,0,793,794,1,0,0,0,794,799,1,0,0,0,795,
	793,1,0,0,0,796,798,5,5,0,0,797,796,1,0,0,0,798,801,1,0,0,0,799,797,1,0,
	0,0,799,800,1,0,0,0,800,802,1,0,0,0,801,799,1,0,0,0,802,803,3,40,20,0,803,
	45,1,0,0,0,804,807,3,112,56,0,805,807,3,122,61,0,806,804,1,0,0,0,806,805,
	1,0,0,0,807,811,1,0,0,0,808,810,5,5,0,0,809,808,1,0,0,0,810,813,1,0,0,0,
	811,809,1,0,0,0,811,812,1,0,0,0,812,814,1,0,0,0,813,811,1,0,0,0,814,818,
	5,82,0,0,815,817,5,5,0,0,816,815,1,0,0,0,817,820,1,0,0,0,818,816,1,0,0,
	0,818,819,1,0,0,0,819,821,1,0,0,0,820,818,1,0,0,0,821,822,3,158,79,0,822,
	47,1,0,0,0,823,827,5,47,0,0,824,826,5,5,0,0,825,824,1,0,0,0,826,829,1,0,
	0,0,827,825,1,0,0,0,827,828,1,0,0,0,828,830,1,0,0,0,829,827,1,0,0,0,830,
	847,3,50,25,0,831,833,5,5,0,0,832,831,1,0,0,0,833,836,1,0,0,0,834,832,1,
	0,0,0,834,835,1,0,0,0,835,837,1,0,0,0,836,834,1,0,0,0,837,841,5,8,0,0,838,
	840,5,5,0,0,839,838,1,0,0,0,840,843,1,0,0,0,841,839,1,0,0,0,841,842,1,0,
	0,0,842,844,1,0,0,0,843,841,1,0,0,0,844,846,3,50,25,0,845,834,1,0,0,0,846,
	849,1,0,0,0,847,845,1,0,0,0,847,848,1,0,0,0,848,857,1,0,0,0,849,847,1,0,
	0,0,850,852,5,5,0,0,851,850,1,0,0,0,852,855,1,0,0,0,853,851,1,0,0,0,853,
	854,1,0,0,0,854,856,1,0,0,0,855,853,1,0,0,0,856,858,5,8,0,0,857,853,1,0,
	0,0,857,858,1,0,0,0,858,862,1,0,0,0,859,861,5,5,0,0,860,859,1,0,0,0,861,
	864,1,0,0,0,862,860,1,0,0,0,862,863,1,0,0,0,863,865,1,0,0,0,864,862,1,0,
	0,0,865,866,5,48,0,0,866,49,1,0,0,0,867,869,3,324,162,0,868,867,1,0,0,0,
	868,869,1,0,0,0,869,873,1,0,0,0,870,872,5,5,0,0,871,870,1,0,0,0,872,875,
	1,0,0,0,873,871,1,0,0,0,873,874,1,0,0,0,874,876,1,0,0,0,875,873,1,0,0,0,
	876,891,3,350,175,0,877,879,5,5,0,0,878,877,1,0,0,0,879,882,1,0,0,0,880,
	878,1,0,0,0,880,881,1,0,0,0,881,883,1,0,0,0,882,880,1,0,0,0,883,887,5,26,
	0,0,884,886,5,5,0,0,885,884,1,0,0,0,886,889,1,0,0,0,887,885,1,0,0,0,887,
	888,1,0,0,0,888,890,1,0,0,0,889,887,1,0,0,0,890,892,3,104,52,0,891,880,
	1,0,0,0,891,892,1,0,0,0,892,51,1,0,0,0,893,897,5,88,0,0,894,896,5,5,0,0,
	895,894,1,0,0,0,896,899,1,0,0,0,897,895,1,0,0,0,897,898,1,0,0,0,898,900,
	1,0,0,0,899,897,1,0,0,0,900,917,3,54,27,0,901,903,5,5,0,0,902,901,1,0,0,
	0,903,906,1,0,0,0,904,902,1,0,0,0,904,905,1,0,0,0,905,907,1,0,0,0,906,904,
	1,0,0,0,907,911,5,8,0,0,908,910,5,5,0,0,909,908,1,0,0,0,910,913,1,0,0,0,
	911,909,1,0,0,0,911,912,1,0,0,0,912,914,1,0,0,0,913,911,1,0,0,0,914,916,
	3,54,27,0,915,904,1,0,0,0,916,919,1,0,0,0,917,915,1,0,0,0,917,918,1,0,0,
	0,918,53,1,0,0,0,919,917,1,0,0,0,920,922,3,340,170,0,921,920,1,0,0,0,922,
	925,1,0,0,0,923,921,1,0,0,0,923,924,1,0,0,0,924,926,1,0,0,0,925,923,1,0,
	0,0,926,930,3,350,175,0,927,929,5,5,0,0,928,927,1,0,0,0,929,932,1,0,0,0,
	930,928,1,0,0,0,930,931,1,0,0,0,931,933,1,0,0,0,932,930,1,0,0,0,933,937,
	5,26,0,0,934,936,5,5,0,0,935,934,1,0,0,0,936,939,1,0,0,0,937,935,1,0,0,
	0,937,938,1,0,0,0,938,940,1,0,0,0,939,937,1,0,0,0,940,941,3,104,52,0,941,
	55,1,0,0,0,942,944,3,58,29,0,943,945,3,156,78,0,944,943,1,0,0,0,944,945,
	1,0,0,0,945,951,1,0,0,0,946,948,3,8,4,0,947,949,3,156,78,0,948,947,1,0,
	0,0,948,949,1,0,0,0,949,951,1,0,0,0,950,942,1,0,0,0,950,946,1,0,0,0,951,
	954,1,0,0,0,952,950,1,0,0,0,952,953,1,0,0,0,953,57,1,0,0,0,954,952,1,0,
	0,0,955,960,3,26,13,0,956,960,3,62,31,0,957,960,3,60,30,0,958,960,3,94,
	47,0,959,955,1,0,0,0,959,956,1,0,0,0,959,957,1,0,0,0,959,958,1,0,0,0,960,
	59,1,0,0,0,961,965,5,84,0,0,962,964,5,5,0,0,963,962,1,0,0,0,964,967,1,0,
	0,0,965,963,1,0,0,0,965,966,1,0,0,0,966,968,1,0,0,0,967,965,1,0,0,0,968,
	969,3,142,71,0,969,61,1,0,0,0,970,972,3,306,153,0,971,970,1,0,0,0,971,972,
	1,0,0,0,972,973,1,0,0,0,973,977,5,83,0,0,974,976,5,5,0,0,975,974,1,0,0,
	0,976,979,1,0,0,0,977,975,1,0,0,0,977,978,1,0,0,0,978,981,1,0,0,0,979,977,
	1,0,0,0,980,982,5,116,0,0,981,980,1,0,0,0,981,982,1,0,0,0,982,986,1,0,0,
	0,983,985,5,5,0,0,984,983,1,0,0,0,985,988,1,0,0,0,986,984,1,0,0,0,986,987,
	1,0,0,0,987,989,1,0,0,0,988,986,1,0,0,0,989,997,5,77,0,0,990,992,5,5,0,
	0,991,990,1,0,0,0,992,995,1,0,0,0,993,991,1,0,0,0,993,994,1,0,0,0,994,996,
	1,0,0,0,995,993,1,0,0,0,996,998,3,350,175,0,997,993,1,0,0,0,997,998,1,0,
	0,0,998,1013,1,0,0,0,999,1001,5,5,0,0,1000,999,1,0,0,0,1001,1004,1,0,0,
	0,1002,1000,1,0,0,0,1002,1003,1,0,0,0,1003,1005,1,0,0,0,1004,1002,1,0,0,
	0,1005,1009,5,26,0,0,1006,1008,5,5,0,0,1007,1006,1,0,0,0,1008,1011,1,0,
	0,0,1009,1007,1,0,0,0,1009,1010,1,0,0,0,1010,1012,1,0,0,0,1011,1009,1,0,
	0,0,1012,1014,3,38,19,0,1013,1002,1,0,0,0,1013,1014,1,0,0,0,1014,1022,1,
	0,0,0,1015,1017,5,5,0,0,1016,1015,1,0,0,0,1017,1020,1,0,0,0,1018,1016,1,
	0,0,0,1018,1019,1,0,0,0,1019,1021,1,0,0,0,1020,1018,1,0,0,0,1021,1023,3,
	32,16,0,1022,1018,1,0,0,0,1022,1023,1,0,0,0,1023,63,1,0,0,0,1024,1028,5,
	9,0,0,1025,1027,5,5,0,0,1026,1025,1,0,0,0,1027,1030,1,0,0,0,1028,1026,1,
	0,0,0,1028,1029,1,0,0,0,1029,1060,1,0,0,0,1030,1028,1,0,0,0,1031,1048,3,
	66,33,0,1032,1034,5,5,0,0,1033,1032,1,0,0,0,1034,1037,1,0,0,0,1035,1033,
	1,0,0,0,1035,1036,1,0,0,0,1036,1038,1,0,0,0,1037,1035,1,0,0,0,1038,1042,
	5,8,0,0,1039,1041,5,5,0,0,1040,1039,1,0,0,0,1041,1044,1,0,0,0,1042,1040,
	1,0,0,0,1042,1043,1,0,0,0,1043,1045,1,0,0,0,1044,1042,1,0,0,0,1045,1047,
	3,66,33,0,1046,1035,1,0,0,0,1047,1050,1,0,0,0,1048,1046,1,0,0,0,1048,1049,
	1,0,0,0,1049,1058,1,0,0,0,1050,1048,1,0,0,0,1051,1053,5,5,0,0,1052,1051,
	1,0,0,0,1053,1056,1,0,0,0,1054,1052,1,0,0,0,1054,1055,1,0,0,0,1055,1057,
	1,0,0,0,1056,1054,1,0,0,0,1057,1059,5,8,0,0,1058,1054,1,0,0,0,1058,1059,
	1,0,0,0,1059,1061,1,0,0,0,1060,1031,1,0,0,0,1060,1061,1,0,0,0,1061,1065,
	1,0,0,0,1062,1064,5,5,0,0,1063,1062,1,0,0,0,1064,1067,1,0,0,0,1065,1063,
	1,0,0,0,1065,1066,1,0,0,0,1066,1068,1,0,0,0,1067,1065,1,0,0,0,1068,1069,
	5,10,0,0,1069,65,1,0,0,0,1070,1072,3,308,154,0,1071,1070,1,0,0,0,1071,1072,
	1,0,0,0,1072,1073,1,0,0,0,1073,1088,3,90,45,0,1074,1076,5,5,0,0,1075,1074,
	1,0,0,0,1076,1079,1,0,0,0,1077,1075,1,0,0,0,1077,1078,1,0,0,0,1078,1080,
	1,0,0,0,1079,1077,1,0,0,0,1080,1084,5,28,0,0,1081,1083,5,5,0,0,1082,1081,
	1,0,0,0,1083,1086,1,0,0,0,1084,1082,1,0,0,0,1084,1085,1,0,0,0,1085,1087,
	1,0,0,0,1086,1084,1,0,0,0,1087,1089,3,158,79,0,1088,1077,1,0,0,0,1088,1089,
	1,0,0,0,1089,67,1,0,0,0,1090,1092,3,306,153,0,1091,1090,1,0,0,0,1091,1092,
	1,0,0,0,1092,1093,1,0,0,0,1093,1101,5,76,0,0,1094,1096,5,5,0,0,1095,1094,
	1,0,0,0,1096,1099,1,0,0,0,1097,1095,1,0,0,0,1097,1098,1,0,0,0,1098,1100,
	1,0,0,0,1099,1097,1,0,0,0,1100,1102,3,48,24,0,1101,1097,1,0,0,0,1101,1102,
	1,0,0,0,1102,1118,1,0,0,0,1103,1105,5,5,0,0,1104,1103,1,0,0,0,1105,1108,
	1,0,0,0,1106,1104,1,0,0,0,1106,1107,1,0,0,0,1107,1109,1,0,0,0,1108,1106,
	1,0,0,0,1109,1113,3,128,64,0,1110,1112,5,5,0,0,1111,1110,1,0,0,0,1112,1115,
	1,0,0,0,1113,1111,1,0,0,0,1113,1114,1,0,0,0,1114,1116,1,0,0,0,1115,1113,
	1,0,0,0,1116,1117,5,7,0,0,1117,1119,1,0,0,0,1118,1106,1,0,0,0,1118,1119,
	1,0,0,0,1119,1123,1,0,0,0,1120,1122,5,5,0,0,1121,1120,1,0,0,0,1122,1125,
	1,0,0,0,1123,1121,1,0,0,0,1123,1124,1,0,0,0,1124,1126,1,0,0,0,1125,1123,
	1,0,0,0,1126,1130,3,350,175,0,1127,1129,5,5,0,0,1128,1127,1,0,0,0,1129,
	1132,1,0,0,0,1130,1128,1,0,0,0,1130,1131,1,0,0,0,1131,1133,1,0,0,0,1132,
	1130,1,0,0,0,1133,1148,3,64,32,0,1134,1136,5,5,0,0,1135,1134,1,0,0,0,1136,
	1139,1,0,0,0,1137,1135,1,0,0,0,1137,1138,1,0,0,0,1138,1140,1,0,0,0,1139,
	1137,1,0,0,0,1140,1144,5,26,0,0,1141,1143,5,5,0,0,1142,1141,1,0,0,0,1143,
	1146,1,0,0,0,1144,1142,1,0,0,0,1144,1145,1,0,0,0,1145,1147,1,0,0,0,1146,
	1144,1,0,0,0,1147,1149,3,104,52,0,1148,1137,1,0,0,0,1148,1149,1,0,0,0,1149,
	1157,1,0,0,0,1150,1152,5,5,0,0,1151,1150,1,0,0,0,1152,1155,1,0,0,0,1153,
	1151,1,0,0,0,1153,1154,1,0,0,0,1154,1156,1,0,0,0,1155,1153,1,0,0,0,1156,
	1158,3,52,26,0,1157,1153,1,0,0,0,1157,1158,1,0,0,0,1158,1166,1,0,0,0,1159,
	1161,5,5,0,0,1160,1159,1,0,0,0,1161,1164,1,0,0,0,1162,1160,1,0,0,0,1162,
	1163,1,0,0,0,1163,1165,1,0,0,0,1164,1162,1,0,0,0,1165,1167,3,70,35,0,1166,
	1162,1,0,0,0,1166,1167,1,0,0,0,1167,69,1,0,0,0,1168,1178,3,142,71,0,1169,
	1173,5,28,0,0,1170,1172,5,5,0,0,1171,1170,1,0,0,0,1172,1175,1,0,0,0,1173,
	1171,1,0,0,0,1173,1174,1,0,0,0,1174,1176,1,0,0,0,1175,1173,1,0,0,0,1176,
	1178,3,158,79,0,1177,1168,1,0,0,0,1177,1169,1,0,0,0,1178,71,1,0,0,0,1179,
	1181,3,340,170,0,1180,1179,1,0,0,0,1181,1184,1,0,0,0,1182,1180,1,0,0,0,
	1182,1183,1,0,0,0,1183,1188,1,0,0,0,1184,1182,1,0,0,0,1185,1187,5,5,0,0,
	1186,1185,1,0,0,0,1187,1190,1,0,0,0,1188,1186,1,0,0,0,1188,1189,1,0,0,0,
	1189,1191,1,0,0,0,1190,1188,1,0,0,0,1191,1206,3,350,175,0,1192,1194,5,5,
	0,0,1193,1192,1,0,0,0,1194,1197,1,0,0,0,1195,1193,1,0,0,0,1195,1196,1,0,
	0,0,1196,1198,1,0,0,0,1197,1195,1,0,0,0,1198,1202,5,26,0,0,1199,1201,5,
	5,0,0,1200,1199,1,0,0,0,1201,1204,1,0,0,0,1202,1200,1,0,0,0,1202,1203,1,
	0,0,0,1203,1205,1,0,0,0,1204,1202,1,0,0,0,1205,1207,3,104,52,0,1206,1195,
	1,0,0,0,1206,1207,1,0,0,0,1207,1222,1,0,0,0,1208,1210,5,5,0,0,1209,1208,
	1,0,0,0,1210,1213,1,0,0,0,1211,1209,1,0,0,0,1211,1212,1,0,0,0,1212,1214,
	1,0,0,0,1213,1211,1,0,0,0,1214,1218,5,28,0,0,1215,1217,5,5,0,0,1216,1215,
	1,0,0,0,1217,1220,1,0,0,0,1218,1216,1,0,0,0,1218,1219,1,0,0,0,1219,1221,
	1,0,0,0,1220,1218,1,0,0,0,1221,1223,3,158,79,0,1222,1211,1,0,0,0,1222,1223,
	1,0,0,0,1223,73,1,0,0,0,1224,1228,5,9,0,0,1225,1227,5,5,0,0,1226,1225,1,
	0,0,0,1227,1230,1,0,0,0,1228,1226,1,0,0,0,1228,1229,1,0,0,0,1229,1231,1,
	0,0,0,1230,1228,1,0,0,0,1231,1248,3,72,36,0,1232,1234,5,5,0,0,1233,1232,
	1,0,0,0,1234,1237,1,0,0,0,1235,1233,1,0,0,0,1235,1236,1,0,0,0,1236,1238,
	1,0,0,0,1237,1235,1,0,0,0,1238,1242,5,8,0,0,1239,1241,5,5,0,0,1240,1239,
	1,0,0,0,1241,1244,1,0,0,0,1242,1240,1,0,0,0,1242,1243,1,0,0,0,1243,1245,
	1,0,0,0,1244,1242,1,0,0,0,1245,1247,3,72,36,0,1246,1235,1,0,0,0,1247,1250,
	1,0,0,0,1248,1246,1,0,0,0,1248,1249,1,0,0,0,1249,1258,1,0,0,0,1250,1248,
	1,0,0,0,1251,1253,5,5,0,0,1252,1251,1,0,0,0,1253,1256,1,0,0,0,1254,1252,
	1,0,0,0,1254,1255,1,0,0,0,1255,1257,1,0,0,0,1256,1254,1,0,0,0,1257,1259,
	5,8,0,0,1258,1254,1,0,0,0,1258,1259,1,0,0,0,1259,1263,1,0,0,0,1260,1262,
	5,5,0,0,1261,1260,1,0,0,0,1262,1265,1,0,0,0,1263,1261,1,0,0,0,1263,1264,
	1,0,0,0,1264,1266,1,0,0,0,1265,1263,1,0,0,0,1266,1267,5,10,0,0,1267,75,
	1,0,0,0,1268,1270,3,306,153,0,1269,1268,1,0,0,0,1269,1270,1,0,0,0,1270,
	1271,1,0,0,0,1271,1279,7,1,0,0,1272,1274,5,5,0,0,1273,1272,1,0,0,0,1274,
	1277,1,0,0,0,1275,1273,1,0,0,0,1275,1276,1,0,0,0,1276,1278,1,0,0,0,1277,
	1275,1,0,0,0,1278,1280,3,48,24,0,1279,1275,1,0,0,0,1279,1280,1,0,0,0,1280,
	1296,1,0,0,0,1281,1283,5,5,0,0,1282,1281,1,0,0,0,1283,1286,1,0,0,0,1284,
	1282,1,0,0,0,1284,1285,1,0,0,0,1285,1287,1,0,0,0,1286,1284,1,0,0,0,1287,
	1291,3,128,64,0,1288,1290,5,5,0,0,1289,1288,1,0,0,0,1290,1293,1,0,0,0,1291,
	1289,1,0,0,0,1291,1292,1,0,0,0,1292,1294,1,0,0,0,1293,1291,1,0,0,0,1294,
	1295,5,7,0,0,1295,1297,1,0,0,0,1296,1284,1,0,0,0,1296,1297,1,0,0,0,1297,
	1301,1,0,0,0,1298,1300,5,5,0,0,1299,1298,1,0,0,0,1300,1303,1,0,0,0,1301,
	1299,1,0,0,0,1301,1302,1,0,0,0,1302,1306,1,0,0,0,1303,1301,1,0,0,0,1304,
	1307,3,74,37,0,1305,1307,3,72,36,0,1306,1304,1,0,0,0,1306,1305,1,0,0,0,
	1307,1315,1,0,0,0,1308,1310,5,5,0,0,1309,1308,1,0,0,0,1310,1313,1,0,0,0,
	1311,1309,1,0,0,0,1311,1312,1,0,0,0,1312,1314,1,0,0,0,1313,1311,1,0,0,0,
	1314,1316,3,52,26,0,1315,1311,1,0,0,0,1315,1316,1,0,0,0,1316,1334,1,0,0,
	0,1317,1319,5,5,0,0,1318,1317,1,0,0,0,1319,1322,1,0,0,0,1320,1318,1,0,0,
	0,1320,1321,1,0,0,0,1321,1332,1,0,0,0,1322,1320,1,0,0,0,1323,1327,5,28,
	0,0,1324,1326,5,5,0,0,1325,1324,1,0,0,0,1326,1329,1,0,0,0,1327,1325,1,0,
	0,0,1327,1328,1,0,0,0,1328,1330,1,0,0,0,1329,1327,1,0,0,0,1330,1333,3,158,
	79,0,1331,1333,3,78,39,0,1332,1323,1,0,0,0,1332,1331,1,0,0,0,1333,1335,
	1,0,0,0,1334,1320,1,0,0,0,1334,1335,1,0,0,0,1335,1343,1,0,0,0,1336,1338,
	5,5,0,0,1337,1336,1,0,0,0,1338,1341,1,0,0,0,1339,1337,1,0,0,0,1339,1340,
	1,0,0,0,1340,1342,1,0,0,0,1341,1339,1,0,0,0,1342,1344,5,27,0,0,1343,1339,
	1,0,0,0,1343,1344,1,0,0,0,1344,1348,1,0,0,0,1345,1347,5,5,0,0,1346,1345,
	1,0,0,0,1347,1350,1,0,0,0,1348,1346,1,0,0,0,1348,1349,1,0,0,0,1349,1381,
	1,0,0,0,1350,1348,1,0,0,0,1351,1353,3,80,40,0,1352,1351,1,0,0,0,1352,1353,
	1,0,0,0,1353,1364,1,0,0,0,1354,1356,5,5,0,0,1355,1354,1,0,0,0,1356,1359,
	1,0,0,0,1357,1355,1,0,0,0,1357,1358,1,0,0,0,1358,1361,1,0,0,0,1359,1357,
	1,0,0,0,1360,1362,3,154,77,0,1361,1360,1,0,0,0,1361,1362,1,0,0,0,1362,1363,
	1,0,0,0,1363,1365,3,82,41,0,1364,1357,1,0,0,0,1364,1365,1,0,0,0,1365,1382,
	1,0,0,0,1366,1368,3,82,41,0,1367,1366,1,0,0,0,1367,1368,1,0,0,0,1368,1379,
	1,0,0,0,1369,1371,5,5,0,0,1370,1369,1,0,0,0,1371,1374,1,0,0,0,1372,1370,
	1,0,0,0,1372,1373,1,0,0,0,1373,1376,1,0,0,0,1374,1372,1,0,0,0,1375,1377,
	3,154,77,0,1376,1375,1,0,0,0,1376,1377,1,0,0,0,1377,1378,1,0,0,0,1378,1380,
	3,80,40,0,1379,1372,1,0,0,0,1379,1380,1,0,0,0,1380,1382,1,0,0,0,1381,1352,
	1,0,0,0,1381,1367,1,0,0,0,1382,77,1,0,0,0,1383,1387,5,82,0,0,1384,1386,
	5,5,0,0,1385,1384,1,0,0,0,1386,1389,1,0,0,0,1387,1385,1,0,0,0,1387,1388,
	1,0,0,0,1388,1390,1,0,0,0,1389,1387,1,0,0,0,1390,1391,3,158,79,0,1391,79,
	1,0,0,0,1392,1394,3,306,153,0,1393,1392,1,0,0,0,1393,1394,1,0,0,0,1394,
	1395,1,0,0,0,1395,1433,5,66,0,0,1396,1398,5,5,0,0,1397,1396,1,0,0,0,1398,
	1401,1,0,0,0,1399,1397,1,0,0,0,1399,1400,1,0,0,0,1400,1402,1,0,0,0,1401,
	1399,1,0,0,0,1402,1406,5,9,0,0,1403,1405,5,5,0,0,1404,1403,1,0,0,0,1405,
	1408,1,0,0,0,1406,1404,1,0,0,0,1406,1407,1,0,0,0,1407,1409,1,0,0,0,1408,
	1406,1,0,0,0,1409,1424,5,10,0,0,1410,1412,5,5,0,0,1411,1410,1,0,0,0,1412,
	1415,1,0,0,0,1413,1411,1,0,0,0,1413,1414,1,0,0,0,1414,1416,1,0,0,0,1415,
	1413,1,0,0,0,1416,1420,5,26,0,0,1417,1419,5,5,0,0,1418,1417,1,0,0,0,1419,
	1422,1,0,0,0,1420,1418,1,0,0,0,1420,1421,1,0,0,0,1421,1423,1,0,0,0,1422,
	1420,1,0,0,0,1423,1425,3,104,52,0,1424,1413,1,0,0,0,1424,1425,1,0,0,0,1425,
	1429,1,0,0,0,1426,1428,5,5,0,0,1427,1426,1,0,0,0,1428,1431,1,0,0,0,1429,
	1427,1,0,0,0,1429,1430,1,0,0,0,1430,1432,1,0,0,0,1431,1429,1,0,0,0,1432,
	1434,3,70,35,0,1433,1399,1,0,0,0,1433,1434,1,0,0,0,1434,81,1,0,0,0,1435,
	1437,3,306,153,0,1436,1435,1,0,0,0,1436,1437,1,0,0,0,1437,1438,1,0,0,0,
	1438,1493,5,67,0,0,1439,1441,5,5,0,0,1440,1439,1,0,0,0,1441,1444,1,0,0,
	0,1442,1440,1,0,0,0,1442,1443,1,0,0,0,1443,1445,1,0,0,0,1444,1442,1,0,0,
	0,1445,1449,5,9,0,0,1446,1448,5,5,0,0,1447,1446,1,0,0,0,1448,1451,1,0,0,
	0,1449,1447,1,0,0,0,1449,1450,1,0,0,0,1450,1452,1,0,0,0,1451,1449,1,0,0,
	0,1452,1460,3,86,43,0,1453,1455,5,5,0,0,1454,1453,1,0,0,0,1455,1458,1,0,
	0,0,1456,1454,1,0,0,0,1456,1457,1,0,0,0,1457,1459,1,0,0,0,1458,1456,1,0,
	0,0,1459,1461,5,8,0,0,1460,1456,1,0,0,0,1460,1461,1,0,0,0,1461,1465,1,0,
	0,0,1462,1464,5,5,0,0,1463,1462,1,0,0,0,1464,1467,1,0,0,0,1465,1463,1,0,
	0,0,1465,1466,1,0,0,0,1466,1468,1,0,0,0,1467,1465,1,0,0,0,1468,1483,5,10,
	0,0,1469,1471,5,5,0,0,1470,1469,1,0,0,0,1471,1474,1,0,0,0,1472,1470,1,0,
	0,0,1472,1473,1,0,0,0,1473,1475,1,0,0,0,1474,1472,1,0,0,0,1475,1479,5,26,
	0,0,1476,1478,5,5,0,0,1477,1476,1,0,0,0,1478,1481,1,0,0,0,1479,1477,1,0,
	0,0,1479,1480,1,0,0,0,1480,1482,1,0,0,0,1481,1479,1,0,0,0,1482,1484,3,104,
	52,0,1483,1472,1,0,0,0,1483,1484,1,0,0,0,1484,1488,1,0,0,0,1485,1487,5,
	5,0,0,1486,1485,1,0,0,0,1487,1490,1,0,0,0,1488,1486,1,0,0,0,1488,1489,1,
	0,0,0,1489,1491,1,0,0,0,1490,1488,1,0,0,0,1491,1492,3,70,35,0,1492,1494,
	1,0,0,0,1493,1442,1,0,0,0,1493,1494,1,0,0,0,1494,83,1,0,0,0,1495,1499,5,
	9,0,0,1496,1498,5,5,0,0,1497,1496,1,0,0,0,1498,1501,1,0,0,0,1499,1497,1,
	0,0,0,1499,1500,1,0,0,0,1500,1531,1,0,0,0,1501,1499,1,0,0,0,1502,1519,3,
	86,43,0,1503,1505,5,5,0,0,1504,1503,1,0,0,0,1505,1508,1,0,0,0,1506,1504,
	1,0,0,0,1506,1507,1,0,0,0,1507,1509,1,0,0,0,1508,1506,1,0,0,0,1509,1513,
	5,8,0,0,1510,1512,5,5,0,0,1511,1510,1,0,0,0,1512,1515,1,0,0,0,1513,1511,
	1,0,0,0,1513,1514,1,0,0,0,1514,1516,1,0,0,0,1515,1513,1,0,0,0,1516,1518,
	3,86,43,0,1517,1506,1,0,0,0,1518,1521,1,0,0,0,1519,1517,1,0,0,0,1519,1520,
	1,0,0,0,1520,1529,1,0,0,0,1521,1519,1,0,0,0,1522,1524,5,5,0,0,1523,1522,
	1,0,0,0,1524,1527,1,0,0,0,1525,1523,1,0,0,0,1525,1526,1,0,0,0,1526,1528,
	1,0,0,0,1527,1525,1,0,0,0,1528,1530,5,8,0,0,1529,1525,1,0,0,0,1529,1530,
	1,0,0,0,1530,1532,1,0,0,0,1531,1502,1,0,0,0,1531,1532,1,0,0,0,1532,1536,
	1,0,0,0,1533,1535,5,5,0,0,1534,1533,1,0,0,0,1535,1538,1,0,0,0,1536,1534,
	1,0,0,0,1536,1537,1,0,0,0,1537,1539,1,0,0,0,1538,1536,1,0,0,0,1539,1540,
	5,10,0,0,1540,85,1,0,0,0,1541,1543,3,308,154,0,1542,1541,1,0,0,0,1542,1543,
	1,0,0,0,1543,1544,1,0,0,0,1544,1559,3,88,44,0,1545,1547,5,5,0,0,1546,1545,
	1,0,0,0,1547,1550,1,0,0,0,1548,1546,1,0,0,0,1548,1549,1,0,0,0,1549,1551,
	1,0,0,0,1550,1548,1,0,0,0,1551,1555,5,28,0,0,1552,1554,5,5,0,0,1553,1552,
	1,0,0,0,1554,1557,1,0,0,0,1555,1553,1,0,0,0,1555,1556,1,0,0,0,1556,1558,
	1,0,0,0,1557,1555,1,0,0,0,1558,1560,3,158,79,0,1559,1548,1,0,0,0,1559,1560,
	1,0,0,0,1560,87,1,0,0,0,1561,1565,3,350,175,0,1562,1564,5,5,0,0,1563,1562,
	1,0,0,0,1564,1567,1,0,0,0,1565,1563,1,0,0,0,1565,1566,1,0,0,0,1566,1576,
	1,0,0,0,1567,1565,1,0,0,0,1568,1572,5,26,0,0,1569,1571,5,5,0,0,1570,1569,
	1,0,0,0,1571,1574,1,0,0,0,1572,1570,1,0,0,0,1572,1573,1,0,0,0,1573,1575,
	1,0,0,0,1574,1572,1,0,0,0,1575,1577,3,104,52,0,1576,1568,1,0,0,0,1576,1577,
	1,0,0,0,1577,89,1,0,0,0,1578,1582,3,350,175,0,1579,1581,5,5,0,0,1580,1579,
	1,0,0,0,1581,1584,1,0,0,0,1582,1580,1,0,0,0,1582,1583,1,0,0,0,1583,1585,
	1,0,0,0,1584,1582,1,0,0,0,1585,1589,5,26,0,0,1586,1588,5,5,0,0,1587,1586,
	1,0,0,0,1588,1591,1,0,0,0,1589,1587,1,0,0,0,1589,1590,1,0,0,0,1590,1592,
	1,0,0,0,1591,1589,1,0,0,0,1592,1593,3,104,52,0,1593,91,1,0,0,0,1594,1596,
	3,306,153,0,1595,1594,1,0,0,0,1595,1596,1,0,0,0,1596,1597,1,0,0,0,1597,
	1601,5,77,0,0,1598,1600,5,5,0,0,1599,1598,1,0,0,0,1600,1603,1,0,0,0,1601,
	1599,1,0,0,0,1601,1602,1,0,0,0,1602,1604,1,0,0,0,1603,1601,1,0,0,0,1604,
	1619,3,350,175,0,1605,1607,5,5,0,0,1606,1605,1,0,0,0,1607,1610,1,0,0,0,
	1608,1606,1,0,0,0,1608,1609,1,0,0,0,1609,1611,1,0,0,0,1610,1608,1,0,0,0,
	1611,1615,5,26,0,0,1612,1614,5,5,0,0,1613,1612,1,0,0,0,1614,1617,1,0,0,
	0,1615,1613,1,0,0,0,1615,1616,1,0,0,0,1616,1618,1,0,0,0,1617,1615,1,0,0,
	0,1618,1620,3,38,19,0,1619,1608,1,0,0,0,1619,1620,1,0,0,0,1620,1628,1,0,
	0,0,1621,1623,5,5,0,0,1622,1621,1,0,0,0,1623,1626,1,0,0,0,1624,1622,1,0,
	0,0,1624,1625,1,0,0,0,1625,1627,1,0,0,0,1626,1624,1,0,0,0,1627,1629,3,32,
	16,0,1628,1624,1,0,0,0,1628,1629,1,0,0,0,1629,93,1,0,0,0,1630,1632,3,306,
	153,0,1631,1630,1,0,0,0,1631,1632,1,0,0,0,1632,1633,1,0,0,0,1633,1637,5,
	81,0,0,1634,1636,5,5,0,0,1635,1634,1,0,0,0,1636,1639,1,0,0,0,1637,1635,
	1,0,0,0,1637,1638,1,0,0,0,1638,1640,1,0,0,0,1639,1637,1,0,0,0,1640,1655,
	3,64,32,0,1641,1643,5,5,0,0,1642,1641,1,0,0,0,1643,1646,1,0,0,0,1644,1642,
	1,0,0,0,1644,1645,1,0,0,0,1645,1647,1,0,0,0,1646,1644,1,0,0,0,1647,1651,
	5,26,0,0,1648,1650,5,5,0,0,1649,1648,1,0,0,0,1650,1653,1,0,0,0,1651,1649,
	1,0,0,0,1651,1652,1,0,0,0,1652,1654,1,0,0,0,1653,1651,1,0,0,0,1654,1656,
	3,96,48,0,1655,1644,1,0,0,0,1655,1656,1,0,0,0,1656,1660,1,0,0,0,1657,1659,
	5,5,0,0,1658,1657,1,0,0,0,1659,1662,1,0,0,0,1660,1658,1,0,0,0,1660,1661,
	1,0,0,0,1661,1664,1,0,0,0,1662,1660,1,0,0,0,1663,1665,3,142,71,0,1664,1663,
	1,0,0,0,1664,1665,1,0,0,0,1665,95,1,0,0,0,1666,1670,7,2,0,0,1667,1669,5,
	5,0,0,1668,1667,1,0,0,0,1669,1672,1,0,0,0,1670,1668,1,0,0,0,1670,1671,1,
	0,0,0,1671,1673,1,0,0,0,1672,1670,1,0,0,0,1673,1674,3,214,107,0,1674,97,
	1,0,0,0,1675,1679,5,13,0,0,1676,1678,5,5,0,0,1677,1676,1,0,0,0,1678,1681,
	1,0,0,0,1679,1677,1,0,0,0,1679,1680,1,0,0,0,1680,1683,1,0,0,0,1681,1679,
	1,0,0,0,1682,1684,3,100,50,0,1683,1682,1,0,0,0,1683,1684,1,0,0,0,1684,1699,
	1,0,0,0,1685,1687,5,5,0,0,1686,1685,1,0,0,0,1687,1690,1,0,0,0,1688,1686,
	1,0,0,0,1688,1689,1,0,0,0,1689,1691,1,0,0,0,1690,1688,1,0,0,0,1691,1695,
	5,27,0,0,1692,1694,5,5,0,0,1693,1692,1,0,0,0,1694,1697,1,0,0,0,1695,1693,
	1,0,0,0,1695,1696,1,0,0,0,1696,1698,1,0,0,0,1697,1695,1,0,0,0,1698,1700,
	3,56,28,0,1699,1688,1,0,0,0,1699,1700,1,0,0,0,1700,1704,1,0,0,0,1701,1703,
	5,5,0,0,1702,1701,1,0,0,0,1703,1706,1,0,0,0,1704,1702,1,0,0,0,1704,1705,
	1,0,0,0,1705,1707,1,0,0,0,1706,1704,1,0,0,0,1707,1708,5,14,0,0,1708,99,
	1,0,0,0,1709,1726,3,102,51,0,1710,1712,5,5,0,0,1711,1710,1,0,0,0,1712,1715,
	1,0,0,0,1713,1711,1,0,0,0,1713,1714,1,0,0,0,1714,1716,1,0,0,0,1715,1713,
	1,0,0,0,1716,1720,5,8,0,0,1717,1719,5,5,0,0,1718,1717,1,0,0,0,1719,1722,
	1,0,0,0,1720,1718,1,0,0,0,1720,1721,1,0,0,0,1721,1723,1,0,0,0,1722,1720,
	1,0,0,0,1723,1725,3,102,51,0,1724,1713,1,0,0,0,1725,1728,1,0,0,0,1726,1724,
	1,0,0,0,1726,1727,1,0,0,0,1727,1732,1,0,0,0,1728,1726,1,0,0,0,1729,1731,
	5,5,0,0,1730,1729,1,0,0,0,1731,1734,1,0,0,0,1732,1730,1,0,0,0,1732,1733,
	1,0,0,0,1733,1736,1,0,0,0,1734,1732,1,0,0,0,1735,1737,5,8,0,0,1736,1735,
	1,0,0,0,1736,1737,1,0,0,0,1737,101,1,0,0,0,1738,1742,3,306,153,0,1739,1741,
	5,5,0,0,1740,1739,1,0,0,0,1741,1744,1,0,0,0,1742,1740,1,0,0,0,1742,1743,
	1,0,0,0,1743,1746,1,0,0,0,1744,1742,1,0,0,0,1745,1738,1,0,0,0,1745,1746,
	1,0,0,0,1746,1747,1,0,0,0,1747,1755,3,350,175,0,1748,1750,5,5,0,0,1749,
	1748,1,0,0,0,1750,1753,1,0,0,0,1751,1749,1,0,0,0,1751,1752,1,0,0,0,1752,
	1754,1,0,0,0,1753,1751,1,0,0,0,1754,1756,3,214,107,0,1755,1751,1,0,0,0,
	1755,1756,1,0,0,0,1756,1764,1,0,0,0,1757,1759,5,5,0,0,1758,1757,1,0,0,0,
	1759,1762,1,0,0,0,1760,1758,1,0,0,0,1760,1761,1,0,0,0,1761,1763,1,0,0,0,
	1762,1760,1,0,0,0,1763,1765,3,32,16,0,1764,1760,1,0,0,0,1764,1765,1,0,0,
	0,1765,103,1,0,0,0,1766,1768,3,312,156,0,1767,1766,1,0,0,0,1767,1768,1,
	0,0,0,1768,1774,1,0,0,0,1769,1775,3,122,61,0,1770,1775,3,126,63,0,1771,
	1775,3,108,54,0,1772,1775,3,106,53,0,1773,1775,3,132,66,0,1774,1769,1,0,
	0,0,1774,1770,1,0,0,0,1774,1771,1,0,0,0,1774,1772,1,0,0,0,1774,1773,1,0,
	0,0,1775,105,1,0,0,0,1776,1780,3,112,56,0,1777,1780,5,108,0,0,1778,1780,
	5,174,0,0,1779,1776,1,0,0,0,1779,1777,1,0,0,0,1779,1778,1,0,0,0,1780,107,
	1,0,0,0,1781,1784,3,106,53,0,1782,1784,3,126,63,0,1783,1781,1,0,0,0,1783,
	1782,1,0,0,0,1784,1788,1,0,0,0,1785,1787,5,5,0,0,1786,1785,1,0,0,0,1787,
	1790,1,0,0,0,1788,1786,1,0,0,0,1788,1789,1,0,0,0,1789,1792,1,0,0,0,1790,
	1788,1,0,0,0,1791,1793,3,110,55,0,1792,1791,1,0,0,0,1793,1794,1,0,0,0,1794,
	1792,1,0,0,0,1794,1795,1,0,0,0,1795,109,1,0,0,0,1796,1797,7,3,0,0,1797,
	111,1,0,0,0,1798,1815,3,114,57,0,1799,1801,5,5,0,0,1800,1799,1,0,0,0,1801,
	1804,1,0,0,0,1802,1800,1,0,0,0,1802,1803,1,0,0,0,1803,1805,1,0,0,0,1804,
	1802,1,0,0,0,1805,1809,5,7,0,0,1806,1808,5,5,0,0,1807,1806,1,0,0,0,1808,
	1811,1,0,0,0,1809,1807,1,0,0,0,1809,1810,1,0,0,0,1810,1812,1,0,0,0,1811,
	1809,1,0,0,0,1812,1814,3,114,57,0,1813,1802,1,0,0,0,1814,1817,1,0,0,0,1815,
	1813,1,0,0,0,1815,1816,1,0,0,0,1816,113,1,0,0,0,1817,1815,1,0,0,0,1818,
	1826,3,350,175,0,1819,1821,5,5,0,0,1820,1819,1,0,0,0,1821,1824,1,0,0,0,
	1822,1820,1,0,0,0,1822,1823,1,0,0,0,1823,1825,1,0,0,0,1824,1822,1,0,0,0,
	1825,1827,3,212,106,0,1826,1822,1,0,0,0,1826,1827,1,0,0,0,1827,115,1,0,
	0,0,1828,1830,3,118,59,0,1829,1828,1,0,0,0,1829,1830,1,0,0,0,1830,1831,
	1,0,0,0,1831,1834,3,104,52,0,1832,1834,5,15,0,0,1833,1829,1,0,0,0,1833,
	1832,1,0,0,0,1834,117,1,0,0,0,1835,1837,3,120,60,0,1836,1835,1,0,0,0,1837,
	1838,1,0,0,0,1838,1836,1,0,0,0,1838,1839,1,0,0,0,1839,119,1,0,0,0,1840,
	1844,3,322,161,0,1841,1843,5,5,0,0,1842,1841,1,0,0,0,1843,1846,1,0,0,0,
	1844,1842,1,0,0,0,1844,1845,1,0,0,0,1845,1849,1,0,0,0,1846,1844,1,0,0,0,
	1847,1849,3,340,170,0,1848,1840,1,0,0,0,1848,1847,1,0,0,0,1849,121,1,0,
	0,0,1850,1854,3,128,64,0,1851,1853,5,5,0,0,1852,1851,1,0,0,0,1853,1856,
	1,0,0,0,1854,1852,1,0,0,0,1854,1855,1,0,0,0,1855,1857,1,0,0,0,1856,1854,
	1,0,0,0,1857,1861,5,7,0,0,1858,1860,5,5,0,0,1859,1858,1,0,0,0,1860,1863,
	1,0,0,0,1861,1859,1,0,0,0,1861,1862,1,0,0,0,1862,1865,1,0,0,0,1863,1861,
	1,0,0,0,1864,1850,1,0,0,0,1864,1865,1,0,0,0,1865,1866,1,0,0,0,1866,1870,
	3,124,62,0,1867,1869,5,5,0,0,1868,1867,1,0,0,0,1869,1872,1,0,0,0,1870,1868,
	1,0,0,0,1870,1871,1,0,0,0,1871,1873,1,0,0,0,1872,1870,1,0,0,0,1873,1877,
	5,34,0,0,1874,1876,5,5,0,0,1875,1874,1,0,0,0,1876,1879,1,0,0,0,1877,1875,
	1,0,0,0,1877,1878,1,0,0,0,1878,1880,1,0,0,0,1879,1877,1,0,0,0,1880,1881,
	3,104,52,0,1881,123,1,0,0,0,1882,1886,5,9,0,0,1883,1885,5,5,0,0,1884,1883,
	1,0,0,0,1885,1888,1,0,0,0,1886,1884,1,0,0,0,1886,1887,1,0,0,0,1887,1891,
	1,0,0,0,1888,1886,1,0,0,0,1889,1892,3,90,45,0,1890,1892,3,104,52,0,1891,
	1889,1,0,0,0,1891,1890,1,0,0,0,1891,1892,1,0,0,0,1892,1912,1,0,0,0,1893,
	1895,5,5,0,0,1894,1893,1,0,0,0,1895,1898,1,0,0,0,1896,1894,1,0,0,0,1896,
	1897,1,0,0,0,1897,1899,1,0,0,0,1898,1896,1,0,0,0,1899,1903,5,8,0,0,1900,
	1902,5,5,0,0,1901,1900,1,0,0,0,1902,1905,1,0,0,0,1903,1901,1,0,0,0,1903,
	1904,1,0,0,0,1904,1908,1,0,0,0,1905,1903,1,0,0,0,1906,1909,3,90,45,0,1907,
	1909,3,104,52,0,1908,1906,1,0,0,0,1908,1907,1,0,0,0,1909,1911,1,0,0,0,1910,
	1896,1,0,0,0,1911,1914,1,0,0,0,1912,1910,1,0,0,0,1912,1913,1,0,0,0,1913,
	1922,1,0,0,0,1914,1912,1,0,0,0,1915,1917,5,5,0,0,1916,1915,1,0,0,0,1917,
	1920,1,0,0,0,1918,1916,1,0,0,0,1918,1919,1,0,0,0,1919,1921,1,0,0,0,1920,
	1918,1,0,0,0,1921,1923,5,8,0,0,1922,1918,1,0,0,0,1922,1923,1,0,0,0,1923,
	1927,1,0,0,0,1924,1926,5,5,0,0,1925,1924,1,0,0,0,1926,1929,1,0,0,0,1927,
	1925,1,0,0,0,1927,1928,1,0,0,0,1928,1930,1,0,0,0,1929,1927,1,0,0,0,1930,
	1931,5,10,0,0,1931,125,1,0,0,0,1932,1936,5,9,0,0,1933,1935,5,5,0,0,1934,
	1933,1,0,0,0,1935,1938,1,0,0,0,1936,1934,1,0,0,0,1936,1937,1,0,0,0,1937,
	1939,1,0,0,0,1938,1936,1,0,0,0,1939,1943,3,104,52,0,1940,1942,5,5,0,0,1941,
	1940,1,0,0,0,1942,1945,1,0,0,0,1943,1941,1,0,0,0,1943,1944,1,0,0,0,1944,
	1946,1,0,0,0,1945,1943,1,0,0,0,1946,1947,5,10,0,0,1947,127,1,0,0,0,1948,
	1950,3,312,156,0,1949,1948,1,0,0,0,1949,1950,1,0,0,0,1950,1954,1,0,0,0,
	1951,1955,3,126,63,0,1952,1955,3,108,54,0,1953,1955,3,106,53,0,1954,1951,
	1,0,0,0,1954,1952,1,0,0,0,1954,1953,1,0,0,0,1955,129,1,0,0,0,1956,1960,
	5,9,0,0,1957,1959,5,5,0,0,1958,1957,1,0,0,0,1959,1962,1,0,0,0,1960,1958,
	1,0,0,0,1960,1961,1,0,0,0,1961,1965,1,0,0,0,1962,1960,1,0,0,0,1963,1966,
	3,112,56,0,1964,1966,3,130,65,0,1965,1963,1,0,0,0,1965,1964,1,0,0,0,1966,
	1970,1,0,0,0,1967,1969,5,5,0,0,1968,1967,1,0,0,0,1969,1972,1,0,0,0,1970,
	1968,1,0,0,0,1970,1971,1,0,0,0,1971,1973,1,0,0,0,1972,1970,1,0,0,0,1973,
	1974,5,10,0,0,1974,131,1,0,0,0,1975,1977,3,312,156,0,1976,1975,1,0,0,0,
	1976,1977,1,0,0,0,1977,1980,1,0,0,0,1978,1981,3,112,56,0,1979,1981,3,130,
	65,0,1980,1978,1,0,0,0,1980,1979,1,0,0,0,1981,1985,1,0,0,0,1982,1984,5,
	5,0,0,1983,1982,1,0,0,0,1984,1987,1,0,0,0,1985,1983,1,0,0,0,1985,1986,1,
	0,0,0,1986,1988,1,0,0,0,1987,1985,1,0,0,0,1988,1992,5,57,0,0,1989,1991,
	5,5,0,0,1990,1989,1,0,0,0,1991,1994,1,0,0,0,1992,1990,1,0,0,0,1992,1993,
	1,0,0,0,1993,1996,1,0,0,0,1994,1992,1,0,0,0,1995,1997,3,312,156,0,1996,
	1995,1,0,0,0,1996,1997,1,0,0,0,1997,2000,1,0,0,0,1998,2001,3,112,56,0,1999,
	2001,3,130,65,0,2000,1998,1,0,0,0,2000,1999,1,0,0,0,2001,133,1,0,0,0,2002,
	2008,3,136,68,0,2003,2004,3,156,78,0,2004,2005,3,136,68,0,2005,2007,1,0,
	0,0,2006,2003,1,0,0,0,2007,2010,1,0,0,0,2008,2006,1,0,0,0,2008,2009,1,0,
	0,0,2009,2012,1,0,0,0,2010,2008,1,0,0,0,2011,2002,1,0,0,0,2011,2012,1,0,
	0,0,2012,2014,1,0,0,0,2013,2015,3,156,78,0,2014,2013,1,0,0,0,2014,2015,
	1,0,0,0,2015,135,1,0,0,0,2016,2019,3,138,69,0,2017,2019,3,340,170,0,2018,
	2016,1,0,0,0,2018,2017,1,0,0,0,2019,2022,1,0,0,0,2020,2018,1,0,0,0,2020,
	2021,1,0,0,0,2021,2027,1,0,0,0,2022,2020,1,0,0,0,2023,2028,3,26,13,0,2024,
	2028,3,152,76,0,2025,2028,3,144,72,0,2026,2028,3,158,79,0,2027,2023,1,0,
	0,0,2027,2024,1,0,0,0,2027,2025,1,0,0,0,2027,2026,1,0,0,0,2028,137,1,0,
	0,0,2029,2030,3,350,175,0,2030,2034,7,4,0,0,2031,2033,5,5,0,0,2032,2031,
	1,0,0,0,2033,2036,1,0,0,0,2034,2032,1,0,0,0,2034,2035,1,0,0,0,2035,139,
	1,0,0,0,2036,2034,1,0,0,0,2037,2040,3,142,71,0,2038,2040,3,136,68,0,2039,
	2037,1,0,0,0,2039,2038,1,0,0,0,2040,141,1,0,0,0,2041,2045,5,13,0,0,2042,
	2044,5,5,0,0,2043,2042,1,0,0,0,2044,2047,1,0,0,0,2045,2043,1,0,0,0,2045,
	2046,1,0,0,0,2046,2049,1,0,0,0,2047,2045,1,0,0,0,2048,2050,3,134,67,0,2049,
	2048,1,0,0,0,2049,2050,1,0,0,0,2050,2054,1,0,0,0,2051,2053,5,5,0,0,2052,
	2051,1,0,0,0,2053,2056,1,0,0,0,2054,2052,1,0,0,0,2054,2055,1,0,0,0,2055,
	2057,1,0,0,0,2056,2054,1,0,0,0,2057,2061,5,14,0,0,2058,2060,5,5,0,0,2059,
	2058,1,0,0,0,2060,2063,1,0,0,0,2061,2059,1,0,0,0,2061,2062,1,0,0,0,2062,
	143,1,0,0,0,2063,2061,1,0,0,0,2064,2068,3,146,73,0,2065,2068,3,148,74,0,
	2066,2068,3,150,75,0,2067,2064,1,0,0,0,2067,2065,1,0,0,0,2067,2066,1,0,
	0,0,2068,145,1,0,0,0,2069,2073,5,95,0,0,2070,2072,5,5,0,0,2071,2070,1,0,
	0,0,2072,2075,1,0,0,0,2073,2071,1,0,0,0,2073,2074,1,0,0,0,2074,2076,1,0,
	0,0,2075,2073,1,0,0,0,2076,2080,5,9,0,0,2077,2079,3,340,170,0,2078,2077,
	1,0,0,0,2079,2082,1,0,0,0,2080,2078,1,0,0,0,2080,2081,1,0,0,0,2081,2085,
	1,0,0,0,2082,2080,1,0,0,0,2083,2086,3,72,36,0,2084,2086,3,74,37,0,2085,
	2083,1,0,0,0,2085,2084,1,0,0,0,2086,2087,1,0,0,0,2087,2088,5,104,0,0,2088,
	2089,3,158,79,0,2089,2093,5,10,0,0,2090,2092,5,5,0,0,2091,2090,1,0,0,0,
	2092,2095,1,0,0,0,2093,2091,1,0,0,0,2093,2094,1,0,0,0,2094,2097,1,0,0,0,
	2095,2093,1,0,0,0,2096,2098,3,140,70,0,2097,2096,1,0,0,0,2097,2098,1,0,
	0,0,2098,2102,1,0,0,0,2099,2101,5,5,0,0,2100,2099,1,0,0,0,2101,2104,1,0,
	0,0,2102,2100,1,0,0,0,2102,2103,1,0,0,0,2103,147,1,0,0,0,2104,2102,1,0,
	0,0,2105,2109,5,97,0,0,2106,2108,5,5,0,0,2107,2106,1,0,0,0,2108,2111,1,
	0,0,0,2109,2107,1,0,0,0,2109,2110,1,0,0,0,2110,2112,1,0,0,0,2111,2109,1,
	0,0,0,2112,2113,5,9,0,0,2113,2114,3,158,79,0,2114,2118,5,10,0,0,2115,2117,
	5,5,0,0,2116,2115,1,0,0,0,2117,2120,1,0,0,0,2118,2116,1,0,0,0,2118,2119,
	1,0,0,0,2119,2123,1,0,0,0,2120,2118,1,0,0,0,2121,2124,3,140,70,0,2122,2124,
	5,27,0,0,2123,2121,1,0,0,0,2123,2122,1,0,0,0,2124,2128,1,0,0,0,2125,2127,
	5,5,0,0,2126,2125,1,0,0,0,2127,2130,1,0,0,0,2128,2126,1,0,0,0,2128,2129,
	1,0,0,0,2129,149,1,0,0,0,2130,2128,1,0,0,0,2131,2135,5,96,0,0,2132,2134,
	5,5,0,0,2133,2132,1,0,0,0,2134,2137,1,0,0,0,2135,2133,1,0,0,0,2135,2136,
	1,0,0,0,2136,2139,1,0,0,0,2137,2135,1,0,0,0,2138,2140,3,140,70,0,2139,2138,
	1,0,0,0,2139,2140,1,0,0,0,2140,2144,1,0,0,0,2141,2143,5,5,0,0,2142,2141,
	1,0,0,0,2143,2146,1,0,0,0,2144,2142,1,0,0,0,2144,2145,1,0,0,0,2145,2147,
	1,0,0,0,2146,2144,1,0,0,0,2147,2151,5,97,0,0,2148,2150,5,5,0,0,2149,2148,
	1,0,0,0,2150,2153,1,0,0,0,2151,2149,1,0,0,0,2151,2152,1,0,0,0,2152,2154,
	1,0,0,0,2153,2151,1,0,0,0,2154,2155,5,9,0,0,2155,2156,3,158,79,0,2156,2160,
	5,10,0,0,2157,2159,5,5,0,0,2158,2157,1,0,0,0,2159,2162,1,0,0,0,2160,2158,
	1,0,0,0,2160,2161,1,0,0,0,2161,151,1,0,0,0,2162,2160,1,0,0,0,2163,2164,
	3,194,97,0,2164,2165,5,28,0,0,2165,2170,1,0,0,0,2166,2167,3,198,99,0,2167,
	2168,3,280,140,0,2168,2170,1,0,0,0,2169,2163,1,0,0,0,2169,2166,1,0,0,0,
	2170,2174,1,0,0,0,2171,2173,5,5,0,0,2172,2171,1,0,0,0,2173,2176,1,0,0,0,
	2174,2172,1,0,0,0,2174,2175,1,0,0,0,2175,2177,1,0,0,0,2176,2174,1,0,0,0,
	2177,2178,3,158,79,0,2178,153,1,0,0,0,2179,2183,7,5,0,0,2180,2182,5,5,0,
	0,2181,2180,1,0,0,0,2182,2185,1,0,0,0,2183,2181,1,0,0,0,2183,2184,1,0,0,
	0,2184,155,1,0,0,0,2185,2183,1,0,0,0,2186,2188,7,5,0,0,2187,2186,1,0,0,
	0,2188,2189,1,0,0,0,2189,2187,1,0,0,0,2189,2190,1,0,0,0,2190,157,1,0,0,
	0,2191,2192,3,160,80,0,2192,159,1,0,0,0,2193,2210,3,162,81,0,2194,2196,
	5,5,0,0,2195,2194,1,0,0,0,2196,2199,1,0,0,0,2197,2195,1,0,0,0,2197,2198,
	1,0,0,0,2198,2200,1,0,0,0,2199,2197,1,0,0,0,2200,2204,5,23,0,0,2201,2203,
	5,5,0,0,2202,2201,1,0,0,0,2203,2206,1,0,0,0,2204,2202,1,0,0,0,2204,2205,
	1,0,0,0,2205,2207,1,0,0,0,2206,2204,1,0,0,0,2207,2209,3,162,81,0,2208,2197,
	1,0,0,0,2209,2212,1,0,0,0,2210,2208,1,0,0,0,2210,2211,1,0,0,0,2211,161,
	1,0,0,0,2212,2210,1,0,0,0,2213,2230,3,164,82,0,2214,2216,5,5,0,0,2215,2214,
	1,0,0,0,2216,2219,1,0,0,0,2217,2215,1,0,0,0,2217,2218,1,0,0,0,2218,2220,
	1,0,0,0,2219,2217,1,0,0,0,2220,2224,5,22,0,0,2221,2223,5,5,0,0,2222,2221,
	1,0,0,0,2223,2226,1,0,0,0,2224,2222,1,0,0,0,2224,2225,1,0,0,0,2225,2227,
	1,0,0,0,2226,2224,1,0,0,0,2227,2229,3,164,82,0,2228,2217,1,0,0,0,2229,2232,
	1,0,0,0,2230,2228,1,0,0,0,2230,2231,1,0,0,0,2231,163,1,0,0,0,2232,2230,
	1,0,0,0,2233,2245,3,166,83,0,2234,2238,3,282,141,0,2235,2237,5,5,0,0,2236,
	2235,1,0,0,0,2237,2240,1,0,0,0,2238,2236,1,0,0,0,2238,2239,1,0,0,0,2239,
	2241,1,0,0,0,2240,2238,1,0,0,0,2241,2242,3,166,83,0,2242,2244,1,0,0,0,2243,
	2234,1,0,0,0,2244,2247,1,0,0,0,2245,2243,1,0,0,0,2245,2246,1,0,0,0,2246,
	165,1,0,0,0,2247,2245,1,0,0,0,2248,2260,3,168,84,0,2249,2253,3,284,142,
	0,2250,2252,5,5,0,0,2251,2250,1,0,0,0,2252,2255,1,0,0,0,2253,2251,1,0,0,
	0,2253,2254,1,0,0,0,2254,2256,1,0,0,0,2255,2253,1,0,0,0,2256,2257,3,168,
	84,0,2257,2259,1,0,0,0,2258,2249,1,0,0,0,2259,2262,1,0,0,0,2260,2258,1,
	0,0,0,2260,2261,1,0,0,0,2261,167,1,0,0,0,2262,2260,1,0,0,0,2263,2267,3,
	170,85,0,2264,2266,3,208,104,0,2265,2264,1,0,0,0,2266,2269,1,0,0,0,2267,
	2265,1,0,0,0,2267,2268,1,0,0,0,2268,169,1,0,0,0,2269,2267,1,0,0,0,2270,
	2291,3,172,86,0,2271,2275,3,286,143,0,2272,2274,5,5,0,0,2273,2272,1,0,0,
	0,2274,2277,1,0,0,0,2275,2273,1,0,0,0,2275,2276,1,0,0,0,2276,2278,1,0,0,
	0,2277,2275,1,0,0,0,2278,2279,3,172,86,0,2279,2290,1,0,0,0,2280,2284,3,
	288,144,0,2281,2283,5,5,0,0,2282,2281,1,0,0,0,2283,2286,1,0,0,0,2284,2282,
	1,0,0,0,2284,2285,1,0,0,0,2285,2287,1,0,0,0,2286,2284,1,0,0,0,2287,2288,
	3,104,52,0,2288,2290,1,0,0,0,2289,2271,1,0,0,0,2289,2280,1,0,0,0,2290,2293,
	1,0,0,0,2291,2289,1,0,0,0,2291,2292,1,0,0,0,2292,171,1,0,0,0,2293,2291,
	1,0,0,0,2294,2312,3,176,88,0,2295,2297,5,5,0,0,2296,2295,1,0,0,0,2297,2300,
	1,0,0,0,2298,2296,1,0,0,0,2298,2299,1,0,0,0,2299,2301,1,0,0,0,2300,2298,
	1,0,0,0,2301,2305,3,174,87,0,2302,2304,5,5,0,0,2303,2302,1,0,0,0,2304,2307,
	1,0,0,0,2305,2303,1,0,0,0,2305,2306,1,0,0,0,2306,2308,1,0,0,0,2307,2305,
	1,0,0,0,2308,2309,3,176,88,0,2309,2311,1,0,0,0,2310,2298,1,0,0,0,2311,2314,
	1,0,0,0,2312,2310,1,0,0,0,2312,2313,1,0,0,0,2313,173,1,0,0,0,2314,2312,
	1,0,0,0,2315,2316,5,46,0,0,2316,2317,5,26,0,0,2317,175,1,0,0,0,2318,2330,
	3,178,89,0,2319,2323,3,350,175,0,2320,2322,5,5,0,0,2321,2320,1,0,0,0,2322,
	2325,1,0,0,0,2323,2321,1,0,0,0,2323,2324,1,0,0,0,2324,2326,1,0,0,0,2325,
	2323,1,0,0,0,2326,2327,3,178,89,0,2327,2329,1,0,0,0,2328,2319,1,0,0,0,2329,
	2332,1,0,0,0,2330,2328,1,0,0,0,2330,2331,1,0,0,0,2331,177,1,0,0,0,2332,
	2330,1,0,0,0,2333,2344,3,180,90,0,2334,2338,7,6,0,0,2335,2337,5,5,0,0,2336,
	2335,1,0,0,0,2337,2340,1,0,0,0,2338,2336,1,0,0,0,2338,2339,1,0,0,0,2339,
	2341,1,0,0,0,2340,2338,1,0,0,0,2341,2343,3,180,90,0,2342,2334,1,0,0,0,2343,
	2346,1,0,0,0,2344,2342,1,0,0,0,2344,2345,1,0,0,0,2345,179,1,0,0,0,2346,
	2344,1,0,0,0,2347,2359,3,182,91,0,2348,2352,3,290,145,0,2349,2351,5,5,0,
	0,2350,2349,1,0,0,0,2351,2354,1,0,0,0,2352,2350,1,0,0,0,2352,2353,1,0,0,
	0,2353,2355,1,0,0,0,2354,2352,1,0,0,0,2355,2356,3,182,91,0,2356,2358,1,
	0,0,0,2357,2348,1,0,0,0,2358,2361,1,0,0,0,2359,2357,1,0,0,0,2359,2360,1,
	0,0,0,2360,181,1,0,0,0,2361,2359,1,0,0,0,2362,2374,3,184,92,0,2363,2367,
	3,292,146,0,2364,2366,5,5,0,0,2365,2364,1,0,0,0,2366,2369,1,0,0,0,2367,
	2365,1,0,0,0,2367,2368,1,0,0,0,2368,2370,1,0,0,0,2369,2367,1,0,0,0,2370,
	2371,3,184,92,0,2371,2373,1,0,0,0,2372,2363,1,0,0,0,2373,2376,1,0,0,0,2374,
	2372,1,0,0,0,2374,2375,1,0,0,0,2375,183,1,0,0,0,2376,2374,1,0,0,0,2377,
	2395,3,186,93,0,2378,2380,5,5,0,0,2379,2378,1,0,0,0,2380,2383,1,0,0,0,2381,
	2379,1,0,0,0,2381,2382,1,0,0,0,2382,2384,1,0,0,0,2383,2381,1,0,0,0,2384,
	2388,3,294,147,0,2385,2387,5,5,0,0,2386,2385,1,0,0,0,2387,2390,1,0,0,0,
	2388,2386,1,0,0,0,2388,2389,1,0,0,0,2389,2391,1,0,0,0,2390,2388,1,0,0,0,
	2391,2392,3,104,52,0,2392,2394,1,0,0,0,2393,2381,1,0,0,0,2394,2397,1,0,
	0,0,2395,2393,1,0,0,0,2395,2396,1,0,0,0,2396,185,1,0,0,0,2397,2395,1,0,
	0,0,2398,2400,3,188,94,0,2399,2398,1,0,0,0,2400,2403,1,0,0,0,2401,2399,
	1,0,0,0,2401,2402,1,0,0,0,2402,2404,1,0,0,0,2403,2401,1,0,0,0,2404,2405,
	3,190,95,0,2405,187,1,0,0,0,2406,2416,3,340,170,0,2407,2416,3,138,69,0,
	2408,2412,3,296,148,0,2409,2411,5,5,0,0,2410,2409,1,0,0,0,2411,2414,1,0,
	0,0,2412,2410,1,0,0,0,2412,2413,1,0,0,0,2413,2416,1,0,0,0,2414,2412,1,0,
	0,0,2415,2406,1,0,0,0,2415,2407,1,0,0,0,2415,2408,1,0,0,0,2416,189,1,0,
	0,0,2417,2421,3,218,109,0,2418,2420,3,192,96,0,2419,2418,1,0,0,0,2420,2423,
	1,0,0,0,2421,2419,1,0,0,0,2421,2422,1,0,0,0,2422,191,1,0,0,0,2423,2421,
	1,0,0,0,2424,2430,3,298,149,0,2425,2430,3,212,106,0,2426,2430,3,208,104,
	0,2427,2430,3,204,102,0,2428,2430,3,206,103,0,2429,2424,1,0,0,0,2429,2425,
	1,0,0,0,2429,2426,1,0,0,0,2429,2427,1,0,0,0,2429,2428,1,0,0,0,2430,193,
	1,0,0,0,2431,2432,3,190,95,0,2432,2433,3,202,101,0,2433,2437,1,0,0,0,2434,
	2437,3,350,175,0,2435,2437,3,196,98,0,2436,2431,1,0,0,0,2436,2434,1,0,0,
	0,2436,2435,1,0,0,0,2437,195,1,0,0,0,2438,2442,5,9,0,0,2439,2441,5,5,0,
	0,2440,2439,1,0,0,0,2441,2444,1,0,0,0,2442,2440,1,0,0,0,2442,2443,1,0,0,
	0,2443,2445,1,0,0,0,2444,2442,1,0,0,0,2445,2449,3,194,97,0,2446,2448,5,
	5,0,0,2447,2446,1,0,0,0,2448,2451,1,0,0,0,2449,2447,1,0,0,0,2449,2450,1,
	0,0,0,2450,2452,1,0,0,0,2451,2449,1,0,0,0,2452,2453,5,10,0,0,2453,197,1,
	0,0,0,2454,2457,3,186,93,0,2455,2457,3,200,100,0,2456,2454,1,0,0,0,2456,
	2455,1,0,0,0,2457,199,1,0,0,0,2458,2462,5,9,0,0,2459,2461,5,5,0,0,2460,
	2459,1,0,0,0,2461,2464,1,0,0,0,2462,2460,1,0,0,0,2462,2463,1,0,0,0,2463,
	2465,1,0,0,0,2464,2462,1,0,0,0,2465,2469,3,198,99,0,2466,2468,5,5,0,0,2467,
	2466,1,0,0,0,2468,2471,1,0,0,0,2469,2467,1,0,0,0,2469,2470,1,0,0,0,2470,
	2472,1,0,0,0,2471,2469,1,0,0,0,2472,2473,5,10,0,0,2473,201,1,0,0,0,2474,
	2478,3,212,106,0,2475,2478,3,204,102,0,2476,2478,3,206,103,0,2477,2474,
	1,0,0,0,2477,2475,1,0,0,0,2477,2476,1,0,0,0,2478,203,1,0,0,0,2479,2483,
	5,11,0,0,2480,2482,5,5,0,0,2481,2480,1,0,0,0,2482,2485,1,0,0,0,2483,2481,
	1,0,0,0,2483,2484,1,0,0,0,2484,2486,1,0,0,0,2485,2483,1,0,0,0,2486,2503,
	3,158,79,0,2487,2489,5,5,0,0,2488,2487,1,0,0,0,2489,2492,1,0,0,0,2490,2488,
	1,0,0,0,2490,2491,1,0,0,0,2491,2493,1,0,0,0,2492,2490,1,0,0,0,2493,2497,
	5,8,0,0,2494,2496,5,5,0,0,2495,2494,1,0,0,0,2496,2499,1,0,0,0,2497,2495,
	1,0,0,0,2497,2498,1,0,0,0,2498,2500,1,0,0,0,2499,2497,1,0,0,0,2500,2502,
	3,158,79,0,2501,2490,1,0,0,0,2502,2505,1,0,0,0,2503,2501,1,0,0,0,2503,2504,
	1,0,0,0,2504,2513,1,0,0,0,2505,2503,1,0,0,0,2506,2508,5,5,0,0,2507,2506,
	1,0,0,0,2508,2511,1,0,0,0,2509,2507,1,0,0,0,2509,2510,1,0,0,0,2510,2512,
	1,0,0,0,2511,2509,1,0,0,0,2512,2514,5,8,0,0,2513,2509,1,0,0,0,2513,2514,
	1,0,0,0,2514,2518,1,0,0,0,2515,2517,5,5,0,0,2516,2515,1,0,0,0,2517,2520,
	1,0,0,0,2518,2516,1,0,0,0,2518,2519,1,0,0,0,2519,2521,1,0,0,0,2520,2518,
	1,0,0,0,2521,2522,5,12,0,0,2522,205,1,0,0,0,2523,2527,3,302,151,0,2524,
	2526,5,5,0,0,2525,2524,1,0,0,0,2526,2529,1,0,0,0,2527,2525,1,0,0,0,2527,
	2528,1,0,0,0,2528,2533,1,0,0,0,2529,2527,1,0,0,0,2530,2534,3,350,175,0,
	2531,2534,3,220,110,0,2532,2534,5,74,0,0,2533,2530,1,0,0,0,2533,2531,1,
	0,0,0,2533,2532,1,0,0,0,2534,207,1,0,0,0,2535,2537,3,212,106,0,2536,2535,
	1,0,0,0,2536,2537,1,0,0,0,2537,2543,1,0,0,0,2538,2540,3,214,107,0,2539,
	2538,1,0,0,0,2539,2540,1,0,0,0,2540,2541,1,0,0,0,2541,2544,3,210,105,0,
	2542,2544,3,214,107,0,2543,2539,1,0,0,0,2543,2542,1,0,0,0,2544,209,1,0,
	0,0,2545,2547,3,340,170,0,2546,2545,1,0,0,0,2547,2550,1,0,0,0,2548,2546,
	1,0,0,0,2548,2549,1,0,0,0,2549,2552,1,0,0,0,2550,2548,1,0,0,0,2551,2553,
	3,138,69,0,2552,2551,1,0,0,0,2552,2553,1,0,0,0,2553,2557,1,0,0,0,2554,2556,
	5,5,0,0,2555,2554,1,0,0,0,2556,2559,1,0,0,0,2557,2555,1,0,0,0,2557,2558,
	1,0,0,0,2558,2560,1,0,0,0,2559,2557,1,0,0,0,2560,2561,3,240,120,0,2561,
	211,1,0,0,0,2562,2566,5,47,0,0,2563,2565,5,5,0,0,2564,2563,1,0,0,0,2565,
	2568,1,0,0,0,2566,2564,1,0,0,0,2566,2567,1,0,0,0,2567,2569,1,0,0,0,2568,
	2566,1,0,0,0,2569,2586,3,116,58,0,2570,2572,5,5,0,0,2571,2570,1,0,0,0,2572,
	2575,1,0,0,0,2573,2571,1,0,0,0,2573,2574,1,0,0,0,2574,2576,1,0,0,0,2575,
	2573,1,0,0,0,2576,2580,5,8,0,0,2577,2579,5,5,0,0,2578,2577,1,0,0,0,2579,
	2582,1,0,0,0,2580,2578,1,0,0,0,2580,2581,1,0,0,0,2581,2583,1,0,0,0,2582,
	2580,1,0,0,0,2583,2585,3,116,58,0,2584,2573,1,0,0,0,2585,2588,1,0,0,0,2586,
	2584,1,0,0,0,2586,2587,1,0,0,0,2587,2596,1,0,0,0,2588,2586,1,0,0,0,2589,
	2591,5,5,0,0,2590,2589,1,0,0,0,2591,2594,1,0,0,0,2592,2590,1,0,0,0,2592,
	2593,1,0,0,0,2593,2595,1,0,0,0,2594,2592,1,0,0,0,2595,2597,5,8,0,0,2596,
	2592,1,0,0,0,2596,2597,1,0,0,0,2597,2601,1,0,0,0,2598,2600,5,5,0,0,2599,
	2598,1,0,0,0,2600,2603,1,0,0,0,2601,2599,1,0,0,0,2601,2602,1,0,0,0,2602,
	2604,1,0,0,0,2603,2601,1,0,0,0,2604,2605,5,48,0,0,2605,213,1,0,0,0,2606,
	2610,5,9,0,0,2607,2609,5,5,0,0,2608,2607,1,0,0,0,2609,2612,1,0,0,0,2610,
	2608,1,0,0,0,2610,2611,1,0,0,0,2611,2648,1,0,0,0,2612,2610,1,0,0,0,2613,
	2630,3,216,108,0,2614,2616,5,5,0,0,2615,2614,1,0,0,0,2616,2619,1,0,0,0,
	2617,2615,1,0,0,0,2617,2618,1,0,0,0,2618,2620,1,0,0,0,2619,2617,1,0,0,0,
	2620,2624,5,8,0,0,2621,2623,5,5,0,0,2622,2621,1,0,0,0,2623,2626,1,0,0,0,
	2624,2622,1,0,0,0,2624,2625,1,0,0,0,2625,2627,1,0,0,0,2626,2624,1,0,0,0,
	2627,2629,3,216,108,0,2628,2617,1,0,0,0,2629,2632,1,0,0,0,2630,2628,1,0,
	0,0,2630,2631,1,0,0,0,2631,2640,1,0,0,0,2632,2630,1,0,0,0,2633,2635,5,5,
	0,0,2634,2633,1,0,0,0,2635,2638,1,0,0,0,2636,2634,1,0,0,0,2636,2637,1,0,
	0,0,2637,2639,1,0,0,0,2638,2636,1,0,0,0,2639,2641,5,8,0,0,2640,2636,1,0,
	0,0,2640,2641,1,0,0,0,2641,2645,1,0,0,0,2642,2644,5,5,0,0,2643,2642,1,0,
	0,0,2644,2647,1,0,0,0,2645,2643,1,0,0,0,2645,2646,1,0,0,0,2646,2649,1,0,
	0,0,2647,2645,1,0,0,0,2648,2613,1,0,0,0,2648,2649,1,0,0,0,2649,2650,1,0,
	0,0,2650,2651,5,10,0,0,2651,215,1,0,0,0,2652,2654,3,340,170,0,2653,2652,
	1,0,0,0,2653,2654,1,0,0,0,2654,2658,1,0,0,0,2655,2657,5,5,0,0,2656,2655,
	1,0,0,0,2657,2660,1,0,0,0,2658,2656,1,0,0,0,2658,2659,1,0,0,0,2659,2675,
	1,0,0,0,2660,2658,1,0,0,0,2661,2665,3,350,175,0,2662,2664,5,5,0,0,2663,
	2662,1,0,0,0,2664,2667,1,0,0,0,2665,2663,1,0,0,0,2665,2666,1,0,0,0,2666,
	2668,1,0,0,0,2667,2665,1,0,0,0,2668,2672,5,28,0,0,2669,2671,5,5,0,0,2670,
	2669,1,0,0,0,2671,2674,1,0,0,0,2672,2670,1,0,0,0,2672,2673,1,0,0,0,2673,
	2676,1,0,0,0,2674,2672,1,0,0,0,2675,2661,1,0,0,0,2675,2676,1,0,0,0,2676,
	2678,1,0,0,0,2677,2679,5,15,0,0,2678,2677,1,0,0,0,2678,2679,1,0,0,0,2679,
	2683,1,0,0,0,2680,2682,5,5,0,0,2681,2680,1,0,0,0,2682,2685,1,0,0,0,2683,
	2681,1,0,0,0,2683,2684,1,0,0,0,2684,2686,1,0,0,0,2685,2683,1,0,0,0,2686,
	2687,3,158,79,0,2687,217,1,0,0,0,2688,2703,3,220,110,0,2689,2703,3,350,
	175,0,2690,2703,3,224,112,0,2691,2703,3,226,113,0,2692,2703,3,278,139,0,
	2693,2703,3,248,124,0,2694,2703,3,250,125,0,2695,2703,3,222,111,0,2696,
	2703,3,252,126,0,2697,2703,3,254,127,0,2698,2703,3,256,128,0,2699,2703,
	3,260,130,0,2700,2703,3,270,135,0,2701,2703,3,276,138,0,2702,2688,1,0,0,
	0,2702,2689,1,0,0,0,2702,2690,1,0,0,0,2702,2691,1,0,0,0,2702,2692,1,0,0,
	0,2702,2693,1,0,0,0,2702,2694,1,0,0,0,2702,2695,1,0,0,0,2702,2696,1,0,0,
	0,2702,2697,1,0,0,0,2702,2698,1,0,0,0,2702,2699,1,0,0,0,2702,2700,1,0,0,
	0,2702,2701,1,0,0,0,2703,219,1,0,0,0,2704,2708,5,9,0,0,2705,2707,5,5,0,
	0,2706,2705,1,0,0,0,2707,2710,1,0,0,0,2708,2706,1,0,0,0,2708,2709,1,0,0,
	0,2709,2711,1,0,0,0,2710,2708,1,0,0,0,2711,2715,3,158,79,0,2712,2714,5,
	5,0,0,2713,2712,1,0,0,0,2714,2717,1,0,0,0,2715,2713,1,0,0,0,2715,2716,1,
	0,0,0,2716,2718,1,0,0,0,2717,2715,1,0,0,0,2718,2719,5,10,0,0,2719,221,1,
	0,0,0,2720,2724,5,11,0,0,2721,2723,5,5,0,0,2722,2721,1,0,0,0,2723,2726,
	1,0,0,0,2724,2722,1,0,0,0,2724,2725,1,0,0,0,2725,2762,1,0,0,0,2726,2724,
	1,0,0,0,2727,2744,3,158,79,0,2728,2730,5,5,0,0,2729,2728,1,0,0,0,2730,2733,
	1,0,0,0,2731,2729,1,0,0,0,2731,2732,1,0,0,0,2732,2734,1,0,0,0,2733,2731,
	1,0,0,0,2734,2738,5,8,0,0,2735,2737,5,5,0,0,2736,2735,1,0,0,0,2737,2740,
	1,0,0,0,2738,2736,1,0,0,0,2738,2739,1,0,0,0,2739,2741,1,0,0,0,2740,2738,
	1,0,0,0,2741,2743,3,158,79,0,2742,2731,1,0,0,0,2743,2746,1,0,0,0,2744,2742,
	1,0,0,0,2744,2745,1,0,0,0,2745,2754,1,0,0,0,2746,2744,1,0,0,0,2747,2749,
	5,5,0,0,2748,2747,1,0,0,0,2749,2752,1,0,0,0,2750,2748,1,0,0,0,2750,2751,
	1,0,0,0,2751,2753,1,0,0,0,2752,2750,1,0,0,0,2753,2755,5,8,0,0,2754,2750,
	1,0,0,0,2754,2755,1,0,0,0,2755,2759,1,0,0,0,2756,2758,5,5,0,0,2757,2756,
	1,0,0,0,2758,2761,1,0,0,0,2759,2757,1,0,0,0,2759,2760,1,0,0,0,2760,2763,
	1,0,0,0,2761,2759,1,0,0,0,2762,2727,1,0,0,0,2762,2763,1,0,0,0,2763,2764,
	1,0,0,0,2764,2765,5,12,0,0,2765,223,1,0,0,0,2766,2767,7,7,0,0,2767,225,
	1,0,0,0,2768,2771,3,228,114,0,2769,2771,3,230,115,0,2770,2768,1,0,0,0,2770,
	2769,1,0,0,0,2771,227,1,0,0,0,2772,2777,5,151,0,0,2773,2776,3,232,116,0,
	2774,2776,3,234,117,0,2775,2773,1,0,0,0,2775,2774,1,0,0,0,2776,2779,1,0,
	0,0,2777,2775,1,0,0,0,2777,2778,1,0,0,0,2778,2780,1,0,0,0,2779,2777,1,0,
	0,0,2780,2781,5,160,0,0,2781,229,1,0,0,0,2782,2788,5,152,0,0,2783,2787,
	3,236,118,0,2784,2787,3,238,119,0,2785,2787,5,166,0,0,2786,2783,1,0,0,0,
	2786,2784,1,0,0,0,2786,2785,1,0,0,0,2787,2790,1,0,0,0,2788,2786,1,0,0,0,
	2788,2789,1,0,0,0,2789,2791,1,0,0,0,2790,2788,1,0,0,0,2791,2792,5,165,0,
	0,2792,231,1,0,0,0,2793,2794,7,8,0,0,2794,233,1,0,0,0,2795,2799,5,164,0,
	0,2796,2798,5,5,0,0,2797,2796,1,0,0,0,2798,2801,1,0,0,0,2799,2797,1,0,0,
	0,2799,2800,1,0,0,0,2800,2802,1,0,0,0,2801,2799,1,0,0,0,2802,2806,3,158,
	79,0,2803,2805,5,5,0,0,2804,2803,1,0,0,0,2805,2808,1,0,0,0,2806,2804,1,
	0,0,0,2806,2807,1,0,0,0,2807,2809,1,0,0,0,2808,2806,1,0,0,0,2809,2810,5,
	14,0,0,2810,235,1,0,0,0,2811,2812,7,9,0,0,2812,237,1,0,0,0,2813,2817,5,
	169,0,0,2814,2816,5,5,0,0,2815,2814,1,0,0,0,2816,2819,1,0,0,0,2817,2815,
	1,0,0,0,2817,2818,1,0,0,0,2818,2820,1,0,0,0,2819,2817,1,0,0,0,2820,2824,
	3,158,79,0,2821,2823,5,5,0,0,2822,2821,1,0,0,0,2823,2826,1,0,0,0,2824,2822,
	1,0,0,0,2824,2825,1,0,0,0,2825,2827,1,0,0,0,2826,2824,1,0,0,0,2827,2828,
	5,14,0,0,2828,239,1,0,0,0,2829,2833,5,13,0,0,2830,2832,5,5,0,0,2831,2830,
	1,0,0,0,2832,2835,1,0,0,0,2833,2831,1,0,0,0,2833,2834,1,0,0,0,2834,2852,
	1,0,0,0,2835,2833,1,0,0,0,2836,2838,3,242,121,0,2837,2836,1,0,0,0,2837,
	2838,1,0,0,0,2838,2842,1,0,0,0,2839,2841,5,5,0,0,2840,2839,1,0,0,0,2841,
	2844,1,0,0,0,2842,2840,1,0,0,0,2842,2843,1,0,0,0,2843,2845,1,0,0,0,2844,
	2842,1,0,0,0,2845,2849,5,34,0,0,2846,2848,5,5,0,0,2847,2846,1,0,0,0,2848,
	2851,1,0,0,0,2849,2847,1,0,0,0,2849,2850,1,0,0,0,2850,2853,1,0,0,0,2851,
	2849,1,0,0,0,2852,2837,1,0,0,0,2852,2853,1,0,0,0,2853,2854,1,0,0,0,2854,
	2858,3,134,67,0,2855,2857,5,5,0,0,2856,2855,1,0,0,0,2857,2860,1,0,0,0,2858,
	2856,1,0,0,0,2858,2859,1,0,0,0,2859,2861,1,0,0,0,2860,2858,1,0,0,0,2861,
	2862,5,14,0,0,2862,241,1,0,0,0,2863,2880,3,244,122,0,2864,2866,5,5,0,0,
	2865,2864,1,0,0,0,2866,2869,1,0,0,0,2867,2865,1,0,0,0,2867,2868,1,0,0,0,
	2868,2870,1,0,0,0,2869,2867,1,0,0,0,2870,2874,5,8,0,0,2871,2873,5,5,0,0,
	2872,2871,1,0,0,0,2873,2876,1,0,0,0,2874,2872,1,0,0,0,2874,2875,1,0,0,0,
	2875,2877,1,0,0,0,2876,2874,1,0,0,0,2877,2879,3,244,122,0,2878,2867,1,0,
	0,0,2879,2882,1,0,0,0,2880,2878,1,0,0,0,2880,2881,1,0,0,0,2881,2890,1,0,
	0,0,2882,2880,1,0,0,0,2883,2885,5,5,0,0,2884,2883,1,0,0,0,2885,2888,1,0,
	0,0,2886,2884,1,0,0,0,2886,2887,1,0,0,0,2887,2889,1,0,0,0,2888,2886,1,0,
	0,0,2889,2891,5,8,0,0,2890,2886,1,0,0,0,2890,2891,1,0,0,0,2891,243,1,0,
	0,0,2892,2911,3,72,36,0,2893,2908,3,74,37,0,2894,2896,5,5,0,0,2895,2894,
	1,0,0,0,2896,2899,1,0,0,0,2897,2895,1,0,0,0,2897,2898,1,0,0,0,2898,2900,
	1,0,0,0,2899,2897,1,0,0,0,2900,2904,5,26,0,0,2901,2903,5,5,0,0,2902,2901,
	1,0,0,0,2903,2906,1,0,0,0,2904,2902,1,0,0,0,2904,2905,1,0,0,0,2905,2907,
	1,0,0,0,2906,2904,1,0,0,0,2907,2909,3,104,52,0,2908,2897,1,0,0,0,2908,2909,
	1,0,0,0,2909,2911,1,0,0,0,2910,2892,1,0,0,0,2910,2893,1,0,0,0,2911,245,
	1,0,0,0,2912,2914,5,124,0,0,2913,2912,1,0,0,0,2913,2914,1,0,0,0,2914,2918,
	1,0,0,0,2915,2917,5,5,0,0,2916,2915,1,0,0,0,2917,2920,1,0,0,0,2918,2916,
	1,0,0,0,2918,2919,1,0,0,0,2919,2921,1,0,0,0,2920,2918,1,0,0,0,2921,2937,
	5,76,0,0,2922,2924,5,5,0,0,2923,2922,1,0,0,0,2924,2927,1,0,0,0,2925,2923,
	1,0,0,0,2925,2926,1,0,0,0,2926,2928,1,0,0,0,2927,2925,1,0,0,0,2928,2932,
	3,104,52,0,2929,2931,5,5,0,0,2930,2929,1,0,0,0,2931,2934,1,0,0,0,2932,2930,
	1,0,0,0,2932,2933,1,0,0,0,2933,2935,1,0,0,0,2934,2932,1,0,0,0,2935,2936,
	5,7,0,0,2936,2938,1,0,0,0,2937,2925,1,0,0,0,2937,2938,1,0,0,0,2938,2942,
	1,0,0,0,2939,2941,5,5,0,0,2940,2939,1,0,0,0,2941,2944,1,0,0,0,2942,2940,
	1,0,0,0,2942,2943,1,0,0,0,2943,2945,1,0,0,0,2944,2942,1,0,0,0,2945,2960,
	3,84,42,0,2946,2948,5,5,0,0,2947,2946,1,0,0,0,2948,2951,1,0,0,0,2949,2947,
	1,0,0,0,2949,2950,1,0,0,0,2950,2952,1,0,0,0,2951,2949,1,0,0,0,2952,2956,
	5,26,0,0,2953,2955,5,5,0,0,2954,2953,1,0,0,0,2955,2958,1,0,0,0,2956,2954,
	1,0,0,0,2956,2957,1,0,0,0,2957,2959,1,0,0,0,2958,2956,1,0,0,0,2959,2961,
	3,104,52,0,2960,2949,1,0,0,0,2960,2961,1,0,0,0,2961,2969,1,0,0,0,2962,2964,
	5,5,0,0,2963,2962,1,0,0,0,2964,2967,1,0,0,0,2965,2963,1,0,0,0,2965,2966,
	1,0,0,0,2966,2968,1,0,0,0,2967,2965,1,0,0,0,2968,2970,3,52,26,0,2969,2965,
	1,0,0,0,2969,2970,1,0,0,0,2970,2978,1,0,0,0,2971,2973,5,5,0,0,2972,2971,
	1,0,0,0,2973,2976,1,0,0,0,2974,2972,1,0,0,0,2974,2975,1,0,0,0,2975,2977,
	1,0,0,0,2976,2974,1,0,0,0,2977,2979,3,70,35,0,2978,2974,1,0,0,0,2978,2979,
	1,0,0,0,2979,247,1,0,0,0,2980,2983,3,240,120,0,2981,2983,3,246,123,0,2982,
	2980,1,0,0,0,2982,2981,1,0,0,0,2983,249,1,0,0,0,2984,2986,5,116,0,0,2985,
	2984,1,0,0,0,2985,2986,1,0,0,0,2986,2990,1,0,0,0,2987,2989,5,5,0,0,2988,
	2987,1,0,0,0,2989,2992,1,0,0,0,2990,2988,1,0,0,0,2990,2991,1,0,0,0,2991,
	2993,1,0,0,0,2992,2990,1,0,0,0,2993,3014,5,77,0,0,2994,2996,5,5,0,0,2995,
	2994,1,0,0,0,2996,2999,1,0,0,0,2997,2995,1,0,0,0,2997,2998,1,0,0,0,2998,
	3000,1,0,0,0,2999,2997,1,0,0,0,3000,3004,5,26,0,0,3001,3003,5,5,0,0,3002,
	3001,1,0,0,0,3003,3006,1,0,0,0,3004,3002,1,0,0,0,3004,3005,1,0,0,0,3005,
	3007,1,0,0,0,3006,3004,1,0,0,0,3007,3011,3,38,19,0,3008,3010,5,5,0,0,3009,
	3008,1,0,0,0,3010,3013,1,0,0,0,3011,3009,1,0,0,0,3011,3012,1,0,0,0,3012,
	3015,1,0,0,0,3013,3011,1,0,0,0,3014,2997,1,0,0,0,3014,3015,1,0,0,0,3015,
	3023,1,0,0,0,3016,3018,5,5,0,0,3017,3016,1,0,0,0,3018,3021,1,0,0,0,3019,
	3017,1,0,0,0,3019,3020,1,0,0,0,3020,3022,1,0,0,0,3021,3019,1,0,0,0,3022,
	3024,3,32,16,0,3023,3019,1,0,0,0,3023,3024,1,0,0,0,3024,251,1,0,0,0,3025,
	3026,7,10,0,0,3026,253,1,0,0,0,3027,3044,5,86,0,0,3028,3032,5,47,0,0,3029,
	3031,5,5,0,0,3030,3029,1,0,0,0,3031,3034,1,0,0,0,3032,3030,1,0,0,0,3032,
	3033,1,0,0,0,3033,3035,1,0,0,0,3034,3032,1,0,0,0,3035,3039,3,104,52,0,3036,
	3038,5,5,0,0,3037,3036,1,0,0,0,3038,3041,1,0,0,0,3039,3037,1,0,0,0,3039,
	3040,1,0,0,0,3040,3042,1,0,0,0,3041,3039,1,0,0,0,3042,3043,5,48,0,0,3043,
	3045,1,0,0,0,3044,3028,1,0,0,0,3044,3045,1,0,0,0,3045,3048,1,0,0,0,3046,
	3047,5,41,0,0,3047,3049,3,350,175,0,3048,3046,1,0,0,0,3048,3049,1,0,0,0,
	3049,3052,1,0,0,0,3050,3052,5,62,0,0,3051,3027,1,0,0,0,3051,3050,1,0,0,
	0,3052,255,1,0,0,0,3053,3057,5,89,0,0,3054,3056,5,5,0,0,3055,3054,1,0,0,
	0,3056,3059,1,0,0,0,3057,3055,1,0,0,0,3057,3058,1,0,0,0,3058,3060,1,0,0,
	0,3059,3057,1,0,0,0,3060,3064,5,9,0,0,3061,3063,5,5,0,0,3062,3061,1,0,0,
	0,3063,3066,1,0,0,0,3064,3062,1,0,0,0,3064,3065,1,0,0,0,3065,3067,1,0,0,
	0,3066,3064,1,0,0,0,3067,3071,3,158,79,0,3068,3070,5,5,0,0,3069,3068,1,
	0,0,0,3070,3073,1,0,0,0,3071,3069,1,0,0,0,3071,3072,1,0,0,0,3072,3074,1,
	0,0,0,3073,3071,1,0,0,0,3074,3078,5,10,0,0,3075,3077,5,5,0,0,3076,3075,
	1,0,0,0,3077,3080,1,0,0,0,3078,3076,1,0,0,0,3078,3079,1,0,0,0,3079,3112,
	1,0,0,0,3080,3078,1,0,0,0,3081,3113,3,140,70,0,3082,3084,3,140,70,0,3083,
	3082,1,0,0,0,3083,3084,1,0,0,0,3084,3088,1,0,0,0,3085,3087,5,5,0,0,3086,
	3085,1,0,0,0,3087,3090,1,0,0,0,3088,3086,1,0,0,0,3088,3089,1,0,0,0,3089,
	3092,1,0,0,0,3090,3088,1,0,0,0,3091,3093,5,27,0,0,3092,3091,1,0,0,0,3092,
	3093,1,0,0,0,3093,3097,1,0,0,0,3094,3096,5,5,0,0,3095,3094,1,0,0,0,3096,
	3099,1,0,0,0,3097,3095,1,0,0,0,3097,3098,1,0,0,0,3098,3100,1,0,0,0,3099,
	3097,1,0,0,0,3100,3104,5,90,0,0,3101,3103,5,5,0,0,3102,3101,1,0,0,0,3103,
	3106,1,0,0,0,3104,3102,1,0,0,0,3104,3105,1,0,0,0,3105,3109,1,0,0,0,3106,
	3104,1,0,0,0,3107,3110,3,140,70,0,3108,3110,5,27,0,0,3109,3107,1,0,0,0,
	3109,3108,1,0,0,0,3110,3113,1,0,0,0,3111,3113,5,27,0,0,3112,3081,1,0,0,
	0,3112,3083,1,0,0,0,3112,3111,1,0,0,0,3113,257,1,0,0,0,3114,3148,5,9,0,
	0,3115,3117,3,340,170,0,3116,3115,1,0,0,0,3117,3120,1,0,0,0,3118,3116,1,
	0,0,0,3118,3119,1,0,0,0,3119,3124,1,0,0,0,3120,3118,1,0,0,0,3121,3123,5,
	5,0,0,3122,3121,1,0,0,0,3123,3126,1,0,0,0,3124,3122,1,0,0,0,3124,3125,1,
	0,0,0,3125,3127,1,0,0,0,3126,3124,1,0,0,0,3127,3131,5,78,0,0,3128,3130,
	5,5,0,0,3129,3128,1,0,0,0,3130,3133,1,0,0,0,3131,3129,1,0,0,0,3131,3132,
	1,0,0,0,3132,3134,1,0,0,0,3133,3131,1,0,0,0,3134,3138,3,72,36,0,3135,3137,
	5,5,0,0,3136,3135,1,0,0,0,3137,3140,1,0,0,0,3138,3136,1,0,0,0,3138,3139,
	1,0,0,0,3139,3141,1,0,0,0,3140,3138,1,0,0,0,3141,3145,5,28,0,0,3142,3144,
	5,5,0,0,3143,3142,1,0,0,0,3144,3147,1,0,0,0,3145,3143,1,0,0,0,3145,3146,
	1,0,0,0,3146,3149,1,0,0,0,3147,3145,1,0,0,0,3148,3118,1,0,0,0,3148,3149,
	1,0,0,0,3149,3150,1,0,0,0,3150,3151,3,158,79,0,3151,3152,5,10,0,0,3152,
	259,1,0,0,0,3153,3157,5,91,0,0,3154,3156,5,5,0,0,3155,3154,1,0,0,0,3156,
	3159,1,0,0,0,3157,3155,1,0,0,0,3157,3158,1,0,0,0,3158,3161,1,0,0,0,3159,
	3157,1,0,0,0,3160,3162,3,258,129,0,3161,3160,1,0,0,0,3161,3162,1,0,0,0,
	3162,3166,1,0,0,0,3163,3165,5,5,0,0,3164,3163,1,0,0,0,3165,3168,1,0,0,0,
	3166,3164,1,0,0,0,3166,3167,1,0,0,0,3167,3169,1,0,0,0,3168,3166,1,0,0,0,
	3169,3173,5,13,0,0,3170,3172,5,5,0,0,3171,3170,1,0,0,0,3172,3175,1,0,0,
	0,3173,3171,1,0,0,0,3173,3174,1,0,0,0,3174,3185,1,0,0,0,3175,3173,1,0,0,
	0,3176,3180,3,262,131,0,3177,3179,5,5,0,0,3178,3177,1,0,0,0,3179,3182,1,
	0,0,0,3180,3178,1,0,0,0,3180,3181,1,0,0,0,3181,3184,1,0,0,0,3182,3180,1,
	0,0,0,3183,3176,1,0,0,0,3184,3187,1,0,0,0,3185,3183,1,0,0,0,3185,3186,1,
	0,0,0,3186,3191,1,0,0,0,3187,3185,1,0,0,0,3188,3190,5,5,0,0,3189,3188,1,
	0,0,0,3190,3193,1,0,0,0,3191,3189,1,0,0,0,3191,3192,1,0,0,0,3192,3194,1,
	0,0,0,3193,3191,1,0,0,0,3194,3195,5,14,0,0,3195,261,1,0,0,0,3196,3213,3,
	264,132,0,3197,3199,5,5,0,0,3198,3197,1,0,0,0,3199,3202,1,0,0,0,3200,3198,
	1,0,0,0,3200,3201,1,0,0,0,3201,3203,1,0,0,0,3202,3200,1,0,0,0,3203,3207,
	5,8,0,0,3204,3206,5,5,0,0,3205,3204,1,0,0,0,3206,3209,1,0,0,0,3207,3205,
	1,0,0,0,3207,3208,1,0,0,0,3208,3210,1,0,0,0,3209,3207,1,0,0,0,3210,3212,
	3,264,132,0,3211,3200,1,0,0,0,3212,3215,1,0,0,0,3213,3211,1,0,0,0,3213,
	3214,1,0,0,0,3214,3223,1,0,0,0,3215,3213,1,0,0,0,3216,3218,5,5,0,0,3217,
	3216,1,0,0,0,3218,3221,1,0,0,0,3219,3217,1,0,0,0,3219,3220,1,0,0,0,3220,
	3222,1,0,0,0,3221,3219,1,0,0,0,3222,3224,5,8,0,0,3223,3219,1,0,0,0,3223,
	3224,1,0,0,0,3224,3228,1,0,0,0,3225,3227,5,5,0,0,3226,3225,1,0,0,0,3227,
	3230,1,0,0,0,3228,3226,1,0,0,0,3228,3229,1,0,0,0,3229,3231,1,0,0,0,3230,
	3228,1,0,0,0,3231,3235,5,34,0,0,3232,3234,5,5,0,0,3233,3232,1,0,0,0,3234,
	3237,1,0,0,0,3235,3233,1,0,0,0,3235,3236,1,0,0,0,3236,3238,1,0,0,0,3237,
	3235,1,0,0,0,3238,3240,3,140,70,0,3239,3241,3,154,77,0,3240,3239,1,0,0,
	0,3240,3241,1,0,0,0,3241,3261,1,0,0,0,3242,3246,5,90,0,0,3243,3245,5,5,
	0,0,3244,3243,1,0,0,0,3245,3248,1,0,0,0,3246,3244,1,0,0,0,3246,3247,1,0,
	0,0,3247,3249,1,0,0,0,3248,3246,1,0,0,0,3249,3253,5,34,0,0,3250,3252,5,
	5,0,0,3251,3250,1,0,0,0,3252,3255,1,0,0,0,3253,3251,1,0,0,0,3253,3254,1,
	0,0,0,3254,3256,1,0,0,0,3255,3253,1,0,0,0,3256,3258,3,140,70,0,3257,3259,
	3,154,77,0,3258,3257,1,0,0,0,3258,3259,1,0,0,0,3259,3261,1,0,0,0,3260,3196,
	1,0,0,0,3260,3242,1,0,0,0,3261,263,1,0,0,0,3262,3266,3,158,79,0,3263,3266,
	3,266,133,0,3264,3266,3,268,134,0,3265,3262,1,0,0,0,3265,3263,1,0,0,0,3265,
	3264,1,0,0,0,3266,265,1,0,0,0,3267,3271,3,286,143,0,3268,3270,5,5,0,0,3269,
	3268,1,0,0,0,3270,3273,1,0,0,0,3271,3269,1,0,0,0,3271,3272,1,0,0,0,3272,
	3274,1,0,0,0,3273,3271,1,0,0,0,3274,3275,3,158,79,0,3275,267,1,0,0,0,3276,
	3280,3,288,144,0,3277,3279,5,5,0,0,3278,3277,1,0,0,0,3279,3282,1,0,0,0,
	3280,3278,1,0,0,0,3280,3281,1,0,0,0,3281,3283,1,0,0,0,3282,3280,1,0,0,0,
	3283,3284,3,104,52,0,3284,269,1,0,0,0,3285,3289,5,92,0,0,3286,3288,5,5,
	0,0,3287,3286,1,0,0,0,3288,3291,1,0,0,0,3289,3287,1,0,0,0,3289,3290,1,0,
	0,0,3290,3292,1,0,0,0,3291,3289,1,0,0,0,3292,3320,3,142,71,0,3293,3295,
	5,5,0,0,3294,3293,1,0,0,0,3295,3298,1,0,0,0,3296,3294,1,0,0,0,3296,3297,
	1,0,0,0,3297,3299,1,0,0,0,3298,3296,1,0,0,0,3299,3301,3,272,136,0,3300,
	3296,1,0,0,0,3301,3302,1,0,0,0,3302,3300,1,0,0,0,3302,3303,1,0,0,0,3303,
	3311,1,0,0,0,3304,3306,5,5,0,0,3305,3304,1,0,0,0,3306,3309,1,0,0,0,3307,
	3305,1,0,0,0,3307,3308,1,0,0,0,3308,3310,1,0,0,0,3309,3307,1,0,0,0,3310,
	3312,3,274,137,0,3311,3307,1,0,0,0,3311,3312,1,0,0,0,3312,3321,1,0,0,0,
	3313,3315,5,5,0,0,3314,3313,1,0,0,0,3315,3318,1,0,0,0,3316,3314,1,0,0,0,
	3316,3317,1,0,0,0,3317,3319,1,0,0,0,3318,3316,1,0,0,0,3319,3321,3,274,137,
	0,3320,3300,1,0,0,0,3320,3316,1,0,0,0,3321,271,1,0,0,0,3322,3326,5,93,0,
	0,3323,3325,5,5,0,0,3324,3323,1,0,0,0,3325,3328,1,0,0,0,3326,3324,1,0,0,
	0,3326,3327,1,0,0,0,3327,3329,1,0,0,0,3328,3326,1,0,0,0,3329,3333,5,9,0,
	0,3330,3332,3,340,170,0,3331,3330,1,0,0,0,3332,3335,1,0,0,0,3333,3331,1,
	0,0,0,3333,3334,1,0,0,0,3334,3336,1,0,0,0,3335,3333,1,0,0,0,3336,3337,3,
	350,175,0,3337,3338,5,26,0,0,3338,3346,3,104,52,0,3339,3341,5,5,0,0,3340,
	3339,1,0,0,0,3341,3344,1,0,0,0,3342,3340,1,0,0,0,3342,3343,1,0,0,0,3343,
	3345,1,0,0,0,3344,3342,1,0,0,0,3345,3347,5,8,0,0,3346,3342,1,0,0,0,3346,
	3347,1,0,0,0,3347,3348,1,0,0,0,3348,3352,5,10,0,0,3349,3351,5,5,0,0,3350,
	3349,1,0,0,0,3351,3354,1,0,0,0,3352,3350,1,0,0,0,3352,3353,1,0,0,0,3353,
	3355,1,0,0,0,3354,3352,1,0,0,0,3355,3356,3,142,71,0,3356,273,1,0,0,0,3357,
	3361,5,94,0,0,3358,3360,5,5,0,0,3359,3358,1,0,0,0,3360,3363,1,0,0,0,3361,
	3359,1,0,0,0,3361,3362,1,0,0,0,3362,3364,1,0,0,0,3363,3361,1,0,0,0,3364,
	3365,3,142,71,0,3365,275,1,0,0,0,3366,3370,5,98,0,0,3367,3369,5,5,0,0,3368,
	3367,1,0,0,0,3369,3372,1,0,0,0,3370,3368,1,0,0,0,3370,3371,1,0,0,0,3371,
	3373,1,0,0,0,3372,3370,1,0,0,0,3373,3383,3,158,79,0,3374,3376,7,11,0,0,
	3375,3377,3,158,79,0,3376,3375,1,0,0,0,3376,3377,1,0,0,0,3377,3383,1,0,
	0,0,3378,3383,5,100,0,0,3379,3383,5,59,0,0,3380,3383,5,101,0,0,3381,3383,
	5,60,0,0,3382,3366,1,0,0,0,3382,3374,1,0,0,0,3382,3378,1,0,0,0,3382,3379,
	1,0,0,0,3382,3380,1,0,0,0,3382,3381,1,0,0,0,3383,277,1,0,0,0,3384,3386,
	3,128,64,0,3385,3384,1,0,0,0,3385,3386,1,0,0,0,3386,3387,1,0,0,0,3387,3391,
	5,38,0,0,3388,3390,5,5,0,0,3389,3388,1,0,0,0,3390,3393,1,0,0,0,3391,3389,
	1,0,0,0,3391,3392,1,0,0,0,3392,3396,1,0,0,0,3393,3391,1,0,0,0,3394,3397,
	3,350,175,0,3395,3397,5,74,0,0,3396,3394,1,0,0,0,3396,3395,1,0,0,0,3397,
	279,1,0,0,0,3398,3399,7,12,0,0,3399,281,1,0,0,0,3400,3401,7,13,0,0,3401,
	283,1,0,0,0,3402,3403,7,14,0,0,3403,285,1,0,0,0,3404,3405,7,15,0,0,3405,
	287,1,0,0,0,3406,3407,7,16,0,0,3407,289,1,0,0,0,3408,3409,7,17,0,0,3409,
	291,1,0,0,0,3410,3411,7,18,0,0,3411,293,1,0,0,0,3412,3413,7,19,0,0,3413,
	295,1,0,0,0,3414,3420,5,20,0,0,3415,3420,5,21,0,0,3416,3420,5,19,0,0,3417,
	3420,5,18,0,0,3418,3420,3,300,150,0,3419,3414,1,0,0,0,3419,3415,1,0,0,0,
	3419,3416,1,0,0,0,3419,3417,1,0,0,0,3419,3418,1,0,0,0,3420,297,1,0,0,0,
	3421,3426,5,20,0,0,3422,3426,5,21,0,0,3423,3424,5,25,0,0,3424,3426,3,300,
	150,0,3425,3421,1,0,0,0,3425,3422,1,0,0,0,3425,3423,1,0,0,0,3426,299,1,
	0,0,0,3427,3428,7,20,0,0,3428,301,1,0,0,0,3429,3431,5,5,0,0,3430,3429,1,
	0,0,0,3431,3434,1,0,0,0,3432,3430,1,0,0,0,3432,3433,1,0,0,0,3433,3435,1,
	0,0,0,3434,3432,1,0,0,0,3435,3445,5,7,0,0,3436,3438,5,5,0,0,3437,3436,1,
	0,0,0,3438,3441,1,0,0,0,3439,3437,1,0,0,0,3439,3440,1,0,0,0,3440,3442,1,
	0,0,0,3441,3439,1,0,0,0,3442,3445,3,304,152,0,3443,3445,5,38,0,0,3444,3432,
	1,0,0,0,3444,3439,1,0,0,0,3444,3443,1,0,0,0,3445,303,1,0,0,0,3446,3447,
	5,46,0,0,3447,3448,5,7,0,0,3448,305,1,0,0,0,3449,3452,3,340,170,0,3450,
	3452,3,310,155,0,3451,3449,1,0,0,0,3451,3450,1,0,0,0,3452,3453,1,0,0,0,
	3453,3451,1,0,0,0,3453,3454,1,0,0,0,3454,307,1,0,0,0,3455,3458,3,340,170,
	0,3456,3458,3,334,167,0,3457,3455,1,0,0,0,3457,3456,1,0,0,0,3458,3459,1,
	0,0,0,3459,3457,1,0,0,0,3459,3460,1,0,0,0,3460,309,1,0,0,0,3461,3470,3,
	316,158,0,3462,3470,3,318,159,0,3463,3470,3,320,160,0,3464,3470,3,328,164,
	0,3465,3470,3,330,165,0,3466,3470,3,332,166,0,3467,3470,3,334,167,0,3468,
	3470,3,338,169,0,3469,3461,1,0,0,0,3469,3462,1,0,0,0,3469,3463,1,0,0,0,
	3469,3464,1,0,0,0,3469,3465,1,0,0,0,3469,3466,1,0,0,0,3469,3467,1,0,0,0,
	3469,3468,1,0,0,0,3470,3474,1,0,0,0,3471,3473,5,5,0,0,3472,3471,1,0,0,0,
	3473,3476,1,0,0,0,3474,3472,1,0,0,0,3474,3475,1,0,0,0,3475,311,1,0,0,0,
	3476,3474,1,0,0,0,3477,3479,3,314,157,0,3478,3477,1,0,0,0,3479,3480,1,0,
	0,0,3480,3478,1,0,0,0,3480,3481,1,0,0,0,3481,313,1,0,0,0,3482,3491,3,340,
	170,0,3483,3487,5,124,0,0,3484,3486,5,5,0,0,3485,3484,1,0,0,0,3486,3489,
	1,0,0,0,3487,3485,1,0,0,0,3487,3488,1,0,0,0,3488,3491,1,0,0,0,3489,3487,
	1,0,0,0,3490,3482,1,0,0,0,3490,3483,1,0,0,0,3491,315,1,0,0,0,3492,3493,
	7,21,0,0,3493,317,1,0,0,0,3494,3495,7,22,0,0,3495,319,1,0,0,0,3496,3497,
	7,23,0,0,3497,321,1,0,0,0,3498,3499,7,24,0,0,3499,323,1,0,0,0,3500,3502,
	3,326,163,0,3501,3500,1,0,0,0,3502,3503,1,0,0,0,3503,3501,1,0,0,0,3503,
	3504,1,0,0,0,3504,325,1,0,0,0,3505,3509,3,336,168,0,3506,3508,5,5,0,0,3507,
	3506,1,0,0,0,3508,3511,1,0,0,0,3509,3507,1,0,0,0,3509,3510,1,0,0,0,3510,
	3521,1,0,0,0,3511,3509,1,0,0,0,3512,3516,3,322,161,0,3513,3515,5,5,0,0,
	3514,3513,1,0,0,0,3515,3518,1,0,0,0,3516,3514,1,0,0,0,3516,3517,1,0,0,0,
	3517,3521,1,0,0,0,3518,3516,1,0,0,0,3519,3521,3,340,170,0,3520,3505,1,0,
	0,0,3520,3512,1,0,0,0,3520,3519,1,0,0,0,3521,327,1,0,0,0,3522,3523,7,25,
	0,0,3523,329,1,0,0,0,3524,3525,5,129,0,0,3525,331,1,0,0,0,3526,3527,7,26,
	0,0,3527,333,1,0,0,0,3528,3529,7,27,0,0,3529,335,1,0,0,0,3530,3531,5,134,
	0,0,3531,337,1,0,0,0,3532,3533,7,28,0,0,3533,339,1,0,0,0,3534,3537,3,342,
	171,0,3535,3537,3,344,172,0,3536,3534,1,0,0,0,3536,3535,1,0,0,0,3537,3541,
	1,0,0,0,3538,3540,5,5,0,0,3539,3538,1,0,0,0,3540,3543,1,0,0,0,3541,3539,
	1,0,0,0,3541,3542,1,0,0,0,3542,341,1,0,0,0,3543,3541,1,0,0,0,3544,3548,
	3,346,173,0,3545,3547,5,5,0,0,3546,3545,1,0,0,0,3547,3550,1,0,0,0,3548,
	3546,1,0,0,0,3548,3549,1,0,0,0,3549,3554,1,0,0,0,3550,3548,1,0,0,0,3551,
	3554,5,41,0,0,3552,3554,5,43,0,0,3553,3544,1,0,0,0,3553,3551,1,0,0,0,3553,
	3552,1,0,0,0,3554,3555,1,0,0,0,3555,3556,3,348,174,0,3556,343,1,0,0,0,3557,
	3561,3,346,173,0,3558,3560,5,5,0,0,3559,3558,1,0,0,0,3560,3563,1,0,0,0,
	3561,3559,1,0,0,0,3561,3562,1,0,0,0,3562,3567,1,0,0,0,3563,3561,1,0,0,0,
	3564,3567,5,41,0,0,3565,3567,5,43,0,0,3566,3557,1,0,0,0,3566,3564,1,0,0,
	0,3566,3565,1,0,0,0,3567,3568,1,0,0,0,3568,3570,5,11,0,0,3569,3571,3,348,
	174,0,3570,3569,1,0,0,0,3571,3572,1,0,0,0,3572,3570,1,0,0,0,3572,3573,1,
	0,0,0,3573,3574,1,0,0,0,3574,3575,5,12,0,0,3575,345,1,0,0,0,3576,3577,7,
	0,0,0,3577,3581,7,29,0,0,3578,3580,5,5,0,0,3579,3578,1,0,0,0,3580,3583,
	1,0,0,0,3581,3579,1,0,0,0,3581,3582,1,0,0,0,3582,3584,1,0,0,0,3583,3581,
	1,0,0,0,3584,3585,5,26,0,0,3585,347,1,0,0,0,3586,3589,3,42,21,0,3587,3589,
	3,112,56,0,3588,3586,1,0,0,0,3588,3587,1,0,0,0,3589,349,1,0,0,0,3590,3591,
	7,30,0,0,3591,351,1,0,0,0,3592,3603,3,350,175,0,3593,3595,5,5,0,0,3594,
	3593,1,0,0,0,3595,3598,1,0,0,0,3596,3594,1,0,0,0,3596,3597,1,0,0,0,3597,
	3599,1,0,0,0,3598,3596,1,0,0,0,3599,3600,5,7,0,0,3600,3602,3,350,175,0,
	3601,3596,1,0,0,0,3602,3605,1,0,0,0,3603,3601,1,0,0,0,3603,3604,1,0,0,0,
	3604,353,1,0,0,0,3605,3603,1,0,0,0,563,355,360,366,370,373,377,379,385,
	390,396,400,403,407,411,423,429,437,443,450,457,464,469,474,480,482,487,
	495,498,505,508,514,521,525,530,537,547,550,557,560,563,568,575,579,584,
	588,593,600,604,609,613,618,625,629,632,638,641,644,650,654,659,668,675,
	682,688,694,698,700,705,711,714,719,727,734,741,745,751,758,764,775,779,
	785,793,799,806,811,818,827,834,841,847,853,857,862,868,873,880,887,891,
	897,904,911,917,923,930,937,944,948,950,952,959,965,971,977,981,986,993,
	997,1002,1009,1013,1018,1022,1028,1035,1042,1048,1054,1058,1060,1065,1071,
	1077,1084,1088,1091,1097,1101,1106,1113,1118,1123,1130,1137,1144,1148,1153,
	1157,1162,1166,1173,1177,1182,1188,1195,1202,1206,1211,1218,1222,1228,1235,
	1242,1248,1254,1258,1263,1269,1275,1279,1284,1291,1296,1301,1306,1311,1315,
	1320,1327,1332,1334,1339,1343,1348,1352,1357,1361,1364,1367,1372,1376,1379,
	1381,1387,1393,1399,1406,1413,1420,1424,1429,1433,1436,1442,1449,1456,1460,
	1465,1472,1479,1483,1488,1493,1499,1506,1513,1519,1525,1529,1531,1536,1542,
	1548,1555,1559,1565,1572,1576,1582,1589,1595,1601,1608,1615,1619,1624,1628,
	1631,1637,1644,1651,1655,1660,1664,1670,1679,1683,1688,1695,1699,1704,1713,
	1720,1726,1732,1736,1742,1745,1751,1755,1760,1764,1767,1774,1779,1783,1788,
	1794,1802,1809,1815,1822,1826,1829,1833,1838,1844,1848,1854,1861,1864,1870,
	1877,1886,1891,1896,1903,1908,1912,1918,1922,1927,1936,1943,1949,1954,1960,
	1965,1970,1976,1980,1985,1992,1996,2000,2008,2011,2014,2018,2020,2027,2034,
	2039,2045,2049,2054,2061,2067,2073,2080,2085,2093,2097,2102,2109,2118,2123,
	2128,2135,2139,2144,2151,2160,2169,2174,2183,2189,2197,2204,2210,2217,2224,
	2230,2238,2245,2253,2260,2267,2275,2284,2289,2291,2298,2305,2312,2323,2330,
	2338,2344,2352,2359,2367,2374,2381,2388,2395,2401,2412,2415,2421,2429,2436,
	2442,2449,2456,2462,2469,2477,2483,2490,2497,2503,2509,2513,2518,2527,2533,
	2536,2539,2543,2548,2552,2557,2566,2573,2580,2586,2592,2596,2601,2610,2617,
	2624,2630,2636,2640,2645,2648,2653,2658,2665,2672,2675,2678,2683,2702,2708,
	2715,2724,2731,2738,2744,2750,2754,2759,2762,2770,2775,2777,2786,2788,2799,
	2806,2817,2824,2833,2837,2842,2849,2852,2858,2867,2874,2880,2886,2890,2897,
	2904,2908,2910,2913,2918,2925,2932,2937,2942,2949,2956,2960,2965,2969,2974,
	2978,2982,2985,2990,2997,3004,3011,3014,3019,3023,3032,3039,3044,3048,3051,
	3057,3064,3071,3078,3083,3088,3092,3097,3104,3109,3112,3118,3124,3131,3138,
	3145,3148,3157,3161,3166,3173,3180,3185,3191,3200,3207,3213,3219,3223,3228,
	3235,3240,3246,3253,3258,3260,3265,3271,3280,3289,3296,3302,3307,3311,3316,
	3320,3326,3333,3342,3346,3352,3361,3370,3376,3382,3385,3391,3396,3419,3425,
	3432,3439,3444,3451,3453,3457,3459,3469,3474,3480,3487,3490,3503,3509,3516,
	3520,3536,3541,3548,3553,3561,3566,3572,3581,3588,3596,3603];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!KotlinParser.__ATN) {
			KotlinParser.__ATN = new ATNDeserializer().deserialize(KotlinParser._serializedATN);
		}

		return KotlinParser.__ATN;
	}


	static DecisionsToDFA = KotlinParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class KotlinFileContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(KotlinParser.EOF, 0);
	}
	public shebangLine(): ShebangLineContext {
		return this.getTypedRuleContext(ShebangLineContext, 0) as ShebangLineContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public fileAnnotation_list(): FileAnnotationContext[] {
		return this.getTypedRuleContexts(FileAnnotationContext) as FileAnnotationContext[];
	}
	public fileAnnotation(i: number): FileAnnotationContext {
		return this.getTypedRuleContext(FileAnnotationContext, i) as FileAnnotationContext;
	}
	public packageHeader(): PackageHeaderContext {
		return this.getTypedRuleContext(PackageHeaderContext, 0) as PackageHeaderContext;
	}
	public importList(): ImportListContext {
		return this.getTypedRuleContext(ImportListContext, 0) as ImportListContext;
	}
	public topLevelObject_list(): TopLevelObjectContext[] {
		return this.getTypedRuleContexts(TopLevelObjectContext) as TopLevelObjectContext[];
	}
	public topLevelObject(i: number): TopLevelObjectContext {
		return this.getTypedRuleContext(TopLevelObjectContext, i) as TopLevelObjectContext;
	}
	public topLevelExpression_list(): TopLevelExpressionContext[] {
		return this.getTypedRuleContexts(TopLevelExpressionContext) as TopLevelExpressionContext[];
	}
	public topLevelExpression(i: number): TopLevelExpressionContext {
		return this.getTypedRuleContext(TopLevelExpressionContext, i) as TopLevelExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_kotlinFile;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterKotlinFile) {
	 		listener.enterKotlinFile(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitKotlinFile) {
	 		listener.exitKotlinFile(this);
		}
	}
}


export class ScriptContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(KotlinParser.EOF, 0);
	}
	public shebangLine(): ShebangLineContext {
		return this.getTypedRuleContext(ShebangLineContext, 0) as ShebangLineContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public fileAnnotation_list(): FileAnnotationContext[] {
		return this.getTypedRuleContexts(FileAnnotationContext) as FileAnnotationContext[];
	}
	public fileAnnotation(i: number): FileAnnotationContext {
		return this.getTypedRuleContext(FileAnnotationContext, i) as FileAnnotationContext;
	}
	public packageHeader(): PackageHeaderContext {
		return this.getTypedRuleContext(PackageHeaderContext, 0) as PackageHeaderContext;
	}
	public importList(): ImportListContext {
		return this.getTypedRuleContext(ImportListContext, 0) as ImportListContext;
	}
	public statement_list(): StatementContext[] {
		return this.getTypedRuleContexts(StatementContext) as StatementContext[];
	}
	public statement(i: number): StatementContext {
		return this.getTypedRuleContext(StatementContext, i) as StatementContext;
	}
	public semi_list(): SemiContext[] {
		return this.getTypedRuleContexts(SemiContext) as SemiContext[];
	}
	public semi(i: number): SemiContext {
		return this.getTypedRuleContext(SemiContext, i) as SemiContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_script;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterScript) {
	 		listener.enterScript(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitScript) {
	 		listener.exitScript(this);
		}
	}
}


export class TypeCheckExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public infixOperation(): InfixOperationContext {
		return this.getTypedRuleContext(InfixOperationContext, 0) as InfixOperationContext;
	}
	public isOperator(): IsOperatorContext {
		return this.getTypedRuleContext(IsOperatorContext, 0) as IsOperatorContext;
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public inOperator(): InOperatorContext {
		return this.getTypedRuleContext(InOperatorContext, 0) as InOperatorContext;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeCheckExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeCheckExpression) {
	 		listener.enterTypeCheckExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeCheckExpression) {
	 		listener.exitTypeCheckExpression(this);
		}
	}
}


export class TopLevelJumpExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public THROW(): TerminalNode {
		return this.getToken(KotlinParser.THROW, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_topLevelJumpExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTopLevelJumpExpression) {
	 		listener.enterTopLevelJumpExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTopLevelJumpExpression) {
	 		listener.exitTopLevelJumpExpression(this);
		}
	}
}


export class TopLevelExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public statement(): StatementContext {
		return this.getTypedRuleContext(StatementContext, 0) as StatementContext;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL(): TerminalNode {
		return this.getToken(KotlinParser.NL, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_topLevelExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTopLevelExpression) {
	 		listener.enterTopLevelExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTopLevelExpression) {
	 		listener.exitTopLevelExpression(this);
		}
	}
}


export class ShebangLineContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ShebangLine(): TerminalNode {
		return this.getToken(KotlinParser.ShebangLine, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_shebangLine;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterShebangLine) {
	 		listener.enterShebangLine(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitShebangLine) {
	 		listener.exitShebangLine(this);
		}
	}
}


export class FileAnnotationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FILE(): TerminalNode {
		return this.getToken(KotlinParser.FILE, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public AT_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_NO_WS, 0);
	}
	public AT_PRE_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_PRE_WS, 0);
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.LSQUARE, 0);
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.RSQUARE, 0);
	}
	public unescapedAnnotation_list(): UnescapedAnnotationContext[] {
		return this.getTypedRuleContexts(UnescapedAnnotationContext) as UnescapedAnnotationContext[];
	}
	public unescapedAnnotation(i: number): UnescapedAnnotationContext {
		return this.getTypedRuleContext(UnescapedAnnotationContext, i) as UnescapedAnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_fileAnnotation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFileAnnotation) {
	 		listener.enterFileAnnotation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFileAnnotation) {
	 		listener.exitFileAnnotation(this);
		}
	}
}


export class PackageHeaderContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PACKAGE(): TerminalNode {
		return this.getToken(KotlinParser.PACKAGE, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public semi(): SemiContext {
		return this.getTypedRuleContext(SemiContext, 0) as SemiContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_packageHeader;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPackageHeader) {
	 		listener.enterPackageHeader(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPackageHeader) {
	 		listener.exitPackageHeader(this);
		}
	}
}


export class ImportListContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public importHeader_list(): ImportHeaderContext[] {
		return this.getTypedRuleContexts(ImportHeaderContext) as ImportHeaderContext[];
	}
	public importHeader(i: number): ImportHeaderContext {
		return this.getTypedRuleContext(ImportHeaderContext, i) as ImportHeaderContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_importList;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterImportList) {
	 		listener.enterImportList(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitImportList) {
	 		listener.exitImportList(this);
		}
	}
}


export class ImportHeaderContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IMPORT(): TerminalNode {
		return this.getToken(KotlinParser.IMPORT, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
	public MULT(): TerminalNode {
		return this.getToken(KotlinParser.MULT, 0);
	}
	public importAlias(): ImportAliasContext {
		return this.getTypedRuleContext(ImportAliasContext, 0) as ImportAliasContext;
	}
	public semi(): SemiContext {
		return this.getTypedRuleContext(SemiContext, 0) as SemiContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_importHeader;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterImportHeader) {
	 		listener.enterImportHeader(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitImportHeader) {
	 		listener.exitImportHeader(this);
		}
	}
}


export class ImportAliasContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AS(): TerminalNode {
		return this.getToken(KotlinParser.AS, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_importAlias;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterImportAlias) {
	 		listener.enterImportAlias(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitImportAlias) {
	 		listener.exitImportAlias(this);
		}
	}
}


export class TopLevelObjectContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public declaration(): DeclarationContext {
		return this.getTypedRuleContext(DeclarationContext, 0) as DeclarationContext;
	}
	public semis(): SemisContext {
		return this.getTypedRuleContext(SemisContext, 0) as SemisContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_topLevelObject;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTopLevelObject) {
	 		listener.enterTopLevelObject(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTopLevelObject) {
	 		listener.exitTopLevelObject(this);
		}
	}
}


export class TypeAliasContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TYPE_ALIAS(): TerminalNode {
		return this.getToken(KotlinParser.TYPE_ALIAS, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeAlias;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeAlias) {
	 		listener.enterTypeAlias(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeAlias) {
	 		listener.exitTypeAlias(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classDeclaration(): ClassDeclarationContext {
		return this.getTypedRuleContext(ClassDeclarationContext, 0) as ClassDeclarationContext;
	}
	public objectDeclaration(): ObjectDeclarationContext {
		return this.getTypedRuleContext(ObjectDeclarationContext, 0) as ObjectDeclarationContext;
	}
	public functionDeclaration(): FunctionDeclarationContext {
		return this.getTypedRuleContext(FunctionDeclarationContext, 0) as FunctionDeclarationContext;
	}
	public propertyDeclaration(): PropertyDeclarationContext {
		return this.getTypedRuleContext(PropertyDeclarationContext, 0) as PropertyDeclarationContext;
	}
	public typeAlias(): TypeAliasContext {
		return this.getTypedRuleContext(TypeAliasContext, 0) as TypeAliasContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_declaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDeclaration) {
	 		listener.enterDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDeclaration) {
	 		listener.exitDeclaration(this);
		}
	}
}


export class ClassDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public CLASS(): TerminalNode {
		return this.getToken(KotlinParser.CLASS, 0);
	}
	public INTERFACE(): TerminalNode {
		return this.getToken(KotlinParser.INTERFACE, 0);
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public primaryConstructor(): PrimaryConstructorContext {
		return this.getTypedRuleContext(PrimaryConstructorContext, 0) as PrimaryConstructorContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public delegationSpecifiers(): DelegationSpecifiersContext {
		return this.getTypedRuleContext(DelegationSpecifiersContext, 0) as DelegationSpecifiersContext;
	}
	public typeConstraints(): TypeConstraintsContext {
		return this.getTypedRuleContext(TypeConstraintsContext, 0) as TypeConstraintsContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
	public enumClassBody(): EnumClassBodyContext {
		return this.getTypedRuleContext(EnumClassBodyContext, 0) as EnumClassBodyContext;
	}
	public FUN(): TerminalNode {
		return this.getToken(KotlinParser.FUN, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassDeclaration) {
	 		listener.enterClassDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassDeclaration) {
	 		listener.exitClassDeclaration(this);
		}
	}
}


export class PrimaryConstructorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CONSTRUCTOR(): TerminalNode {
		return this.getToken(KotlinParser.CONSTRUCTOR, 0);
	}
	public classParameters(): ClassParametersContext {
		return this.getTypedRuleContext(ClassParametersContext, 0) as ClassParametersContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_primaryConstructor;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPrimaryConstructor) {
	 		listener.enterPrimaryConstructor(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPrimaryConstructor) {
	 		listener.exitPrimaryConstructor(this);
		}
	}
}


export class ClassBodyContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LCURL(): TerminalNode {
		return this.getToken(KotlinParser.LCURL, 0);
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public classMemberDeclarations(): ClassMemberDeclarationsContext {
		return this.getTypedRuleContext(ClassMemberDeclarationsContext, 0) as ClassMemberDeclarationsContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classBody;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassBody) {
	 		listener.enterClassBody(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassBody) {
	 		listener.exitClassBody(this);
		}
	}
}


export class ClassParametersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public classParameter_list(): ClassParameterContext[] {
		return this.getTypedRuleContexts(ClassParameterContext) as ClassParameterContext[];
	}
	public classParameter(i: number): ClassParameterContext {
		return this.getTypedRuleContext(ClassParameterContext, i) as ClassParameterContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classParameters;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassParameters) {
	 		listener.enterClassParameters(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassParameters) {
	 		listener.exitClassParameters(this);
		}
	}
}


export class ClassParameterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public VAL(): TerminalNode {
		return this.getToken(KotlinParser.VAL, 0);
	}
	public VAR(): TerminalNode {
		return this.getToken(KotlinParser.VAR, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classParameter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassParameter) {
	 		listener.enterClassParameter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassParameter) {
	 		listener.exitClassParameter(this);
		}
	}
}


export class DelegationSpecifiersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotatedDelegationSpecifier_list(): AnnotatedDelegationSpecifierContext[] {
		return this.getTypedRuleContexts(AnnotatedDelegationSpecifierContext) as AnnotatedDelegationSpecifierContext[];
	}
	public annotatedDelegationSpecifier(i: number): AnnotatedDelegationSpecifierContext {
		return this.getTypedRuleContext(AnnotatedDelegationSpecifierContext, i) as AnnotatedDelegationSpecifierContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_delegationSpecifiers;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDelegationSpecifiers) {
	 		listener.enterDelegationSpecifiers(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDelegationSpecifiers) {
	 		listener.exitDelegationSpecifiers(this);
		}
	}
}


export class DelegationSpecifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public constructorInvocation(): ConstructorInvocationContext {
		return this.getTypedRuleContext(ConstructorInvocationContext, 0) as ConstructorInvocationContext;
	}
	public explicitDelegation(): ExplicitDelegationContext {
		return this.getTypedRuleContext(ExplicitDelegationContext, 0) as ExplicitDelegationContext;
	}
	public userType(): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, 0) as UserTypeContext;
	}
	public functionType(): FunctionTypeContext {
		return this.getTypedRuleContext(FunctionTypeContext, 0) as FunctionTypeContext;
	}
	public SUSPEND(): TerminalNode {
		return this.getToken(KotlinParser.SUSPEND, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_delegationSpecifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDelegationSpecifier) {
	 		listener.enterDelegationSpecifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDelegationSpecifier) {
	 		listener.exitDelegationSpecifier(this);
		}
	}
}


export class ConstructorInvocationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public userType(): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, 0) as UserTypeContext;
	}
	public valueArguments(): ValueArgumentsContext {
		return this.getTypedRuleContext(ValueArgumentsContext, 0) as ValueArgumentsContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_constructorInvocation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterConstructorInvocation) {
	 		listener.enterConstructorInvocation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitConstructorInvocation) {
	 		listener.exitConstructorInvocation(this);
		}
	}
}


export class AnnotatedDelegationSpecifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public delegationSpecifier(): DelegationSpecifierContext {
		return this.getTypedRuleContext(DelegationSpecifierContext, 0) as DelegationSpecifierContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_annotatedDelegationSpecifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAnnotatedDelegationSpecifier) {
	 		listener.enterAnnotatedDelegationSpecifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAnnotatedDelegationSpecifier) {
	 		listener.exitAnnotatedDelegationSpecifier(this);
		}
	}
}


export class ExplicitDelegationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BY(): TerminalNode {
		return this.getToken(KotlinParser.BY, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public userType(): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, 0) as UserTypeContext;
	}
	public functionType(): FunctionTypeContext {
		return this.getTypedRuleContext(FunctionTypeContext, 0) as FunctionTypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_explicitDelegation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterExplicitDelegation) {
	 		listener.enterExplicitDelegation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitExplicitDelegation) {
	 		listener.exitExplicitDelegation(this);
		}
	}
}


export class TypeParametersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LANGLE(): TerminalNode {
		return this.getToken(KotlinParser.LANGLE, 0);
	}
	public typeParameter_list(): TypeParameterContext[] {
		return this.getTypedRuleContexts(TypeParameterContext) as TypeParameterContext[];
	}
	public typeParameter(i: number): TypeParameterContext {
		return this.getTypedRuleContext(TypeParameterContext, i) as TypeParameterContext;
	}
	public RANGLE(): TerminalNode {
		return this.getToken(KotlinParser.RANGLE, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeParameters;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeParameters) {
	 		listener.enterTypeParameters(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeParameters) {
	 		listener.exitTypeParameters(this);
		}
	}
}


export class TypeParameterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public typeParameterModifiers(): TypeParameterModifiersContext {
		return this.getTypedRuleContext(TypeParameterModifiersContext, 0) as TypeParameterModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeParameter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeParameter) {
	 		listener.enterTypeParameter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeParameter) {
	 		listener.exitTypeParameter(this);
		}
	}
}


export class TypeConstraintsContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHERE(): TerminalNode {
		return this.getToken(KotlinParser.WHERE, 0);
	}
	public typeConstraint_list(): TypeConstraintContext[] {
		return this.getTypedRuleContexts(TypeConstraintContext) as TypeConstraintContext[];
	}
	public typeConstraint(i: number): TypeConstraintContext {
		return this.getTypedRuleContext(TypeConstraintContext, i) as TypeConstraintContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeConstraints;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeConstraints) {
	 		listener.enterTypeConstraints(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeConstraints) {
	 		listener.exitTypeConstraints(this);
		}
	}
}


export class TypeConstraintContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeConstraint;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeConstraint) {
	 		listener.enterTypeConstraint(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeConstraint) {
	 		listener.exitTypeConstraint(this);
		}
	}
}


export class ClassMemberDeclarationsContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classMemberDeclaration_list(): ClassMemberDeclarationContext[] {
		return this.getTypedRuleContexts(ClassMemberDeclarationContext) as ClassMemberDeclarationContext[];
	}
	public classMemberDeclaration(i: number): ClassMemberDeclarationContext {
		return this.getTypedRuleContext(ClassMemberDeclarationContext, i) as ClassMemberDeclarationContext;
	}
	public topLevelExpression_list(): TopLevelExpressionContext[] {
		return this.getTypedRuleContexts(TopLevelExpressionContext) as TopLevelExpressionContext[];
	}
	public topLevelExpression(i: number): TopLevelExpressionContext {
		return this.getTypedRuleContext(TopLevelExpressionContext, i) as TopLevelExpressionContext;
	}
	public semis_list(): SemisContext[] {
		return this.getTypedRuleContexts(SemisContext) as SemisContext[];
	}
	public semis(i: number): SemisContext {
		return this.getTypedRuleContext(SemisContext, i) as SemisContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classMemberDeclarations;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassMemberDeclarations) {
	 		listener.enterClassMemberDeclarations(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassMemberDeclarations) {
	 		listener.exitClassMemberDeclarations(this);
		}
	}
}


export class ClassMemberDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public declaration(): DeclarationContext {
		return this.getTypedRuleContext(DeclarationContext, 0) as DeclarationContext;
	}
	public companionObject(): CompanionObjectContext {
		return this.getTypedRuleContext(CompanionObjectContext, 0) as CompanionObjectContext;
	}
	public anonymousInitializer(): AnonymousInitializerContext {
		return this.getTypedRuleContext(AnonymousInitializerContext, 0) as AnonymousInitializerContext;
	}
	public secondaryConstructor(): SecondaryConstructorContext {
		return this.getTypedRuleContext(SecondaryConstructorContext, 0) as SecondaryConstructorContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classMemberDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassMemberDeclaration) {
	 		listener.enterClassMemberDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassMemberDeclaration) {
	 		listener.exitClassMemberDeclaration(this);
		}
	}
}


export class AnonymousInitializerContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INIT(): TerminalNode {
		return this.getToken(KotlinParser.INIT, 0);
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_anonymousInitializer;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAnonymousInitializer) {
	 		listener.enterAnonymousInitializer(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAnonymousInitializer) {
	 		listener.exitAnonymousInitializer(this);
		}
	}
}


export class CompanionObjectContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMPANION(): TerminalNode {
		return this.getToken(KotlinParser.COMPANION, 0);
	}
	public OBJECT(): TerminalNode {
		return this.getToken(KotlinParser.OBJECT, 0);
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public DATA(): TerminalNode {
		return this.getToken(KotlinParser.DATA, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public delegationSpecifiers(): DelegationSpecifiersContext {
		return this.getTypedRuleContext(DelegationSpecifiersContext, 0) as DelegationSpecifiersContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_companionObject;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterCompanionObject) {
	 		listener.enterCompanionObject(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitCompanionObject) {
	 		listener.exitCompanionObject(this);
		}
	}
}


export class FunctionValueParametersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public functionValueParameter_list(): FunctionValueParameterContext[] {
		return this.getTypedRuleContexts(FunctionValueParameterContext) as FunctionValueParameterContext[];
	}
	public functionValueParameter(i: number): FunctionValueParameterContext {
		return this.getTypedRuleContext(FunctionValueParameterContext, i) as FunctionValueParameterContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionValueParameters;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionValueParameters) {
	 		listener.enterFunctionValueParameters(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionValueParameters) {
	 		listener.exitFunctionValueParameters(this);
		}
	}
}


export class FunctionValueParameterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
	public parameterModifiers(): ParameterModifiersContext {
		return this.getTypedRuleContext(ParameterModifiersContext, 0) as ParameterModifiersContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionValueParameter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionValueParameter) {
	 		listener.enterFunctionValueParameter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionValueParameter) {
	 		listener.exitFunctionValueParameter(this);
		}
	}
}


export class FunctionDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FUN(): TerminalNode {
		return this.getToken(KotlinParser.FUN, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public functionValueParameters(): FunctionValueParametersContext {
		return this.getTypedRuleContext(FunctionValueParametersContext, 0) as FunctionValueParametersContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public receiverType(): ReceiverTypeContext {
		return this.getTypedRuleContext(ReceiverTypeContext, 0) as ReceiverTypeContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public typeConstraints(): TypeConstraintsContext {
		return this.getTypedRuleContext(TypeConstraintsContext, 0) as TypeConstraintsContext;
	}
	public functionBody(): FunctionBodyContext {
		return this.getTypedRuleContext(FunctionBodyContext, 0) as FunctionBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionDeclaration) {
	 		listener.enterFunctionDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionDeclaration) {
	 		listener.exitFunctionDeclaration(this);
		}
	}
}


export class FunctionBodyContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionBody;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionBody) {
	 		listener.enterFunctionBody(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionBody) {
	 		listener.exitFunctionBody(this);
		}
	}
}


export class VariableDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_variableDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterVariableDeclaration) {
	 		listener.enterVariableDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitVariableDeclaration) {
	 		listener.exitVariableDeclaration(this);
		}
	}
}


export class MultiVariableDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public variableDeclaration_list(): VariableDeclarationContext[] {
		return this.getTypedRuleContexts(VariableDeclarationContext) as VariableDeclarationContext[];
	}
	public variableDeclaration(i: number): VariableDeclarationContext {
		return this.getTypedRuleContext(VariableDeclarationContext, i) as VariableDeclarationContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiVariableDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiVariableDeclaration) {
	 		listener.enterMultiVariableDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiVariableDeclaration) {
	 		listener.exitMultiVariableDeclaration(this);
		}
	}
}


export class PropertyDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VAL(): TerminalNode {
		return this.getToken(KotlinParser.VAL, 0);
	}
	public VAR(): TerminalNode {
		return this.getToken(KotlinParser.VAR, 0);
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public typeParameters(): TypeParametersContext {
		return this.getTypedRuleContext(TypeParametersContext, 0) as TypeParametersContext;
	}
	public receiverType(): ReceiverTypeContext {
		return this.getTypedRuleContext(ReceiverTypeContext, 0) as ReceiverTypeContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
	public typeConstraints(): TypeConstraintsContext {
		return this.getTypedRuleContext(TypeConstraintsContext, 0) as TypeConstraintsContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(KotlinParser.SEMICOLON, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public multiVariableDeclaration(): MultiVariableDeclarationContext {
		return this.getTypedRuleContext(MultiVariableDeclarationContext, 0) as MultiVariableDeclarationContext;
	}
	public variableDeclaration(): VariableDeclarationContext {
		return this.getTypedRuleContext(VariableDeclarationContext, 0) as VariableDeclarationContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public propertyDelegate(): PropertyDelegateContext {
		return this.getTypedRuleContext(PropertyDelegateContext, 0) as PropertyDelegateContext;
	}
	public getter(): GetterContext {
		return this.getTypedRuleContext(GetterContext, 0) as GetterContext;
	}
	public setter(): SetterContext {
		return this.getTypedRuleContext(SetterContext, 0) as SetterContext;
	}
	public semi(): SemiContext {
		return this.getTypedRuleContext(SemiContext, 0) as SemiContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_propertyDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPropertyDeclaration) {
	 		listener.enterPropertyDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPropertyDeclaration) {
	 		listener.exitPropertyDeclaration(this);
		}
	}
}


export class PropertyDelegateContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BY(): TerminalNode {
		return this.getToken(KotlinParser.BY, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_propertyDelegate;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPropertyDelegate) {
	 		listener.enterPropertyDelegate(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPropertyDelegate) {
	 		listener.exitPropertyDelegate(this);
		}
	}
}


export class GetterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GET(): TerminalNode {
		return this.getToken(KotlinParser.GET, 0);
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public functionBody(): FunctionBodyContext {
		return this.getTypedRuleContext(FunctionBodyContext, 0) as FunctionBodyContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_getter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterGetter) {
	 		listener.enterGetter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitGetter) {
	 		listener.exitGetter(this);
		}
	}
}


export class SetterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SET(): TerminalNode {
		return this.getToken(KotlinParser.SET, 0);
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public functionValueParameterWithOptionalType(): FunctionValueParameterWithOptionalTypeContext {
		return this.getTypedRuleContext(FunctionValueParameterWithOptionalTypeContext, 0) as FunctionValueParameterWithOptionalTypeContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public functionBody(): FunctionBodyContext {
		return this.getTypedRuleContext(FunctionBodyContext, 0) as FunctionBodyContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COMMA(): TerminalNode {
		return this.getToken(KotlinParser.COMMA, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_setter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSetter) {
	 		listener.enterSetter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSetter) {
	 		listener.exitSetter(this);
		}
	}
}


export class ParametersWithOptionalTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public functionValueParameterWithOptionalType_list(): FunctionValueParameterWithOptionalTypeContext[] {
		return this.getTypedRuleContexts(FunctionValueParameterWithOptionalTypeContext) as FunctionValueParameterWithOptionalTypeContext[];
	}
	public functionValueParameterWithOptionalType(i: number): FunctionValueParameterWithOptionalTypeContext {
		return this.getTypedRuleContext(FunctionValueParameterWithOptionalTypeContext, i) as FunctionValueParameterWithOptionalTypeContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parametersWithOptionalType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParametersWithOptionalType) {
	 		listener.enterParametersWithOptionalType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParametersWithOptionalType) {
	 		listener.exitParametersWithOptionalType(this);
		}
	}
}


export class FunctionValueParameterWithOptionalTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public parameterWithOptionalType(): ParameterWithOptionalTypeContext {
		return this.getTypedRuleContext(ParameterWithOptionalTypeContext, 0) as ParameterWithOptionalTypeContext;
	}
	public parameterModifiers(): ParameterModifiersContext {
		return this.getTypedRuleContext(ParameterModifiersContext, 0) as ParameterModifiersContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionValueParameterWithOptionalType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionValueParameterWithOptionalType) {
	 		listener.enterFunctionValueParameterWithOptionalType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionValueParameterWithOptionalType) {
	 		listener.exitFunctionValueParameterWithOptionalType(this);
		}
	}
}


export class ParameterWithOptionalTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parameterWithOptionalType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParameterWithOptionalType) {
	 		listener.enterParameterWithOptionalType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParameterWithOptionalType) {
	 		listener.exitParameterWithOptionalType(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parameter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParameter) {
	 		listener.enterParameter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParameter) {
	 		listener.exitParameter(this);
		}
	}
}


export class ObjectDeclarationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OBJECT(): TerminalNode {
		return this.getToken(KotlinParser.OBJECT, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public delegationSpecifiers(): DelegationSpecifiersContext {
		return this.getTypedRuleContext(DelegationSpecifiersContext, 0) as DelegationSpecifiersContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_objectDeclaration;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterObjectDeclaration) {
	 		listener.enterObjectDeclaration(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitObjectDeclaration) {
	 		listener.exitObjectDeclaration(this);
		}
	}
}


export class SecondaryConstructorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CONSTRUCTOR(): TerminalNode {
		return this.getToken(KotlinParser.CONSTRUCTOR, 0);
	}
	public functionValueParameters(): FunctionValueParametersContext {
		return this.getTypedRuleContext(FunctionValueParametersContext, 0) as FunctionValueParametersContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public constructorDelegationCall(): ConstructorDelegationCallContext {
		return this.getTypedRuleContext(ConstructorDelegationCallContext, 0) as ConstructorDelegationCallContext;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_secondaryConstructor;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSecondaryConstructor) {
	 		listener.enterSecondaryConstructor(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSecondaryConstructor) {
	 		listener.exitSecondaryConstructor(this);
		}
	}
}


export class ConstructorDelegationCallContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public valueArguments(): ValueArgumentsContext {
		return this.getTypedRuleContext(ValueArgumentsContext, 0) as ValueArgumentsContext;
	}
	public THIS(): TerminalNode {
		return this.getToken(KotlinParser.THIS, 0);
	}
	public SUPER(): TerminalNode {
		return this.getToken(KotlinParser.SUPER, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_constructorDelegationCall;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterConstructorDelegationCall) {
	 		listener.enterConstructorDelegationCall(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitConstructorDelegationCall) {
	 		listener.exitConstructorDelegationCall(this);
		}
	}
}


export class EnumClassBodyContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LCURL(): TerminalNode {
		return this.getToken(KotlinParser.LCURL, 0);
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public enumEntries(): EnumEntriesContext {
		return this.getTypedRuleContext(EnumEntriesContext, 0) as EnumEntriesContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(KotlinParser.SEMICOLON, 0);
	}
	public classMemberDeclarations(): ClassMemberDeclarationsContext {
		return this.getTypedRuleContext(ClassMemberDeclarationsContext, 0) as ClassMemberDeclarationsContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_enumClassBody;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterEnumClassBody) {
	 		listener.enterEnumClassBody(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitEnumClassBody) {
	 		listener.exitEnumClassBody(this);
		}
	}
}


export class EnumEntriesContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public enumEntry_list(): EnumEntryContext[] {
		return this.getTypedRuleContexts(EnumEntryContext) as EnumEntryContext[];
	}
	public enumEntry(i: number): EnumEntryContext {
		return this.getTypedRuleContext(EnumEntryContext, i) as EnumEntryContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_enumEntries;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterEnumEntries) {
	 		listener.enterEnumEntries(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitEnumEntries) {
	 		listener.exitEnumEntries(this);
		}
	}
}


export class EnumEntryContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public modifiers(): ModifiersContext {
		return this.getTypedRuleContext(ModifiersContext, 0) as ModifiersContext;
	}
	public valueArguments(): ValueArgumentsContext {
		return this.getTypedRuleContext(ValueArgumentsContext, 0) as ValueArgumentsContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_enumEntry;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterEnumEntry) {
	 		listener.enterEnumEntry(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitEnumEntry) {
	 		listener.exitEnumEntry(this);
		}
	}
}


export class TypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public functionType(): FunctionTypeContext {
		return this.getTypedRuleContext(FunctionTypeContext, 0) as FunctionTypeContext;
	}
	public parenthesizedType(): ParenthesizedTypeContext {
		return this.getTypedRuleContext(ParenthesizedTypeContext, 0) as ParenthesizedTypeContext;
	}
	public nullableType(): NullableTypeContext {
		return this.getTypedRuleContext(NullableTypeContext, 0) as NullableTypeContext;
	}
	public typeReference(): TypeReferenceContext {
		return this.getTypedRuleContext(TypeReferenceContext, 0) as TypeReferenceContext;
	}
	public definitelyNonNullableType(): DefinitelyNonNullableTypeContext {
		return this.getTypedRuleContext(DefinitelyNonNullableTypeContext, 0) as DefinitelyNonNullableTypeContext;
	}
	public typeModifiers(): TypeModifiersContext {
		return this.getTypedRuleContext(TypeModifiersContext, 0) as TypeModifiersContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_type;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterType) {
	 		listener.enterType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitType) {
	 		listener.exitType(this);
		}
	}
}


export class TypeReferenceContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public userType(): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, 0) as UserTypeContext;
	}
	public DYNAMIC(): TerminalNode {
		return this.getToken(KotlinParser.DYNAMIC, 0);
	}
	public AnyType(): TerminalNode {
		return this.getToken(KotlinParser.AnyType, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeReference;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeReference) {
	 		listener.enterTypeReference(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeReference) {
	 		listener.exitTypeReference(this);
		}
	}
}


export class NullableTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeReference(): TypeReferenceContext {
		return this.getTypedRuleContext(TypeReferenceContext, 0) as TypeReferenceContext;
	}
	public parenthesizedType(): ParenthesizedTypeContext {
		return this.getTypedRuleContext(ParenthesizedTypeContext, 0) as ParenthesizedTypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public quest_list(): QuestContext[] {
		return this.getTypedRuleContexts(QuestContext) as QuestContext[];
	}
	public quest(i: number): QuestContext {
		return this.getTypedRuleContext(QuestContext, i) as QuestContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_nullableType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterNullableType) {
	 		listener.enterNullableType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitNullableType) {
	 		listener.exitNullableType(this);
		}
	}
}


export class QuestContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUEST_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.QUEST_NO_WS, 0);
	}
	public QUEST_WS(): TerminalNode {
		return this.getToken(KotlinParser.QUEST_WS, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_quest;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterQuest) {
	 		listener.enterQuest(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitQuest) {
	 		listener.exitQuest(this);
		}
	}
}


export class UserTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleUserType_list(): SimpleUserTypeContext[] {
		return this.getTypedRuleContexts(SimpleUserTypeContext) as SimpleUserTypeContext[];
	}
	public simpleUserType(i: number): SimpleUserTypeContext {
		return this.getTypedRuleContext(SimpleUserTypeContext, i) as SimpleUserTypeContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(KotlinParser.DOT, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_userType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterUserType) {
	 		listener.enterUserType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitUserType) {
	 		listener.exitUserType(this);
		}
	}
}


export class SimpleUserTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_simpleUserType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSimpleUserType) {
	 		listener.enterSimpleUserType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSimpleUserType) {
	 		listener.exitSimpleUserType(this);
		}
	}
}


export class TypeProjectionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public typeProjectionModifiers(): TypeProjectionModifiersContext {
		return this.getTypedRuleContext(TypeProjectionModifiersContext, 0) as TypeProjectionModifiersContext;
	}
	public MULT(): TerminalNode {
		return this.getToken(KotlinParser.MULT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeProjection;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeProjection) {
	 		listener.enterTypeProjection(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeProjection) {
	 		listener.exitTypeProjection(this);
		}
	}
}


export class TypeProjectionModifiersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeProjectionModifier_list(): TypeProjectionModifierContext[] {
		return this.getTypedRuleContexts(TypeProjectionModifierContext) as TypeProjectionModifierContext[];
	}
	public typeProjectionModifier(i: number): TypeProjectionModifierContext {
		return this.getTypedRuleContext(TypeProjectionModifierContext, i) as TypeProjectionModifierContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeProjectionModifiers;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeProjectionModifiers) {
	 		listener.enterTypeProjectionModifiers(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeProjectionModifiers) {
	 		listener.exitTypeProjectionModifiers(this);
		}
	}
}


export class TypeProjectionModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public varianceModifier(): VarianceModifierContext {
		return this.getTypedRuleContext(VarianceModifierContext, 0) as VarianceModifierContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeProjectionModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeProjectionModifier) {
	 		listener.enterTypeProjectionModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeProjectionModifier) {
	 		listener.exitTypeProjectionModifier(this);
		}
	}
}


export class FunctionTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public functionTypeParameters(): FunctionTypeParametersContext {
		return this.getTypedRuleContext(FunctionTypeParametersContext, 0) as FunctionTypeParametersContext;
	}
	public ARROW(): TerminalNode {
		return this.getToken(KotlinParser.ARROW, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public receiverType(): ReceiverTypeContext {
		return this.getTypedRuleContext(ReceiverTypeContext, 0) as ReceiverTypeContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionType) {
	 		listener.enterFunctionType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionType) {
	 		listener.exitFunctionType(this);
		}
	}
}


export class FunctionTypeParametersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public parameter_list(): ParameterContext[] {
		return this.getTypedRuleContexts(ParameterContext) as ParameterContext[];
	}
	public parameter(i: number): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, i) as ParameterContext;
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionTypeParameters;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionTypeParameters) {
	 		listener.enterFunctionTypeParameters(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionTypeParameters) {
	 		listener.exitFunctionTypeParameters(this);
		}
	}
}


export class ParenthesizedTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parenthesizedType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParenthesizedType) {
	 		listener.enterParenthesizedType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParenthesizedType) {
	 		listener.exitParenthesizedType(this);
		}
	}
}


export class ReceiverTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public parenthesizedType(): ParenthesizedTypeContext {
		return this.getTypedRuleContext(ParenthesizedTypeContext, 0) as ParenthesizedTypeContext;
	}
	public nullableType(): NullableTypeContext {
		return this.getTypedRuleContext(NullableTypeContext, 0) as NullableTypeContext;
	}
	public typeReference(): TypeReferenceContext {
		return this.getTypedRuleContext(TypeReferenceContext, 0) as TypeReferenceContext;
	}
	public typeModifiers(): TypeModifiersContext {
		return this.getTypedRuleContext(TypeModifiersContext, 0) as TypeModifiersContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_receiverType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterReceiverType) {
	 		listener.enterReceiverType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitReceiverType) {
	 		listener.exitReceiverType(this);
		}
	}
}


export class ParenthesizedUserTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public userType(): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, 0) as UserTypeContext;
	}
	public parenthesizedUserType(): ParenthesizedUserTypeContext {
		return this.getTypedRuleContext(ParenthesizedUserTypeContext, 0) as ParenthesizedUserTypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parenthesizedUserType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParenthesizedUserType) {
	 		listener.enterParenthesizedUserType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParenthesizedUserType) {
	 		listener.exitParenthesizedUserType(this);
		}
	}
}


export class DefinitelyNonNullableTypeContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AMP(): TerminalNode {
		return this.getToken(KotlinParser.AMP, 0);
	}
	public userType_list(): UserTypeContext[] {
		return this.getTypedRuleContexts(UserTypeContext) as UserTypeContext[];
	}
	public userType(i: number): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, i) as UserTypeContext;
	}
	public parenthesizedUserType_list(): ParenthesizedUserTypeContext[] {
		return this.getTypedRuleContexts(ParenthesizedUserTypeContext) as ParenthesizedUserTypeContext[];
	}
	public parenthesizedUserType(i: number): ParenthesizedUserTypeContext {
		return this.getTypedRuleContext(ParenthesizedUserTypeContext, i) as ParenthesizedUserTypeContext;
	}
	public typeModifiers_list(): TypeModifiersContext[] {
		return this.getTypedRuleContexts(TypeModifiersContext) as TypeModifiersContext[];
	}
	public typeModifiers(i: number): TypeModifiersContext {
		return this.getTypedRuleContext(TypeModifiersContext, i) as TypeModifiersContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_definitelyNonNullableType;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDefinitelyNonNullableType) {
	 		listener.enterDefinitelyNonNullableType(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDefinitelyNonNullableType) {
	 		listener.exitDefinitelyNonNullableType(this);
		}
	}
}


export class StatementsContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public statement_list(): StatementContext[] {
		return this.getTypedRuleContexts(StatementContext) as StatementContext[];
	}
	public statement(i: number): StatementContext {
		return this.getTypedRuleContext(StatementContext, i) as StatementContext;
	}
	public semis_list(): SemisContext[] {
		return this.getTypedRuleContexts(SemisContext) as SemisContext[];
	}
	public semis(i: number): SemisContext {
		return this.getTypedRuleContext(SemisContext, i) as SemisContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_statements;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterStatements) {
	 		listener.enterStatements(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitStatements) {
	 		listener.exitStatements(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public declaration(): DeclarationContext {
		return this.getTypedRuleContext(DeclarationContext, 0) as DeclarationContext;
	}
	public assignment(): AssignmentContext {
		return this.getTypedRuleContext(AssignmentContext, 0) as AssignmentContext;
	}
	public loopStatement(): LoopStatementContext {
		return this.getTypedRuleContext(LoopStatementContext, 0) as LoopStatementContext;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public label_list(): LabelContext[] {
		return this.getTypedRuleContexts(LabelContext) as LabelContext[];
	}
	public label(i: number): LabelContext {
		return this.getTypedRuleContext(LabelContext, i) as LabelContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_statement;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterStatement) {
	 		listener.enterStatement(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitStatement) {
	 		listener.exitStatement(this);
		}
	}
}


export class LabelContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public AT_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_NO_WS, 0);
	}
	public AT_POST_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_POST_WS, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_label;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLabel) {
	 		listener.enterLabel(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLabel) {
	 		listener.exitLabel(this);
		}
	}
}


export class ControlStructureBodyContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public statement(): StatementContext {
		return this.getTypedRuleContext(StatementContext, 0) as StatementContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_controlStructureBody;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterControlStructureBody) {
	 		listener.enterControlStructureBody(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitControlStructureBody) {
	 		listener.exitControlStructureBody(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LCURL(): TerminalNode {
		return this.getToken(KotlinParser.LCURL, 0);
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public statements(): StatementsContext {
		return this.getTypedRuleContext(StatementsContext, 0) as StatementsContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_block;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterBlock) {
	 		listener.enterBlock(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitBlock) {
	 		listener.exitBlock(this);
		}
	}
}


export class LoopStatementContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public forStatement(): ForStatementContext {
		return this.getTypedRuleContext(ForStatementContext, 0) as ForStatementContext;
	}
	public whileStatement(): WhileStatementContext {
		return this.getTypedRuleContext(WhileStatementContext, 0) as WhileStatementContext;
	}
	public doWhileStatement(): DoWhileStatementContext {
		return this.getTypedRuleContext(DoWhileStatementContext, 0) as DoWhileStatementContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_loopStatement;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLoopStatement) {
	 		listener.enterLoopStatement(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLoopStatement) {
	 		listener.exitLoopStatement(this);
		}
	}
}


export class ForStatementContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FOR(): TerminalNode {
		return this.getToken(KotlinParser.FOR, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(KotlinParser.IN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public variableDeclaration(): VariableDeclarationContext {
		return this.getTypedRuleContext(VariableDeclarationContext, 0) as VariableDeclarationContext;
	}
	public multiVariableDeclaration(): MultiVariableDeclarationContext {
		return this.getTypedRuleContext(MultiVariableDeclarationContext, 0) as MultiVariableDeclarationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public controlStructureBody(): ControlStructureBodyContext {
		return this.getTypedRuleContext(ControlStructureBodyContext, 0) as ControlStructureBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_forStatement;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterForStatement) {
	 		listener.enterForStatement(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitForStatement) {
	 		listener.exitForStatement(this);
		}
	}
}


export class WhileStatementContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHILE(): TerminalNode {
		return this.getToken(KotlinParser.WHILE, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public controlStructureBody(): ControlStructureBodyContext {
		return this.getTypedRuleContext(ControlStructureBodyContext, 0) as ControlStructureBodyContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(KotlinParser.SEMICOLON, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_whileStatement;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterWhileStatement) {
	 		listener.enterWhileStatement(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitWhileStatement) {
	 		listener.exitWhileStatement(this);
		}
	}
}


export class DoWhileStatementContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DO(): TerminalNode {
		return this.getToken(KotlinParser.DO, 0);
	}
	public WHILE(): TerminalNode {
		return this.getToken(KotlinParser.WHILE, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public controlStructureBody(): ControlStructureBodyContext {
		return this.getTypedRuleContext(ControlStructureBodyContext, 0) as ControlStructureBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_doWhileStatement;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDoWhileStatement) {
	 		listener.enterDoWhileStatement(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDoWhileStatement) {
	 		listener.exitDoWhileStatement(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public directlyAssignableExpression(): DirectlyAssignableExpressionContext {
		return this.getTypedRuleContext(DirectlyAssignableExpressionContext, 0) as DirectlyAssignableExpressionContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public assignableExpression(): AssignableExpressionContext {
		return this.getTypedRuleContext(AssignableExpressionContext, 0) as AssignableExpressionContext;
	}
	public assignmentAndOperator(): AssignmentAndOperatorContext {
		return this.getTypedRuleContext(AssignmentAndOperatorContext, 0) as AssignmentAndOperatorContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_assignment;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAssignment) {
	 		listener.enterAssignment(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAssignment) {
	 		listener.exitAssignment(this);
		}
	}
}


export class SemiContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(KotlinParser.SEMICOLON, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_semi;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSemi) {
	 		listener.enterSemi(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSemi) {
	 		listener.exitSemi(this);
		}
	}
}


export class SemisContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SEMICOLON_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.SEMICOLON);
	}
	public SEMICOLON(i: number): TerminalNode {
		return this.getToken(KotlinParser.SEMICOLON, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_semis;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSemis) {
	 		listener.enterSemis(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSemis) {
	 		listener.exitSemis(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public disjunction(): DisjunctionContext {
		return this.getTypedRuleContext(DisjunctionContext, 0) as DisjunctionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_expression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterExpression) {
	 		listener.enterExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitExpression) {
	 		listener.exitExpression(this);
		}
	}
}


export class DisjunctionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public conjunction_list(): ConjunctionContext[] {
		return this.getTypedRuleContexts(ConjunctionContext) as ConjunctionContext[];
	}
	public conjunction(i: number): ConjunctionContext {
		return this.getTypedRuleContext(ConjunctionContext, i) as ConjunctionContext;
	}
	public DISJ_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.DISJ);
	}
	public DISJ(i: number): TerminalNode {
		return this.getToken(KotlinParser.DISJ, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_disjunction;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDisjunction) {
	 		listener.enterDisjunction(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDisjunction) {
	 		listener.exitDisjunction(this);
		}
	}
}


export class ConjunctionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public equality_list(): EqualityContext[] {
		return this.getTypedRuleContexts(EqualityContext) as EqualityContext[];
	}
	public equality(i: number): EqualityContext {
		return this.getTypedRuleContext(EqualityContext, i) as EqualityContext;
	}
	public CONJ_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.CONJ);
	}
	public CONJ(i: number): TerminalNode {
		return this.getToken(KotlinParser.CONJ, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_conjunction;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterConjunction) {
	 		listener.enterConjunction(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitConjunction) {
	 		listener.exitConjunction(this);
		}
	}
}


export class EqualityContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public comparison_list(): ComparisonContext[] {
		return this.getTypedRuleContexts(ComparisonContext) as ComparisonContext[];
	}
	public comparison(i: number): ComparisonContext {
		return this.getTypedRuleContext(ComparisonContext, i) as ComparisonContext;
	}
	public equalityOperator_list(): EqualityOperatorContext[] {
		return this.getTypedRuleContexts(EqualityOperatorContext) as EqualityOperatorContext[];
	}
	public equalityOperator(i: number): EqualityOperatorContext {
		return this.getTypedRuleContext(EqualityOperatorContext, i) as EqualityOperatorContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_equality;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterEquality) {
	 		listener.enterEquality(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitEquality) {
	 		listener.exitEquality(this);
		}
	}
}


export class ComparisonContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public genericCallLikeComparison_list(): GenericCallLikeComparisonContext[] {
		return this.getTypedRuleContexts(GenericCallLikeComparisonContext) as GenericCallLikeComparisonContext[];
	}
	public genericCallLikeComparison(i: number): GenericCallLikeComparisonContext {
		return this.getTypedRuleContext(GenericCallLikeComparisonContext, i) as GenericCallLikeComparisonContext;
	}
	public comparisonOperator_list(): ComparisonOperatorContext[] {
		return this.getTypedRuleContexts(ComparisonOperatorContext) as ComparisonOperatorContext[];
	}
	public comparisonOperator(i: number): ComparisonOperatorContext {
		return this.getTypedRuleContext(ComparisonOperatorContext, i) as ComparisonOperatorContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_comparison;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterComparison) {
	 		listener.enterComparison(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitComparison) {
	 		listener.exitComparison(this);
		}
	}
}


export class GenericCallLikeComparisonContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public infixOperation(): InfixOperationContext {
		return this.getTypedRuleContext(InfixOperationContext, 0) as InfixOperationContext;
	}
	public callSuffix_list(): CallSuffixContext[] {
		return this.getTypedRuleContexts(CallSuffixContext) as CallSuffixContext[];
	}
	public callSuffix(i: number): CallSuffixContext {
		return this.getTypedRuleContext(CallSuffixContext, i) as CallSuffixContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_genericCallLikeComparison;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterGenericCallLikeComparison) {
	 		listener.enterGenericCallLikeComparison(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitGenericCallLikeComparison) {
	 		listener.exitGenericCallLikeComparison(this);
		}
	}
}


export class InfixOperationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public elvisExpression_list(): ElvisExpressionContext[] {
		return this.getTypedRuleContexts(ElvisExpressionContext) as ElvisExpressionContext[];
	}
	public elvisExpression(i: number): ElvisExpressionContext {
		return this.getTypedRuleContext(ElvisExpressionContext, i) as ElvisExpressionContext;
	}
	public inOperator_list(): InOperatorContext[] {
		return this.getTypedRuleContexts(InOperatorContext) as InOperatorContext[];
	}
	public inOperator(i: number): InOperatorContext {
		return this.getTypedRuleContext(InOperatorContext, i) as InOperatorContext;
	}
	public isOperator_list(): IsOperatorContext[] {
		return this.getTypedRuleContexts(IsOperatorContext) as IsOperatorContext[];
	}
	public isOperator(i: number): IsOperatorContext {
		return this.getTypedRuleContext(IsOperatorContext, i) as IsOperatorContext;
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_infixOperation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterInfixOperation) {
	 		listener.enterInfixOperation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitInfixOperation) {
	 		listener.exitInfixOperation(this);
		}
	}
}


export class ElvisExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public infixFunctionCall_list(): InfixFunctionCallContext[] {
		return this.getTypedRuleContexts(InfixFunctionCallContext) as InfixFunctionCallContext[];
	}
	public infixFunctionCall(i: number): InfixFunctionCallContext {
		return this.getTypedRuleContext(InfixFunctionCallContext, i) as InfixFunctionCallContext;
	}
	public elvis_list(): ElvisContext[] {
		return this.getTypedRuleContexts(ElvisContext) as ElvisContext[];
	}
	public elvis(i: number): ElvisContext {
		return this.getTypedRuleContext(ElvisContext, i) as ElvisContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_elvisExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterElvisExpression) {
	 		listener.enterElvisExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitElvisExpression) {
	 		listener.exitElvisExpression(this);
		}
	}
}


export class ElvisContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUEST_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.QUEST_NO_WS, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_elvis;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterElvis) {
	 		listener.enterElvis(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitElvis) {
	 		listener.exitElvis(this);
		}
	}
}


export class InfixFunctionCallContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public rangeExpression_list(): RangeExpressionContext[] {
		return this.getTypedRuleContexts(RangeExpressionContext) as RangeExpressionContext[];
	}
	public rangeExpression(i: number): RangeExpressionContext {
		return this.getTypedRuleContext(RangeExpressionContext, i) as RangeExpressionContext;
	}
	public simpleIdentifier_list(): SimpleIdentifierContext[] {
		return this.getTypedRuleContexts(SimpleIdentifierContext) as SimpleIdentifierContext[];
	}
	public simpleIdentifier(i: number): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, i) as SimpleIdentifierContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_infixFunctionCall;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterInfixFunctionCall) {
	 		listener.enterInfixFunctionCall(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitInfixFunctionCall) {
	 		listener.exitInfixFunctionCall(this);
		}
	}
}


export class RangeExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public additiveExpression_list(): AdditiveExpressionContext[] {
		return this.getTypedRuleContexts(AdditiveExpressionContext) as AdditiveExpressionContext[];
	}
	public additiveExpression(i: number): AdditiveExpressionContext {
		return this.getTypedRuleContext(AdditiveExpressionContext, i) as AdditiveExpressionContext;
	}
	public RANGE_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.RANGE);
	}
	public RANGE(i: number): TerminalNode {
		return this.getToken(KotlinParser.RANGE, i);
	}
	public RANGE_UNTIL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.RANGE_UNTIL);
	}
	public RANGE_UNTIL(i: number): TerminalNode {
		return this.getToken(KotlinParser.RANGE_UNTIL, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_rangeExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterRangeExpression) {
	 		listener.enterRangeExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitRangeExpression) {
	 		listener.exitRangeExpression(this);
		}
	}
}


export class AdditiveExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public multiplicativeExpression_list(): MultiplicativeExpressionContext[] {
		return this.getTypedRuleContexts(MultiplicativeExpressionContext) as MultiplicativeExpressionContext[];
	}
	public multiplicativeExpression(i: number): MultiplicativeExpressionContext {
		return this.getTypedRuleContext(MultiplicativeExpressionContext, i) as MultiplicativeExpressionContext;
	}
	public additiveOperator_list(): AdditiveOperatorContext[] {
		return this.getTypedRuleContexts(AdditiveOperatorContext) as AdditiveOperatorContext[];
	}
	public additiveOperator(i: number): AdditiveOperatorContext {
		return this.getTypedRuleContext(AdditiveOperatorContext, i) as AdditiveOperatorContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_additiveExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAdditiveExpression) {
	 		listener.enterAdditiveExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAdditiveExpression) {
	 		listener.exitAdditiveExpression(this);
		}
	}
}


export class MultiplicativeExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public asExpression_list(): AsExpressionContext[] {
		return this.getTypedRuleContexts(AsExpressionContext) as AsExpressionContext[];
	}
	public asExpression(i: number): AsExpressionContext {
		return this.getTypedRuleContext(AsExpressionContext, i) as AsExpressionContext;
	}
	public multiplicativeOperator_list(): MultiplicativeOperatorContext[] {
		return this.getTypedRuleContexts(MultiplicativeOperatorContext) as MultiplicativeOperatorContext[];
	}
	public multiplicativeOperator(i: number): MultiplicativeOperatorContext {
		return this.getTypedRuleContext(MultiplicativeOperatorContext, i) as MultiplicativeOperatorContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiplicativeExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiplicativeExpression) {
	 		listener.enterMultiplicativeExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiplicativeExpression) {
	 		listener.exitMultiplicativeExpression(this);
		}
	}
}


export class AsExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public prefixUnaryExpression(): PrefixUnaryExpressionContext {
		return this.getTypedRuleContext(PrefixUnaryExpressionContext, 0) as PrefixUnaryExpressionContext;
	}
	public asOperator_list(): AsOperatorContext[] {
		return this.getTypedRuleContexts(AsOperatorContext) as AsOperatorContext[];
	}
	public asOperator(i: number): AsOperatorContext {
		return this.getTypedRuleContext(AsOperatorContext, i) as AsOperatorContext;
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_asExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAsExpression) {
	 		listener.enterAsExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAsExpression) {
	 		listener.exitAsExpression(this);
		}
	}
}


export class PrefixUnaryExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public postfixUnaryExpression(): PostfixUnaryExpressionContext {
		return this.getTypedRuleContext(PostfixUnaryExpressionContext, 0) as PostfixUnaryExpressionContext;
	}
	public unaryPrefix_list(): UnaryPrefixContext[] {
		return this.getTypedRuleContexts(UnaryPrefixContext) as UnaryPrefixContext[];
	}
	public unaryPrefix(i: number): UnaryPrefixContext {
		return this.getTypedRuleContext(UnaryPrefixContext, i) as UnaryPrefixContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_prefixUnaryExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPrefixUnaryExpression) {
	 		listener.enterPrefixUnaryExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPrefixUnaryExpression) {
	 		listener.exitPrefixUnaryExpression(this);
		}
	}
}


export class UnaryPrefixContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public label(): LabelContext {
		return this.getTypedRuleContext(LabelContext, 0) as LabelContext;
	}
	public prefixUnaryOperator(): PrefixUnaryOperatorContext {
		return this.getTypedRuleContext(PrefixUnaryOperatorContext, 0) as PrefixUnaryOperatorContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_unaryPrefix;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterUnaryPrefix) {
	 		listener.enterUnaryPrefix(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitUnaryPrefix) {
	 		listener.exitUnaryPrefix(this);
		}
	}
}


export class PostfixUnaryExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public postfixUnarySuffix_list(): PostfixUnarySuffixContext[] {
		return this.getTypedRuleContexts(PostfixUnarySuffixContext) as PostfixUnarySuffixContext[];
	}
	public postfixUnarySuffix(i: number): PostfixUnarySuffixContext {
		return this.getTypedRuleContext(PostfixUnarySuffixContext, i) as PostfixUnarySuffixContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_postfixUnaryExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPostfixUnaryExpression) {
	 		listener.enterPostfixUnaryExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPostfixUnaryExpression) {
	 		listener.exitPostfixUnaryExpression(this);
		}
	}
}


export class PostfixUnarySuffixContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public postfixUnaryOperator(): PostfixUnaryOperatorContext {
		return this.getTypedRuleContext(PostfixUnaryOperatorContext, 0) as PostfixUnaryOperatorContext;
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
	public callSuffix(): CallSuffixContext {
		return this.getTypedRuleContext(CallSuffixContext, 0) as CallSuffixContext;
	}
	public indexingSuffix(): IndexingSuffixContext {
		return this.getTypedRuleContext(IndexingSuffixContext, 0) as IndexingSuffixContext;
	}
	public navigationSuffix(): NavigationSuffixContext {
		return this.getTypedRuleContext(NavigationSuffixContext, 0) as NavigationSuffixContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_postfixUnarySuffix;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPostfixUnarySuffix) {
	 		listener.enterPostfixUnarySuffix(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPostfixUnarySuffix) {
	 		listener.exitPostfixUnarySuffix(this);
		}
	}
}


export class DirectlyAssignableExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public postfixUnaryExpression(): PostfixUnaryExpressionContext {
		return this.getTypedRuleContext(PostfixUnaryExpressionContext, 0) as PostfixUnaryExpressionContext;
	}
	public assignableSuffix(): AssignableSuffixContext {
		return this.getTypedRuleContext(AssignableSuffixContext, 0) as AssignableSuffixContext;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public parenthesizedDirectlyAssignableExpression(): ParenthesizedDirectlyAssignableExpressionContext {
		return this.getTypedRuleContext(ParenthesizedDirectlyAssignableExpressionContext, 0) as ParenthesizedDirectlyAssignableExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_directlyAssignableExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterDirectlyAssignableExpression) {
	 		listener.enterDirectlyAssignableExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitDirectlyAssignableExpression) {
	 		listener.exitDirectlyAssignableExpression(this);
		}
	}
}


export class ParenthesizedDirectlyAssignableExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public directlyAssignableExpression(): DirectlyAssignableExpressionContext {
		return this.getTypedRuleContext(DirectlyAssignableExpressionContext, 0) as DirectlyAssignableExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parenthesizedDirectlyAssignableExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParenthesizedDirectlyAssignableExpression) {
	 		listener.enterParenthesizedDirectlyAssignableExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParenthesizedDirectlyAssignableExpression) {
	 		listener.exitParenthesizedDirectlyAssignableExpression(this);
		}
	}
}


export class AssignableExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public prefixUnaryExpression(): PrefixUnaryExpressionContext {
		return this.getTypedRuleContext(PrefixUnaryExpressionContext, 0) as PrefixUnaryExpressionContext;
	}
	public parenthesizedAssignableExpression(): ParenthesizedAssignableExpressionContext {
		return this.getTypedRuleContext(ParenthesizedAssignableExpressionContext, 0) as ParenthesizedAssignableExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_assignableExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAssignableExpression) {
	 		listener.enterAssignableExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAssignableExpression) {
	 		listener.exitAssignableExpression(this);
		}
	}
}


export class ParenthesizedAssignableExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public assignableExpression(): AssignableExpressionContext {
		return this.getTypedRuleContext(AssignableExpressionContext, 0) as AssignableExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parenthesizedAssignableExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParenthesizedAssignableExpression) {
	 		listener.enterParenthesizedAssignableExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParenthesizedAssignableExpression) {
	 		listener.exitParenthesizedAssignableExpression(this);
		}
	}
}


export class AssignableSuffixContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
	public indexingSuffix(): IndexingSuffixContext {
		return this.getTypedRuleContext(IndexingSuffixContext, 0) as IndexingSuffixContext;
	}
	public navigationSuffix(): NavigationSuffixContext {
		return this.getTypedRuleContext(NavigationSuffixContext, 0) as NavigationSuffixContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_assignableSuffix;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAssignableSuffix) {
	 		listener.enterAssignableSuffix(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAssignableSuffix) {
	 		listener.exitAssignableSuffix(this);
		}
	}
}


export class IndexingSuffixContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.LSQUARE, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.RSQUARE, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_indexingSuffix;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterIndexingSuffix) {
	 		listener.enterIndexingSuffix(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitIndexingSuffix) {
	 		listener.exitIndexingSuffix(this);
		}
	}
}


export class NavigationSuffixContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public memberAccessOperator(): MemberAccessOperatorContext {
		return this.getTypedRuleContext(MemberAccessOperatorContext, 0) as MemberAccessOperatorContext;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public parenthesizedExpression(): ParenthesizedExpressionContext {
		return this.getTypedRuleContext(ParenthesizedExpressionContext, 0) as ParenthesizedExpressionContext;
	}
	public CLASS(): TerminalNode {
		return this.getToken(KotlinParser.CLASS, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_navigationSuffix;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterNavigationSuffix) {
	 		listener.enterNavigationSuffix(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitNavigationSuffix) {
	 		listener.exitNavigationSuffix(this);
		}
	}
}


export class CallSuffixContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotatedLambda(): AnnotatedLambdaContext {
		return this.getTypedRuleContext(AnnotatedLambdaContext, 0) as AnnotatedLambdaContext;
	}
	public valueArguments(): ValueArgumentsContext {
		return this.getTypedRuleContext(ValueArgumentsContext, 0) as ValueArgumentsContext;
	}
	public typeArguments(): TypeArgumentsContext {
		return this.getTypedRuleContext(TypeArgumentsContext, 0) as TypeArgumentsContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_callSuffix;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterCallSuffix) {
	 		listener.enterCallSuffix(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitCallSuffix) {
	 		listener.exitCallSuffix(this);
		}
	}
}


export class AnnotatedLambdaContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public lambdaLiteral(): LambdaLiteralContext {
		return this.getTypedRuleContext(LambdaLiteralContext, 0) as LambdaLiteralContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public label(): LabelContext {
		return this.getTypedRuleContext(LabelContext, 0) as LabelContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_annotatedLambda;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAnnotatedLambda) {
	 		listener.enterAnnotatedLambda(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAnnotatedLambda) {
	 		listener.exitAnnotatedLambda(this);
		}
	}
}


export class TypeArgumentsContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LANGLE(): TerminalNode {
		return this.getToken(KotlinParser.LANGLE, 0);
	}
	public typeProjection_list(): TypeProjectionContext[] {
		return this.getTypedRuleContexts(TypeProjectionContext) as TypeProjectionContext[];
	}
	public typeProjection(i: number): TypeProjectionContext {
		return this.getTypedRuleContext(TypeProjectionContext, i) as TypeProjectionContext;
	}
	public RANGLE(): TerminalNode {
		return this.getToken(KotlinParser.RANGLE, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeArguments;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeArguments) {
	 		listener.enterTypeArguments(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeArguments) {
	 		listener.exitTypeArguments(this);
		}
	}
}


export class ValueArgumentsContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public valueArgument_list(): ValueArgumentContext[] {
		return this.getTypedRuleContexts(ValueArgumentContext) as ValueArgumentContext[];
	}
	public valueArgument(i: number): ValueArgumentContext {
		return this.getTypedRuleContext(ValueArgumentContext, i) as ValueArgumentContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_valueArguments;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterValueArguments) {
	 		listener.enterValueArguments(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitValueArguments) {
	 		listener.exitValueArguments(this);
		}
	}
}


export class ValueArgumentContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public MULT(): TerminalNode {
		return this.getToken(KotlinParser.MULT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_valueArgument;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterValueArgument) {
	 		listener.enterValueArgument(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitValueArgument) {
	 		listener.exitValueArgument(this);
		}
	}
}


export class PrimaryExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public parenthesizedExpression(): ParenthesizedExpressionContext {
		return this.getTypedRuleContext(ParenthesizedExpressionContext, 0) as ParenthesizedExpressionContext;
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public literalConstant(): LiteralConstantContext {
		return this.getTypedRuleContext(LiteralConstantContext, 0) as LiteralConstantContext;
	}
	public stringLiteral(): StringLiteralContext {
		return this.getTypedRuleContext(StringLiteralContext, 0) as StringLiteralContext;
	}
	public callableReference(): CallableReferenceContext {
		return this.getTypedRuleContext(CallableReferenceContext, 0) as CallableReferenceContext;
	}
	public functionLiteral(): FunctionLiteralContext {
		return this.getTypedRuleContext(FunctionLiteralContext, 0) as FunctionLiteralContext;
	}
	public objectLiteral(): ObjectLiteralContext {
		return this.getTypedRuleContext(ObjectLiteralContext, 0) as ObjectLiteralContext;
	}
	public collectionLiteral(): CollectionLiteralContext {
		return this.getTypedRuleContext(CollectionLiteralContext, 0) as CollectionLiteralContext;
	}
	public thisExpression(): ThisExpressionContext {
		return this.getTypedRuleContext(ThisExpressionContext, 0) as ThisExpressionContext;
	}
	public superExpression(): SuperExpressionContext {
		return this.getTypedRuleContext(SuperExpressionContext, 0) as SuperExpressionContext;
	}
	public ifExpression(): IfExpressionContext {
		return this.getTypedRuleContext(IfExpressionContext, 0) as IfExpressionContext;
	}
	public whenExpression(): WhenExpressionContext {
		return this.getTypedRuleContext(WhenExpressionContext, 0) as WhenExpressionContext;
	}
	public tryExpression(): TryExpressionContext {
		return this.getTypedRuleContext(TryExpressionContext, 0) as TryExpressionContext;
	}
	public jumpExpression(): JumpExpressionContext {
		return this.getTypedRuleContext(JumpExpressionContext, 0) as JumpExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_primaryExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPrimaryExpression) {
	 		listener.enterPrimaryExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPrimaryExpression) {
	 		listener.exitPrimaryExpression(this);
		}
	}
}


export class ParenthesizedExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parenthesizedExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParenthesizedExpression) {
	 		listener.enterParenthesizedExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParenthesizedExpression) {
	 		listener.exitParenthesizedExpression(this);
		}
	}
}


export class CollectionLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.LSQUARE, 0);
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.RSQUARE, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_collectionLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterCollectionLiteral) {
	 		listener.enterCollectionLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitCollectionLiteral) {
	 		listener.exitCollectionLiteral(this);
		}
	}
}


export class LiteralConstantContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BooleanLiteral(): TerminalNode {
		return this.getToken(KotlinParser.BooleanLiteral, 0);
	}
	public IntegerLiteral(): TerminalNode {
		return this.getToken(KotlinParser.IntegerLiteral, 0);
	}
	public HexLiteral(): TerminalNode {
		return this.getToken(KotlinParser.HexLiteral, 0);
	}
	public BinLiteral(): TerminalNode {
		return this.getToken(KotlinParser.BinLiteral, 0);
	}
	public CharacterLiteral(): TerminalNode {
		return this.getToken(KotlinParser.CharacterLiteral, 0);
	}
	public RealLiteral(): TerminalNode {
		return this.getToken(KotlinParser.RealLiteral, 0);
	}
	public NullLiteral(): TerminalNode {
		return this.getToken(KotlinParser.NullLiteral, 0);
	}
	public LongLiteral(): TerminalNode {
		return this.getToken(KotlinParser.LongLiteral, 0);
	}
	public UnsignedLiteral(): TerminalNode {
		return this.getToken(KotlinParser.UnsignedLiteral, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_literalConstant;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLiteralConstant) {
	 		listener.enterLiteralConstant(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLiteralConstant) {
	 		listener.exitLiteralConstant(this);
		}
	}
}


export class StringLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public lineStringLiteral(): LineStringLiteralContext {
		return this.getTypedRuleContext(LineStringLiteralContext, 0) as LineStringLiteralContext;
	}
	public multiLineStringLiteral(): MultiLineStringLiteralContext {
		return this.getTypedRuleContext(MultiLineStringLiteralContext, 0) as MultiLineStringLiteralContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_stringLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterStringLiteral) {
	 		listener.enterStringLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitStringLiteral) {
	 		listener.exitStringLiteral(this);
		}
	}
}


export class LineStringLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUOTE_OPEN(): TerminalNode {
		return this.getToken(KotlinParser.QUOTE_OPEN, 0);
	}
	public QUOTE_CLOSE(): TerminalNode {
		return this.getToken(KotlinParser.QUOTE_CLOSE, 0);
	}
	public lineStringContent_list(): LineStringContentContext[] {
		return this.getTypedRuleContexts(LineStringContentContext) as LineStringContentContext[];
	}
	public lineStringContent(i: number): LineStringContentContext {
		return this.getTypedRuleContext(LineStringContentContext, i) as LineStringContentContext;
	}
	public lineStringExpression_list(): LineStringExpressionContext[] {
		return this.getTypedRuleContexts(LineStringExpressionContext) as LineStringExpressionContext[];
	}
	public lineStringExpression(i: number): LineStringExpressionContext {
		return this.getTypedRuleContext(LineStringExpressionContext, i) as LineStringExpressionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_lineStringLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLineStringLiteral) {
	 		listener.enterLineStringLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLineStringLiteral) {
	 		listener.exitLineStringLiteral(this);
		}
	}
}


export class MultiLineStringLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TRIPLE_QUOTE_OPEN(): TerminalNode {
		return this.getToken(KotlinParser.TRIPLE_QUOTE_OPEN, 0);
	}
	public TRIPLE_QUOTE_CLOSE(): TerminalNode {
		return this.getToken(KotlinParser.TRIPLE_QUOTE_CLOSE, 0);
	}
	public multiLineStringContent_list(): MultiLineStringContentContext[] {
		return this.getTypedRuleContexts(MultiLineStringContentContext) as MultiLineStringContentContext[];
	}
	public multiLineStringContent(i: number): MultiLineStringContentContext {
		return this.getTypedRuleContext(MultiLineStringContentContext, i) as MultiLineStringContentContext;
	}
	public multiLineStringExpression_list(): MultiLineStringExpressionContext[] {
		return this.getTypedRuleContexts(MultiLineStringExpressionContext) as MultiLineStringExpressionContext[];
	}
	public multiLineStringExpression(i: number): MultiLineStringExpressionContext {
		return this.getTypedRuleContext(MultiLineStringExpressionContext, i) as MultiLineStringExpressionContext;
	}
	public MultiLineStringQuote_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.MultiLineStringQuote);
	}
	public MultiLineStringQuote(i: number): TerminalNode {
		return this.getToken(KotlinParser.MultiLineStringQuote, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiLineStringLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiLineStringLiteral) {
	 		listener.enterMultiLineStringLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiLineStringLiteral) {
	 		listener.exitMultiLineStringLiteral(this);
		}
	}
}


export class LineStringContentContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LineStrText(): TerminalNode {
		return this.getToken(KotlinParser.LineStrText, 0);
	}
	public LineStrEscapedChar(): TerminalNode {
		return this.getToken(KotlinParser.LineStrEscapedChar, 0);
	}
	public LineStrRef(): TerminalNode {
		return this.getToken(KotlinParser.LineStrRef, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_lineStringContent;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLineStringContent) {
	 		listener.enterLineStringContent(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLineStringContent) {
	 		listener.exitLineStringContent(this);
		}
	}
}


export class LineStringExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LineStrExprStart(): TerminalNode {
		return this.getToken(KotlinParser.LineStrExprStart, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_lineStringExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLineStringExpression) {
	 		listener.enterLineStringExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLineStringExpression) {
	 		listener.exitLineStringExpression(this);
		}
	}
}


export class MultiLineStringContentContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MultiLineStrText(): TerminalNode {
		return this.getToken(KotlinParser.MultiLineStrText, 0);
	}
	public MultiLineStringQuote(): TerminalNode {
		return this.getToken(KotlinParser.MultiLineStringQuote, 0);
	}
	public MultiLineStrRef(): TerminalNode {
		return this.getToken(KotlinParser.MultiLineStrRef, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiLineStringContent;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiLineStringContent) {
	 		listener.enterMultiLineStringContent(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiLineStringContent) {
	 		listener.exitMultiLineStringContent(this);
		}
	}
}


export class MultiLineStringExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MultiLineStrExprStart(): TerminalNode {
		return this.getToken(KotlinParser.MultiLineStrExprStart, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiLineStringExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiLineStringExpression) {
	 		listener.enterMultiLineStringExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiLineStringExpression) {
	 		listener.exitMultiLineStringExpression(this);
		}
	}
}


export class LambdaLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LCURL(): TerminalNode {
		return this.getToken(KotlinParser.LCURL, 0);
	}
	public statements(): StatementsContext {
		return this.getTypedRuleContext(StatementsContext, 0) as StatementsContext;
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public ARROW(): TerminalNode {
		return this.getToken(KotlinParser.ARROW, 0);
	}
	public lambdaParameters(): LambdaParametersContext {
		return this.getTypedRuleContext(LambdaParametersContext, 0) as LambdaParametersContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_lambdaLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLambdaLiteral) {
	 		listener.enterLambdaLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLambdaLiteral) {
	 		listener.exitLambdaLiteral(this);
		}
	}
}


export class LambdaParametersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public lambdaParameter_list(): LambdaParameterContext[] {
		return this.getTypedRuleContexts(LambdaParameterContext) as LambdaParameterContext[];
	}
	public lambdaParameter(i: number): LambdaParameterContext {
		return this.getTypedRuleContext(LambdaParameterContext, i) as LambdaParameterContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_lambdaParameters;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLambdaParameters) {
	 		listener.enterLambdaParameters(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLambdaParameters) {
	 		listener.exitLambdaParameters(this);
		}
	}
}


export class LambdaParameterContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variableDeclaration(): VariableDeclarationContext {
		return this.getTypedRuleContext(VariableDeclarationContext, 0) as VariableDeclarationContext;
	}
	public multiVariableDeclaration(): MultiVariableDeclarationContext {
		return this.getTypedRuleContext(MultiVariableDeclarationContext, 0) as MultiVariableDeclarationContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_lambdaParameter;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterLambdaParameter) {
	 		listener.enterLambdaParameter(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitLambdaParameter) {
	 		listener.exitLambdaParameter(this);
		}
	}
}


export class AnonymousFunctionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FUN(): TerminalNode {
		return this.getToken(KotlinParser.FUN, 0);
	}
	public parametersWithOptionalType(): ParametersWithOptionalTypeContext {
		return this.getTypedRuleContext(ParametersWithOptionalTypeContext, 0) as ParametersWithOptionalTypeContext;
	}
	public SUSPEND(): TerminalNode {
		return this.getToken(KotlinParser.SUSPEND, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public typeConstraints(): TypeConstraintsContext {
		return this.getTypedRuleContext(TypeConstraintsContext, 0) as TypeConstraintsContext;
	}
	public functionBody(): FunctionBodyContext {
		return this.getTypedRuleContext(FunctionBodyContext, 0) as FunctionBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_anonymousFunction;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAnonymousFunction) {
	 		listener.enterAnonymousFunction(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAnonymousFunction) {
	 		listener.exitAnonymousFunction(this);
		}
	}
}


export class FunctionLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public lambdaLiteral(): LambdaLiteralContext {
		return this.getTypedRuleContext(LambdaLiteralContext, 0) as LambdaLiteralContext;
	}
	public anonymousFunction(): AnonymousFunctionContext {
		return this.getTypedRuleContext(AnonymousFunctionContext, 0) as AnonymousFunctionContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionLiteral) {
	 		listener.enterFunctionLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionLiteral) {
	 		listener.exitFunctionLiteral(this);
		}
	}
}


export class ObjectLiteralContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OBJECT(): TerminalNode {
		return this.getToken(KotlinParser.OBJECT, 0);
	}
	public DATA(): TerminalNode {
		return this.getToken(KotlinParser.DATA, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public delegationSpecifiers(): DelegationSpecifiersContext {
		return this.getTypedRuleContext(DelegationSpecifiersContext, 0) as DelegationSpecifiersContext;
	}
	public classBody(): ClassBodyContext {
		return this.getTypedRuleContext(ClassBodyContext, 0) as ClassBodyContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_objectLiteral;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterObjectLiteral) {
	 		listener.enterObjectLiteral(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitObjectLiteral) {
	 		listener.exitObjectLiteral(this);
		}
	}
}


export class ThisExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public THIS(): TerminalNode {
		return this.getToken(KotlinParser.THIS, 0);
	}
	public THIS_AT(): TerminalNode {
		return this.getToken(KotlinParser.THIS_AT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_thisExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterThisExpression) {
	 		listener.enterThisExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitThisExpression) {
	 		listener.exitThisExpression(this);
		}
	}
}


export class SuperExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SUPER(): TerminalNode {
		return this.getToken(KotlinParser.SUPER, 0);
	}
	public LANGLE(): TerminalNode {
		return this.getToken(KotlinParser.LANGLE, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public RANGLE(): TerminalNode {
		return this.getToken(KotlinParser.RANGLE, 0);
	}
	public AT_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_NO_WS, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public SUPER_AT(): TerminalNode {
		return this.getToken(KotlinParser.SUPER_AT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_superExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSuperExpression) {
	 		listener.enterSuperExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSuperExpression) {
	 		listener.exitSuperExpression(this);
		}
	}
}


export class IfExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IF(): TerminalNode {
		return this.getToken(KotlinParser.IF, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public controlStructureBody_list(): ControlStructureBodyContext[] {
		return this.getTypedRuleContexts(ControlStructureBodyContext) as ControlStructureBodyContext[];
	}
	public controlStructureBody(i: number): ControlStructureBodyContext {
		return this.getTypedRuleContext(ControlStructureBodyContext, i) as ControlStructureBodyContext;
	}
	public ELSE(): TerminalNode {
		return this.getToken(KotlinParser.ELSE, 0);
	}
	public SEMICOLON_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.SEMICOLON);
	}
	public SEMICOLON(i: number): TerminalNode {
		return this.getToken(KotlinParser.SEMICOLON, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_ifExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterIfExpression) {
	 		listener.enterIfExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitIfExpression) {
	 		listener.exitIfExpression(this);
		}
	}
}


export class WhenSubjectContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public VAL(): TerminalNode {
		return this.getToken(KotlinParser.VAL, 0);
	}
	public variableDeclaration(): VariableDeclarationContext {
		return this.getTypedRuleContext(VariableDeclarationContext, 0) as VariableDeclarationContext;
	}
	public ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ASSIGNMENT, 0);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_whenSubject;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterWhenSubject) {
	 		listener.enterWhenSubject(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitWhenSubject) {
	 		listener.exitWhenSubject(this);
		}
	}
}


export class WhenExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHEN(): TerminalNode {
		return this.getToken(KotlinParser.WHEN, 0);
	}
	public LCURL(): TerminalNode {
		return this.getToken(KotlinParser.LCURL, 0);
	}
	public RCURL(): TerminalNode {
		return this.getToken(KotlinParser.RCURL, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public whenSubject(): WhenSubjectContext {
		return this.getTypedRuleContext(WhenSubjectContext, 0) as WhenSubjectContext;
	}
	public whenEntry_list(): WhenEntryContext[] {
		return this.getTypedRuleContexts(WhenEntryContext) as WhenEntryContext[];
	}
	public whenEntry(i: number): WhenEntryContext {
		return this.getTypedRuleContext(WhenEntryContext, i) as WhenEntryContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_whenExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterWhenExpression) {
	 		listener.enterWhenExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitWhenExpression) {
	 		listener.exitWhenExpression(this);
		}
	}
}


export class WhenEntryContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public whenCondition_list(): WhenConditionContext[] {
		return this.getTypedRuleContexts(WhenConditionContext) as WhenConditionContext[];
	}
	public whenCondition(i: number): WhenConditionContext {
		return this.getTypedRuleContext(WhenConditionContext, i) as WhenConditionContext;
	}
	public ARROW(): TerminalNode {
		return this.getToken(KotlinParser.ARROW, 0);
	}
	public controlStructureBody(): ControlStructureBodyContext {
		return this.getTypedRuleContext(ControlStructureBodyContext, 0) as ControlStructureBodyContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KotlinParser.COMMA, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public semi(): SemiContext {
		return this.getTypedRuleContext(SemiContext, 0) as SemiContext;
	}
	public ELSE(): TerminalNode {
		return this.getToken(KotlinParser.ELSE, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_whenEntry;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterWhenEntry) {
	 		listener.enterWhenEntry(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitWhenEntry) {
	 		listener.exitWhenEntry(this);
		}
	}
}


export class WhenConditionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public rangeTest(): RangeTestContext {
		return this.getTypedRuleContext(RangeTestContext, 0) as RangeTestContext;
	}
	public typeTest(): TypeTestContext {
		return this.getTypedRuleContext(TypeTestContext, 0) as TypeTestContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_whenCondition;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterWhenCondition) {
	 		listener.enterWhenCondition(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitWhenCondition) {
	 		listener.exitWhenCondition(this);
		}
	}
}


export class RangeTestContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public inOperator(): InOperatorContext {
		return this.getTypedRuleContext(InOperatorContext, 0) as InOperatorContext;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_rangeTest;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterRangeTest) {
	 		listener.enterRangeTest(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitRangeTest) {
	 		listener.exitRangeTest(this);
		}
	}
}


export class TypeTestContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public isOperator(): IsOperatorContext {
		return this.getTypedRuleContext(IsOperatorContext, 0) as IsOperatorContext;
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeTest;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeTest) {
	 		listener.enterTypeTest(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeTest) {
	 		listener.exitTypeTest(this);
		}
	}
}


export class TryExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TRY(): TerminalNode {
		return this.getToken(KotlinParser.TRY, 0);
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public finallyBlock(): FinallyBlockContext {
		return this.getTypedRuleContext(FinallyBlockContext, 0) as FinallyBlockContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public catchBlock_list(): CatchBlockContext[] {
		return this.getTypedRuleContexts(CatchBlockContext) as CatchBlockContext[];
	}
	public catchBlock(i: number): CatchBlockContext {
		return this.getTypedRuleContext(CatchBlockContext, i) as CatchBlockContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_tryExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTryExpression) {
	 		listener.enterTryExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTryExpression) {
	 		listener.exitTryExpression(this);
		}
	}
}


export class CatchBlockContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CATCH(): TerminalNode {
		return this.getToken(KotlinParser.CATCH, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(KotlinParser.LPAREN, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(KotlinParser.RPAREN, 0);
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(KotlinParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_catchBlock;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterCatchBlock) {
	 		listener.enterCatchBlock(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitCatchBlock) {
	 		listener.exitCatchBlock(this);
		}
	}
}


export class FinallyBlockContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FINALLY(): TerminalNode {
		return this.getToken(KotlinParser.FINALLY, 0);
	}
	public block(): BlockContext {
		return this.getTypedRuleContext(BlockContext, 0) as BlockContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_finallyBlock;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFinallyBlock) {
	 		listener.enterFinallyBlock(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFinallyBlock) {
	 		listener.exitFinallyBlock(this);
		}
	}
}


export class JumpExpressionContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public THROW(): TerminalNode {
		return this.getToken(KotlinParser.THROW, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public RETURN(): TerminalNode {
		return this.getToken(KotlinParser.RETURN, 0);
	}
	public RETURN_AT(): TerminalNode {
		return this.getToken(KotlinParser.RETURN_AT, 0);
	}
	public CONTINUE(): TerminalNode {
		return this.getToken(KotlinParser.CONTINUE, 0);
	}
	public CONTINUE_AT(): TerminalNode {
		return this.getToken(KotlinParser.CONTINUE_AT, 0);
	}
	public BREAK(): TerminalNode {
		return this.getToken(KotlinParser.BREAK, 0);
	}
	public BREAK_AT(): TerminalNode {
		return this.getToken(KotlinParser.BREAK_AT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_jumpExpression;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterJumpExpression) {
	 		listener.enterJumpExpression(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitJumpExpression) {
	 		listener.exitJumpExpression(this);
		}
	}
}


export class CallableReferenceContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COLONCOLON(): TerminalNode {
		return this.getToken(KotlinParser.COLONCOLON, 0);
	}
	public simpleIdentifier(): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, 0) as SimpleIdentifierContext;
	}
	public CLASS(): TerminalNode {
		return this.getToken(KotlinParser.CLASS, 0);
	}
	public receiverType(): ReceiverTypeContext {
		return this.getTypedRuleContext(ReceiverTypeContext, 0) as ReceiverTypeContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_callableReference;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterCallableReference) {
	 		listener.enterCallableReference(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitCallableReference) {
	 		listener.exitCallableReference(this);
		}
	}
}


export class AssignmentAndOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ADD_ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.ADD_ASSIGNMENT, 0);
	}
	public SUB_ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.SUB_ASSIGNMENT, 0);
	}
	public MULT_ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.MULT_ASSIGNMENT, 0);
	}
	public DIV_ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.DIV_ASSIGNMENT, 0);
	}
	public MOD_ASSIGNMENT(): TerminalNode {
		return this.getToken(KotlinParser.MOD_ASSIGNMENT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_assignmentAndOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAssignmentAndOperator) {
	 		listener.enterAssignmentAndOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAssignmentAndOperator) {
	 		listener.exitAssignmentAndOperator(this);
		}
	}
}


export class EqualityOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXCL_EQ(): TerminalNode {
		return this.getToken(KotlinParser.EXCL_EQ, 0);
	}
	public EXCL_EQEQ(): TerminalNode {
		return this.getToken(KotlinParser.EXCL_EQEQ, 0);
	}
	public EQEQ(): TerminalNode {
		return this.getToken(KotlinParser.EQEQ, 0);
	}
	public EQEQEQ(): TerminalNode {
		return this.getToken(KotlinParser.EQEQEQ, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_equalityOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterEqualityOperator) {
	 		listener.enterEqualityOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitEqualityOperator) {
	 		listener.exitEqualityOperator(this);
		}
	}
}


export class ComparisonOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LANGLE(): TerminalNode {
		return this.getToken(KotlinParser.LANGLE, 0);
	}
	public RANGLE(): TerminalNode {
		return this.getToken(KotlinParser.RANGLE, 0);
	}
	public LE(): TerminalNode {
		return this.getToken(KotlinParser.LE, 0);
	}
	public GE(): TerminalNode {
		return this.getToken(KotlinParser.GE, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_comparisonOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterComparisonOperator) {
	 		listener.enterComparisonOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitComparisonOperator) {
	 		listener.exitComparisonOperator(this);
		}
	}
}


export class InOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IN(): TerminalNode {
		return this.getToken(KotlinParser.IN, 0);
	}
	public NOT_IN(): TerminalNode {
		return this.getToken(KotlinParser.NOT_IN, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_inOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterInOperator) {
	 		listener.enterInOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitInOperator) {
	 		listener.exitInOperator(this);
		}
	}
}


export class IsOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IS(): TerminalNode {
		return this.getToken(KotlinParser.IS, 0);
	}
	public NOT_IS(): TerminalNode {
		return this.getToken(KotlinParser.NOT_IS, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_isOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterIsOperator) {
	 		listener.enterIsOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitIsOperator) {
	 		listener.exitIsOperator(this);
		}
	}
}


export class AdditiveOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ADD(): TerminalNode {
		return this.getToken(KotlinParser.ADD, 0);
	}
	public SUB(): TerminalNode {
		return this.getToken(KotlinParser.SUB, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_additiveOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAdditiveOperator) {
	 		listener.enterAdditiveOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAdditiveOperator) {
	 		listener.exitAdditiveOperator(this);
		}
	}
}


export class MultiplicativeOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MULT(): TerminalNode {
		return this.getToken(KotlinParser.MULT, 0);
	}
	public DIV(): TerminalNode {
		return this.getToken(KotlinParser.DIV, 0);
	}
	public MOD(): TerminalNode {
		return this.getToken(KotlinParser.MOD, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiplicativeOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiplicativeOperator) {
	 		listener.enterMultiplicativeOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiplicativeOperator) {
	 		listener.exitMultiplicativeOperator(this);
		}
	}
}


export class AsOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AS(): TerminalNode {
		return this.getToken(KotlinParser.AS, 0);
	}
	public AS_SAFE(): TerminalNode {
		return this.getToken(KotlinParser.AS_SAFE, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_asOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAsOperator) {
	 		listener.enterAsOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAsOperator) {
	 		listener.exitAsOperator(this);
		}
	}
}


export class PrefixUnaryOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INCR(): TerminalNode {
		return this.getToken(KotlinParser.INCR, 0);
	}
	public DECR(): TerminalNode {
		return this.getToken(KotlinParser.DECR, 0);
	}
	public SUB(): TerminalNode {
		return this.getToken(KotlinParser.SUB, 0);
	}
	public ADD(): TerminalNode {
		return this.getToken(KotlinParser.ADD, 0);
	}
	public excl(): ExclContext {
		return this.getTypedRuleContext(ExclContext, 0) as ExclContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_prefixUnaryOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPrefixUnaryOperator) {
	 		listener.enterPrefixUnaryOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPrefixUnaryOperator) {
	 		listener.exitPrefixUnaryOperator(this);
		}
	}
}


export class PostfixUnaryOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INCR(): TerminalNode {
		return this.getToken(KotlinParser.INCR, 0);
	}
	public DECR(): TerminalNode {
		return this.getToken(KotlinParser.DECR, 0);
	}
	public EXCL_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.EXCL_NO_WS, 0);
	}
	public excl(): ExclContext {
		return this.getTypedRuleContext(ExclContext, 0) as ExclContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_postfixUnaryOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPostfixUnaryOperator) {
	 		listener.enterPostfixUnaryOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPostfixUnaryOperator) {
	 		listener.exitPostfixUnaryOperator(this);
		}
	}
}


export class ExclContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXCL_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.EXCL_NO_WS, 0);
	}
	public EXCL_WS(): TerminalNode {
		return this.getToken(KotlinParser.EXCL_WS, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_excl;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterExcl) {
	 		listener.enterExcl(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitExcl) {
	 		listener.exitExcl(this);
		}
	}
}


export class MemberAccessOperatorContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public safeNav(): SafeNavContext {
		return this.getTypedRuleContext(SafeNavContext, 0) as SafeNavContext;
	}
	public COLONCOLON(): TerminalNode {
		return this.getToken(KotlinParser.COLONCOLON, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_memberAccessOperator;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMemberAccessOperator) {
	 		listener.enterMemberAccessOperator(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMemberAccessOperator) {
	 		listener.exitMemberAccessOperator(this);
		}
	}
}


export class SafeNavContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUEST_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.QUEST_NO_WS, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(KotlinParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_safeNav;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSafeNav) {
	 		listener.enterSafeNav(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSafeNav) {
	 		listener.exitSafeNav(this);
		}
	}
}


export class ModifiersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public modifier_list(): ModifierContext[] {
		return this.getTypedRuleContexts(ModifierContext) as ModifierContext[];
	}
	public modifier(i: number): ModifierContext {
		return this.getTypedRuleContext(ModifierContext, i) as ModifierContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_modifiers;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterModifiers) {
	 		listener.enterModifiers(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitModifiers) {
	 		listener.exitModifiers(this);
		}
	}
}


export class ParameterModifiersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public parameterModifier_list(): ParameterModifierContext[] {
		return this.getTypedRuleContexts(ParameterModifierContext) as ParameterModifierContext[];
	}
	public parameterModifier(i: number): ParameterModifierContext {
		return this.getTypedRuleContext(ParameterModifierContext, i) as ParameterModifierContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parameterModifiers;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParameterModifiers) {
	 		listener.enterParameterModifiers(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParameterModifiers) {
	 		listener.exitParameterModifiers(this);
		}
	}
}


export class ModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public classModifier(): ClassModifierContext {
		return this.getTypedRuleContext(ClassModifierContext, 0) as ClassModifierContext;
	}
	public memberModifier(): MemberModifierContext {
		return this.getTypedRuleContext(MemberModifierContext, 0) as MemberModifierContext;
	}
	public visibilityModifier(): VisibilityModifierContext {
		return this.getTypedRuleContext(VisibilityModifierContext, 0) as VisibilityModifierContext;
	}
	public functionModifier(): FunctionModifierContext {
		return this.getTypedRuleContext(FunctionModifierContext, 0) as FunctionModifierContext;
	}
	public propertyModifier(): PropertyModifierContext {
		return this.getTypedRuleContext(PropertyModifierContext, 0) as PropertyModifierContext;
	}
	public inheritanceModifier(): InheritanceModifierContext {
		return this.getTypedRuleContext(InheritanceModifierContext, 0) as InheritanceModifierContext;
	}
	public parameterModifier(): ParameterModifierContext {
		return this.getTypedRuleContext(ParameterModifierContext, 0) as ParameterModifierContext;
	}
	public platformModifier(): PlatformModifierContext {
		return this.getTypedRuleContext(PlatformModifierContext, 0) as PlatformModifierContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_modifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterModifier) {
	 		listener.enterModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitModifier) {
	 		listener.exitModifier(this);
		}
	}
}


export class TypeModifiersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeModifier_list(): TypeModifierContext[] {
		return this.getTypedRuleContexts(TypeModifierContext) as TypeModifierContext[];
	}
	public typeModifier(i: number): TypeModifierContext {
		return this.getTypedRuleContext(TypeModifierContext, i) as TypeModifierContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeModifiers;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeModifiers) {
	 		listener.enterTypeModifiers(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeModifiers) {
	 		listener.exitTypeModifiers(this);
		}
	}
}


export class TypeModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
	public SUSPEND(): TerminalNode {
		return this.getToken(KotlinParser.SUSPEND, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeModifier) {
	 		listener.enterTypeModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeModifier) {
	 		listener.exitTypeModifier(this);
		}
	}
}


export class ClassModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUM(): TerminalNode {
		return this.getToken(KotlinParser.ENUM, 0);
	}
	public SEALED(): TerminalNode {
		return this.getToken(KotlinParser.SEALED, 0);
	}
	public ANNOTATION(): TerminalNode {
		return this.getToken(KotlinParser.ANNOTATION, 0);
	}
	public DATA(): TerminalNode {
		return this.getToken(KotlinParser.DATA, 0);
	}
	public INNER(): TerminalNode {
		return this.getToken(KotlinParser.INNER, 0);
	}
	public VALUE(): TerminalNode {
		return this.getToken(KotlinParser.VALUE, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_classModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterClassModifier) {
	 		listener.enterClassModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitClassModifier) {
	 		listener.exitClassModifier(this);
		}
	}
}


export class MemberModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OVERRIDE(): TerminalNode {
		return this.getToken(KotlinParser.OVERRIDE, 0);
	}
	public LATEINIT(): TerminalNode {
		return this.getToken(KotlinParser.LATEINIT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_memberModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMemberModifier) {
	 		listener.enterMemberModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMemberModifier) {
	 		listener.exitMemberModifier(this);
		}
	}
}


export class VisibilityModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PUBLIC(): TerminalNode {
		return this.getToken(KotlinParser.PUBLIC, 0);
	}
	public PRIVATE(): TerminalNode {
		return this.getToken(KotlinParser.PRIVATE, 0);
	}
	public INTERNAL(): TerminalNode {
		return this.getToken(KotlinParser.INTERNAL, 0);
	}
	public PROTECTED(): TerminalNode {
		return this.getToken(KotlinParser.PROTECTED, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_visibilityModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterVisibilityModifier) {
	 		listener.enterVisibilityModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitVisibilityModifier) {
	 		listener.exitVisibilityModifier(this);
		}
	}
}


export class VarianceModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IN(): TerminalNode {
		return this.getToken(KotlinParser.IN, 0);
	}
	public OUT(): TerminalNode {
		return this.getToken(KotlinParser.OUT, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_varianceModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterVarianceModifier) {
	 		listener.enterVarianceModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitVarianceModifier) {
	 		listener.exitVarianceModifier(this);
		}
	}
}


export class TypeParameterModifiersContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public typeParameterModifier_list(): TypeParameterModifierContext[] {
		return this.getTypedRuleContexts(TypeParameterModifierContext) as TypeParameterModifierContext[];
	}
	public typeParameterModifier(i: number): TypeParameterModifierContext {
		return this.getTypedRuleContext(TypeParameterModifierContext, i) as TypeParameterModifierContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeParameterModifiers;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeParameterModifiers) {
	 		listener.enterTypeParameterModifiers(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeParameterModifiers) {
	 		listener.exitTypeParameterModifiers(this);
		}
	}
}


export class TypeParameterModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public reificationModifier(): ReificationModifierContext {
		return this.getTypedRuleContext(ReificationModifierContext, 0) as ReificationModifierContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
	public varianceModifier(): VarianceModifierContext {
		return this.getTypedRuleContext(VarianceModifierContext, 0) as VarianceModifierContext;
	}
	public annotation(): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, 0) as AnnotationContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_typeParameterModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterTypeParameterModifier) {
	 		listener.enterTypeParameterModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitTypeParameterModifier) {
	 		listener.exitTypeParameterModifier(this);
		}
	}
}


export class FunctionModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TAILREC(): TerminalNode {
		return this.getToken(KotlinParser.TAILREC, 0);
	}
	public OPERATOR(): TerminalNode {
		return this.getToken(KotlinParser.OPERATOR, 0);
	}
	public INFIX(): TerminalNode {
		return this.getToken(KotlinParser.INFIX, 0);
	}
	public INLINE(): TerminalNode {
		return this.getToken(KotlinParser.INLINE, 0);
	}
	public EXTERNAL(): TerminalNode {
		return this.getToken(KotlinParser.EXTERNAL, 0);
	}
	public SUSPEND(): TerminalNode {
		return this.getToken(KotlinParser.SUSPEND, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_functionModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterFunctionModifier) {
	 		listener.enterFunctionModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitFunctionModifier) {
	 		listener.exitFunctionModifier(this);
		}
	}
}


export class PropertyModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CONST(): TerminalNode {
		return this.getToken(KotlinParser.CONST, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_propertyModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPropertyModifier) {
	 		listener.enterPropertyModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPropertyModifier) {
	 		listener.exitPropertyModifier(this);
		}
	}
}


export class InheritanceModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ABSTRACT(): TerminalNode {
		return this.getToken(KotlinParser.ABSTRACT, 0);
	}
	public FINAL(): TerminalNode {
		return this.getToken(KotlinParser.FINAL, 0);
	}
	public OPEN(): TerminalNode {
		return this.getToken(KotlinParser.OPEN, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_inheritanceModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterInheritanceModifier) {
	 		listener.enterInheritanceModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitInheritanceModifier) {
	 		listener.exitInheritanceModifier(this);
		}
	}
}


export class ParameterModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VARARG(): TerminalNode {
		return this.getToken(KotlinParser.VARARG, 0);
	}
	public NOINLINE(): TerminalNode {
		return this.getToken(KotlinParser.NOINLINE, 0);
	}
	public CROSSINLINE(): TerminalNode {
		return this.getToken(KotlinParser.CROSSINLINE, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_parameterModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterParameterModifier) {
	 		listener.enterParameterModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitParameterModifier) {
	 		listener.exitParameterModifier(this);
		}
	}
}


export class ReificationModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REIFIED(): TerminalNode {
		return this.getToken(KotlinParser.REIFIED, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_reificationModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterReificationModifier) {
	 		listener.enterReificationModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitReificationModifier) {
	 		listener.exitReificationModifier(this);
		}
	}
}


export class PlatformModifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXPECT(): TerminalNode {
		return this.getToken(KotlinParser.EXPECT, 0);
	}
	public ACTUAL(): TerminalNode {
		return this.getToken(KotlinParser.ACTUAL, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_platformModifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterPlatformModifier) {
	 		listener.enterPlatformModifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitPlatformModifier) {
	 		listener.exitPlatformModifier(this);
		}
	}
}


export class AnnotationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public singleAnnotation(): SingleAnnotationContext {
		return this.getTypedRuleContext(SingleAnnotationContext, 0) as SingleAnnotationContext;
	}
	public multiAnnotation(): MultiAnnotationContext {
		return this.getTypedRuleContext(MultiAnnotationContext, 0) as MultiAnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_annotation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAnnotation) {
	 		listener.enterAnnotation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAnnotation) {
	 		listener.exitAnnotation(this);
		}
	}
}


export class SingleAnnotationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public unescapedAnnotation(): UnescapedAnnotationContext {
		return this.getTypedRuleContext(UnescapedAnnotationContext, 0) as UnescapedAnnotationContext;
	}
	public annotationUseSiteTarget(): AnnotationUseSiteTargetContext {
		return this.getTypedRuleContext(AnnotationUseSiteTargetContext, 0) as AnnotationUseSiteTargetContext;
	}
	public AT_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_NO_WS, 0);
	}
	public AT_PRE_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_PRE_WS, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_singleAnnotation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSingleAnnotation) {
	 		listener.enterSingleAnnotation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSingleAnnotation) {
	 		listener.exitSingleAnnotation(this);
		}
	}
}


export class MultiAnnotationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.LSQUARE, 0);
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KotlinParser.RSQUARE, 0);
	}
	public annotationUseSiteTarget(): AnnotationUseSiteTargetContext {
		return this.getTypedRuleContext(AnnotationUseSiteTargetContext, 0) as AnnotationUseSiteTargetContext;
	}
	public AT_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_NO_WS, 0);
	}
	public AT_PRE_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_PRE_WS, 0);
	}
	public unescapedAnnotation_list(): UnescapedAnnotationContext[] {
		return this.getTypedRuleContexts(UnescapedAnnotationContext) as UnescapedAnnotationContext[];
	}
	public unescapedAnnotation(i: number): UnescapedAnnotationContext {
		return this.getTypedRuleContext(UnescapedAnnotationContext, i) as UnescapedAnnotationContext;
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_multiAnnotation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterMultiAnnotation) {
	 		listener.enterMultiAnnotation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitMultiAnnotation) {
	 		listener.exitMultiAnnotation(this);
		}
	}
}


export class AnnotationUseSiteTargetContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COLON(): TerminalNode {
		return this.getToken(KotlinParser.COLON, 0);
	}
	public AT_NO_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_NO_WS, 0);
	}
	public AT_PRE_WS(): TerminalNode {
		return this.getToken(KotlinParser.AT_PRE_WS, 0);
	}
	public FIELD(): TerminalNode {
		return this.getToken(KotlinParser.FIELD, 0);
	}
	public PROPERTY(): TerminalNode {
		return this.getToken(KotlinParser.PROPERTY, 0);
	}
	public GET(): TerminalNode {
		return this.getToken(KotlinParser.GET, 0);
	}
	public SET(): TerminalNode {
		return this.getToken(KotlinParser.SET, 0);
	}
	public RECEIVER(): TerminalNode {
		return this.getToken(KotlinParser.RECEIVER, 0);
	}
	public PARAM(): TerminalNode {
		return this.getToken(KotlinParser.PARAM, 0);
	}
	public SETPARAM(): TerminalNode {
		return this.getToken(KotlinParser.SETPARAM, 0);
	}
	public DELEGATE(): TerminalNode {
		return this.getToken(KotlinParser.DELEGATE, 0);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_annotationUseSiteTarget;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterAnnotationUseSiteTarget) {
	 		listener.enterAnnotationUseSiteTarget(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitAnnotationUseSiteTarget) {
	 		listener.exitAnnotationUseSiteTarget(this);
		}
	}
}


export class UnescapedAnnotationContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public constructorInvocation(): ConstructorInvocationContext {
		return this.getTypedRuleContext(ConstructorInvocationContext, 0) as ConstructorInvocationContext;
	}
	public userType(): UserTypeContext {
		return this.getTypedRuleContext(UserTypeContext, 0) as UserTypeContext;
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_unescapedAnnotation;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterUnescapedAnnotation) {
	 		listener.enterUnescapedAnnotation(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitUnescapedAnnotation) {
	 		listener.exitUnescapedAnnotation(this);
		}
	}
}


export class SimpleIdentifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public Identifier(): TerminalNode {
		return this.getToken(KotlinParser.Identifier, 0);
	}
	public ABSTRACT(): TerminalNode {
		return this.getToken(KotlinParser.ABSTRACT, 0);
	}
	public ANNOTATION(): TerminalNode {
		return this.getToken(KotlinParser.ANNOTATION, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(KotlinParser.BY, 0);
	}
	public CATCH(): TerminalNode {
		return this.getToken(KotlinParser.CATCH, 0);
	}
	public COMPANION(): TerminalNode {
		return this.getToken(KotlinParser.COMPANION, 0);
	}
	public CONSTRUCTOR(): TerminalNode {
		return this.getToken(KotlinParser.CONSTRUCTOR, 0);
	}
	public CROSSINLINE(): TerminalNode {
		return this.getToken(KotlinParser.CROSSINLINE, 0);
	}
	public DATA(): TerminalNode {
		return this.getToken(KotlinParser.DATA, 0);
	}
	public DYNAMIC(): TerminalNode {
		return this.getToken(KotlinParser.DYNAMIC, 0);
	}
	public ENUM(): TerminalNode {
		return this.getToken(KotlinParser.ENUM, 0);
	}
	public EXTERNAL(): TerminalNode {
		return this.getToken(KotlinParser.EXTERNAL, 0);
	}
	public FINAL(): TerminalNode {
		return this.getToken(KotlinParser.FINAL, 0);
	}
	public FINALLY(): TerminalNode {
		return this.getToken(KotlinParser.FINALLY, 0);
	}
	public GET(): TerminalNode {
		return this.getToken(KotlinParser.GET, 0);
	}
	public IMPORT(): TerminalNode {
		return this.getToken(KotlinParser.IMPORT, 0);
	}
	public INFIX(): TerminalNode {
		return this.getToken(KotlinParser.INFIX, 0);
	}
	public INIT(): TerminalNode {
		return this.getToken(KotlinParser.INIT, 0);
	}
	public INLINE(): TerminalNode {
		return this.getToken(KotlinParser.INLINE, 0);
	}
	public INNER(): TerminalNode {
		return this.getToken(KotlinParser.INNER, 0);
	}
	public INTERNAL(): TerminalNode {
		return this.getToken(KotlinParser.INTERNAL, 0);
	}
	public LATEINIT(): TerminalNode {
		return this.getToken(KotlinParser.LATEINIT, 0);
	}
	public NOINLINE(): TerminalNode {
		return this.getToken(KotlinParser.NOINLINE, 0);
	}
	public OPEN(): TerminalNode {
		return this.getToken(KotlinParser.OPEN, 0);
	}
	public OPERATOR(): TerminalNode {
		return this.getToken(KotlinParser.OPERATOR, 0);
	}
	public OUT(): TerminalNode {
		return this.getToken(KotlinParser.OUT, 0);
	}
	public OVERRIDE(): TerminalNode {
		return this.getToken(KotlinParser.OVERRIDE, 0);
	}
	public PRIVATE(): TerminalNode {
		return this.getToken(KotlinParser.PRIVATE, 0);
	}
	public PROTECTED(): TerminalNode {
		return this.getToken(KotlinParser.PROTECTED, 0);
	}
	public PUBLIC(): TerminalNode {
		return this.getToken(KotlinParser.PUBLIC, 0);
	}
	public REIFIED(): TerminalNode {
		return this.getToken(KotlinParser.REIFIED, 0);
	}
	public SEALED(): TerminalNode {
		return this.getToken(KotlinParser.SEALED, 0);
	}
	public TAILREC(): TerminalNode {
		return this.getToken(KotlinParser.TAILREC, 0);
	}
	public SET(): TerminalNode {
		return this.getToken(KotlinParser.SET, 0);
	}
	public VARARG(): TerminalNode {
		return this.getToken(KotlinParser.VARARG, 0);
	}
	public WHERE(): TerminalNode {
		return this.getToken(KotlinParser.WHERE, 0);
	}
	public FIELD(): TerminalNode {
		return this.getToken(KotlinParser.FIELD, 0);
	}
	public PROPERTY(): TerminalNode {
		return this.getToken(KotlinParser.PROPERTY, 0);
	}
	public RECEIVER(): TerminalNode {
		return this.getToken(KotlinParser.RECEIVER, 0);
	}
	public PARAM(): TerminalNode {
		return this.getToken(KotlinParser.PARAM, 0);
	}
	public SETPARAM(): TerminalNode {
		return this.getToken(KotlinParser.SETPARAM, 0);
	}
	public DELEGATE(): TerminalNode {
		return this.getToken(KotlinParser.DELEGATE, 0);
	}
	public FILE(): TerminalNode {
		return this.getToken(KotlinParser.FILE, 0);
	}
	public EXPECT(): TerminalNode {
		return this.getToken(KotlinParser.EXPECT, 0);
	}
	public ACTUAL(): TerminalNode {
		return this.getToken(KotlinParser.ACTUAL, 0);
	}
	public CONST(): TerminalNode {
		return this.getToken(KotlinParser.CONST, 0);
	}
	public SUSPEND(): TerminalNode {
		return this.getToken(KotlinParser.SUSPEND, 0);
	}
	public VALUE(): TerminalNode {
		return this.getToken(KotlinParser.VALUE, 0);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_simpleIdentifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterSimpleIdentifier) {
	 		listener.enterSimpleIdentifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitSimpleIdentifier) {
	 		listener.exitSimpleIdentifier(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	constructor(parser?: KotlinParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleIdentifier_list(): SimpleIdentifierContext[] {
		return this.getTypedRuleContexts(SimpleIdentifierContext) as SimpleIdentifierContext[];
	}
	public simpleIdentifier(i: number): SimpleIdentifierContext {
		return this.getTypedRuleContext(SimpleIdentifierContext, i) as SimpleIdentifierContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(KotlinParser.DOT, i);
	}
	public NL_list(): TerminalNode[] {
	    	return this.getTokens(KotlinParser.NL);
	}
	public NL(i: number): TerminalNode {
		return this.getToken(KotlinParser.NL, i);
	}
    public get ruleIndex(): number {
    	return KotlinParser.RULE_identifier;
	}
	public enterRule(listener: KotlinParserListener): void {
	    if(listener.enterIdentifier) {
	 		listener.enterIdentifier(this);
		}
	}
	public exitRule(listener: KotlinParserListener): void {
	    if(listener.exitIdentifier) {
	 		listener.exitIdentifier(this);
		}
	}
}
