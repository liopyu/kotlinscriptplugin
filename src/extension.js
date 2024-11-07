const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const Tokenizer = require('./tokenizer');
const Parser = require('./parser');

function processFile(filePath) {
    console.log(`Reading content of ${filePath}...`);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log("File content read successfully.");

        // Tokenize the content
        const tokenizer = new Tokenizer(content);
        console.log("Tokenizer initialized.");

        const tokens = tokenizer.tokenize();
        console.log("Tokenization complete. Tokens:");
        tokens.forEach(token => console.log(token));

        // Parse the tokens into an AST
        const parser = new Parser(tokens);
        console.log("Parser initialized.");

        const ast = parser.parse();
        console.log("Parsing complete. AST:");

        // Log each AST node for inspection
        ast.forEach(node => {
            console.log(JSON.stringify(node, null, 2));
        });

    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}


function activate(context) {
    console.log("Extension activated");

    // Log workspace folder information for debugging
    if (vscode.workspace.workspaceFolders) {
        console.log("Workspace folders:", vscode.workspace.workspaceFolders);
    } else {
        console.log("No workspace folders detected.");
    }

    const instancePath = path.join(
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
        'config',
        'scripts'
    );

    // Log the derived instance path
    console.log("Derived instance path:", instancePath);

    // Check if the instance path exists
    if (!fs.existsSync(instancePath)) {
        console.log(`Instance path ${instancePath} does not exist.`);
        return;
    } else {
        console.log(`Instance path ${instancePath} exists.`);
    }

    // Process existing `.kts` files on activation
    fs.readdirSync(instancePath)
        .filter(file => file.endsWith('.kts'))
        .forEach(file => {
            const filePath = path.join(instancePath, file);
            console.log(`Processing file on activation: ${filePath}`);
            processFile(filePath);
        });
}

function deactivate() { }

module.exports = { activate, deactivate };
