import Link from "next/link";
import { notFound } from "next/navigation";
import { getRullinoById } from "@/lib/queries/rullini";
import { getNextNumeroFotogramma } from "@/lib/queries/negativi";
import { NegativoForm } from "@/components/negativo/NegativoForm";
import { createNegativo } from "@/app/actions/negativo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NuovoNegativoPage({ params }: PageProps) {
  const { id } = await params;
  const rullinoId = parseInt(id, 10);

  const [rullino, nextNumero] = await Promise.all([
    getRullinoById(rullinoId),
    getNextNumeroFotogramma(rullinoId),
  ]);

  if (!rullino) notFound();

  const boundCreate = createNegativo.bind(null, rullinoId);

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
          <span className="text-gray-700">Nuovo fotogramma</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Nuovo fotogramma</h1>
        <p className="mb-8 text-sm text-gray-400">Rullino {rullino.codiceArchivio} — {rullino.pellicola}</p>

        <NegativoForm
          action={boundCreate}
          nextNumero={nextNumero}
          cancelHref={`/rullino/${rullino.id}`}
        />
      </div>
    </main>
  );
}
