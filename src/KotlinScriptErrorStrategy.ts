import { RecognitionException, Parser, Token, NoViableAltException, TokenStream } from 'antlr4';
import { Interval, IntervalSet, DefaultErrorStrategy } from "antlr4"
import { Diagnostic, DiagnosticSeverity, Uri, Range, Position } from "vscode"
import vscode from "vscode"
import KotlinParser from '../generated/KotlinParser';
export class KotlinScriptErrorStrategy extends DefaultErrorStrategy {
    private errorMessages: Map<string, string> = new Map();
    private diagnostics: vscode.Diagnostic[] = [];

    /* reportError(recognizer: Parser, e: RecognitionException): void {
        if (e instanceof NoViableAltException) {
            try {
                this.reportNoViableAlternative(recognizer, e as NoViableAltException);
            } catch (error) {
                console.error("Error during reportNoViableAlternative: ", error);
            }
        }
    } */

    reportNoViableAlternative(recognizer: Parser, e: NoViableAltException): void {
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
                if (!offendingToken) return
                const testLine = offendingToken.line;
                const testColumn = offendingToken.column;
                const positionKey = `${testLine}:${testColumn}`;
                if (!this.errorMessages.has(positionKey)) {
                    const message = `No viable alternative at input ${this.escapeWSAndQuote(input)}`;
                    this.errorMessages.set(positionKey, message);
                    const range = new Range(new Position(testLine - 1, testColumn), new Position(testLine - 1, testColumn + input.length));
                    const diagnostic = new Diagnostic(range, message, DiagnosticSeverity.Error);
                    this.diagnostics.push(diagnostic);
                }
            }
        } catch (error) {
            console.error(error);
        }

    }
    reportUnwantedToken(recognizer: KotlinParser): void {
        if (this.inErrorRecoveryMode(recognizer)) {
            return;
        }

        this.beginErrorCondition(recognizer);

        const t = recognizer.getCurrentToken();
        const tokenName = this.getTokenErrorDisplay(t);
        const expecting = this.getExpectedTokens(recognizer);
        const msg = `Extraneous input ${tokenName} expecting ${expecting.toString(recognizer.literalNames, recognizer.symbolicNames)}`;

        const line = t.line;
        const column = t.column;
        const positionKey = `${line}:${column}`;

        if (!this.errorMessages.has(positionKey)) {
            this.errorMessages.set(positionKey, msg);
            const range = new Range(new Position(line - 1, column), new Position(line - 1, column + tokenName.length));
            const diagnostic = new Diagnostic(range, msg, DiagnosticSeverity.Error);
            this.diagnostics.push(diagnostic);
        }

        recognizer.notifyErrorListeners(msg, t, null);
    }


    public getDiagnostics(): Diagnostic[] {
        return this.diagnostics;
    }
    public getErrorMessage(line: number, column: number): string | undefined {
        return this.errorMessages.get(`${line}:${column}`);
    }

    private escapeWSAndQuote(text: string): string {
        return `"${text.replace(/\s/g, ' ')}"`;
    }
}