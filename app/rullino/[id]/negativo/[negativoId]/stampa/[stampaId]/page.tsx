import Link from "next/link";
import { notFound } from "next/navigation";
import { getStampaById } from "@/lib/queries/stampe";
import { DeleteStampaButton } from "@/components/stampa/DeleteStampaButton";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { AppHeader } from "@/components/AppHeader";
import { uploadStampaImage } from "@/app/actions/upload";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string; negativoId: string; stampaId: string }>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-sm text-gray-400 dark:text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-800 dark:text-gray-200">{value}</dd>
    </div>
  );
}

function ChemSection({
  label,
  prodotto,
  temp,
  tempo,
}: {
  label: string;
  prodotto: string | null;
  temp: number | null;
  tempo: string | null;
}) {
  if (!prodotto && temp == null && !tempo) return null;
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</h3>
      <dl className="space-y-1">
        <Row label="Prodotto" value={prodotto} />
        <Row label="Temperatura" value={temp != null ? `${temp}°C` : null} />
        <Row label="Tempo" value={tempo} />
      </dl>
    </div>
  );
}

export default async function SchedaStampaPage({ params }: PageProps) {
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

  const titolo = stampa.dataStampa
    ? `Stampa del ${formatDate(stampa.dataStampa)}`
    : "Sessione di stampa";

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
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
          <span className="text-gray-700 dark:text-gray-300">{titolo}</span>
        </nav>

        {/* Intestazione */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{titolo}</h1>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              {rullino.codiceArchivio} — Fotogramma {negativo.numeroFotogramma}
              {negativo.scena ? ` — ${negativo.scena}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/pdf/stampa/${stampa.id}`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              PDF
            </a>
            <Link
              href={`/rullino/${rullino.id}/negativo/${negativo.id}/stampa/${stampa.id}/modifica`}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Modifica
            </Link>
            <DeleteStampaButton
              id={stampa.id}
              negativoId={negativo.id}
              rullinoId={rullino.id}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Riferimenti + Ingranditore */}
          <div className="space-y-6">
            <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Riferimenti
              </h2>
              <dl className="space-y-2">
                <Row label="Data stampa" value={formatDate(stampa.dataStampa)} />
                <Row label="Carta" value={stampa.carta} />
                <Row label="Formato" value={stampa.formatoStampa} />
              </dl>
              {!stampa.dataStampa && !stampa.carta && !stampa.formatoStampa && (
                <p className="text-sm text-gray-400 dark:text-gray-600">Nessun dato inserito</p>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Ingranditore
              </h2>
              <dl className="space-y-2">
                <Row label="Filtro contrasto" value={stampa.filtroContrasto} />
                <Row label="Apertura" value={stampa.aperturaObj} />
                <Row label="Esposizione" value={stampa.tempoEsposizione} />
              </dl>
              {!stampa.filtroContrasto && !stampa.aperturaObj && !stampa.tempoEsposizione && (
                <p className="text-sm text-gray-400 dark:text-gray-600">Nessun dato inserito</p>
              )}
            </section>
          </div>

          {/* Chimica + Interventi */}
          <div className="space-y-6">
            <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Chimica camera oscura
              </h2>
              <div className="space-y-4">
                <ChemSection
                  label="Sviluppo"
                  prodotto={stampa.svil_prodotto}
                  temp={stampa.svil_temp}
                  tempo={stampa.svil_tempo}
                />
                <ChemSection
                  label="Stop"
                  prodotto={stampa.stop_prodotto}
                  temp={stampa.stop_temp}
                  tempo={stampa.stop_tempo}
                />
                <ChemSection
                  label="Fissaggio"
                  prodotto={stampa.fiss_prodotto}
                  temp={stampa.fiss_temp}
                  tempo={stampa.fiss_tempo}
                />
                {!stampa.svil_prodotto && !stampa.stop_prodotto && !stampa.fiss_prodotto && (
                  <p className="text-sm text-gray-400 dark:text-gray-600">Nessun dato inserito</p>
                )}
              </div>
            </section>

            {(stampa.interventi || stampa.note) && (
              <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Interventi e note
                </h2>
                {stampa.interventi && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">Interventi</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{stampa.interventi}</p>
                  </div>
                )}
                {stampa.note && (
                  <div>
                    <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">Note</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{stampa.note}</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

        {/* Foto stampa */}
        <section className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Foto stampa
          </h2>
          <ImageUpload
            currentUrl={stampa.fotoStampaUrl ?? null}
            uploadAction={uploadStampaImage.bind(
              null,
              stampa.id,
              negativo.id,
              rullino.id
            )}
            label="foto della stampa"
          />
        </section>
      </div>
    </main>
  );
}
