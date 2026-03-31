from rest_framework import serializers

from apps.media_library.api.serializers import MediaAssetReferenceSerializer
from apps.media_library.models import MediaAsset

from ..models import HeroSection


class HeroAdminSerializer(serializers.ModelSerializer):
    background_asset = MediaAssetReferenceSerializer(read_only=True)
    mobile_background_asset = MediaAssetReferenceSerializer(read_only=True)
    logo_asset = MediaAssetReferenceSerializer(read_only=True)
    background_asset_id = serializers.PrimaryKeyRelatedField(
        source="background_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    mobile_background_asset_id = serializers.PrimaryKeyRelatedField(
        source="mobile_background_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    logo_asset_id = serializers.PrimaryKeyRelatedField(
        source="logo_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = HeroSection
        fields = (
            "id",
            "code",
            "eyebrow",
            "title",
            "title_line_two",
            "subtitle",
            "highlight_text",
            "primary_cta_label",
            "primary_cta_url",
            "secondary_cta_label",
            "secondary_cta_url",
            "preview_note",
            "publish_state",
            "visibility_state",
            "published_at",
            "overlay_color",
            "logo_asset",
            "background_asset",
            "mobile_background_asset",
            "logo_asset_id",
            "background_asset_id",
            "mobile_background_asset_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "published_at")


class HeroPublicSerializer(serializers.ModelSerializer):
    background_asset = MediaAssetReferenceSerializer(read_only=True)
    mobile_background_asset = MediaAssetReferenceSerializer(read_only=True)
    logo_asset = MediaAssetReferenceSerializer(read_only=True)
    title_lines = serializers.SerializerMethodField()
    overlay = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = (
            "code",
            "eyebrow",
            "title_lines",
            "subtitle",
            "highlight_text",
            "primary_cta_label",
            "primary_cta_url",
            "secondary_cta_label",
            "secondary_cta_url",
            "logo_asset",
            "overlay",
            "background_asset",
            "mobile_background_asset",
        )

    def get_title_lines(self, obj):
        return [item for item in [obj.title, obj.title_line_two] if item]

    def get_overlay(self, obj):
        return {"color": obj.overlay_color}
