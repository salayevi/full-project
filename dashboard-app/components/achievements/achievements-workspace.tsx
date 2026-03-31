"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import {
  ApiError,
  createAchievement,
  deleteAchievement,
  getAchievements,
  updateAchievement,
} from "@/lib/api";
import type { AchievementRecord, MediaAsset } from "@/lib/types";
import { AssetPicker } from "@/components/shared/asset-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { LivePreviewPanel } from "@/components/shared/live-preview-panel";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLivePreview } from "@/lib/use-live-preview";

const emptyAchievement: AchievementRecord = {
  title: "",
  eyebrow: "",
  description: "",
  publish_state: "draft",
  visibility_state: "visible",
  sort_order: 0,
  media_asset: null,
  frame_color: "#D2A85E",
  ribbon_color: "#D2A85E",
  text_color: "#FFFFFF",
  muted_color: "rgba(255,255,255,0.84)",
};

export function AchievementsWorkspace() {
  const [items, setItems] = useState<AchievementRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementRecord>(emptyAchievement);
  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const livePreview = useLivePreview(
    "achievements",
    {
      id: form.id,
      title: form.title,
      eyebrow: form.eyebrow,
      description: form.description,
      publish_state: form.publish_state,
      visibility_state: form.visibility_state,
      sort_order: form.sort_order,
      media_asset_id: form.media_asset?.id ?? null,
      frame_color: form.frame_color,
      ribbon_color: form.ribbon_color,
      text_color: form.text_color,
      muted_color: form.muted_color,
    },
    Boolean(form.title)
  );

  const loadItems = async () => {
    setLoading(true);
    try {
      const payload = await getAchievements(search, publishFilter);
      setItems(payload);
      if (selectedId) {
        const selected = payload.find((item) => item.id === selectedId);
        if (selected) {
          setForm(selected);
          return;
        }
      }
      setSelectedId(payload[0]?.id ?? null);
      setForm(payload[0] ?? emptyAchievement);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load achievements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [publishFilter]);

  const selectItem = (item: AchievementRecord) => {
    setSelectedId(item.id ?? null);
    setForm(item);
    setError("");
    setSuccess("");
  };

  const updateField = <K extends keyof AchievementRecord>(key: K, value: AchievementRecord[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleAssetChange = (asset: MediaAsset | null) => {
    setForm((current) => ({
      ...current,
      media_asset: asset,
      media_asset_id: asset?.id ?? null,
    }));
  };

  const handleCreate = () => {
    setSelectedId(null);
    setForm(emptyAchievement);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        title: form.title,
        eyebrow: form.eyebrow,
        description: form.description,
        publish_state: form.publish_state,
        visibility_state: form.visibility_state,
        sort_order: form.sort_order,
        media_asset_id: form.media_asset?.id ?? null,
        frame_color: form.frame_color,
        ribbon_color: form.ribbon_color,
        text_color: form.text_color,
        muted_color: form.muted_color,
      };
      const saved = selectedId ? await updateAchievement(selectedId, payload) : await createAchievement(payload);
      await loadItems();
      setSelectedId(saved.id ?? null);
      setForm(saved);
      setSuccess("Achievement saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save achievement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    if (!window.confirm("Delete this achievement?")) {
      return;
    }

    try {
      await deleteAchievement(selectedId);
      await loadItems();
      setSuccess("Achievement deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete achievement.");
    }
  };

  return (
    <div className="workspace-grid product-layout">
      <Panel
        title="Achievements"
        subtitle="Manage public-facing achievement cards with real publish, visibility, media, and display theme controls."
        actions={
          <button type="button" className="primary-button" onClick={handleCreate}>
            <Plus size={16} />
            New achievement
          </button>
        }
      >
        <div className="toolbar">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search achievements..." />
          <select value={publishFilter} onChange={(event) => setPublishFilter(event.target.value)}>
            <option value="">All states</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button type="button" className="secondary-button" onClick={() => void loadItems()}>
            Apply
          </button>
        </div>

        {loading ? <p className="muted-text">Loading achievements...</p> : null}
        {!loading && items.length === 0 ? <EmptyState title="No achievements yet" message="Create the first achievement card to power the public section." /> : null}
        <div className="product-list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`product-list-item ${selectedId === item.id ? "is-selected" : ""}`}
              onClick={() => selectItem(item)}
            >
              <div className="product-list-copy">
                <strong>{item.title}</strong>
                <span>{item.eyebrow || "Achievement item"}</span>
              </div>
              <div className="inline-actions">
                <StatusBadge state={item.publish_state} />
                <span className="mini-pill">{item.visibility_state}</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Achievement editor" subtitle="Single-source-of-truth fields for both public desktop and mobile achievement rendering.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="full-span">
            Title
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
          </label>
          <label>
            Eyebrow
            <input value={form.eyebrow} onChange={(event) => updateField("eyebrow", event.target.value)} />
          </label>
          <label>
            Sort order
            <input type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", Number(event.target.value))} />
          </label>
          <label>
            Publish state
            <select value={form.publish_state} onChange={(event) => updateField("publish_state", event.target.value as AchievementRecord["publish_state"])}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Visibility
            <select value={form.visibility_state} onChange={(event) => updateField("visibility_state", event.target.value as AchievementRecord["visibility_state"])}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label className="full-span">
            Description
            <textarea rows={5} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          </label>

          <div className="full-span">
            <AssetPicker label="Achievement media" selectedAsset={form.media_asset} onSelect={handleAssetChange} allowedKinds={["image"]} />
          </div>

          <label>
            Frame color
            <input value={form.frame_color} onChange={(event) => updateField("frame_color", event.target.value)} />
          </label>
          <label>
            Ribbon color
            <input value={form.ribbon_color} onChange={(event) => updateField("ribbon_color", event.target.value)} />
          </label>
          <label>
            Text color
            <input value={form.text_color} onChange={(event) => updateField("text_color", event.target.value)} />
          </label>
          <label>
            Muted color
            <input value={form.muted_color} onChange={(event) => updateField("muted_color", event.target.value)} />
          </label>

          <div className="achievement-preview full-span" style={{ "--frame": form.frame_color, "--text": form.text_color } as CSSProperties}>
            <div className="achievement-preview-card">
              <span className="mini-pill" style={{ background: form.ribbon_color, color: form.text_color }}>
                {form.eyebrow || "Achievement"}
              </span>
              <h3>{form.title || "Achievement preview"}</h3>
              <p>{form.description || "Achievement copy preview appears here."}</p>
            </div>
          </div>

          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}

          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : selectedId ? "Save changes" : "Create achievement"}
            </button>
            {selectedId ? (
              <button type="button" className="danger-button" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete
              </button>
            ) : null}
          </div>
        </form>
      </Panel>

      <div className="full-span">
        <LivePreviewPanel
          title="Public website preview"
          subtitle="Preview the current achievement draft inside the public snapshot before saving."
          previewUrl={livePreview.previewUrl}
          snapshotUrl={livePreview.snapshotUrl}
          loading={livePreview.loading}
          error={livePreview.error}
        />
      </div>
    </div>
  );
}
