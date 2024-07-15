import datetime
import json
import smtplib
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from jinja2 import Template
import pdfkit
from sqlalchemy import create_engine
import fitz



def fetch_data_from_postgresql(query, params=None):
    try:
        engine = create_engine('postgresql://jmi:p14XeQ4ZI6cV@35.196.62.158:5432/isite')
        df = pd.read_sql_query(query, engine, params=params)
        return df
    except Exception as e:
        print("An error occurred while fetching data from PostgreSQL:", e)
        return None

def fetch_employee_names():
    query = 'SELECT DISTINCT "Name" FROM stage."employee"'
    df = fetch_data_from_postgresql(query)
    if df is not None:
        names = ['--ALL--'] + df['Name'].tolist()
        return names
    return ['--ALL--']

def parse_breaks(breaks_str):
    if not breaks_str:
        return {"paid_break_total": 0}
    try:
        breaks_list = json.loads(breaks_str)
        paid_break_total = 0
        paid_break_total2 = 0
        for break_item in breaks_list:
            if break_item["Type"].startswith("Paid Break"):
                time_in = datetime.datetime.strptime(break_item["TimeIn"], '%H:%M:%S').time()
                time_out = datetime.datetime.strptime(break_item["TimeOut"], '%H:%M:%S').time()
                break_duration = (datetime.datetime.combine(datetime.date.today(), time_out) - 
                                  datetime.datetime.combine(datetime.date.today(), time_in)).total_seconds() / 60
                paid_break_total += break_duration
            if break_item["Type"].startswith("Paid Break 2"):
                time_in2 = datetime.datetime.strptime(break_item["TimeIn"], '%H:%M:%S').time()
                time_out2 = datetime.datetime.strptime(break_item["TimeOut"], '%H:%M:%S').time()
                break_duration2 = (datetime.datetime.combine(datetime.date.today(), time_out2) - 
                                  datetime.datetime.combine(datetime.date.today(), time_in2)).total_seconds() / 60
                paid_break_total2 += break_duration2
        return {"paid_break_total": paid_break_total, "paid_break_total2": paid_break_total2}
    except Exception as e:
        return

def generate_pdf(html_output, pdf_path):
    path_to_wkhtmltopdf = r'C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe'
    config = pdfkit.configuration(wkhtmltopdf=path_to_wkhtmltopdf)
    pdfkit.from_string(html_output, pdf_path, configuration=config)
    print("PDF generated successfully.")

def send_email(subject, body, to_emails, attachment_path):
    from_email = "sandhya.k@tringapps.net"
    from_password = "lmzc dfhi zfqc wjab"
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = ', '.join(to_emails)
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'plain'))
    
    with open(attachment_path, "rb") as attachment:
        part = MIMEApplication(attachment.read(), Name="output.pdf")
    
    part['Content-Disposition'] = f'attachment; filename="output.pdf"'
    msg.attach(part)
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(from_email, from_password)
        server.sendmail(from_email, to_emails, msg.as_string())
    print("Email sent successfully.")

def convert_pdf_to_images(pdf_path):
    images = []
    try:
        document = fitz.open(pdf_path)
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            image_bytes = page.get_pixmap().tobytes()
            images.append(image_bytes)
        return images
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        return []

def fetch_and_generate_report(start_date, end_date, employee_name=None):
    query = """
        SELECT
            w."WoPoNo" AS wo_po_no,
            w."WorkDate" AS work_date,
            w."TruckNumber" AS truck_number,
            w."RequestType" AS request_type,
            w."BillTo" AS bill_to,
            w."ServiceSubType" AS service_sub_type,
            w."JobStatus" AS job_status,
            w."ApproverId" AS approving_manager,
            w."TicketType" AS ticket_type,
            w."PaidTime" AS paid_time,
            w."TimeIn" AS time_in,
            w."TimeOut" AS time_out,
            w."Service" AS service,
            COALESCE(e."Name", assignee."Name") AS employee_name,
            e."ManagerInfo" AS manager_info,
            w."BillableTime" AS billable_time,
            w."NonBillableTime" AS non_billable_time,
            w."ServiceType" AS service_type,
            w."NoInCrew" AS no_in_crew,
            w."IsEquipmentTransfered" AS is_equipment_transferred,
            w."JobType" AS job_type,
            w."Hauling" AS hauling,
            w."JobStatus" AS job_status,
            w."IsFinalDayTubing" AS final_day_tubing_or_rod_information,
            w."IsFishingTool" AS fishing_tool,
            w."TongTrip" AS tong_trip,
            w."DayNo" AS day_no,
            w."ManagerComments" AS manager_comments,
            w."Comment" AS comment,
            w."Breaks" AS breaks,
            woc."CorrectionsMade" AS corrections_made
        FROM
            stage."work_order" w
        LEFT JOIN
         stage."employee" e ON e."Id" = ANY(
        CASE
            WHEN w."EmployeeIds" IS NULL OR w."EmployeeIds" = '[]' OR w."EmployeeIds" = '' THEN ARRAY[]::UUID[]
            ELSE regexp_split_to_array(
                regexp_replace(w."EmployeeIds", '[\[\]"]', '', 'g'),
                ','
            )::UUID[]
        END
    )
        LEFT JOIN
                stage."employee" assignee ON assignee."Id" = w."AssigneeId"
        LEFT JOIN
            stage."work_order_office_comments" woc ON w."ReviewerId" = woc."ReviewerId"
        WHERE
            w."WorkDate" BETWEEN %s AND %s
        """
    
    params = (start_date, end_date)
    
    if employee_name and employee_name != '--ALL--':
        query += 'AND (e."Name" = %s OR assignee."Name" = %s)'
        params += (employee_name, employee_name)
    
    try:
        df = fetch_data_from_postgresql(query, params)
        if df is None:
            print("Failed to fetch data.")
            return

        df = df.loc[:, ~df.columns.duplicated()]
        
        df['breaks'] = df['breaks'].apply(parse_breaks)
        print("Parsed breaks:", df['breaks'])  

        row_count = len(df)     

        html_template = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Form Example</title>
            <style>
                body {
                    font-family: sans-serif;
                    margin: 20px;
                }

                label {
                    padding-left: 0;
                }

                .container {
                    width: 98%;
                    margin: auto;
                    padding: 10px;
                    border: none;
                    margin-bottom: 20px;
                    font-size: 12px;
                    font-weight: 200;
                    page-break-inside: avoid;
                    letter-spacing: 2px;
                }

                .container.odd {
                    background-color: rgb(255, 255, 255);
                }

                .container.even {
                    background-color: rgb(236, 236, 236);
                }

                .font {
                    color: rgb(126, 125, 125);
                    margin-right: 20px;
                }

                .header-table, .main-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .main-table {
                    margin-top: 10px;
                }

                .header-table td, .main-table td {
                    padding: 3px;
                }

                .header-table td a {
                    color: blue;
                    text-decoration: underline;
                }

                input[type="text"] {
                    width: 100px;
                    height: 19px;
                    border: 1px solid rgb(147, 147, 147);
                    text-align: center;
                }

                .comments {
                    margin-top: 10px;
                }


                .footer {
                    margin-top: 20px;
                    display: flex;
                    border-bottom: 1px solid rgb(172, 172, 172);
                    padding-bottom: 10px;
                }

                .comments p {
                    display: inline;
                    border-bottom: 1px solid rgb(147, 147, 147);
                    width: 100%;
                }

                .line1 {
                    display: flex;
                    justify-content: space-between;
                }

                .header-table{
                    padding: 10px;
                }

                .header-table tr:not(:first-child) {
                    border-top: 1px solid rgb(172, 172, 172);
                }

                .header-table tr:last-child {
                    border-bottom: 1px solid rgb(172, 172, 172);
                }

                .office {
                    padding-left: 20%;
                    color: rgb(126, 125, 125);
                }

                #tong{
                    padding-left: 50px;
                }

                #fishing_tool{
                    padding-left: 30px;
                }

                .corr {
                    padding-left: 40%;
                    color: rgb(126, 125, 125);
                }
                
                .wopo-number {
                    color: blue;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            {% for data_dict in data_list %}
            <div class="container {% if loop.index % 2 == 1 %}odd{% else %}even{% endif %}">
                <table class="header-table">
                    <tr class="line1">
                        <td class="wopo-number">{{ data_dict['wo_po_no'] }}</td>
                        <td></td>
                        <td>{{ data_dict['work_date'] }}</td>
                        <td></td>
                        <td>{{ data_dict['truck_number'] }}</td>
                        <td></td>
                        <td></td>
                        <td>{{ data_dict['request_type'] }}</td>
                    </tr>
                    <tr>
                        <td>{{ data_dict['bill_to'] }}</td>
                        <td></td>
                        <td></td>
                        <td>{{ data_dict['service_type'] }}</td>
                        <td></td>
                        <td></td>
                        <td class="font">Approving Manager</td>
                        <td><input type="text" value="{{ data_dict['approving_manager'] }}"></td>
                    </tr>
                </table>
                <table class="main-table">
                    <tr>
                        <td>{{ data_dict['ticket_type'] }}</td>
                        <td class="font">Paid Time</td>
                        <td><input type="text" value="{{ data_dict['paid_time'] }}"></td>
                        <td class="font">Time In:</td>
                        <td><input type="text" value="{{ data_dict['time_in'] }}"></td>
                        <td class="font">Time Out:</td>
                        <td><input type="text" value="{{ data_dict['time_out'] }}"></td>
                        <td>{{ data_dict['employee_name'] }}</td>
                    </tr>
                    <tr>
                        <td>{{ data_dict['service']}}</td>
                        <td class="font">Billable Time</td>
                        <td><input type="text" value="{{ data_dict['billable_time'] }}"></td>
                        <td class="font">Unpaid Lunch</td>
                        <td><input type="text" value="{{ data_dict['breaks'].get('paid_break_total2', '') }}"></td>
                        <td class="font">Non Billable Time</td>
                        <td><input type="text" value="{{ data_dict['non_billable_time'] }}"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{{ data_dict['service_type'] }}</td>
                        <td></td>
                        <td></td>
                        <td class="font">Unpaid Break</td>
                        <td><input type="text" value="{{ data_dict['breaks'].get('paid_break_total', '') }}"></td>
                        <td class="font">Paid Break 1 Time</td>
                        <td><input type="text" value="{{ data_dict['breaks'].get('paid_break_total', '') }}"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{{ data_dict['service_sub_type'] }}</td>
                        <td class="font">Crew</td>
                        <td><input type="text" value="{{ data_dict['no_in_crew'] }}"></td>
                        <td class="font">Equip Tran?</td>
                        <td><input type="text" value="{{ data_dict['is_equipment_transferred'] }}"></td>
                        <td class="font">Paid Break 2 Time</td>
                        <td><input type="text" value="{{ data_dict['breaks'].get('paid_break_total2', '') }}"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="font">Job Type:</td>
                        <td></td>
                        <td>{{ data_dict['job_type'] }}</td>
                    </tr>
                    <tr>
                        <td class="font">Job Status:</td>
                        <td>{{ data_dict['job_status'] }}</td>
                        <td class="font">Tub /Rod Info?</td>
                        <td><input type="text" value="{{ data_dict['final_day_tubing_or_rod_information'] }}"></td>
                        <td><input type="text" value="{{ data_dict['fishing_tool'] }}"></td>
                        <td class="font" id="tong">Tong Trip</td>
                        <td><input type="text" value="{{ data_dict['tong_trip'] }}"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="font">Day No</td>
                        <td>{{ data_dict['day_no'] }}</td>
                        <td>{{ data_dict['manager_info'] }}</td>
                    </tr>
                    <tr>
                        <td class="font">NB Comments</td>
                        <td>{{ data_dict['manager_comments']}}</td>
                    </tr>
                </table>
                <div class="comments">
                    <label class="font">Comments</label>
                    <td>{{ data_dict['comment'] }}</td>
                </div>
                <div class="footer">
                    <label class="office">Office</label>
                    <label class="corr">{{ data_dict['corrections_made'] }}</label>
                </div>
            </div>
            {% if loop.index % 3 == 0 %}
                <div style="page-break-after: always;"></div>
            {% endif %}
            {% endfor %}
        </body>
        </html>
        """

        template = Template(html_template)
        html_output = template.render(data_list=df.to_dict(orient='records'))

        pdf_path = 'output.pdf'
        generate_pdf(html_output, pdf_path)
        
        return pdf_path, row_count

    except Exception as e:
        print("An error occurred:", e)
        return None, 0