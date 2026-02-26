"use client";

import { useState, useMemo } from "react";
import { DashboardFilters } from "./dashboard-filters";
import { OffersTable } from "./offers-table";
import { TrendChart } from "./trend-chart";

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

interface SnapshotWithOffer {
    id: string;
    capturedAtUTC: Date | string;
    activeCount: number;
    totalCount: number;
    country: string;
    offer: { name: string };
}

interface DashboardClientProps {
    offers: OfferRow[];
    recentSnapshots: SnapshotWithOffer[];
}

export function DashboardClient({
    offers,
    recentSnapshots,
}: DashboardClientProps) {
    const [search, setSearch] = useState("");
    const [territory, setTerritory] = useState<string | null>(null);
    const [period, setPeriod] = useState(7);

    const territories = useMemo(() => {
        const set = new Set(offers.map((o) => o.territoryType));
        return Array.from(set).sort();
    }, [offers]);

    const filteredOffers = useMemo(() => {
        return offers.filter((offer) => {
            const matchesSearch =
                search === "" ||
                offer.name.toLowerCase().includes(search.toLowerCase()) ||
                offer.searchTerm.toLowerCase().includes(search.toLowerCase());

            const matchesTerritory =
                territory === null || offer.territoryType === territory;

            return matchesSearch && matchesTerritory;
        });
    }, [offers, search, territory]);

    const filteredSnapshots = useMemo(() => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - period);

        return recentSnapshots.filter((snap) => {
            const snapDate = new Date(snap.capturedAtUTC);
            return snapDate >= cutoff;
        });
    }, [recentSnapshots, period]);

    return (
        <div className="space-y-5">
            <DashboardFilters
                territories={territories}
                onSearchChange={setSearch}
                onTerritoryChange={setTerritory}
                onPeriodChange={setPeriod}
                activePeriod={period}
                activeTerritory={territory}
            />

            <div className="card p-5">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                    <span className="text-gray-900">Ofertas Monitoradas</span>
                    <span className="badge badge-neutral">{filteredOffers.length}</span>
                </h2>
                {filteredOffers.length > 0 ? (
                    <OffersTable offers={filteredOffers} />
                ) : (
                    <p className="text-gray-400 text-sm text-center py-6">
                        {search || territory
                            ? "Nenhuma oferta encontrada com esses filtros."
                            : "Nenhuma oferta cadastrada."}
                    </p>
                )}
            </div>

            {filteredSnapshots.length > 0 && (
                <div className="card p-5">
                    <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                        <span className="text-gray-900">Tendência</span>
                        <span className="badge badge-neutral">{period}d</span>
                    </h2>
                    <TrendChart snapshots={filteredSnapshots} />
                </div>
            )}
        </div>
    );
}
