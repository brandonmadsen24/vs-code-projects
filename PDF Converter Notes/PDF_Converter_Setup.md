# PDF to Text Converter - Setup & Usage Guide

## Overview
This project contains a Python script that automatically converts all PDF files in the "PDF Converter" folder to text files.

## Prerequisites Installed
- **Python 3.12.10** - Installed via winget
- **PyPDF2 library** - Python package for PDF text extraction

## File Structure
```
VS Code Projects/
├── pdf_to_text_converter.py    # Main conversion script
├── PDF Converter/               # Folder containing PDFs and output text files
│   ├── *.pdf                   # Input PDF files
│   └── *.txt                   # Output text files (generated)
└── notes/
    └── PDF_Converter_Setup.md  # This documentation file
```

## How to Use

### Running the Converter

**Option 1: Full Path (works immediately)**
```bash
/c/Users/madse/AppData/Local/Programs/Python/Python312/python.exe pdf_to_text_converter.py
```

**Option 2: Short Command (after restarting terminal)**
```bash
python pdf_to_text_converter.py
```

### Workflow
1. Place any PDF files you want to convert into the `PDF Converter` folder
2. Run the command above from the VS Code Projects directory
3. Text files will be created with the same name as the PDFs but with `.txt` extension
4. Each text file contains all pages with page separators

## Installation Steps (for reference)

### 1. Install Python
```bash
winget install -e --id Python.Python.3.12 --source winget --accept-package-agreements --accept-source-agreements
```

### 2. Install PyPDF2
```bash
/c/Users/madse/AppData/Local/Programs/Python/Python312/python.exe -m pip install PyPDF2
```

## Script Features
- Automatically finds all PDF files in the "PDF Converter" folder
- Processes multiple files in one run
- Extracts text from all pages
- Adds page numbers and separators for easy navigation
- Shows progress and completion summary
- Handles errors gracefully

## Output Format
Each text file contains:
```
--- Page 1 ---
[Page 1 content]

--- Page 2 ---
[Page 2 content]

...
```

## Troubleshooting

### Python not found
- Restart your terminal/PowerShell to refresh PATH variables
- Or use the full path to Python executable

### Module not found errors
```bash
/c/Users/madse/AppData/Local/Programs/Python/Python312/python.exe -m pip install [module_name]
```

### Unicode errors on Windows
The script has been updated to use ASCII-compatible status messages ([OK], [ERROR]) instead of Unicode symbols.

## Date Created
February 16, 2026

## Last Updated
February 16, 2026
