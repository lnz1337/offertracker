import { z } from "zod";
import type { ParsedAdLibraryUrl } from "./types";

const adLibraryUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => url.includes("facebook.com/ads/library"),
    "URL must be a Facebook Ad Library URL"
  );

export function parseAdLibraryUrl(rawUrl: string): ParsedAdLibraryUrl {
  const validated = adLibraryUrlSchema.parse(rawUrl);
  const url = new URL(validated);
  const params = url.searchParams;

  const searchTerm = params.get("q") ?? "";
  const country = params.get("country") ?? "";
  const activeStatus = params.get("active_status") ?? "active";
  const mediaType = params.get("media_type") ?? "all";
  const adType = params.get("ad_type") ?? "all";

  if (!searchTerm) {
    throw new Error(
      "URL is missing the 'q' (search term) parameter"
    );
  }

  if (!country) {
    throw new Error("URL is missing the 'country' parameter");
  }

  return {
    searchTerm,
    country,
    activeStatus,
    mediaType,
    adType,
  };
}
