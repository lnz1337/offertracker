import {
  META_API_BASE_URL,
  META_API_VERSION,
  META_API_ADS_PER_PAGE,
  META_API_MAX_PAGES,
} from "@/lib/constants";
import { createLogger } from "@/lib/logger";
import { RateLimiter } from "@/lib/rate-limiter";
import { withRetry } from "@/lib/retry";
import type { AdLibraryCollector, CollectionResult } from "@/lib/types";

const log = createLogger({ service: "meta-ad-library" });

const rateLimiter = new RateLimiter(
  parseInt(process.env.META_API_RATE_LIMIT_PER_HOUR ?? "200", 10)
);

interface MetaApiResponse {
  data: Array<{ id: string }>;
  paging?: {
    cursors?: { after?: string };
    next?: string;
  };
}

async function fetchPage(
  url: string,
  accessToken: string
): Promise<MetaApiResponse> {
  await rateLimiter.acquire();

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const body = await response.text();
    log.error(
      { status: response.status, body },
      "Meta API request failed"
    );
    throw new Error(
      `Meta API error ${response.status}: ${body}`
    );
  }

  return response.json() as Promise<MetaApiResponse>;
}

async function countAds(
  searchTerm: string,
  country: string,
  activeStatus: "ACTIVE" | "ALL",
  accessToken: string
): Promise<number> {
  const baseUrl = `${META_API_BASE_URL}/${META_API_VERSION}/ads_archive`;
  const params = new URLSearchParams({
    search_terms: searchTerm,
    ad_reached_countries: JSON.stringify([country]),
    ad_active_status: activeStatus,
    fields: "id",
    limit: String(META_API_ADS_PER_PAGE),
  });

  let totalCount = 0;
  let nextUrl: string | null = `${baseUrl}?${params.toString()}`;
  let pageNumber = 0;

  while (nextUrl && pageNumber < META_API_MAX_PAGES) {
    const page = await withRetry(() => fetchPage(nextUrl!, accessToken));
    totalCount += page.data.length;
    nextUrl = page.paging?.next ?? null;
    pageNumber++;

    log.debug(
      { pageNumber, pageSize: page.data.length, totalCount, activeStatus },
      "Fetched page"
    );

    if (page.data.length < META_API_ADS_PER_PAGE) {
      break;
    }
  }

  if (pageNumber >= META_API_MAX_PAGES && nextUrl) {
    log.warn(
      { searchTerm, country, activeStatus, totalCount },
      "Hit max page limit, count may be incomplete"
    );
  }

  return totalCount;
}

export class MetaAdLibraryCollector implements AdLibraryCollector {
  private accessToken: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken ?? process.env.META_ACCESS_TOKEN ?? "";
    if (!this.accessToken) {
      throw new Error("META_ACCESS_TOKEN is required");
    }
  }

  async fetchAdCounts(
    searchTerm: string,
    country: string
  ): Promise<CollectionResult> {
    log.info({ searchTerm, country }, "Starting ad count collection");

    const [activeCount, totalCount] = await Promise.all([
      countAds(searchTerm, country, "ACTIVE", this.accessToken),
      countAds(searchTerm, country, "ALL", this.accessToken),
    ]);

    log.info(
      { searchTerm, country, activeCount, totalCount },
      "Collection complete"
    );

    return { activeCount, totalCount, source: "meta_api" };
  }
}

export function createCollector(): AdLibraryCollector {
  return new MetaAdLibraryCollector();
}
