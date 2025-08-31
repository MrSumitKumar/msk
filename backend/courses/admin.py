# courses/admin.py

from django.contrib import admin
from .models import (
    PlatformSettings, Course, CourseWhyLearn, CourseWhoCanJoin, 
    CourseCareerOpportunities, CourseRequirements, CourseWhatYouLearn, 
    CourseChapter, Enrollment, EnrollmentFeeHistory, ChapterTopic, 
    Category, Label, CourseLanguage
)


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
    filter_horizontal = ( 'categories', 'language', 'single_courses')

    inlines = [
        type('CourseWhyLearnInline', (BaseCourseInline,), {
            'model': CourseWhyLearn,
            'verbose_name': "Why Learn"
        }),
        type('CourseWhoCanJoinInline', (BaseCourseInline,), {
            'model': CourseWhoCanJoin,
            'verbose_name': "Who Can Join"
        }),
        type('CourseCareerOpportunitiesInline', (BaseCourseInline,), {
            'model': CourseCareerOpportunities,
            'verbose_name': "Career Opportunities"
        }),
        type('CourseRequirementsInline', (BaseCourseInline,), {
            'model': CourseRequirements,
            'verbose_name': "Requirements"
        }),
        type('CourseWhatYouLearnInline', (BaseCourseInline,), {
            'model': CourseWhatYouLearn,
            'verbose_name': "What You Learn"
        }),
        type('CourseChapterInline', (BaseCourseInline,), {
            'model': CourseChapter,
            'verbose_name': "Chapter"
        }),
    ]


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
admin.site.register(Category)
admin.site.register(Label)
admin.site.register(CourseLanguage)