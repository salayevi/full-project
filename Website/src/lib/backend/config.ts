function readEnv(name: string, aliases: string[] = []) {
  const candidates = [name, ...aliases];
  for (const candidate of candidates) {
    const value = process.env[candidate];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  throw new Error(`Missing required public environment variable: ${name}`);
}

const API_BASE_URL = readEnv("NEXT_PUBLIC_API_BASE_URL", ["API_BASE_URL"]);
const PREVIEW_QUERY_KEY =
  process.env.NEXT_PUBLIC_PREVIEW_QUERY_KEY?.trim() || "preview_token";

export const publicAppConfig = {
  apiBaseUrl: API_BASE_URL.replace(/\/$/, ""),
  previewQueryKey: PREVIEW_QUERY_KEY,
};
