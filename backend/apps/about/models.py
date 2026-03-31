from django.db import models

from apps.common.models import BaseModel, PublishableModel, SortableModel, VisibilityControlledModel
from apps.media_library.models import MediaAsset


class AboutSection(BaseModel, PublishableModel, VisibilityControlledModel):
    code = models.SlugField(max_length=50, unique=True, default="primary")
    section_label = models.CharField(max_length=100)
    brand_title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image_asset = models.ForeignKey(
        MediaAsset,
        related_name="about_image_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    preview_note = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "About Section"
        verbose_name_plural = "About Sections"
        ordering = ("code",)

    def __str__(self) -> str:
        return self.brand_title


class AboutTextItem(BaseModel, PublishableModel, VisibilityControlledModel, SortableModel):
    section = models.ForeignKey(AboutSection, related_name="text_items", on_delete=models.CASCADE)
    text = models.TextField()

    class Meta:
        verbose_name = "About Text Item"
        verbose_name_plural = "About Text Items"
        ordering = ("sort_order", "created_at")

    def __str__(self) -> str:
        return self.text[:60]
