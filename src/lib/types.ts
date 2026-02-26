import type { Offer, Snapshot, TerritoryType } from "@prisma/client";

// Re-export Prisma types
export type { Offer, Snapshot, TerritoryType };

export interface ParsedAdLibraryUrl {
  searchTerm: string;
  country: string;
  activeStatus: string;
  mediaType: string;
  adType: string;
}

export interface OfferFormData {
  name: string;
  url: string;
  territoryType: TerritoryType;
  countries: string[];
  timezone: string;
}

export interface SnapshotResult {
  country: string;
  activeCount: number;
  totalCount: number;
  errorMessage: string | null;
}

export interface CollectionResult {
  activeCount: number;
  totalCount: number;
  source: "meta_api" | "mock";
}

export interface AdLibraryCollector {
  fetchAdCounts(
    searchTerm: string,
    country: string
  ): Promise<CollectionResult>;
}

export interface OfferWithLatestSnapshots extends Offer {
  latestSnapshots: SnapshotRow[];
}

export interface SnapshotRow {
  country: string;
  activeCount: number;
  totalCount: number;
  previousActiveCount: number | null;
  previousTotalCount: number | null;
  capturedAtUTC: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ChartDataPoint {
  date: string;
  activeCount: number;
  totalCount: number;
}
