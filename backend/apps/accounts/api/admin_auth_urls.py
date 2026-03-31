from django.urls import path

from .admin_auth_views import AdminTokenRefreshView, admin_login, admin_logout, admin_me

urlpatterns = [
    path("login/", admin_login, name="admin-login"),
    path("refresh/", AdminTokenRefreshView.as_view(), name="admin-token-refresh"),
    path("logout/", admin_logout, name="admin-logout"),
    path("me/", admin_me, name="admin-me"),
]

