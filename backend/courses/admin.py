# courses/admin.py

from django.contrib import admin
from .models import *

@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ('otp_discount',)
    fieldsets = (
        (None, {
            'fields': (
                'otp_discount',
                'referral_distribution',
                'default_emi_discounts'
            )
        }),
    )

    def has_add_permission(self, request):
        """
        Prevent adding more than one PlatformSettings instance.
        """
        if PlatformSettings.objects.exists():
            return False
        return super().has_add_permission(request)


class BaseCourseInline(admin.TabularInline):
    """Base inline with default configuration."""
    extra = 1


@admin.register(Category)
class CourseCategoriesAdmin(admin.ModelAdmin):
    search_fields = ['name']
    ordering = ['name']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_by', 'course_type', 'mode', 'status']
    list_filter = ('mode', 'status', 'course_type', 'categories')
    search_fields = (
        'title',
        'created_by__username',
        'created_by__first_name',
        'created_by__last_name'
    )
    list_editable = ['status']
    filter_horizontal = ( 'categories', 'language', 'single_courses')
    autocomplete_fields = ["categories"]
    inlines = [
        type('CourseChapterInline', (BaseCourseInline,), {
            'model': CourseChapter,
            'verbose_name': "Chapter"
        }),
    ]


    def save_model(self, request, obj, form, change):
        if not obj.pk:  # only on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_change_permission(self, request, obj=None):
        """Teachers can only edit their own courses"""
        if request.user.role == 'TEACHER':
            if obj is not None and obj.created_by != request.user:
                return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        """Prevent teachers from deleting courses they don’t own"""
        if request.user.role == 'TEACHER':
            return False
        return super().has_delete_permission(request, obj)



@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = [
        'enrollment_no', 'user', 'course', 'status',
        'payment_complete', 'total_due_amount',
        'total_paid_amount', 'enrolled_at'
    ]
    list_filter = ['status', 'payment_complete']
    search_fields = [
        'user__username', 'user__first_name',
        'user__last_name', 'course__title'
    ]
    ordering = ['-enrolled_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == 'TEACHER':
            return qs.filter(course__created_by=request.user)
        return qs

    def has_delete_permission(self, request, obj=None):
        """Teachers cannot delete students from system, only manage enrollment"""
        if request.user.role == 'TEACHER':
            return False
        return super().has_delete_permission(request, obj)


@admin.register(EnrollmentFeeHistory)
class EnrollmentFeeHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'get_enrollment_no', 'user', 'course',
        'payment_method', 'amount', 'paid_at'
    ]
    list_filter = ['payment_method', 'paid_at']
    search_fields = [
        'enrollment__user__username',
        'enrollment__user__first_name',
        'enrollment__user__last_name',
        'enrollment__course__title'
    ]

    @admin.display(description="Enrollment No")
    def get_enrollment_no(self, obj):
        return obj.enrollment.enrollment_no

    @admin.display(description="User")
    def user(self, obj):
        return obj.enrollment.user

    @admin.display(description="Course")
    def course(self, obj):
        return obj.enrollment.course.title


# Register remaining simple models
admin.site.register(ChapterTopic)
admin.site.register(Label)
admin.site.register(CourseLanguage)