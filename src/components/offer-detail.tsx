"use client";

import { useState, useMemo } from "react";
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
import {
  CollectNowButton,
  DeleteOfferButton,
  ToggleActiveButton,
} from "./offer-actions";

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
  isActive: boolean;
  createdAt: Date | string;
  history: Snapshot[];
}

export function OfferDetail({ offer }: { offer: OfferData }) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filteredHistory = useMemo(() => {
    if (!selectedCountry) return offer.history;
    return offer.history.filter((s) => s.country === selectedCountry);
  }, [offer.history, selectedCountry]);

  const chartData = filteredHistory
    .filter((s) => !s.errorMessage)
    .map((s) => ({
      date: format(new Date(s.capturedAtUTC), "dd/MM HH:mm", {
        locale: ptBR,
      }),
      [`${s.country} Ativos`]: s.activeCount,
      [`${s.country} Total`]: s.totalCount,
    }));

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
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{offer.name}</h2>
            <span
              className={`inline-block mt-1.5 badge ${offer.isActive ? "badge-success" : "badge-neutral"
                }`}
            >
              {offer.isActive ? "● Ativa" : "○ Pausada"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CollectNowButton offerId={offer.id} />
            <ToggleActiveButton offerId={offer.id} isActive={offer.isActive} />
            <DeleteOfferButton offerId={offer.id} />
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Termo de busca</dt>
            <dd className="font-mono text-gray-900">{offer.searchTerm}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Território</dt>
            <dd><span className="badge badge-neutral">{offer.territoryType}</span></dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Países</dt>
            <dd className="flex gap-1 flex-wrap">
              {offer.countries.map((c) => (
                <span key={c} className="badge badge-neutral">{COUNTRY_NAMES[c] ?? c}</span>
              ))}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Timezone</dt>
            <dd className="text-gray-600">{offer.timezone}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">URL original</dt>
            <dd>
              <a
                href={offer.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
              >
                Abrir na Ad Library ↗
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Criado em</dt>
            <dd className="text-gray-600">
              {format(new Date(offer.createdAt), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            </dd>
          </div>
        </dl>
      </div>

      {/* Country filter */}
      {offer.countries.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">País:</span>
          <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1">
            <button
              onClick={() => setSelectedCountry(null)}
              className={`chip ${selectedCountry === null ? "chip-active" : "chip-inactive"
                }`}
            >
              Todos
            </button>
            {offer.countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`chip ${selectedCountry === c ? "chip-active" : "chip-inactive"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      {data.length > 0 ? (
        <div className="card p-5">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <span className="text-gray-900">Histórico</span>
            {selectedCountry && (
              <span className="badge badge-neutral">
                {COUNTRY_NAMES[selectedCountry] ?? selectedCountry}
              </span>
            )}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" fontSize={11} tick={{ fill: "#94a3b8" }} />
              <YAxis fontSize={12} tick={{ fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
              />
              <Legend />
              {Array.from(seriesKeys).map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: colors[i % colors.length] }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">📸</div>
          <p className="text-gray-500 font-medium">
            Nenhum snapshot disponível ainda.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Clique em &quot;⚡ Coletar&quot; acima para coletar o primeiro snapshot.
          </p>
        </div>
      )}

      {/* Snapshot table */}
      <div className="card p-5">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <span className="text-gray-900">Snapshots</span>
          <span className="badge badge-neutral">{filteredHistory.length}</span>
        </h3>
        {filteredHistory.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            Nenhum snapshot registrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/60">
                  <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">País</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Ativos</th>
                  <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((snap) => (
                  <tr
                    key={snap.id}
                    className="table-row border-b border-gray-100/60"
                  >
                    <td className="py-2.5 px-3 text-xs text-gray-600">
                      {format(
                        new Date(snap.capturedAtUTC),
                        "dd/MM/yyyy HH:mm",
                        { locale: ptBR }
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="badge badge-neutral font-mono">
                        {snap.country}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-gray-900">
                      {snap.activeCount.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-500">
                      {snap.totalCount.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2.5 px-3">
                      {snap.errorMessage ? (
                        <span className="badge badge-danger">Erro</span>
                      ) : (
                        <span className="badge badge-success">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
