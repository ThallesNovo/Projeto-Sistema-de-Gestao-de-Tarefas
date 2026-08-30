import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FRONTEND_URL = os.getenv("FRONTEND_URL")

def enviar_email_confirmacao(destinatario: str, token: str):
    link = f"{FRONTEND_URL}/confirmar-email?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Confirme seu e-mail"
    msg["From"] = SMTP_USER
    msg["To"] = destinatario

    html = f"""
    <html>
      <body>
        <h2>Confirme seu cadastro</h2>
        <p>Clique no link abaixo para confirmar seu e-mail:</p>
        <a href="{link}">{link}</a>
      </body>
    </html>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, destinatario, msg.as_string())