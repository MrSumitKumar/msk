# courses/course_filters.py

import django_filters
from .models import Course, Category, Level, Language

class CourseFilter(django_filters.FilterSet):
    """
    Filters for courses based on category, level, and language.
    """
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    level = django_filters.ModelChoiceFilter(queryset=Level.objects.all())
    language = django_filters.ModelChoiceFilter(queryset=Language.objects.all())

    class Meta:
        model = Course
        fields = ['category', 'level', 'language']
