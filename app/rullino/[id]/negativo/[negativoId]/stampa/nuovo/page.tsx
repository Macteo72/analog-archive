import Link from "next/link";
import { notFound } from "next/navigation";
import { getNegativoById } from "@/lib/queries/negativi";
import { AppHeader } from "@/components/AppHeader";
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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Archivio</Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}`} className="hover:text-gray-700 dark:hover:text-gray-200">
            {rullino.codiceArchivio}
          </Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}/negativo/${negativo.id}`} className="hover:text-gray-700 dark:hover:text-gray-200">
            Fotogramma {negativo.numeroFotogramma}
          </Link>
          <span>›</span>
          <span className="text-gray-700 dark:text-gray-300">Nuova stampa</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Nuova sessione di stampa</h1>
        <p className="mb-8 text-sm text-gray-400 dark:text-gray-500">
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
