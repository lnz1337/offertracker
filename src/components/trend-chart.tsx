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

interface SnapshotWithOffer {
  id: string;
  capturedAtUTC: Date | string;
  activeCount: number;
  totalCount: number;
  country: string;
  offer: { name: string };
}

interface ChartPoint {
  date: string;
  dateLabel: string;
  [key: string]: string | number;
}

export function TrendChart({
  snapshots,
}: {
  snapshots: SnapshotWithOffer[];
}) {
  if (snapshots.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        Sem dados para exibir
      </p>
    );
  }

  // Group snapshots by date (day) and aggregate
  const byDate = new Map<string, ChartPoint>();

  for (const snap of snapshots) {
    const d = new Date(snap.capturedAtUTC);
    const dateKey = format(d, "yyyy-MM-dd");
    const dateLabel = format(d, "dd/MM", { locale: ptBR });

    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, { date: dateKey, dateLabel } as ChartPoint);
    }

    const point = byDate.get(dateKey)!;
    const key = `${snap.offer.name} (${snap.country})`;
    const existing = (point[key] as number) ?? 0;
    // Use the latest (highest) activeCount for the day
    point[key] = Math.max(existing, snap.activeCount);
  }

  const data = Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Collect unique series names
  const seriesNames = new Set<string>();
  for (const point of data) {
    for (const key of Object.keys(point)) {
      if (key !== "date" && key !== "dateLabel") {
        seriesNames.add(key);
      }
    }
  }

  const colors = [
    "#2563eb",
    "#dc2626",
    "#16a34a",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
    "#e11d48",
    "#65a30d",
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="dateLabel" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend fontSize={12} />
        {Array.from(seriesNames).map((name, i) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
