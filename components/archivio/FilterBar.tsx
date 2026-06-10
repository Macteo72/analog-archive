"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { RullinoFilters } from "@/lib/queries/rullini";

interface FilterBarProps {
  pellicole: string[];
  fotocamere: string[];
  current: RullinoFilters;
}

export function FilterBar({ pellicole, fotocamere, current }: FilterBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(current.q ?? "");

  const buildUrl = useCallback(
    (overrides: Partial<RullinoFilters>) => {
      const merged = { ...current, ...overrides };
      const params = new URLSearchParams();
      Object.entries(merged).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const qs = params.toString();
      return qs ? `/?${qs}` : "/";
    },
    [current]
  );

  const push = useCallback(
    (overrides: Partial<RullinoFilters>) => {
      startTransition(() => router.push(buildUrl(overrides)));
    },
    [router, buildUrl]
  );

  useEffect(() => {
    setSearchValue(current.q ?? "");
  }, [current.q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchValue !== (current.q ?? "")) {
        push({ q: searchValue });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetFilters = () => {
    setSearchValue("");
    startTransition(() => router.push("/"));
  };

  const hasActiveFilters =
    current.q || current.formato || current.pellicola || current.fotocamera || current.dataFrom || current.dataTo;

  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      {/* Ricerca testuale */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cerca in scene, note, descrizioni…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Cancella ricerca"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Formato */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
          {(["", "135", "120"] as const).map((f) => (
            <button
              key={f || "tutti"}
              onClick={() => push({ formato: f })}
              className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                (current.formato ?? "") === f
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {f === "" ? "Tutti" : `${f}mm`}
            </button>
          ))}
        </div>

        {/* Pellicola */}
        {pellicole.length > 0 && (
          <select
            value={current.pellicola ?? ""}
            onChange={(e) => push({ pellicola: e.target.value })}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-gray-400"
          >
            <option value="">Tutte le pellicole</option>
            {pellicole.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}

        {/* Fotocamera */}
        {fotocamere.length > 0 && (
          <select
            value={current.fotocamera ?? ""}
            onChange={(e) => push({ fotocamera: e.target.value })}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-gray-400"
          >
            <option value="">Tutte le fotocamere</option>
            {fotocamere.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Date */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={current.dataFrom ?? ""}
            onChange={(e) => push({ dataFrom: e.target.value })}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-gray-400"
            title="Data da"
          />
          <span className="text-gray-400 dark:text-gray-500 text-sm">→</span>
          <input
            type="date"
            value={current.dataTo ?? ""}
            onChange={(e) => push({ dataTo: e.target.value })}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-gray-400"
            title="Data a"
          />
        </div>

        {/* Ordinamento */}
        <select
          value={current.sort ?? "data_desc"}
          onChange={(e) => push({ sort: e.target.value })}
          className="ml-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-gray-400"
        >
          <option value="data_desc">Data ↓</option>
          <option value="data_asc">Data ↑</option>
          <option value="codice">Codice A→Z</option>
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Azzera filtri
          </button>
        )}
      </div>
    </div>
  );
}
