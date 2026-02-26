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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL da Ad Library
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://www.facebook.com/ads/library/?..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {parsed && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs space-y-1">
            <p>
              <span className="font-medium">Termo de busca:</span>{" "}
              {parsed.searchTerm}
            </p>
            <p>
              <span className="font-medium">País detectado:</span>{" "}
              {parsed.country}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Oferta
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Viva Melhor com Saúde"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Território
        </label>
        <div className="flex gap-2">
          {(["BR", "USA", "LATAM"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTerritoryChange(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                territoryType === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {territoryType === "LATAM" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Países
          </label>
          <div className="flex flex-wrap gap-2">
            {(TERRITORY_COUNTRIES["LATAM"] ?? []).map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => toggleCountry(country)}
                className={`px-2 py-1 rounded text-xs ${
                  selectedCountries.includes(country)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {country} - {COUNTRY_NAMES[country] ?? country}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Criando..." : "Criar Oferta"}
      </button>
    </form>
  );
}
