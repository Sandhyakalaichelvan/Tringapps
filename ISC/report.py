import tkinter as tk
from tkinter import ttk, messagebox
from tkcalendar import DateEntry
import threading
import os
import shutil
import datetime
from report_generator import fetch_employee_names, fetch_and_generate_report, send_email, convert_pdf_to_images
MAX_LIMIT = 3000

def preview_pdf(root, pdf_path, row_count):
    global preview_frame, canvas, frame

    def go_back():
        if 'preview_frame' in globals():
            preview_frame.destroy()
        container.pack(fill=tk.BOTH, expand=True)
        container.place(relx=0.5, rely=0.5, anchor='center')

    def save_pdf():
        try:
            downloads_dir = os.path.join(os.path.expanduser('~'), 'Downloads')
            timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            save_filename = f'output_{timestamp}.pdf'
            save_path = os.path.join(downloads_dir, save_filename)
            shutil.copy(pdf_path, save_path)
            messagebox.showinfo("Save", f"PDF saved successfully to:\n{save_path}")
        except Exception as e:
            messagebox.showerror("Save Error", f"Failed to save PDF: {e}")

    if 'preview_frame' in globals():
        preview_frame.destroy()

    preview_frame = ttk.Frame(root, width=800, height=600)
    preview_frame.pack(fill=tk.BOTH, expand=True)

    try:
        print(f"rowcount, maxlimit: {row_count} , {MAX_LIMIT}")
        if row_count < MAX_LIMIT:
            create_preview(pdf_path)
        else:
            messagebox.showinfo("Failed to load preview -- result row limit exceeded 3000")

        back_button = ttk.Button(preview_frame, text="Back", command=go_back)
        back_button.pack(side=tk.BOTTOM, pady=10)
        back_button.place(relx=0.3, rely=1.0, anchor=tk.S)

        save_button = ttk.Button(preview_frame, text="Save", command=save_pdf)
        save_button.pack(side=tk.BOTTOM, pady=10)
        save_button.place(relx=0.7, rely=1.0, anchor=tk.S)

        send_button = ttk.Button(preview_frame, text="Send Email",
                                 command=lambda: send_email_with_attachment(pdf_path))
        send_button.pack(side=tk.BOTTOM, pady=10)
        send_button.place(relx=0.5, rely=1.0, anchor=tk.S)

    except Exception as e:
        messagebox.showerror("Error", f"Failed to load PDF: {e}")

def create_preview(pdf_path):
    images = convert_pdf_to_images(pdf_path)
    if images:
        canvas = tk.Canvas(preview_frame, width=800, height=600)
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        scrollbar_y = ttk.Scrollbar(preview_frame, orient=tk.VERTICAL, command=canvas.yview)
        scrollbar_y.pack(side=tk.RIGHT, fill=tk.Y)
        scrollbar_x = ttk.Scrollbar(preview_frame, orient=tk.HORIZONTAL, command=canvas.xview)
        scrollbar_x.pack(side=tk.BOTTOM, fill=tk.X)

        canvas.configure(yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)

        frame = ttk.Frame(canvas)
        canvas.create_window((0, 0), window=frame, anchor=tk.NW)

        for idx, image_data in enumerate(images):
            photo = tk.PhotoImage(data=image_data)
            label = ttk.Label(frame, image=photo)
            label.image = photo  # Keep a reference to avoid garbage collection issues
            label.grid(row=idx, column=0, pady=5, sticky=tk.W)

        # Configure scroll region
        canvas.update_idletasks()  # Update to get correct frame size
        canvas.configure(scrollregion=canvas.bbox(tk.ALL))

        # Bind mousewheel to scroll
        def on_mouse_wheel(event):
            canvas.yview_scroll(-1 * (event.delta // 120), "units")

        canvas.bind_all("<MouseWheel>", on_mouse_wheel)
    else:
        messagebox.showerror("Error", "Failed to convert PDF to images.")

def send_email_with_attachment(attachment_path):
    email = email_entry.get().strip()
    if email:
        send_email(
            subject="PDF Report",
            body="Please find the attached PDF report.",
            to_emails=[email],
            attachment_path=attachment_path
        )
        messagebox.showinfo("Success", "Email sent successfully!")
    else:
        messagebox.showerror("Input Error", "Please enter an email address.")

def on_submit():
    def process_report():
        start_date = start_date_entry.get_date().strftime('%Y-%m-%d')
        end_date = end_date_entry.get_date().strftime('%Y-%m-%d')
        employee_name = employee_name_combobox.get().strip()
        if start_date and end_date:
            print(f"Generating report for the period: {start_date} to {end_date}")
            pdf_path, row_count = fetch_and_generate_report(start_date, end_date, employee_name)
            if pdf_path:
                container.pack_forget()
                preview_pdf(root, pdf_path, row_count)
        else:
            messagebox.showerror("Input Error", "Please enter both start and end dates.")

        submit_button.config(text="Generate Report", state=tk.NORMAL)

    submit_button.config(text="Processing...", state=tk.DISABLED)
    threading.Thread(target=process_report).start()

def filter_employee_names(event):
    search_text = employee_name_combobox.get().strip().lower()
    exact_matches = [name for name in all_employee_names if search_text == name.lower()]
    partial_matches = sorted([name for name in all_employee_names if search_text in name.lower() and search_text != name.lower()])
    filtered_names = exact_matches + partial_matches
    employee_name_combobox['values'] = filtered_names

def open_combobox_dropdown(event):
    employee_name_combobox.event_generate('<Down>')

root = tk.Tk()
root.title("Employee Report Generator")
root.resizable(False, False)

screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
window_width = 600
window_height = int(screen_height * 0.6)

position_x = (screen_width // 2) - (window_width // 2)
position_y = (screen_height // 2) - (window_height // 2)

root.geometry(f"{window_width}x{window_height}+{position_x}+{position_y}")

container = ttk.Frame(root, padding=10, borderwidth=2, relief="solid")
container.place(relx=0.5, rely=0.5, anchor='center')

ttk.Label(container, text="Start Date:").grid(column=0, row=0, padx=10, pady=5, sticky='e')
start_date_entry = DateEntry(container, width=17, background='darkblue', foreground='white', borderwidth=2)
start_date_entry.grid(column=1, row=0, padx=10, pady=5, sticky='w')

ttk.Label(container, text="End Date:").grid(column=0, row=1, padx=10, pady=5, sticky='e')
end_date_entry = DateEntry(container, width=17, background='darkblue', foreground='white', borderwidth=2)
end_date_entry.grid(column=1, row=1, padx=10, pady=5, sticky='w')

ttk.Label(container, text="Employee Name:").grid(column=0, row=2, padx=10, pady=5, sticky='e')

employee_name_combobox = ttk.Combobox(container, width=17)
employee_name_combobox.grid(column=1, row=2, padx=10, pady=5, sticky='w')

all_employee_names = sorted(fetch_employee_names())
employee_name_combobox['values'] = all_employee_names

employee_name_combobox.bind('<KeyRelease>', filter_employee_names)
employee_name_combobox.bind('<Return>', open_combobox_dropdown)

ttk.Label(container, text="Email:").grid(column=0, row=3, padx=10, pady=5, sticky='e')
email_entry = ttk.Entry(container, width=20)
email_entry.grid(column=1, row=3, padx=10, pady=5, sticky='w')

submit_button = ttk.Button(container, text="Generate Report", command=on_submit)
submit_button.grid(column=0, row=4, columnspan=2, pady=10)

root.mainloop()