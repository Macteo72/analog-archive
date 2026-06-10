"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/app/actions/stampa";
import type { SessioneStampa } from "@prisma/client";

interface StampaFormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  stampa?: SessioneStampa;
  cancelHref: string;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-800";

function Field({ label, name, children }: { label: string; name: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function toDateInput(d: Date | null | undefined) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

function ChemRow({
  label,
  prefix,
  stampa,
}: {
  label: string;
  prefix: "svil" | "stop" | "fiss";
  stampa?: SessioneStampa;
}) {
  return (
    <div className="contents">
      <div className="flex items-center py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="py-1">
        <input
          type="text"
          id={`${prefix}_prodotto`}
          name={`${prefix}_prodotto`}
          defaultValue={(stampa as Record<string, unknown>)?.[`${prefix}_prodotto`] as string ?? ""}
          placeholder="Prodotto"
          className={inputClass}
        />
      </div>
      <div className="py-1">
        <input
          type="number"
          id={`${prefix}_temp`}
          name={`${prefix}_temp`}
          defaultValue={(stampa as Record<string, unknown>)?.[`${prefix}_temp`] as number ?? ""}
          placeholder="°C"
          step="0.1"
          className={inputClass}
        />
      </div>
      <div className="py-1">
        <input
          type="text"
          id={`${prefix}_tempo`}
          name={`${prefix}_tempo`}
          defaultValue={(stampa as Record<string, unknown>)?.[`${prefix}_tempo`] as string ?? ""}
          placeholder="es. 1 min 30 sec"
          className={inputClass}
        />
      </div>
    </div>
  );
}

export function StampaForm({ action, stampa, cancelHref }: StampaFormProps) {
  const [, formAction, isPending] = useActionState(action, null);
  const isEdit = !!stampa;

  return (
    <form action={formAction} className="space-y-8">
      {/* RIFERIMENTI */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Riferimenti
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Data stampa" name="dataStampa">
            <input
              type="date"
              id="dataStampa"
              name="dataStampa"
              defaultValue={toDateInput(stampa?.dataStampa)}
              className={inputClass}
            />
          </Field>
          <Field label="Carta fotografica" name="carta">
            <input
              type="text"
              id="carta"
              name="carta"
              defaultValue={stampa?.carta ?? ""}
              placeholder="Marca e tipo"
              className={inputClass}
            />
          </Field>
          <Field label="Formato stampa" name="formatoStampa">
            <input
              type="text"
              id="formatoStampa"
              name="formatoStampa"
              defaultValue={stampa?.formatoStampa ?? ""}
              placeholder="es. 18x24"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* INGRANDITORE */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Ingranditore
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Filtro contrasto" name="filtroContrasto">
            <input
              type="text"
              id="filtroContrasto"
              name="filtroContrasto"
              defaultValue={stampa?.filtroContrasto ?? ""}
              placeholder="es. 2.5"
              className={inputClass}
            />
          </Field>
          <Field label="Apertura obiettivo" name="aperturaObj">
            <input
              type="text"
              id="aperturaObj"
              name="aperturaObj"
              defaultValue={stampa?.aperturaObj ?? ""}
              placeholder="es. f/8"
              className={inputClass}
            />
          </Field>
          <Field label="Tempo esposizione" name="tempoEsposizione">
            <input
              type="text"
              id="tempoEsposizione"
              name="tempoEsposizione"
              defaultValue={stampa?.tempoEsposizione ?? ""}
              placeholder="es. 12 sec"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* CHIMICA */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Chimica camera oscura
        </h2>
        <div className="overflow-x-auto">
          <div className="grid min-w-[480px] grid-cols-[80px_1fr_90px_1fr] items-center gap-x-3">
            {/* Header */}
            <div />
            <div className="py-1 text-xs font-medium text-gray-400 dark:text-gray-500">Prodotto</div>
            <div className="py-1 text-xs font-medium text-gray-400 dark:text-gray-500">Temp. (°C)</div>
            <div className="py-1 text-xs font-medium text-gray-400 dark:text-gray-500">Tempo</div>
            {/* Rows */}
            <ChemRow label="Sviluppo" prefix="svil" stampa={stampa} />
            <ChemRow label="Stop" prefix="stop" stampa={stampa} />
            <ChemRow label="Fissaggio" prefix="fiss" stampa={stampa} />
          </div>
        </div>
      </section>

      {/* INTERVENTI E NOTE */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Interventi e note
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Interventi" name="interventi">
            <textarea
              id="interventi"
              name="interventi"
              defaultValue={stampa?.interventi ?? ""}
              placeholder="Mascherature, bruciature, variazioni di tempo…"
              rows={4}
              className={inputClass + " resize-y"}
            />
          </Field>
          <Field label="Note" name="note">
            <textarea
              id="note"
              name="note"
              defaultValue={stampa?.note ?? ""}
              placeholder="Osservazioni generali sulla sessione…"
              rows={4}
              className={inputClass + " resize-y"}
            />
          </Field>
        </div>
      </section>

      {/* AZIONI */}
      <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50"
        >
          {isPending ? "Salvataggio…" : isEdit ? "Salva modifiche" : "Crea sessione"}
        </button>
        <Link
          href={cancelHref}
          className="rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Annulla
        </Link>
      </div>
    </form>
  );
}
