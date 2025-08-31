import django_filters
from .models import Course

class CourseFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name='categories__id')
    level = django_filters.NumberFilter(field_name='level__id')
    language = django_filters.NumberFilter(field_name='language__id')

    class Meta:
        model = Course
        fields = ['category', 'level', 'language']