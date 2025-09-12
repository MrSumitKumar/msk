from django.contrib import admin
from .models import Project



@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "level")
    list_filter = ("level", "categories", "languages")
    search_fields = ("title", "description")
    ordering = ("title",)

    # Better selection UI
    autocomplete_fields = ("categories", "languages")
