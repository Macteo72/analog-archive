import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { getAllStampe } from "@/lib/queries/stampe";
import { formatDate } from "@/lib/utils";

export default async function ArchivioStampePage() {
  const stampe = await getAllStampe();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Archivio Negativi</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/stampa/nuova"
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              + Nuova stampa
            </Link>
            <Link
              href="/rullino/nuovo"
              className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100"
            >
              + Nuovo rullino
            </Link>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Negativi
          </Link>
          <span className="relative px-4 py-2 text-sm font-medium text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white">
            Stampe
          </span>
        </div>

        {/* Count */}
        <p className="mb-4 text-sm text-gray-400 dark:text-gray-500">
          {stampe.length} {stampe.length === 1 ? "sessione di stampa" : "sessioni di stampa"}
        </p>

        {/* List */}
        {stampe.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-gray-600">
            <p className="mb-3 text-4xl">○</p>
            <p className="text-sm">Nessuna sessione di stampa</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Table header */}
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <span className="w-28 shrink-0">Data</span>
              <span className="flex-1">Carta fotografica</span>
              <span className="hidden sm:block w-32 shrink-0">Fotogramma</span>
              <span className="hidden md:block w-32 shrink-0">Rullino</span>
              <span className="w-4 shrink-0" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {stampe.map((s) => {
                const { negativo } = s;
                const { rullino } = negativo;
                const href = `/rullino/${rullino.id}/negativo/${negativo.id}/stampa/${s.id}`;

                return (
                  <Link
                    key={s.id}
                    href={href}
                    className="flex items-center gap-4 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="w-28 shrink-0 text-sm text-gray-700 dark:text-gray-300">
                      {s.dataStampa ? formatDate(s.dataStampa) : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </span>
                    <span className="flex-1 truncate text-sm text-gray-800 dark:text-gray-200">
                      {s.carta || <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </span>
                    <span className="hidden sm:block w-32 shrink-0 font-mono text-sm text-gray-500 dark:text-gray-400">
                      #{negativo.numeroFotogramma}
                      {negativo.scena ? (
                        <span className="ml-1.5 font-sans text-xs text-gray-400 dark:text-gray-500 truncate">
                          {negativo.scena}
                        </span>
                      ) : null}
                    </span>
                    <span className="hidden md:block w-32 shrink-0 font-mono text-sm font-bold text-gray-900 dark:text-white truncate">
                      {rullino.codiceArchivio}
                    </span>
                    <span className="shrink-0 text-gray-300 dark:text-gray-600">›</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
