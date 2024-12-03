# KotlinScript

**KotlinScript** is an in-progress VS Code extension providing advanced syntax highlighting, semantic tokens, and intelligent suggestions for Kotlin script (`.kts`) files. Built using [tree-sitter](https://tree-sitter.github.io/), it ensures fast and context-aware parsing for Kotlin grammar.

## Features

| Feature                          | Description                                                                                           |
|----------------------------------|-------------------------------------------------------------------------------------------------------|
| **Context-Based Syntax Highlighting** | Highlights scoped variables, functions, imports, and Kotlin-specific constructs.                      |
| **Semantic Tokens**              | Provides real-time recognition of variables, functions, types, and interpolated strings.              |
| **Tree-Sitter Parsing**          | Efficiently parses files for incremental updates and ensures high performance.                        |
| **Kotlin-Specific Grammar**      | Supports scoped variables, lambda parameters, multiline strings, imports, and more.                  |

---

### Example 1: Import Highlighting

```kotlin
import java.util.ArrayList // Highlighted as 'namespace'
import kotlin.random.Random // Highlighted as 'namespace'

val list: ArrayList<Int> = arrayListOf() // Highlighted as 'type'
val number = Random.nextInt(0, 100) // Highlighted as 'function'
```

In this example:
- `import` keywords are highlighted as **keywords**.
- Imported namespaces like `java.util` and `kotlin.random` are highlighted as **types**.
- The `nextInt` function is highlighted as a **function**.

---

### Example 2: Variable Highlighting

```kotlin
fun calculateSum(numbers: List<Int>): Int {
    var sum = 0 // `sum` is highlighted as a scoped variable
    for (number in numbers) {
        sum += number // Both `sum` and `number` are highlighted as scoped variables
    }
    return sum // `return` is highlighted as a keyword
}
```

In this example:
- Scoped variables like `sum` and `number` are highlighted for clarity within their respective scopes.
- The `return` keyword is emphasized to make it easily distinguishable.

---

## Configuration

### Default Directory

The extension scans Kotlin script files (`.kts`) within the `config/scripts` directory by default. You can change this directory:

1. Open your workspace settings (`File > Preferences > Settings`).
2. Search for `KotlinScript: Kts Directory` and specify the desired path.

| Setting                      | Default Value      | Description                                                  |
|------------------------------|--------------------|--------------------------------------------------------------|
| `kotlinscript.ktsDirectory`  | `config/scripts`   | Specifies the directory to scan for `.kts` files.            |
| `kotlinscript.overwriteDefaultTheme` | `false` | Determines whether to overwrite the default theme.           |

---

## Supported Files

| File Type       | Status             |
|------------------|--------------------|
| `.kts` (scripts) | Fully supported    |
| `.kt` (classes)  | Coming soon        |

---

## Development and Contribution

(soon to be released as a VSC extension)

---

## Feedback and Issues

Report bugs or suggest features through [GitHub Issues](https://github.com/liopyu/kotlinscriptplugin/issues).

---

## Author

Developed by [Liopyu](https://github.com/Liopyu).

---
