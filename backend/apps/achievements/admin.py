from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, SortableAdminMixin, VisibilityAdminMixin

from .models import Achievement


@admin.register(Achievement)
class AchievementAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("title", "eyebrow", "publish_state", "visibility_state", "sort_order", "updated_at")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("title", "eyebrow", "description")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
