from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, SortableAdminMixin

from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(BaseAdminMixin, PublishableAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("title", "kind", "publish_state", "is_public", "width", "height", "sort_order", "updated_at")
    list_filter = PublishableAdminMixin.list_filter + ("kind", "is_public")
    search_fields = ("title", "alt_text", "caption", "mime_type")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
