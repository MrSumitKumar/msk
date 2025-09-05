from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser  

class UserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'first_name', 'email', 'phone', 'role')
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
