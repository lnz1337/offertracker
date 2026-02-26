"use client";

import { COUNTRY_NAMES } from "@/lib/constants";
import { CollectNowButton, DeleteOfferButton } from "./offer-actions";

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
    return <span className="text-gray-300 text-xs">—</span>;
  }
  const diff = current - previous;
  if (diff === 0) {
    return <span className="badge badge-neutral">0</span>;
  }
  const isPositive = diff > 0;
  return (
    <span
      className={`badge ${isPositive ? "badge-danger" : "badge-success"}`}
    >
      {isPositive ? "↑" : "↓"} {Math.abs(diff)}
    </span>
  );
}

export function OffersTable({ offers }: { offers: OfferRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200/60">
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Oferta
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              País
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Ativos
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Var.
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.flatMap((offer) =>
            offer.latestSnapshots.length > 0 ? (
              offer.latestSnapshots.map((snapshot, idx) => (
                <tr
                  key={`${offer.id}-${snapshot.country}`}
                  className="table-row border-b border-gray-100/60"
                >
                  {idx === 0 ? (
                    <td
                      className="py-3 px-4"
                      rowSpan={offer.latestSnapshots.length}
                    >
                      <div className="font-semibold text-gray-900">{offer.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        {offer.searchTerm}
                      </div>
                    </td>
                  ) : null}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="badge badge-neutral font-mono">
                        {snapshot.country}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        {COUNTRY_NAMES[snapshot.country] ?? snapshot.country}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">
                    {snapshot.activeCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-500">
                    {snapshot.totalCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <VariationBadge
                      current={snapshot.activeCount}
                      previous={snapshot.previousActiveCount}
                    />
                  </td>
                  {idx === 0 ? (
                    <td
                      className="py-3 px-4"
                      rowSpan={offer.latestSnapshots.length}
                    >
                      <div className="flex flex-col gap-2">
                        <a
                          href={`/offers/${offer.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                        >
                          Detalhes →
                        </a>
                        <CollectNowButton offerId={offer.id} />
                        <DeleteOfferButton offerId={offer.id} />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr
                key={offer.id}
                className="table-row border-b border-gray-100/60"
              >
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">{offer.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">
                    {offer.searchTerm}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs" colSpan={4}>
                  <span className="badge badge-warning">Aguardando snapshot...</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-2">
                    <a
                      href={`/offers/${offer.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                    >
                      Detalhes →
                    </a>
                    <CollectNowButton offerId={offer.id} />
                    <DeleteOfferButton offerId={offer.id} />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
