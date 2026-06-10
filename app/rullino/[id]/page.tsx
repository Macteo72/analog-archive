import Link from "next/link";
import { notFound } from "next/navigation";
import { getRullinoById } from "@/lib/queries/rullini";
import { DeleteButton } from "@/components/rullino/DeleteButton";
import { AppHeader } from "@/components/AppHeader";
import { formatDateFlex } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== false) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-sm text-gray-400 dark:text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-800 dark:text-gray-200">{value}</dd>
    </div>
  );
}

export default async function SchedaRullinoPage({ params }: PageProps) {
  const { id } = await params;
  const rullino = await getRullinoById(parseInt(id, 10));

  if (!rullino) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            Archivio
          </Link>
          <span>›</span>
          <span className="text-gray-700 dark:text-gray-300">Rullino {rullino.codiceArchivio}</span>
        </nav>

        {/* Intestazione */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
              {rullino.codiceArchivio}
            </h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">{rullino.pellicola}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/pdf/rullino/${rullino.id}`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              PDF
            </a>
            <Link
              href={`/rullino/${rullino.id}/modifica`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Modifica
            </Link>
            <DeleteButton id={rullino.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Info ripresa */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Ripresa
            </h2>
            <dl className="space-y-2">
              <Row label="Formato" value={`${rullino.formato}mm`} />
              <Row label="Sensibilità" value={rullino.sensibilita ? `${rullino.sensibilita} ISO` : null} />
              <Row label="Fotocamera" value={rullino.fotocamera} />
              <Row label="Focale" value={rullino.focale} />
              <Row label="Data scatti" value={formatDateFlex(rullino.dataScatti, rullino.dataScattiPrecisione, rullino.dataScattiFine)} />
              <Row label="Provino a contatto" value={rullino.provinoContatto ? "Sì" : "No"} />
              {rullino.scene && (
                <div className="pt-1">
                  <dt className="mb-1 text-sm text-gray-400 dark:text-gray-500">Scene</dt>
                  <dd className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{rullino.scene}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Info sviluppo */}
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Sviluppo
            </h2>
            <dl className="space-y-2">
              <Row label="Prodotto" value={rullino.prodottoSviluppo} />
              <Row label="Diluizione" value={rullino.diluizione} />
              <Row label="Tempo" value={rullino.tempoSviluppo} />
              <Row label="Temperatura" value={rullino.tempSviluppo != null ? `${rullino.tempSviluppo}°C` : null} />
              <Row label="Data sviluppo" value={formatDateFlex(rullino.dataSviluppo, rullino.dataSviluppoPrecisione, rullino.dataSviluppoFine)} />
              {rullino.noteSviluppo && (
                <div className="pt-1">
                  <dt className="mb-1 text-sm text-gray-400 dark:text-gray-500">Note</dt>
                  <dd className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{rullino.noteSviluppo}</dd>
                </div>
              )}
              {!rullino.prodottoSviluppo && !rullino.diluizione && !rullino.tempoSviluppo && !rullino.dataSviluppo && (
                <p className="text-sm text-gray-400 dark:text-gray-600">Nessun dato di sviluppo inserito</p>
              )}
            </dl>
          </section>
        </div>

        {/* Fotogrammi */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fotogrammi{" "}
              <span className="text-base font-normal text-gray-400 dark:text-gray-500">
                ({rullino.negativi.length})
              </span>
            </h2>
            <Link
              href={`/rullino/${rullino.id}/negativo/nuovo`}
              className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100"
            >
              + Fotogramma
            </Link>
          </div>

          {rullino.negativi.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-12 text-center text-sm text-gray-400 dark:text-gray-600">
              Nessun fotogramma. Aggiungine uno.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {rullino.negativi.map((neg) => (
                <Link
                  key={neg.id}
                  href={`/rullino/${rullino.id}/negativo/${neg.id}`}
                  className="flex items-center gap-4 px-5 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="font-mono text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                    {neg.numeroFotogramma}
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {neg.scena ?? <span className="text-gray-400 dark:text-gray-600 italic">Senza titolo</span>}
                  </span>
                  <span className="ml-auto text-gray-300 dark:text-gray-600">›</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
