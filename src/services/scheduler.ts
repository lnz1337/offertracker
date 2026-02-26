import { prisma } from "@/lib/prisma";
import { SNAPSHOT_HOURS } from "@/lib/constants";
import { createLogger } from "@/lib/logger";
import type { Offer } from "@/lib/types";

const log = createLogger({ service: "scheduler" });

function getLocalHour(utcDate: Date, timezone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  return parseInt(formatter.format(utcDate), 10);
}

async function hasRecentSnapshot(
  offerId: string,
  windowHours: number = 2
): Promise<boolean> {
  const since = new Date();
  since.setHours(since.getHours() - windowHours);

  const count = await prisma.snapshot.count({
    where: {
      offerId,
      capturedAtUTC: { gte: since },
      errorMessage: null,
    },
  });

  return count > 0;
}

export async function getOffersDueForCollection(): Promise<Offer[]> {
  const now = new Date();
  const activeOffers = await prisma.offer.findMany({
    where: { isActive: true },
  });

  const dueOffers: Offer[] = [];

  for (const offer of activeOffers) {
    try {
      const localHour = getLocalHour(now, offer.timezone);

      if (!SNAPSHOT_HOURS.includes(localHour)) {
        continue;
      }

      const hasRecent = await hasRecentSnapshot(offer.id);
      if (hasRecent) {
        log.debug(
          { offerId: offer.id, localHour },
          "Skipping: recent snapshot exists"
        );
        continue;
      }

      dueOffers.push(offer);
      log.info(
        { offerId: offer.id, localHour, timezone: offer.timezone },
        "Offer is due for collection"
      );
    } catch (error) {
      log.error(
        { offerId: offer.id, error },
        "Error checking offer schedule"
      );
    }
  }

  return dueOffers;
}
