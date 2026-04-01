"use client";

import { PencilLine, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { deleteMedia, getMedia, updateMedia, uploadMedia } from "@/lib/api";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editForm, setEditForm] = useState({
    title: "",
    kind: "image",
    alt_text: "",
    caption: "",
    width: "",
    height: "",
    publish_state: "draft",
    is_public: true,
    sort_order: "0",
  });

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

  const startEditing = (asset: MediaAsset) => {
    setEditingId(asset.id);
    setEditForm({
      title: asset.title,
      kind: asset.kind,
      alt_text: asset.alt_text ?? "",
      caption: asset.caption ?? "",
      width: asset.width ? String(asset.width) : "",
      height: asset.height ? String(asset.height) : "",
      publish_state: asset.publish_state ?? "draft",
      is_public: asset.is_public ?? true,
      sort_order: String(asset.sort_order ?? 0),
    });
    setError("");
    setSuccess("");
  };

  const clearEditing = () => {
    setEditingId(null);
    setEditing(false);
    setEditForm({
      title: "",
      kind: "image",
      alt_text: "",
      caption: "",
      width: "",
      height: "",
      publish_state: "draft",
      is_public: true,
      sort_order: "0",
    });
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingId) {
      setError("Choose a media asset to edit.");
      return;
    }

    setEditing(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateMedia(editingId, {
        title: editForm.title,
        kind: editForm.kind,
        alt_text: editForm.alt_text,
        caption: editForm.caption,
        width: editForm.width ? Number(editForm.width) : null,
        height: editForm.height ? Number(editForm.height) : null,
        publish_state: editForm.publish_state as MediaAsset["publish_state"],
        is_public: editForm.is_public,
        sort_order: Number(editForm.sort_order || 0),
      });
      await loadAssets();
      setSuccess("Media metadata updated successfully.");
      startEditing(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update media.");
    } finally {
      setEditing(false);
    }
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

        <div className="nested-section" style={{ marginTop: "24px" }}>
          <div className="section-header-row">
            <div>
              <h3>Edit metadata</h3>
              <p>Update real asset metadata without re-uploading the file.</p>
            </div>
            {editingId ? (
              <button type="button" className="secondary-button" onClick={clearEditing}>
                Clear selection
              </button>
            ) : null}
          </div>

          {editingId ? (
            <form className="form-grid" onSubmit={handleUpdate}>
              <label>
                Title
                <input value={editForm.title} onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label>
                Kind
                <select value={editForm.kind} onChange={(event) => setEditForm((current) => ({ ...current, kind: event.target.value }))}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="icon">Icon</option>
                  <option value="logo">Logo</option>
                  <option value="favicon">Favicon</option>
                </select>
              </label>
              <label>
                Publish state
                <select
                  value={editForm.publish_state}
                  onChange={(event) => setEditForm((current) => ({ ...current, publish_state: event.target.value }))}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label>
                Sort order
                <input value={editForm.sort_order} onChange={(event) => setEditForm((current) => ({ ...current, sort_order: event.target.value }))} />
              </label>
              <label>
                Width
                <input value={editForm.width} onChange={(event) => setEditForm((current) => ({ ...current, width: event.target.value }))} />
              </label>
              <label>
                Height
                <input value={editForm.height} onChange={(event) => setEditForm((current) => ({ ...current, height: event.target.value }))} />
              </label>
              <label className="toggle-field">
                <input
                  checked={editForm.is_public}
                  type="checkbox"
                  onChange={(event) => setEditForm((current) => ({ ...current, is_public: event.target.checked }))}
                />
                Public asset
              </label>
              <label className="full-span">
                Alt text
                <input value={editForm.alt_text} onChange={(event) => setEditForm((current) => ({ ...current, alt_text: event.target.value }))} />
              </label>
              <label className="full-span">
                Caption
                <textarea rows={3} value={editForm.caption} onChange={(event) => setEditForm((current) => ({ ...current, caption: event.target.value }))} />
              </label>
              <div className="full-span form-actions">
                <button type="submit" className="primary-button" disabled={editing}>
                  {editing ? "Saving..." : "Save metadata"}
                </button>
              </div>
            </form>
          ) : (
            <p className="muted-text">Choose any media asset from the library to edit its metadata.</p>
          )}
        </div>
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
            <article key={asset.id} className={`media-card ${editingId === asset.id ? "is-selected" : ""}`}>
              <div className="media-card-frame">
                {asset.file_url && ["image", "logo", "favicon"].includes(asset.kind) ? <img src={asset.file_url} alt={asset.title} /> : <span>{asset.kind}</span>}
              </div>
              <div className="media-card-copy">
                <strong>{asset.title}</strong>
                <div className="inline-actions">
                  <StatusBadge state={(asset.publish_state || "draft") as never} />
                  <button type="button" className="ghost-button" onClick={() => startEditing(asset)}>
                    <PencilLine size={14} />
                  </button>
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
