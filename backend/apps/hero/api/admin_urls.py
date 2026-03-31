from django.urls import path

from .admin_views import current_hero

urlpatterns = [
    path("", current_hero, name="hero-current"),
]

