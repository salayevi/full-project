"use client";

import { useRef } from "react";
import { mobileHero } from "@/config/mobile-system/mobile-hero";
import { mobileLayout } from "@/config/mobile-system/mobile-layout";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileTypography } from "@/config/mobile-system/mobile-typography";
import MobileTopbar from "./mobile-topbar";
import useMobileHeroMotion from "../../shared/hooks/use-mobile-hero-motion";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { selectHeroViewModel } from "@/lib/backend/selectors";

type MobileHeroProps = {
  startupReady?: boolean;
};

export default function MobileHero({ startupReady = false }: MobileHeroProps) {
  const snapshot = usePublicSiteContent();
  const hero = selectHeroViewModel(snapshot);
  const [firstTitleLine = "Azizam", secondTitleLine = "Market"] = hero.titleLines;
  const activeBackgroundMedia = hero.mobileBackgroundMedia ?? hero.backgroundMedia;
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const bgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const topbarRef = useRef<HTMLDivElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const azizamRef = useRef<HTMLHeadingElement | null>(null);
  const marketRef = useRef<HTMLHeadingElement | null>(null);
  const bottomNavRef = useRef<HTMLDivElement | null>(null);

  useMobileHeroMotion({
    sectionRef,
    stageRef,
    bgRef,
    overlayRef,
    titleWrapRef,
    azizamRef,
    marketRef,
    startupReady,
  });

  return (
    <section
      id="home-mobile"
      ref={sectionRef}
      className="relative w-full"
      style={{
        minHeight: `calc(${mobileLayout.heroMinHeight} + ${mobileLayout.heroScrollRunway})`,
        backgroundColor: "#000",
      }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden"
        style={{
          height: mobileLayout.heroViewportHeight,
          minHeight: mobileLayout.heroMinHeight,
          backgroundColor: "#000",
        }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 overflow-hidden"
          style={
            activeBackgroundMedia?.kind === "image"
              ? {
                  backgroundImage: `url('${activeBackgroundMedia.url}')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  transformOrigin: "center center",
                  willChange: "transform",
                }
              : {
                  transformOrigin: "center center",
                  willChange: "transform",
                }
          }
        >
          {activeBackgroundMedia?.kind === "video" ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={activeBackgroundMedia.url} />
            </video>
          ) : null}
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            backgroundColor: hero.overlayColor,
            opacity: 1,
          }}
        />

        <MobileTopbar topbarRef={topbarRef} />

        <div
          className="relative z-20 mx-auto h-full w-full"
          style={{
            maxWidth: mobileLayout.heroContentMaxWidth,
            paddingInline: mobileSpacing.pageX,
            paddingBottom: mobileSpacing.heroBottomSafeSpace,
          }}
        >
          <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
            <div
              ref={titleWrapRef}
              className="mx-auto w-full"
              style={{
                width: mobileLayout.heroTitleMaxWidth,
                maxWidth: mobileLayout.heroTitleMaxWidth,
                transform: `translateY(${mobileSpacing.heroTitleOffsetY})`,
                willChange: "transform, opacity",
              }}
            >
              <h1
                ref={azizamRef}
                className="text-left"
                style={{
                  color: mobileHero.titleColor,
                  fontSize: mobileTypography.hero.title,
                  lineHeight: mobileTypography.hero.lineHeight,
                  letterSpacing: mobileTypography.hero.letterSpacing,
                  fontWeight: mobileTypography.hero.weight,
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                {firstTitleLine}
              </h1>

              <h1
                ref={marketRef}
                className="text-right"
                style={{
                  color: mobileHero.titleColor,
                  fontSize: mobileTypography.hero.title,
                  lineHeight: mobileTypography.hero.lineHeight,
                  letterSpacing: mobileTypography.hero.letterSpacing,
                  fontWeight: mobileTypography.hero.weight,
                  whiteSpace: "nowrap",
                  margin: 0,
                  marginTop: "6px",
                }}
              >
                {secondTitleLine}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
