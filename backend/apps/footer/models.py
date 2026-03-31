from django.db import models

from apps.common.models import BaseModel, PublishableModel, VisibilityControlledModel


class FooterPrimaryMode(models.TextChoices):
    LOGIN = "login", "Login"
    REGISTER = "register", "Register"


class FooterSection(BaseModel, PublishableModel, VisibilityControlledModel):
    code = models.SlugField(max_length=50, unique=True, default="primary")
    brand_text = models.CharField(max_length=150)
    description = models.TextField()
    contact_items = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=list, blank=True)
    cta_title = models.CharField(max_length=150, blank=True)
    cta_description = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=80, blank=True)
    cta_primary_mode = models.CharField(
        max_length=16,
        choices=FooterPrimaryMode.choices,
        default=FooterPrimaryMode.LOGIN,
    )
    cta_secondary_label = models.CharField(max_length=80, blank=True)
    cta_secondary_href = models.CharField(max_length=255, blank=True)
    legal_text = models.CharField(max_length=255, blank=True)
    preview_note = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Footer Section"
        verbose_name_plural = "Footer Sections"
        ordering = ("code",)

    def __str__(self) -> str:
        return self.brand_text
