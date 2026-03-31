from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.common.constants import PublishState, VisibilityState

from ..models import Achievement
from .serializers import AchievementPublicSerializer


class PublicAchievementListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = AchievementPublicSerializer

    def get_queryset(self):
        return Achievement.objects.select_related("media_asset").filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).order_by("sort_order", "created_at")

    def get_serializer_context(self):
        return {"request": self.request}
