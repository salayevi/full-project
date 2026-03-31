from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator

from ..services import get_current_about
from .serializers import AboutSectionAdminSerializer


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsStaffOperator])
def current_about(request):
    section = get_current_about()

    if request.method == "GET":
        if section is None:
            return Response({"detail": "About section is not configured yet."}, status=HTTP_404_NOT_FOUND)
        return Response(AboutSectionAdminSerializer(section, context={"request": request}).data)

    if request.method == "DELETE":
        if section is None:
            return Response({"detail": "About section is not configured yet."}, status=HTTP_404_NOT_FOUND)

        record_audit_event(
            action=AuditAction.DELETED,
            actor=request.user,
            request=request,
            target=section,
            message="Deleted the primary about section.",
        )
        section.delete()
        return Response(status=HTTP_204_NO_CONTENT)

    partial = request.method == "PATCH"
    serializer = AboutSectionAdminSerializer(section, data=request.data, partial=partial, context={"request": request})
    serializer.is_valid(raise_exception=True)
    created = section is None
    section = serializer.save(code="primary")
    record_audit_event(
        action=AuditAction.CREATED if created else AuditAction.UPDATED,
        actor=request.user,
        request=request,
        target=section,
        message=f"{'Created' if created else 'Updated'} the primary about section.",
    )
    return Response(
        AboutSectionAdminSerializer(section, context={"request": request}).data,
        status=HTTP_201_CREATED if created else HTTP_200_OK,
    )
