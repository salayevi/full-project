from django.db import models

from apps.common.models import BaseModel, PublishableModel, SortableModel, VisibilityControlledModel
from apps.media_library.models import MediaAsset
from apps.site_config.validators import hex_color_validator


class Achievement(BaseModel, PublishableModel, VisibilityControlledModel, SortableModel):
    title = models.CharField(max_length=180)
    eyebrow = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    media_asset = models.ForeignKey(
        MediaAsset,
        related_name="achievements_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    frame_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#D2A85E")
    ribbon_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#D2A85E")
    text_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#FFFFFF")
    muted_color = models.CharField(max_length=20, default="rgba(255,255,255,0.84)")

    class Meta:
        verbose_name = "Achievement"
        verbose_name_plural = "Achievements"
        ordering = ("sort_order", "created_at")

    def __str__(self) -> str:
        return self.title
