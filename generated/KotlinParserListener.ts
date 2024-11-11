// Generated from ./src/grammar/KotlinParser.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { KotlinFileContext } from "./KotlinParser.js";
import { ScriptContext } from "./KotlinParser.js";
import { TypeCheckExpressionContext } from "./KotlinParser.js";
import { TopLevelJumpExpressionContext } from "./KotlinParser.js";
import { TopLevelExpressionContext } from "./KotlinParser.js";
import { ShebangLineContext } from "./KotlinParser.js";
import { FileAnnotationContext } from "./KotlinParser.js";
import { PackageHeaderContext } from "./KotlinParser.js";
import { ImportListContext } from "./KotlinParser.js";
import { ImportHeaderContext } from "./KotlinParser.js";
import { ImportAliasContext } from "./KotlinParser.js";
import { TopLevelObjectContext } from "./KotlinParser.js";
import { TypeAliasContext } from "./KotlinParser.js";
import { DeclarationContext } from "./KotlinParser.js";
import { ClassDeclarationContext } from "./KotlinParser.js";
import { PrimaryConstructorContext } from "./KotlinParser.js";
import { ClassBodyContext } from "./KotlinParser.js";
import { ClassParametersContext } from "./KotlinParser.js";
import { ClassParameterContext } from "./KotlinParser.js";
import { DelegationSpecifiersContext } from "./KotlinParser.js";
import { DelegationSpecifierContext } from "./KotlinParser.js";
import { ConstructorInvocationContext } from "./KotlinParser.js";
import { AnnotatedDelegationSpecifierContext } from "./KotlinParser.js";
import { ExplicitDelegationContext } from "./KotlinParser.js";
import { TypeParametersContext } from "./KotlinParser.js";
import { TypeParameterContext } from "./KotlinParser.js";
import { TypeConstraintsContext } from "./KotlinParser.js";
import { TypeConstraintContext } from "./KotlinParser.js";
import { ClassMemberDeclarationsContext } from "./KotlinParser.js";
import { ClassMemberDeclarationContext } from "./KotlinParser.js";
import { AnonymousInitializerContext } from "./KotlinParser.js";
import { CompanionObjectContext } from "./KotlinParser.js";
import { FunctionValueParametersContext } from "./KotlinParser.js";
import { FunctionValueParameterContext } from "./KotlinParser.js";
import { FunctionDeclarationContext } from "./KotlinParser.js";
import { FunctionBodyContext } from "./KotlinParser.js";
import { VariableDeclarationContext } from "./KotlinParser.js";
import { MultiVariableDeclarationContext } from "./KotlinParser.js";
import { PropertyDeclarationContext } from "./KotlinParser.js";
import { PropertyDelegateContext } from "./KotlinParser.js";
import { GetterContext } from "./KotlinParser.js";
import { SetterContext } from "./KotlinParser.js";
import { ParametersWithOptionalTypeContext } from "./KotlinParser.js";
import { FunctionValueParameterWithOptionalTypeContext } from "./KotlinParser.js";
import { ParameterWithOptionalTypeContext } from "./KotlinParser.js";
import { ParameterContext } from "./KotlinParser.js";
import { ObjectDeclarationContext } from "./KotlinParser.js";
import { SecondaryConstructorContext } from "./KotlinParser.js";
import { ConstructorDelegationCallContext } from "./KotlinParser.js";
import { EnumClassBodyContext } from "./KotlinParser.js";
import { EnumEntriesContext } from "./KotlinParser.js";
import { EnumEntryContext } from "./KotlinParser.js";
import { TypeContext } from "./KotlinParser.js";
import { TypeReferenceContext } from "./KotlinParser.js";
import { NullableTypeContext } from "./KotlinParser.js";
import { QuestContext } from "./KotlinParser.js";
import { UserTypeContext } from "./KotlinParser.js";
import { SimpleUserTypeContext } from "./KotlinParser.js";
import { TypeProjectionContext } from "./KotlinParser.js";
import { TypeProjectionModifiersContext } from "./KotlinParser.js";
import { TypeProjectionModifierContext } from "./KotlinParser.js";
import { FunctionTypeContext } from "./KotlinParser.js";
import { FunctionTypeParametersContext } from "./KotlinParser.js";
import { ParenthesizedTypeContext } from "./KotlinParser.js";
import { ReceiverTypeContext } from "./KotlinParser.js";
import { ParenthesizedUserTypeContext } from "./KotlinParser.js";
import { DefinitelyNonNullableTypeContext } from "./KotlinParser.js";
import { StatementsContext } from "./KotlinParser.js";
import { StatementContext } from "./KotlinParser.js";
import { LabelContext } from "./KotlinParser.js";
import { ControlStructureBodyContext } from "./KotlinParser.js";
import { BlockContext } from "./KotlinParser.js";
import { LoopStatementContext } from "./KotlinParser.js";
import { ForStatementContext } from "./KotlinParser.js";
import { WhileStatementContext } from "./KotlinParser.js";
import { DoWhileStatementContext } from "./KotlinParser.js";
import { AssignmentContext } from "./KotlinParser.js";
import { SemiContext } from "./KotlinParser.js";
import { SemisContext } from "./KotlinParser.js";
import { ExpressionContext } from "./KotlinParser.js";
import { DisjunctionContext } from "./KotlinParser.js";
import { ConjunctionContext } from "./KotlinParser.js";
import { EqualityContext } from "./KotlinParser.js";
import { ComparisonContext } from "./KotlinParser.js";
import { GenericCallLikeComparisonContext } from "./KotlinParser.js";
import { InfixOperationContext } from "./KotlinParser.js";
import { ElvisExpressionContext } from "./KotlinParser.js";
import { ElvisContext } from "./KotlinParser.js";
import { InfixFunctionCallContext } from "./KotlinParser.js";
import { RangeExpressionContext } from "./KotlinParser.js";
import { AdditiveExpressionContext } from "./KotlinParser.js";
import { MultiplicativeExpressionContext } from "./KotlinParser.js";
import { AsExpressionContext } from "./KotlinParser.js";
import { PrefixUnaryExpressionContext } from "./KotlinParser.js";
import { UnaryPrefixContext } from "./KotlinParser.js";
import { PostfixUnaryExpressionContext } from "./KotlinParser.js";
import { PostfixUnarySuffixContext } from "./KotlinParser.js";
import { DirectlyAssignableExpressionContext } from "./KotlinParser.js";
import { ParenthesizedDirectlyAssignableExpressionContext } from "./KotlinParser.js";
import { AssignableExpressionContext } from "./KotlinParser.js";
import { ParenthesizedAssignableExpressionContext } from "./KotlinParser.js";
import { AssignableSuffixContext } from "./KotlinParser.js";
import { IndexingSuffixContext } from "./KotlinParser.js";
import { NavigationSuffixContext } from "./KotlinParser.js";
import { CallSuffixContext } from "./KotlinParser.js";
import { AnnotatedLambdaContext } from "./KotlinParser.js";
import { TypeArgumentsContext } from "./KotlinParser.js";
import { ValueArgumentsContext } from "./KotlinParser.js";
import { ValueArgumentContext } from "./KotlinParser.js";
import { PrimaryExpressionContext } from "./KotlinParser.js";
import { ParenthesizedExpressionContext } from "./KotlinParser.js";
import { CollectionLiteralContext } from "./KotlinParser.js";
import { LiteralConstantContext } from "./KotlinParser.js";
import { StringLiteralContext } from "./KotlinParser.js";
import { LineStringLiteralContext } from "./KotlinParser.js";
import { MultiLineStringLiteralContext } from "./KotlinParser.js";
import { LineStringContentContext } from "./KotlinParser.js";
import { LineStringExpressionContext } from "./KotlinParser.js";
import { MultiLineStringContentContext } from "./KotlinParser.js";
import { MultiLineStringExpressionContext } from "./KotlinParser.js";
import { LambdaLiteralContext } from "./KotlinParser.js";
import { LambdaParametersContext } from "./KotlinParser.js";
import { LambdaParameterContext } from "./KotlinParser.js";
import { AnonymousFunctionContext } from "./KotlinParser.js";
import { FunctionLiteralContext } from "./KotlinParser.js";
import { ObjectLiteralContext } from "./KotlinParser.js";
import { ThisExpressionContext } from "./KotlinParser.js";
import { SuperExpressionContext } from "./KotlinParser.js";
import { IfExpressionContext } from "./KotlinParser.js";
import { WhenSubjectContext } from "./KotlinParser.js";
import { WhenExpressionContext } from "./KotlinParser.js";
import { WhenEntryContext } from "./KotlinParser.js";
import { WhenConditionContext } from "./KotlinParser.js";
import { RangeTestContext } from "./KotlinParser.js";
import { TypeTestContext } from "./KotlinParser.js";
import { TryExpressionContext } from "./KotlinParser.js";
import { CatchBlockContext } from "./KotlinParser.js";
import { FinallyBlockContext } from "./KotlinParser.js";
import { JumpExpressionContext } from "./KotlinParser.js";
import { CallableReferenceContext } from "./KotlinParser.js";
import { AssignmentAndOperatorContext } from "./KotlinParser.js";
import { EqualityOperatorContext } from "./KotlinParser.js";
import { ComparisonOperatorContext } from "./KotlinParser.js";
import { InOperatorContext } from "./KotlinParser.js";
import { IsOperatorContext } from "./KotlinParser.js";
import { AdditiveOperatorContext } from "./KotlinParser.js";
import { MultiplicativeOperatorContext } from "./KotlinParser.js";
import { AsOperatorContext } from "./KotlinParser.js";
import { PrefixUnaryOperatorContext } from "./KotlinParser.js";
import { PostfixUnaryOperatorContext } from "./KotlinParser.js";
import { ExclContext } from "./KotlinParser.js";
import { MemberAccessOperatorContext } from "./KotlinParser.js";
import { SafeNavContext } from "./KotlinParser.js";
import { ModifiersContext } from "./KotlinParser.js";
import { ParameterModifiersContext } from "./KotlinParser.js";
import { ModifierContext } from "./KotlinParser.js";
import { TypeModifiersContext } from "./KotlinParser.js";
import { TypeModifierContext } from "./KotlinParser.js";
import { ClassModifierContext } from "./KotlinParser.js";
import { MemberModifierContext } from "./KotlinParser.js";
import { VisibilityModifierContext } from "./KotlinParser.js";
import { VarianceModifierContext } from "./KotlinParser.js";
import { TypeParameterModifiersContext } from "./KotlinParser.js";
import { TypeParameterModifierContext } from "./KotlinParser.js";
import { FunctionModifierContext } from "./KotlinParser.js";
import { PropertyModifierContext } from "./KotlinParser.js";
import { InheritanceModifierContext } from "./KotlinParser.js";
import { ParameterModifierContext } from "./KotlinParser.js";
import { ReificationModifierContext } from "./KotlinParser.js";
import { PlatformModifierContext } from "./KotlinParser.js";
import { AnnotationContext } from "./KotlinParser.js";
import { SingleAnnotationContext } from "./KotlinParser.js";
import { MultiAnnotationContext } from "./KotlinParser.js";
import { AnnotationUseSiteTargetContext } from "./KotlinParser.js";
import { UnescapedAnnotationContext } from "./KotlinParser.js";
import { SimpleIdentifierContext } from "./KotlinParser.js";
import { IdentifierContext } from "./KotlinParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `KotlinParser`.
 */
export default class KotlinParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `KotlinParser.kotlinFile`.
	 * @param ctx the parse tree
	 */
	enterKotlinFile?: (ctx: KotlinFileContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.kotlinFile`.
	 * @param ctx the parse tree
	 */
	exitKotlinFile?: (ctx: KotlinFileContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.script`.
	 * @param ctx the parse tree
	 */
	enterScript?: (ctx: ScriptContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.script`.
	 * @param ctx the parse tree
	 */
	exitScript?: (ctx: ScriptContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeCheckExpression`.
	 * @param ctx the parse tree
	 */
	enterTypeCheckExpression?: (ctx: TypeCheckExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeCheckExpression`.
	 * @param ctx the parse tree
	 */
	exitTypeCheckExpression?: (ctx: TypeCheckExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.topLevelJumpExpression`.
	 * @param ctx the parse tree
	 */
	enterTopLevelJumpExpression?: (ctx: TopLevelJumpExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.topLevelJumpExpression`.
	 * @param ctx the parse tree
	 */
	exitTopLevelJumpExpression?: (ctx: TopLevelJumpExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.topLevelExpression`.
	 * @param ctx the parse tree
	 */
	enterTopLevelExpression?: (ctx: TopLevelExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.topLevelExpression`.
	 * @param ctx the parse tree
	 */
	exitTopLevelExpression?: (ctx: TopLevelExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.shebangLine`.
	 * @param ctx the parse tree
	 */
	enterShebangLine?: (ctx: ShebangLineContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.shebangLine`.
	 * @param ctx the parse tree
	 */
	exitShebangLine?: (ctx: ShebangLineContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.fileAnnotation`.
	 * @param ctx the parse tree
	 */
	enterFileAnnotation?: (ctx: FileAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.fileAnnotation`.
	 * @param ctx the parse tree
	 */
	exitFileAnnotation?: (ctx: FileAnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.packageHeader`.
	 * @param ctx the parse tree
	 */
	enterPackageHeader?: (ctx: PackageHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.packageHeader`.
	 * @param ctx the parse tree
	 */
	exitPackageHeader?: (ctx: PackageHeaderContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.importList`.
	 * @param ctx the parse tree
	 */
	enterImportList?: (ctx: ImportListContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.importList`.
	 * @param ctx the parse tree
	 */
	exitImportList?: (ctx: ImportListContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.importHeader`.
	 * @param ctx the parse tree
	 */
	enterImportHeader?: (ctx: ImportHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.importHeader`.
	 * @param ctx the parse tree
	 */
	exitImportHeader?: (ctx: ImportHeaderContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.importAlias`.
	 * @param ctx the parse tree
	 */
	enterImportAlias?: (ctx: ImportAliasContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.importAlias`.
	 * @param ctx the parse tree
	 */
	exitImportAlias?: (ctx: ImportAliasContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.topLevelObject`.
	 * @param ctx the parse tree
	 */
	enterTopLevelObject?: (ctx: TopLevelObjectContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.topLevelObject`.
	 * @param ctx the parse tree
	 */
	exitTopLevelObject?: (ctx: TopLevelObjectContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeAlias`.
	 * @param ctx the parse tree
	 */
	enterTypeAlias?: (ctx: TypeAliasContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeAlias`.
	 * @param ctx the parse tree
	 */
	exitTypeAlias?: (ctx: TypeAliasContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.declaration`.
	 * @param ctx the parse tree
	 */
	enterDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.declaration`.
	 * @param ctx the parse tree
	 */
	exitDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassDeclaration?: (ctx: ClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassDeclaration?: (ctx: ClassDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.primaryConstructor`.
	 * @param ctx the parse tree
	 */
	enterPrimaryConstructor?: (ctx: PrimaryConstructorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.primaryConstructor`.
	 * @param ctx the parse tree
	 */
	exitPrimaryConstructor?: (ctx: PrimaryConstructorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classBody`.
	 * @param ctx the parse tree
	 */
	enterClassBody?: (ctx: ClassBodyContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classBody`.
	 * @param ctx the parse tree
	 */
	exitClassBody?: (ctx: ClassBodyContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classParameters`.
	 * @param ctx the parse tree
	 */
	enterClassParameters?: (ctx: ClassParametersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classParameters`.
	 * @param ctx the parse tree
	 */
	exitClassParameters?: (ctx: ClassParametersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classParameter`.
	 * @param ctx the parse tree
	 */
	enterClassParameter?: (ctx: ClassParameterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classParameter`.
	 * @param ctx the parse tree
	 */
	exitClassParameter?: (ctx: ClassParameterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.delegationSpecifiers`.
	 * @param ctx the parse tree
	 */
	enterDelegationSpecifiers?: (ctx: DelegationSpecifiersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.delegationSpecifiers`.
	 * @param ctx the parse tree
	 */
	exitDelegationSpecifiers?: (ctx: DelegationSpecifiersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.delegationSpecifier`.
	 * @param ctx the parse tree
	 */
	enterDelegationSpecifier?: (ctx: DelegationSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.delegationSpecifier`.
	 * @param ctx the parse tree
	 */
	exitDelegationSpecifier?: (ctx: DelegationSpecifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.constructorInvocation`.
	 * @param ctx the parse tree
	 */
	enterConstructorInvocation?: (ctx: ConstructorInvocationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.constructorInvocation`.
	 * @param ctx the parse tree
	 */
	exitConstructorInvocation?: (ctx: ConstructorInvocationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.annotatedDelegationSpecifier`.
	 * @param ctx the parse tree
	 */
	enterAnnotatedDelegationSpecifier?: (ctx: AnnotatedDelegationSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.annotatedDelegationSpecifier`.
	 * @param ctx the parse tree
	 */
	exitAnnotatedDelegationSpecifier?: (ctx: AnnotatedDelegationSpecifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.explicitDelegation`.
	 * @param ctx the parse tree
	 */
	enterExplicitDelegation?: (ctx: ExplicitDelegationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.explicitDelegation`.
	 * @param ctx the parse tree
	 */
	exitExplicitDelegation?: (ctx: ExplicitDelegationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeParameters`.
	 * @param ctx the parse tree
	 */
	enterTypeParameters?: (ctx: TypeParametersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeParameters`.
	 * @param ctx the parse tree
	 */
	exitTypeParameters?: (ctx: TypeParametersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeParameter`.
	 * @param ctx the parse tree
	 */
	enterTypeParameter?: (ctx: TypeParameterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeParameter`.
	 * @param ctx the parse tree
	 */
	exitTypeParameter?: (ctx: TypeParameterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeConstraints`.
	 * @param ctx the parse tree
	 */
	enterTypeConstraints?: (ctx: TypeConstraintsContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeConstraints`.
	 * @param ctx the parse tree
	 */
	exitTypeConstraints?: (ctx: TypeConstraintsContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeConstraint`.
	 * @param ctx the parse tree
	 */
	enterTypeConstraint?: (ctx: TypeConstraintContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeConstraint`.
	 * @param ctx the parse tree
	 */
	exitTypeConstraint?: (ctx: TypeConstraintContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classMemberDeclarations`.
	 * @param ctx the parse tree
	 */
	enterClassMemberDeclarations?: (ctx: ClassMemberDeclarationsContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classMemberDeclarations`.
	 * @param ctx the parse tree
	 */
	exitClassMemberDeclarations?: (ctx: ClassMemberDeclarationsContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassMemberDeclaration?: (ctx: ClassMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassMemberDeclaration?: (ctx: ClassMemberDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.anonymousInitializer`.
	 * @param ctx the parse tree
	 */
	enterAnonymousInitializer?: (ctx: AnonymousInitializerContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.anonymousInitializer`.
	 * @param ctx the parse tree
	 */
	exitAnonymousInitializer?: (ctx: AnonymousInitializerContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.companionObject`.
	 * @param ctx the parse tree
	 */
	enterCompanionObject?: (ctx: CompanionObjectContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.companionObject`.
	 * @param ctx the parse tree
	 */
	exitCompanionObject?: (ctx: CompanionObjectContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionValueParameters`.
	 * @param ctx the parse tree
	 */
	enterFunctionValueParameters?: (ctx: FunctionValueParametersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionValueParameters`.
	 * @param ctx the parse tree
	 */
	exitFunctionValueParameters?: (ctx: FunctionValueParametersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionValueParameter`.
	 * @param ctx the parse tree
	 */
	enterFunctionValueParameter?: (ctx: FunctionValueParameterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionValueParameter`.
	 * @param ctx the parse tree
	 */
	exitFunctionValueParameter?: (ctx: FunctionValueParameterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionBody`.
	 * @param ctx the parse tree
	 */
	enterFunctionBody?: (ctx: FunctionBodyContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionBody`.
	 * @param ctx the parse tree
	 */
	exitFunctionBody?: (ctx: FunctionBodyContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.variableDeclaration`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.variableDeclaration`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiVariableDeclaration`.
	 * @param ctx the parse tree
	 */
	enterMultiVariableDeclaration?: (ctx: MultiVariableDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiVariableDeclaration`.
	 * @param ctx the parse tree
	 */
	exitMultiVariableDeclaration?: (ctx: MultiVariableDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.propertyDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPropertyDeclaration?: (ctx: PropertyDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.propertyDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPropertyDeclaration?: (ctx: PropertyDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.propertyDelegate`.
	 * @param ctx the parse tree
	 */
	enterPropertyDelegate?: (ctx: PropertyDelegateContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.propertyDelegate`.
	 * @param ctx the parse tree
	 */
	exitPropertyDelegate?: (ctx: PropertyDelegateContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.getter`.
	 * @param ctx the parse tree
	 */
	enterGetter?: (ctx: GetterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.getter`.
	 * @param ctx the parse tree
	 */
	exitGetter?: (ctx: GetterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.setter`.
	 * @param ctx the parse tree
	 */
	enterSetter?: (ctx: SetterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.setter`.
	 * @param ctx the parse tree
	 */
	exitSetter?: (ctx: SetterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parametersWithOptionalType`.
	 * @param ctx the parse tree
	 */
	enterParametersWithOptionalType?: (ctx: ParametersWithOptionalTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parametersWithOptionalType`.
	 * @param ctx the parse tree
	 */
	exitParametersWithOptionalType?: (ctx: ParametersWithOptionalTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionValueParameterWithOptionalType`.
	 * @param ctx the parse tree
	 */
	enterFunctionValueParameterWithOptionalType?: (ctx: FunctionValueParameterWithOptionalTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionValueParameterWithOptionalType`.
	 * @param ctx the parse tree
	 */
	exitFunctionValueParameterWithOptionalType?: (ctx: FunctionValueParameterWithOptionalTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parameterWithOptionalType`.
	 * @param ctx the parse tree
	 */
	enterParameterWithOptionalType?: (ctx: ParameterWithOptionalTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parameterWithOptionalType`.
	 * @param ctx the parse tree
	 */
	exitParameterWithOptionalType?: (ctx: ParameterWithOptionalTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parameter`.
	 * @param ctx the parse tree
	 */
	enterParameter?: (ctx: ParameterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parameter`.
	 * @param ctx the parse tree
	 */
	exitParameter?: (ctx: ParameterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.objectDeclaration`.
	 * @param ctx the parse tree
	 */
	enterObjectDeclaration?: (ctx: ObjectDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.objectDeclaration`.
	 * @param ctx the parse tree
	 */
	exitObjectDeclaration?: (ctx: ObjectDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.secondaryConstructor`.
	 * @param ctx the parse tree
	 */
	enterSecondaryConstructor?: (ctx: SecondaryConstructorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.secondaryConstructor`.
	 * @param ctx the parse tree
	 */
	exitSecondaryConstructor?: (ctx: SecondaryConstructorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.constructorDelegationCall`.
	 * @param ctx the parse tree
	 */
	enterConstructorDelegationCall?: (ctx: ConstructorDelegationCallContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.constructorDelegationCall`.
	 * @param ctx the parse tree
	 */
	exitConstructorDelegationCall?: (ctx: ConstructorDelegationCallContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.enumClassBody`.
	 * @param ctx the parse tree
	 */
	enterEnumClassBody?: (ctx: EnumClassBodyContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.enumClassBody`.
	 * @param ctx the parse tree
	 */
	exitEnumClassBody?: (ctx: EnumClassBodyContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.enumEntries`.
	 * @param ctx the parse tree
	 */
	enterEnumEntries?: (ctx: EnumEntriesContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.enumEntries`.
	 * @param ctx the parse tree
	 */
	exitEnumEntries?: (ctx: EnumEntriesContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.enumEntry`.
	 * @param ctx the parse tree
	 */
	enterEnumEntry?: (ctx: EnumEntryContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.enumEntry`.
	 * @param ctx the parse tree
	 */
	exitEnumEntry?: (ctx: EnumEntryContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.type`.
	 * @param ctx the parse tree
	 */
	enterType?: (ctx: TypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.type`.
	 * @param ctx the parse tree
	 */
	exitType?: (ctx: TypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeReference`.
	 * @param ctx the parse tree
	 */
	enterTypeReference?: (ctx: TypeReferenceContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeReference`.
	 * @param ctx the parse tree
	 */
	exitTypeReference?: (ctx: TypeReferenceContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.nullableType`.
	 * @param ctx the parse tree
	 */
	enterNullableType?: (ctx: NullableTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.nullableType`.
	 * @param ctx the parse tree
	 */
	exitNullableType?: (ctx: NullableTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.quest`.
	 * @param ctx the parse tree
	 */
	enterQuest?: (ctx: QuestContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.quest`.
	 * @param ctx the parse tree
	 */
	exitQuest?: (ctx: QuestContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.userType`.
	 * @param ctx the parse tree
	 */
	enterUserType?: (ctx: UserTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.userType`.
	 * @param ctx the parse tree
	 */
	exitUserType?: (ctx: UserTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.simpleUserType`.
	 * @param ctx the parse tree
	 */
	enterSimpleUserType?: (ctx: SimpleUserTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.simpleUserType`.
	 * @param ctx the parse tree
	 */
	exitSimpleUserType?: (ctx: SimpleUserTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeProjection`.
	 * @param ctx the parse tree
	 */
	enterTypeProjection?: (ctx: TypeProjectionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeProjection`.
	 * @param ctx the parse tree
	 */
	exitTypeProjection?: (ctx: TypeProjectionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeProjectionModifiers`.
	 * @param ctx the parse tree
	 */
	enterTypeProjectionModifiers?: (ctx: TypeProjectionModifiersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeProjectionModifiers`.
	 * @param ctx the parse tree
	 */
	exitTypeProjectionModifiers?: (ctx: TypeProjectionModifiersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeProjectionModifier`.
	 * @param ctx the parse tree
	 */
	enterTypeProjectionModifier?: (ctx: TypeProjectionModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeProjectionModifier`.
	 * @param ctx the parse tree
	 */
	exitTypeProjectionModifier?: (ctx: TypeProjectionModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionType`.
	 * @param ctx the parse tree
	 */
	enterFunctionType?: (ctx: FunctionTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionType`.
	 * @param ctx the parse tree
	 */
	exitFunctionType?: (ctx: FunctionTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionTypeParameters`.
	 * @param ctx the parse tree
	 */
	enterFunctionTypeParameters?: (ctx: FunctionTypeParametersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionTypeParameters`.
	 * @param ctx the parse tree
	 */
	exitFunctionTypeParameters?: (ctx: FunctionTypeParametersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parenthesizedType`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedType?: (ctx: ParenthesizedTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parenthesizedType`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedType?: (ctx: ParenthesizedTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.receiverType`.
	 * @param ctx the parse tree
	 */
	enterReceiverType?: (ctx: ReceiverTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.receiverType`.
	 * @param ctx the parse tree
	 */
	exitReceiverType?: (ctx: ReceiverTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parenthesizedUserType`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedUserType?: (ctx: ParenthesizedUserTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parenthesizedUserType`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedUserType?: (ctx: ParenthesizedUserTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.definitelyNonNullableType`.
	 * @param ctx the parse tree
	 */
	enterDefinitelyNonNullableType?: (ctx: DefinitelyNonNullableTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.definitelyNonNullableType`.
	 * @param ctx the parse tree
	 */
	exitDefinitelyNonNullableType?: (ctx: DefinitelyNonNullableTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.statements`.
	 * @param ctx the parse tree
	 */
	enterStatements?: (ctx: StatementsContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.statements`.
	 * @param ctx the parse tree
	 */
	exitStatements?: (ctx: StatementsContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.label`.
	 * @param ctx the parse tree
	 */
	enterLabel?: (ctx: LabelContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.label`.
	 * @param ctx the parse tree
	 */
	exitLabel?: (ctx: LabelContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.controlStructureBody`.
	 * @param ctx the parse tree
	 */
	enterControlStructureBody?: (ctx: ControlStructureBodyContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.controlStructureBody`.
	 * @param ctx the parse tree
	 */
	exitControlStructureBody?: (ctx: ControlStructureBodyContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.loopStatement`.
	 * @param ctx the parse tree
	 */
	enterLoopStatement?: (ctx: LoopStatementContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.loopStatement`.
	 * @param ctx the parse tree
	 */
	exitLoopStatement?: (ctx: LoopStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.forStatement`.
	 * @param ctx the parse tree
	 */
	enterForStatement?: (ctx: ForStatementContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.forStatement`.
	 * @param ctx the parse tree
	 */
	exitForStatement?: (ctx: ForStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.whileStatement`.
	 * @param ctx the parse tree
	 */
	enterWhileStatement?: (ctx: WhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.whileStatement`.
	 * @param ctx the parse tree
	 */
	exitWhileStatement?: (ctx: WhileStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.doWhileStatement`.
	 * @param ctx the parse tree
	 */
	enterDoWhileStatement?: (ctx: DoWhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.doWhileStatement`.
	 * @param ctx the parse tree
	 */
	exitDoWhileStatement?: (ctx: DoWhileStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.assignment`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.assignment`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.semi`.
	 * @param ctx the parse tree
	 */
	enterSemi?: (ctx: SemiContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.semi`.
	 * @param ctx the parse tree
	 */
	exitSemi?: (ctx: SemiContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.semis`.
	 * @param ctx the parse tree
	 */
	enterSemis?: (ctx: SemisContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.semis`.
	 * @param ctx the parse tree
	 */
	exitSemis?: (ctx: SemisContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.disjunction`.
	 * @param ctx the parse tree
	 */
	enterDisjunction?: (ctx: DisjunctionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.disjunction`.
	 * @param ctx the parse tree
	 */
	exitDisjunction?: (ctx: DisjunctionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.conjunction`.
	 * @param ctx the parse tree
	 */
	enterConjunction?: (ctx: ConjunctionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.conjunction`.
	 * @param ctx the parse tree
	 */
	exitConjunction?: (ctx: ConjunctionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.equality`.
	 * @param ctx the parse tree
	 */
	enterEquality?: (ctx: EqualityContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.equality`.
	 * @param ctx the parse tree
	 */
	exitEquality?: (ctx: EqualityContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.comparison`.
	 * @param ctx the parse tree
	 */
	enterComparison?: (ctx: ComparisonContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.comparison`.
	 * @param ctx the parse tree
	 */
	exitComparison?: (ctx: ComparisonContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.genericCallLikeComparison`.
	 * @param ctx the parse tree
	 */
	enterGenericCallLikeComparison?: (ctx: GenericCallLikeComparisonContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.genericCallLikeComparison`.
	 * @param ctx the parse tree
	 */
	exitGenericCallLikeComparison?: (ctx: GenericCallLikeComparisonContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.infixOperation`.
	 * @param ctx the parse tree
	 */
	enterInfixOperation?: (ctx: InfixOperationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.infixOperation`.
	 * @param ctx the parse tree
	 */
	exitInfixOperation?: (ctx: InfixOperationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.elvisExpression`.
	 * @param ctx the parse tree
	 */
	enterElvisExpression?: (ctx: ElvisExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.elvisExpression`.
	 * @param ctx the parse tree
	 */
	exitElvisExpression?: (ctx: ElvisExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.elvis`.
	 * @param ctx the parse tree
	 */
	enterElvis?: (ctx: ElvisContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.elvis`.
	 * @param ctx the parse tree
	 */
	exitElvis?: (ctx: ElvisContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.infixFunctionCall`.
	 * @param ctx the parse tree
	 */
	enterInfixFunctionCall?: (ctx: InfixFunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.infixFunctionCall`.
	 * @param ctx the parse tree
	 */
	exitInfixFunctionCall?: (ctx: InfixFunctionCallContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.rangeExpression`.
	 * @param ctx the parse tree
	 */
	enterRangeExpression?: (ctx: RangeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.rangeExpression`.
	 * @param ctx the parse tree
	 */
	exitRangeExpression?: (ctx: RangeExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.asExpression`.
	 * @param ctx the parse tree
	 */
	enterAsExpression?: (ctx: AsExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.asExpression`.
	 * @param ctx the parse tree
	 */
	exitAsExpression?: (ctx: AsExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.prefixUnaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPrefixUnaryExpression?: (ctx: PrefixUnaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.prefixUnaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPrefixUnaryExpression?: (ctx: PrefixUnaryExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.unaryPrefix`.
	 * @param ctx the parse tree
	 */
	enterUnaryPrefix?: (ctx: UnaryPrefixContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.unaryPrefix`.
	 * @param ctx the parse tree
	 */
	exitUnaryPrefix?: (ctx: UnaryPrefixContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.postfixUnaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPostfixUnaryExpression?: (ctx: PostfixUnaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.postfixUnaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPostfixUnaryExpression?: (ctx: PostfixUnaryExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.postfixUnarySuffix`.
	 * @param ctx the parse tree
	 */
	enterPostfixUnarySuffix?: (ctx: PostfixUnarySuffixContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.postfixUnarySuffix`.
	 * @param ctx the parse tree
	 */
	exitPostfixUnarySuffix?: (ctx: PostfixUnarySuffixContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.directlyAssignableExpression`.
	 * @param ctx the parse tree
	 */
	enterDirectlyAssignableExpression?: (ctx: DirectlyAssignableExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.directlyAssignableExpression`.
	 * @param ctx the parse tree
	 */
	exitDirectlyAssignableExpression?: (ctx: DirectlyAssignableExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parenthesizedDirectlyAssignableExpression`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedDirectlyAssignableExpression?: (ctx: ParenthesizedDirectlyAssignableExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parenthesizedDirectlyAssignableExpression`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedDirectlyAssignableExpression?: (ctx: ParenthesizedDirectlyAssignableExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.assignableExpression`.
	 * @param ctx the parse tree
	 */
	enterAssignableExpression?: (ctx: AssignableExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.assignableExpression`.
	 * @param ctx the parse tree
	 */
	exitAssignableExpression?: (ctx: AssignableExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parenthesizedAssignableExpression`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedAssignableExpression?: (ctx: ParenthesizedAssignableExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parenthesizedAssignableExpression`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedAssignableExpression?: (ctx: ParenthesizedAssignableExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.assignableSuffix`.
	 * @param ctx the parse tree
	 */
	enterAssignableSuffix?: (ctx: AssignableSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.assignableSuffix`.
	 * @param ctx the parse tree
	 */
	exitAssignableSuffix?: (ctx: AssignableSuffixContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.indexingSuffix`.
	 * @param ctx the parse tree
	 */
	enterIndexingSuffix?: (ctx: IndexingSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.indexingSuffix`.
	 * @param ctx the parse tree
	 */
	exitIndexingSuffix?: (ctx: IndexingSuffixContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.navigationSuffix`.
	 * @param ctx the parse tree
	 */
	enterNavigationSuffix?: (ctx: NavigationSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.navigationSuffix`.
	 * @param ctx the parse tree
	 */
	exitNavigationSuffix?: (ctx: NavigationSuffixContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.callSuffix`.
	 * @param ctx the parse tree
	 */
	enterCallSuffix?: (ctx: CallSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.callSuffix`.
	 * @param ctx the parse tree
	 */
	exitCallSuffix?: (ctx: CallSuffixContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.annotatedLambda`.
	 * @param ctx the parse tree
	 */
	enterAnnotatedLambda?: (ctx: AnnotatedLambdaContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.annotatedLambda`.
	 * @param ctx the parse tree
	 */
	exitAnnotatedLambda?: (ctx: AnnotatedLambdaContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeArguments`.
	 * @param ctx the parse tree
	 */
	enterTypeArguments?: (ctx: TypeArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeArguments`.
	 * @param ctx the parse tree
	 */
	exitTypeArguments?: (ctx: TypeArgumentsContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.valueArguments`.
	 * @param ctx the parse tree
	 */
	enterValueArguments?: (ctx: ValueArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.valueArguments`.
	 * @param ctx the parse tree
	 */
	exitValueArguments?: (ctx: ValueArgumentsContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.valueArgument`.
	 * @param ctx the parse tree
	 */
	enterValueArgument?: (ctx: ValueArgumentContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.valueArgument`.
	 * @param ctx the parse tree
	 */
	exitValueArgument?: (ctx: ValueArgumentContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPrimaryExpression?: (ctx: PrimaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPrimaryExpression?: (ctx: PrimaryExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parenthesizedExpression`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parenthesizedExpression`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.collectionLiteral`.
	 * @param ctx the parse tree
	 */
	enterCollectionLiteral?: (ctx: CollectionLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.collectionLiteral`.
	 * @param ctx the parse tree
	 */
	exitCollectionLiteral?: (ctx: CollectionLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.literalConstant`.
	 * @param ctx the parse tree
	 */
	enterLiteralConstant?: (ctx: LiteralConstantContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.literalConstant`.
	 * @param ctx the parse tree
	 */
	exitLiteralConstant?: (ctx: LiteralConstantContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.stringLiteral`.
	 * @param ctx the parse tree
	 */
	enterStringLiteral?: (ctx: StringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.stringLiteral`.
	 * @param ctx the parse tree
	 */
	exitStringLiteral?: (ctx: StringLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.lineStringLiteral`.
	 * @param ctx the parse tree
	 */
	enterLineStringLiteral?: (ctx: LineStringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.lineStringLiteral`.
	 * @param ctx the parse tree
	 */
	exitLineStringLiteral?: (ctx: LineStringLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiLineStringLiteral`.
	 * @param ctx the parse tree
	 */
	enterMultiLineStringLiteral?: (ctx: MultiLineStringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiLineStringLiteral`.
	 * @param ctx the parse tree
	 */
	exitMultiLineStringLiteral?: (ctx: MultiLineStringLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.lineStringContent`.
	 * @param ctx the parse tree
	 */
	enterLineStringContent?: (ctx: LineStringContentContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.lineStringContent`.
	 * @param ctx the parse tree
	 */
	exitLineStringContent?: (ctx: LineStringContentContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.lineStringExpression`.
	 * @param ctx the parse tree
	 */
	enterLineStringExpression?: (ctx: LineStringExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.lineStringExpression`.
	 * @param ctx the parse tree
	 */
	exitLineStringExpression?: (ctx: LineStringExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiLineStringContent`.
	 * @param ctx the parse tree
	 */
	enterMultiLineStringContent?: (ctx: MultiLineStringContentContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiLineStringContent`.
	 * @param ctx the parse tree
	 */
	exitMultiLineStringContent?: (ctx: MultiLineStringContentContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiLineStringExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiLineStringExpression?: (ctx: MultiLineStringExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiLineStringExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiLineStringExpression?: (ctx: MultiLineStringExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.lambdaLiteral`.
	 * @param ctx the parse tree
	 */
	enterLambdaLiteral?: (ctx: LambdaLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.lambdaLiteral`.
	 * @param ctx the parse tree
	 */
	exitLambdaLiteral?: (ctx: LambdaLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.lambdaParameters`.
	 * @param ctx the parse tree
	 */
	enterLambdaParameters?: (ctx: LambdaParametersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.lambdaParameters`.
	 * @param ctx the parse tree
	 */
	exitLambdaParameters?: (ctx: LambdaParametersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.lambdaParameter`.
	 * @param ctx the parse tree
	 */
	enterLambdaParameter?: (ctx: LambdaParameterContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.lambdaParameter`.
	 * @param ctx the parse tree
	 */
	exitLambdaParameter?: (ctx: LambdaParameterContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.anonymousFunction`.
	 * @param ctx the parse tree
	 */
	enterAnonymousFunction?: (ctx: AnonymousFunctionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.anonymousFunction`.
	 * @param ctx the parse tree
	 */
	exitAnonymousFunction?: (ctx: AnonymousFunctionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionLiteral`.
	 * @param ctx the parse tree
	 */
	enterFunctionLiteral?: (ctx: FunctionLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionLiteral`.
	 * @param ctx the parse tree
	 */
	exitFunctionLiteral?: (ctx: FunctionLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.objectLiteral`.
	 * @param ctx the parse tree
	 */
	enterObjectLiteral?: (ctx: ObjectLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.objectLiteral`.
	 * @param ctx the parse tree
	 */
	exitObjectLiteral?: (ctx: ObjectLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.thisExpression`.
	 * @param ctx the parse tree
	 */
	enterThisExpression?: (ctx: ThisExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.thisExpression`.
	 * @param ctx the parse tree
	 */
	exitThisExpression?: (ctx: ThisExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.superExpression`.
	 * @param ctx the parse tree
	 */
	enterSuperExpression?: (ctx: SuperExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.superExpression`.
	 * @param ctx the parse tree
	 */
	exitSuperExpression?: (ctx: SuperExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.ifExpression`.
	 * @param ctx the parse tree
	 */
	enterIfExpression?: (ctx: IfExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.ifExpression`.
	 * @param ctx the parse tree
	 */
	exitIfExpression?: (ctx: IfExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.whenSubject`.
	 * @param ctx the parse tree
	 */
	enterWhenSubject?: (ctx: WhenSubjectContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.whenSubject`.
	 * @param ctx the parse tree
	 */
	exitWhenSubject?: (ctx: WhenSubjectContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.whenExpression`.
	 * @param ctx the parse tree
	 */
	enterWhenExpression?: (ctx: WhenExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.whenExpression`.
	 * @param ctx the parse tree
	 */
	exitWhenExpression?: (ctx: WhenExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.whenEntry`.
	 * @param ctx the parse tree
	 */
	enterWhenEntry?: (ctx: WhenEntryContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.whenEntry`.
	 * @param ctx the parse tree
	 */
	exitWhenEntry?: (ctx: WhenEntryContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.whenCondition`.
	 * @param ctx the parse tree
	 */
	enterWhenCondition?: (ctx: WhenConditionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.whenCondition`.
	 * @param ctx the parse tree
	 */
	exitWhenCondition?: (ctx: WhenConditionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.rangeTest`.
	 * @param ctx the parse tree
	 */
	enterRangeTest?: (ctx: RangeTestContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.rangeTest`.
	 * @param ctx the parse tree
	 */
	exitRangeTest?: (ctx: RangeTestContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeTest`.
	 * @param ctx the parse tree
	 */
	enterTypeTest?: (ctx: TypeTestContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeTest`.
	 * @param ctx the parse tree
	 */
	exitTypeTest?: (ctx: TypeTestContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.tryExpression`.
	 * @param ctx the parse tree
	 */
	enterTryExpression?: (ctx: TryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.tryExpression`.
	 * @param ctx the parse tree
	 */
	exitTryExpression?: (ctx: TryExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.catchBlock`.
	 * @param ctx the parse tree
	 */
	enterCatchBlock?: (ctx: CatchBlockContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.catchBlock`.
	 * @param ctx the parse tree
	 */
	exitCatchBlock?: (ctx: CatchBlockContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.finallyBlock`.
	 * @param ctx the parse tree
	 */
	enterFinallyBlock?: (ctx: FinallyBlockContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.finallyBlock`.
	 * @param ctx the parse tree
	 */
	exitFinallyBlock?: (ctx: FinallyBlockContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.jumpExpression`.
	 * @param ctx the parse tree
	 */
	enterJumpExpression?: (ctx: JumpExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.jumpExpression`.
	 * @param ctx the parse tree
	 */
	exitJumpExpression?: (ctx: JumpExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.callableReference`.
	 * @param ctx the parse tree
	 */
	enterCallableReference?: (ctx: CallableReferenceContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.callableReference`.
	 * @param ctx the parse tree
	 */
	exitCallableReference?: (ctx: CallableReferenceContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.assignmentAndOperator`.
	 * @param ctx the parse tree
	 */
	enterAssignmentAndOperator?: (ctx: AssignmentAndOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.assignmentAndOperator`.
	 * @param ctx the parse tree
	 */
	exitAssignmentAndOperator?: (ctx: AssignmentAndOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.equalityOperator`.
	 * @param ctx the parse tree
	 */
	enterEqualityOperator?: (ctx: EqualityOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.equalityOperator`.
	 * @param ctx the parse tree
	 */
	exitEqualityOperator?: (ctx: EqualityOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.comparisonOperator`.
	 * @param ctx the parse tree
	 */
	enterComparisonOperator?: (ctx: ComparisonOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.comparisonOperator`.
	 * @param ctx the parse tree
	 */
	exitComparisonOperator?: (ctx: ComparisonOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.inOperator`.
	 * @param ctx the parse tree
	 */
	enterInOperator?: (ctx: InOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.inOperator`.
	 * @param ctx the parse tree
	 */
	exitInOperator?: (ctx: InOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.isOperator`.
	 * @param ctx the parse tree
	 */
	enterIsOperator?: (ctx: IsOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.isOperator`.
	 * @param ctx the parse tree
	 */
	exitIsOperator?: (ctx: IsOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.additiveOperator`.
	 * @param ctx the parse tree
	 */
	enterAdditiveOperator?: (ctx: AdditiveOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.additiveOperator`.
	 * @param ctx the parse tree
	 */
	exitAdditiveOperator?: (ctx: AdditiveOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiplicativeOperator`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeOperator?: (ctx: MultiplicativeOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiplicativeOperator`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeOperator?: (ctx: MultiplicativeOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.asOperator`.
	 * @param ctx the parse tree
	 */
	enterAsOperator?: (ctx: AsOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.asOperator`.
	 * @param ctx the parse tree
	 */
	exitAsOperator?: (ctx: AsOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.prefixUnaryOperator`.
	 * @param ctx the parse tree
	 */
	enterPrefixUnaryOperator?: (ctx: PrefixUnaryOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.prefixUnaryOperator`.
	 * @param ctx the parse tree
	 */
	exitPrefixUnaryOperator?: (ctx: PrefixUnaryOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.postfixUnaryOperator`.
	 * @param ctx the parse tree
	 */
	enterPostfixUnaryOperator?: (ctx: PostfixUnaryOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.postfixUnaryOperator`.
	 * @param ctx the parse tree
	 */
	exitPostfixUnaryOperator?: (ctx: PostfixUnaryOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.excl`.
	 * @param ctx the parse tree
	 */
	enterExcl?: (ctx: ExclContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.excl`.
	 * @param ctx the parse tree
	 */
	exitExcl?: (ctx: ExclContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.memberAccessOperator`.
	 * @param ctx the parse tree
	 */
	enterMemberAccessOperator?: (ctx: MemberAccessOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.memberAccessOperator`.
	 * @param ctx the parse tree
	 */
	exitMemberAccessOperator?: (ctx: MemberAccessOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.safeNav`.
	 * @param ctx the parse tree
	 */
	enterSafeNav?: (ctx: SafeNavContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.safeNav`.
	 * @param ctx the parse tree
	 */
	exitSafeNav?: (ctx: SafeNavContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.modifiers`.
	 * @param ctx the parse tree
	 */
	enterModifiers?: (ctx: ModifiersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.modifiers`.
	 * @param ctx the parse tree
	 */
	exitModifiers?: (ctx: ModifiersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parameterModifiers`.
	 * @param ctx the parse tree
	 */
	enterParameterModifiers?: (ctx: ParameterModifiersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parameterModifiers`.
	 * @param ctx the parse tree
	 */
	exitParameterModifiers?: (ctx: ParameterModifiersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.modifier`.
	 * @param ctx the parse tree
	 */
	enterModifier?: (ctx: ModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.modifier`.
	 * @param ctx the parse tree
	 */
	exitModifier?: (ctx: ModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeModifiers`.
	 * @param ctx the parse tree
	 */
	enterTypeModifiers?: (ctx: TypeModifiersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeModifiers`.
	 * @param ctx the parse tree
	 */
	exitTypeModifiers?: (ctx: TypeModifiersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeModifier`.
	 * @param ctx the parse tree
	 */
	enterTypeModifier?: (ctx: TypeModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeModifier`.
	 * @param ctx the parse tree
	 */
	exitTypeModifier?: (ctx: TypeModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.classModifier`.
	 * @param ctx the parse tree
	 */
	enterClassModifier?: (ctx: ClassModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.classModifier`.
	 * @param ctx the parse tree
	 */
	exitClassModifier?: (ctx: ClassModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.memberModifier`.
	 * @param ctx the parse tree
	 */
	enterMemberModifier?: (ctx: MemberModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.memberModifier`.
	 * @param ctx the parse tree
	 */
	exitMemberModifier?: (ctx: MemberModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.visibilityModifier`.
	 * @param ctx the parse tree
	 */
	enterVisibilityModifier?: (ctx: VisibilityModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.visibilityModifier`.
	 * @param ctx the parse tree
	 */
	exitVisibilityModifier?: (ctx: VisibilityModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.varianceModifier`.
	 * @param ctx the parse tree
	 */
	enterVarianceModifier?: (ctx: VarianceModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.varianceModifier`.
	 * @param ctx the parse tree
	 */
	exitVarianceModifier?: (ctx: VarianceModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeParameterModifiers`.
	 * @param ctx the parse tree
	 */
	enterTypeParameterModifiers?: (ctx: TypeParameterModifiersContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeParameterModifiers`.
	 * @param ctx the parse tree
	 */
	exitTypeParameterModifiers?: (ctx: TypeParameterModifiersContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.typeParameterModifier`.
	 * @param ctx the parse tree
	 */
	enterTypeParameterModifier?: (ctx: TypeParameterModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.typeParameterModifier`.
	 * @param ctx the parse tree
	 */
	exitTypeParameterModifier?: (ctx: TypeParameterModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.functionModifier`.
	 * @param ctx the parse tree
	 */
	enterFunctionModifier?: (ctx: FunctionModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.functionModifier`.
	 * @param ctx the parse tree
	 */
	exitFunctionModifier?: (ctx: FunctionModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.propertyModifier`.
	 * @param ctx the parse tree
	 */
	enterPropertyModifier?: (ctx: PropertyModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.propertyModifier`.
	 * @param ctx the parse tree
	 */
	exitPropertyModifier?: (ctx: PropertyModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.inheritanceModifier`.
	 * @param ctx the parse tree
	 */
	enterInheritanceModifier?: (ctx: InheritanceModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.inheritanceModifier`.
	 * @param ctx the parse tree
	 */
	exitInheritanceModifier?: (ctx: InheritanceModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.parameterModifier`.
	 * @param ctx the parse tree
	 */
	enterParameterModifier?: (ctx: ParameterModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.parameterModifier`.
	 * @param ctx the parse tree
	 */
	exitParameterModifier?: (ctx: ParameterModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.reificationModifier`.
	 * @param ctx the parse tree
	 */
	enterReificationModifier?: (ctx: ReificationModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.reificationModifier`.
	 * @param ctx the parse tree
	 */
	exitReificationModifier?: (ctx: ReificationModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.platformModifier`.
	 * @param ctx the parse tree
	 */
	enterPlatformModifier?: (ctx: PlatformModifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.platformModifier`.
	 * @param ctx the parse tree
	 */
	exitPlatformModifier?: (ctx: PlatformModifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.annotation`.
	 * @param ctx the parse tree
	 */
	enterAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.annotation`.
	 * @param ctx the parse tree
	 */
	exitAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.singleAnnotation`.
	 * @param ctx the parse tree
	 */
	enterSingleAnnotation?: (ctx: SingleAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.singleAnnotation`.
	 * @param ctx the parse tree
	 */
	exitSingleAnnotation?: (ctx: SingleAnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.multiAnnotation`.
	 * @param ctx the parse tree
	 */
	enterMultiAnnotation?: (ctx: MultiAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.multiAnnotation`.
	 * @param ctx the parse tree
	 */
	exitMultiAnnotation?: (ctx: MultiAnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.annotationUseSiteTarget`.
	 * @param ctx the parse tree
	 */
	enterAnnotationUseSiteTarget?: (ctx: AnnotationUseSiteTargetContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.annotationUseSiteTarget`.
	 * @param ctx the parse tree
	 */
	exitAnnotationUseSiteTarget?: (ctx: AnnotationUseSiteTargetContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.unescapedAnnotation`.
	 * @param ctx the parse tree
	 */
	enterUnescapedAnnotation?: (ctx: UnescapedAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.unescapedAnnotation`.
	 * @param ctx the parse tree
	 */
	exitUnescapedAnnotation?: (ctx: UnescapedAnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.simpleIdentifier`.
	 * @param ctx the parse tree
	 */
	enterSimpleIdentifier?: (ctx: SimpleIdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.simpleIdentifier`.
	 * @param ctx the parse tree
	 */
	exitSimpleIdentifier?: (ctx: SimpleIdentifierContext) => void;
	/**
	 * Enter a parse tree produced by `KotlinParser.identifier`.
	 * @param ctx the parse tree
	 */
	enterIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `KotlinParser.identifier`.
	 * @param ctx the parse tree
	 */
	exitIdentifier?: (ctx: IdentifierContext) => void;
}

