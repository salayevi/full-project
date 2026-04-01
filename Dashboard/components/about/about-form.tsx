"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError, getAbout, saveAbout } from "@/lib/api";
import type { AboutRecord, AboutTextItem, MediaAsset } from "@/lib/types";
import { AssetPicker } from "@/components/shared/asset-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { LivePreviewPanel } from "@/components/shared/live-preview-panel";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLivePreview } from "@/lib/use-live-preview";

const createTextItem = (sortOrder: number): AboutTextItem => ({
  text: "",
  sort_order: sortOrder,
  publish_state: "draft",
  visibility_state: "visible",
});

const initialAbout: AboutRecord = {
  section_label: "",
  brand_title: "",
  description: "",
  preview_note: "",
  publish_state: "draft",
  visibility_state: "visible",
  image_asset: null,
  text_items: [createTextItem(0)],
};

export function AboutForm() {
  const [form, setForm] = useState<AboutRecord>(initialAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getAbout()
      .then((payload) => setForm({ ...payload, text_items: payload.text_items.length ? payload.text_items : [createTextItem(0)] }))
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 404) {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  const livePreview = useLivePreview(
    "about",
    {
      section_label: form.section_label,
      brand_title: form.brand_title,
      description: form.description,
      publish_state: form.publish_state,
      visibility_state: form.visibility_state,
      image_asset_id: form.image_asset?.id ?? null,
      text_items_payload: form.text_items,
    },
    Boolean(form.brand_title)
  );

  const updateField = <K extends keyof AboutRecord>(key: K, value: AboutRecord[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateTextItem = <K extends keyof AboutTextItem>(index: number, key: K, value: AboutTextItem[K]) => {
    setForm((current) => ({
      ...current,
      text_items: current.text_items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addTextItem = () => {
    setForm((current) => ({
      ...current,
      text_items: [...current.text_items, createTextItem(current.text_items.length)],
    }));
  };

  const removeTextItem = (index: number) => {
    setForm((current) => ({
      ...current,
      text_items: current.text_items.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, sort_order: itemIndex })),
    }));
  };

  const handleAssetChange = (asset: MediaAsset | null) => {
    setForm((current) => ({
      ...current,
      image_asset: asset,
      image_asset_id: asset?.id ?? null,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = await saveAbout({
        section_label: form.section_label,
        brand_title: form.brand_title,
        description: form.description,
        preview_note: form.preview_note,
        publish_state: form.publish_state,
        visibility_state: form.visibility_state,
        image_asset_id: form.image_asset?.id ?? null,
        text_items_payload: form.text_items.map((item, index) => ({
          ...item,
          sort_order: index,
        })),
      });
      setForm(payload);
      setSuccess("About section saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save about section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted-text">Loading about section...</p>;
  }

  return (
    <div className="workspace-grid two-columns">
      <Panel title="About editor" subtitle="Manage the shared about section and its ordered story lines from one backend source.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Section label
            <input value={form.section_label} onChange={(event) => updateField("section_label", event.target.value)} required />
          </label>
          <label>
            Publish state
            <select value={form.publish_state} onChange={(event) => updateField("publish_state", event.target.value as AboutRecord["publish_state"])}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Brand title
            <input value={form.brand_title} onChange={(event) => updateField("brand_title", event.target.value)} required />
          </label>
          <label>
            Visibility
            <select value={form.visibility_state} onChange={(event) => updateField("visibility_state", event.target.value as AboutRecord["visibility_state"])}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label className="full-span">
            Description
            <textarea rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          </label>
          <label className="full-span">
            Preview note
            <input value={form.preview_note} onChange={(event) => updateField("preview_note", event.target.value)} />
          </label>

          <div className="full-span">
            <AssetPicker
              label="About image"
              selectedAsset={form.image_asset}
              onSelect={handleAssetChange}
              allowedKinds={["image"]}
            />
          </div>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Story lines</h3>
                <p>These entries are ordered and can be published or hidden independently.</p>
              </div>
              <button type="button" className="secondary-button" onClick={addTextItem}>
                <Plus size={16} />
                Add line
              </button>
            </div>

            <div className="stack-list">
              {form.text_items.map((item, index) => (
                <div key={item.id ?? `about-line-${index}`} className="stack-card">
                  <div className="stack-card-toolbar">
                    <strong>Line {index + 1}</strong>
                    <button type="button" className="ghost-button danger-text" onClick={() => removeTextItem(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="subgrid two-up">
                    <label>
                      Publish state
                      <select
                        value={item.publish_state}
                        onChange={(event) => updateTextItem(index, "publish_state", event.target.value as AboutTextItem["publish_state"])}
                      >
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                    <label>
                      Visibility
                      <select
                        value={item.visibility_state}
                        onChange={(event) => updateTextItem(index, "visibility_state", event.target.value as AboutTextItem["visibility_state"])}
                      >
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Text
                    <textarea rows={3} value={item.text} onChange={(event) => updateTextItem(index, "text", event.target.value)} required />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}

          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save about section"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Preview" subtitle="A real dashboard-side preview of the shared about content contract.">
        {form.brand_title ? (
          <div className="story-preview">
            <div className="inline-actions">
              <StatusBadge state={form.publish_state} />
              <span className="mini-pill">{form.visibility_state}</span>
            </div>
            <p className="hero-eyebrow">{form.section_label}</p>
            <h3>{form.brand_title}</h3>
            <p>{form.description || "About description preview appears here."}</p>
            {form.image_asset?.file_url ? (
              <div className="selected-asset-preview wide">
                <img src={form.image_asset.file_url} alt={form.image_asset.title} />
              </div>
            ) : null}
            <div className="story-list">
              {form.text_items.map((item, index) => (
                <article key={item.id ?? `story-item-${index}`} className="story-line">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item.text || "Story copy preview."}</p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="About section not configured" message="Save the section and its story lines to activate the real public content source." />
        )}
      </Panel>

      <div className="full-span">
        <LivePreviewPanel
          title="Public website preview"
          subtitle="Preview session for the current About draft before saving."
          previewUrl={livePreview.previewUrl}
          snapshotUrl={livePreview.snapshotUrl}
          loading={livePreview.loading}
          error={livePreview.error}
        />
      </div>
    </div>
  );
}
