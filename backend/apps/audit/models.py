from django.conf import settings
from django.db import models

from apps.common.models import BaseModel


class AuditAction(models.TextChoices):
    CREATED = "created", "Created"
    UPDATED = "updated", "Updated"
    DELETED = "deleted", "Deleted"
    LOGIN = "login", "Login"
    LOGOUT = "logout", "Logout"


class AuditLog(BaseModel):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="audit_logs",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    action = models.CharField(max_length=32, choices=AuditAction.choices)
    target_app = models.CharField(max_length=100, blank=True)
    target_model = models.CharField(max_length=100, blank=True)
    target_object_id = models.CharField(max_length=100, blank=True)
    message = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        indexes = [
            models.Index(fields=("action", "created_at")),
            models.Index(fields=("target_app", "target_model")),
        ]

    def __str__(self) -> str:
        return f"{self.action}: {self.message}"

