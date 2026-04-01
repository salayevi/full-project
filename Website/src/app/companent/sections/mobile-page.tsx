"use client";

import MobileAboutSection from "../about/mobile";
import MobileAchievementsSection from "../AchievementsSection/mobile";
import MobileHomeSection from "../home/mobile";
import MobileFooter from "../home/mobile/mobile-footer";
import MobileBottomNav from "../home/mobile/mobile-bottom-nav";
import MobileProductSection from "../product/mobile";
import MobileTopbar from "../home/mobile/mobile-topbar";
import MobileStartupLoader from "../shared/loading/mobile-startup-loader";
import useStartupLoading from "../shared/hooks/use-startup-loading";

export default function MobilePage() {
  const { isLoading, isReady } = useStartupLoading({
    rootSelector: "#mobile-page-root",
    minDurationMs: 650,
    maxDurationMs: 1800,
  });

  return (
    <>
      <MobileStartupLoader visible={isLoading} />
      <main
        id="mobile-page-root"
        className="relative min-h-screen w-full bg-white"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 400ms ease",
        }}
      >
        <MobileTopbar />
        <MobileBottomNav />

        <div>
          <MobileHomeSection startupReady={isReady} />
          <MobileAboutSection />
          <MobileProductSection />
          <MobileAchievementsSection />
          <MobileFooter />
        </div>
      </main>
    </>
  );
}
