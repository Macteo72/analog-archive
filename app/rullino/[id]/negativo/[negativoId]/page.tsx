import Link from "next/link";
import { notFound } from "next/navigation";
import { getNegativoById } from "@/lib/queries/negativi";
import { DeleteNegativoButton } from "@/components/negativo/DeleteNegativoButton";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { uploadNegativoImage } from "@/app/actions/upload";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string; negativoId: string }>;
}

export default async function SchedaNegativoPage({ params }: PageProps) {
  const { id, negativoId } = await params;
  const negativo = await getNegativoById(parseInt(negativoId, 10));

  if (!negativo || negativo.rullinoId !== parseInt(id, 10)) notFound();

  const { rullino, stampe } = negativo;

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">Archivio</Link>
          <span>›</span>
          <Link href={`/rullino/${rullino.id}`} className="hover:text-gray-700">
            Rullino {rullino.codiceArchivio}
          </Link>
          <span>›</span>
          <span className="text-gray-700">Fotogramma {negativo.numeroFotogramma}</span>
        </nav>

        {/* Intestazione */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fotogramma {negativo.numeroFotogramma}
            </h1>
            {negativo.scena && (
              <p className="mt-1 text-lg text-gray-500">{negativo.scena}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/pdf/negativo/${negativo.id}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              PDF
            </a>
            <Link
              href={`/rullino/${rullino.id}/negativo/${negativo.id}/modifica`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Modifica
            </Link>
            <DeleteNegativoButton id={negativo.id} rullinoId={rullino.id} />
          </div>
        </div>

        {/* Descrizione */}
        {negativo.descrizione && (
          <section className="mb-8 rounded-xl border border-gray-200 p-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Descrizione
            </h2>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{negativo.descrizione}</p>
          </section>
        )}

        {/* Scansione negativo */}
        <section className="mb-8 rounded-xl border border-gray-200 p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Scansione
          </h2>
          <ImageUpload
            currentUrl={negativo.scansioneUrl ?? null}
            uploadAction={uploadNegativoImage.bind(null, negativo.id, rullino.id)}
            label="scansione negativo"
          />
        </section>

        {/* Rullino di appartenenza (collapsibile) */}
        <details className="mb-8 rounded-xl border border-gray-200">
          <summary className="cursor-pointer select-none px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mr-2">
              Rullino
            </span>
            {rullino.codiceArchivio} — {rullino.pellicola}
          </summary>
          <div className="border-t border-gray-100 px-5 py-4">
            <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
              {[
                ["Formato", `${rullino.formato}mm`],
                ["Sensibilità", rullino.sensibilita ? `${rullino.sensibilita} ISO` : null],
                ["Fotocamera", rullino.fotocamera],
                ["Focale", rullino.focale],
                ["Data scatti", formatDate(rullino.dataScatti)],
                ["Sviluppo", rullino.prodottoSviluppo],
                ["Diluizione", rullino.diluizione],
                ["Tempo sviluppo", rullino.tempoSviluppo],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label as string} className="flex gap-2">
                    <dt className="w-32 shrink-0 text-gray-400">{label}</dt>
                    <dd className="text-gray-700">{value}</dd>
                  </div>
                ))}
            </dl>
            <Link
              href={`/rullino/${rullino.id}`}
              className="mt-3 inline-block text-xs text-gray-400 hover:text-gray-700"
            >
              Apri scheda rullino →
            </Link>
          </div>
        </details>

        {/* Sessioni di stampa */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Sessioni di stampa{" "}
              <span className="text-base font-normal text-gray-400">({stampe.length})</span>
            </h2>
            <Link
              href={`/rullino/${rullino.id}/negativo/${negativo.id}/stampa/nuovo`}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              + Nuova stampa
            </Link>
          </div>

          {stampe.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
              Nessuna sessione di stampa. Aggiungine una.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
              {stampe.map((stampa) => (
                <Link
                  key={stampa.id}
                  href={`/rullino/${rullino.id}/negativo/${negativo.id}/stampa/${stampa.id}`}
                  className="flex items-center gap-4 px-5 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(stampa.dataStampa)}
                    </span>
                    <span className="ml-3 text-sm text-gray-400">
                      {[stampa.carta, stampa.formatoStampa, stampa.tempoEsposizione]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  {stampa.filtroContrasto && (
                    <span className="text-xs text-gray-400">Filtro {stampa.filtroContrasto}</span>
                  )}
                  <span className="text-gray-300">›</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
