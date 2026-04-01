from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator

from ..services import get_current_hero
from .serializers import HeroAdminSerializer


@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsStaffOperator])
def current_hero(request):
    hero = get_current_hero()

    if request.method == "GET":
        if hero is None:
            return Response({"detail": "Hero section is not configured yet."}, status=HTTP_404_NOT_FOUND)
        return Response(HeroAdminSerializer(hero, context={"request": request}).data)

    partial = request.method == "PATCH"
    serializer = HeroAdminSerializer(hero, data=request.data, partial=partial, context={"request": request})
    serializer.is_valid(raise_exception=True)
    created = hero is None
    hero = serializer.save(code="primary")
    record_audit_event(
        action=AuditAction.CREATED if created else AuditAction.UPDATED,
        actor=request.user,
        request=request,
        target=hero,
        message=f"{'Created' if created else 'Updated'} the primary hero section.",
    )
    return Response(
        HeroAdminSerializer(hero, context={"request": request}).data,
        status=HTTP_201_CREATED if created else HTTP_200_OK,
    )

