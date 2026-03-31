from apps.common.constants import PublishState, VisibilityState

from .models import HeroSection


def get_hero_queryset():
    return HeroSection.objects.select_related("background_asset", "mobile_background_asset", "logo_asset").order_by("code")


def get_current_hero():
    queryset = get_hero_queryset()
    return queryset.filter(code="primary").first() or queryset.first()


def get_current_public_hero():
    queryset = get_hero_queryset().filter(
        publish_state=PublishState.PUBLISHED,
        visibility_state=VisibilityState.VISIBLE,
    )
    return queryset.filter(code="primary").first() or queryset.first()
