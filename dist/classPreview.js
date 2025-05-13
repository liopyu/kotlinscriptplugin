vscode.postMessage({ command: 'getSharedSet' });


window.addEventListener('message', event => {
    const msg = event.data;
    if (msg.command === 'sharedSetData') {
        classSet = new Set(msg.entries);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('class-search-input');
    const results = document.getElementById('class-search-results');

    input.addEventListener('input', () => {
        const query = input.value.trim();
        const matches = [];

        if (query) {
            const lowerQuery = query.toLowerCase();

            for (const classPath of classSet) {
                if (query.includes('.')) {
                    if (classPath.toLowerCase().includes(lowerQuery)) {
                        matches.push(classPath);
                    }
                } else {
                    const className = classPath.split('<')[0].split('.').pop();
                    if (className.toLowerCase().includes(lowerQuery)) {
                        matches.push(classPath);
                    }
                }
                if (matches.length >= 500) break;
            }

            matches.sort((a, b) => {
                const aIndex = a.toLowerCase().indexOf(lowerQuery);
                const bIndex = b.toLowerCase().indexOf(lowerQuery);
                return aIndex !== bIndex ? aIndex - bIndex : a.length - b.length;
            });
        }

        results.innerHTML = matches.map(classPath =>
            `<div class="search-result" data-type="${classPath}" style="padding:4px 8px; cursor:pointer;">${classPath}</div>`
        ).join('');

        results.style.display = matches.length ? 'block' : 'none';

        results.querySelectorAll('.search-result').forEach(el => {
            el.addEventListener('click', () => {
                const typeName = el.getAttribute('data-type');
                vscode.postMessage({ command: 'openType', type: typeName });
                results.style.display = 'none';
            });
        });
    });

});

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
        if (!box || !lastHoveredElement) return;
        box.style.height = '240px';
        box.style.width = '480px';
        box.style.display = 'block';
        box.style.overflow = 'auto';
        if (contentBox) {
            contentBox.innerHTML = msg.html;
        }
        positionPreview(lastHoveredElement);
        setTimeout(() => {
            addDebugCornersAndSides();
        }, 10);
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
document.addEventListener('mousemove', e => {
    const buffer = 20;
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
    if (!insidePreviewBox && !insideTypeBox && !isResizing) {
        box.style.display = 'none';
        lastHoveredType = null;
        isInsidePreview = false;
        typeElement.classList.remove('hovering');
        document.querySelector('.debug-overlay-wrapper')?.remove();
        lastHoveredElement = null;
    }
});

function positionPreview(target) {
    const box = document.getElementById('hover-preview');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const hardYOffset = 0;

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
        topPosition = rect.bottom + hardYOffset;
    } else if (spaceAbove >= fullBoxHeight + 20) {
        topPosition = rect.top - fullBoxHeight - hardYOffset;
    } else {
        if (spaceBelow >= spaceAbove) {
            finalHeight = Math.max(100, spaceBelow - 20);
            topPosition = rect.bottom + hardYOffset;
        } else {
            finalHeight = Math.max(100, spaceAbove - 20);
            topPosition = rect.top - finalHeight - hardYOffset;
        }
    }


    box.style.height = finalHeight + 'px';
    box.style.top = topPosition + 'px';
    box.style.overflow = 'auto';
    box.style.visibility = 'visible';
}




previewBox.addEventListener('mouseenter', () => {
    isInsidePreview = true;
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
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
    isResizing = false;
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