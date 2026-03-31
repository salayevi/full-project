from rest_framework import serializers


class PreviewSessionWriteSerializer(serializers.Serializer):
    module = serializers.ChoiceField(
        choices=[
            "site_settings",
            "hero",
            "about",
            "products",
            "achievements",
            "footer",
        ]
    )
    payload = serializers.JSONField()
