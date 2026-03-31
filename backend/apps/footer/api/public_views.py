from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND

from ..services import get_current_public_footer
from .serializers import FooterPublicSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def current_public_footer(request):
    section = get_current_public_footer()
    if section is None:
        return Response({"detail": "Published footer section is not available yet."}, status=HTTP_404_NOT_FOUND)
    return Response(FooterPublicSerializer(section, context={"request": request}).data)
