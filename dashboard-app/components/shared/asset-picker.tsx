"use client";

import { Image, Library, Video } from "lucide-react";
import { useEffect, useState } from "react";

import { getMedia } from "@/lib/api";
import type { MediaAsset } from "@/lib/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";

const iconMap = {
  image: Image,
  video: Video,
  document: Library,
  icon: Image,
  logo: Image,
  favicon: Image,
};

type AssetPickerProps = {
  label: string;
  selectedAsset: MediaAsset | null;
  onSelect: (asset: MediaAsset | null) => void;
  allowedKinds?: string[];
};

export function AssetPicker({ label, selectedAsset, onSelect, allowedKinds }: AssetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLoading(true);
    getMedia()
      .then(setAssets)
      .finally(() => setLoading(false));
  }, [isOpen]);

  const visibleAssets = allowedKinds?.length ? assets.filter((asset) => allowedKinds.includes(asset.kind)) : assets;

  return (
    <div className="asset-picker">
      <div className="asset-picker-summary">
        <div>
          <label>{label}</label>
          <p>{selectedAsset ? selectedAsset.title : "No asset selected yet."}</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="secondary-button" onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? "Close library" : "Select asset"}
          </button>
          {selectedAsset ? (
            <button type="button" className="ghost-button" onClick={() => onSelect(null)}>
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {selectedAsset?.file_url ? (
        <div className="selected-asset-preview">
          <img src={selectedAsset.file_url} alt={selectedAsset.title} />
        </div>
      ) : null}

      {isOpen ? (
        <Panel title="Media library" subtitle="Select an uploaded asset from the live backend library.">
          {loading ? <p className="muted-text">Loading assets...</p> : null}
          {!loading && visibleAssets.length === 0 ? (
            <EmptyState title="No assets yet" message="Upload media from the Media module, then return here." />
          ) : null}
          <div className="asset-grid">
            {visibleAssets.map((asset) => {
              const Icon = iconMap[asset.kind as keyof typeof iconMap] || Library;
              return (
                <button
                  key={asset.id}
                  type="button"
                  className={`asset-tile ${selectedAsset?.id === asset.id ? "is-selected" : ""}`}
                  onClick={() => {
                    onSelect(asset);
                    setIsOpen(false);
                  }}
                >
                  <div className="asset-frame">
                    {asset.file_url && asset.kind === "image" ? (
                      <img src={asset.file_url} alt={asset.title} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                  <strong>{asset.title}</strong>
                  <span>{asset.kind}</span>
                </button>
              );
            })}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
