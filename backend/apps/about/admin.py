from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, SortableAdminMixin, VisibilityAdminMixin

from .models import AboutSection, AboutTextItem


class AboutTextItemInline(admin.TabularInline):
    model = AboutTextItem
    extra = 0
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)


@admin.register(AboutSection)
class AboutSectionAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, admin.ModelAdmin):
    list_display = ("brand_title", "code", "publish_state", "visibility_state", "updated_at")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("brand_title", "section_label", "description")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
    inlines = (AboutTextItemInline,)


@admin.register(AboutTextItem)
class AboutTextItemAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("section", "text", "publish_state", "visibility_state", "sort_order")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("text", "section__brand_title")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
