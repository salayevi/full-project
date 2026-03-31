from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT
from rest_framework_simplejwt.views import TokenRefreshView

from apps.audit.models import AuditAction
from apps.audit.services import record_audit_event
from apps.core.api.permissions import IsStaffOperator

from .serializers import AdminLoginSerializer, AuthenticatedUserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)

    user = serializer.validated_data["user"]
    record_audit_event(
        action=AuditAction.LOGIN,
        actor=user,
        request=request,
        target=user,
        message=f"{user.email} signed into the dashboard API.",
    )
    return Response(
        {
            "tokens": serializer.validated_data["tokens"],
            "user": AuthenticatedUserSerializer(user).data,
        },
        status=HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsStaffOperator])
def admin_me(request):
    return Response(AuthenticatedUserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([IsStaffOperator])
def admin_logout(request):
    record_audit_event(
        action=AuditAction.LOGOUT,
        actor=request.user,
        request=request,
        target=request.user,
        message=f"{request.user.email} signed out of the dashboard API.",
    )
    return Response(status=HTTP_204_NO_CONTENT)


class AdminTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

