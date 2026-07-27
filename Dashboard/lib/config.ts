// Next.js replaces NEXT_PUBLIC_* only where it sees a static member access, so
// each variable has to be spelled out below. Reading process.env[name] with a
// computed key leaves it undefined in the client bundle, which made readEnv
// throw in the browser and took the whole dashboard down.
const env: Record<string, string | undefined> = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  NEXT_PUBLIC_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL,
  NEXT_PUBLIC_PREVIEW_URL: process.env.NEXT_PUBLIC_PREVIEW_URL,
};

function readEnv(name: string, aliases: string[] = [], fallback?: string) {
  const candidates = [name, ...aliases];
  for (const candidate of candidates) {
    const value = env[candidate];
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
