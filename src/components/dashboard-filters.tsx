"use client";

import { useState } from "react";

interface DashboardFiltersProps {
    territories: string[];
    onSearchChange: (term: string) => void;
    onTerritoryChange: (territory: string | null) => void;
    onPeriodChange: (days: number) => void;
    activePeriod: number;
    activeTerritory: string | null;
}

export function DashboardFilters({
    territories,
    onSearchChange,
    onTerritoryChange,
    onPeriodChange,
    activePeriod,
    activeTerritory,
}: DashboardFiltersProps) {
    const [searchValue, setSearchValue] = useState("");

    const periods = [
        { label: "7d", value: 7 },
        { label: "14d", value: 14 },
        { label: "30d", value: 30 },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    🔍
                </span>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        onSearchChange(e.target.value);
                    }}
                    placeholder="Buscar oferta..."
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
            </div>

            {/* Territory filter */}
            <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1">
                <button
                    onClick={() => onTerritoryChange(null)}
                    className={`chip ${activeTerritory === null ? "chip-active" : "chip-inactive"
                        }`}
                >
                    Todos
                </button>
                {territories.map((t) => (
                    <button
                        key={t}
                        onClick={() => onTerritoryChange(t)}
                        className={`chip ${activeTerritory === t ? "chip-active" : "chip-inactive"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Period filter */}
            <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1">
                {periods.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => onPeriodChange(p.value)}
                        className={`chip ${activePeriod === p.value ? "chip-active" : "chip-inactive"
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
