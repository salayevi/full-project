from django.urls import path

from .public_views import current_public_about

urlpatterns = [
    path("", current_public_about, name="about-public-current"),
]
