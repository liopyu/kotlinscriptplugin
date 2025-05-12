document.addEventListener('click', e => {
    let target = e.target;
    while (target && !target.classList.contains('type-link')) {
        target = target.parentElement;
    }
    if (!target) return;

    const pkg = target.getAttribute('data-package');
    if (pkg) {
        console.log("[WebView] Sending openPackage for:", pkg);
        vscode.postMessage({ command: 'openPackage', package: pkg });
        return;
    }

    const typeName = target.getAttribute('data-type');
    if (typeName) {
        console.log("[WebView] Sending openType for:", typeName);
        vscode.postMessage({ command: 'openType', type: typeName });
    }
});
function revealNextLine() {
    if (index < lines.length) {
        lines[index].style.opacity = '1';
        index++;
        setTimeout(revealNextLine, 10);
    }
}
revealNextLine();
