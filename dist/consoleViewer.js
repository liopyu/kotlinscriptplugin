(function () {
    const consoleDiv = document.getElementById('console-output');
    if (!consoleDiv) return;

    function logToConsole(type, args) {
        const line = document.createElement('div');
        line.style.whiteSpace = 'pre-wrap';
        line.style.marginBottom = '4px';

        const prefix = document.createElement('span');
        prefix.textContent = `[\${ type.toUpperCase() }]`;
        prefix.style.color = type === 'error' ? '#f55' :
            type === 'warn' ? '#ffa500' : '#66f';

        line.appendChild(prefix);
        line.appendChild(document.createTextNode(args.map(a => {
            try {
                return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
            } catch {
                return String(a);
            }
        }).join(' ')));

        consoleDiv.appendChild(line);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function (...args) {
        originalLog.apply(console, args);
        logToConsole('log', args);
    };

    console.warn = function (...args) {
        originalWarn.apply(console, args);
        logToConsole('warn', args);
    };

    console.error = function (...args) {
        originalError.apply(console, args);
        logToConsole('error', args);
    };
})();
if (consoleOutput && consoleBar) {
    consoleOutput.style.display = 'none';
    consoleBar.style.display = 'block';
}
document.getElementById('console-minimize')?.addEventListener('click', function () {
    if (consoleOutput && consoleBar) {
        consoleOutput.style.display = 'none';
        consoleBar.style.display = 'block';
    }
});

document.getElementById('console-restore')?.addEventListener('click', function () {
    if (consoleOutput && consoleBar) {
        consoleOutput.style.display = 'block';
        consoleBar.style.display = 'none';
    }
});
