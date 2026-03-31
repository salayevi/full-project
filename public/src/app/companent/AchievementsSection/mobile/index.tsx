"use client";

import { mobileSections } from "@/config/mobile-system/mobile-sections";
import { colors } from "@/config/design-system";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders";
import { selectAchievementsViewModel } from "@/lib/backend/selectors";
import MobileAchievementsShell from "./mobile-achievements-shell";
import useMobileAchievementsScroll from "./useMobileAchievementsScroll";

export default function MobileAchievementsSection() {
  const snapshot = usePublicSiteContent();
  const mobileAchievements = selectAchievementsViewModel(snapshot).map(
    (item, index) => ({
      id: index + 1,
      name: item.item.title,
      role: item.item.eyebrow ?? `0${index + 1}`,
      description: item.item.description,
      image:
        item.image?.url ??
        createContentPlaceholderDataUri({
          title: item.item.title,
          subtitle: item.item.eyebrow ?? `0${index + 1}`,
          background: item.theme.frame,
          foreground: item.theme.text,
          accent: item.theme.ribbon,
        }),
      theme: item.theme,
    }),
  );

  if (mobileAchievements.length === 0) {
    return null;
  }

  const scroll = useMobileAchievementsScroll({
    sectionId: "achievements",
    totalItems: mobileAchievements.length,
  });

  const titleIntroProgress = Math.min(scroll.sectionProgress / 0.12, 1);
  const titleOpacity = titleIntroProgress * (1 - scroll.titleFadeProgress);
  const titleY = (1 - titleIntroProgress) * 40 + scroll.titleFadeProgress * -26;
  const titleScale =
    0.92 + titleIntroProgress * 0.08 - scroll.titleFadeProgress * 0.04;

  const showCard = scroll.sectionProgress >= 0.22;

  return (
    <section
      id="achievements"
      className="relative w-full overflow-clip"
      style={{
        backgroundColor: colors.background.soft,
        minHeight: "320svh",
      }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-6 text-center"
          style={{ opacity: titleOpacity }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: mobileSections.achievements.frameMaxWidth,
              transform: `translateY(${titleY}px) scale(${titleScale})`,
              transformOrigin: "center center",
            }}
          >
            <h2
              className="text-[clamp(34px,10vw,50px)] font-bold leading-none tracking-[-0.05em]"
              style={{ color: colors.brand.primaryStrong }}
            >
              Kompanya Yutuqlari
            </h2>
          </div>
        </div>

        {showCard ? (
          <MobileAchievementsShell
            items={mobileAchievements}
            currentIndex={scroll.currentIndex}
            nextIndex={scroll.nextIndex}
            blend={scroll.blend}
            frameRevealProgress={scroll.frameRevealProgress}
            ribbonRevealProgress={scroll.ribbonRevealProgress}
          />
        ) : null}
      </div>
    </section>
  );
}
