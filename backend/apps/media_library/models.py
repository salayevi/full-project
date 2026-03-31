import mimetypes

from django.db import models

from apps.common.models import BaseModel, PublishableModel, SortableModel


class MediaAssetKind(models.TextChoices):
    IMAGE = "image", "Image"
    VIDEO = "video", "Video"
    DOCUMENT = "document", "Document"
    ICON = "icon", "Icon"
    LOGO = "logo", "Logo"
    FAVICON = "favicon", "Favicon"


class MediaAsset(BaseModel, PublishableModel, SortableModel):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="media-library/%Y/%m/")
    kind = models.CharField(max_length=16, choices=MediaAssetKind.choices, default=MediaAssetKind.IMAGE)
    alt_text = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=127, blank=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    width = models.PositiveIntegerField(blank=True, null=True)
    height = models.PositiveIntegerField(blank=True, null=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Media Asset"
        verbose_name_plural = "Media Assets"
        ordering = ("sort_order", "title", "created_at")

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if self.file:
            self.size_bytes = self.file.size or 0
            self.mime_type = getattr(getattr(self.file, "file", None), "content_type", "") or mimetypes.guess_type(
                self.file.name
            )[0] or self.mime_type
        super().save(*args, **kwargs)
