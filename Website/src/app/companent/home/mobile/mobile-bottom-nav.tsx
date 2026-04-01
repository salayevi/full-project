"use client";

import Image from "next/image";
import AuthTriggerButton from "../../shared/auth/AuthTriggerButton";
import useMobileCollapsedNav from "../../shared/hooks/use-mobile-collapsed-nav";
import { colors } from "@/config/design-system";
import { mobileHero } from "@/config/mobile-system/mobile-hero";
import { mobileNavbar } from "@/config/mobile-system/mobile-navbar";
import { mobileSpacing } from "@/config/mobile-system/mobile-spacing";
import { mobileTypography } from "@/config/mobile-system/mobile-typography";
import { usePublicSiteContent } from "@/app/companent/shared/content/PublicSiteContentProvider";
import { createContentPlaceholderDataUri } from "@/lib/backend/placeholders";
import {
  selectLogoAsset,
  selectNavigationLinksForPlacement,
  selectSiteIdentity,
} from "@/lib/backend/selectors";

function SmallCircle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "54px",
        height: "54px",
        borderRadius: "9999px",
        backgroundColor: mobileHero.topIconOuterBackground,
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "9999px",
          backgroundColor: mobileHero.topIconInnerBackground,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function MobileBottomNav() {
  const snapshot = usePublicSiteContent();
  const siteIdentity = selectSiteIdentity(snapshot);
  const logoAsset = selectLogoAsset(snapshot);
  const navItems = selectNavigationLinksForPlacement(snapshot, "mobileBottom");
  const isCollapsed = useMobileCollapsedNav(110);

  return (
    <div
      className="fixed left-1/2 z-40 w-full -translate-x-1/2"
      style={{
        maxWidth: "480px",
        bottom: mobileSpacing.bottomNavY,
        paddingInline: mobileSpacing.bottomNavX,
      }}
    >
      <nav
        className="items-center"
        style={{
          minHeight: isCollapsed ? "68px" : mobileNavbar.bottomHeight,
          borderRadius: mobileNavbar.bottomRadius,
          backgroundColor: isCollapsed
            ? colors.brand.secondary
            : mobileHero.bottomNavBackground,
          backdropFilter: `blur(${mobileNavbar.bottomBlur})`,
          boxShadow: mobileHero.navShadow,
          paddingInline: mobileSpacing.bottomNavInnerX,
          display: "grid",
          gridTemplateColumns: isCollapsed ? "auto 1fr auto" : "1fr",
          gap: isCollapsed ? "10px" : "0px",
          transition:
            "min-height 260ms ease, background-color 260ms ease, gap 260ms ease, transform 260ms ease",
        }}
      >
        {isCollapsed ? (
          <>
            <a href="#home-mobile" className="flex items-center">
              <SmallCircle>
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
                  width={28}
                  height={28}
                  unoptimized
                />
              </SmallCircle>
            </a>

            <div className="flex items-center justify-center gap-5 overflow-hidden">
              {navItems.slice(1).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="truncate text-center"
                  style={{
                    color: colors.text.white,
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <AuthTriggerButton
              mode="login"
              className="block"
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
              }}
            >
              <SmallCircle>
                <svg
                  width="22"
                  height="22"
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
              </SmallCircle>
            </AuthTriggerButton>
          </>
        ) : (
          <div className="grid grid-cols-4 items-center">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex h-full items-center justify-center text-center"
                style={{
                  color: mobileHero.bottomNavTextColor,
                  fontSize: mobileTypography.nav.label,
                  fontWeight: mobileTypography.nav.weight,
                  lineHeight: mobileTypography.nav.lineHeight,
                  whiteSpace: "nowrap",
                  minHeight: mobileNavbar.bottomHeight,
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
