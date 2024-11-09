// Import necessary modules from antlr4 or any other libraries as ES modules
import antlr4 from 'antlr4';
import KotlinLexer from '../generated/KotlinLexer.mjs';
import KotlinParser from '../generated/KotlinParser.mjs';
import KotlinParserListener from '../generated/KotlinParserListener.mjs';

// You can add more imports as necessary

// Define the activate function, which is called when your extension is activated
export function activate(context) {
    console.log('Congratulations, your extension "kotlinscript" is now active!');

    // You can put the rest of your extension's code here
    const input = "field = 123 AND items in (1,2,3)";
    const chars = new antlr4.InputStream(input);
    const lexer = new KotlinLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new KotlinParser(tokens);
    const tree = parser.kotlinFile(); // Assuming 'kotlinFile' is the entry point rule

    // Example of how to use the listener or visitor patterns if necessary
    // const listener = new KotlinParserListener();
    // antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
}

// Define the deactivate function, which is called when your extension is deactivated
export function deactivate() {
    console.log('Your extension "kotlinscript" is now deactivated.');
}
