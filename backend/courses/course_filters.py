# courses/course_filters.py

import django_filters
from django.db.models import Q
from django.utils import timezone
from .models import Course, Category, Level, Language

class CourseFilter(django_filters.FilterSet):
    """
    Advanced filters for courses including price range, duration, and more.
    """
    # Basic Filters
    categories = django_filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(),
        field_name="categories"
    )
    level = django_filters.ModelChoiceFilter(
        queryset=Level.objects.all()
    )
    language = django_filters.ModelMultipleChoiceFilter(
        queryset=Language.objects.all()
    )
    
    # Price Range Filters
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte', label="Minimum Price")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte', label="Maximum Price")
    has_discount = django_filters.BooleanFilter(method='filter_has_discount', label="Has Discount")
    
    # Duration in Months Filter
    min_duration = django_filters.NumberFilter(field_name="duration", lookup_expr='gte')
    max_duration = django_filters.NumberFilter(field_name="duration", lookup_expr='lte')
    
    # Mode and Type Filters
    mode = django_filters.CharFilter(lookup_expr='iexact')
    course_type = django_filters.CharFilter(lookup_expr='iexact')
    
    # Certificate Filter
    certificate = django_filters.BooleanFilter()

    # New Filters
    has_discount = django_filters.BooleanFilter(method='filter_has_discount')
    is_new = django_filters.BooleanFilter(method='filter_is_new')
    enrollment_status = django_filters.ChoiceFilter(
        choices=[
            ('open', 'Open for Enrollment'),
            ('starting_soon', 'Starting Soon'),
            ('ongoing', 'Ongoing'),
            ('closed', 'Closed')
        ],
        method='filter_by_enrollment_status'
    )

    def filter_has_discount(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(discount__gt=0) & 
                (Q(discount_end_date__gte=timezone.now()) | Q(discount_end_date__isnull=True))
            )
        return queryset

    def filter_is_new(self, queryset, name, value):
        if value:
            thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
            return queryset.filter(created_at__gte=thirty_days_ago)
        return queryset

    def filter_by_enrollment_status(self, queryset, name, value):
        today = timezone.now()
        if value == 'open':
            return queryset.filter(
                Q(enrollment_start_date__lte=today) & 
                (Q(enrollment_end_date__gte=today) | Q(enrollment_end_date__isnull=True))
            )
        elif value == 'starting_soon':
            return queryset.filter(
                enrollment_start_date__gt=today,
                enrollment_start_date__lte=today + timezone.timedelta(days=30)
            )
        elif value == 'ongoing':
            return queryset.filter(
                enrollment_start_date__lte=today,
                course_end_date__gte=today
            )
        elif value == 'closed':
            return queryset.filter(
                Q(enrollment_end_date__lt=today) | Q(course_end_date__lt=today)
            )
        return queryset

    class Meta:
        model = Course
        fields = [
            'categories', 'level', 'language', 'mode', 'course_type', 
            'certificate', 'min_price', 'max_price', 'min_duration', 
            'max_duration', 'has_discount', 'is_new', 'enrollment_status'
        ]
