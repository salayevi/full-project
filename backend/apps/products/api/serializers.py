from rest_framework import serializers

from apps.common.constants import PublishState, VisibilityState
from apps.media_library.api.serializers import MediaAssetReferenceSerializer
from apps.media_library.models import MediaAsset

from ..models import Product, ProductColor, ProductMedia, ProductTheme, to_public_media_panel_mode


class ProductThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTheme
        fields = (
            "accent_color",
            "surface_color",
            "text_color",
            "badge_label",
            "muted_color",
            "card_color",
            "tone",
            "media_panel_mode",
            "media_panel_color",
        )


class ProductMediaSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    asset = MediaAssetReferenceSerializer(read_only=True)
    asset_id = serializers.PrimaryKeyRelatedField(
        source="asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = ProductMedia
        fields = (
            "id",
            "label",
            "role",
            "sort_order",
            "publish_state",
            "visibility_state",
            "asset",
            "asset_id",
        )


class ProductColorSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    preview_asset = MediaAssetReferenceSerializer(read_only=True)
    preview_asset_id = serializers.PrimaryKeyRelatedField(
        source="preview_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = ProductColor
        fields = (
            "id",
            "name",
            "hex_color",
            "sort_order",
            "publish_state",
            "visibility_state",
            "preview_asset",
            "preview_asset_id",
        )


class ProductAdminSerializer(serializers.ModelSerializer):
    cover_asset = MediaAssetReferenceSerializer(read_only=True)
    cover_asset_id = serializers.PrimaryKeyRelatedField(
        source="cover_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    theme = ProductThemeSerializer(required=False)
    media_items = ProductMediaSerializer(many=True, required=False)
    color_variants = ProductColorSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "subtitle",
            "slug",
            "sku",
            "short_description",
            "description",
            "price",
            "currency",
            "badge",
            "publish_state",
            "visibility_state",
            "published_at",
            "sort_order",
            "is_featured",
            "is_available",
            "saved_enabled",
            "cart_enabled",
            "order_enabled",
            "cover_asset",
            "cover_asset_id",
            "theme",
            "media_items",
            "color_variants",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "published_at")

    def create(self, validated_data):
        theme_data = validated_data.pop("theme", {})
        media_items = validated_data.pop("media_items", [])
        color_variants = validated_data.pop("color_variants", [])
        product = Product.objects.create(**validated_data)
        ProductTheme.objects.create(product=product, **theme_data)
        self._sync_media_items(product, media_items)
        self._sync_color_variants(product, color_variants)
        return product

    def update(self, instance, validated_data):
        theme_data = validated_data.pop("theme", None)
        media_items = validated_data.pop("media_items", None)
        color_variants = validated_data.pop("color_variants", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if theme_data is not None:
            theme, _ = ProductTheme.objects.get_or_create(product=instance)
            for attr, value in theme_data.items():
                setattr(theme, attr, value)
            theme.save()

        if media_items is not None:
            self._sync_media_items(instance, media_items)

        if color_variants is not None:
            self._sync_color_variants(instance, color_variants)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get("theme") is None:
            theme, _ = ProductTheme.objects.get_or_create(product=instance)
            representation["theme"] = ProductThemeSerializer(theme).data
        return representation

    def _sync_media_items(self, product: Product, items_data: list[dict]):
        existing_items = {str(item.id): item for item in product.media_items.all()}
        seen_ids: set[str] = set()

        for index, item_data in enumerate(items_data):
            item_id = str(item_data.pop("id", "")) or None
            item_data["sort_order"] = item_data.get("sort_order", index)

            if item_id and item_id in existing_items:
                item = existing_items[item_id]
                for attr, value in item_data.items():
                    setattr(item, attr, value)
                item.save()
                seen_ids.add(item_id)
                continue

            created = ProductMedia.objects.create(product=product, **item_data)
            seen_ids.add(str(created.id))

        for item_id, item in existing_items.items():
            if item_id not in seen_ids:
                item.delete()

    def _sync_color_variants(self, product: Product, items_data: list[dict]):
        existing_items = {str(item.id): item for item in product.color_variants.all()}
        seen_ids: set[str] = set()

        for index, item_data in enumerate(items_data):
            item_id = str(item_data.pop("id", "")) or None
            item_data["sort_order"] = item_data.get("sort_order", index)

            if item_id and item_id in existing_items:
                item = existing_items[item_id]
                for attr, value in item_data.items():
                    setattr(item, attr, value)
                item.save()
                seen_ids.add(item_id)
                continue

            created = ProductColor.objects.create(product=product, **item_data)
            seen_ids.add(str(created.id))

        for item_id, item in existing_items.items():
            if item_id not in seen_ids:
                item.delete()


class ProductPublicMediaSerializer(serializers.ModelSerializer):
    asset = MediaAssetReferenceSerializer(read_only=True)

    class Meta:
        model = ProductMedia
        fields = ("id", "label", "role", "sort_order", "asset")


class ProductPublicColorSerializer(serializers.ModelSerializer):
    preview_asset = MediaAssetReferenceSerializer(read_only=True)

    class Meta:
        model = ProductColor
        fields = ("id", "name", "hex_color", "sort_order", "preview_asset")


class ProductPublicSerializer(serializers.ModelSerializer):
    cover_asset = MediaAssetReferenceSerializer(read_only=True)
    media_asset = MediaAssetReferenceSerializer(source="cover_asset", read_only=True)
    display_theme = serializers.SerializerMethodField()
    media_panel = serializers.SerializerMethodField()
    media_items = serializers.SerializerMethodField()
    color_variants = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "slug",
            "title",
            "subtitle",
            "short_description",
            "description",
            "price",
            "currency",
            "badge",
            "sort_order",
            "cover_asset",
            "media_asset",
            "display_theme",
            "media_panel",
            "media_items",
            "color_variants",
            "saved_enabled",
            "cart_enabled",
            "order_enabled",
        )

    def get_display_theme(self, obj):
        theme = getattr(obj, "theme", None)
        if theme is None:
            return None
        return {
            "bg": theme.surface_color,
            "text": theme.text_color,
            "accent": theme.accent_color,
            "muted": theme.muted_color,
            "card": theme.card_color,
            "tone": theme.tone,
        }

    def get_media_panel(self, obj):
        theme = getattr(obj, "theme", None)
        if theme is None:
            return None
        return {
            "mode": to_public_media_panel_mode(theme.media_panel_mode),
            "color": theme.media_panel_color or None,
        }

    def get_media_items(self, obj):
        items = obj.media_items.filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).select_related("asset")
        return ProductPublicMediaSerializer(items, many=True, context=self.context).data

    def get_color_variants(self, obj):
        items = obj.color_variants.filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).select_related("preview_asset")
        return ProductPublicColorSerializer(items, many=True, context=self.context).data
