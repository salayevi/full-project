"use client";

import { useEffect, useState } from "react";

type UseStartupLoadingOptions = {
  rootSelector?: string;
  minDurationMs?: number;
  maxDurationMs?: number;
};

function isInInitialViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 1.15 && rect.bottom > -vh * 0.15;
}

export default function useStartupLoading(
  options: UseStartupLoadingOptions = {},
) {
  const {
    rootSelector = "#mobile-page-root",
    minDurationMs = 600,
    maxDurationMs = 2200,
  } = options;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let maxTimer: number | null = null;

    const safeFinish = () => {
      if (cancelled) return;
      setIsReady(true);
    };

    const waitForInitialPaint = async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
    };

    const waitForVisibleImages = async (root: Element) => {
      const images = Array.from(root.querySelectorAll("img")).filter((img) =>
        isInInitialViewport(img),
      );

      await Promise.all(
        images.map((img) => {
          if ((img as HTMLImageElement).complete) return Promise.resolve();

          return new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          });
        }),
      );
    };

    const waitForVisibleVideos = async (root: Element) => {
      const videos = Array.from(root.querySelectorAll("video")).filter((video) =>
        isInInitialViewport(video),
      );

      await Promise.all(
        videos.map((video) => {
          const v = video as HTMLVideoElement;
          if (v.readyState >= 2) return Promise.resolve();

          return new Promise<void>((resolve) => {
            const done = () => resolve();
            v.addEventListener("loadeddata", done, { once: true });
            v.addEventListener("error", done, { once: true });
          });
        }),
      );
    };

    const start = async () => {
      const startedAt = performance.now();

      if (document.readyState === "loading") {
        await new Promise<void>((resolve) => {
          window.addEventListener("DOMContentLoaded", () => resolve(), {
            once: true,
          });
        });
      }

      await waitForInitialPaint();

      const root = document.querySelector(rootSelector);
      if (root) {
        await Promise.all([
          waitForVisibleImages(root),
          waitForVisibleVideos(root),
        ]);
      }

      const elapsed = performance.now() - startedAt;
      const remain = Math.max(minDurationMs - elapsed, 0);

      if (remain > 0) {
        await new Promise((resolve) => setTimeout(resolve, remain));
      }

      safeFinish();
    };

    maxTimer = window.setTimeout(() => {
      safeFinish();
    }, maxDurationMs);

    start();

    return () => {
      cancelled = true;
      if (maxTimer) {
        window.clearTimeout(maxTimer);
      }
    };
  }, [rootSelector, minDurationMs, maxDurationMs]);

  return {
    isLoading: !isReady,
    isReady,
  };
}