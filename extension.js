const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function loadTypings(configPath) {
	if (fs.existsSync(configPath)) {
		return JSON.parse(fs.readFileSync(configPath, 'utf8'));
	}
	return null;
}

function getClassData(className, typings) {
	return typings[className] || null;
}
function findLineById(uniqueId, filePath) {
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const lines = fileContent.split('\n');

	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes(`"id": ${uniqueId}`)) {
			return i;
		}
	}
	return null;
}

function generateHoverText(classData) {
	let hoverText = `### ${classData.name}\n\n`;

	if (classData.fields && classData.fields.length > 0) {
		hoverText += "**Fields:**\n";
		classData.fields.forEach(field => {
			hoverText += `- ${field.name}: ${field.type}\n`;
		});
		hoverText += "\n";
	}

	if (classData.methods && classData.methods.length > 0) {
		hoverText += "**Methods:**\n";
		classData.methods.forEach(method => {
			const params = method.parameters.join(', ');
			hoverText += `- ${method.name}(${params}): ${method.returnType}\n`;
		});
	}

	return hoverText;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const configPath = path.join(vscode.workspace.rootPath, 'config', 'minecraft_typings.json');
	const typings = loadTypings(configPath);

	if (!typings) {
		return;
	}
	const completionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: "kotlinscript", scheme: 'file' },
		{
			provideCompletionItems(document, position) {
				const lineText = document.lineAt(position).text;
				const preText = lineText.substring(0, position.character - 1);

				const identifierChainRegex = /\b(\w+(\.\w+)*)\b\s*$/;
				const match = identifierChainRegex.exec(preText);

				if (match) {
					const identifierChain = match[1];
					const completions = [];
					const identifiers = identifierChain.split(".");

					let currentClassData = getClassData(identifiers[0], typings);

					for (let i = 1; i < identifiers.length; i++) {
						if (!currentClassData) break;

						const fieldName = identifiers[i];
						const field = currentClassData.fields.find(f => f.name === fieldName);

						if (field && field.type) {
							const fieldTypeSimpleName = field.type.split('.').pop();
							currentClassData = getClassData(fieldTypeSimpleName, typings);
						} else {
							currentClassData = null;
						}
					}

					if (currentClassData) {
						currentClassData.fields.forEach(field => {
							const fieldItem = new vscode.CompletionItem(field.name, vscode.CompletionItemKind.Field);
							fieldItem.detail = `${field.type} ${field.name}`;
							completions.push(fieldItem);
						});

						currentClassData.methods.forEach(method => {
							const methodItem = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Method);
							methodItem.detail = `${method.returnType} ${method.name}(${method.parameters.join(', ')})`;
							completions.push(methodItem);
						});

						return completions;
					}
				}

				return [];
			}
		},
		'.'
	);
	const hoverProvider = vscode.languages.registerHoverProvider(
		{ language: "kotlinscript", scheme: 'file' },
		{
			provideHover(document, position) {
				const lineText = document.lineAt(position).text;

				const identifierChainRegex = /\b(\w+(\.\w+)*)\b/g;
				const match = [...lineText.matchAll(identifierChainRegex)].find(m => m.index <= position.character && m.index + m[0].length >= position.character);

				if (!match) {
					return null;
				}

				const identifierChain = match[0].split(".");

				const hoveredCharacter = position.character - match.index;
				const indexInChain = identifierChain.findIndex((_, i) => {
					const startIndex = match[0].indexOf(identifierChain[i]);
					const endIndex = startIndex + identifierChain[i].length;
					return hoveredCharacter >= startIndex && hoveredCharacter <= endIndex;
				});

				let currentClassData = getClassData(identifierChain[0], typings);

				for (let i = 1; i <= indexInChain; i++) {
					if (!currentClassData) {
						break;
					}

					const identifier = identifierChain[i];
					const field = currentClassData.fields?.find(f => f.name === identifier);
					const method = currentClassData.methods?.find(m => m.name === identifier);

					if (field && field.type) {
						const fieldTypeSimpleName = field.type.split('.').pop();
						currentClassData = getClassData(fieldTypeSimpleName, typings);
					} else if (method) {
						const params = method.parameters.join(', ');
						const hoverText = `**${method.name}**(${params}): ${method.returnType}`;
						return new vscode.Hover(new vscode.MarkdownString(hoverText));
					} else {
						currentClassData = null;
					}
				}

				if (currentClassData) {
					const hoverText = generateHoverText(currentClassData);
					return new vscode.Hover(new vscode.MarkdownString(hoverText));
				}

				return null;
			}
		}
	);
	const definitionProvider = vscode.languages.registerDefinitionProvider(
		{ language: "kotlinscript", scheme: 'file' },
		{
			provideDefinition(document, position) {
				const word = document.getText(document.getWordRangeAtPosition(position));
				const lineText = document.lineAt(position).text;
				console.log("Word:", word);
				console.log("Line Text:", lineText);

				const identifierChainRegex = /\b(\w+(\.\w+)*)\b/g;
				const match = [...lineText.matchAll(identifierChainRegex)].find(
					m => m.index <= position.character && m.index + m[0].length >= position.character
				);

				if (!match) {
					console.log("No matching identifier chain found.");
					return null;
				}

				const identifierChain = match[0].split(".");
				console.log("Full Identifier Chain:", identifierChain);

				let currentClassData = getClassData(identifierChain[0], typings);
				if (!currentClassData) {
					console.log(`No class data found for base class "${identifierChain[0]}"`);
					return null;
				}

				const configPath = path.join(vscode.workspace.rootPath, 'config', 'minecraft_typings.json');
				const uri = vscode.Uri.file(configPath);

				// Initialize uniqueId with the base class ID
				let uniqueId = currentClassData.id;
				console.log(`Starting with base class ID: ${uniqueId}`);

				for (let i = 0; i < identifierChain.length; i++) {
					const identifier = identifierChain[i];
					console.log(`Checking identifier: ${identifier}`);

					// Navigate directly if the current identifier matches the clicked word
					if (identifier === word) {
						console.log(`Clicked on identifier "${identifier}" with ID: ${uniqueId}`);
						const line = findLineById(uniqueId, configPath);
						if (line !== null) {
							console.log(`Navigating to line ${line} for ID: ${uniqueId}`);
							return new vscode.Location(uri, new vscode.Position(line, 0));
						}
						break; // Stop further traversal once the clicked identifier is found
					}

					// Traverse fields, methods, and nested classes if needed, without updating uniqueId prematurely
					let nextUniqueId = null;
					const field = currentClassData.fields?.find(f => f.name === identifier);
					const method = currentClassData.methods?.find(m => m.name === identifier);
					const nestedClass = getClassData(identifier, typings); // Check for nested class

					if (field) {
						nextUniqueId = field.id;
						console.log(`Found field "${identifier}" with ID: ${nextUniqueId}`);
						const fieldTypeSimpleName = field.type.split('.').pop();
						currentClassData = getClassData(fieldTypeSimpleName, typings);
					} else if (method) {
						nextUniqueId = method.id;
						console.log(`Found method "${identifier}" with ID: ${nextUniqueId}`);
						currentClassData = null;
						break;
					} else if (nestedClass) {
						nextUniqueId = nestedClass.id;
						currentClassData = nestedClass;
						console.log(`Found nested class "${identifier}" with ID: ${nextUniqueId}`);
					} else {
						console.log(`No matching field, method, or nested class found for identifier: ${identifier}`);
						currentClassData = null;
						break;
					}

					// Update uniqueId after the traversal step is complete, ready for the next iteration
					uniqueId = nextUniqueId;

					if (!currentClassData) {
						console.log(`No further class data found for identifier: ${identifier}`);
						break;
					}
				}

				console.log("Definition not found for the provided identifier chain.");
				return null;
			}
		}
	);

	context.subscriptions.push(definitionProvider);
	context.subscriptions.push(completionProvider);
	context.subscriptions.push(hoverProvider);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
