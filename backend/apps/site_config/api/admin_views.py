from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator

from ..models import NavigationLink
from ..services import get_current_site_settings
from .serializers import (
    NavigationLinkAdminSerializer,
    SiteSettingsAdminSerializer,
    SiteSettingsAdminWriteSerializer,
)


@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsStaffOperator])
def current_site_settings(request):
    site_settings = get_current_site_settings()

    if request.method == "GET":
        if site_settings is None:
            return Response({"detail": "Site settings are not configured yet."}, status=HTTP_404_NOT_FOUND)
        serializer = SiteSettingsAdminSerializer(site_settings, context={"request": request})
        return Response(serializer.data)

    partial = request.method == "PATCH"
    serializer = SiteSettingsAdminWriteSerializer(
        site_settings,
        data=request.data,
        partial=partial,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    created = site_settings is None
    site_settings = serializer.save(code="primary")
    record_audit_event(
        action=AuditAction.CREATED if created else AuditAction.UPDATED,
        actor=request.user,
        request=request,
        target=site_settings,
        message=f"{'Created' if created else 'Updated'} site settings.",
    )
    return Response(
        SiteSettingsAdminSerializer(site_settings, context={"request": request}).data,
        status=HTTP_201_CREATED if created else HTTP_200_OK,
    )


class NavigationLinkListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = NavigationLinkAdminSerializer

    def get_queryset(self):
        return NavigationLink.objects.order_by("sort_order", "created_at")

    def perform_create(self, serializer):
        link = serializer.save()
        record_audit_event(
            action=AuditAction.CREATED,
            actor=self.request.user,
            request=self.request,
            target=link,
            message=f"Created navigation link '{link.label}'.",
        )


class NavigationLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = NavigationLinkAdminSerializer
    queryset = NavigationLink.objects.all()

    def perform_update(self, serializer):
        link = serializer.save()
        record_audit_event(
            action=AuditAction.UPDATED,
            actor=self.request.user,
            request=self.request,
            target=link,
            message=f"Updated navigation link '{link.label}'.",
        )

    def perform_destroy(self, instance):
        label = instance.label
        record_audit_event(
            action=AuditAction.DELETED,
            actor=self.request.user,
            request=self.request,
            target=instance,
            message=f"Deleted navigation link '{label}'.",
        )
        instance.delete()
