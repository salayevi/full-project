from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND

from apps.core.models import PreviewSession

from ..public_site_snapshot import build_public_site_snapshot


@api_view(["GET"])
@permission_classes([AllowAny])
def public_api_root(request):
    return Response(
        {
            "namespace": "public",
            "status": "ok",
            "description": "Public content API surface for the premium website and other published consumers.",
            "available_endpoints": {
                "site": request.build_absolute_uri("/api/v1/public/site/"),
                "navigation": request.build_absolute_uri("/api/v1/public/site/navigation/"),
                "snapshot": request.build_absolute_uri("/api/v1/public/snapshot/"),
                "hero": request.build_absolute_uri("/api/v1/public/hero/"),
                "about": request.build_absolute_uri("/api/v1/public/about/"),
                "achievements": request.build_absolute_uri("/api/v1/public/achievements/"),
                "footer": request.build_absolute_uri("/api/v1/public/footer/"),
                "products": request.build_absolute_uri("/api/v1/public/products/"),
                "health": request.build_absolute_uri("/api/v1/health/"),
            },
            "planned_modules": ["orders_overview", "assistant"],
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def public_site_snapshot(request):
    try:
        snapshot = build_public_site_snapshot(request=request)
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=HTTP_404_NOT_FOUND)
    return Response({"data": snapshot, "meta": {"generatedAt": snapshot["generatedAt"]}})


@api_view(["GET"])
@permission_classes([AllowAny])
def public_preview_site_snapshot(request, token):
    preview = PreviewSession.objects.filter(token=token).first()
    if preview is None or preview.is_expired:
        return Response({"detail": "Preview session was not found or expired."}, status=HTTP_404_NOT_FOUND)
    return Response({"data": preview.snapshot, "meta": {"generatedAt": preview.snapshot.get("generatedAt")}})
