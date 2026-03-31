from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin

from .models import FooterSection


@admin.register(FooterSection)
class FooterSectionAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, admin.ModelAdmin):
    list_display = ("brand_text", "code", "publish_state", "visibility_state", "updated_at")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("brand_text", "description", "legal_text")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
