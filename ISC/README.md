
# ISC

This project fetches data from a PostgreSQL database, processes the data, generates a PDF report using Jinja2 templates, and sends the report via email.



## Prerequisites

 - Python 3.6+
  - PostgreSQL
 -  wkhtmltopdf installed and accessible on your PATH
## Installation

- Clone the Repository
- Create and activate the virtual environment:
       

```bash
  python3 -m venv venv
  source venv/Scripts/activate 
```
- Install dependencies:
```bash
   pip install pandas
   pip install jinja2
   pip install pdfkit
   pip install sqlalchemy
   pip install psycopg2-binary
   pip install tkcalendar
```
- Update the database connection string and email credentials in function.py

- Run the script:
```bash
python function.py
```
    
