# users/admin_urls.py

from django.urls import path
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
    path('dashboard-stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('recent-activities/', AdminRecentActivitiesView.as_view(), name='admin-recent-activities'),
    path('pending-approvals/', AdminPendingApprovalsView.as_view(), name='admin-pending-approvals'),
    path('notifications/', AdminNotificationsView.as_view(), name='admin-notifications'),
    path('users/', AdminUserManagementView.as_view(), name='admin-users'),
    path('users/<int:pk>/', AdminUserManagementView.as_view(), name='admin-user-detail'),
    path('users/bulk-action/', AdminBulkActionView.as_view(), name='admin-bulk-action'),
    path('export/<str:data_type>/', AdminExportDataView.as_view(), name='admin-export'),
    path('approve-request/<str:pk>/', AdminApproveRequestView.as_view(), name='admin-approve-request'),
]
