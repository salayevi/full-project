from django.urls import path

from .admin_views import NavigationLinkDetailView, NavigationLinkListCreateView, current_site_settings

urlpatterns = [
    path("", current_site_settings, name="site-settings-detail"),
    path("navigation/", NavigationLinkListCreateView.as_view(), name="navigation-link-list"),
    path("navigation/<uuid:pk>/", NavigationLinkDetailView.as_view(), name="navigation-link-detail"),
]
