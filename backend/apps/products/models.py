from decimal import Decimal
from typing import Optional

from django.db import models
from django.utils.text import slugify

from apps.common.models import BaseModel, PublishableModel, SortableModel, VisibilityControlledModel
from apps.media_library.models import MediaAsset
from apps.site_config.validators import hex_color_validator


class ProductTone(models.TextChoices):
    LIGHT = "light", "Light"
    DARK = "dark", "Dark"


class ProductMediaPanelMode(models.TextChoices):
    IMAGE_TONE = "image_tone", "Image Tone"
    FORCE_BLACK = "force_black", "Force Black"
    FORCE_WHITE = "force_white", "Force White"


PUBLIC_MEDIA_PANEL_MODE_MAP = {
    ProductMediaPanelMode.IMAGE_TONE: "imageTone",
    ProductMediaPanelMode.FORCE_BLACK: "forceBlack",
    ProductMediaPanelMode.FORCE_WHITE: "forceWhite",
}


def to_public_media_panel_mode(value: Optional[str]) -> Optional[str]:
    if not value:
        return value
    return PUBLIC_MEDIA_PANEL_MODE_MAP.get(value, value)


class ProductMediaRole(models.TextChoices):
    PRIMARY = "primary", "Primary"
    GALLERY = "gallery", "Gallery"
    DETAIL = "detail", "Detail"


class Product(BaseModel, PublishableModel, VisibilityControlledModel, SortableModel):
    title = models.CharField(max_length=180)
    subtitle = models.CharField(max_length=180, blank=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    sku = models.CharField(max_length=80, blank=True)
    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    currency = models.CharField(max_length=3, default="UZS")
    badge = models.CharField(max_length=80, blank=True)
    cover_asset = models.ForeignKey(
        MediaAsset,
        related_name="product_cover_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    is_featured = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    saved_enabled = models.BooleanField(default=True)
    cart_enabled = models.BooleanField(default=True)
    order_enabled = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ("sort_order", "title", "created_at")

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)[:180] or "product"
            candidate = base_slug
            index = 1
            while Product.objects.exclude(pk=self.pk).filter(slug=candidate).exists():
                index += 1
                candidate = f"{base_slug[:190]}-{index}"
            self.slug = candidate
        super().save(*args, **kwargs)


class ProductTheme(BaseModel):
    product = models.OneToOneField(Product, related_name="theme", on_delete=models.CASCADE)
    accent_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#D2A85E")
    surface_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#111A2D")
    text_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#F4F0E8")
    badge_label = models.CharField(max_length=60, blank=True)
    muted_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#9BA3B5")
    card_color = models.CharField(max_length=9, validators=[hex_color_validator], default="#172236")
    tone = models.CharField(max_length=16, choices=ProductTone.choices, default=ProductTone.DARK)
    media_panel_mode = models.CharField(
        max_length=16,
        choices=ProductMediaPanelMode.choices,
        default=ProductMediaPanelMode.FORCE_BLACK,
    )
    media_panel_color = models.CharField(max_length=20, blank=True)

    class Meta:
        verbose_name = "Product Theme"
        verbose_name_plural = "Product Themes"

    def __str__(self) -> str:
        return f"{self.product.title} theme"


class ProductMedia(BaseModel, PublishableModel, VisibilityControlledModel, SortableModel):
    product = models.ForeignKey(Product, related_name="media_items", on_delete=models.CASCADE)
    asset = models.ForeignKey(
        MediaAsset,
        related_name="product_media_links",
        on_delete=models.CASCADE,
    )
    label = models.CharField(max_length=80, blank=True)
    role = models.CharField(max_length=16, choices=ProductMediaRole.choices, default=ProductMediaRole.GALLERY)

    class Meta:
        verbose_name = "Product Media"
        verbose_name_plural = "Product Media"
        ordering = ("sort_order", "created_at")

    def __str__(self) -> str:
        return self.label or f"{self.product.title} media"


class ProductColor(BaseModel, PublishableModel, VisibilityControlledModel, SortableModel):
    product = models.ForeignKey(Product, related_name="color_variants", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    hex_color = models.CharField(max_length=9, validators=[hex_color_validator])
    preview_asset = models.ForeignKey(
        MediaAsset,
        related_name="product_color_previews",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Product Color"
        verbose_name_plural = "Product Colors"
        ordering = ("sort_order", "created_at")

    def __str__(self) -> str:
        return f"{self.product.title} - {self.name}"
