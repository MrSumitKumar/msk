# courses/admin.py

from django.contrib import admin
from .models import *
from django.utils.html import format_html
import nested_admin



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

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(Category)
class CourseCategoriesAdmin(admin.ModelAdmin):
    search_fields = ['name']
    ordering = ['name']


@admin.register(ProgrammingLanguage)
class ProgrammingLanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


class ChapterTopicInline(nested_admin.NestedTabularInline):
    model = ChapterTopic
    extra = 1
    show_change_link = True
    verbose_name = "Topic"
    verbose_name_plural = "Topics"


class CourseChapterInline(nested_admin.NestedTabularInline):
    model = CourseChapter
    inlines = [ChapterTopicInline]
    extra = 0
    verbose_name = "Chapter"
    verbose_name_plural = "Chapters"



@admin.register(Course)
class CourseAdmin(nested_admin.NestedModelAdmin):
    list_display = ['title', 'level', 'created_by', 'course_type', 'mode', 'status']
    list_filter = ('mode', 'status', 'course_type', 'categories')
    search_fields = (
        'title',
        'created_by__username',
        'created_by__first_name',
        'created_by__last_name'
    )
    list_editable = ['status']
    filter_horizontal = ( 'categories', 'language', 'single_courses')
    autocomplete_fields = ["categories", "created_by", "level"]
    inlines = [CourseChapterInline]


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


class FeeHistoryInline(admin.TabularInline):
    model = EnrollmentFeeHistory
    extra = 0
    show_change_link = True
    can_delete = False
    verbose_name = "History"
    verbose_name_plural = "Histories"
    template = "admin/edit_inline/tabular_total.html"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs.aggregate_sum = qs.aggregate(total=models.Sum("amount"))["total"] or 0
        return qs

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


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
    readonly_fields = ('enrolled_at',)
    autocomplete_fields = ('user', 'course')
    inlines = [FeeHistoryInline]

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


@admin.register(EnrollmentFeeSubmitRequest)
class EnrollmentFeeSubmitRequestAdmin(admin.ModelAdmin):
    # 1) Columns
    list_display = ('id', 'enrollment_link', 'amount', 'status_badge', 'submitted_at')
    list_display_links = ('id',)


    # 2) Filters + Search
    list_filter = ('status', 'submitted_at')
    search_fields = ('enrollment__user__username', 'enrollment__user__first_name')
    date_hierarchy = 'submitted_at'


    # 3) List tuning
    ordering = ('-submitted_at',)
    list_per_page = 25
    # save_on_top = True
    empty_value_display = '—'
    show_full_result_count = False


    # 4) Performance
    list_select_related = ('enrollment',)


    # Pretty UI helpers
    def enrollment_link(self, obj):
        opts = obj.enrollment._meta  # enrollment model ka meta
        url = reverse(
            f"admin:{opts.app_label}_{opts.model_name}_change",
            args=[obj.enrollment_id],
        )
        return format_html('<a href="{}">#{} {}</a>', url, obj.enrollment_id, obj.enrollment.user)
    enrollment_link.short_description = 'Enrollment'

    def status_badge(self, obj):
        color = {
        'pending': '#b58900',
        'approved': '#2aa198',
        'rejected': '#dc322f',
        }.get(obj.status, '#586e75')
        return format_html('<b style="color:{}">{}</b>', color, obj.get_status_display())
    status_badge.short_description = 'Status'


