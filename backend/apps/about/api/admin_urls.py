from django.urls import path

from .admin_views import current_about

urlpatterns = [
    path("", current_about, name="about-current"),
]
