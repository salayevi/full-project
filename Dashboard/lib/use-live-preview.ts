"use client";

import { useEffect, useState } from "react";

import { createSitePreview } from "@/lib/api";

type LivePreviewState = {
  previewUrl: string;
  snapshotUrl: string;
  token: string;
  loading: boolean;
  error: string;
};

export function useLivePreview(module: string, payload: Record<string, unknown>, enabled = true) {
  const [state, setState] = useState<LivePreviewState>({
    previewUrl: "",
    snapshotUrl: "",
    token: "",
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setState((current) => ({ ...current, loading: true, error: "" }));
      createSitePreview(module, payload)
        .then((response) => {
          setState({
            previewUrl: response.preview_url,
            snapshotUrl: response.snapshot_url,
            token: response.token,
            loading: false,
            error: "",
          });
        })
        .catch((error: Error) => {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.message || "Preview is unavailable.",
          }));
        });
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, module, JSON.stringify(payload)]);

  return state;
}
