from django.contrib import admin
from .models import Category, Language, Project


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "level")
    list_filter = ("level", "categories", "languages")
    search_fields = ("title", "description")
    ordering = ("title",)

    # Better selection UI
    autocomplete_fields = ("categories", "languages")
