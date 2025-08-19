# mlm/signals.py
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_save
from .models import Member
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_member_profile(sender, instance, created, **kwargs):
    if created:
        try:
            Member.objects.get_or_create(user=instance)
        except Exception:
            logger.exception("Failed to create Member profile for user %s", instance.pk)
