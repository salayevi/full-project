from .models import SiteSettings


def get_site_settings_queryset():
    return SiteSettings.objects.select_related("theme", "logo_asset", "favicon_asset").order_by("code")


def get_current_site_settings():
    queryset = get_site_settings_queryset()
    return (
        queryset.filter(code="primary", is_active=True).first()
        or queryset.filter(is_active=True).first()
        or queryset.filter(code="primary").first()
        or queryset.first()
    )
