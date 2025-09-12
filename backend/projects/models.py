from django.db import models
from courses.models import Category, Level, ProgrammingLanguage


class Project(models.Model):
    title = models.CharField(max_length=200)
    link = models.URLField(blank=True, null=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True, related_name="projects")
    categories = models.ManyToManyField(Category, related_name="projects", blank=True)
    languages = models.ManyToManyField(ProgrammingLanguage, related_name="projects", blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
