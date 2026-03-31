from django.urls import include, path

from .admin_views import admin_api_root, create_site_preview_session, overview_summary

urlpatterns = [
    path("", admin_api_root, name="admin-api-root"),
    path("overview/", overview_summary, name="admin-overview"),
    path("preview/site/", create_site_preview_session, name="admin-site-preview"),
    path("auth/", include("apps.accounts.api.admin_auth_urls")),
    path("users/", include("apps.accounts.api.admin_urls")),
    path("audit/", include("apps.audit.api.admin_urls")),
    path("site-settings/", include("apps.site_config.api.admin_urls")),
    path("hero/", include("apps.hero.api.admin_urls")),
    path("about/", include("apps.about.api.admin_urls")),
    path("achievements/", include("apps.achievements.api.admin_urls")),
    path("footer/", include("apps.footer.api.admin_urls")),
    path("products/", include("apps.products.api.admin_urls")),
    path("media/", include("apps.media_library.api.admin_urls")),
]
