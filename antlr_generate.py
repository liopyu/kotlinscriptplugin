import subprocess
import os
import sys

def install_antlr_python_runtime():
    """ Installs ANTLR4 runtime for Python if not already installed. """
    try:
        import antlr4
    except ImportError:
        print("ANTLR4 Python runtime not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "antlr4-python3-runtime"])
    else:
        print("ANTLR4 Python runtime is already installed.")

def generate_antlr_files(language, antlr_path, output_dir, lexer_file, parser_file):
    """ Generates lexer and parser files using ANTLR. """
    try:
        cmd = [
            "java", "-jar", antlr_path, f"-Dlanguage={language}", "-o", output_dir, lexer_file, parser_file
        ]
        print("Running ANTLR command:", " ".join(cmd))
        subprocess.run(cmd, check=True)
        print("Successfully generated files.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to generate ANTLR files: {str(e)}")
    except FileNotFoundError:
        print("Java or ANTLR jar not found. Please ensure Java is installed and the jar path is correct.")

def main():
    # Configuration variables
    antlr_path = './antlr-4.13.2-complete.jar'  # Update this path to your ANTLR jar
    output_dir = './generated'  # Output directory for generated files
    lexer_file = './src/grammar/KotlinLexer.g4'  # Path to your lexer grammar file
    parser_file = './src/grammar/KotlinParser.g4'  # Path to your parser grammar file
    target_language = 'TypeScript'  # Change to 'Java' if needed

    # Install Python ANTLR runtime for possible further processing
    install_antlr_python_runtime()

    # Generate ANTLR files
    generate_antlr_files(target_language, antlr_path, output_dir, lexer_file, parser_file)

if __name__ == "__main__":
    main()
