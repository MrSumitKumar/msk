# courses/signals.py

from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
from django.core.files.storage import default_storage
from .models import Course


@receiver(pre_delete, sender=Course)
def delete_course_image(sender, instance, **kwargs):
    """
    Delete course image file from storage when a Course instance is deleted.
    Ensures the file exists before attempting deletion to avoid errors.
    """
    if instance.image:
        image_path = instance.image.name
        if image_path and default_storage.exists(image_path):
            default_storage.delete(image_path)


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