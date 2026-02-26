import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getLatestSnapshots, getSnapshotHistory } from "@/services/snapshot-service";

const updateOfferSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  timezone: z.string().optional(),
  isActive: z.boolean().optional(),
  countries: z.array(z.string().length(2)).optional(),
});

export async function GET(
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

    const latestSnapshots = await getLatestSnapshots(id);
    const history = await getSnapshotHistory(id);

    return NextResponse.json({
      data: { ...offer, latestSnapshots, history },
      error: null,
    });
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to fetch offer" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateOfferSchema.parse(body);

    const offer = await prisma.offer.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ data: offer, error: null });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { data: null, error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data: null, error: "Failed to update offer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.offer.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ data: { id }, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to delete offer" },
      { status: 500 }
    );
  }
}
