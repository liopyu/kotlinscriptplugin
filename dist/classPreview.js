const vscode = acquireVsCodeApi?.() || { postMessage: console.log };
const lines = Array.from(document.querySelectorAll('.line'));
const highlightLayer = document.createElement('div');
let matchCase = false;
let matchWhole = false;
let useRegex = false;
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
let lastMatches = [];
let allMarkElements = [];
let matchIndex = 0;
let allMatchBoxes = [];
document.getElementById('current-class')?.scrollIntoView({ block: 'start' });

document.addEventListener('click', e => {
    if (!e.ctrlKey) return;
    let target = e.target;
    while (target && !target.classList.contains('type-link')) {
        target = target.parentElement;
    }
    if (!target) return;

    const typeName = target.getAttribute('data-type');
    if (typeName) {
        vscode.postMessage({ command: 'openType', type: typeName });
        return;
    }
    const pkg = target.getAttribute('data-package');
    if (pkg) {
        vscode.postMessage({ command: 'openPackage', package: pkg });
    }
});


highlightLayer.className = 'highlight-layer';
document.body.appendChild(highlightLayer);

let index = 0;
function revealNextLine() {
    if (index < lines.length) {
        lines[index].style.opacity = '1';
        index++;
        setTimeout(revealNextLine, 20);
    }
}
revealNextLine();

window.addEventListener('message', event => {
    const msg = event.data;
    if (msg.command === 'previewResponse') {

        const box = document.getElementById('hover-preview');
        const contentBox = document.getElementById('hover-content');
        box.style.display = 'block';

        if (contentBox) {
            contentBox.innerHTML = msg.html;
        }

    }
});

document.addEventListener('mousemove', e => {
    const buffer = 8;
    const box = document.getElementById('hover-preview');
    const typeElement = lastHoveredElement;

    if (!box || box.style.display !== 'block' || !typeElement) return;

    const boxRect = box.getBoundingClientRect();
    const typeRect = typeElement.getBoundingClientRect();

    const boxZone = {
        top: boxRect.top - buffer,
        left: boxRect.left - buffer,
        right: boxRect.right + buffer,
        bottom: boxRect.bottom + buffer
    };

    const typeZone = {
        top: typeRect.top - buffer,
        left: typeRect.left - buffer,
        right: typeRect.right + buffer,
        bottom: typeRect.bottom + buffer
    };

    const insidePreviewBox =
        e.clientX >= boxZone.left &&
        e.clientX <= boxZone.right &&
        e.clientY >= boxZone.top &&
        e.clientY <= boxZone.bottom;

    const insideTypeBox =
        e.clientX >= typeZone.left &&
        e.clientX <= typeZone.right &&
        e.clientY >= typeZone.top &&
        e.clientY <= typeZone.bottom;

    if (!insidePreviewBox && !insideTypeBox) {
        box.style.display = 'none';
        lastHoveredType = null;
        isInsidePreview = false;
        typeElement.classList.remove('hovering');
        document.querySelector('.debug-overlay-wrapper')?.remove();

        lastHoveredElement = null;
    }
});



document.getElementById('search-next').addEventListener('click', () => {
    if (allMatchBoxes.length === 0) return;
    allMatchBoxes[matchIndex]?.classList.remove('current');
    matchIndex = (matchIndex + 1) % allMatchBoxes.length;
    allMatchBoxes[matchIndex].classList.add('current');
    allMatchBoxes[matchIndex].scrollIntoView({ block: "center" });
    updateMatchCount();
});

document.getElementById('search-prev').addEventListener('click', () => {
    if (allMatchBoxes.length === 0) return;
    allMatchBoxes[matchIndex]?.classList.remove('current');
    matchIndex = (matchIndex - 1 + allMatchBoxes.length) % allMatchBoxes.length;
    allMatchBoxes[matchIndex].classList.add('current');
    allMatchBoxes[matchIndex].scrollIntoView({ block: "center" });
    updateMatchCount();
});

document.getElementById('search-close').addEventListener('click', function () {
    searchBar.style.display = 'none';
    clearSearchHighlights();
    updateMatchCount();
});


document.getElementById('toggle-case').addEventListener('click', () => {
    matchCase = !matchCase;
    updateToggleUI();
    performSearch(searchInput.value);
});
document.getElementById('toggle-whole').addEventListener('click', () => {
    matchWhole = !matchWhole;
    updateToggleUI();
    performSearch(searchInput.value);
});
document.getElementById('toggle-regex').addEventListener('click', () => {
    useRegex = !useRegex;
    updateToggleUI();
    performSearch(searchInput.value);
});
function updateMatchCount() {
    const countLabel = document.getElementById('search-count');
    if (allMatchBoxes.length === 0) {
        countLabel.textContent = 'No Results';
        return;
    }
    countLabel.textContent = (matchIndex + 1) + " of " + allMatchBoxes.length;
}
function positionPreview(target) {
    const box = document.getElementById('hover-preview');
    const rect = target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    box.style.maxHeight = '';
    box.style.height = 'auto';
    box.style.display = 'block';
    box.style.visibility = 'hidden';
    box.style.left = rect.left + 'px';

    const fullBoxHeight = box.scrollHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let finalHeight = fullBoxHeight;
    let topPosition;

    if (spaceBelow >= fullBoxHeight + 20) {
        topPosition = rect.bottom + 4;
    } else if (spaceAbove >= fullBoxHeight + 20) {
        topPosition = rect.top - fullBoxHeight - 4;
    } else {
        if (spaceBelow >= spaceAbove) {
            finalHeight = Math.max(100, spaceBelow - 20);
            topPosition = rect.bottom + 4;
        } else {
            finalHeight = Math.max(100, spaceAbove - 20);
            topPosition = rect.top - finalHeight - 4;
        }
    }

    box.style.height = finalHeight + 'px';
    box.style.top = (scrollY + topPosition) + 'px';
    box.style.overflow = 'auto';
    box.style.visibility = 'visible';
}


let isInsidePreview = false;
let hoverTimeout = null;
let lastHoveredType = null;
let closeTimeout = null;

const previewBox = document.getElementById('hover-preview');
previewBox.addEventListener('mouseenter', () => {
    isInsidePreview = true;
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
});

document.addEventListener('click', (e) => {
    if (!previewBox) return;

    const target = e.target.closest('.type-link');

    if (target && e.ctrlKey) {
        const typeName = target.getAttribute('data-type');
        if (typeName) {
            vscode.postMessage({ command: 'openType', type: typeName });
        }
        return;
    }

    if (!previewBox.contains(e.target)) {
        previewBox.style.display = 'none';
        lastHoveredType = null;
        isInsidePreview = false;
        document.querySelector('.debug-overlay-wrapper')?.remove();

    }
});



window.addEventListener('error', (e) => {
    console.error("Window error:", e.message, e.filename, e.lineno);
});

document.addEventListener('mousemove', e => {
    document.body.classList.toggle('ctrl-down', e.ctrlKey);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Control') document.body.classList.add('ctrl-down');
});
document.addEventListener('keyup', e => {
    if (e.key === 'Control') document.body.classList.remove('ctrl-down');
});
function addDebugCornersAndSides() {
    const box = document.getElementById('hover-preview');
    if (!box) return;

    const existing = document.querySelector('.debug-overlay-wrapper');
    if (existing) existing.remove();

    const rect = box.getBoundingClientRect();
    const wrapper = document.createElement('div');

    wrapper.className = 'debug-overlay-wrapper';
    Object.assign(wrapper.style, {
        position: 'fixed',
        left: `${rect.left - 1}px`,
        top: `${rect.top - 1}px`,
        width: `${rect.width + 2}px`,
        height: `${rect.height + 2}px`,
        pointerEvents: 'none',
        zIndex: 10000,
    });


    const zones = [
        { className: 'corner-top-left', top: 0, left: 0, width: 20, height: 20, backgroundColor: 'rgba(255, 0, 0, 0.4)', cursor: 'nwse-resize' },
        { className: 'corner-top-right', top: 0, right: 0, width: 20, height: 20, backgroundColor: 'rgba(0, 255, 0, 0.4)', cursor: 'nesw-resize' },
        { className: 'corner-bottom-left', bottom: 0, left: 0, width: 20, height: 20, backgroundColor: 'rgba(0, 0, 255, 0.4)', cursor: 'nesw-resize' },
        { className: 'corner-bottom-right', bottom: 0, right: 0, width: 20, height: 20, backgroundColor: 'rgba(255, 255, 0, 0.4)', cursor: 'nwse-resize' },
        { className: 'side-top', top: 0, left: 20, right: 20, height: 8, backgroundColor: 'rgba(0, 255, 255, 0.4)', cursor: 'ns-resize' },
        { className: 'side-bottom', bottom: 0, left: 20, right: 20, height: 8, backgroundColor: 'rgba(255, 0, 255, 0.4)', cursor: 'ns-resize' },
        { className: 'side-left', left: 0, top: 20, bottom: 20, width: 8, backgroundColor: 'rgba(255, 165, 0, 0.4)', cursor: 'ew-resize' },
        { className: 'side-right', right: 0, top: 20, bottom: 20, width: 8, backgroundColor: 'rgba(128, 0, 128, 0.4)', cursor: 'ew-resize' }
    ];


    for (const zone of zones) {
        const el = document.createElement('div');
        if (zone.cursor) el.style.cursor = zone.cursor;
        el.className = zone.className;
        el.style.position = 'absolute';
        el.style.background = 'transparent';
        el.style.pointerEvents = 'auto';
        el.style.zIndex = '1000';

        if ('top' in zone) el.style.top = `${zone.top}px`;
        if ('bottom' in zone) el.style.bottom = `${zone.bottom}px`;
        if ('left' in zone) el.style.left = `${zone.left}px`;
        if ('right' in zone) el.style.right = `${zone.right}px`;
        if ('width' in zone) el.style.width = `${zone.width}px`;
        if ('height' in zone) el.style.height = `${zone.height}px`;

        wrapper.appendChild(el);
    }

    document.body.appendChild(wrapper);
}

(function enableDragForPreviewBox() {
    const box = document.getElementById('hover-preview');
    const minWidth = 200;
    const minHeight = 100;

    let isDragging = false;
    let isResizing = false;
    let offsetX = 0;
    let offsetY = 0;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;
    let resizeZone = null;

    const zoneCursors = {
        'corner-top-left': 'nwse-resize',
        'corner-top-right': 'nesw-resize',
        'corner-bottom-left': 'nesw-resize',
        'corner-bottom-right': 'nwse-resize',
        'side-top': 'ns-resize',
        'side-bottom': 'ns-resize',
        'side-left': 'ew-resize',
        'side-right': 'ew-resize'
    };

    document.addEventListener('mousedown', (e) => {

        const target = e.target;

        for (const cls in zoneCursors) {
            if (target.classList.contains(cls)) {
                isResizing = true;
                resizeZone = cls;
                startX = e.clientX;
                startY = e.clientY;
                const rect = box.getBoundingClientRect();
                startWidth = rect.width;
                startHeight = rect.height;
                startLeft = rect.left;
                startTop = rect.top;
                document.body.style.cursor = zoneCursors[cls];
                e.preventDefault();
                return;
            }
        }

        if (
            target.closest('pre') ||
            target.closest('code') ||
            target.closest('a')
        ) return;

        isDragging = true;
        const rect = box.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        box.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let changed = false;

        if (isResizing && resizeZone) {
            switch (resizeZone) {
                case 'corner-bottom-right':
                    box.style.width = `${Math.max(minWidth, startWidth + dx)}px`;
                    box.style.height = `${Math.max(minHeight, startHeight + dy)}px`;
                    break;
                case 'corner-bottom-left':
                    box.style.width = `${Math.max(minWidth, startWidth - dx)}px`;
                    box.style.left = `${startLeft + dx}px`;
                    box.style.height = `${Math.max(minHeight, startHeight + dy)}px`;
                    break;
                case 'corner-top-right':
                    box.style.width = `${Math.max(minWidth, startWidth + dx)}px`;
                    box.style.height = `${Math.max(minHeight, startHeight - dy)}px`;
                    box.style.top = `${startTop + dy}px`;
                    break;
                case 'corner-top-left':
                    box.style.width = `${Math.max(minWidth, startWidth - dx)}px`;
                    box.style.left = `${startLeft + dx}px`;
                    box.style.height = `${Math.max(minHeight, startHeight - dy)}px`;
                    box.style.top = `${startTop + dy}px`;
                    break;
                case 'side-right':
                    box.style.width = `${Math.max(minWidth, startWidth + dx)}px`;
                    break;
                case 'side-left':
                    box.style.width = `${Math.max(minWidth, startWidth - dx)}px`;
                    box.style.left = `${startLeft + dx}px`;
                    break;
                case 'side-bottom':
                    box.style.height = `${Math.max(minHeight, startHeight + dy)}px`;
                    break;
                case 'side-top':
                    box.style.height = `${Math.max(minHeight, startHeight - dy)}px`;
                    box.style.top = `${startTop + dy}px`;
                    break;
            }
            changed = true;
        }

        if (isDragging) {
            box.style.left = `${e.clientX - offsetX}px`;
            box.style.top = `${e.clientY - offsetY}px`;
            changed = true;
        }

        if (changed) addDebugCornersAndSides();
        else {
            const hovered = e.target;
            for (const cls in zoneCursors) {
                if (hovered.classList.contains(cls)) {
                    box.style.cursor = zoneCursors[cls];
                    return;
                }
            }
            box.style.cursor = 'grab';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging || isResizing) {
            isDragging = false;
            isResizing = false;
            resizeZone = null;
            box.style.cursor = 'grab';
            document.body.style.cursor = 'default';
        }
    });
})();

let lastHoveredElement = null;

document.addEventListener('mouseover', (e) => {
    if (isInsidePreview) return;

    const target = e.target.closest('.type-link');
    if (!target || target.classList.contains('no-hover')) return;

    const typeName = target.getAttribute('data-type');
    if (!typeName || typeName === lastHoveredType) return;

    document.querySelectorAll('.type-link.hovering').forEach(el => el.classList.remove('hovering'));
    target.classList.add('hovering');
    lastHoveredElement = target;

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
        lastHoveredType = typeName;
        isInsidePreview = true;

        positionPreview(target);
        const box = document.getElementById('hover-preview');
        const contentBox = document.getElementById('hover-content');

        box.style.display = 'block';
        if (contentBox) contentBox.innerHTML = 'Loading...';

        setTimeout(() => {
            addDebugCornersAndSides();
        }, 10);

        vscode.postMessage({ command: 'requestPreview', type: typeName });
    }, 500);
});


function updateToggleUI() {
    document.getElementById('toggle-case').classList.toggle('active', matchCase);
    document.getElementById('toggle-whole').classList.toggle('active', matchWhole);
    document.getElementById('toggle-regex').classList.toggle('active', useRegex);
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function clearSearchHighlights() {
    highlightLayer.innerHTML = '';
    allMatchBoxes = [];
    matchIndex = 0;
}

function highlightWithOverlay(regex) {
    highlightLayer.innerHTML = '';
    allMatchBoxes = [];

    lines.forEach(line => {
        const text = line.textContent;
        regex.lastIndex = 0;

        let match;
        while ((match = regex.exec(text)) !== null) {
            const fullMatch = match[0];
            const coreMatch = match[1] ? fullMatch.slice(match[1].length) : fullMatch;

            const start = match.index + (match[1]?.length ?? 0);
            const end = start + coreMatch.length;

            const range = getRangeFromTextOffsets(line, start, end);
            if (!range) continue;

            const rects = range.getClientRects();
            const union = Array.from(rects).reduce((acc, rect) => {
                if (!acc) return {
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom
                };

                return {
                    top: Math.min(acc.top, rect.top),
                    left: Math.min(acc.left, rect.left),
                    right: Math.max(acc.right, rect.right),
                    bottom: Math.max(acc.bottom, rect.bottom)
                };
            }, null);

            if (union) {
                const box = document.createElement('div');
                box.className = 'highlight-box';

                const verticalOffset = 2;
                const heightReduction = 2;

                box.style.top = union.top + window.scrollY + verticalOffset + 'px';
                box.style.left = union.left + window.scrollX + 'px';
                box.style.width = union.right - union.left + 'px';
                box.style.height = union.bottom - union.top - heightReduction + 'px';

                box.dataset.index = allMatchBoxes.length;
                box.dataset.line = line.textContent.slice(0, 40);
                box.dataset.start = start;
                highlightLayer.appendChild(box);
                allMatchBoxes.push(box);
            }


        }
    });

    if (allMatchBoxes.length > 0) {
        matchIndex = 0;
        allMatchBoxes[0].classList.add('current');
        allMatchBoxes[0].scrollIntoView({ block: "center" });
    }
    updateMatchCount();
}


function getRangeFromTextOffsets(container, startOffset, endOffset) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;

    while (walker.nextNode()) {
        const node = walker.currentNode;
        const nodeText = node.textContent;
        const nodeLength = nodeText.length;

        if (startOffset >= currentOffset && startOffset < currentOffset + nodeLength) {
            const startNode = node;
            const startNodeOffset = startOffset - currentOffset;

            let endNode = startNode;
            let endNodeOffset = Math.min(endOffset - currentOffset, nodeLength);

            let tempOffset = currentOffset + nodeLength;

            while (tempOffset < endOffset && walker.nextNode()) {
                endNode = walker.currentNode;
                const remaining = endOffset - tempOffset;
                endNodeOffset = Math.min(remaining, endNode.textContent.length);
                tempOffset += endNode.textContent.length;
            }

            const range = document.createRange();
            range.setStart(startNode, startNodeOffset);
            range.setEnd(endNode, endNodeOffset);
            return range;
        }

        currentOffset += nodeLength;
    }
    return null;
}
function performSearch(term) {
    clearSearchHighlights();
    updateMatchCount();
    if (!term.trim()) return;

    let pattern = term;

    if (!useRegex) {
        pattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    }
    if (matchWhole && !useRegex) {
        pattern = `(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`;

    }

    console.log("Escaped pattern:", pattern);

    const flags = matchCase ? 'g' : 'gi';
    let regex;
    try {
        regex = new RegExp(pattern, flags + 'u');
    } catch (err) {
        console.warn("Invalid regex:", pattern, err);
        return;
    }

    console.log("Final regex pattern:", pattern);
    highlightWithOverlay(regex);
}
searchInput.addEventListener('input', () => {
    performSearch(searchInput.value);
    updateMatchCount()
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchBar.style.display = 'block';
        let selectedText = window.getSelection()?.toString()

        if (selectedText) {
            searchInput.value = selectedText;
        } else {
            selectedText = searchInput.value;
        }

        searchInput.focus();
        searchInput.select();
        performSearch(selectedText);
    }
    if (e.key === 'Escape') {
        searchBar.style.display = 'none';
        searchInput.value = '';
        clearSearchHighlights();
    }
    if (e.key === 'Enter' && lastMatches.length > 0) {
        matchIndex = (matchIndex + 1) % lastMatches.length;
        lastMatches[matchIndex].scrollIntoView({ block: 'center' });
    }
});
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
