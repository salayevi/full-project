"use client";

import { useAuthStore } from "@/stores/auth-store";

import { appConfig } from "@/lib/config";
import type {
  AboutRecord,
  AchievementRecord,
  AuditLog,
  AuthUser,
  FooterRecord,
  HeroRecord,
  MediaAsset,
  OverviewResponse,
  ProductRecord,
  SiteSettingsRecord,
} from "@/lib/types";

const ADMIN_API = `${appConfig.apiBaseUrl}/api/v1/admin`;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.detail || payload?.message || "Request failed.";
    throw new ApiError(response.status, message);
  }

  return payload as T;
}

async function refreshAccessToken() {
  const { refreshToken, updateAccessToken, clearSession } = useAuthStore.getState();
  if (!refreshToken) {
    clearSession();
    throw new ApiError(401, "Session expired.");
  }

  const response = await fetch(`${ADMIN_API}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    throw new ApiError(401, "Session expired.");
  }

  const payload = await response.json();
  updateAccessToken(payload.access);
  return payload.access as string;
}

async function request<T>(path: string, init: RequestInit = {}, requiresAuth = true, retry = true): Promise<T> {
  const { accessToken, clearSession } = useAuthStore.getState();
  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${ADMIN_API}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && requiresAuth && retry) {
    const nextAccessToken = await refreshAccessToken();
    return request<T>(
      path,
      {
        ...init,
        headers: {
          ...(init.headers || {}),
          Authorization: `Bearer ${nextAccessToken}`,
        },
      },
      requiresAuth,
      false
    );
  }

  if (response.status === 401 && requiresAuth) {
    clearSession();
  }

  return parseResponse<T>(response);
}

export async function login(email: string, password: string) {
  return request<{ tokens: { access: string; refresh: string }; user: AuthUser }>(
    "/auth/login/",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false
  );
}

export async function logout() {
  const response = await request<void>("/auth/logout/", { method: "POST" });
  useAuthStore.getState().clearSession();
  return response;
}

export function getMe() {
  return request<AuthUser>("/auth/me/");
}

export function getOverview() {
  return request<OverviewResponse>("/overview/");
}

export function getHero() {
  return request<HeroRecord>("/hero/");
}

export function saveHero(payload: Partial<HeroRecord>) {
  return request<HeroRecord>("/hero/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getAbout() {
  return request<AboutRecord>("/about/");
}

export function saveAbout(payload: Partial<AboutRecord>) {
  return request<AboutRecord>("/about/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getAchievements(search = "", publishState = "") {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (publishState) query.set("publish_state", publishState);
  const suffix = query.toString() ? `?${query}` : "";
  return request<AchievementRecord[]>(`/achievements/${suffix}`);
}

export function createAchievement(payload: Partial<AchievementRecord>) {
  return request<AchievementRecord>("/achievements/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAchievement(id: string, payload: Partial<AchievementRecord>) {
  return request<AchievementRecord>(`/achievements/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAchievement(id: string) {
  return request<void>(`/achievements/${id}/`, { method: "DELETE" });
}

export function getFooter() {
  return request<FooterRecord>("/footer/");
}

export function saveFooter(payload: Partial<FooterRecord>) {
  return request<FooterRecord>("/footer/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getProducts(search = "", publishState = "") {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (publishState) query.set("publish_state", publishState);
  const suffix = query.toString() ? `?${query}` : "";
  return request<ProductRecord[]>(`/products/${suffix}`);
}

export function createProduct(payload: Partial<ProductRecord>) {
  return request<ProductRecord>("/products/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: string, payload: Partial<ProductRecord>) {
  return request<ProductRecord>(`/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: string) {
  return request<void>(`/products/${id}/`, { method: "DELETE" });
}

export function getSiteSettings() {
  return request<SiteSettingsRecord>("/site-settings/");
}

export function saveSiteSettings(payload: Partial<SiteSettingsRecord>) {
  return request<SiteSettingsRecord>("/site-settings/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getMedia(search = "", kind = "") {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (kind) query.set("kind", kind);
  const suffix = query.toString() ? `?${query}` : "";
  return request<MediaAsset[]>(`/media/${suffix}`);
}

export function uploadMedia(formData: FormData) {
  return request<MediaAsset>(
    "/media/",
    {
      method: "POST",
      body: formData,
    }
  );
}

export function updateMedia(id: string, payload: Partial<MediaAsset>) {
  return request<MediaAsset>(`/media/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMedia(id: string) {
  return request<void>(`/media/${id}/`, { method: "DELETE" });
}

export function getUsers() {
  return request<AuthUser[]>("/users/");
}

export function getAuditLogs() {
  return request<AuditLog[]>("/audit/");
}

export function createSitePreview(module: string, payload: Record<string, unknown>) {
  return request<{
    token: string;
    expires_at: string;
    snapshot_url: string;
    preview_url: string;
  }>("/preview/site/", {
    method: "POST",
    body: JSON.stringify({ module, payload }),
  });
}
