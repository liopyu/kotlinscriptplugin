const vscode = require('vscode');
const fs = require('fs'); // Import fs to access unwatchFile
const { loadTypings, watchTypingsFile } = require('./typingsLoader');
const { provideCompletionItems } = require('./completionProvider');
const { provideHover } = require('./hoverProvider');
const path = require('path');

const configScriptsPath = path.join(vscode.workspace.rootPath, 'config', 'scripts', 'minecraft_typings.json');

function activate(context) {
    loadTypings();
    watchTypingsFile();

    let cachedImports = {};

    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "kotlinscript" && event.document.uri.scheme === "file") {
            const filePath = event.document.uri.fsPath;
            cachedImports[filePath] = require('./importUtils').getImportsFromKtsContent(event.document.getText());
        }
    });

    provideCompletionItems(context, cachedImports);
    provideHover(context, cachedImports);
}

function deactivate() {
    fs.unwatchFile(configScriptsPath); // Unwatch file to clean up on deactivation
}

module.exports = { activate, deactivate };
