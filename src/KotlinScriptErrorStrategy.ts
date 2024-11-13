import { Token, NoViableAltException, TokenStream, InputMismatchException, FailedPredicateException } from 'antlr4';
import { Interval, IntervalSet, DefaultErrorStrategy } from "antlr4"
import { Diagnostic, DiagnosticSeverity, Range, Position } from "vscode"
import vscode from "vscode"
import KotlinParser from '../generated/KotlinParser';
export class KotlinScriptErrorStrategy extends DefaultErrorStrategy {
    public diagnostics: vscode.Diagnostic[] = [];
    constructor() {
        super()
    }
    reportFailedPredicate(recognizer: KotlinParser, e: FailedPredicateException) {
        try {
            // @ts-expect-error 
            const ruleName = recognizer.ruleNames[recognizer._ctx.ruleIndex]
            const msg = "rule " + ruleName + " " + e.message
            // @ts-expect-error 
            recognizer.notifyErrorListeners(msg, e.offendingToken, e);
            this.addDiagnostics(msg, recognizer)
            e.message = msg;
        } catch (error) {
            console.error(error)
        }

    }
    reportInputMismatch(recognizer: KotlinParser, e: InputMismatchException) {
        // @ts-expect-error 
        const msg = "mismatched input " + this.getTokenErrorDisplay(e.offendingToken) +
            // @ts-expect-error 
            " expecting " + e.getExpectedTokens().toString(recognizer.literalNames, recognizer.symbolicNames)
        // @ts-expect-error 
        recognizer.notifyErrorListeners(msg, e.offendingToken, e);
        this.addDiagnostics(msg, recognizer)
        e.message = msg;
    }
    reportNoViableAlternative(recognizer: KotlinParser, e: NoViableAltException): void {
        const tokens = recognizer._input as TokenStream;
        let input: string;

        try {
            if (tokens) {
                const startToken = e.startToken;
                const offendingToken = e.offendingToken;

                if (offendingToken) {
                    const interval = new Interval(startToken.tokenIndex, offendingToken.tokenIndex);
                    input = startToken.type === Token.EOF ? "<EOF>" : tokens.getText(interval);
                } else {
                    input = "<unknown input>";
                }

                if (!offendingToken) return;

                const line = offendingToken.line;
                const column = offendingToken.column;
                // @ts-expect-error 
                const currentRuleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];
                // @ts-expect-error 
                const expecting = this.getExpectedTokens(recognizer);
                const expectedTokenNames = this.getReadableExpectedTokens(expecting, recognizer);
                const suggestedTokens = expectedTokenNames.slice(0, 3).join(", ") || "other tokens";

                const inputSnippet = input.length > 20 ? input.slice(0, 20) + "..." : input;
                // @ts-expect-error 
                const message = `Unexpected input near '${this.escapeWSAndQuote(inputSnippet)}' in '${currentRuleName}'. Did you mean one of: ${suggestedTokens}?`;

                const range = new vscode.Range(new vscode.Position(line - 1, column), new vscode.Position(line - 1, column + inputSnippet.length));
                const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
                this.diagnostics.push(diagnostic);
                e.message = message;

            }
        } catch (error) {
            console.error(error);
        }
    }


    reportUnwantedToken(recognizer: KotlinParser): void {
        if (this.inErrorRecoveryMode(recognizer)) return;

        this.beginErrorCondition(recognizer);

        const currentToken = recognizer.getCurrentToken();
        // @ts-expect-error 
        const tokenName = this.getTokenErrorDisplay(currentToken);

        // @ts-expect-error 
        const expecting = this.getExpectedTokens(recognizer);
        // @ts-expect-error 
        const currentRuleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];

        const expectedTokenNames = this.getReadableExpectedTokens(expecting, recognizer);

        const msg = `Unexpected token ${tokenName} in ${currentRuleName}; expected one of: ${expectedTokenNames.join(", ")}`;
        // @ts-expect-error 
        recognizer.notifyErrorListeners(msg, currentToken, null);
        this.addDiagnostics(msg, recognizer);
    }
    private getReadableExpectedTokens(expecting: IntervalSet, recognizer: KotlinParser): string[] {
        const expectedTokens = expecting.intervals;

        return expectedTokens
            .map(tokenType => {
                // @ts-expect-error 
                const literalName = recognizer.literalNames[tokenType];
                // @ts-expect-error 
                const symbolicName = recognizer.symbolicNames[tokenType];

                // Use literal name if available
                if (literalName && literalName !== "null") return literalName;
                // Use symbolic name if available
                if (symbolicName && symbolicName !== "null") return symbolicName;

                // Fallback: Skip tokens that don’t have readable names
                return null;
            })
            .filter(name => name !== null); // Filter out unknown or null tokens
    }

    addDiagnostics(msg: string, parser: KotlinParser): void {
        const t = parser.getCurrentToken();
        // @ts-expect-error 
        const tokenName = this.getTokenErrorDisplay(t);
        const line = t.line;
        const column = t.column;
        const range = new Range(new Position(line - 1, column), new Position(line - 1, column + tokenName.length));
        const diagnostic = new Diagnostic(range, msg, DiagnosticSeverity.Error);
        this.diagnostics.push(diagnostic);
    }


    public getDiagnostics(): Diagnostic[] {
        return this.diagnostics;
    }
}