from django.urls import include, path

urlpatterns = [
    path("", include("apps.core.api.urls")),
    path("admin/", include("apps.core.api.admin_urls")),
    path("public/", include("apps.core.api.public_urls")),
]
