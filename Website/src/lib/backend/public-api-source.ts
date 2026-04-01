import type { PublicSiteApiResponse } from "./api";
import type { PublicSiteSnapshot } from "./domain";
import { publicAppConfig } from "./config";

export class PublicApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildSnapshotUrl(previewToken?: string): string {
  const publicApiBase = `${publicAppConfig.apiBaseUrl}/api/v1/public`;
  if (previewToken) {
    return `${publicApiBase}/preview/${encodeURIComponent(previewToken)}/snapshot/`;
  }

  return `${publicApiBase}/snapshot/`;
}

async function parseSnapshotResponse(response: Response): Promise<PublicSiteSnapshot> {
  const payload = (await response.json()) as Partial<PublicSiteApiResponse> & {
    detail?: string;
    message?: string;
  };

  if (!response.ok || !payload.data) {
    throw new PublicApiError(
      response.status,
      payload.detail ?? payload.message ?? "Public site snapshot request failed.",
    );
  }

  return payload.data;
}

export async function getPublicSiteSnapshot(previewToken?: string): Promise<PublicSiteSnapshot> {
  const response = await fetch(buildSnapshotUrl(previewToken), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return parseSnapshotResponse(response);
}
