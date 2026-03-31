from rest_framework.permissions import BasePermission


class IsStaffOperator(BasePermission):
    message = "This endpoint is available only to authenticated staff users."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff)

