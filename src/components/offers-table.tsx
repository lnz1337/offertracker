"use client";

import { COUNTRY_NAMES } from "@/lib/constants";

interface SnapshotRow {
  country: string;
  activeCount: number;
  totalCount: number;
  previousActiveCount: number | null;
  previousTotalCount: number | null;
  capturedAtUTC: Date;
}

interface OfferRow {
  id: string;
  name: string;
  searchTerm: string;
  territoryType: string;
  latestSnapshots: SnapshotRow[];
}

function VariationBadge({
  current,
  previous,
}: {
  current: number;
  previous: number | null;
}) {
  if (previous === null) {
    return <span className="text-gray-400 text-xs">--</span>;
  }
  const diff = current - previous;
  if (diff === 0) {
    return <span className="text-gray-400 text-xs">0</span>;
  }
  const isPositive = diff > 0;
  return (
    <span
      className={`text-xs font-medium ${
        isPositive ? "text-red-600" : "text-green-600"
      }`}
    >
      {isPositive ? "+" : ""}
      {diff}
    </span>
  );
}

export function OffersTable({ offers }: { offers: OfferRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-2 px-3 font-medium text-gray-500">Oferta</th>
            <th className="py-2 px-3 font-medium text-gray-500">País</th>
            <th className="py-2 px-3 font-medium text-gray-500 text-right">
              Ativos
            </th>
            <th className="py-2 px-3 font-medium text-gray-500 text-right">
              Total
            </th>
            <th className="py-2 px-3 font-medium text-gray-500 text-right">
              Var. 12h
            </th>
            <th className="py-2 px-3 font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody>
          {offers.flatMap((offer) =>
            offer.latestSnapshots.length > 0 ? (
              offer.latestSnapshots.map((snapshot, idx) => (
                <tr
                  key={`${offer.id}-${snapshot.country}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {idx === 0 ? (
                    <td
                      className="py-2 px-3 font-medium"
                      rowSpan={offer.latestSnapshots.length}
                    >
                      <div>{offer.name}</div>
                      <div className="text-xs text-gray-400 font-normal">
                        {offer.searchTerm}
                      </div>
                    </td>
                  ) : null}
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {snapshot.country}
                      </span>
                      <span className="text-xs text-gray-400">
                        {COUNTRY_NAMES[snapshot.country] ?? snapshot.country}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {snapshot.activeCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {snapshot.totalCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <VariationBadge
                      current={snapshot.activeCount}
                      previous={snapshot.previousActiveCount}
                    />
                  </td>
                  {idx === 0 ? (
                    <td
                      className="py-2 px-3"
                      rowSpan={offer.latestSnapshots.length}
                    >
                      <a
                        href={`/offers/${offer.id}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Detalhes
                      </a>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr
                key={offer.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-3 font-medium">
                  <div>{offer.name}</div>
                  <div className="text-xs text-gray-400 font-normal">
                    {offer.searchTerm}
                  </div>
                </td>
                <td className="py-2 px-3 text-gray-400 text-xs" colSpan={4}>
                  Aguardando primeiro snapshot...
                </td>
                <td className="py-2 px-3">
                  <a
                    href={`/offers/${offer.id}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Detalhes
                  </a>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
