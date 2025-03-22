# KotlinScript

**KotlinScript** is an in-progress VS Code extension designed to provide an alternative to traditional Gradle setup, offering a plug-and-play experience with all the same functionalities. It delivers advanced syntax highlighting, semantic tokens, and intelligent suggestions for Kotlin script (`.kts`) files. Built using [tree-sitter](https://tree-sitter.github.io/), it ensures fast and context-aware parsing for Kotlin grammar.

## Features

| Feature                                     | Description                                                                                           |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **Context-Based Syntax Highlighting**        | Highlights scoped variables, functions, imports, and Kotlin-specific constructs.                      |
| **Kotlin Class/Method Suggestions**          | Offers built-in Kotlin class and method suggestions for enhanced productivity.                        |
| **Scope-Specific Variable Redeclaration Linting** | Detects and flags variable redeclarations within the same scope.                                         |
| **Import Declaration Detection**             | Detects and highlights import declarations relevant to the current context.                            |
| **General Grammar Error Linting**            | Provides linting for common syntax issues and invalid code structures.                                |
| **Full Node Colorization**                   | Applies semantic tokens for comprehensive colorization across all syntax nodes.                        |
| **Class Import CodeLens**                    | Provides inline CodeLens support to easily import undefined variables if detected in available classes. |
| **Tree-Sitter Parsing**                      | Efficiently parses files for incremental updates and ensures high performance.                        |

---

### Import Highlighting with CodeLens Support

```kotlin
import java.util.ArrayList 

val list: ArrayList<Int> = arrayOf() 
val number = Random.nextInt(0, 100) 
```

<img src="https://i.ibb.co/JWhF8zt7/image.png" alt="image" border="0" />

In this example:  
- `import` keywords are highlighted as **keywords**.  
- Imported namespaces like `java.util` and `kotlin.random` are highlighted as **types**.  
- The `nextInt` function is highlighted as a **function**.  
- CodeLens will suggest imports if undefined variables match known available classes and will add them at the top of the imports list.  

---

### Variable Highlighting and Scope-Specific Errors

```kotlin
fun calculateSum(numbers: List<Int>): Int {
    var sum = 0 // `sum` is highlighted as a scoped variable
    for (number in numbers) {
        sum += number // Both `sum` and `number` are highlighted as scoped variables
    }
    return sum // `return` is highlighted as a keyword
}
```

<img src="https://i.ibb.co/Lsqxn23/image.png" alt="image" border="0" />

In this example:  
- Scoped variables like `sum` and `number` are highlighted for clarity within their respective scopes.  
- The `return` keyword is emphasized to make it easily distinguishable.  
- Redeclaring `sum` within the loop would be flagged as an error for scope-specific redeclaration.  

---

### **Kotlin Base Class/Method Suggestions**

KotlinScript provides **built-in suggestions** for common Kotlin classes and methods to improve productivity. When typing class names, function calls, or common Kotlin utilities, relevant suggestions will automatically appear. Most methods/classes from `kotlin-stdlib-2.0.0` are available.  

For example:  

```kotlin
// 'kotlin.math.cos()' is suggested from typing "c" and detects if the method requires an import & is not already imported via imports
val date = kotlin.math.cos() 
// 'listOf()' is suggested as a built-in Kotlin utility
val list = listOf(1, 2, 3) 
```

<img src="https://i.ibb.co/WN3RTVqG/image.png" alt="image" border="0" />

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

