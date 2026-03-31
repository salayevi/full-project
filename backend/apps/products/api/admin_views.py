from django.db.models import Q
from rest_framework import generics

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator

from ..models import Product
from .serializers import ProductAdminSerializer


class ProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = ProductAdminSerializer

    def get_queryset(self):
        queryset = Product.objects.select_related("cover_asset", "theme").prefetch_related(
            "media_items__asset",
            "color_variants__preview_asset",
        ).order_by("sort_order", "title")
        search = self.request.query_params.get("search", "").strip()
        publish_state = self.request.query_params.get("publish_state", "").strip()

        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(subtitle__icontains=search))
        if publish_state:
            queryset = queryset.filter(publish_state=publish_state)
        return queryset

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        product = serializer.save()
        record_audit_event(
            action=AuditAction.CREATED,
            actor=self.request.user,
            request=self.request,
            target=product,
            message=f"Created product '{product.title}'.",
        )


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = ProductAdminSerializer
    queryset = Product.objects.select_related("cover_asset", "theme").prefetch_related(
        "media_items__asset",
        "color_variants__preview_asset",
    )

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_update(self, serializer):
        product = serializer.save()
        record_audit_event(
            action=AuditAction.UPDATED,
            actor=self.request.user,
            request=self.request,
            target=product,
            message=f"Updated product '{product.title}'.",
        )

    def perform_destroy(self, instance):
        title = instance.title
        record_audit_event(
            action=AuditAction.DELETED,
            actor=self.request.user,
            request=self.request,
            target=instance,
            message=f"Deleted product '{title}'.",
        )
        instance.delete()
