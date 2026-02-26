import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseAdLibraryUrl } from "@/lib/url-parser";
import { MAX_OFFERS, TERRITORY_COUNTRIES, TERRITORY_TIMEZONES } from "@/lib/constants";
import { getLatestSnapshots } from "@/services/snapshot-service";
import type { TerritoryType } from "@prisma/client";

const createOfferSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  territoryType: z.enum(["BR", "USA", "LATAM"]),
  countries: z.array(z.string().length(2)).optional(),
  timezone: z.string().optional(),
});

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const offersWithSnapshots = await Promise.all(
      offers.map(async (offer) => ({
        ...offer,
        latestSnapshots: await getLatestSnapshots(offer.id),
      }))
    );

    return NextResponse.json({ data: offersWithSnapshots, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOfferSchema.parse(body);

    // Check offer limit
    const activeCount = await prisma.offer.count({
      where: { isActive: true },
    });
    if (activeCount >= MAX_OFFERS) {
      return NextResponse.json(
        { data: null, error: `Maximum of ${MAX_OFFERS} active offers reached` },
        { status: 400 }
      );
    }

    // Parse the Ad Library URL
    const parsed = parseAdLibraryUrl(validated.url);

    // Determine countries based on territory
    const countries =
      validated.countries ??
      TERRITORY_COUNTRIES[validated.territoryType] ??
      [parsed.country];

    const timezone =
      validated.timezone ??
      TERRITORY_TIMEZONES[validated.territoryType] ??
      "America/Sao_Paulo";

    const offer = await prisma.offer.create({
      data: {
        name: validated.name,
        originalUrl: validated.url,
        searchTerm: parsed.searchTerm,
        territoryType: validated.territoryType as TerritoryType,
        countries,
        timezone,
      },
    });

    return NextResponse.json({ data: offer, error: null }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { data: null, error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    const message =
      error instanceof Error ? error.message : "Failed to create offer";
    return NextResponse.json(
      { data: null, error: message },
      { status: 500 }
    );
  }
}
