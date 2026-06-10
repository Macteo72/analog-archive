import Link from "next/link";
import { notFound } from "next/navigation";
import { getRullinoById } from "@/lib/queries/rullini";
import { AppHeader } from "@/components/AppHeader";
import { RullinoForm } from "@/components/rullino/RullinoForm";
import { updateRullino } from "@/app/actions/rullino";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModificaRullinoPage({ params }: PageProps) {
  const { id } = await params;
  const rullino = await getRullinoById(parseInt(id, 10));

  if (!rullino) notFound();

  const boundUpdateRullino = updateRullino.bind(null, rullino.id);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            Archivio
          </Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}`} className="hover:text-gray-700 dark:hover:text-gray-200">
            Rullino {rullino.codiceArchivio}
          </Link>
          <span>›</span>
          <span className="text-gray-700 dark:text-gray-300">Modifica</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Modifica {rullino.codiceArchivio}
        </h1>

        <RullinoForm
          action={boundUpdateRullino}
          rullino={rullino}
          cancelHref={`/rullino/${rullino.id}`}
        />
      </div>
    </main>
  );
}
