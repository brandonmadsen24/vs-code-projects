"""
PDF to Text Converter
Converts all PDF files in the 'PDF Converter' folder to text files
"""

import os
from pathlib import Path

try:
    import PyPDF2
except ImportError:
    print("PyPDF2 not installed. Installing...")
    os.system("pip install PyPDF2")
    import PyPDF2


def convert_pdf_to_text(pdf_path, output_path):
    """
    Convert a single PDF file to text

    Args:
        pdf_path: Path to the PDF file
        output_path: Path where the text file will be saved
    """
    try:
        with open(pdf_path, 'rb') as pdf_file:
            # Create PDF reader object
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            # Extract text from all pages
            text_content = []
            total_pages = len(pdf_reader.pages)

            print(f"  Processing {total_pages} pages...")

            for page_num, page in enumerate(pdf_reader.pages, 1):
                text = page.extract_text()
                text_content.append(f"--- Page {page_num} ---\n{text}\n")

            # Write to text file
            with open(output_path, 'w', encoding='utf-8') as text_file:
                text_file.write('\n'.join(text_content))

            print(f"  [OK] Successfully converted ({total_pages} pages)")
            return True

    except Exception as e:
        print(f"  [ERROR] Error converting file: {str(e)}")
        return False


def main():
    # Define the PDF folder path
    pdf_folder = Path("PDF Converter")

    # Check if folder exists
    if not pdf_folder.exists():
        print(f"Error: Folder '{pdf_folder}' not found!")
        return

    # Find all PDF files
    pdf_files = list(pdf_folder.glob("*.pdf")) + list(pdf_folder.glob("*.PDF"))

    if not pdf_files:
        print(f"No PDF files found in '{pdf_folder}'")
        return

    print(f"Found {len(pdf_files)} PDF file(s) to convert\n")

    # Convert each PDF
    success_count = 0
    for pdf_path in pdf_files:
        print(f"Converting: {pdf_path.name}")

        # Create output filename (same name but with .txt extension)
        output_path = pdf_path.with_suffix('.txt')

        if convert_pdf_to_text(pdf_path, output_path):
            success_count += 1

        print()

    # Summary
    print("=" * 50)
    print(f"Conversion complete!")
    print(f"Successfully converted: {success_count}/{len(pdf_files)} files")
    print(f"Text files saved in: {pdf_folder.absolute()}")


if __name__ == "__main__":
    main()
