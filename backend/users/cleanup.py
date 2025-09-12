from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command

def start():
    scheduler = BackgroundScheduler()
    # Har Sunday 12:00 AM
    scheduler.add_job(
        lambda: call_command("flushexpiredtokens"),
        "cron",
        day_of_week="sun",
        hour=0,
        minute=0
    )
    scheduler.start()
