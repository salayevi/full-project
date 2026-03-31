"use client";

import { useEffect, useMemo, useState } from "react";

type UseMobileAchievementsScrollOptions = {
  sectionId: string;
  totalItems: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const rangeProgress = (value: number, start: number, end: number) => {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start), 0, 1);
};

export default function useMobileAchievementsScroll({
  sectionId,
  totalItems,
}: UseMobileAchievementsScrollOptions) {
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
      const passed = clamp(-rect.top, 0, totalScrollable);
      const progress = passed / totalScrollable;
      setSectionProgress(progress);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionId]);

  return useMemo(() => {
    const titleFadeProgress = rangeProgress(sectionProgress, 0.08, 0.24);

    // Card yig‘ilish bosqichi
    const frameRevealProgress = rangeProgress(sectionProgress, 0.24, 0.42);

    // Bayroqcha frame ichidan chiqish bosqichi
    const ribbonRevealProgress = rangeProgress(sectionProgress, 0.38, 0.58);

    // Faqat shundan keyin content almashishni boshlaymiz
    const contentStart = 0.58;
    const contentEnd = 0.96;
    const contentProgress = rangeProgress(sectionProgress, contentStart, contentEnd);

    const maxIndex = Math.max(totalItems - 1, 0);
    const floatingIndex = contentProgress * maxIndex;

    const currentIndex = clamp(Math.floor(floatingIndex), 0, maxIndex);
    const nextIndex = clamp(currentIndex + 1, 0, maxIndex);

    const blend = clamp(floatingIndex - currentIndex, 0, 1);

    return {
      sectionProgress,
      titleFadeProgress,
      frameRevealProgress,
      ribbonRevealProgress,
      contentProgress,
      floatingIndex,
      currentIndex,
      nextIndex,
      blend,
    };
  }, [sectionProgress, totalItems]);
}