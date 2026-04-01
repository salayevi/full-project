from __future__ import annotations

from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand, CommandError

from apps.about.models import AboutSection, AboutTextItem
from apps.achievements.models import Achievement
from apps.common.constants import PublishState, VisibilityState
from apps.footer.models import FooterPrimaryMode, FooterSection
from apps.hero.models import HeroSection
from apps.media_library.models import MediaAsset, MediaAssetKind
from apps.products.models import Product, ProductColor, ProductTheme
from apps.site_config.models import NavigationLink, SiteSettings, ThemeSettings


PROJECT_ROOT = Path(__file__).resolve().parents[5]
WEBSITE_ROOT = PROJECT_ROOT / "Website"
PUBLIC_ASSETS_ROOT = WEBSITE_ROOT / "public"


class Command(BaseCommand):
    help = "Bootstrap a published baseline public site dataset for local verification."

    def handle(self, *args, **options):
        self.ensure_assets_root()

        logo = self.import_asset(
            title="Azizam Market Logo",
            relative_path="logo.png",
            kind=MediaAssetKind.LOGO,
            alt_text="Azizam Market",
            sort_order=0,
        )
        hero_background = self.import_asset(
            title="Hero Roses",
            relative_path="rose-bg.png",
            kind=MediaAssetKind.IMAGE,
            alt_text="Rose background",
            sort_order=10,
        )
        story_image = self.import_asset(
            title="About Story Image",
            relative_path="grid-img.png",
            kind=MediaAssetKind.IMAGE,
            alt_text="Azizam Market story image",
            sort_order=20,
        )

        self.bootstrap_site_settings(logo)
        self.bootstrap_navigation()
        self.bootstrap_hero(logo=logo, hero_background=hero_background)
        self.bootstrap_about(story_image=story_image)
        self.bootstrap_products(product_image=story_image)
        self.bootstrap_achievements(achievement_image=story_image)
        self.bootstrap_footer()

        self.stdout.write(self.style.SUCCESS("Public site bootstrap completed."))

    def ensure_assets_root(self) -> None:
        if not PUBLIC_ASSETS_ROOT.exists():
            raise CommandError(f"Website public assets directory not found: {PUBLIC_ASSETS_ROOT}")

    def import_asset(
        self,
        *,
        title: str,
        relative_path: str,
        kind: str,
        alt_text: str,
        sort_order: int,
    ) -> MediaAsset:
        source_path = PUBLIC_ASSETS_ROOT / relative_path
        if not source_path.exists():
            raise CommandError(f"Required asset missing: {source_path}")

        asset, _ = MediaAsset.objects.get_or_create(
            title=title,
            defaults={
                "kind": kind,
                "alt_text": alt_text,
                "publish_state": PublishState.PUBLISHED,
                "sort_order": sort_order,
                "is_public": True,
            },
        )

        asset.kind = kind
        asset.alt_text = alt_text
        asset.publish_state = PublishState.PUBLISHED
        asset.sort_order = sort_order
        asset.is_public = True

        if not asset.file or Path(asset.file.name).name != source_path.name:
            with source_path.open("rb") as file_handle:
                asset.file.save(source_path.name, File(file_handle), save=False)

        asset.save()
        return asset

    def bootstrap_site_settings(self, logo: MediaAsset) -> None:
        site_settings, _ = SiteSettings.objects.get_or_create(
            code="primary",
            defaults={
                "site_name": "Azizam Market",
                "brand_text": "Azizam Market",
                "site_tagline": "Gul va sovg'alar uchun premium tajriba",
                "site_description": "Dashboard orqali boshqariladigan premium public website.",
                "support_email": "support@azizam-market.local",
                "support_phone": "+998 90 000 00 00",
                "is_active": True,
                "maintenance_mode": False,
            },
        )

        site_settings.site_name = "Azizam Market"
        site_settings.brand_text = "Azizam Market"
        site_settings.site_tagline = "Gul va sovg'alar uchun premium tajriba"
        site_settings.site_description = "Dashboard orqali boshqariladigan premium public website."
        site_settings.support_email = "support@azizam-market.local"
        site_settings.support_phone = "+998 90 000 00 00"
        site_settings.logo_asset = logo
        site_settings.favicon_asset = logo
        site_settings.is_active = True
        site_settings.maintenance_mode = False
        site_settings.save()

        theme, _ = ThemeSettings.objects.get_or_create(site=site_settings)
        theme.theme_name = "Azizam Premium"
        theme.publish_state = PublishState.PUBLISHED
        theme.brand_primary = "#0B1020"
        theme.brand_accent = "#D2A85E"
        theme.brand_primary_strong = "#9E7A36"
        theme.brand_secondary = "#D2A85E"
        theme.brand_soft = "#F1DFBF"
        theme.background_page = "#050814"
        theme.background_soft = "#0F1423"
        theme.background_about = "#111827"
        theme.background_achievements = "#161E31"
        theme.background_dark = "#02050D"
        theme.background_light_panel = "#1B2740"
        theme.text_primary = "#F4F0E8"
        theme.text_secondary = "#9BA3B5"
        theme.text_muted = "#7F8AA3"
        theme.text_soft = "#C1C8D6"
        theme.text_white = "#FFFFFF"
        theme.border_soft = "#2B3246"
        theme.border_white_soft = "rgba(255,255,255,0.12)"
        theme.overlay_hero = "#0B1020CC"
        theme.overlay_navbar = "rgba(5,8,20,0.72)"
        theme.overlay_modal = "rgba(5,8,20,0.82)"
        theme.surface_white = "#FFFFFF"
        theme.surface_glass = "rgba(255,255,255,0.12)"
        theme.surface_modal = "#141B2D"
        theme.mobile_hero_top_icon_outer_background = "#8B5F2E"
        theme.mobile_hero_top_icon_inner_background = "#FFFFFF"
        theme.mobile_hero_bottom_nav_background = "rgba(10,15,28,0.92)"
        theme.mobile_hero_bottom_nav_text_color = "#F4F0E8"
        theme.mobile_hero_soft_shadow = "0 16px 36px rgba(0, 0, 0, 0.28)"
        theme.mobile_hero_nav_shadow = "0 18px 42px rgba(0, 0, 0, 0.22)"
        theme.save()

    def bootstrap_navigation(self) -> None:
        links = [
            {
                "label": "Biz haqimizda",
                "href": "#about",
                "placements": ["desktopHeader", "mobileBottom", "footer"],
                "sort_order": 0,
            },
            {
                "label": "Mahsulotlar",
                "href": "#products",
                "placements": ["desktopHeader", "mobileBottom", "footer"],
                "sort_order": 1,
            },
            {
                "label": "Yutuqlar",
                "href": "#achievements",
                "placements": ["mobileBottom", "footer"],
                "sort_order": 2,
            },
            {
                "label": "Aloqa",
                "href": "#footer",
                "placements": ["mobileBottom", "footer"],
                "sort_order": 3,
            },
        ]

        for item in links:
            link, _ = NavigationLink.objects.get_or_create(
                label=item["label"],
                defaults={
                    "href": item["href"],
                    "placements": item["placements"],
                    "sort_order": item["sort_order"],
                },
            )
            link.href = item["href"]
            link.placements = item["placements"]
            link.sort_order = item["sort_order"]
            link.publish_state = PublishState.PUBLISHED
            link.visibility_state = VisibilityState.VISIBLE
            link.open_in_new_tab = False
            link.save()

    def bootstrap_hero(self, *, logo: MediaAsset, hero_background: MediaAsset) -> None:
        hero, _ = HeroSection.objects.get_or_create(
            code="primary",
            defaults={"title": "Azizam"},
        )
        hero.eyebrow = ""
        hero.title = "Azizam"
        hero.title_line_two = "Market"
        hero.subtitle = ""
        hero.highlight_text = ""
        hero.primary_cta_label = ""
        hero.primary_cta_url = ""
        hero.secondary_cta_label = ""
        hero.secondary_cta_url = ""
        hero.background_asset = hero_background
        hero.mobile_background_asset = hero_background
        hero.logo_asset = logo
        hero.overlay_color = "rgba(5,8,20,0.58)"
        hero.preview_note = "Bootstrap baseline hero"
        hero.publish_state = PublishState.PUBLISHED
        hero.visibility_state = VisibilityState.VISIBLE
        hero.save()

    def bootstrap_about(self, *, story_image: MediaAsset) -> None:
        about, _ = AboutSection.objects.get_or_create(
            code="primary",
            defaults={
                "section_label": "Biz haqimizda",
                "brand_title": "Azizam Market",
            },
        )
        about.section_label = "Biz haqimizda"
        about.brand_title = "Azizam Market"
        about.description = "Bir xil backend contract orqali boshqariladigan premium public tajriba."
        about.image_asset = story_image
        about.preview_note = "Bootstrap baseline about section"
        about.publish_state = PublishState.PUBLISHED
        about.visibility_state = VisibilityState.VISIBLE
        about.save()

        story_lines = [
            "Gullar, sovg'alar va premium taqdimot uchun yagona boshqaruv markazi.",
            "Dashboard o'zgarishlari preview orqali ko'riladi va faqat saqlangandan keyin publicga chiqadi.",
            "Backend public website uchun yagona source of truth bo'lib ishlaydi.",
        ]

        existing_items = {item.sort_order: item for item in about.text_items.all()}
        for index, text in enumerate(story_lines):
            item = existing_items.get(index) or AboutTextItem(section=about, sort_order=index)
            item.text = text
            item.publish_state = PublishState.PUBLISHED
            item.visibility_state = VisibilityState.VISIBLE
            item.sort_order = index
            item.save()

    def bootstrap_products(self, *, product_image: MediaAsset) -> None:
        product, _ = Product.objects.get_or_create(
            slug="premium-rose-box",
            defaults={"title": "Premium Rose Box"},
        )
        product.title = "Premium Rose Box"
        product.subtitle = "Premium gul kompozitsiyasi"
        product.sku = "AZM-ROSE-001"
        product.short_description = "Public website uchun real backend-controlled mahsulot."
        product.description = "Rang variantlari, media va operator boshqaruvi bilan tayyorlangan premium mahsulot kartasi."
        product.price = "249000.00"
        product.currency = "UZS"
        product.badge = "Top"
        product.cover_asset = product_image
        product.is_featured = True
        product.is_available = True
        product.saved_enabled = True
        product.cart_enabled = True
        product.order_enabled = True
        product.publish_state = PublishState.PUBLISHED
        product.visibility_state = VisibilityState.VISIBLE
        product.sort_order = 0
        product.save()

        theme, _ = ProductTheme.objects.get_or_create(product=product)
        theme.accent_color = "#D2A85E"
        theme.surface_color = "#111A2D"
        theme.text_color = "#F4F0E8"
        theme.badge_label = "Top"
        theme.muted_color = "#9BA3B5"
        theme.card_color = "#172236"
        theme.tone = "dark"
        theme.media_panel_mode = "force_black"
        theme.media_panel_color = ""
        theme.save()

        color_defaults = [
            ("Classic Gold", "#D2A85E", 0),
            ("Soft Rose", "#CF2F8F", 1),
        ]
        for name, hex_color, sort_order in color_defaults:
            color, _ = ProductColor.objects.get_or_create(
                product=product,
                name=name,
                defaults={"hex_color": hex_color},
            )
            color.hex_color = hex_color
            color.preview_asset = product_image
            color.publish_state = PublishState.PUBLISHED
            color.visibility_state = VisibilityState.VISIBLE
            color.sort_order = sort_order
            color.save()

    def bootstrap_achievements(self, *, achievement_image: MediaAsset) -> None:
        achievement, _ = Achievement.objects.get_or_create(
            title="Premium boshqaruv tayyor",
            defaults={"description": "Preview va publish oqimi tekshiruv uchun tayyor."},
        )
        achievement.eyebrow = "Integration"
        achievement.description = "Dashboard -> Backend -> Database -> Website oqimi yakuniy ichki testlar uchun tayyorlandi."
        achievement.media_asset = achievement_image
        achievement.frame_color = "#D2A85E"
        achievement.ribbon_color = "#D2A85E"
        achievement.text_color = "#FFFFFF"
        achievement.muted_color = "rgba(255,255,255,0.84)"
        achievement.publish_state = PublishState.PUBLISHED
        achievement.visibility_state = VisibilityState.VISIBLE
        achievement.sort_order = 0
        achievement.save()

    def bootstrap_footer(self) -> None:
        footer, _ = FooterSection.objects.get_or_create(
            code="primary",
            defaults={"brand_text": "Azizam Market", "description": "Footer"},
        )
        footer.brand_text = "Azizam Market"
        footer.description = "Premium public website uchun real backend-controlled footer section."
        footer.contact_items = [
            {"label": "Phone", "value": "+998 90 000 00 00", "href": "tel:+998900000000"},
            {"label": "Email", "value": "support@azizam-market.local", "href": "mailto:support@azizam-market.local"},
        ]
        footer.social_links = [
            {"label": "Instagram", "href": "https://instagram.com/azizam.market"},
        ]
        footer.cta_title = "Azizam bilan davom eting"
        footer.cta_description = "Kirish yoki ro'yxatdan o'tish tugmalari keyingi auth integratsiyasigacha guest-mode ogohlantirishi bilan ishlaydi."
        footer.cta_primary_label = "Kirish"
        footer.cta_primary_mode = FooterPrimaryMode.LOGIN
        footer.cta_secondary_label = "Bog'lanish"
        footer.cta_secondary_href = "#footer"
        footer.legal_text = "© Azizam Market. Barcha huquqlar himoyalangan."
        footer.preview_note = "Bootstrap baseline footer"
        footer.publish_state = PublishState.PUBLISHED
        footer.visibility_state = VisibilityState.VISIBLE
        footer.save()
