"use client";

import { useEffect, useMemo, useState } from "react";
import { mobileMotion } from "@/config/mobile-system/mobile-motion";

type UseMobileProductsScrollOptions = {
  sectionId: string;
  totalItems: number;
};

type MobileProductsScrollState = {
  sectionProgress: number;
  titleHoldProgress: number;
  titleFadeProgress: number;
  cardsRevealProgress: number;
  cardsProgress: number;
  floatingIndex: number;
  activeIndex: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function rangeProgress(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start), 0, 1);
}

export default function useMobileProductsScroll({
  sectionId,
  totalItems,
}: UseMobileProductsScrollOptions): MobileProductsScrollState {
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
      const passed = clamp(-rect.top, 0, totalScrollable);
      setSectionProgress(passed / totalScrollable);
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
    const titleHoldProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.titleOnlyStart,
      mobileMotion.product.titleOnlyEnd,
    );

    const titleFadeProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.titleFadeStart,
      mobileMotion.product.titleFadeEnd,
    );

    const cardsRevealProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.cardsRevealStart,
      mobileMotion.product.cardsRevealEnd,
    );

    const cardsProgress = rangeProgress(
      sectionProgress,
      mobileMotion.product.cardsStart,
      mobileMotion.product.cardsEnd,
    );

    const maxIndex = Math.max(totalItems - 1, 0);
    const floatingIndex = cardsProgress * maxIndex;
    const activeIndex = clamp(Math.round(floatingIndex), 0, maxIndex);

    return {
      sectionProgress,
      titleHoldProgress,
      titleFadeProgress,
      cardsRevealProgress,
      cardsProgress,
      floatingIndex,
      activeIndex,
    };
  }, [sectionProgress, totalItems]);
}