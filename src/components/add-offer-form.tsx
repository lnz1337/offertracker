"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TERRITORY_COUNTRIES,
  TERRITORY_TIMEZONES,
  COUNTRY_NAMES,
} from "@/lib/constants";

interface ParsedFields {
  searchTerm: string;
  country: string;
}

export function AddOfferForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [territoryType, setTerritoryType] = useState<"BR" | "USA" | "LATAM">(
    "BR"
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [parsed, setParsed] = useState<ParsedFields | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parseUrl = useCallback((rawUrl: string) => {
    try {
      const u = new URL(rawUrl);
      const searchTerm = u.searchParams.get("q") ?? "";
      const country = u.searchParams.get("country") ?? "";
      if (searchTerm) {
        setParsed({ searchTerm, country });
        setError(null);
      }
    } catch {
      setParsed(null);
    }
  }, []);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.includes("facebook.com")) {
      parseUrl(value);
    }
  };

  const handleTerritoryChange = (value: "BR" | "USA" | "LATAM") => {
    setTerritoryType(value);
    setTimezone(TERRITORY_TIMEZONES[value] ?? "America/Sao_Paulo");
    if (value !== "LATAM") {
      setSelectedCountries(TERRITORY_COUNTRIES[value] ?? []);
    } else {
      setSelectedCountries([]);
    }
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const countries =
      territoryType === "LATAM"
        ? selectedCountries
        : TERRITORY_COUNTRIES[territoryType];

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url,
          territoryType,
          countries,
          timezone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar oferta");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          URL da Ad Library
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://www.facebook.com/ads/library/?..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          required
        />
        {parsed && (
          <div className="mt-2 p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs space-y-1 animate-fade-in">
            <p>
              <span className="font-semibold text-blue-700">Termo:</span>{" "}
              <span className="text-blue-600">{parsed.searchTerm}</span>
            </p>
            <p>
              <span className="font-semibold text-blue-700">País:</span>{" "}
              <span className="text-blue-600">{parsed.country}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nome da Oferta
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Viva Melhor com Saúde"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Território
        </label>
        <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1 w-fit">
          {(["BR", "USA", "LATAM"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTerritoryChange(t)}
              className={`chip ${territoryType === t ? "chip-active" : "chip-inactive"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {territoryType === "LATAM" && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Países
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(TERRITORY_COUNTRIES["LATAM"] ?? []).map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => toggleCountry(country)}
                className={`chip ${selectedCountries.includes(country)
                    ? "chip-active"
                    : "chip-inactive"
                  }`}
              >
                {country} - {COUNTRY_NAMES[country] ?? country}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
        >
          <option value="America/Sao_Paulo">
            America/Sao_Paulo (BRT, UTC-3)
          </option>
          <option value="America/New_York">
            America/New_York (EST, UTC-5)
          </option>
          <option value="America/Chicago">
            America/Chicago (CST, UTC-6)
          </option>
          <option value="America/Los_Angeles">
            America/Los_Angeles (PST, UTC-8)
          </option>
          <option value="America/Mexico_City">
            America/Mexico_City (CST, UTC-6)
          </option>
          <option value="America/Bogota">
            America/Bogota (COT, UTC-5)
          </option>
          <option value="America/Buenos_Aires">
            America/Buenos_Aires (ART, UTC-3)
          </option>
          <option value="America/Santiago">
            America/Santiago (CLT, UTC-4)
          </option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-lg text-rose-700 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-2.5"
      >
        {loading ? "Criando..." : "Criar Oferta"}
      </button>
    </form>
  );
}
