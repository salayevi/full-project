from django.db.models import Prefetch

from apps.common.constants import PublishState, VisibilityState

from .models import AboutSection, AboutTextItem


def get_about_queryset():
    return AboutSection.objects.select_related("image_asset").prefetch_related(
        Prefetch("text_items", queryset=AboutTextItem.objects.order_by("sort_order", "created_at"))
    )


def get_current_about():
    queryset = get_about_queryset()
    return queryset.filter(code="primary").first() or queryset.first()


def get_current_public_about():
    queryset = get_about_queryset().filter(
        publish_state=PublishState.PUBLISHED,
        visibility_state=VisibilityState.VISIBLE,
    )
    return queryset.filter(code="primary").first() or queryset.first()
