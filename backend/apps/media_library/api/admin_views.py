from rest_framework import generics, parsers

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator
from apps.media_library.models import MediaAsset

from .serializers import MediaAssetAdminSerializer, MediaAssetWriteSerializer


class MediaAssetListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOperator]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        queryset = MediaAsset.objects.order_by("sort_order", "title")
        search = self.request.query_params.get("search", "").strip()
        kind = self.request.query_params.get("kind", "").strip()
        publish_state = self.request.query_params.get("publish_state", "").strip()

        if search:
            queryset = queryset.filter(title__icontains=search)
        if kind:
            queryset = queryset.filter(kind=kind)
        if publish_state:
            queryset = queryset.filter(publish_state=publish_state)
        return queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return MediaAssetWriteSerializer
        return MediaAssetAdminSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        asset = serializer.save()
        record_audit_event(
            action=AuditAction.CREATED,
            actor=self.request.user,
            request=self.request,
            target=asset,
            message=f"Uploaded media asset '{asset.title}'.",
        )


class MediaAssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOperator]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    queryset = MediaAsset.objects.all()

    def get_serializer_class(self):
        if self.request.method in {"PUT", "PATCH"}:
            return MediaAssetWriteSerializer
        return MediaAssetAdminSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_update(self, serializer):
        asset = serializer.save()
        record_audit_event(
            action=AuditAction.UPDATED,
            actor=self.request.user,
            request=self.request,
            target=asset,
            message=f"Updated media asset '{asset.title}'.",
        )

    def perform_destroy(self, instance):
        title = instance.title
        record_audit_event(
            action=AuditAction.DELETED,
            actor=self.request.user,
            request=self.request,
            target=instance,
            message=f"Deleted media asset '{title}'.",
        )
        instance.delete()

