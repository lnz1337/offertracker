import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";
import type { Offer, SnapshotResult } from "@/lib/types";
import type { AdLibraryCollector } from "@/lib/types";

const log = createLogger({ service: "snapshot" });

export async function collectSnapshotsForOffer(
  offer: Offer,
  collector: AdLibraryCollector
): Promise<SnapshotResult[]> {
  const results: SnapshotResult[] = [];

  for (const country of offer.countries) {
    try {
      log.info(
        { offerId: offer.id, country },
        "Collecting snapshot"
      );

      const { activeCount, totalCount } = await collector.fetchAdCounts(
        offer.searchTerm,
        country
      );

      await prisma.snapshot.create({
        data: {
          offerId: offer.id,
          country,
          activeCount,
          totalCount,
        },
      });

      results.push({ country, activeCount, totalCount, errorMessage: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      log.error(
        { offerId: offer.id, country, error: errorMessage },
        "Snapshot collection failed"
      );

      await prisma.snapshot.create({
        data: {
          offerId: offer.id,
          country,
          activeCount: 0,
          totalCount: 0,
          errorMessage,
        },
      });

      results.push({ country, activeCount: 0, totalCount: 0, errorMessage });
    }
  }

  return results;
}

export async function getLatestSnapshots(offerId: string) {
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return [];

  const snapshots = await Promise.all(
    offer.countries.map(async (country) => {
      const [latest, previous] = await prisma.snapshot.findMany({
        where: { offerId, country, errorMessage: null },
        orderBy: { capturedAtUTC: "desc" },
        take: 2,
      });
      return {
        country,
        activeCount: latest?.activeCount ?? 0,
        totalCount: latest?.totalCount ?? 0,
        previousActiveCount: previous?.activeCount ?? null,
        previousTotalCount: previous?.totalCount ?? null,
        capturedAtUTC: latest?.capturedAtUTC ?? new Date(),
      };
    })
  );

  return snapshots;
}

export async function getSnapshotHistory(
  offerId: string,
  days: number = 7,
  country?: string
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.snapshot.findMany({
    where: {
      offerId,
      capturedAtUTC: { gte: since },
      errorMessage: null,
      ...(country ? { country } : {}),
    },
    orderBy: { capturedAtUTC: "asc" },
  });
}
