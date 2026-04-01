export type ISODateTimeString = string;

export type PublishStatus = "draft" | "published" | "archived";
export type VisibilityState = "visible" | "hidden";
export type MediaKind = "image" | "video" | "logo" | "favicon";
export type ThemeTone = "light" | "dark";
export type NavigationPlacement =
  | "desktopHeader"
  | "mobileBottom"
  | "footer";
export type UserRoleCode =
  | "owner"
  | "admin"
  | "editor"
  | "viewer"
  | "customer";
export type ActivitySource = "dashboard" | "assistant" | "system";
export type CommerceStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "paid"
  | "fulfilled"
  | "cancelled";
export type AssistantPreviewStatus = "pending" | "confirmed" | "cancelled";
export type ContentEntityType =
  | "siteIdentity"
  | "navigationLink"
  | "heroSection"
  | "aboutSection"
  | "aboutTextItem"
  | "product"
  | "productColorVariant"
  | "achievement"
  | "footerSection"
  | "mediaAsset";

export type ManagedEntity = {
  id: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  updatedBy?: string;
  revisionId?: string;
};

export type ManagedContentEntity = ManagedEntity & {
  status: PublishStatus;
  visibility: VisibilityState;
  sortOrder: number;
  publishedAt?: ISODateTimeString;
};

export type MediaAsset = ManagedContentEntity & {
  kind: MediaKind;
  label: string;
  url: string;
  alt?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  storageKey?: string;
};

export type SiteThemeSettings = {
  brand: {
    primary: string;
    primaryStrong: string;
    secondary: string;
    soft: string;
  };
  background: {
    page: string;
    soft: string;
    about: string;
    achievements: string;
    dark: string;
    lightPanel: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    soft: string;
    white: string;
  };
  border: {
    soft: string;
    whiteSoft: string;
  };
  overlay: {
    hero: string;
    navbar: string;
    modal: string;
  };
  surface: {
    white: string;
    glass: string;
    modal: string;
  };
  mobileHero: {
    topIconOuterBackground: string;
    topIconInnerBackground: string;
    bottomNavBackground: string;
    bottomNavTextColor: string;
    softShadow: string;
    navShadow: string;
  };
};

export type SiteIdentity = ManagedContentEntity & {
  siteName: string;
  brandText: string;
  tagline?: string;
  logoAssetId?: string;
  faviconAssetId?: string;
  themeSettings: SiteThemeSettings;
};

export type NavigationLink = ManagedContentEntity & {
  label: string;
  href: string;
  placement: NavigationPlacement[];
  openInNewTab?: boolean;
};

export type HeroOverlaySettings = {
  color: string;
};

export type HeroSection = ManagedContentEntity & {
  titleLines: string[];
  backgroundMediaAssetId: string;
  mobileBackgroundMediaAssetId?: string;
  logoAssetId?: string;
  overlay: HeroOverlaySettings;
};

export type AboutSection = ManagedContentEntity & {
  sectionLabel: string;
  brandTitle: string;
  imageAssetId: string;
};

export type AboutTextItem = ManagedContentEntity & {
  aboutSectionId: string;
  text: string;
};

export type ProductDisplayTheme = {
  bg: string;
  text: string;
  accent: string;
  muted?: string;
  card?: string;
  tone?: ThemeTone;
};

export type ProductMediaPanel = {
  mode: "imageTone" | "forceBlack" | "forceWhite";
  color?: string;
};

export type ProductColorVariant = ManagedContentEntity & {
  productId: string;
  name: string;
  hex: string;
  previewAssetId?: string;
};

export type ProductRecord = ManagedContentEntity & {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  price?: string;
  badge?: string;
  mediaAssetId: string;
  displayTheme: ProductDisplayTheme;
  mediaPanel: ProductMediaPanel;
  colorVariantIds: string[];
  savedEnabled: boolean;
  cartEnabled: boolean;
  orderEnabled: boolean;
};

export type AchievementDisplayTheme = {
  frame: string;
  ribbon: string;
  text: string;
  muted: string;
};

export type AchievementRecord = ManagedContentEntity & {
  title: string;
  eyebrow?: string;
  description: string;
  mediaAssetId: string;
  displayTheme?: AchievementDisplayTheme;
};

export type FooterContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type FooterSocialLink = {
  label: string;
  href: string;
};

export type FooterCallToAction = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryMode: "login" | "register";
  secondaryLabel: string;
  secondaryHref: string;
};

export type FooterSection = ManagedContentEntity & {
  brandText: string;
  description: string;
  contactItems: FooterContactItem[];
  socialLinks: FooterSocialLink[];
  cta: FooterCallToAction;
  legalText: string;
};

export type Role = {
  code: UserRoleCode;
  label: string;
  permissions: string[];
};

export type AdminUser = ManagedEntity & {
  email: string;
  displayName: string;
  roles: UserRoleCode[];
  lastActiveAt?: ISODateTimeString;
};

export type ActivityLogEntry = ManagedEntity & {
  actorUserId?: string;
  actorEmail?: string;
  source: ActivitySource;
  action: string;
  entityType: ContentEntityType | "savedItem" | "cart" | "order";
  entityId: string;
  correlationId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
};

export type SavedItem = ManagedEntity & {
  userId: string;
  productId: string;
};

export type CartLine = ManagedEntity & {
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice?: string;
};

export type Cart = ManagedEntity & {
  userId?: string;
  status: CommerceStatus;
  currency: string;
  lineItems: CartLine[];
};

export type OrderLine = ManagedEntity & {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice?: string;
  lineTotal?: string;
};

export type Order = ManagedEntity & {
  userId?: string;
  cartId?: string;
  status: CommerceStatus;
  currency: string;
  totalAmount?: string;
  lineItems: OrderLine[];
};

export type ProposedMutation = {
  entityType: ContentEntityType;
  entityId?: string;
  action: "create" | "update" | "delete" | "publish" | "hide" | "reorder";
  summary: string;
  changes: Record<string, unknown>;
  destructive: boolean;
  requiresConfirmation: boolean;
  approvedBy?: string;
};

export type AssistantCommandPreview = ManagedEntity & {
  rawCommand: string;
  detectedIntent: string;
  destructive: boolean;
  requiresConfirmation: boolean;
  status: AssistantPreviewStatus;
  proposedMutations: ProposedMutation[];
  approvedBy?: string;
};

export type AdminDashboardSummary = {
  drafts: number;
  published: number;
  hidden: number;
  recentActivityCount: number;
  mediaAssetCount: number;
  orderCount: number;
};

export type AuthSession = {
  sessionId: string;
  userId: string;
  email: string;
  displayName?: string;
  role: UserRoleCode;
  status: "authenticated" | "anonymous";
  startedAt: ISODateTimeString;
  expiresAt?: ISODateTimeString;
};

export type PublicSiteSnapshot = {
  generatedAt: ISODateTimeString;
  siteIdentity: SiteIdentity;
  navigationLinks: NavigationLink[];
  hero: HeroSection;
  about: AboutSection;
  aboutTextItems: AboutTextItem[];
  products: ProductRecord[];
  productColorVariants: ProductColorVariant[];
  achievements: AchievementRecord[];
  footer: FooterSection;
  mediaAssets: MediaAsset[];
};
