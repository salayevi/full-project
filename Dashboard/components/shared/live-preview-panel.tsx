"use client";

import { ExternalLink } from "lucide-react";

import { Panel } from "@/components/shared/panel";

type LivePreviewPanelProps = {
  title: string;
  subtitle: string;
  previewUrl: string;
  snapshotUrl: string;
  loading: boolean;
  error: string;
};

export function LivePreviewPanel({
  title,
  subtitle,
  previewUrl,
  snapshotUrl,
  loading,
  error,
}: LivePreviewPanelProps) {
  return (
    <Panel
      title={title}
      subtitle={subtitle}
      actions={
        previewUrl ? (
          <a className="secondary-button" href={previewUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Open preview
          </a>
        ) : null
      }
    >
      {loading ? <p className="muted-text">Refreshing preview…</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {previewUrl ? (
        <div className="live-preview-shell">
          <iframe title="Public site preview" src={previewUrl} className="preview-frame" />
          <div className="preview-meta">
            <strong>Preview contract</strong>
            <p>This preview URL is safe and tokenized. The public website must consume the preview token to render unsaved changes.</p>
            <a href={snapshotUrl} target="_blank" rel="noreferrer">
              Inspect preview snapshot JSON
            </a>
          </div>
        </div>
      ) : (
        <p className="muted-text">Preview will activate once the current module has enough data and the backend can compose a preview snapshot.</p>
      )}
    </Panel>
  );
}
