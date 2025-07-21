import django_filters
from .models import Course

class CourseFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name='categories__id')  # or category__id if renamed
    level = django_filters.NumberFilter(field_name='level__id')          # ✅ changed from CharFilter + iexact
    language = django_filters.NumberFilter(field_name='language__id')    # ✅ same here if it's a FK

    class Meta:
        model = Course
        fields = ['category', 'level', 'language']
