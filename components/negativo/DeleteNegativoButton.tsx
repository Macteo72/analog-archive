"use client";

import { deleteNegativo } from "@/app/actions/negativo";

export function DeleteNegativoButton({ id, rullinoId }: { id: number; rullinoId: number }) {
  const action = deleteNegativo.bind(null, id, rullinoId);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Eliminare il fotogramma e tutte le sessioni di stampa collegate?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950"
      >
        Elimina
      </button>
    </form>
  );
}
