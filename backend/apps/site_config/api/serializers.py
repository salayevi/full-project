from rest_framework import serializers

from apps.common.constants import PublishState
from apps.media_library.api.serializers import MediaAssetReferenceSerializer
from apps.media_library.models import MediaAsset

from ..models import NavigationLink, SiteSettings, ThemeSettings


class ThemeSettingsAdminSerializer(serializers.ModelSerializer):
    token_map = serializers.SerializerMethodField()

    class Meta:
        model = ThemeSettings
        fields = (
            "id",
            "theme_name",
            "publish_state",
            "published_at",
            "brand_primary",
            "brand_accent",
            "brand_primary_strong",
            "brand_secondary",
            "brand_soft",
            "background_page",
            "background_soft",
            "background_about",
            "background_achievements",
            "background_dark",
            "background_light_panel",
            "text_primary",
            "text_secondary",
            "text_muted",
            "text_soft",
            "text_white",
            "border_soft",
            "border_white_soft",
            "overlay_hero",
            "overlay_navbar",
            "overlay_modal",
            "surface_white",
            "surface_glass",
            "surface_modal",
            "mobile_hero_top_icon_outer_background",
            "mobile_hero_top_icon_inner_background",
            "mobile_hero_bottom_nav_background",
            "mobile_hero_bottom_nav_text_color",
            "mobile_hero_soft_shadow",
            "mobile_hero_nav_shadow",
            "token_map",
        )

    def get_token_map(self, obj):
        return obj.as_token_map()


class SiteSettingsAdminSerializer(serializers.ModelSerializer):
    logo_asset = MediaAssetReferenceSerializer(read_only=True)
    favicon_asset = MediaAssetReferenceSerializer(read_only=True)
    theme = ThemeSettingsAdminSerializer(read_only=True)

    class Meta:
        model = SiteSettings
        fields = (
            "id",
            "code",
            "site_name",
            "brand_text",
            "site_tagline",
            "site_description",
            "support_email",
            "support_phone",
            "is_active",
            "maintenance_mode",
            "logo_asset",
            "favicon_asset",
            "theme",
            "created_at",
            "updated_at",
        )


class ThemeSettingsAdminWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeSettings
        fields = (
            "theme_name",
            "publish_state",
            "brand_primary",
            "brand_accent",
            "brand_primary_strong",
            "brand_secondary",
            "brand_soft",
            "background_page",
            "background_soft",
            "background_about",
            "background_achievements",
            "background_dark",
            "background_light_panel",
            "text_primary",
            "text_secondary",
            "text_muted",
            "text_soft",
            "text_white",
            "border_soft",
            "border_white_soft",
            "overlay_hero",
            "overlay_navbar",
            "overlay_modal",
            "surface_white",
            "surface_glass",
            "surface_modal",
            "mobile_hero_top_icon_outer_background",
            "mobile_hero_top_icon_inner_background",
            "mobile_hero_bottom_nav_background",
            "mobile_hero_bottom_nav_text_color",
            "mobile_hero_soft_shadow",
            "mobile_hero_nav_shadow",
        )


class SiteSettingsAdminWriteSerializer(serializers.ModelSerializer):
    logo_asset_id = serializers.PrimaryKeyRelatedField(
        source="logo_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    favicon_asset_id = serializers.PrimaryKeyRelatedField(
        source="favicon_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    theme = ThemeSettingsAdminWriteSerializer(required=False)

    class Meta:
        model = SiteSettings
        fields = (
            "code",
            "site_name",
            "brand_text",
            "site_tagline",
            "site_description",
            "support_email",
            "support_phone",
            "is_active",
            "maintenance_mode",
            "logo_asset_id",
            "favicon_asset_id",
            "theme",
        )

    def create(self, validated_data):
        theme_data = validated_data.pop("theme", {})
        site_settings = SiteSettings.objects.create(**validated_data)
        ThemeSettings.objects.create(site=site_settings, **theme_data)
        return site_settings

    def update(self, instance, validated_data):
        theme_data = validated_data.pop("theme", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if not instance.brand_text:
            instance.brand_text = instance.site_name
        instance.save()

        if theme_data is not None:
            theme, _ = ThemeSettings.objects.get_or_create(site=instance)
            for attr, value in theme_data.items():
                setattr(theme, attr, value)
            theme.save()

        return instance


class ThemeSettingsPublicSerializer(serializers.ModelSerializer):
    theme_settings = serializers.SerializerMethodField()

    class Meta:
        model = ThemeSettings
        fields = ("theme_name", "theme_settings")

    def get_theme_settings(self, obj):
        return {
            "brand": {
                "primary": obj.brand_primary,
                "primaryStrong": obj.brand_primary_strong,
                "secondary": obj.brand_secondary,
                "soft": obj.brand_soft,
            },
            "background": {
                "page": obj.background_page,
                "soft": obj.background_soft,
                "about": obj.background_about,
                "achievements": obj.background_achievements,
                "dark": obj.background_dark,
                "lightPanel": obj.background_light_panel,
            },
            "text": {
                "primary": obj.text_primary,
                "secondary": obj.text_secondary,
                "muted": obj.text_muted,
                "soft": obj.text_soft,
                "white": obj.text_white,
            },
            "border": {
                "soft": obj.border_soft,
                "whiteSoft": obj.border_white_soft,
            },
            "overlay": {
                "hero": obj.overlay_hero,
                "navbar": obj.overlay_navbar,
                "modal": obj.overlay_modal,
            },
            "surface": {
                "white": obj.surface_white,
                "glass": obj.surface_glass,
                "modal": obj.surface_modal,
            },
            "mobileHero": {
                "topIconOuterBackground": obj.mobile_hero_top_icon_outer_background,
                "topIconInnerBackground": obj.mobile_hero_top_icon_inner_background,
                "bottomNavBackground": obj.mobile_hero_bottom_nav_background,
                "bottomNavTextColor": obj.mobile_hero_bottom_nav_text_color,
                "softShadow": obj.mobile_hero_soft_shadow,
                "navShadow": obj.mobile_hero_nav_shadow,
            },
        }


class SiteSettingsPublicSerializer(serializers.ModelSerializer):
    logo_asset = MediaAssetReferenceSerializer(read_only=True)
    favicon_asset = MediaAssetReferenceSerializer(read_only=True)
    theme = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = (
            "site_name",
            "brand_text",
            "site_tagline",
            "site_description",
            "support_email",
            "support_phone",
            "logo_asset",
            "favicon_asset",
            "theme",
        )

    def get_theme(self, obj):
        theme = getattr(obj, "theme", None)
        if theme is None or theme.publish_state != PublishState.PUBLISHED:
            return None
        return ThemeSettingsPublicSerializer(theme, context=self.context).data


class NavigationLinkAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationLink
        fields = (
            "id",
            "label",
            "href",
            "placements",
            "open_in_new_tab",
            "publish_state",
            "visibility_state",
            "sort_order",
            "published_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "published_at", "created_at", "updated_at")


class NavigationLinkPublicSerializer(serializers.ModelSerializer):
    placement = serializers.ListField(source="placements", child=serializers.CharField())
    openInNewTab = serializers.BooleanField(source="open_in_new_tab")

    class Meta:
        model = NavigationLink
        fields = ("id", "label", "href", "placement", "openInNewTab", "sort_order")
