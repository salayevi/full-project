import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function createMediaRemotePattern(origin: string): RemotePattern | null {
  try {
    const url = new URL(origin);
    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      port: url.port || "",
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const apiOrigins = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.API_BASE_URL,
].filter(Boolean) as string[];

const remotePatterns = Array.from(
  new Map(
    apiOrigins
      .map(createMediaRemotePattern)
      .filter((pattern): pattern is NonNullable<ReturnType<typeof createMediaRemotePattern>> => Boolean(pattern))
      .map((pattern) => [`${pattern.protocol}://${pattern.hostname}:${pattern.port}`, pattern]),
  ).values(),
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
