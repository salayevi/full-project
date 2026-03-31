import type {
  AboutSection,
  AboutTextItem,
  AchievementDisplayTheme,
  AchievementRecord,
  FooterSection,
  MediaAsset,
  NavigationLink,
  NavigationPlacement,
  ProductColorVariant,
  ProductRecord,
  PublicSiteSnapshot,
  SiteIdentity,
} from "./domain";

type ThemeCssVariables = Record<`--${string}`, string>;

type ResolvedHeroViewModel = {
  titleLines: string[];
  backgroundMedia: MediaAsset | null;
  mobileBackgroundMedia: MediaAsset | null;
  overlayColor: string;
};

type ResolvedAboutViewModel = {
  section: AboutSection;
  image: MediaAsset | null;
  textItems: AboutTextItem[];
};

type ResolvedAchievementViewModel = {
  item: AchievementRecord;
  image: MediaAsset | null;
  theme: AchievementDisplayTheme;
};

type ResolvedFooterViewModel = {
  section: FooterSection;
  logo: MediaAsset | null;
  navigationLinks: NavigationLink[];
};

const defaultAchievementTheme: AchievementDisplayTheme = {
  frame: "#f0069f",
  ribbon: "#f0069f",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.92)",
};

function isPubliclyVisible<T extends { status: string; visibility: string }>(
  item: T,
) {
  return item.status === "published" && item.visibility === "visible";
}

function bySortOrder<T extends { sortOrder: number }>(a: T, b: T) {
  return a.sortOrder - b.sortOrder;
}

export function selectSiteIdentity(snapshot: PublicSiteSnapshot): SiteIdentity {
  return snapshot.siteIdentity;
}

export function selectMediaAsset(
  snapshot: PublicSiteSnapshot,
  assetId?: string,
): MediaAsset | null {
  if (!assetId) {
    return null;
  }

  return snapshot.mediaAssets.find((asset) => asset.id === assetId) ?? null;
}

export function selectLogoAsset(snapshot: PublicSiteSnapshot): MediaAsset | null {
  return selectMediaAsset(snapshot, snapshot.siteIdentity.logoAssetId);
}

export function selectHeroViewModel(
  snapshot: PublicSiteSnapshot,
): ResolvedHeroViewModel {
  return {
    titleLines: snapshot.hero.titleLines,
    backgroundMedia: selectMediaAsset(
      snapshot,
      snapshot.hero.backgroundMediaAssetId,
    ),
    mobileBackgroundMedia: selectMediaAsset(
      snapshot,
      snapshot.hero.mobileBackgroundMediaAssetId,
    ),
    overlayColor: snapshot.hero.overlay.color,
  };
}

export function selectNavigationLinksForPlacement(
  snapshot: PublicSiteSnapshot,
  placement: NavigationPlacement,
): NavigationLink[] {
  return snapshot.navigationLinks
    .filter(isPubliclyVisible)
    .filter((link) => link.placement.includes(placement))
    .sort(bySortOrder);
}

export function selectAboutViewModel(
  snapshot: PublicSiteSnapshot,
): ResolvedAboutViewModel {
  return {
    section: snapshot.about,
    image: selectMediaAsset(snapshot, snapshot.about.imageAssetId),
    textItems: snapshot.aboutTextItems.filter(isPubliclyVisible).sort(bySortOrder),
  };
}

export function selectPublicProductRecords(
  snapshot: PublicSiteSnapshot,
): ProductRecord[] {
  return snapshot.products.filter(isPubliclyVisible).sort(bySortOrder);
}

export function selectProductColorVariants(
  snapshot: PublicSiteSnapshot,
  productId: string,
): ProductColorVariant[] {
  return snapshot.productColorVariants
    .filter(isPubliclyVisible)
    .filter((variant) => variant.productId === productId)
    .sort(bySortOrder);
}

export function selectAchievementsViewModel(
  snapshot: PublicSiteSnapshot,
): ResolvedAchievementViewModel[] {
  return snapshot.achievements
    .filter(isPubliclyVisible)
    .sort(bySortOrder)
    .map((item) => ({
      item,
      image: selectMediaAsset(snapshot, item.mediaAssetId),
      theme: item.displayTheme ?? defaultAchievementTheme,
    }));
}

export function selectFooterViewModel(
  snapshot: PublicSiteSnapshot,
): ResolvedFooterViewModel {
  return {
    section: snapshot.footer,
    logo: selectLogoAsset(snapshot),
    navigationLinks: selectNavigationLinksForPlacement(snapshot, "footer"),
  };
}

export function selectThemeCssVariables(
  snapshot: PublicSiteSnapshot,
): ThemeCssVariables {
  const { themeSettings } = snapshot.siteIdentity;

  return {
    "--site-brand-primary": themeSettings.brand.primary,
    "--site-brand-primary-strong": themeSettings.brand.primaryStrong,
    "--site-brand-secondary": themeSettings.brand.secondary,
    "--site-brand-soft": themeSettings.brand.soft,
    "--site-bg-page": themeSettings.background.page,
    "--site-bg-soft": themeSettings.background.soft,
    "--site-bg-about": themeSettings.background.about,
    "--site-bg-achievements": themeSettings.background.achievements,
    "--site-bg-dark": themeSettings.background.dark,
    "--site-bg-light-panel": themeSettings.background.lightPanel,
    "--site-text-primary": themeSettings.text.primary,
    "--site-text-secondary": themeSettings.text.secondary,
    "--site-text-muted": themeSettings.text.muted,
    "--site-text-soft": themeSettings.text.soft,
    "--site-text-white": themeSettings.text.white,
    "--site-border-soft": themeSettings.border.soft,
    "--site-border-white-soft": themeSettings.border.whiteSoft,
    "--site-overlay-hero": themeSettings.overlay.hero,
    "--site-overlay-navbar": themeSettings.overlay.navbar,
    "--site-overlay-modal": themeSettings.overlay.modal,
    "--site-surface-white": themeSettings.surface.white,
    "--site-surface-glass": themeSettings.surface.glass,
    "--site-surface-modal": themeSettings.surface.modal,
    "--site-mobile-top-icon-outer-bg":
      themeSettings.mobileHero.topIconOuterBackground,
    "--site-mobile-top-icon-inner-bg":
      themeSettings.mobileHero.topIconInnerBackground,
    "--site-mobile-bottom-nav-bg":
      themeSettings.mobileHero.bottomNavBackground,
    "--site-mobile-bottom-nav-text":
      themeSettings.mobileHero.bottomNavTextColor,
    "--site-mobile-soft-shadow": themeSettings.mobileHero.softShadow,
    "--site-mobile-nav-shadow": themeSettings.mobileHero.navShadow,
  };
}
