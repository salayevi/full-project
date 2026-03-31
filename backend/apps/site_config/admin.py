from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, SortableAdminMixin, VisibilityAdminMixin

from .models import NavigationLink, SiteSettings, ThemeSettings


class ThemeSettingsInline(admin.StackedInline):
    model = ThemeSettings
    extra = 0
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)


@admin.register(SiteSettings)
class SiteSettingsAdmin(BaseAdminMixin, admin.ModelAdmin):
    list_display = ("site_name", "brand_text", "code", "is_active", "maintenance_mode", "updated_at")
    list_filter = ("is_active", "maintenance_mode")
    search_fields = ("site_name", "brand_text", "site_tagline", "support_email")
    inlines = (ThemeSettingsInline,)


@admin.register(ThemeSettings)
class ThemeSettingsAdmin(BaseAdminMixin, PublishableAdminMixin, admin.ModelAdmin):
    list_display = ("site", "theme_name", "publish_state", "updated_at")
    list_filter = PublishableAdminMixin.list_filter
    search_fields = ("site__site_name", "theme_name")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)


@admin.register(NavigationLink)
class NavigationLinkAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("label", "href", "publish_state", "visibility_state", "sort_order", "updated_at")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("label", "href")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
