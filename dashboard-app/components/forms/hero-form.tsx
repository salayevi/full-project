"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, deleteHero, getHero, saveHero } from "@/lib/api";
import type { HeroRecord, MediaAsset } from "@/lib/types";
import { AssetPicker } from "@/components/shared/asset-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { LivePreviewPanel } from "@/components/shared/live-preview-panel";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLivePreview } from "@/lib/use-live-preview";

const initialHero: HeroRecord = {
  eyebrow: "",
  title: "",
  title_line_two: "",
  subtitle: "",
  highlight_text: "",
  primary_cta_label: "",
  primary_cta_url: "",
  secondary_cta_label: "",
  secondary_cta_url: "",
  preview_note: "",
  publish_state: "draft",
  visibility_state: "visible",
  overlay_color: "rgba(5,8,20,0.58)",
  logo_asset: null,
  background_asset: null,
  mobile_background_asset: null,
};

export function HeroForm() {
  const [form, setForm] = useState<HeroRecord>(initialHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getHero()
      .then((payload) => setForm(payload))
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 404) {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const previewStyle = useMemo(
    () => ({
      backgroundImage: form.background_asset?.file_url
        ? `linear-gradient(135deg, ${form.overlay_color}, rgba(5, 8, 20, 0.18)), url(${form.background_asset.file_url})`
        : undefined,
    }),
    [form.background_asset, form.overlay_color]
  );
  const livePreview = useLivePreview(
    "hero",
    {
      eyebrow: form.eyebrow,
      title: form.title,
      title_line_two: form.title_line_two,
      subtitle: form.subtitle,
      highlight_text: form.highlight_text,
      primary_cta_label: form.primary_cta_label,
      primary_cta_url: form.primary_cta_url,
      secondary_cta_label: form.secondary_cta_label,
      secondary_cta_url: form.secondary_cta_url,
      publish_state: form.publish_state,
      visibility_state: form.visibility_state,
      overlay_color: form.overlay_color,
      logo_asset_id: form.logo_asset?.id ?? null,
      background_asset_id: form.background_asset?.id ?? null,
      mobile_background_asset_id: form.mobile_background_asset?.id ?? null,
    },
    Boolean(form.title)
  );

  const updateField = <K extends keyof HeroRecord>(key: K, value: HeroRecord[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleAssetChange = (
    key: "logo_asset" | "background_asset" | "mobile_background_asset",
    asset: MediaAsset | null
  ) => {
    setForm((current) => {
      if (key === "logo_asset") {
        return { ...current, logo_asset: asset, logo_asset_id: asset?.id ?? null };
      }

      if (key === "background_asset") {
        return { ...current, background_asset: asset, background_asset_id: asset?.id ?? null };
      }

      return {
        ...current,
        mobile_background_asset: asset,
        mobile_background_asset_id: asset?.id ?? null,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = await saveHero({
        eyebrow: form.eyebrow,
        title: form.title,
        title_line_two: form.title_line_two,
        subtitle: form.subtitle,
        highlight_text: form.highlight_text,
        primary_cta_label: form.primary_cta_label,
        primary_cta_url: form.primary_cta_url,
        secondary_cta_label: form.secondary_cta_label,
        secondary_cta_url: form.secondary_cta_url,
        preview_note: form.preview_note,
        publish_state: form.publish_state,
        visibility_state: form.visibility_state,
        overlay_color: form.overlay_color,
        logo_asset_id: form.logo_asset?.id ?? null,
        background_asset_id: form.background_asset?.id ?? null,
        mobile_background_asset_id: form.mobile_background_asset?.id ?? null,
      });
      setForm(payload);
      setSuccess("Hero section saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save hero section.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id || !window.confirm("Delete the hero section?")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deleteHero();
      setForm(initialHero);
      setSuccess("Hero section deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete hero section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted-text">Loading hero configuration...</p>;
  }

  return (
    <div className="workspace-grid two-columns">
      <Panel title="Hero editor" subtitle="Configure the shared hero source of truth used by both desktop and mobile public experiences.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Eyebrow
            <input value={form.eyebrow} onChange={(event) => updateField("eyebrow", event.target.value)} />
          </label>
          <label>
            Publish state
            <select value={form.publish_state} onChange={(event) => updateField("publish_state", event.target.value as HeroRecord["publish_state"])}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Visibility
            <select value={form.visibility_state} onChange={(event) => updateField("visibility_state", event.target.value as HeroRecord["visibility_state"])}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label>
            Overlay color
            <input value={form.overlay_color} onChange={(event) => updateField("overlay_color", event.target.value)} />
          </label>
          <label className="full-span">
            Title line one
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
          </label>
          <label className="full-span">
            Title line two
            <input value={form.title_line_two} onChange={(event) => updateField("title_line_two", event.target.value)} />
          </label>
          <label className="full-span">
            Subtitle
            <textarea rows={4} value={form.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} />
          </label>
          <label>
            Highlight text
            <input value={form.highlight_text} onChange={(event) => updateField("highlight_text", event.target.value)} />
          </label>
          <label>
            Preview note
            <input value={form.preview_note} onChange={(event) => updateField("preview_note", event.target.value)} />
          </label>
          <label>
            Primary CTA label
            <input value={form.primary_cta_label} onChange={(event) => updateField("primary_cta_label", event.target.value)} />
          </label>
          <label>
            Primary CTA URL
            <input value={form.primary_cta_url} onChange={(event) => updateField("primary_cta_url", event.target.value)} />
          </label>
          <label>
            Secondary CTA label
            <input value={form.secondary_cta_label} onChange={(event) => updateField("secondary_cta_label", event.target.value)} />
          </label>
          <label>
            Secondary CTA URL
            <input value={form.secondary_cta_url} onChange={(event) => updateField("secondary_cta_url", event.target.value)} />
          </label>

          <div className="full-span">
            <AssetPicker
              label="Hero logo"
              selectedAsset={form.logo_asset}
              onSelect={(asset) => handleAssetChange("logo_asset", asset)}
              allowedKinds={["image", "logo"]}
            />
          </div>
          <div className="full-span">
            <AssetPicker
              label="Desktop background"
              selectedAsset={form.background_asset}
              onSelect={(asset) => handleAssetChange("background_asset", asset)}
              allowedKinds={["image"]}
            />
          </div>
          <div className="full-span">
            <AssetPicker
              label="Mobile background"
              selectedAsset={form.mobile_background_asset}
              onSelect={(asset) => handleAssetChange("mobile_background_asset", asset)}
              allowedKinds={["image"]}
            />
          </div>

          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}

          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save hero"}
            </button>
            {form.id ? (
              <button type="button" className="ghost-button danger-text" onClick={handleDelete} disabled={saving}>
                Delete hero
              </button>
            ) : null}
          </div>
        </form>
      </Panel>

      <Panel title="Live preview" subtitle="Rendered from the actual backend response contract, not mock dashboard data.">
        {form.title ? (
          <div className="hero-preview" style={previewStyle}>
            <div className="hero-preview-overlay">
              <div className="inline-actions">
                <StatusBadge state={form.publish_state} />
                {form.highlight_text ? <span className="hero-highlight">{form.highlight_text}</span> : null}
              </div>
              {form.logo_asset?.file_url ? (
                <div className="hero-logo-lockup">
                  <img src={form.logo_asset.file_url} alt={form.logo_asset.title} />
                </div>
              ) : null}
              <p className="hero-eyebrow">{form.eyebrow || "Hero eyebrow"}</p>
              <h3>
                {form.title}
                {form.title_line_two ? <span>{form.title_line_two}</span> : null}
              </h3>
              <p>{form.subtitle || "Hero subtitle will appear here once configured."}</p>
              <div className="inline-actions">
                {form.primary_cta_label ? (
                  <button type="button" className="primary-button">
                    {form.primary_cta_label}
                  </button>
                ) : null}
                {form.secondary_cta_label ? (
                  <button type="button" className="secondary-button">
                    {form.secondary_cta_label}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="Hero not configured" message="Fill in the hero content and save to create the first live hero record." />
        )}
      </Panel>

      <div className="full-span">
        <LivePreviewPanel
          title="Public website preview"
          subtitle="Tokenized preview session for the real public website integration."
          previewUrl={livePreview.previewUrl}
          snapshotUrl={livePreview.snapshotUrl}
          loading={livePreview.loading}
          error={livePreview.error}
        />
      </div>
    </div>
  );
}
