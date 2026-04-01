"use client";

import type { ReactNode, RefObject } from "react";
import Image from "next/image";
import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";
import useMobileCollapsedNav from "../../shared/hooks/use-mobile-collapsed-nav";
import { colors } from "@/config/design-system";
import { mobileNavbar } from "@/config/mobile-system/mobile-navbar";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileHero } from "@/config/mobile-system/mobile-hero";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders";
import { selectLogoAsset, selectSiteIdentity } from "@/lib/backend/selectors";

type MobileTopbarProps = {
  topbarRef?: RefObject<HTMLDivElement | null>;
};

function CircleShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: mobileNavbar.topIconSize,
        height: mobileNavbar.topIconSize,
        borderRadius: "9999px",
        backgroundColor: mobileHero.topIconOuterBackground,
        boxShadow: mobileHero.softShadow,
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: mobileNavbar.topIconInnerSize,
          height: mobileNavbar.topIconInnerSize,
          borderRadius: "9999px",
          backgroundColor: mobileHero.topIconInnerBackground,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function MobileTopbar({ topbarRef }: MobileTopbarProps) {
  const snapshot = usePublicSiteContent();
  const siteIdentity = selectSiteIdentity(snapshot);
  const logoAsset = selectLogoAsset(snapshot);
  const isCollapsed = useMobileCollapsedNav(110);

  return (
    <div
      ref={topbarRef}
      className="fixed z-40 flex flex-col transition-all duration-300"
      style={{
        top: mobileSpacing.topbarTop,
        left: mobileSpacing.topbarLeft,
        gap: mobileNavbar.topIconGap,
        opacity: isCollapsed ? 0 : 1,
        pointerEvents: isCollapsed ? "none" : "auto",
        transform: isCollapsed ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      <CircleShell>
        <Image
          src={
            logoAsset?.url ??
            createContentPlaceholderDataUri({
              title: siteIdentity.brandText || siteIdentity.siteName,
              subtitle: "Logo",
              background: "#ffffff",
              foreground: "#101828",
              accent: "#d85ca7",
            })
          }
          alt={logoAsset?.alt ?? siteIdentity.siteName}
          width={34}
          height={34}
          priority
          unoptimized
        />
      </CircleShell>

      <AuthTriggerButton
        mode="login"
        className="block"
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
        }}
      >
        <CircleShell>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
              fill={colors.brand.primary}
            />
            <path
              d="M4 20C4.92575 16.5539 8.07838 14 12 14C15.9216 14 19.0742 16.5539 20 20"
              fill={colors.brand.primary}
            />
          </svg>
        </CircleShell>
      </AuthTriggerButton>
    </div>
  );
}
