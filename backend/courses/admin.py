from django.contrib import admin
from .models import *

class CourseWhyLearn_TabularInline(admin.TabularInline):
    model = CourseWhyLearn
    extra = 1
    verbose_name = "Why Learn"  

class CourseWhoCanJoin_TabularInline(admin.TabularInline):
    model = CourseWhoCanJoin
    extra = 1
    verbose_name = "Who Can Join"

class CourseCareerOpportunities_TabularInline(admin.TabularInline):
    model = CourseCareerOpportunities
    extra = 1
    verbose_name = "Career Opportunities"

class CourseRequirements_TabularInline(admin.TabularInline):
    model = CourseRequirements
    extra = 1
    verbose_name = "Requirements"

class CourseWhatYouLearn_TabularInline(admin.TabularInline):
    model = CourseWhatYouLearn
    extra = 1  
    verbose_name = "What You Learn"

class CourseChapter_TabularInline(admin.TabularInline):
    model = CourseChapter
    extra = 1
    verbose_name = "Chapter"

    
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_by', 'course_type', 'mode', 'status']
    list_filter = ('mode', 'status', 'course_type', 'categories')
    search_fields = ('title', 'created_by__username', 'created_by__first_name', 'created_by__last_name')
    inlines = (
        CourseWhyLearn_TabularInline,
        CourseWhoCanJoin_TabularInline,
        CourseCareerOpportunities_TabularInline,
        CourseRequirements_TabularInline,
        CourseWhatYouLearn_TabularInline,
        CourseChapter_TabularInline,
    )
    filter_horizontal = ('language', 'single_courses')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['enrollment_no', 'user', 'course', 'status', 'payment_complete', 'total_due_amount', 'total_paid_amount', 'enrolled_at']
    list_filter = ['status', 'payment_complete']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'course__title']
    ordering = ['-enrolled_at']

@admin.register(EnrollmentRequest)
class EnrollmentRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'order_id', 'status']
    list_filter = ['status']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'order_id']

@admin.register(EnrollmentEmi)
class EnrollmentEmiAdmin(admin.ModelAdmin):
    list_display = ['get_enrollment_no', 'user', 'emi_number', 'amount', 'due_date', 'status', 'paid_at']
    list_filter = ['status', 'due_date']
    search_fields = ['enrollment__user__username', 'enrollment__user__first_name', 'enrollment__user__last_name']

    def get_enrollment_no(self, obj):
        return obj.enrollment.enrollment_no
    get_enrollment_no.short_description = "Enrollment No"

    def user(self, obj):
        return obj.enrollment.user
    user.short_description = "User"

@admin.register(EnrollmentFeeHistory)
class EnrollmentFeeHistoryAdmin(admin.ModelAdmin):
    list_display = ['get_enrollment_no', 'user', 'course', 'payment_method', 'amount', 'paid_at']
    list_filter = ['payment_method', 'paid_at']
    search_fields = ['enrollment__user__username', 'enrollment__user__first_name', 'enrollment__user__last_name', 'enrollment__course__title']

    def get_enrollment_no(self, obj):
        return obj.enrollment.enrollment_no
    get_enrollment_no.short_description = "Enrollment No"

    def user(self, obj):
        return obj.enrollment.user
    user.short_description = "User"

    def course(self, obj):
        return obj.enrollment.course.title
    course.short_description = "Course"


admin.site.register(ChapterTopic)
admin.site.register(CourseEMI)
admin.site.register(Category)
admin.site.register(Label)
admin.site.register(CourseLanguage)
