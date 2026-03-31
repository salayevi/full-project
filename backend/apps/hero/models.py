from django.db import models

from apps.common.models import BaseModel, PublishableModel, VisibilityControlledModel
from apps.media_library.models import MediaAsset


class HeroSection(BaseModel, PublishableModel, VisibilityControlledModel):
    code = models.SlugField(max_length=50, unique=True, default="primary")
    eyebrow = models.CharField(max_length=80, blank=True)
    title = models.CharField(max_length=180)
    title_line_two = models.CharField(max_length=180, blank=True)
    subtitle = models.TextField(blank=True)
    highlight_text = models.CharField(max_length=120, blank=True)
    primary_cta_label = models.CharField(max_length=80, blank=True)
    primary_cta_url = models.URLField(blank=True)
    secondary_cta_label = models.CharField(max_length=80, blank=True)
    secondary_cta_url = models.URLField(blank=True)
    background_asset = models.ForeignKey(
        MediaAsset,
        related_name="hero_background_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    logo_asset = models.ForeignKey(
        MediaAsset,
        related_name="hero_logo_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    mobile_background_asset = models.ForeignKey(
        MediaAsset,
        related_name="hero_mobile_background_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    overlay_color = models.CharField(max_length=32, default="rgba(5,8,20,0.58)")
    preview_note = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Sections"
        ordering = ("code",)

    def __str__(self) -> str:
        return self.title
