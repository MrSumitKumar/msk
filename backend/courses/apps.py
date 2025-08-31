# courses/apps.py

from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'courses'
    verbose_name = 'Courses Management'

    def ready(self):
        """
        Import signal handlers when the application is ready.
        Using local import to avoid issues with model imports during app loading.
        """
        import courses.signals  # noqa