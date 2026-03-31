from django.db import models

from apps.common.models import BaseModel, PublishableModel, SortableModel, VisibilityControlledModel
from apps.media_library.models import MediaAsset

from .validators import hex_color_validator


class SiteSettings(BaseModel):
    code = models.SlugField(max_length=50, unique=True, default="primary")
    site_name = models.CharField(max_length=150)
    brand_text = models.CharField(max_length=150, blank=True)
    site_tagline = models.CharField(max_length=255, blank=True)
    site_description = models.TextField(blank=True)
    support_email = models.EmailField(blank=True)
    support_phone = models.CharField(max_length=50, blank=True)
    logo_asset = models.ForeignKey(
        MediaAsset,
        related_name="site_logo_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    favicon_asset = models.ForeignKey(
        MediaAsset,
        related_name="site_favicon_for",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    maintenance_mode = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
        ordering = ("code",)

    def __str__(self) -> str:
        return self.site_name

    def save(self, *args, **kwargs):
        if not self.brand_text:
            self.brand_text = self.site_name
        super().save(*args, **kwargs)


class ThemeSettings(BaseModel, PublishableModel):
    site = models.OneToOneField(SiteSettings, related_name="theme", on_delete=models.CASCADE)
    theme_name = models.CharField(max_length=100, default="Premium Default")
    brand_primary = models.CharField(max_length=9, validators=[hex_color_validator], default="#0B1020")
    brand_accent = models.CharField(max_length=9, validators=[hex_color_validator], default="#D2A85E")
    brand_primary_strong = models.CharField(max_length=9, validators=[hex_color_validator], default="#9E7A36")
    brand_secondary = models.CharField(max_length=9, validators=[hex_color_validator], default="#D2A85E")
    brand_soft = models.CharField(max_length=9, validators=[hex_color_validator], default="#F1DFBF")
    background_page = models.CharField(max_length=9, validators=[hex_color_validator], default="#050814")
    background_soft = models.CharField(max_length=9, validators=[hex_color_validator], default="#0F1423")
    background_about = models.CharField(max_length=9, validators=[hex_color_validator], default="#111827")
    background_achievements = models.CharField(max_length=9, validators=[hex_color_validator], default="#161E31")
    background_dark = models.CharField(max_length=9, validators=[hex_color_validator], default="#02050D")
    background_light_panel = models.CharField(max_length=9, validators=[hex_color_validator], default="#1B2740")
    text_primary = models.CharField(max_length=9, validators=[hex_color_validator], default="#F4F0E8")
    text_secondary = models.CharField(max_length=9, validators=[hex_color_validator], default="#9BA3B5")
    text_muted = models.CharField(max_length=9, validators=[hex_color_validator], default="#7F8AA3")
    text_soft = models.CharField(max_length=9, validators=[hex_color_validator], default="#C1C8D6")
    text_white = models.CharField(max_length=9, validators=[hex_color_validator], default="#FFFFFF")
    border_soft = models.CharField(max_length=9, validators=[hex_color_validator], default="#2B3246")
    border_white_soft = models.CharField(max_length=20, default="rgba(255,255,255,0.12)")
    overlay_hero = models.CharField(max_length=9, validators=[hex_color_validator], default="#0B1020CC")
    overlay_navbar = models.CharField(max_length=20, default="rgba(5,8,20,0.72)")
    overlay_modal = models.CharField(max_length=20, default="rgba(5,8,20,0.82)")
    surface_white = models.CharField(max_length=9, validators=[hex_color_validator], default="#FFFFFF")
    surface_glass = models.CharField(max_length=20, default="rgba(255,255,255,0.12)")
    surface_modal = models.CharField(max_length=9, validators=[hex_color_validator], default="#141B2D")
    mobile_hero_top_icon_outer_background = models.CharField(
        max_length=9,
        validators=[hex_color_validator],
        default="#8B5F2E",
    )
    mobile_hero_top_icon_inner_background = models.CharField(
        max_length=9,
        validators=[hex_color_validator],
        default="#FFFFFF",
    )
    mobile_hero_bottom_nav_background = models.CharField(max_length=20, default="rgba(10,15,28,0.92)")
    mobile_hero_bottom_nav_text_color = models.CharField(
        max_length=9,
        validators=[hex_color_validator],
        default="#F4F0E8",
    )
    mobile_hero_soft_shadow = models.CharField(max_length=80, default="0 16px 36px rgba(0, 0, 0, 0.28)")
    mobile_hero_nav_shadow = models.CharField(max_length=80, default="0 18px 42px rgba(0, 0, 0, 0.22)")

    class Meta:
        verbose_name = "Theme Settings"
        verbose_name_plural = "Theme Settings"

    def __str__(self) -> str:
        return f"{self.site.site_name} theme"

    def as_token_map(self) -> dict[str, str]:
        return {
            "brand.primary": self.brand_primary,
            "brand.accent": self.brand_accent,
            "brand.primaryStrong": self.brand_primary_strong,
            "brand.secondary": self.brand_secondary,
            "brand.soft": self.brand_soft,
            "background.page": self.background_page,
            "background.soft": self.background_soft,
            "background.about": self.background_about,
            "background.achievements": self.background_achievements,
            "background.dark": self.background_dark,
            "background.lightPanel": self.background_light_panel,
            "text.primary": self.text_primary,
            "text.secondary": self.text_secondary,
            "text.muted": self.text_muted,
            "text.soft": self.text_soft,
            "text.white": self.text_white,
            "border.soft": self.border_soft,
            "border.whiteSoft": self.border_white_soft,
            "overlay.hero": self.overlay_hero,
            "overlay.navbar": self.overlay_navbar,
            "overlay.modal": self.overlay_modal,
            "surface.white": self.surface_white,
            "surface.glass": self.surface_glass,
            "surface.modal": self.surface_modal,
            "mobileHero.topIconOuterBackground": self.mobile_hero_top_icon_outer_background,
            "mobileHero.topIconInnerBackground": self.mobile_hero_top_icon_inner_background,
            "mobileHero.bottomNavBackground": self.mobile_hero_bottom_nav_background,
            "mobileHero.bottomNavTextColor": self.mobile_hero_bottom_nav_text_color,
            "mobileHero.softShadow": self.mobile_hero_soft_shadow,
            "mobileHero.navShadow": self.mobile_hero_nav_shadow,
        }


class NavigationLink(BaseModel, PublishableModel, VisibilityControlledModel, SortableModel):
    label = models.CharField(max_length=100)
    href = models.CharField(max_length=255)
    placements = models.JSONField(default=list, blank=True)
    open_in_new_tab = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Navigation Link"
        verbose_name_plural = "Navigation Links"
        ordering = ("sort_order", "created_at")

    def __str__(self) -> str:
        return self.label
