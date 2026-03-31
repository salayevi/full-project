from django.urls import include, path

from .public_views import public_api_root, public_preview_site_snapshot, public_site_snapshot

urlpatterns = [
    path("", public_api_root, name="public-api-root"),
    path("snapshot/", public_site_snapshot, name="public-site-snapshot"),
    path("preview/<uuid:token>/snapshot/", public_preview_site_snapshot, name="public-preview-site-snapshot"),
    path("site/", include("apps.site_config.api.public_urls")),
    path("hero/", include("apps.hero.api.public_urls")),
    path("about/", include("apps.about.api.public_urls")),
    path("achievements/", include("apps.achievements.api.public_urls")),
    path("footer/", include("apps.footer.api.public_urls")),
    path("products/", include("apps.products.api.public_urls")),
]
