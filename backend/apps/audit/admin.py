from django.contrib import admin

from apps.common.admin import BaseAdminMixin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(BaseAdminMixin, admin.ModelAdmin):
    list_display = ("action", "message", "actor", "target_app", "target_model", "created_at")
    list_filter = ("action", "target_app", "target_model")
    search_fields = ("message", "target_object_id", "actor__email")
    readonly_fields = (
        "id",
        "actor",
        "action",
        "target_app",
        "target_model",
        "target_object_id",
        "message",
        "metadata",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

