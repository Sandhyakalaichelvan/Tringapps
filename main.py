import tkinter as tk
from tkinter import filedialog
import file_processing
import os

def browse_file():
    filepath = filedialog.askopenfilename()
    if filepath:
        source_entry.delete(0, tk.END)
        source_entry.insert(0, filepath)
        filename = os.path.basename(filepath)  # Extract the file name from the file path
        filename_label.config(text=" " + filename)  # Display the file name
    else:
        filename_label.config(text="No file selected")


def browse_directory():
    directory = filedialog.askdirectory()
    if directory:
        destination_entry.delete(0, tk.END)
        destination_entry.insert(0, directory)

def process_file():
    source_filepath = source_entry.get()
    destination_directory = destination_entry.get()
    success = file_processing.process_file(source_filepath, destination_directory)
    if success:
        status_label.config(text="File saved successfully.")
    else:
        status_label.config(text="Error occurred while saving the file.")

def clear_fields():
    source_entry.delete(0, tk.END)
    destination_entry.delete(0, tk.END)
    filename_label.config(text="No file selected")
    status_label.config(text="")

window = tk.Tk()
window.title("File Upload and Process Example")

window.resizable(False, False)

container = tk.Frame(window, bg="#f0f0f0", padx=20, pady=20)
container.pack()

source_label = tk.Label(container, text="Source Directory:", bg="#f0f0f0")
source_label.grid(row=0, column=0, padx=5, pady=5)

source_entry = tk.Entry(container, width=20)
source_entry.grid(row=0, column=1, padx=5, pady=5)

browse_button = tk.Button(container, text="Browse File", command=browse_file)
browse_button.grid(row=0, column=2, padx=5, pady=5)

filename_label = tk.Label(container, text="No file selected", bg="#f0f0f0")
filename_label.grid(row=0, column=3, padx=5, pady=5)

space_label = tk.Label(container, text=" ", font=("Arial", 10), bg="#f0f0f0")
space_label.grid(row=1)

destination_label = tk.Label(container, text="Destination Directory:", bg="#f0f0f0")
destination_label.grid(row=2, column=0, padx=5, pady=5)

destination_entry = tk.Entry(container, width=20)
destination_entry.grid(row=2, column=1, padx=5, pady=5)

browse_directory_button = tk.Button(container, text="Browse Directory", command=browse_directory)
browse_directory_button.grid(row=2, column=2, padx=5, pady=5)

clear_button = tk.Button(container, text="Clear", command=clear_fields)
clear_button.grid(row=3, column=1, padx=5, pady=5)

process_button = tk.Button(container, text="Process", command=process_file)
process_button.grid(row=3, column=1, columnspan=2, pady=5)

status_label = tk.Label(container, text="", bg="#f0f0f0")
status_label.grid(row=4, column=1)

window.mainloop()
