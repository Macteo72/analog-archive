import Link from "next/link";
import { notFound } from "next/navigation";
import { getNegativoById } from "@/lib/queries/negativi";
import { StampaForm } from "@/components/stampa/StampaForm";
import { createStampa } from "@/app/actions/stampa";

interface PageProps {
  params: Promise<{ id: string; negativoId: string }>;
}

export default async function NuovaStampaPage({ params }: PageProps) {
  const { id, negativoId } = await params;
  const rullinoId = parseInt(id, 10);
  const negId = parseInt(negativoId, 10);

  const negativo = await getNegativoById(negId);
  if (!negativo || negativo.rullinoId !== rullinoId) notFound();

  const { rullino } = negativo;
  const boundCreate = createStampa.bind(null, negId, rullinoId);

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
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
          <span className="text-gray-700">Nuova stampa</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Nuova sessione di stampa</h1>
        <p className="mb-8 text-sm text-gray-400">
          {rullino.codiceArchivio} — Fotogramma {negativo.numeroFotogramma}
          {negativo.scena ? ` — ${negativo.scena}` : ""}
        </p>

        <StampaForm
          action={boundCreate}
          cancelHref={`/rullino/${rullino.id}/negativo/${negativo.id}`}
        />
      </div>
    </main>
  );
}
