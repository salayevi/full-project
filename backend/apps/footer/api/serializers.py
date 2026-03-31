from rest_framework import serializers

from ..models import FooterSection


class FooterContactItemSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=80)
    value = serializers.CharField(max_length=255)
    href = serializers.CharField(max_length=255, allow_blank=True, required=False)


class FooterSocialLinkSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=80)
    href = serializers.CharField(max_length=255)


class FooterCallToActionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=150, allow_blank=True, required=False)
    description = serializers.CharField(allow_blank=True, required=False)
    primary_label = serializers.CharField(max_length=80, allow_blank=True, required=False)
    primary_mode = serializers.ChoiceField(choices=["login", "register"], required=False)
    secondary_label = serializers.CharField(max_length=80, allow_blank=True, required=False)
    secondary_href = serializers.CharField(max_length=255, allow_blank=True, required=False)


class FooterAdminSerializer(serializers.ModelSerializer):
    contact_items = FooterContactItemSerializer(many=True)
    social_links = FooterSocialLinkSerializer(many=True)
    cta = serializers.SerializerMethodField()
    cta_payload = FooterCallToActionSerializer(write_only=True, required=False, source="cta")

    class Meta:
        model = FooterSection
        fields = (
            "id",
            "code",
            "brand_text",
            "description",
            "contact_items",
            "social_links",
            "cta",
            "cta_payload",
            "legal_text",
            "preview_note",
            "publish_state",
            "visibility_state",
            "published_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "published_at", "cta")

    def create(self, validated_data):
        cta = validated_data.pop("cta", {})
        section = FooterSection.objects.create(**validated_data)
        self._apply_cta(section, cta)
        section.save()
        return section

    def update(self, instance, validated_data):
        cta = validated_data.pop("cta", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if cta is not None:
            self._apply_cta(instance, cta)
        instance.save()
        return instance

    def get_cta(self, obj):
        return {
            "title": obj.cta_title,
            "description": obj.cta_description,
            "primary_label": obj.cta_primary_label,
            "primary_mode": obj.cta_primary_mode,
            "secondary_label": obj.cta_secondary_label,
            "secondary_href": obj.cta_secondary_href,
        }

    def _apply_cta(self, instance, cta):
        instance.cta_title = cta.get("title", instance.cta_title)
        instance.cta_description = cta.get("description", instance.cta_description)
        instance.cta_primary_label = cta.get("primary_label", instance.cta_primary_label)
        instance.cta_primary_mode = cta.get("primary_mode", instance.cta_primary_mode)
        instance.cta_secondary_label = cta.get("secondary_label", instance.cta_secondary_label)
        instance.cta_secondary_href = cta.get("secondary_href", instance.cta_secondary_href)


class FooterPublicSerializer(serializers.ModelSerializer):
    contact_items = FooterContactItemSerializer(many=True)
    social_links = FooterSocialLinkSerializer(many=True)
    cta = serializers.SerializerMethodField()

    class Meta:
        model = FooterSection
        fields = (
            "brand_text",
            "description",
            "contact_items",
            "social_links",
            "cta",
            "legal_text",
        )

    def get_cta(self, obj):
        return {
            "title": obj.cta_title,
            "description": obj.cta_description,
            "primary_label": obj.cta_primary_label,
            "primary_mode": obj.cta_primary_mode,
            "secondary_label": obj.cta_secondary_label,
            "secondary_href": obj.cta_secondary_href,
        }
