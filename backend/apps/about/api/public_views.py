from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND

from ..services import get_current_public_about
from .serializers import AboutSectionPublicSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def current_public_about(request):
    section = get_current_public_about()
    if section is None:
        return Response({"detail": "Published about section is not available yet."}, status=HTTP_404_NOT_FOUND)
    return Response(AboutSectionPublicSerializer(section, context={"request": request}).data)
