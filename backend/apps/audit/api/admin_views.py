from rest_framework import generics

from apps.core.api.permissions import IsStaffOperator

from ..models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogListView(generics.ListAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        return AuditLog.objects.select_related("actor").order_by("-created_at")[:50]

