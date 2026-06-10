"use client";

import { useActionState } from "react";
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
            <Field label="Codice archivio" name="codiceArchivio">
              <input
                type="text"
                value={rullino.codiceArchivio}
                disabled
                className={inputClass}
              />
            </Field>
          ) : (
            <Field label="Formato" name="formato" required error={errors.formato}>
              <select name="formato" id="formato" defaultValue="135" className={inputClass}>
                <option value="135">135mm</option>
                <option value="120">120</option>
              </select>
            </Field>
          )}

          {isEdit && (
            <Field label="Formato" name="formato_display">
              <input
                type="text"
                value={`${rullino.formato}mm`}
                disabled
                className={inputClass}
              />
            </Field>
          )}

          <Field label="Pellicola" name="pellicola" required error={errors.pellicola}>
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
            <input
              type="date"
              id="dataScatti"
              name="dataScatti"
              defaultValue={toDateInput(rullino?.dataScatti)}
              className={inputClass}
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
            <input
              type="date"
              id="dataSviluppo"
              name="dataSviluppo"
              defaultValue={toDateInput(rullino?.dataSviluppo)}
              className={inputClass}
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
