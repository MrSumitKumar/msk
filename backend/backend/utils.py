import random
import requests
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def generate_username(first_name: str) -> str:
    first_name = first_name.replace(" ", "")  # Remove all spaces
    return first_name.upper() + str(random.randrange(11111111, 99999999))

def create_otp(digits:int):
    return random.randint(10**(digits - 1), 10**digits - 1)

def generate_random_numbers(digits:int):
    return random.randint(10**(digits - 1), 10**digits - 1)

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

def send_email(to_email, subject, text_body, html_string=None, html_template=None, context=None, fail_silently=False):
    """
    Send email with optional HTML template or HTML string fallback.

    Args:
        to_email (str): Recipient's email
        subject (str): Subject line
        text_body (str): Plaintext message (always required)
        html_template (str, optional): Path to Django HTML template
        html_string (str, optional): Raw HTML string (if not using template)
        context (dict, optional): Context for template rendering
        fail_silently (bool): Whether to suppress errors

    Returns:
        bool: True if email sent successfully, False otherwise

    Raises:
        Exception: If fail_silently=False and an error occurs
    """
    import logging
    logger = logging.getLogger(__name__)
    
    from_email = settings.DEFAULT_FROM_EMAIL
    context = context or {}

    try:
        # Validate required fields
        if not all([to_email, subject, text_body]):
            raise ValueError("Missing required fields: to_email, subject, and text_body are required")

        # Create the base message
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=from_email,
            to=[to_email],
            reply_to=[settings.EMAIL_HOST_USER]
        )

        # If template is provided, render and attach HTML
        if html_template:
            try:
                html_content = render_to_string(html_template, context)
                msg.attach_alternative(html_content, "text/html")
            except Exception as template_error:
                logger.error(f"Error rendering template {html_template}: {str(template_error)}")
                if not fail_silently:
                    raise

        # If raw HTML string is provided instead
        elif html_string:
            msg.attach_alternative(html_string, "text/html")

        # Send email
        msg.send(fail_silently=fail_silently)
        logger.info(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        logger.error(f"Error sending email to {to_email}: {str(e)}")
        if not fail_silently:
            raise
        return False
