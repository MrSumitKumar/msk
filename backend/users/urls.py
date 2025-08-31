from django.urls import path
from .views import *
from .admin_views import (
    AdminDashboardStatsView,
    AdminRecentActivitiesView,
    AdminPendingApprovalsView,
    AdminNotificationsView,
    AdminUserManagementView,
    AdminExportDataView,
    AdminApproveRequestView,
    AdminBulkActionView
)

urlpatterns = [
    # 🔐 Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-phone/', check_phone_unique, name='check-phone'),
    path('check-email/', check_email_unique, name='check-email'),
    path('check-sponsor/', check_sponsor, name='check-sponsor'),

    # 👤 Current Authenticated User Profile
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('me/', CurrentUserView.as_view(), name='current_user_alias'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),

    # 👑 Admin Routes
    path('admin/dashboard-stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('admin/recent-activities/', AdminRecentActivitiesView.as_view(), name='admin-recent-activities'),
    path('admin/pending-approvals/', AdminPendingApprovalsView.as_view(), name='admin-pending-approvals'),
    path('admin/notifications/', AdminNotificationsView.as_view(), name='admin-notifications'),
    path('admin/users/', AdminUserManagementView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserManagementView.as_view(), name='admin-user-detail'),
    path('admin/users/bulk-action/', AdminBulkActionView.as_view(), name='admin-bulk-action'),
    path('admin/export/<str:data_type>/', AdminExportDataView.as_view(), name='admin-export'),
    path('admin/approve-request/<str:pk>/', AdminApproveRequestView.as_view(), name='admin-approve-request'),
]
