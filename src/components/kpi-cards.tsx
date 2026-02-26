"use client";

interface KpiData {
    totalOffers: number;
    totalSnapshots: number;
    lastCollectedAt: string | null;
    offersWithErrors: number;
}

const kpiConfig = [
    {
        key: "totalOffers",
        label: "Ofertas Ativas",
        icon: "📊",
        gradient: "from-blue-500 to-blue-600",
        textColor: "text-blue-600",
    },
    {
        key: "totalSnapshots",
        label: "Snapshots",
        icon: "📸",
        gradient: "from-emerald-500 to-emerald-600",
        textColor: "text-emerald-600",
    },
    {
        key: "lastCollectedAt",
        label: "Última Coleta",
        icon: "🕐",
        gradient: "from-violet-500 to-violet-600",
        textColor: "text-violet-600",
    },
    {
        key: "offersWithErrors",
        label: "Com Erros",
        icon: "⚠️",
        gradient: "from-rose-500 to-rose-600",
        textColor: "text-rose-500",
    },
];

export function KpiCards({ data }: { data: KpiData }) {
    const values: Record<string, string | number> = {
        totalOffers: data.totalOffers,
        totalSnapshots: data.totalSnapshots.toLocaleString("pt-BR"),
        lastCollectedAt: data.lastCollectedAt ?? "Nunca",
        offersWithErrors: data.offersWithErrors,
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiConfig.map((kpi, index) => (
                <div
                    key={kpi.key}
                    className="card card-interactive p-4 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-center gap-2.5 mb-3">
                        <span
                            className={`w-9 h-9 bg-gradient-to-br ${kpi.gradient} rounded-lg flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform`}
                        >
                            {kpi.icon}
                        </span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {kpi.label}
                        </span>
                    </div>
                    <div
                        className={`text-2xl font-bold ${kpi.key === "lastCollectedAt" ? "text-base" : ""
                            } ${kpi.key === "offersWithErrors" && data.offersWithErrors > 0
                                ? "text-rose-500"
                                : kpi.textColor
                            }`}
                    >
                        {values[kpi.key]}
                    </div>
                </div>
            ))}
        </div>
    );
}
