
highlightLayer.className = 'highlight-layer';
document.body.appendChild(highlightLayer);
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
        pattern = `(?<![a-zA-Z0-9])${pattern}(?![a-zA-Z0-9])`;
    }
    console.log("Escaped pattern:", pattern);
    const flags = matchCase ? 'g' : 'gi';
    let regex;
    try {
        regex = new RegExp(pattern, flags);
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