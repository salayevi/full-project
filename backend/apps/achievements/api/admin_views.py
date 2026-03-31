from rest_framework import generics

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator

from ..models import Achievement
from .serializers import AchievementAdminSerializer


class AchievementListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = AchievementAdminSerializer

    def get_queryset(self):
        queryset = Achievement.objects.select_related("media_asset").order_by("sort_order", "created_at")
        search = self.request.query_params.get("search", "").strip()
        publish_state = self.request.query_params.get("publish_state", "").strip()

        if search:
            queryset = queryset.filter(title__icontains=search)
        if publish_state:
            queryset = queryset.filter(publish_state=publish_state)
        return queryset

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        achievement = serializer.save()
        record_audit_event(
            action=AuditAction.CREATED,
            actor=self.request.user,
            request=self.request,
            target=achievement,
            message=f"Created achievement '{achievement.title}'.",
        )


class AchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = AchievementAdminSerializer
    queryset = Achievement.objects.select_related("media_asset").all()

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_update(self, serializer):
        achievement = serializer.save()
        record_audit_event(
            action=AuditAction.UPDATED,
            actor=self.request.user,
            request=self.request,
            target=achievement,
            message=f"Updated achievement '{achievement.title}'.",
        )

    def perform_destroy(self, instance):
        title = instance.title
        record_audit_event(
            action=AuditAction.DELETED,
            actor=self.request.user,
            request=self.request,
            target=instance,
            message=f"Deleted achievement '{title}'.",
        )
        instance.delete()
