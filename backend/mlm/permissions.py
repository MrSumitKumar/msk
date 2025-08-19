# mlm/permissions.py
from rest_framework.permissions import BasePermission

class IsStaffOrOwner(BasePermission):
    """
    Allow access if user is staff, or owns the related Member record.
    Used in views when necessary.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        try:
            return obj.user == request.user
        except AttributeError:
            return False
