const fs = require('fs');
const { getClass } = require('./typingsLoader');

// Load imports from content
function getImportsFromKtsContent(content) {
    const importRegex = /^import\s+([a-zA-Z0-9._]+);?$/gm;
    const imports = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    return imports;
}

// Load imports from a file (useful for files not currently open in the editor)
function getImportsFromKtsFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return getImportsFromKtsContent(content);
}

// Retrieve the base class from imports based on the class name
function getBaseClassFromImports(document, className, cachedImports) {
    const imports = cachedImports[document.uri.fsPath] || getImportsFromKtsContent(document.getText());
    const matchingImport = imports.find(importedClass => importedClass.endsWith(className));
    return getClass(matchingImport) || null;
}

// Utility function to get the word and its dot-separated parts at a specific position
function getWordAtPosition(document, position) {
    const range = document.getWordRangeAtPosition(position, /[\w\.]+/);
    if (!range) return { word: null, parts: [] };

    const word = document.getText(range);
    const parts = word.split('.');

    return { word, parts };
}

module.exports = {
    getImportsFromKtsContent,
    getImportsFromKtsFile,
    getBaseClassFromImports,
    getWordAtPosition,
};
