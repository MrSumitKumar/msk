from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser  
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.utils import timezone
from django.contrib import admin, messages
from django.urls import path
from django.shortcuts import redirect



# --- Unregister defaults ---
admin.site.unregister(OutstandingToken)
admin.site.unregister(BlacklistedToken)



class UserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'first_name', 'email', 'phone', 'role', 'is_staff')
    list_editable = ('role',)
    list_filter = ('role', 'gender', 'status')
    search_fields = ('username', 'email', 'first_name', 'phone')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'address', 'gender', 'status', 'picture', 'date_of_birth')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'address', 'gender', 'status', 'picture', 'date_of_birth')}),
    )

admin.site.register(CustomUser, UserAdmin)


# --- OutstandingToken Admin ---
@admin.register(OutstandingToken)
class OutstandingTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "jti", "expires_at", "created_at")
    search_fields = ("user__username", "user__email", "jti")
    list_filter = ("expires_at",)

    actions = ["delete_selected", "delete_expired"]

    def delete_expired(self, request, queryset):
        expired = queryset.filter(expires_at__lt=timezone.now())
        count = expired.count()
        expired.delete()
        self.message_user(request, f"{count} expired tokens deleted.", level=messages.SUCCESS)
    delete_expired.short_description = "Delete expired tokens"

    # --- Custom button route ---
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("clean-expired/", self.admin_site.admin_view(self.clean_expired), name="clean_expired_tokens"),
        ]
        return custom_urls + urls

    def clean_expired(self, request):
        expired = OutstandingToken.objects.filter(expires_at__lt=timezone.now())
        count = expired.count()
        expired.delete()
        self.message_user(request, f"{count} expired tokens deleted.", level=messages.SUCCESS)
        return redirect("..")  # back to token list


# --- BlacklistedToken Admin ---
@admin.register(BlacklistedToken)
class BlacklistedTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "token", "blacklisted_at")
    search_fields = ("token__jti",)
    list_filter = ("blacklisted_at",)
    actions = ["delete_selected"]
