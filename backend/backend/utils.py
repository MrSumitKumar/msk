import random, smtplib
from email.message import EmailMessage
import requests


def generate_username(first_name: str) -> str:
    first_name = first_name.replace(" ", "")  # Remove all spaces
    return first_name.upper() + str(random.randrange(11111111, 99999999))

def create_otp(digits:int):
    return random.randint(10**(digits - 1), 10**digits - 1)

def generate_random_numbers(digits:int):
    return random.randint(10**(digits - 1), 10**digits - 1)

def send_email(receiver_email, subject, message):
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('mskshikohabad@gmail.com', 'rxge rmww zykw befg')  # Replace with your credentials
        email = EmailMessage()
        email['From'] = 'MSK Shikohabad'
        email['To'] = receiver_email
        email['Subject'] = subject
        email.set_content(message)
        server.send_message(email)
        server.quit()
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    return True

def github_link_to_content(url):
    if "github.com" in url and "blob" in url:
        url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print("❌ Failed to fetch the note.")
        print("Error:", e)






from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_email(to_email, subject, text_body, html_template=None, context=None):
    """
    Sends an email with optional HTML content using EmailMultiAlternatives.

    :param to_email: recipient email address
    :param subject: subject line
    :param text_body: plain text fallback content
    :param html_template: path to HTML template (optional)
    :param context: context dict for HTML template (optional)
    """
    from_email = settings.DEFAULT_FROM_EMAIL

    msg = EmailMultiAlternatives(subject, text_body, from_email, [to_email])

    if html_template:
        html_content = render_to_string(html_template, context or {})
        msg.attach_alternative(html_content, "text/html")

    msg.send()
