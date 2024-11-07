const vscode = require('vscode');
const { getBaseClassFromImports, getWordAtPosition, getImportsFromKtsContent } = require('./importUtils');
const { getClass } = require('./typingsLoader');

function provideHover(document, position, cachedImports) {
    const { word } = getWordAtPosition(document, position);
    if (!word) return null;

    const filePath = document.uri.fsPath;
    const imports = cachedImports[filePath] || getImportsFromKtsContent(document.getText());
    const matchingImport = imports.find(importedClass => importedClass.split('.').pop() === word);

    if (!matchingImport || !getClass(matchingImport)) return null;

    const classDetails = getClass(matchingImport);
    const hoverText = new vscode.MarkdownString(`### ${matchingImport}\n**Methods:**\n`);
    classDetails.methods.forEach(method => {
        hoverText.appendMarkdown(`- ${method.name}(${method.parameters.join(', ')}): ${method.returnType}\n`);
    });

    return new vscode.Hover(hoverText);
}

module.exports = { provideHover };
