import Link from "next/link";
import { notFound } from "next/navigation";
import { getNegativoById } from "@/lib/queries/negativi";
import { NegativoForm } from "@/components/negativo/NegativoForm";
import { updateNegativo } from "@/app/actions/negativo";

interface PageProps {
  params: Promise<{ id: string; negativoId: string }>;
}

export default async function ModificaNegativoPage({ params }: PageProps) {
  const { id, negativoId } = await params;
  const negativo = await getNegativoById(parseInt(negativoId, 10));

  if (!negativo || negativo.rullinoId !== parseInt(id, 10)) notFound();

  const { rullino } = negativo;
  const boundUpdate = updateNegativo.bind(null, negativo.id, rullino.id);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">Archivio</Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}`} className="hover:text-gray-700">
            Rullino {rullino.codiceArchivio}
          </Link>
          <span>›</span>
          <Link
            href={`/rullino/${rullino.id}/negativo/${negativo.id}`}
            className="hover:text-gray-700"
          >
            Fotogramma {negativo.numeroFotogramma}
          </Link>
          <span>›</span>
          <span className="text-gray-700">Modifica</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Modifica fotogramma {negativo.numeroFotogramma}
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          Rullino {rullino.codiceArchivio} — {rullino.pellicola}
        </p>

        <NegativoForm
          action={boundUpdate}
          negativo={negativo}
          cancelHref={`/rullino/${rullino.id}/negativo/${negativo.id}`}
        />
      </div>
    </main>
  );
}
