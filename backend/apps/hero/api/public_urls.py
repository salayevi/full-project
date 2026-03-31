from django.urls import path

from .public_views import current_public_hero

urlpatterns = [
    path("", current_public_hero, name="hero-public-current"),
]

