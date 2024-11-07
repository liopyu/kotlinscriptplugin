const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

const configScriptsPath = path.join(vscode.workspace.rootPath, 'config', 'scripts', 'minecraft_typings.json');
let classes = {};

function loadTypings() {
    try {
        const data = fs.readFileSync(configScriptsPath, 'utf8');
        classes = JSON.parse(data);
        console.log("Classes loaded:", Object.keys(classes));
    } catch (error) {
        console.error(`Error loading typings file: ${error}`);
        classes = {};
    }
}

function watchTypingsFile() {
    fs.watchFile(configScriptsPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log(`Detected change in typings file: ${configScriptsPath}`);
            loadTypings();
        }
    });
}

function getClass(name) {
    return classes[name] || null;
}

module.exports = {
    loadTypings,
    watchTypingsFile,
    getClass,
};
