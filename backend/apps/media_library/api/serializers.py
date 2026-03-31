from rest_framework import serializers

from apps.media_library.models import MediaAsset


class MediaAssetReferenceSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = ("id", "title", "kind", "file_url", "alt_text", "width", "height")

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return None
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class MediaAssetAdminSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = (
            "id",
            "title",
            "kind",
            "alt_text",
            "caption",
            "mime_type",
            "size_bytes",
            "width",
            "height",
            "is_public",
            "publish_state",
            "published_at",
            "sort_order",
            "file_url",
            "created_at",
            "updated_at",
        )

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return None
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class MediaAssetWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = (
            "title",
            "file",
            "kind",
            "alt_text",
            "caption",
            "width",
            "height",
            "is_public",
            "publish_state",
            "sort_order",
        )
