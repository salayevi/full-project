from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin

from .models import HeroSection


@admin.register(HeroSection)
class HeroSectionAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, admin.ModelAdmin):
    list_display = ("title", "code", "publish_state", "visibility_state", "updated_at")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("title", "eyebrow", "subtitle", "highlight_text")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
