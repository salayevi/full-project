from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    return Response(
        {
            "status": "ok",
            "service": settings.APP_NAME,
            "version": "v1",
            "links": {
                "health": request.build_absolute_uri("/api/v1/health/"),
                "admin_api": request.build_absolute_uri("/api/v1/admin/"),
                "public_api": request.build_absolute_uri("/api/v1/public/"),
                "dashboard": request.build_absolute_uri("/dashboard/"),
                "admin": request.build_absolute_uri("/admin/"),
            },
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "service": settings.APP_NAME,
            "environment": settings.ENVIRONMENT,
            "debug": settings.DEBUG,
        }
    )
