"use client";

import { Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { deleteMedia, getMedia, uploadMedia } from "@/lib/api";
import type { MediaAsset } from "@/lib/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";

const initialForm = {
  title: "",
  kind: "image",
  alt_text: "",
  caption: "",
  width: "",
  height: "",
  publish_state: "draft",
  file: null as File | null,
};

export function MediaLibraryManager() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const payload = await getMedia(search, kind);
      setAssets(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssets();
  }, [kind]);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.file) {
      setError("Choose a file before uploading.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("title", form.title || form.file.name);
      payload.append("kind", form.kind);
      payload.append("alt_text", form.alt_text);
      payload.append("caption", form.caption);
      payload.append("publish_state", form.publish_state);
      if (form.width) payload.append("width", form.width);
      if (form.height) payload.append("height", form.height);
      payload.append("file", form.file);
      await uploadMedia(payload);
      setForm(initialForm);
      await loadAssets();
      setSuccess("Media uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload media.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    const confirmed = window.confirm(`Delete ${asset.title}?`);
    if (!confirmed) {
      return;
    }
    await deleteMedia(asset.id);
    await loadAssets();
    setSuccess("Media asset deleted.");
  };

  return (
    <div className="workspace-grid two-columns">
      <Panel title="Upload media" subtitle="Upload reusable assets for hero, products, footer, brand identity, and future public website rendering.">
        <form className="form-grid" onSubmit={handleUpload}>
          <label>
            Title
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label>
            Kind
            <select value={form.kind} onChange={(event) => setForm((current) => ({ ...current, kind: event.target.value }))}>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="icon">Icon</option>
              <option value="logo">Logo</option>
              <option value="favicon">Favicon</option>
            </select>
          </label>
          <label className="full-span">
            File
            <input type="file" onChange={(event) => setForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} required />
          </label>
          <label>
            Alt text
            <input value={form.alt_text} onChange={(event) => setForm((current) => ({ ...current, alt_text: event.target.value }))} />
          </label>
          <label>
            Publish state
            <select value={form.publish_state} onChange={(event) => setForm((current) => ({ ...current, publish_state: event.target.value }))}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Width
            <input value={form.width} onChange={(event) => setForm((current) => ({ ...current, width: event.target.value }))} />
          </label>
          <label>
            Height
            <input value={form.height} onChange={(event) => setForm((current) => ({ ...current, height: event.target.value }))} />
          </label>
          <label className="full-span">
            Caption
            <textarea rows={3} value={form.caption} onChange={(event) => setForm((current) => ({ ...current, caption: event.target.value }))} />
          </label>
          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}
          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={uploading}>
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload asset"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Media library" subtitle="Filter, preview, and remove real uploaded media assets used across the public website and dashboard workflows.">
        <div className="toolbar">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search media..." />
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="">All kinds</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="icon">Icon</option>
            <option value="logo">Logo</option>
            <option value="favicon">Favicon</option>
          </select>
          <button type="button" className="secondary-button" onClick={() => void loadAssets()}>
            Apply
          </button>
        </div>
        {loading ? <p className="muted-text">Loading media assets...</p> : null}
        {!loading && assets.length === 0 ? <EmptyState title="No media assets yet" message="Upload the first asset to start wiring sections, products, and site identity." /> : null}
        <div className="media-grid">
          {assets.map((asset) => (
            <article key={asset.id} className="media-card">
              <div className="media-card-frame">
                {asset.file_url && ["image", "logo", "favicon"].includes(asset.kind) ? <img src={asset.file_url} alt={asset.title} /> : <span>{asset.kind}</span>}
              </div>
              <div className="media-card-copy">
                <strong>{asset.title}</strong>
                <div className="inline-actions">
                  <StatusBadge state={(asset.publish_state || "draft") as never} />
                  <button type="button" className="ghost-button danger-text" onClick={() => void handleDelete(asset)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <p>{asset.mime_type || asset.kind}</p>
                {asset.width || asset.height ? <small>{asset.width || "?"}x{asset.height || "?"}</small> : null}
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
