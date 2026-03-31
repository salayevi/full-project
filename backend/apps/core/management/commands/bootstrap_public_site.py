from __future__ import annotations

from decimal import Decimal
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.about.models import AboutSection, AboutTextItem
from apps.achievements.models import Achievement
from apps.common.constants import PublishState, VisibilityState
from apps.footer.models import FooterSection
from apps.hero.models import HeroSection
from apps.media_library.models import MediaAsset, MediaAssetKind
from apps.products.models import Product, ProductColor, ProductTheme
from apps.site_config.models import NavigationLink, SiteSettings, ThemeSettings


REPO_ROOT = Path(__file__).resolve().parents[5]
PUBLIC_ASSETS_DIR = REPO_ROOT / "public" / "public"

THEME_DEFAULTS = {
    "theme_name": "Azizam Public Theme",
    "publish_state": PublishState.PUBLISHED,
    "brand_primary": "#d13ea2",
    "brand_accent": "#d13ea2",
    "brand_primary_strong": "#d1296f",
    "brand_secondary": "#8b2749",
    "brand_soft": "#f3bfdc",
    "background_page": "#ffffff",
    "background_soft": "#f5f4f2",
    "background_about": "#f2f2f2",
    "background_achievements": "#f6f1ea",
    "background_dark": "#111111",
    "background_light_panel": "#f5f1eb",
    "text_primary": "#3f2d25",
    "text_secondary": "#6f5b51",
    "text_muted": "#9c8576",
    "text_soft": "rgba(255, 255, 255, 0.7)",
    "text_white": "#ffffff",
    "border_soft": "rgba(0, 0, 0, 0.12)",
    "border_white_soft": "rgba(255, 255, 255, 0.1)",
    "overlay_hero": "rgba(209, 62, 162, 0.6)",
    "overlay_navbar": "rgba(0, 0, 0, 0.3)",
    "overlay_modal": "rgba(0, 0, 0, 0.6)",
    "surface_white": "#ffffff",
    "surface_glass": "rgba(255, 255, 255, 0.75)",
    "surface_modal": "#111111",
    "mobile_hero_top_icon_outer_background": "#9d1a12",
    "mobile_hero_top_icon_inner_background": "#ffffff",
    "mobile_hero_bottom_nav_background": "rgba(255, 255, 255, 0.92)",
    "mobile_hero_bottom_nav_text_color": "#4a3337",
    "mobile_hero_soft_shadow": "0 10px 30px rgba(0, 0, 0, 0.16)",
    "mobile_hero_nav_shadow": "0 12px 36px rgba(0, 0, 0, 0.14)",
}

ABOUT_LINES = [
    "Azizam Market — bu shunchaki kosmetika do‘koni emas.",
    "Bu — mehr, e’tibor va qadrlash maskani.",
    "“Azizam” so‘zi biz uchun oddiy murojaat emas.",
    "Bu yaqinlikni, samimiyatni va muhabbatni anglatadi.",
    "Biz har bir inson o‘zini aziz his qilishi uchun ishlaymiz.",
    "Har bir sovg‘a — bu munosabat.",
    "Har bir mahsulot — e’tibor belgisi.",
]

PRODUCTS = [
    {
        "slug": "rose-serum",
        "title": "Rose Serum",
        "subtitle": "Luxury botanical care",
        "description": "Yengil teksturali premium serum. Teri namligini ushlab turadi, silliqlik va yorqinlik beradi.",
        "price": Decimal("48.00"),
        "currency": "USD",
        "badge": "Best Seller",
        "sort_order": 1,
        "cover_asset": "media-product-rose-serum",
        "theme": {
            "accent_color": "#c98f98",
            "surface_color": "#f7f2f1",
            "text_color": "#2c2523",
            "badge_label": "Best Seller",
            "muted_color": "#7e7169",
            "card_color": "#fffaf8",
            "tone": "light",
            "media_panel_mode": "force_black",
            "media_panel_color": "",
        },
        "colors": [
            {"name": "Rose Gold", "hex_color": "#c98f98", "sort_order": 1},
            {"name": "Cream", "hex_color": "#ece4dc", "sort_order": 2},
            {"name": "Black", "hex_color": "#2e2927", "sort_order": 3},
        ],
    },
    {
        "slug": "velvet-perfume",
        "title": "Velvet Perfume",
        "subtitle": "Elegant signature scent",
        "description": "Nozik va chuqur ifor uyg‘unligi. Premium segment uchun estetik va uzoq saqlanuvchi kompozitsiya.",
        "price": Decimal("72.00"),
        "currency": "USD",
        "badge": "New Drop",
        "sort_order": 2,
        "cover_asset": "media-product-velvet-perfume",
        "theme": {
            "accent_color": "#d5b16d",
            "surface_color": "#111111",
            "text_color": "#f5f1eb",
            "badge_label": "New Drop",
            "muted_color": "#b8ac9d",
            "card_color": "#171717",
            "tone": "dark",
            "media_panel_mode": "force_white",
            "media_panel_color": "",
        },
        "colors": [
            {"name": "Gold", "hex_color": "#d5b16d", "sort_order": 1},
            {"name": "Ivory", "hex_color": "#f2ede6", "sort_order": 2},
            {"name": "Graphite", "hex_color": "#2a2a2a", "sort_order": 3},
        ],
    },
    {
        "slug": "silk-cream",
        "title": "Silk Cream",
        "subtitle": "Soft texture, premium finish",
        "description": "Kunlik foydalanish uchun muloyim cream. Teri yuzasini yumshatadi va premium parvarish hissini beradi.",
        "price": Decimal("55.00"),
        "currency": "USD",
        "badge": "Editor’s Pick",
        "sort_order": 3,
        "cover_asset": "media-product-silk-cream",
        "theme": {
            "accent_color": "#8f6b52",
            "surface_color": "#eee4da",
            "text_color": "#251f1b",
            "badge_label": "Editor’s Pick",
            "muted_color": "#7a6d62",
            "card_color": "#faf5ef",
            "tone": "light",
            "media_panel_mode": "image_tone",
            "media_panel_color": "#cfc5bc",
        },
        "colors": [
            {"name": "Mocha", "hex_color": "#8f6b52", "sort_order": 1},
            {"name": "Sand", "hex_color": "#d5c1ac", "sort_order": 2},
            {"name": "Ivory", "hex_color": "#f7f1ea", "sort_order": 3},
        ],
    },
]

ACHIEVEMENTS = [
    {
        "title": "Premium tajriba",
        "description": "Har bir mahsulot va xizmat estetik tanlov, sifat va hissiy taassurot mezonlari asosida shakllantiriladi.",
        "asset": "media-achievement-team-1",
        "sort_order": 1,
    },
    {
        "title": "Ishonchli jamoa",
        "description": "Bizning jamoa buyurtmadan tortib taqdimotgacha bo‘lgan har bir bosqichni did va e’tibor bilan boshqaradi.",
        "asset": "media-achievement-team-2",
        "sort_order": 2,
    },
    {
        "title": "Yutuq va rivojlanish",
        "description": "Azizam o‘sib borayotgan brend sifatida tajriba, ishonch va premium yondashuvni bir joyga jamlaydi.",
        "asset": "media-achievement-team-3",
        "sort_order": 3,
    },
    {
        "title": "Brend qadriyati",
        "description": "Har bir detal orqali nafaqat mahsulot, balki unutilmas vizual va emotsional tajriba yaratiladi.",
        "asset": "media-achievement-team-4",
        "sort_order": 4,
    },
]

MEDIA_DEFINITIONS = [
    {
        "key": "media-logo",
        "title": "Primary logo",
        "kind": MediaAssetKind.LOGO,
        "alt_text": "Azizam Market",
        "path": "logo.png",
        "sort_order": 1,
    },
    {
        "key": "media-favicon",
        "title": "Favicon",
        "kind": MediaAssetKind.FAVICON,
        "alt_text": "Azizam Market favicon",
        "path": "logo.png",
        "sort_order": 2,
    },
    {
        "key": "media-hero-background",
        "title": "Hero rose background",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Azizam Market hero background",
        "path": "rose-bg.png",
        "sort_order": 3,
    },
    {
        "key": "media-about-grid",
        "title": "About section image",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Azizam Market",
        "path": "grid-img.png",
        "sort_order": 4,
    },
    {
        "key": "media-product-rose-serum",
        "title": "Rose Serum bottle",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Rose Serum bottle",
        "path": "products/parfium.jpg",
        "sort_order": 5,
    },
    {
        "key": "media-product-velvet-perfume",
        "title": "Velvet Perfume bottle",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Velvet Perfume bottle",
        "path": "products/parfium2.jpg",
        "sort_order": 6,
    },
    {
        "key": "media-product-silk-cream",
        "title": "Silk Cream jar",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Silk Cream jar",
        "path": "products/parfium3.jpg",
        "sort_order": 7,
    },
    {
        "key": "media-achievement-team-1",
        "title": "Achievement team 1",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Premium tajriba",
        "path": "achievements/team-1.jpg",
        "sort_order": 8,
    },
    {
        "key": "media-achievement-team-2",
        "title": "Achievement team 2",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Ishonchli jamoa",
        "path": "achievements/team-2.jpg",
        "sort_order": 9,
    },
    {
        "key": "media-achievement-team-3",
        "title": "Achievement team 3",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Yutuq va rivojlanish",
        "path": "achievements/team-3.jpg",
        "sort_order": 10,
    },
    {
        "key": "media-achievement-team-4",
        "title": "Achievement team 4",
        "kind": MediaAssetKind.IMAGE,
        "alt_text": "Brend qadriyati",
        "path": "achievements/team-4.jpg",
        "sort_order": 11,
    },
]


class Command(BaseCommand):
    help = "Bootstrap published public-site content from the current public project source files."

    def handle(self, *args, **options):
        if not PUBLIC_ASSETS_DIR.exists():
            raise CommandError(f"Public assets directory was not found: {PUBLIC_ASSETS_DIR}")

        with transaction.atomic():
            media_assets = self._bootstrap_media_assets()
            self._bootstrap_site_settings(media_assets)
            self._bootstrap_navigation()
            self._bootstrap_hero(media_assets)
            self._bootstrap_about(media_assets)
            self._bootstrap_products(media_assets)
            self._bootstrap_achievements(media_assets)
            self._bootstrap_footer()

        self.stdout.write(self.style.SUCCESS("Public site content bootstrapped successfully."))

    def _bootstrap_media_assets(self) -> dict[str, MediaAsset]:
        assets: dict[str, MediaAsset] = {}

        for item in MEDIA_DEFINITIONS:
            source_path = PUBLIC_ASSETS_DIR / item["path"]
            if not source_path.exists():
                raise CommandError(f"Required public asset was not found: {source_path}")

            asset = MediaAsset.objects.filter(title=item["title"], kind=item["kind"]).first()
            if asset is None:
                asset = MediaAsset(title=item["title"], kind=item["kind"])

            asset.alt_text = item["alt_text"]
            asset.is_public = True
            asset.publish_state = PublishState.PUBLISHED
            asset.sort_order = item["sort_order"]

            if not asset.file:
                with source_path.open("rb") as file_handle:
                    asset.file.save(source_path.name, File(file_handle), save=False)

            asset.save()
            assets[item["key"]] = asset

        return assets

    def _bootstrap_site_settings(self, media_assets: dict[str, MediaAsset]) -> None:
        site_settings, _ = SiteSettings.objects.get_or_create(code="primary")
        site_settings.site_name = "Azizam Market"
        site_settings.brand_text = "Azizam Market"
        site_settings.site_tagline = "Premium estetik yondashuv, mehr va qadrlash ruhi."
        site_settings.site_description = "Premium estetik yondashuv, mehr va qadrlash ruhida qurilgan zamonaviy kosmetika tajribasi."
        site_settings.support_email = ""
        site_settings.support_phone = "+998 00 000 00 00"
        site_settings.logo_asset = media_assets["media-logo"]
        site_settings.favicon_asset = media_assets["media-favicon"]
        site_settings.is_active = True
        site_settings.maintenance_mode = False
        site_settings.save()

        ThemeSettings.objects.update_or_create(site=site_settings, defaults=THEME_DEFAULTS)

    def _bootstrap_navigation(self) -> None:
        navigation_items = [
            {
                "label": "Bosh sahifa",
                "href": "#home-mobile",
                "placements": ["mobileBottom"],
                "sort_order": 1,
            },
            {
                "label": "Biz haqimizda",
                "href": "#about",
                "placements": ["desktopHeader", "mobileBottom", "footer"],
                "sort_order": 2,
            },
            {
                "label": "Mahsulotlar",
                "href": "#products",
                "placements": ["desktopHeader", "mobileBottom", "footer"],
                "sort_order": 3,
            },
            {
                "label": "Yutuqlar",
                "href": "#achievements",
                "placements": ["desktopHeader", "mobileBottom", "footer"],
                "sort_order": 4,
            },
        ]

        for item in navigation_items:
            NavigationLink.objects.update_or_create(
                label=item["label"],
                defaults={
                    "href": item["href"],
                    "placements": item["placements"],
                    "open_in_new_tab": False,
                    "publish_state": PublishState.PUBLISHED,
                    "visibility_state": VisibilityState.VISIBLE,
                    "sort_order": item["sort_order"],
                },
            )

    def _bootstrap_hero(self, media_assets: dict[str, MediaAsset]) -> None:
        hero, _ = HeroSection.objects.get_or_create(code="primary")
        hero.eyebrow = ""
        hero.title = "Azizam"
        hero.title_line_two = "Market"
        hero.subtitle = ""
        hero.highlight_text = ""
        hero.primary_cta_label = ""
        hero.primary_cta_url = ""
        hero.secondary_cta_label = ""
        hero.secondary_cta_url = ""
        hero.background_asset = media_assets["media-hero-background"]
        hero.mobile_background_asset = media_assets["media-hero-background"]
        hero.logo_asset = media_assets["media-logo"]
        hero.overlay_color = "rgba(209, 62, 162, 0.6)"
        hero.preview_note = ""
        hero.publish_state = PublishState.PUBLISHED
        hero.visibility_state = VisibilityState.VISIBLE
        hero.save()

    def _bootstrap_about(self, media_assets: dict[str, MediaAsset]) -> None:
        section, _ = AboutSection.objects.get_or_create(code="primary")
        section.section_label = "Biz Haqimizda"
        section.brand_title = "Azizam Market"
        section.description = ""
        section.image_asset = media_assets["media-about-grid"]
        section.preview_note = ""
        section.publish_state = PublishState.PUBLISHED
        section.visibility_state = VisibilityState.VISIBLE
        section.save()

        for index, text in enumerate(ABOUT_LINES):
            AboutTextItem.objects.update_or_create(
                section=section,
                sort_order=index,
                defaults={
                    "text": text,
                    "publish_state": PublishState.PUBLISHED,
                    "visibility_state": VisibilityState.VISIBLE,
                },
            )

    def _bootstrap_products(self, media_assets: dict[str, MediaAsset]) -> None:
        for item in PRODUCTS:
            product, _ = Product.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "subtitle": item["subtitle"],
                    "sku": item["slug"].upper().replace("-", "-"),
                    "short_description": item["subtitle"],
                    "description": item["description"],
                    "price": item["price"],
                    "currency": item["currency"],
                    "badge": item["badge"],
                    "publish_state": PublishState.PUBLISHED,
                    "visibility_state": VisibilityState.VISIBLE,
                    "sort_order": item["sort_order"],
                    "is_featured": item["sort_order"] == 1,
                    "is_available": True,
                    "saved_enabled": True,
                    "cart_enabled": True,
                    "order_enabled": True,
                    "cover_asset": media_assets[item["cover_asset"]],
                },
            )

            ProductTheme.objects.update_or_create(product=product, defaults=item["theme"])

            for color in item["colors"]:
                ProductColor.objects.update_or_create(
                    product=product,
                    name=color["name"],
                    defaults={
                        "hex_color": color["hex_color"],
                        "preview_asset": None,
                        "publish_state": PublishState.PUBLISHED,
                        "visibility_state": VisibilityState.VISIBLE,
                        "sort_order": color["sort_order"],
                    },
                )

    def _bootstrap_achievements(self, media_assets: dict[str, MediaAsset]) -> None:
        for item in ACHIEVEMENTS:
            achievement, _ = Achievement.objects.update_or_create(
                title=item["title"],
                defaults={
                    "eyebrow": "",
                    "description": item["description"],
                    "media_asset": media_assets[item["asset"]],
                    "frame_color": "#f0069f",
                    "ribbon_color": "#f0069f",
                    "text_color": "#ffffff",
                    "muted_color": "rgba(255,255,255,0.92)",
                    "publish_state": PublishState.PUBLISHED,
                    "visibility_state": VisibilityState.VISIBLE,
                    "sort_order": item["sort_order"],
                },
            )

    def _bootstrap_footer(self) -> None:
        footer, _ = FooterSection.objects.get_or_create(code="primary")
        footer.brand_text = "Azizam Market"
        footer.description = "Premium estetik yondashuv, mehr va qadrlash ruhida qurilgan zamonaviy kosmetika tajribasi."
        footer.contact_items = [
            {"label": "Instagram", "value": "Instagram"},
            {"label": "Telegram", "value": "Telegram"},
            {"label": "Telefon", "value": "+998 00 000 00 00"},
        ]
        footer.social_links = []
        footer.cta_title = ""
        footer.cta_description = ""
        footer.cta_primary_label = "Ro‘yxatdan o‘tish"
        footer.cta_primary_mode = "register"
        footer.cta_secondary_label = ""
        footer.cta_secondary_href = ""
        footer.legal_text = "© 2026 Azizam Market. Barcha huquqlar himoyalangan."
        footer.preview_note = ""
        footer.publish_state = PublishState.PUBLISHED
        footer.visibility_state = VisibilityState.VISIBLE
        footer.save()
