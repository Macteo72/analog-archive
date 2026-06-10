"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { FormState } from "@/app/actions/rullino";
import type { Rullino } from "@prisma/client";

interface RullinoFormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  rullino?: Rullino;
  cancelHref: string;
}

function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

const MESI = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

type Prec = "anno" | "mese" | "intervallo";

function DatePrecisionInput({
  baseName,
  defaultDate,
  defaultPrecisione,
  defaultFine,
}: {
  baseName: string;
  defaultDate?: Date | null;
  defaultPrecisione?: string | null;
  defaultFine?: Date | null;
}) {
  const initPrec = (defaultPrecisione as Prec) ?? (defaultDate ? "intervallo" : "anno");
  const [prec, setPrec] = useState<Prec>(initPrec);

  const defaultD = defaultDate ? new Date(defaultDate) : null;

  const [anno, setAnno] = useState(defaultD ? String(defaultD.getUTCFullYear()) : "");
  const [mese, setMese] = useState(
    initPrec === "mese" && defaultD ? String(defaultD.getUTCMonth() + 1) : ""
  );
  const [annoMese, setAnnoMese] = useState(defaultD ? String(defaultD.getUTCFullYear()) : "");
  const [inizio, setInizio] = useState(
    initPrec === "intervallo" && defaultD ? toDateInput(defaultD) : ""
  );
  const [fine, setFine] = useState(
    initPrec === "intervallo"
      ? defaultFine
        ? toDateInput(defaultFine)
        : defaultD
          ? toDateInput(defaultD)
          : ""
      : ""
  );

  let hiddenDate = "";
  let hiddenFine = "";
  if (prec === "anno" && anno) {
    hiddenDate = `${anno}-01-01`;
  } else if (prec === "mese" && mese && annoMese) {
    hiddenDate = `${annoMese}-${mese.padStart(2, "0")}-01`;
  } else if (prec === "intervallo" && inizio) {
    hiddenDate = inizio;
    hiddenFine = fine;
  }

  return (
    <div className="space-y-2">
      <div className="flex overflow-hidden rounded-lg border border-gray-200">
        {(["anno", "mese", "intervallo"] as Prec[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPrec(p)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium transition ${
              prec === p ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p === "anno" ? "Anno" : p === "mese" ? "Mese" : "Intervallo"}
          </button>
        ))}
      </div>

      {prec === "anno" && (
        <input
          type="number"
          value={anno}
          onChange={(e) => setAnno(e.target.value)}
          placeholder="es. 2024"
          min={1900}
          max={2100}
          className={inputClass}
        />
      )}

      {prec === "mese" && (
        <div className="flex gap-2">
          <select
            value={mese}
            onChange={(e) => setMese(e.target.value)}
            className={inputClass}
          >
            <option value="">Mese</option>
            {MESI.map((m, i) => (
              <option key={i} value={String(i + 1)}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            value={annoMese}
            onChange={(e) => setAnnoMese(e.target.value)}
            placeholder="Anno"
            min={1900}
            max={2100}
            className={inputClass}
          />
        </div>
      )}

      {prec === "intervallo" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={inizio}
            onChange={(e) => setInizio(e.target.value)}
            className={inputClass}
          />
          <span className="shrink-0 text-gray-400">—</span>
          <input
            type="date"
            value={fine}
            onChange={(e) => setFine(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      <input type="hidden" name={baseName} value={hiddenDate} />
      <input type="hidden" name={`${baseName}_precisione`} value={hiddenDate ? prec : ""} />
      {prec === "intervallo" && (
        <input type="hidden" name={`${baseName}Fine`} value={hiddenFine} />
      )}
    </div>
  );
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50 disabled:text-gray-400";

export function RullinoForm({ action, rullino, cancelHref }: RullinoFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = state?.errors ?? {};
  const isEdit = !!rullino;

  return (
    <form action={formAction} className="space-y-8">
      {/* SEZIONE RIPRESA */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
          Info ripresa
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isEdit ? (
            <Field label="Codice archivio" name="codiceArchivio" error={errors.codiceArchivio}>
              <input
                type="text"
                id="codiceArchivio"
                name="codiceArchivio"
                defaultValue={rullino.codiceArchivio}
                placeholder="es. 135/01"
                className={inputClass}
              />
            </Field>
          ) : (
            <Field label="Formato" name="formato">
              <select name="formato" id="formato" defaultValue="135" className={inputClass}>
                <option value="135">135mm</option>
                <option value="120">120</option>
              </select>
            </Field>
          )}

          {isEdit && (
            <Field label="Formato" name="formato">
              <select name="formato" id="formato" defaultValue={rullino.formato} className={inputClass}>
                <option value="135">135mm</option>
                <option value="120">120</option>
              </select>
            </Field>
          )}

          <Field label="Pellicola" name="pellicola">
            <input
              type="text"
              id="pellicola"
              name="pellicola"
              defaultValue={rullino?.pellicola ?? ""}
              placeholder="es. Kentmere Pan 200"
              className={inputClass}
            />
          </Field>

          <Field label="Sensibilità (ISO)" name="sensibilita">
            <input
              type="number"
              id="sensibilita"
              name="sensibilita"
              defaultValue={rullino?.sensibilita ?? ""}
              placeholder="es. 200"
              min={1}
              className={inputClass}
            />
          </Field>

          <Field label="Fotocamera" name="fotocamera">
            <input
              type="text"
              id="fotocamera"
              name="fotocamera"
              defaultValue={rullino?.fotocamera ?? ""}
              placeholder="es. Canon AE-1"
              className={inputClass}
            />
          </Field>

          <Field label="Focale" name="focale">
            <input
              type="text"
              id="focale"
              name="focale"
              defaultValue={rullino?.focale ?? ""}
              placeholder="es. 50mm f/1.8"
              className={inputClass}
            />
          </Field>

          <Field label="Data scatti" name="dataScatti">
            <DatePrecisionInput
              baseName="dataScatti"
              defaultDate={rullino?.dataScatti}
              defaultPrecisione={rullino?.dataScattiPrecisione}
              defaultFine={rullino?.dataScattiFine}
            />
          </Field>

          <Field label="Provino a contatto" name="provinoContatto">
            <div className="flex h-10 items-center">
              <input
                type="checkbox"
                id="provinoContatto"
                name="provinoContatto"
                defaultChecked={rullino?.provinoContatto ?? false}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900"
              />
              <label htmlFor="provinoContatto" className="ml-2 text-sm text-gray-700">
                Sì, realizzato
              </label>
            </div>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Scene" name="scene">
              <textarea
                id="scene"
                name="scene"
                defaultValue={rullino?.scene ?? ""}
                placeholder="Descrizione generale del contenuto del rullino…"
                rows={3}
                className={inputClass + " resize-y"}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* SEZIONE SVILUPPO */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
          Info sviluppo
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Prodotto sviluppo" name="prodottoSviluppo">
            <input
              type="text"
              id="prodottoSviluppo"
              name="prodottoSviluppo"
              defaultValue={rullino?.prodottoSviluppo ?? ""}
              placeholder="es. Bellini Hydrofen"
              className={inputClass}
            />
          </Field>

          <Field label="Diluizione" name="diluizione">
            <input
              type="text"
              id="diluizione"
              name="diluizione"
              defaultValue={rullino?.diluizione ?? ""}
              placeholder="es. 1+31"
              className={inputClass}
            />
          </Field>

          <Field label="Tempo di sviluppo" name="tempoSviluppo">
            <input
              type="text"
              id="tempoSviluppo"
              name="tempoSviluppo"
              defaultValue={rullino?.tempoSviluppo ?? ""}
              placeholder="es. 9 min"
              className={inputClass}
            />
          </Field>

          <Field label="Temperatura (°C)" name="tempSviluppo">
            <input
              type="number"
              id="tempSviluppo"
              name="tempSviluppo"
              defaultValue={rullino?.tempSviluppo ?? ""}
              placeholder="es. 20.0"
              step="0.1"
              className={inputClass}
            />
          </Field>

          <Field label="Data sviluppo" name="dataSviluppo">
            <DatePrecisionInput
              baseName="dataSviluppo"
              defaultDate={rullino?.dataSviluppo}
              defaultPrecisione={rullino?.dataSviluppoPrecisione}
              defaultFine={rullino?.dataSviluppoFine}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Note sviluppo" name="noteSviluppo">
              <textarea
                id="noteSviluppo"
                name="noteSviluppo"
                defaultValue={rullino?.noteSviluppo ?? ""}
                placeholder="Osservazioni sulla sessione di sviluppo…"
                rows={3}
                className={inputClass + " resize-y"}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* AZIONI */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
        >
          {isPending ? "Salvataggio…" : isEdit ? "Salva modifiche" : "Crea rullino"}
        </button>
        <Link
          href={cancelHref}
          className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Annulla
        </Link>
      </div>
    </form>
  );
}
