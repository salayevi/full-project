from rest_framework import serializers

from ..models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = (
            "id",
            "action",
            "message",
            "actor_email",
            "target_app",
            "target_model",
            "target_object_id",
            "metadata",
            "created_at",
        )

    def get_actor_email(self, obj):
        return obj.actor.email if obj.actor else None

