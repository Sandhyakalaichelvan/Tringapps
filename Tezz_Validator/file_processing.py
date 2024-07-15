import pandas as pd
import os
from datetime import datetime

def regex(cell):
    if isinstance(cell, str):
        # Replace underscores with spaces
        cell = cell.replace('_', ' ')
        if "T" in cell and ":" in cell:
            return cell
        else:
            # Remove all non-alphanumeric characters except spaces and commas
            cell = ''.join(c for c in cell if c.isalnum() or c.isspace() or c == ',')
            # Remove trailing commas
            cell = cell.rstrip(',')
            return cell.strip()
    else:
        return cell

def process_file(source_filepath, destination_directory):
    try:
        if not source_filepath:
            raise ValueError("No source file selected.")
        if not destination_directory:
            raise ValueError("No destination directory specified.")

        if source_filepath.endswith('.csv'):
            # Read the CSV file
            df = pd.read_csv(source_filepath)

            # Check if "Raw Data" sheet exists, if not use the first sheet
            sheet_name = "Raw Data" if "Raw Data" in df else df.columns[0]
            
            # Apply regex function to each cell in the DataFrame
            df = df.map(regex)

            # Generate a timestamp for the current time
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

            # Extract filename from the source filepath
            filename = os.path.basename(source_filepath)

            # Create destination filepath for CSV
            destination_csv_filepath = os.path.join(destination_directory, f"validated_{timestamp}_{os.path.splitext(filename)[0]}.csv")

            # Save the original CSV file with the ".csv" extension
            df.to_csv(destination_csv_filepath, index=False)
            print("CSV file saved successfully.")

        elif source_filepath.endswith('.xlsx'):
            # Load the Excel file
            xl = pd.ExcelFile(source_filepath)

            # Check if "Raw Data" sheet exists, if not use the first sheet
            sheet_name = "Raw Data" if "Raw Data" in xl.sheet_names else xl.sheet_names[0]

            # Read the Excel file with the selected sheet name
            df = pd.read_excel(xl, sheet_name=sheet_name)

            # Apply regex function to each cell in the DataFrame
            df = df.map(regex)

            # Generate a timestamp for the current time
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

            # Create destination filepath with timestamp appended and extension changed to .xlsx
            destination_xlsx_filepath = os.path.join(destination_directory, f"validated_{timestamp}_{os.path.splitext(os.path.basename(source_filepath))[0]}.xlsx")

            # Save the processed DataFrame to the destination as an Excel file
            df.to_excel(destination_xlsx_filepath, index=False)
            print("Excel file saved successfully.")

        else:
            raise ValueError("Unsupported file format")

        # Return True to indicate successful file processing
        return True

    except Exception as e:
        print("Error processing file:", e)
        # Return False to indicate error during file processing
        return False
