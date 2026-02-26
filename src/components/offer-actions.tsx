"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CollectNowButton({ offerId }: { offerId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const handleCollect = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/offers/${offerId}/snapshot-now`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setResult(`Erro: ${data.error}`);
        return;
      }

      const successCount =
        data.data?.filter(
          (r: { errorMessage: string | null }) => !r.errorMessage
        ).length ?? 0;
      const errorCount =
        data.data?.filter(
          (r: { errorMessage: string | null }) => r.errorMessage
        ).length ?? 0;

      setResult(
        `✓ ${successCount} coletado(s)${errorCount > 0 ? `, ${errorCount} erro(s)` : ""}`
      );
      router.refresh();
    } catch {
      setResult("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleCollect}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 disabled:opacity-50 transition-all cursor-pointer"
      >
        <span className={loading ? "animate-spin" : ""}>⚡</span>
        {loading ? "Coletando..." : "Coletar"}
      </button>
      {result && (
        <span
          className={`text-xs animate-fade-in ${result.startsWith("✓") ? "text-emerald-600" : "text-rose-600"
            }`}
        >
          {result}
        </span>
      )}
    </div>
  );
}

export function DeleteOfferButton({ offerId }: { offerId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="inline-flex items-center gap-2 animate-fade-in">
        <span className="text-xs text-rose-600 font-medium">Tem certeza?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-all cursor-pointer font-medium"
        >
          {loading ? "..." : "Sim"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
    >
      Excluir
    </button>
  );
}

export function ToggleActiveButton({
  offerId,
  isActive,
}: {
  offerId: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 ${isActive
          ? "bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-100"
          : "bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-100"
        }`}
    >
      {loading ? "..." : isActive ? "⏸ Pausar" : "▶ Ativar"}
    </button>
  );
}
