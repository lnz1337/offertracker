import { prisma } from "@/lib/prisma";
import { getLatestSnapshots } from "@/services/snapshot-service";
import { KpiCards } from "@/components/kpi-cards";
import { DashboardClient } from "@/components/dashboard-client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getDashboardData() {
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

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const recentSnapshots = await prisma.snapshot.findMany({
    where: {
      capturedAtUTC: { gte: since },
      errorMessage: null,
      offer: { isActive: true },
    },
    orderBy: { capturedAtUTC: "asc" },
    include: { offer: { select: { name: true } } },
  });

  const totalSnapshots = await prisma.snapshot.count({
    where: { errorMessage: null },
  });

  const lastSnapshot = await prisma.snapshot.findFirst({
    where: { errorMessage: null },
    orderBy: { capturedAtUTC: "desc" },
  });

  const offersWithRecentErrors = await prisma.snapshot.groupBy({
    by: ["offerId"],
    where: {
      errorMessage: { not: null },
      capturedAtUTC: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  const lastCollectedAt = lastSnapshot
    ? format(lastSnapshot.capturedAtUTC, "dd/MM HH:mm", { locale: ptBR })
    : null;

  return {
    offers: offersWithSnapshots,
    recentSnapshots,
    kpi: {
      totalOffers: offers.length,
      totalSnapshots,
      lastCollectedAt,
      offersWithErrors: offersWithRecentErrors.length,
    },
  };
}

export default async function DashboardPage() {
  const { offers, recentSnapshots, kpi } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitoramento de ofertas via Facebook Ad Library
        </p>
      </div>

      <KpiCards data={kpi} />

      {offers.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-500 font-medium">Nenhuma oferta cadastrada.</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            Comece adicionando sua primeira oferta para monitorar
          </p>
          <a
            href="/offers/new"
            className="btn-primary inline-block"
          >
            + Adicionar Oferta
          </a>
        </div>
      ) : (
        <DashboardClient
          offers={offers}
          recentSnapshots={recentSnapshots}
        />
      )}
    </div>
  );
}
