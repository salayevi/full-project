"use client";

import MobileHero from "./mobile-hero";

type MobileHomeSectionProps = {
  startupReady?: boolean;
};

export default function MobileHomeSection({
  startupReady = false,
}: MobileHomeSectionProps) {
  return <MobileHero startupReady={startupReady} />;
}