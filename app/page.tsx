import { Suspense } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { FilterBar } from "@/components/archivio/FilterBar";
import { RullinoCard } from "@/components/archivio/RullinoCard";
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
          <Link
            href="/rullino/nuovo"
            className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100"
          >
            + Nuovo rullino
          </Link>
        </div>

        <Suspense>
          <FilterBar pellicole={pellicole} fotocamere={fotocamere} current={filters} />
        </Suspense>

        <p className="mt-4 mb-4 text-sm text-gray-400 dark:text-gray-500">
          {rullini.length} {rullini.length === 1 ? "rullino" : "rullini"}
        </p>

        {rullini.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-gray-600">
            <p className="text-4xl mb-3">○</p>
            <p className="text-sm">Nessun rullino trovato</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rullini.map((rullino) => (
              <RullinoCard key={rullino.id} rullino={rullino} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
