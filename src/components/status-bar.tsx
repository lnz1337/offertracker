"use client";

import { useEffect, useState } from "react";

interface HealthStatus {
    status: "ok" | "expired" | "error" | "loading";
    message: string;
}

export function TokenStatus() {
    const [health, setHealth] = useState<HealthStatus>({
        status: "loading",
        message: "Verificando...",
    });

    useEffect(() => {
        fetch("/api/health")
            .then((res) => res.json())
            .then((data) => setHealth(data))
            .catch(() =>
                setHealth({ status: "error", message: "Falha ao verificar" })
            );
    }, []);

    if (health.status === "loading" || health.status === "ok") {
        return null;
    }

    const isExpired = health.status === "expired";

    return (
        <div
            className={`animate-slide-down rounded-xl px-4 py-3 text-sm flex items-center gap-3 ${isExpired
                    ? "bg-red-50 border border-red-200/60 text-red-800"
                    : "bg-amber-50 border border-amber-200/60 text-amber-800"
                }`}
        >
            <span className="text-lg">{isExpired ? "🔴" : "⚠️"}</span>
            <div>
                <span className="font-semibold">{isExpired ? "Token expirado" : "Atenção"}</span>
                <span className="mx-1">—</span>
                <span>{health.message}</span>
            </div>
        </div>
    );
}

export function LogoutButton() {
    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        window.location.href = "/login";
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
        >
            Sair
        </button>
    );
}
