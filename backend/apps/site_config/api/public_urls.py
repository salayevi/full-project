from django.urls import path

from .public_views import current_public_site_settings, public_navigation_links

urlpatterns = [
    path("", current_public_site_settings, name="public-site-settings-detail"),
    path("navigation/", public_navigation_links, name="public-navigation-link-list"),
]
