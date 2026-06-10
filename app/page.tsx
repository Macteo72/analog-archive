import { Suspense } from "react";
import Link from "next/link";
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
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Archivio Negativi</h1>
          <Link
            href="/rullino/nuovo"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + Nuovo rullino
          </Link>
        </div>

        <Suspense>
          <FilterBar pellicole={pellicole} fotocamere={fotocamere} current={filters} />
        </Suspense>

        <p className="mt-4 mb-4 text-sm text-gray-400">
          {rullini.length} {rullini.length === 1 ? "rullino" : "rullini"}
        </p>

        {rullini.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
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
