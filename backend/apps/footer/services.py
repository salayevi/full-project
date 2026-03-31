from apps.common.constants import PublishState, VisibilityState

from .models import FooterSection


def get_footer_queryset():
    return FooterSection.objects.order_by("code")


def get_current_footer():
    queryset = get_footer_queryset()
    return queryset.filter(code="primary").first() or queryset.first()


def get_current_public_footer():
    queryset = get_footer_queryset().filter(
        publish_state=PublishState.PUBLISHED,
        visibility_state=VisibilityState.VISIBLE,
    )
    return queryset.filter(code="primary").first() or queryset.first()
