# courses/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Course

@receiver(post_save, sender=Course)
def after_course_save(sender, instance, created, **kwargs):
    """
    Handle actions after a Course instance is saved.
    Currently logs course creation, but can be extended for:
    - Sending notifications
    - Triggering async tasks
    - Logging activity
    """
    if created:
        print(f"[SIGNAL] New course created: {instance.title}")
    else:
        print(f"[SIGNAL] Course updated: {instance.title}")