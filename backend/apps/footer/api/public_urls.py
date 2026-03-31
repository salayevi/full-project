from django.urls import path

from .public_views import current_public_footer

urlpatterns = [
    path("", current_public_footer, name="footer-public-current"),
]
