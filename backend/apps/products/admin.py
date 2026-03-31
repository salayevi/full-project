from django.contrib import admin

from apps.common.admin import BaseAdminMixin, PublishableAdminMixin, SortableAdminMixin, VisibilityAdminMixin

from .models import Product, ProductColor, ProductMedia, ProductTheme


class ProductThemeInline(admin.StackedInline):
    model = ProductTheme
    extra = 0
    readonly_fields = BaseAdminMixin.readonly_fields


class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 0
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 0
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)


@admin.register(Product)
class ProductAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("title", "price", "currency", "publish_state", "visibility_state", "is_featured", "is_available", "sort_order")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter + ("currency", "is_featured", "is_available")
    search_fields = ("title", "slug", "sku", "short_description")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
    inlines = (ProductThemeInline, ProductMediaInline, ProductColorInline)


@admin.register(ProductTheme)
class ProductThemeAdmin(BaseAdminMixin, admin.ModelAdmin):
    list_display = ("product", "accent_color", "surface_color", "updated_at")


@admin.register(ProductMedia)
class ProductMediaAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("product", "asset", "role", "publish_state", "visibility_state", "sort_order")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter + ("role",)
    search_fields = ("product__title", "label", "asset__title")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)


@admin.register(ProductColor)
class ProductColorAdmin(BaseAdminMixin, PublishableAdminMixin, VisibilityAdminMixin, SortableAdminMixin, admin.ModelAdmin):
    list_display = ("product", "name", "hex_color", "publish_state", "visibility_state", "sort_order")
    list_filter = PublishableAdminMixin.list_filter + VisibilityAdminMixin.list_filter
    search_fields = ("product__title", "name")
    readonly_fields = BaseAdminMixin.readonly_fields + ("published_at",)
