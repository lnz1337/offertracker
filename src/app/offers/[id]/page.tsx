import { prisma } from "@/lib/prisma";
import { getSnapshotHistory } from "@/services/snapshot-service";
import { OfferDetail } from "@/components/offer-detail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const offer = await prisma.offer.findUnique({ where: { id } });
  if (!offer) {
    notFound();
  }

  const history = await getSnapshotHistory(id, 7);

  return (
    <div>
      <a
        href="/"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Voltar ao Dashboard
      </a>
      <OfferDetail
        offer={{
          ...offer,
          isActive: offer.isActive,
          history,
        }}
      />
    </div>
  );
}
