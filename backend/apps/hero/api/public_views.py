from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND

from ..services import get_current_public_hero
from .serializers import HeroPublicSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def current_public_hero(request):
    hero = get_current_public_hero()
    if hero is None:
        return Response({"detail": "Published hero section is not available yet."}, status=HTTP_404_NOT_FOUND)
    return Response(HeroPublicSerializer(hero, context={"request": request}).data)

