"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RullinoCard } from "./RullinoCard";
import { formatDateFlex } from "@/lib/utils";
import type { Rullino } from "@prisma/client";

type RullinoItem = Rullino & { negativi: { id: number }[] };
type ViewMode = "card" | "list";

interface ArchivioViewProps {
  rullini: RullinoItem[];
}

export function ArchivioView({ rullini }: ArchivioViewProps) {
  const [view, setView] = useState<ViewMode>("card");

  useEffect(() => {
    const saved = localStorage.getItem("archivio-view") as ViewMode | null;
    if (saved === "card" || saved === "list") setView(saved);
  }, []);

  const switchView = (mode: ViewMode) => {
    setView(mode);
    localStorage.setItem("archivio-view", mode);
  };

  return (
    <div>
      <div className="mt-4 mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {rullini.length} {rullini.length === 1 ? "rullino" : "rullini"}
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            type="button"
            onClick={() => switchView("card")}
            aria-label="Vista card"
            className={`rounded-md p-1.5 transition ${
              view === "card"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => switchView("list")}
            aria-label="Vista elenco"
            className={`rounded-md p-1.5 transition ${
              view === "list"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {rullini.length === 0 ? (
        <div className="py-20 text-center text-gray-400 dark:text-gray-600">
          <p className="text-4xl mb-3">○</p>
          <p className="text-sm">Nessun rullino trovato</p>
        </div>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rullini.map((r) => (
            <RullinoCard key={r.id} rullino={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            <span className="w-28 shrink-0">Codice</span>
            <span className="w-14 shrink-0 hidden xs:block">Fmt</span>
            <span className="flex-1">Pellicola</span>
            <span className="hidden sm:block w-36 shrink-0">Fotocamera</span>
            <span className="hidden md:block w-32 shrink-0 text-right">Data scatti</span>
            <span className="w-4 shrink-0" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {rullini.map((r) => (
              <RullinoListItem key={r.id} rullino={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RullinoListItem({ rullino }: { rullino: RullinoItem }) {
  const data = formatDateFlex(rullino.dataScatti, rullino.dataScattiPrecisione, rullino.dataScattiFine);

  return (
    <Link
      href={`/rullino/${rullino.id}`}
      className="flex items-center gap-4 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <span className="font-mono text-sm font-bold w-28 shrink-0 text-gray-900 dark:text-white truncate">
        {rullino.codiceArchivio}
      </span>
      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0 hidden xs:inline-flex">
        {rullino.formato}mm
      </span>
      <span className="flex-1 min-w-0 text-sm text-gray-800 dark:text-gray-200 truncate">
        {rullino.pellicola || "—"}
        {rullino.sensibilita ? (
          <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">{rullino.sensibilita} ISO</span>
        ) : null}
      </span>
      <span className="hidden sm:block w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400 truncate">
        {rullino.fotocamera || "—"}
      </span>
      <span className="hidden md:block w-32 shrink-0 text-right text-sm text-gray-400 dark:text-gray-500">
        {data !== "—" ? data : ""}
      </span>
      <span className="text-gray-300 dark:text-gray-600 shrink-0">›</span>
    </Link>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="2" width="2" height="2" rx="0.5" />
      <rect x="5" y="2.5" width="10" height="1" rx="0.5" />
      <rect x="1" y="7" width="2" height="2" rx="0.5" />
      <rect x="5" y="7.5" width="10" height="1" rx="0.5" />
      <rect x="1" y="12" width="2" height="2" rx="0.5" />
      <rect x="5" y="12.5" width="10" height="1" rx="0.5" />
    </svg>
  );
}
