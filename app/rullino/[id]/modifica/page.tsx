import Link from "next/link";
import { notFound } from "next/navigation";
import { getRullinoById } from "@/lib/queries/rullini";
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
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">
            Archivio
          </Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}`} className="hover:text-gray-700">
            Rullino {rullino.codiceArchivio}
          </Link>
          <span>›</span>
          <span className="text-gray-700">Modifica</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-gray-900">
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
