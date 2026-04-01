export const mobileHero = {
  topIconOuterBackground: "var(--site-mobile-top-icon-outer-bg)",
  topIconInnerBackground: "var(--site-mobile-top-icon-inner-bg)",
  bottomNavBackground: "var(--site-mobile-bottom-nav-bg)",
  bottomNavTextColor: "var(--site-mobile-bottom-nav-text)",
  titleColor: "var(--site-text-white)",
  softShadow: "var(--site-mobile-soft-shadow)",
  navShadow: "var(--site-mobile-nav-shadow)",
} as const;

export type MobileHero = typeof mobileHero;
