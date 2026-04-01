export type PublishState = "draft" | "review" | "published" | "archived";
export type VisibilityState = "visible" | "hidden";

export type AuthUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  last_login?: string | null;
};

export type MediaAsset = {
  id: string;
  title: string;
  kind: string;
  alt_text?: string;
  caption?: string;
  mime_type?: string;
  size_bytes?: number;
  width?: number | null;
  height?: number | null;
  is_public?: boolean;
  publish_state?: PublishState;
  published_at?: string | null;
  sort_order?: number;
  file_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type HeroRecord = {
  id?: string;
  code?: string;
  eyebrow: string;
  title: string;
  title_line_two: string;
  subtitle: string;
  highlight_text: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  preview_note: string;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  overlay_color: string;
  logo_asset: MediaAsset | null;
  background_asset: MediaAsset | null;
  mobile_background_asset: MediaAsset | null;
  logo_asset_id?: string | null;
  background_asset_id?: string | null;
  mobile_background_asset_id?: string | null;
  updated_at?: string;
};

export type AboutTextItem = {
  id?: string;
  text: string;
  sort_order: number;
  publish_state: PublishState;
  visibility_state: VisibilityState;
};

export type AboutRecord = {
  id?: string;
  code?: string;
  section_label: string;
  brand_title: string;
  description: string;
  preview_note: string;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  image_asset: MediaAsset | null;
  image_asset_id?: string | null;
  text_items: AboutTextItem[];
  text_items_payload?: AboutTextItem[];
  updated_at?: string;
};

export type AchievementDisplayTheme = {
  frame: string;
  ribbon: string;
  text: string;
  muted: string;
};

export type AchievementRecord = {
  id?: string;
  title: string;
  eyebrow: string;
  description: string;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  sort_order: number;
  media_asset: MediaAsset | null;
  media_asset_id?: string | null;
  frame_color: string;
  ribbon_color: string;
  text_color: string;
  muted_color: string;
  display_theme?: AchievementDisplayTheme;
  created_at?: string;
  updated_at?: string;
};

export type FooterContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type FooterSocialLink = {
  label: string;
  href: string;
};

export type FooterCallToAction = {
  title: string;
  description: string;
  primary_label: string;
  primary_mode: "login" | "register";
  secondary_label: string;
  secondary_href: string;
};

export type FooterRecord = {
  id?: string;
  code?: string;
  brand_text: string;
  description: string;
  contact_items: FooterContactItem[];
  social_links: FooterSocialLink[];
  cta: FooterCallToAction;
  cta_payload?: FooterCallToAction;
  legal_text: string;
  preview_note: string;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  updated_at?: string;
};

export type ProductTheme = {
  accent_color: string;
  surface_color: string;
  text_color: string;
  badge_label: string;
  muted_color: string;
  card_color: string;
  tone: "light" | "dark";
  media_panel_mode: "image_tone" | "force_black" | "force_white";
  media_panel_color: string;
};

export type ProductMediaItem = {
  id?: string;
  label: string;
  role: "primary" | "gallery" | "detail";
  sort_order: number;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  asset: MediaAsset | null;
  asset_id?: string | null;
};

export type ProductColorVariant = {
  id?: string;
  name: string;
  hex_color: string;
  sort_order: number;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  preview_asset: MediaAsset | null;
  preview_asset_id?: string | null;
};

export type ProductRecord = {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  badge: string;
  publish_state: PublishState;
  visibility_state: VisibilityState;
  sort_order: number;
  is_featured: boolean;
  is_available: boolean;
  saved_enabled: boolean;
  cart_enabled: boolean;
  order_enabled: boolean;
  cover_asset: MediaAsset | null;
  cover_asset_id?: string | null;
  theme: ProductTheme;
  media_items: ProductMediaItem[];
  color_variants: ProductColorVariant[];
  created_at?: string;
  updated_at?: string;
};

export type ThemeRecord = {
  theme_name: string;
  publish_state: PublishState;
  brand_primary: string;
  brand_accent: string;
  brand_primary_strong: string;
  brand_secondary: string;
  brand_soft: string;
  background_page: string;
  background_soft: string;
  background_about: string;
  background_achievements: string;
  background_dark: string;
  background_light_panel: string;
  text_primary: string;
  text_secondary: string;
  text_muted: string;
  text_soft: string;
  text_white: string;
  border_soft: string;
  border_white_soft: string;
  overlay_hero: string;
  overlay_navbar: string;
  overlay_modal: string;
  surface_white: string;
  surface_glass: string;
  surface_modal: string;
  mobile_hero_top_icon_outer_background: string;
  mobile_hero_top_icon_inner_background: string;
  mobile_hero_bottom_nav_background: string;
  mobile_hero_bottom_nav_text_color: string;
  mobile_hero_soft_shadow: string;
  mobile_hero_nav_shadow: string;
};

export type SiteSettingsRecord = {
  id?: string;
  code?: string;
  site_name: string;
  brand_text: string;
  site_tagline: string;
  site_description: string;
  support_email: string;
  support_phone: string;
  is_active: boolean;
  maintenance_mode: boolean;
  logo_asset: MediaAsset | null;
  favicon_asset: MediaAsset | null;
  logo_asset_id?: string | null;
  favicon_asset_id?: string | null;
  theme: ThemeRecord | null;
  created_at?: string;
  updated_at?: string;
};

export type OverviewResponse = {
  service: string;
  environment: string;
  counts: {
    products: { total: number; published: number; draft: number };
    media: { total: number; published: number; public: number };
    achievements: { total: number; published: number };
    users: { total: number; staff: number; super_admin: number };
  };
  modules: {
    site_settings: { configured: boolean; maintenance_mode: boolean; theme_ready: boolean };
    hero: { configured: boolean; published: boolean };
    about: { configured: boolean; published: boolean };
    achievements: { configured: boolean; published: boolean };
    footer: { configured: boolean; published: boolean };
  };
  recent_activity: AuditLog[];
};

export type AuditLog = {
  id: string;
  action: string;
  message: string;
  actor_email: string | null;
  target_app: string;
  target_model: string;
  target_object_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
};
