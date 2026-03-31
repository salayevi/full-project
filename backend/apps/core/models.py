import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.common.models import BaseModel


class PreviewSession(BaseModel):
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="preview_sessions",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    module = models.CharField(max_length=64)
    snapshot = models.JSONField(default=dict)
    expires_at = models.DateTimeField()

    class Meta:
        verbose_name = "Preview Session"
        verbose_name_plural = "Preview Sessions"
        indexes = [models.Index(fields=("token", "expires_at"))]

    def __str__(self) -> str:
        return f"{self.module} preview {self.token}"

    @property
    def is_expired(self) -> bool:
        return self.expires_at <= timezone.now()
