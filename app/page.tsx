import { Suspense } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { FilterBar } from "@/components/archivio/FilterBar";
import { ArchivioView } from "@/components/archivio/ArchivioView";
import {
  getRullini,
  getDistinctPellicole,
  getDistinctFotocamere,
  type RullinoFilters,
} from "@/lib/queries/rullini";

interface PageProps {
  searchParams: Promise<RullinoFilters>;
}

export default async function ArchivioPage({ searchParams }: PageProps) {
  const filters = await searchParams;

  const [rullini, pellicole, fotocamere] = await Promise.all([
    getRullini(filters),
    getDistinctPellicole(),
    getDistinctFotocamere(),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Archivio Negativi</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/rullino/nuovo"
              className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100"
            >
              + Nuovo rullino
            </Link>
            <Link
              href="/stampa/nuova"
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              + Nuova stampa
            </Link>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
          <span className="relative px-4 py-2 text-sm font-medium text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 dark:after:bg-white">
            Negativi
          </span>
          <Link
            href="/stampe"
            className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Stampe
          </Link>
        </div>

        <Suspense>
          <FilterBar pellicole={pellicole} fotocamere={fotocamere} current={filters} />
        </Suspense>

        <ArchivioView rullini={rullini} />
      </div>
    </main>
  );
}
