"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/app/actions/negativo";
import type { Negativo } from "@prisma/client";

interface NegativoFormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  negativo?: Negativo;
  nextNumero?: number;
  cancelHref: string;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-800 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500";

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
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function NegativoForm({ action, negativo, nextNumero, cancelHref }: NegativoFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const errors = state?.errors ?? {};
  const isEdit = !!negativo;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="N° fotogramma" name="numeroFotogramma" required error={errors.numeroFotogramma}>
          <input
            type="number"
            id="numeroFotogramma"
            name="numeroFotogramma"
            defaultValue={isEdit ? negativo.numeroFotogramma : (nextNumero ?? 1)}
            min={1}
            disabled={isEdit}
            className={inputClass}
          />
          {isEdit && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Il numero fotogramma non è modificabile</p>
          )}
        </Field>

        <Field label="Scena" name="scena">
          <input
            type="text"
            id="scena"
            name="scena"
            defaultValue={negativo?.scena ?? ""}
            placeholder="es. Tramonto sul lago"
            className={inputClass}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Descrizione" name="descrizione">
            <textarea
              id="descrizione"
              name="descrizione"
              defaultValue={negativo?.descrizione ?? ""}
              placeholder="Descrizione dettagliata del fotogramma…"
              rows={4}
              className={inputClass + " resize-y"}
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50"
        >
          {isPending ? "Salvataggio…" : isEdit ? "Salva modifiche" : "Crea fotogramma"}
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
