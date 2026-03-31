"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { ApiError, getSiteSettings, saveSiteSettings } from "@/lib/api";
import type { MediaAsset, SiteSettingsRecord, ThemeRecord } from "@/lib/types";
import { AssetPicker } from "@/components/shared/asset-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { LivePreviewPanel } from "@/components/shared/live-preview-panel";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLivePreview } from "@/lib/use-live-preview";

const initialTheme: ThemeRecord = {
  theme_name: "Premium Default",
  publish_state: "draft",
  brand_primary: "#0B1020",
  brand_accent: "#D2A85E",
  brand_primary_strong: "#9E7A36",
  brand_secondary: "#D2A85E",
  brand_soft: "#F1DFBF",
  background_page: "#050814",
  background_soft: "#0F1423",
  background_about: "#111827",
  background_achievements: "#161E31",
  background_dark: "#02050D",
  background_light_panel: "#1B2740",
  text_primary: "#F4F0E8",
  text_secondary: "#9BA3B5",
  text_muted: "#7F8AA3",
  text_soft: "#C1C8D6",
  text_white: "#FFFFFF",
  border_soft: "#2B3246",
  border_white_soft: "rgba(255,255,255,0.12)",
  overlay_hero: "#0B1020CC",
  overlay_navbar: "rgba(5,8,20,0.72)",
  overlay_modal: "rgba(5,8,20,0.82)",
  surface_white: "#FFFFFF",
  surface_glass: "rgba(255,255,255,0.12)",
  surface_modal: "#141B2D",
  mobile_hero_top_icon_outer_background: "#8B5F2E",
  mobile_hero_top_icon_inner_background: "#FFFFFF",
  mobile_hero_bottom_nav_background: "rgba(10,15,28,0.92)",
  mobile_hero_bottom_nav_text_color: "#F4F0E8",
  mobile_hero_soft_shadow: "0 16px 36px rgba(0, 0, 0, 0.28)",
  mobile_hero_nav_shadow: "0 18px 42px rgba(0, 0, 0, 0.22)",
};

const initialState: SiteSettingsRecord = {
  site_name: "",
  brand_text: "",
  site_tagline: "",
  site_description: "",
  support_email: "",
  support_phone: "",
  is_active: true,
  maintenance_mode: false,
  logo_asset: null,
  favicon_asset: null,
  theme: initialTheme,
};

const themeGroups: Array<{ title: string; description: string; fields: Array<[keyof ThemeRecord, string]> }> = [
  {
    title: "Brand",
    description: "Identity and brand tone tokens shared across dashboard previews and the public website.",
    fields: [
      ["brand_primary", "Brand primary"],
      ["brand_accent", "Brand accent"],
      ["brand_primary_strong", "Brand primary strong"],
      ["brand_secondary", "Brand secondary"],
      ["brand_soft", "Brand soft"],
    ],
  },
  {
    title: "Background",
    description: "Surface layers for page sections and premium panels.",
    fields: [
      ["background_page", "Background page"],
      ["background_soft", "Background soft"],
      ["background_about", "Background about"],
      ["background_achievements", "Background achievements"],
      ["background_dark", "Background dark"],
      ["background_light_panel", "Background light panel"],
    ],
  },
  {
    title: "Text & border",
    description: "Semantic text and border tokens for rich layouts.",
    fields: [
      ["text_primary", "Text primary"],
      ["text_secondary", "Text secondary"],
      ["text_muted", "Text muted"],
      ["text_soft", "Text soft"],
      ["text_white", "Text white"],
      ["border_soft", "Border soft"],
      ["border_white_soft", "Border white soft"],
    ],
  },
  {
    title: "Overlay & surface",
    description: "Overlays and elevated surface tokens used for hero, navbar, glass, and modal states.",
    fields: [
      ["overlay_hero", "Overlay hero"],
      ["overlay_navbar", "Overlay navbar"],
      ["overlay_modal", "Overlay modal"],
      ["surface_white", "Surface white"],
      ["surface_glass", "Surface glass"],
      ["surface_modal", "Surface modal"],
    ],
  },
  {
    title: "Mobile hero",
    description: "Mobile-specific semantic slots requested by the public prototype.",
    fields: [
      ["mobile_hero_top_icon_outer_background", "Top icon outer"],
      ["mobile_hero_top_icon_inner_background", "Top icon inner"],
      ["mobile_hero_bottom_nav_background", "Bottom nav background"],
      ["mobile_hero_bottom_nav_text_color", "Bottom nav text"],
      ["mobile_hero_soft_shadow", "Soft shadow"],
      ["mobile_hero_nav_shadow", "Nav shadow"],
    ],
  },
];

export function ThemeForm() {
  const [form, setForm] = useState<SiteSettingsRecord>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getSiteSettings()
      .then((payload) => setForm(payload))
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 404) {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const theme = form.theme ?? initialTheme;
  const livePreview = useLivePreview(
    "site_settings",
    {
      site_name: form.site_name,
      brand_text: form.brand_text,
      site_tagline: form.site_tagline,
      site_description: form.site_description,
      support_email: form.support_email,
      support_phone: form.support_phone,
      is_active: form.is_active,
      maintenance_mode: form.maintenance_mode,
      logo_asset_id: form.logo_asset?.id ?? null,
      favicon_asset_id: form.favicon_asset?.id ?? null,
      theme,
    },
    Boolean(form.site_name)
  );

  const previewStyle = useMemo(
    () =>
      ({
        "--page": theme.background_page,
        "--soft": theme.background_soft,
        "--accent": theme.brand_secondary,
        "--primary": theme.brand_primary,
        "--text-primary": theme.text_primary,
        "--text-secondary": theme.text_secondary,
        "--border": theme.border_soft,
        "--modal": theme.surface_modal,
      }) as CSSProperties,
    [theme]
  );

  const updateField = <K extends keyof SiteSettingsRecord>(key: K, value: SiteSettingsRecord[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateTheme = <K extends keyof ThemeRecord>(key: K, value: ThemeRecord[K]) => {
    setForm((current) => ({ ...current, theme: { ...(current.theme ?? initialTheme), [key]: value } }));
  };

  const handleAssetChange = (key: "logo_asset" | "favicon_asset", asset: MediaAsset | null) => {
    setForm((current) =>
      key === "logo_asset"
        ? {
            ...current,
            logo_asset: asset,
            logo_asset_id: asset?.id ?? null,
          }
        : {
            ...current,
            favicon_asset: asset,
            favicon_asset_id: asset?.id ?? null,
          }
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = await saveSiteSettings({
        site_name: form.site_name,
        brand_text: form.brand_text,
        site_tagline: form.site_tagline,
        site_description: form.site_description,
        support_email: form.support_email,
        support_phone: form.support_phone,
        is_active: form.is_active,
        maintenance_mode: form.maintenance_mode,
        logo_asset_id: form.logo_asset?.id ?? null,
        favicon_asset_id: form.favicon_asset?.id ?? null,
        theme: form.theme ?? initialTheme,
      });
      setForm(payload);
      setSuccess("Site settings saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted-text">Loading site settings...</p>;
  }

  return (
    <div className="workspace-grid two-columns">
      <Panel title="Site identity & theme" subtitle="Control the shared brand, semantic theme tokens, and identity assets used by the public website.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Site name
            <input value={form.site_name} onChange={(event) => updateField("site_name", event.target.value)} required />
          </label>
          <label>
            Brand text
            <input value={form.brand_text} onChange={(event) => updateField("brand_text", event.target.value)} />
          </label>
          <label>
            Theme state
            <select value={theme.publish_state} onChange={(event) => updateTheme("publish_state", event.target.value as ThemeRecord["publish_state"])}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Theme name
            <input value={theme.theme_name} onChange={(event) => updateTheme("theme_name", event.target.value)} />
          </label>
          <label>
            Tagline
            <input value={form.site_tagline} onChange={(event) => updateField("site_tagline", event.target.value)} />
          </label>
          <label>
            Support email
            <input value={form.support_email} onChange={(event) => updateField("support_email", event.target.value)} />
          </label>
          <label>
            Support phone
            <input value={form.support_phone} onChange={(event) => updateField("support_phone", event.target.value)} />
          </label>
          <label className="toggle-field">
            <input checked={form.is_active} type="checkbox" onChange={(event) => updateField("is_active", event.target.checked)} />
            Site active
          </label>
          <label className="toggle-field">
            <input checked={form.maintenance_mode} type="checkbox" onChange={(event) => updateField("maintenance_mode", event.target.checked)} />
            Maintenance mode
          </label>
          <label className="full-span">
            Site description
            <textarea rows={4} value={form.site_description} onChange={(event) => updateField("site_description", event.target.value)} />
          </label>

          <div className="full-span">
            <AssetPicker
              label="Logo asset"
              selectedAsset={form.logo_asset}
              onSelect={(asset) => handleAssetChange("logo_asset", asset)}
              allowedKinds={["image", "logo"]}
            />
          </div>
          <div className="full-span">
            <AssetPicker
              label="Favicon asset"
              selectedAsset={form.favicon_asset}
              onSelect={(asset) => handleAssetChange("favicon_asset", asset)}
              allowedKinds={["image", "icon", "favicon", "logo"]}
            />
          </div>

          {themeGroups.map((group) => (
            <div key={group.title} className="full-span nested-section">
              <div className="section-header-row">
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
              </div>
              <div className="subgrid three-up">
                {group.fields.map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input value={theme[key]} onChange={(event) => updateTheme(key, event.target.value as never)} />
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}
          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save site settings"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Theme preview" subtitle="Semantic preview surfaces for public-safe and dashboard-safe rendering.">
        {form.site_name ? (
          <div className="theme-preview" style={previewStyle}>
            <div className="theme-preview-header">
              <div>
                <p>{form.site_name}</p>
                <h3>{theme.theme_name}</h3>
              </div>
              <StatusBadge state={theme.publish_state} />
            </div>
            <div className="theme-demo-surface">
              <div className="theme-demo-card">
                <small>{form.brand_text || form.site_name}</small>
                <h4>{form.site_tagline || "Shared visual language"}</h4>
                <p>{form.site_description || "Theme tokens map into both public layouts from one backend source."}</p>
              </div>
              <div className="theme-swatch-grid">
                {[
                  ["Primary", theme.brand_primary],
                  ["Secondary", theme.brand_secondary],
                  ["About", theme.background_about],
                  ["Achievements", theme.background_achievements],
                  ["Modal", theme.surface_modal],
                  ["Glass", theme.surface_glass],
                ].map(([label, value]) => (
                  <div key={label} className="swatch-card">
                    <span>{label}</span>
                    <div className="swatch-dot large" style={{ background: value }} />
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="No site profile yet" message="Save the first site and theme record to activate the global brand system." />
        )}
      </Panel>

      <div className="full-span">
        <LivePreviewPanel
          title="Public website preview"
          subtitle="This preview session is generated from the real site settings and theme payload."
          previewUrl={livePreview.previewUrl}
          snapshotUrl={livePreview.snapshotUrl}
          loading={livePreview.loading}
          error={livePreview.error}
        />
      </div>
    </div>
  );
}
