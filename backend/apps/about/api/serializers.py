from rest_framework import serializers

from apps.common.constants import PublishState, VisibilityState
from apps.media_library.api.serializers import MediaAssetReferenceSerializer
from apps.media_library.models import MediaAsset

from ..models import AboutSection, AboutTextItem


class AboutTextItemAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutTextItem
        fields = (
            "id",
            "text",
            "sort_order",
            "publish_state",
            "visibility_state",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class AboutTextItemWriteSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)

    class Meta:
        model = AboutTextItem
        fields = ("id", "text", "sort_order", "publish_state", "visibility_state")


class AboutSectionAdminSerializer(serializers.ModelSerializer):
    image_asset = MediaAssetReferenceSerializer(read_only=True)
    image_asset_id = serializers.PrimaryKeyRelatedField(
        source="image_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    text_items = AboutTextItemAdminSerializer(many=True, read_only=True)
    text_items_payload = AboutTextItemWriteSerializer(many=True, write_only=True, required=False, source="text_items")

    class Meta:
        model = AboutSection
        fields = (
            "id",
            "code",
            "section_label",
            "brand_title",
            "description",
            "preview_note",
            "publish_state",
            "visibility_state",
            "published_at",
            "image_asset",
            "image_asset_id",
            "text_items",
            "text_items_payload",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "published_at")

    def create(self, validated_data):
        text_items = validated_data.pop("text_items", [])
        section = AboutSection.objects.create(**validated_data)
        self._sync_text_items(section, text_items)
        return section

    def update(self, instance, validated_data):
        text_items = validated_data.pop("text_items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if text_items is not None:
            self._sync_text_items(instance, text_items)

        return instance

    def _sync_text_items(self, section: AboutSection, items_data: list[dict]):
        existing_items = {str(item.id): item for item in section.text_items.all()}
        seen_ids: set[str] = set()

        for index, item_data in enumerate(items_data):
            item_id = str(item_data.pop("id", "")) or None
            sort_order = item_data.get("sort_order", index)
            item_data["sort_order"] = sort_order

            if item_id and item_id in existing_items:
                item = existing_items[item_id]
                for attr, value in item_data.items():
                    setattr(item, attr, value)
                item.save()
                seen_ids.add(item_id)
                continue

            created = AboutTextItem.objects.create(section=section, **item_data)
            seen_ids.add(str(created.id))

        for item_id, item in existing_items.items():
            if item_id not in seen_ids:
                item.delete()


class AboutTextItemPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutTextItem
        fields = ("id", "text", "sort_order")


class AboutSectionPublicSerializer(serializers.ModelSerializer):
    image_asset = MediaAssetReferenceSerializer(read_only=True)
    text_items = serializers.SerializerMethodField()

    class Meta:
        model = AboutSection
        fields = (
            "section_label",
            "brand_title",
            "description",
            "image_asset",
            "text_items",
        )

    def get_text_items(self, obj):
        items = obj.text_items.filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).order_by("sort_order", "created_at")
        return AboutTextItemPublicSerializer(items, many=True, context=self.context).data
