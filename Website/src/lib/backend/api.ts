import type {
  ActivityLogEntry,
  AdminDashboardSummary,
  AssistantCommandPreview,
  AuthSession,
  Cart,
  ContentEntityType,
  FooterSection,
  MediaAsset,
  NavigationLink,
  Order,
  ProductRecord,
  PublishStatus,
  PublicSiteSnapshot,
  SavedItem,
  SiteIdentity,
  VisibilityState,
} from "./domain";

export type ApiMeta = {
  generatedAt: string;
  requestId?: string;
};

export type PublicSiteApiResponse = {
  data: PublicSiteSnapshot;
  meta: ApiMeta;
};

export type AdminContentListResponse<T> = {
  items: T[];
  total: number;
  summary?: AdminDashboardSummary;
  meta: ApiMeta;
};

export type AdminContentUpsertRequest<T> = {
  data: T;
  actorUserId: string;
  note?: string;
};

export type AdminReorderItem = {
  id: string;
  sortOrder: number;
};

export type AdminReorderRequest = {
  entityType: ContentEntityType;
  items: AdminReorderItem[];
  actorUserId: string;
};

export type AdminPublishRequest = {
  entityType: ContentEntityType;
  entityId: string;
  status: PublishStatus;
  visibility?: VisibilityState;
  actorUserId: string;
  note?: string;
};

export type AdminDeleteRequest = {
  entityType: ContentEntityType;
  entityId: string;
  actorUserId: string;
  requireConfirmation?: boolean;
};

export type MediaLibraryListRequest = {
  search?: string;
  kind?: MediaAsset["kind"];
  status?: PublishStatus;
  visibility?: VisibilityState;
};

export type MediaUploadRequest = {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  alt?: string;
  actorUserId: string;
};

export type MediaUploadResponse = {
  asset: MediaAsset;
  uploadUrl?: string;
  meta: ApiMeta;
};

export type MediaReplaceRequest = {
  assetId: string;
  alt?: string;
  actorUserId: string;
};

export type AuthCredentialsRequest = {
  mode: "login" | "register";
  email: string;
  password: string;
};

export type AuthSessionResponse = {
  session: AuthSession | null;
  meta: ApiMeta;
};

export type SavedItemCreateRequest = {
  productId: string;
  userId: string;
};

export type SavedItemsResponse = {
  items: SavedItem[];
  meta: ApiMeta;
};

export type CartLineUpsertRequest = {
  productId: string;
  quantity: number;
};

export type CartUpsertRequest = {
  cartId?: string;
  userId?: string;
  line: CartLineUpsertRequest;
};

export type CartResponse = {
  cart: Cart;
  meta: ApiMeta;
};

export type OrderCreateRequest = {
  cartId: string;
  userId?: string;
};

export type OrderResponse = {
  order: Order;
  meta: ApiMeta;
};

export type AssistantCommandPreviewRequest = {
  command: string;
  actorUserId: string;
};

export type AssistantCommandConfirmRequest = {
  previewId: string;
  actorUserId: string;
  approved: boolean;
};

export type AssistantCommandPreviewResponse = {
  preview: AssistantCommandPreview;
  meta: ApiMeta;
};

export type DashboardSummaryResponse = {
  summary: AdminDashboardSummary;
  recentActivity: ActivityLogEntry[];
  meta: ApiMeta;
};

export type AdminSiteIdentityResponse = {
  item: SiteIdentity;
  meta: ApiMeta;
};

export type AdminNavigationResponse = {
  items: NavigationLink[];
  meta: ApiMeta;
};

export type AdminProductsResponse = {
  items: ProductRecord[];
  meta: ApiMeta;
};

export type AdminFooterResponse = {
  item: FooterSection;
  meta: ApiMeta;
};
