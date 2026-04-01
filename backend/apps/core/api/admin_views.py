from datetime import timedelta

from apps.about.models import AboutSection
from django.conf import settings
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from apps.accounts.models import User, UserRole
from apps.achievements.models import Achievement
from apps.audit.api.serializers import AuditLogSerializer
from apps.audit.models import AuditLog
from apps.common.constants import PublishState
from apps.core.models import PreviewSession
from apps.footer.models import FooterSection
from apps.hero.services import get_current_hero
from apps.media_library.models import MediaAsset
from apps.products.models import Product
from apps.site_config.services import get_current_site_settings

from ..public_site_snapshot import build_preview_site_snapshot
from .permissions import IsStaffOperator
from .preview_serializers import PreviewSessionWriteSerializer


@api_view(["GET"])
@permission_classes([IsStaffOperator])
def admin_api_root(request):
    return Response(
        {
            "namespace": "admin",
            "status": "ok",
            "description": "Operator-facing API surface for the future premium dashboard.",
            "available_endpoints": {
                "overview": request.build_absolute_uri("/api/v1/admin/overview/"),
                "auth": request.build_absolute_uri("/api/v1/admin/auth/me/"),
                "site_settings": request.build_absolute_uri("/api/v1/admin/site-settings/"),
                "navigation": request.build_absolute_uri("/api/v1/admin/site-settings/navigation/"),
                "hero": request.build_absolute_uri("/api/v1/admin/hero/"),
                "about": request.build_absolute_uri("/api/v1/admin/about/"),
                "achievements": request.build_absolute_uri("/api/v1/admin/achievements/"),
                "footer": request.build_absolute_uri("/api/v1/admin/footer/"),
                "products": request.build_absolute_uri("/api/v1/admin/products/"),
                "media": request.build_absolute_uri("/api/v1/admin/media/"),
                "preview": request.build_absolute_uri("/api/v1/admin/preview/site/"),
                "users": request.build_absolute_uri("/api/v1/admin/users/"),
                "audit": request.build_absolute_uri("/api/v1/admin/audit/"),
            },
            "planned_modules": ["orders_overview", "assistant"],
        }
    )


@api_view(["GET"])
@permission_classes([IsStaffOperator])
def overview_summary(request):
    site_settings = get_current_site_settings()
    hero = get_current_hero()

    response = {
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "counts": {
            "products": {
                "total": Product.objects.count(),
                "published": Product.objects.filter(publish_state=PublishState.PUBLISHED).count(),
                "draft": Product.objects.filter(publish_state=PublishState.DRAFT).count(),
            },
            "media": {
                "total": MediaAsset.objects.count(),
                "published": MediaAsset.objects.filter(publish_state=PublishState.PUBLISHED).count(),
                "public": MediaAsset.objects.filter(is_public=True).count(),
            },
            "achievements": {
                "total": Achievement.objects.count(),
                "published": Achievement.objects.filter(publish_state=PublishState.PUBLISHED).count(),
            },
            "users": {
                "total": User.objects.count(),
                "staff": User.objects.filter(is_staff=True).count(),
                "super_admin": User.objects.filter(role=UserRole.SUPER_ADMIN).count(),
            },
        },
        "modules": {
            "site_settings": {
                "configured": site_settings is not None,
                "maintenance_mode": site_settings.maintenance_mode if site_settings else False,
                "theme_ready": bool(site_settings and getattr(site_settings, "theme", None)),
            },
            "hero": {
                "configured": hero is not None,
                "published": bool(hero and hero.publish_state == PublishState.PUBLISHED),
            },
            "about": {
                "configured": AboutSection.objects.exists(),
                "published": AboutSection.objects.filter(publish_state=PublishState.PUBLISHED).exists(),
            },
            "achievements": {
                "configured": Achievement.objects.exists(),
                "published": Achievement.objects.filter(publish_state=PublishState.PUBLISHED).exists(),
            },
            "footer": {
                "configured": FooterSection.objects.exists(),
                "published": FooterSection.objects.filter(publish_state=PublishState.PUBLISHED).exists(),
            },
        },
        "recent_activity": AuditLogSerializer(
            AuditLog.objects.select_related("actor").order_by("-created_at")[:8],
            many=True,
        ).data,
    }
    return Response(response)


@api_view(["POST"])
@permission_classes([IsStaffOperator])
def create_site_preview_session(request):
    serializer = PreviewSessionWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        snapshot = build_preview_site_snapshot(
            serializer.validated_data["module"],
            serializer.validated_data["payload"],
            request=request,
        )
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=HTTP_400_BAD_REQUEST)

    preview = PreviewSession.objects.create(
        actor=request.user,
        module=serializer.validated_data["module"],
        snapshot=snapshot,
        expires_at=timezone.now() + timedelta(hours=4),
    )
    return Response(
        {
            "token": str(preview.token),
            "expires_at": preview.expires_at.isoformat(),
            "snapshot_url": request.build_absolute_uri(f"/api/v1/public/preview/{preview.token}/snapshot/"),
            "preview_url": (
                f"{settings.PUBLIC_SITE_PREVIEW_URL.rstrip('/')}/"
                f"?{settings.PUBLIC_SITE_PREVIEW_QUERY_KEY}={preview.token}"
            ),
        },
        status=HTTP_201_CREATED,
    )
