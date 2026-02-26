import { NextRequest, NextResponse } from "next/server";
import { getOffersDueForCollection } from "@/services/scheduler";
import { collectSnapshotsForOffer } from "@/services/snapshot-service";
import { MetaAdLibraryCollector } from "@/services/meta-ad-library";
import { createLogger } from "@/lib/logger";
import { COLLECTION_CONCURRENCY } from "@/lib/constants";

export const maxDuration = 120;

const log = createLogger({ service: "cron-snapshot" });

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dueOffers = await getOffersDueForCollection();

    if (dueOffers.length === 0) {
      log.info("No offers due for collection");
      return NextResponse.json({ collected: 0, errors: 0 });
    }

    log.info({ count: dueOffers.length }, "Processing due offers");

    const collector = new MetaAdLibraryCollector();
    let collected = 0;
    let errors = 0;

    // Process in batches to respect concurrency limits
    for (let i = 0; i < dueOffers.length; i += COLLECTION_CONCURRENCY) {
      const batch = dueOffers.slice(i, i + COLLECTION_CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((offer) => collectSnapshotsForOffer(offer, collector))
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          collected += result.value.filter((r) => !r.errorMessage).length;
          errors += result.value.filter((r) => r.errorMessage).length;
        } else {
          errors++;
          log.error({ error: result.reason }, "Batch item failed");
        }
      }
    }

    log.info({ collected, errors }, "Cron snapshot complete");
    return NextResponse.json({ collected, errors });
  } catch (error) {
    log.error({ error }, "Cron snapshot failed");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
