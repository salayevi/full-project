from __future__ import annotations

from decimal import Decimal
from typing import Any

from django.utils import timezone

from apps.about.models import AboutSection, AboutTextItem
from apps.about.services import get_current_about, get_current_public_about
from apps.achievements.models import Achievement
from apps.common.constants import PublishState, VisibilityState
from apps.footer.models import FooterSection
from apps.footer.services import get_current_footer, get_current_public_footer
from apps.hero.models import HeroSection
from apps.hero.services import get_current_hero, get_current_public_hero
from apps.media_library.models import MediaAsset
from apps.products.models import Product, ProductColor, to_public_media_panel_mode
from apps.site_config.models import NavigationLink, SiteSettings
from apps.site_config.services import get_current_site_settings


def _iso(value):
    return value.isoformat() if value else None


def _normalize_publish_state(value: str | None) -> str:
    if value == PublishState.PUBLISHED:
        return "published"
    if value == PublishState.ARCHIVED:
        return "archived"
    return "draft"


def _normalize_visibility(value: str | None, *, default_visible: bool = True) -> str:
    if value in {VisibilityState.VISIBLE, VisibilityState.HIDDEN}:
        return value
    return VisibilityState.VISIBLE if default_visible else VisibilityState.HIDDEN


def _managed_content_meta(item, *, status: str | None = None, visibility: str | None = None, sort_order: int = 0):
    return {
        "id": str(item.id),
        "createdAt": _iso(item.created_at),
        "updatedAt": _iso(item.updated_at),
        "status": status or _normalize_publish_state(getattr(item, "publish_state", None)),
        "visibility": visibility or _normalize_visibility(getattr(item, "visibility_state", None)),
        "sortOrder": sort_order,
        "publishedAt": _iso(getattr(item, "published_at", None)),
    }


def _build_media_url(request, asset: MediaAsset) -> str:
    if not asset.file:
        return ""
    url = asset.file.url
    return request.build_absolute_uri(url) if request else url


def serialize_media_asset(request, asset: MediaAsset) -> dict[str, Any]:
    return {
        **_managed_content_meta(
            asset,
            visibility=VisibilityState.VISIBLE if asset.is_public else VisibilityState.HIDDEN,
            sort_order=asset.sort_order,
        ),
        "kind": asset.kind,
        "label": asset.title,
        "url": _build_media_url(request, asset),
        "alt": asset.alt_text or None,
        "mimeType": asset.mime_type or None,
        "width": asset.width,
        "height": asset.height,
        "durationSeconds": getattr(asset, "duration_seconds", None),
        "storageKey": asset.file.name if asset.file else None,
    }


def _theme_settings_payload(site: SiteSettings) -> dict[str, Any]:
    theme = getattr(site, "theme", None)
    if theme is None:
        raise ValueError("Theme settings are not configured.")
    return {
        "brand": {
            "primary": theme.brand_primary,
            "primaryStrong": theme.brand_primary_strong,
            "secondary": theme.brand_secondary,
            "soft": theme.brand_soft,
        },
        "background": {
            "page": theme.background_page,
            "soft": theme.background_soft,
            "about": theme.background_about,
            "achievements": theme.background_achievements,
            "dark": theme.background_dark,
            "lightPanel": theme.background_light_panel,
        },
        "text": {
            "primary": theme.text_primary,
            "secondary": theme.text_secondary,
            "muted": theme.text_muted,
            "soft": theme.text_soft,
            "white": theme.text_white,
        },
        "border": {
            "soft": theme.border_soft,
            "whiteSoft": theme.border_white_soft,
        },
        "overlay": {
            "hero": theme.overlay_hero,
            "navbar": theme.overlay_navbar,
            "modal": theme.overlay_modal,
        },
        "surface": {
            "white": theme.surface_white,
            "glass": theme.surface_glass,
            "modal": theme.surface_modal,
        },
        "mobileHero": {
            "topIconOuterBackground": theme.mobile_hero_top_icon_outer_background,
            "topIconInnerBackground": theme.mobile_hero_top_icon_inner_background,
            "bottomNavBackground": theme.mobile_hero_bottom_nav_background,
            "bottomNavTextColor": theme.mobile_hero_bottom_nav_text_color,
            "softShadow": theme.mobile_hero_soft_shadow,
            "navShadow": theme.mobile_hero_nav_shadow,
        },
    }


def serialize_site_identity(site: SiteSettings) -> dict[str, Any]:
    return {
        **_managed_content_meta(
            site,
            status="published" if site.is_active else "draft",
            visibility=VisibilityState.VISIBLE if site.is_active else VisibilityState.HIDDEN,
        ),
        "siteName": site.site_name,
        "brandText": site.brand_text or site.site_name,
        "tagline": site.site_tagline or None,
        "logoAssetId": str(site.logo_asset_id) if site.logo_asset_id else None,
        "faviconAssetId": str(site.favicon_asset_id) if site.favicon_asset_id else None,
        "themeSettings": _theme_settings_payload(site),
    }


def serialize_navigation_link(link: NavigationLink) -> dict[str, Any]:
    return {
        **_managed_content_meta(link, sort_order=link.sort_order),
        "label": link.label,
        "href": link.href,
        "placement": link.placements,
        "openInNewTab": link.open_in_new_tab,
    }


def serialize_hero(hero: HeroSection) -> dict[str, Any]:
    return {
        **_managed_content_meta(hero),
        "titleLines": [item for item in [hero.title, hero.title_line_two] if item],
        "backgroundMediaAssetId": str(hero.background_asset_id) if hero.background_asset_id else None,
        "mobileBackgroundMediaAssetId": str(hero.mobile_background_asset_id) if hero.mobile_background_asset_id else None,
        "logoAssetId": str(hero.logo_asset_id) if hero.logo_asset_id else None,
        "overlay": {"color": hero.overlay_color},
    }


def serialize_about(section: AboutSection) -> dict[str, Any]:
    return {
        **_managed_content_meta(section),
        "sectionLabel": section.section_label,
        "brandTitle": section.brand_title,
        "imageAssetId": str(section.image_asset_id) if section.image_asset_id else None,
    }


def serialize_about_text_item(item: AboutTextItem) -> dict[str, Any]:
    return {
        **_managed_content_meta(item, sort_order=item.sort_order),
        "aboutSectionId": str(item.section_id),
        "text": item.text,
    }


def _product_media_asset_id(product) -> str | None:
    if product.cover_asset_id:
        return str(product.cover_asset_id)

    primary_item = next(
        (item for item in product.media_items.all() if item.role == "primary" and item.asset_id),
        None,
    )
    if primary_item:
        return str(primary_item.asset_id)

    first_item = next((item for item in product.media_items.all() if item.asset_id), None)
    return str(first_item.asset_id) if first_item else None


def serialize_product(product) -> dict[str, Any]:
    theme = getattr(product, "theme", None)
    if theme is None:
        raise ValueError(f"Product theme missing for '{product.title}'.")

    colors = [
        item
        for item in product.color_variants.all()
        if item.publish_state == PublishState.PUBLISHED and item.visibility_state == VisibilityState.VISIBLE
    ]

    return {
        **_managed_content_meta(product, sort_order=product.sort_order),
        "slug": product.slug,
        "title": product.title,
        "subtitle": product.subtitle or None,
        "description": product.description or product.short_description,
        "price": str(product.price.quantize(Decimal("0.01"))),
        "badge": product.badge or theme.badge_label or None,
        "mediaAssetId": _product_media_asset_id(product),
        "displayTheme": {
            "bg": theme.surface_color,
            "text": theme.text_color,
            "accent": theme.accent_color,
            "muted": theme.muted_color,
            "card": theme.card_color,
            "tone": theme.tone,
        },
        "mediaPanel": {
            "mode": to_public_media_panel_mode(theme.media_panel_mode),
            "color": theme.media_panel_color or None,
        },
        "colorVariantIds": [str(item.id) for item in colors],
        "savedEnabled": product.saved_enabled,
        "cartEnabled": product.cart_enabled,
        "orderEnabled": product.order_enabled,
    }


def serialize_product_color(color: ProductColor) -> dict[str, Any]:
    return {
        **_managed_content_meta(color, sort_order=color.sort_order),
        "productId": str(color.product_id),
        "name": color.name,
        "hex": color.hex_color,
        "previewAssetId": str(color.preview_asset_id) if color.preview_asset_id else None,
    }


def serialize_achievement(item: Achievement) -> dict[str, Any]:
    return {
        **_managed_content_meta(item, sort_order=item.sort_order),
        "title": item.title,
        "eyebrow": item.eyebrow or None,
        "description": item.description,
        "mediaAssetId": str(item.media_asset_id) if item.media_asset_id else None,
        "displayTheme": {
            "frame": item.frame_color,
            "ribbon": item.ribbon_color,
            "text": item.text_color,
            "muted": item.muted_color,
        },
    }


def serialize_footer(section: FooterSection) -> dict[str, Any]:
    return {
        **_managed_content_meta(section),
        "brandText": section.brand_text,
        "description": section.description,
        "contactItems": section.contact_items,
        "socialLinks": section.social_links,
        "cta": {
            "title": section.cta_title,
            "description": section.cta_description,
            "primaryLabel": section.cta_primary_label,
            "primaryMode": section.cta_primary_mode,
            "secondaryLabel": section.cta_secondary_label,
            "secondaryHref": section.cta_secondary_href,
        },
        "legalText": section.legal_text,
    }


def build_public_site_snapshot(request=None) -> dict[str, Any]:
    site = get_current_site_settings()
    hero = get_current_public_hero()
    about = get_current_public_about()
    footer = get_current_public_footer()

    if site is None:
        raise ValueError("Site settings are not configured.")
    if getattr(site, "theme", None) is None or site.theme.publish_state != PublishState.PUBLISHED:
        raise ValueError("Published theme settings are not configured.")
    if hero is None:
        raise ValueError("Published hero section is not configured.")
    if about is None:
        raise ValueError("Published about section is not configured.")
    if footer is None:
        raise ValueError("Published footer section is not configured.")

    about_items = list(
        about.text_items.filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).order_by("sort_order", "created_at")
    )
    products = list(
        Product.objects.select_related("cover_asset", "theme").prefetch_related(
            "media_items__asset",
            "color_variants__preview_asset",
        ).filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
            is_available=True,
        ).order_by("sort_order", "title")
    )
    achievements = list(
        Achievement.objects.select_related("media_asset").filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).order_by("sort_order", "created_at")
    )
    navigation = list(
        NavigationLink.objects.filter(
            publish_state=PublishState.PUBLISHED,
            visibility_state=VisibilityState.VISIBLE,
        ).order_by("sort_order", "created_at")
    )
    product_colors = [
        color
        for product in products
        for color in product.color_variants.all()
        if color.publish_state == PublishState.PUBLISHED and color.visibility_state == VisibilityState.VISIBLE
    ]

    referenced_asset_ids = {
        site.logo_asset_id,
        site.favicon_asset_id,
        hero.background_asset_id,
        hero.mobile_background_asset_id,
        hero.logo_asset_id,
        about.image_asset_id,
    }
    referenced_asset_ids.update(filter(None, [_product_media_asset_id(product) for product in products]))
    referenced_asset_ids.update(filter(None, [item.media_asset_id for item in achievements]))
    referenced_asset_ids.update(filter(None, [color.preview_asset_id for color in product_colors]))

    media_assets = list(
        MediaAsset.objects.filter(id__in=[asset_id for asset_id in referenced_asset_ids if asset_id]).order_by("sort_order", "title")
    )

    return {
        "generatedAt": timezone.now().isoformat(),
        "siteIdentity": serialize_site_identity(site),
        "navigationLinks": [serialize_navigation_link(link) for link in navigation],
        "hero": serialize_hero(hero),
        "about": serialize_about(about),
        "aboutTextItems": [serialize_about_text_item(item) for item in about_items],
        "products": [serialize_product(product) for product in products],
        "productColorVariants": [serialize_product_color(color) for color in product_colors],
        "achievements": [serialize_achievement(item) for item in achievements],
        "footer": serialize_footer(footer),
        "mediaAssets": [serialize_media_asset(request, asset) for asset in media_assets],
    }


def _merge_site_identity(snapshot: dict[str, Any], payload: dict[str, Any]):
    site_identity = snapshot["siteIdentity"]
    theme = payload.get("theme") or {}
    theme_settings = site_identity["themeSettings"]

    site_identity["siteName"] = payload.get("site_name", site_identity["siteName"])
    site_identity["brandText"] = payload.get("brand_text", site_identity["brandText"])
    site_identity["tagline"] = payload.get("site_tagline", site_identity.get("tagline"))
    site_identity["logoAssetId"] = payload.get("logo_asset_id", site_identity.get("logoAssetId"))
    site_identity["faviconAssetId"] = payload.get("favicon_asset_id", site_identity.get("faviconAssetId"))

    for group, keys in {
        "brand": ["brand_primary", "brand_primary_strong", "brand_secondary", "brand_soft"],
        "background": [
            "background_page",
            "background_soft",
            "background_about",
            "background_achievements",
            "background_dark",
            "background_light_panel",
        ],
        "text": ["text_primary", "text_secondary", "text_muted", "text_soft", "text_white"],
        "border": ["border_soft", "border_white_soft"],
        "overlay": ["overlay_hero", "overlay_navbar", "overlay_modal"],
        "surface": ["surface_white", "surface_glass", "surface_modal"],
        "mobileHero": [
            "mobile_hero_top_icon_outer_background",
            "mobile_hero_top_icon_inner_background",
            "mobile_hero_bottom_nav_background",
            "mobile_hero_bottom_nav_text_color",
            "mobile_hero_soft_shadow",
            "mobile_hero_nav_shadow",
        ],
    }.items():
        for key in keys:
            if key in theme:
                camel = {
                    "brand_primary": "primary",
                    "brand_primary_strong": "primaryStrong",
                    "brand_secondary": "secondary",
                    "brand_soft": "soft",
                    "background_page": "page",
                    "background_soft": "soft",
                    "background_about": "about",
                    "background_achievements": "achievements",
                    "background_dark": "dark",
                    "background_light_panel": "lightPanel",
                    "text_primary": "primary",
                    "text_secondary": "secondary",
                    "text_muted": "muted",
                    "text_soft": "soft",
                    "text_white": "white",
                    "border_soft": "soft",
                    "border_white_soft": "whiteSoft",
                    "overlay_hero": "hero",
                    "overlay_navbar": "navbar",
                    "overlay_modal": "modal",
                    "surface_white": "white",
                    "surface_glass": "glass",
                    "surface_modal": "modal",
                    "mobile_hero_top_icon_outer_background": "topIconOuterBackground",
                    "mobile_hero_top_icon_inner_background": "topIconInnerBackground",
                    "mobile_hero_bottom_nav_background": "bottomNavBackground",
                    "mobile_hero_bottom_nav_text_color": "bottomNavTextColor",
                    "mobile_hero_soft_shadow": "softShadow",
                    "mobile_hero_nav_shadow": "navShadow",
                }[key]
                theme_settings[group][camel] = theme[key]


def _merge_hero(snapshot: dict[str, Any], payload: dict[str, Any]):
    snapshot["hero"].update(
        {
            "status": _normalize_publish_state(payload.get("publish_state")),
            "visibility": _normalize_visibility(payload.get("visibility_state")),
            "titleLines": [item for item in [payload.get("title"), payload.get("title_line_two")] if item],
            "backgroundMediaAssetId": payload.get("background_asset_id"),
            "mobileBackgroundMediaAssetId": payload.get("mobile_background_asset_id"),
            "logoAssetId": payload.get("logo_asset_id"),
            "overlay": {"color": payload.get("overlay_color", snapshot["hero"]["overlay"]["color"])},
        }
    )


def _merge_about(snapshot: dict[str, Any], payload: dict[str, Any]):
    snapshot["about"].update(
        {
            "status": _normalize_publish_state(payload.get("publish_state")),
            "visibility": _normalize_visibility(payload.get("visibility_state")),
            "sectionLabel": payload.get("section_label"),
            "brandTitle": payload.get("brand_title"),
            "imageAssetId": payload.get("image_asset_id"),
        }
    )
    text_items = payload.get("text_items_payload") or payload.get("text_items") or []
    snapshot["aboutTextItems"] = [
        {
            "id": str(item.get("id") or f"preview-about-{index}"),
            "createdAt": timezone.now().isoformat(),
            "updatedAt": timezone.now().isoformat(),
            "status": _normalize_publish_state(item.get("publish_state")),
            "visibility": _normalize_visibility(item.get("visibility_state")),
            "sortOrder": item.get("sort_order", index),
            "publishedAt": None,
            "aboutSectionId": snapshot["about"]["id"],
            "text": item.get("text", ""),
        }
        for index, item in enumerate(text_items)
    ]


def _merge_footer(snapshot: dict[str, Any], payload: dict[str, Any]):
    cta = payload.get("cta_payload") or payload.get("cta") or {}
    snapshot["footer"].update(
        {
            "status": _normalize_publish_state(payload.get("publish_state")),
            "visibility": _normalize_visibility(payload.get("visibility_state")),
            "brandText": payload.get("brand_text"),
            "description": payload.get("description"),
            "contactItems": payload.get("contact_items", []),
            "socialLinks": payload.get("social_links", []),
            "legalText": payload.get("legal_text"),
            "cta": {
                "title": cta.get("title", ""),
                "description": cta.get("description", ""),
                "primaryLabel": cta.get("primary_label", ""),
                "primaryMode": cta.get("primary_mode", "login"),
                "secondaryLabel": cta.get("secondary_label", ""),
                "secondaryHref": cta.get("secondary_href", ""),
            },
        }
    )


def _merge_products(snapshot: dict[str, Any], payload: dict[str, Any]):
    product_id = str(payload.get("id") or "preview-product")
    color_variants = payload.get("color_variants", [])
    snapshot["products"] = [
        item for item in snapshot["products"] if item["id"] != product_id
    ] + [
        {
            "id": product_id,
            "createdAt": timezone.now().isoformat(),
            "updatedAt": timezone.now().isoformat(),
            "status": _normalize_publish_state(payload.get("publish_state")),
            "visibility": _normalize_visibility(payload.get("visibility_state")),
            "sortOrder": payload.get("sort_order", 0),
            "publishedAt": None,
            "slug": payload.get("slug") or "",
            "title": payload.get("title") or "",
            "subtitle": payload.get("subtitle") or None,
            "description": payload.get("description") or payload.get("short_description") or "",
            "price": str(payload.get("price") or "0.00"),
            "badge": payload.get("badge") or None,
            "mediaAssetId": payload.get("cover_asset_id"),
            "displayTheme": {
                "bg": payload.get("theme", {}).get("surface_color"),
                "text": payload.get("theme", {}).get("text_color"),
                "accent": payload.get("theme", {}).get("accent_color"),
                "muted": payload.get("theme", {}).get("muted_color"),
                "card": payload.get("theme", {}).get("card_color"),
                "tone": payload.get("theme", {}).get("tone"),
            },
            "mediaPanel": {
                "mode": to_public_media_panel_mode(payload.get("theme", {}).get("media_panel_mode")),
                "color": payload.get("theme", {}).get("media_panel_color") or None,
            },
            "colorVariantIds": [str(item.get("id") or f"preview-product-color-{index}") for index, item in enumerate(color_variants)],
            "savedEnabled": payload.get("saved_enabled", True),
            "cartEnabled": payload.get("cart_enabled", True),
            "orderEnabled": payload.get("order_enabled", True),
        }
    ]
    snapshot["productColorVariants"] = [
        item for item in snapshot["productColorVariants"] if item["productId"] != product_id
    ] + [
        {
            "id": str(item.get("id") or f"preview-product-color-{index}"),
            "createdAt": timezone.now().isoformat(),
            "updatedAt": timezone.now().isoformat(),
            "status": _normalize_publish_state(item.get("publish_state")),
            "visibility": _normalize_visibility(item.get("visibility_state")),
            "sortOrder": item.get("sort_order", index),
            "publishedAt": None,
            "productId": product_id,
            "name": item.get("name", ""),
            "hex": item.get("hex_color", ""),
            "previewAssetId": item.get("preview_asset_id"),
        }
        for index, item in enumerate(color_variants)
    ]


def _merge_achievements(snapshot: dict[str, Any], payload: dict[str, Any]):
    item_id = str(payload.get("id") or "preview-achievement")
    snapshot["achievements"] = [
        item for item in snapshot["achievements"] if item["id"] != item_id
    ] + [
        {
            "id": item_id,
            "createdAt": timezone.now().isoformat(),
            "updatedAt": timezone.now().isoformat(),
            "status": _normalize_publish_state(payload.get("publish_state")),
            "visibility": _normalize_visibility(payload.get("visibility_state")),
            "sortOrder": payload.get("sort_order", 0),
            "publishedAt": None,
            "title": payload.get("title", ""),
            "eyebrow": payload.get("eyebrow") or None,
            "description": payload.get("description", ""),
            "mediaAssetId": payload.get("media_asset_id"),
            "displayTheme": {
                "frame": payload.get("frame_color"),
                "ribbon": payload.get("ribbon_color"),
                "text": payload.get("text_color"),
                "muted": payload.get("muted_color"),
            },
        }
    ]


def build_preview_site_snapshot(module: str, payload: dict[str, Any], request=None) -> dict[str, Any]:
    snapshot = build_public_site_snapshot(request=request)

    if module == "site_settings":
        _merge_site_identity(snapshot, payload)
    elif module == "hero":
        _merge_hero(snapshot, payload)
    elif module == "about":
        _merge_about(snapshot, payload)
    elif module == "footer":
        _merge_footer(snapshot, payload)
    elif module == "products":
        _merge_products(snapshot, payload)
    elif module == "achievements":
        _merge_achievements(snapshot, payload)
    else:
        raise ValueError(f"Unsupported preview module '{module}'.")

    snapshot["generatedAt"] = timezone.now().isoformat()
    return snapshot
