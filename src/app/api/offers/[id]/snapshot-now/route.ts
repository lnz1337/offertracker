import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collectSnapshotsForOffer } from "@/services/snapshot-service";
import { MetaAdLibraryCollector } from "@/services/meta-ad-library";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offer = await prisma.offer.findUnique({ where: { id } });

    if (!offer) {
      return NextResponse.json(
        { data: null, error: "Offer not found" },
        { status: 404 }
      );
    }

    const collector = new MetaAdLibraryCollector();
    const results = await collectSnapshotsForOffer(offer, collector);

    return NextResponse.json({ data: results, error: null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to collect snapshot";
    return NextResponse.json(
      { data: null, error: message },
      { status: 500 }
    );
  }
}
