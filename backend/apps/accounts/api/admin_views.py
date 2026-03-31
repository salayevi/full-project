from rest_framework import generics

from apps.core.api.permissions import IsStaffOperator

from ..models import User
from .serializers import UserSummarySerializer


class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsStaffOperator]
    serializer_class = UserSummarySerializer

    def get_queryset(self):
        return User.objects.order_by("email")

