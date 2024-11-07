const vscode = require('vscode');
const { getBaseClassFromImports, getWordAtPosition } = require('./importUtils');
const { getClass } = require('./typingsLoader');

function provideCompletionItems(document, position, cachedImports) {
    const { parts } = getWordAtPosition(document, position);
    if (parts.length < 2) return null;

    let currentClass = getBaseClassFromImports(document, parts[0].trim(), cachedImports);
    if (!currentClass) return null;

    for (let i = 1; i < parts.length - 1; i++) {
        let part = parts[i].trim();
        const isMethodCall = part.endsWith('()');

        if (isMethodCall) {
            part = part.slice(0, -2);
            const method = currentClass.methods.find(m => m.name === part);
            if (!method) return null;
            currentClass = getClass(method.returnType);
        } else {
            const field = currentClass.fields.find(f => f.name === part);
            if (!field) return null;
            currentClass = getClass(field.fieldType);
        }
        if (!currentClass) return null;
    }

    const partialItem = parts[parts.length - 1].trim();
    const completions = [];

    currentClass.methods.forEach(method => {
        if (method.name.startsWith(partialItem)) {
            const item = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Method);
            item.detail = `${method.returnType} ${method.name}(${method.parameters.join(', ')})`;
            item.insertText = new vscode.SnippetString(`${method.name}($1)`);
            completions.push(item);
        }
    });

    currentClass.fields.forEach(field => {
        if (field.name.startsWith(partialItem)) {
            const item = new vscode.CompletionItem(field.name, vscode.CompletionItemKind.Field);
            item.detail = `${field.fieldType} ${field.name}`;
            item.insertText = field.name;
            completions.push(item);
        }
    });

    return completions;
}

module.exports = { provideCompletionItems };
