from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.common.constants import PublishState, VisibilityState

from ..models import Product
from .serializers import ProductPublicSerializer


class PublicProductListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductPublicSerializer

    def get_queryset(self):
        return Product.objects.select_related("cover_asset", "theme").prefetch_related(
            "media_items__asset",
            "color_variants__preview_asset",
        ).filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
            is_available=True,
        ).order_by("sort_order", "title")

    def get_serializer_context(self):
        return {"request": self.request}
