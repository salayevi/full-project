from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND

from apps.common.constants import PublishState, VisibilityState
from apps.core.public_site_snapshot import serialize_navigation_link, serialize_site_identity

from ..models import NavigationLink
from ..services import get_current_site_settings


@api_view(["GET"])
@permission_classes([AllowAny])
def current_public_site_settings(request):
    site_settings = get_current_site_settings()
    if site_settings is None:
        return Response({"detail": "Public site settings are not configured yet."}, status=HTTP_404_NOT_FOUND)

    return Response(serialize_site_identity(site_settings))


@api_view(["GET"])
@permission_classes([AllowAny])
def public_navigation_links(request):
    queryset = NavigationLink.objects.filter(
        publish_state=PublishState.PUBLISHED,
        visibility_state=VisibilityState.VISIBLE,
    ).order_by("sort_order", "created_at")
    return Response([serialize_navigation_link(link) for link in queryset])
