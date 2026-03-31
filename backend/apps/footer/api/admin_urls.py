from django.urls import path

from .admin_views import current_footer

urlpatterns = [
    path("", current_footer, name="footer-current"),
]
