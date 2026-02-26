import { NextRequest, NextResponse } from "next/server";
import { getSnapshotHistory } from "@/services/snapshot-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") ?? "7", 10);
    const country = searchParams.get("country") ?? undefined;

    const snapshots = await getSnapshotHistory(id, days, country);

    return NextResponse.json({ data: snapshots, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to fetch snapshots" },
      { status: 500 }
    );
  }
}
