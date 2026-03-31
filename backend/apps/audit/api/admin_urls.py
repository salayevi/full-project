from django.urls import path

from .admin_views import AuditLogListView

urlpatterns = [
    path("", AuditLogListView.as_view(), name="admin-audit-log-list"),
]
