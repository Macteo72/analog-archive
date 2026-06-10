import Link from "next/link";
import { notFound } from "next/navigation";
import { getStampaById } from "@/lib/queries/stampe";
import { StampaForm } from "@/components/stampa/StampaForm";
import { updateStampa } from "@/app/actions/stampa";

interface PageProps {
  params: Promise<{ id: string; negativoId: string; stampaId: string }>;
}

export default async function ModificaStampaPage({ params }: PageProps) {
  const { id, negativoId, stampaId } = await params;
  const stampa = await getStampaById(parseInt(stampaId, 10));

  if (
    !stampa ||
    stampa.negativoId !== parseInt(negativoId, 10) ||
    stampa.negativo.rullinoId !== parseInt(id, 10)
  ) {
    notFound();
  }

  const { negativo } = stampa;
  const { rullino } = negativo;

  const boundUpdate = updateStampa.bind(null, stampa.id, negativo.id, rullino.id);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">Archivio</Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}`} className="hover:text-gray-700">
            {rullino.codiceArchivio}
          </Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}/negativo/${negativo.id}`} className="hover:text-gray-700">
            Fotogramma {negativo.numeroFotogramma}
          </Link>
          <span>›</span>
          <Link
            href={`/rullino/${rullino.id}/negativo/${negativo.id}/stampa/${stampa.id}`}
            className="hover:text-gray-700"
          >
            Stampa
          </Link>
          <span>›</span>
          <span className="text-gray-700">Modifica</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Modifica sessione di stampa</h1>
        <p className="mb-8 text-sm text-gray-400">
          {rullino.codiceArchivio} — Fotogramma {negativo.numeroFotogramma}
          {negativo.scena ? ` — ${negativo.scena}` : ""}
        </p>

        <StampaForm
          action={boundUpdate}
          stampa={stampa}
          cancelHref={`/rullino/${rullino.id}/negativo/${negativo.id}/stampa/${stampa.id}`}
        />
      </div>
    </main>
  );
}
