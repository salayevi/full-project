function readEnv(name: string, aliases: string[] = [], fallback?: string) {
  const candidates = [name, ...aliases];
  for (const candidate of candidates) {
    const value = process.env[candidate];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  if (fallback) {
    return fallback;
  }

  throw new Error(`Missing required dashboard environment variable: ${name}`);
}

const API_BASE_URL = readEnv("NEXT_PUBLIC_API_BASE_URL");
const PUBLIC_SITE_URL = readEnv("NEXT_PUBLIC_WEBSITE_URL", [
  "NEXT_PUBLIC_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_PUBLIC_URL",
]);
const PREVIEW_URL = readEnv("NEXT_PUBLIC_PREVIEW_URL", [], PUBLIC_SITE_URL);

export const appConfig = {
  apiBaseUrl: API_BASE_URL.replace(/\/$/, ""),
  publicSiteUrl: PUBLIC_SITE_URL.replace(/\/$/, ""),
  previewUrl: PREVIEW_URL.replace(/\/$/, ""),
};
