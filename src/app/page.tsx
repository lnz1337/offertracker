import { prisma } from "@/lib/prisma";
import { getLatestSnapshots } from "@/services/snapshot-service";
import { OffersTable } from "@/components/offers-table";
import { TrendChart } from "@/components/trend-chart";

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

  // Get chart data: snapshots from last 7 days for all offers
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const recentSnapshots = await prisma.snapshot.findMany({
    where: {
      capturedAtUTC: { gte: since },
      errorMessage: null,
      offer: { isActive: true },
    },
    orderBy: { capturedAtUTC: "asc" },
    include: { offer: { select: { name: true } } },
  });

  return { offers: offersWithSnapshots, recentSnapshots };
}

export default async function DashboardPage() {
  const { offers, recentSnapshots } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitoramento de ofertas via Facebook Ad Library
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Nenhuma oferta cadastrada.</p>
          <a
            href="/offers/new"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Adicionar Oferta
          </a>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">
              Ofertas Monitoradas ({offers.length})
            </h2>
            <OffersTable offers={offers} />
          </div>

          {recentSnapshots.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">
                Tendência - Últimos 7 dias
              </h2>
              <TrendChart snapshots={recentSnapshots} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
