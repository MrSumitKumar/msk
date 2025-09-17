# courses/course_filters.py

import django_filters
from django.db.models import Q
from .models import Course

class CourseFilter(django_filters.FilterSet):
    """
    Simple filter for courses with search functionality.
    """
    search = django_filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(title__icontains=value) |
                Q(sort_description__icontains=value)
            )
        return queryset

    class Meta:
        model = Course
        fields = ['search']
