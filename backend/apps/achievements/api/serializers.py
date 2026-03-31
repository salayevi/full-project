from rest_framework import serializers

from apps.media_library.api.serializers import MediaAssetReferenceSerializer
from apps.media_library.models import MediaAsset

from ..models import Achievement


class AchievementDisplayThemeSerializer(serializers.Serializer):
    frame = serializers.CharField()
    ribbon = serializers.CharField()
    text = serializers.CharField()
    muted = serializers.CharField()


class AchievementAdminSerializer(serializers.ModelSerializer):
    media_asset = MediaAssetReferenceSerializer(read_only=True)
    media_asset_id = serializers.PrimaryKeyRelatedField(
        source="media_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    display_theme = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = (
            "id",
            "title",
            "eyebrow",
            "description",
            "publish_state",
            "visibility_state",
            "published_at",
            "sort_order",
            "media_asset",
            "media_asset_id",
            "frame_color",
            "ribbon_color",
            "text_color",
            "muted_color",
            "display_theme",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "published_at", "display_theme")

    def get_display_theme(self, obj):
        return {
            "frame": obj.frame_color,
            "ribbon": obj.ribbon_color,
            "text": obj.text_color,
            "muted": obj.muted_color,
        }


class AchievementPublicSerializer(serializers.ModelSerializer):
    media_asset = MediaAssetReferenceSerializer(read_only=True)
    display_theme = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = (
            "id",
            "title",
            "eyebrow",
            "description",
            "sort_order",
            "media_asset",
            "display_theme",
        )

    def get_display_theme(self, obj):
        return {
            "frame": obj.frame_color,
            "ribbon": obj.ribbon_color,
            "text": obj.text_color,
            "muted": obj.muted_color,
        }
