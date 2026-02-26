"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { COUNTRY_NAMES } from "@/lib/constants";

interface Snapshot {
  id: string;
  country: string;
  capturedAtUTC: Date | string;
  activeCount: number;
  totalCount: number;
  errorMessage: string | null;
}

interface OfferData {
  id: string;
  name: string;
  searchTerm: string;
  originalUrl: string;
  territoryType: string;
  countries: string[];
  timezone: string;
  createdAt: Date | string;
  history: Snapshot[];
}

export function OfferDetail({ offer }: { offer: OfferData }) {
  const chartData = offer.history
    .filter((s) => !s.errorMessage)
    .map((s) => ({
      date: format(new Date(s.capturedAtUTC), "dd/MM HH:mm", {
        locale: ptBR,
      }),
      [`${s.country} Ativos`]: s.activeCount,
      [`${s.country} Total`]: s.totalCount,
    }));

  // Merge data points with the same date
  const merged = new Map<string, Record<string, string | number>>();
  for (const point of chartData) {
    const existing = merged.get(point.date) ?? { date: point.date };
    merged.set(point.date, { ...existing, ...point });
  }
  const data = Array.from(merged.values());

  const seriesKeys = new Set<string>();
  for (const point of data) {
    for (const key of Object.keys(point)) {
      if (key !== "date") seriesKeys.add(key);
    }
  }

  const colors = [
    "#2563eb",
    "#dc2626",
    "#16a34a",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-2">{offer.name}</h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Termo de busca</dt>
          <dd className="font-mono">{offer.searchTerm}</dd>
          <dt className="text-gray-500">Território</dt>
          <dd>{offer.territoryType}</dd>
          <dt className="text-gray-500">Países</dt>
          <dd>
            {offer.countries
              .map((c) => COUNTRY_NAMES[c] ?? c)
              .join(", ")}
          </dd>
          <dt className="text-gray-500">Timezone</dt>
          <dd>{offer.timezone}</dd>
          <dt className="text-gray-500">Criado em</dt>
          <dd>
            {format(new Date(offer.createdAt), "dd/MM/yyyy HH:mm", {
              locale: ptBR,
            })}
          </dd>
        </dl>
      </div>

      {data.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">
            Histórico - Últimos 7 dias
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              {Array.from(seriesKeys).map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-400">
            Nenhum snapshot disponível ainda.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Histórico de Snapshots</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 px-3 font-medium text-gray-500">Data</th>
                <th className="py-2 px-3 font-medium text-gray-500">País</th>
                <th className="py-2 px-3 font-medium text-gray-500 text-right">
                  Ativos
                </th>
                <th className="py-2 px-3 font-medium text-gray-500 text-right">
                  Total
                </th>
                <th className="py-2 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {offer.history.map((snap) => (
                <tr
                  key={snap.id}
                  className="border-b border-gray-100"
                >
                  <td className="py-2 px-3 text-xs">
                    {format(
                      new Date(snap.capturedAtUTC),
                      "dd/MM/yyyy HH:mm",
                      { locale: ptBR }
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                      {snap.country}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {snap.activeCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {snap.totalCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 px-3">
                    {snap.errorMessage ? (
                      <span className="text-xs text-red-600">
                        Erro: {snap.errorMessage}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
