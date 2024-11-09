// main.cjs
// This is a CommonJS module that dynamically imports the ES module extension

// Using dynamic imports to load the ES module
(async () => {
    try {
        // Import the extension ES module
        const extension = await import('./extension.js');

        // Expose the activate and deactivate functions to VS Code
        exports.activate = extension.activate;
        exports.deactivate = extension.deactivate;
    } catch (error) {
        console.error('Failed to load the extension module:', error);
    }
})();
