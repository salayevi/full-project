// Next.js replaces NEXT_PUBLIC_* only where it sees a static member access, so
// each variable has to be spelled out below. Reading process.env[name] with a
// computed key leaves it undefined in the client bundle and makes readEnv throw
// in the browser. API_BASE_URL stays a plain server-side variable.
const env: Record<string, string | undefined> = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_BASE_URL: process.env.API_BASE_URL,
};

function readEnv(name: string, aliases: string[] = []) {
  const candidates = [name, ...aliases];
  for (const candidate of candidates) {
    const value = env[candidate];
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
