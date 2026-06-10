"use client";

import { deleteStampa } from "@/app/actions/stampa";

export function DeleteStampaButton({
  id,
  negativoId,
  rullinoId,
}: {
  id: number;
  negativoId: number;
  rullinoId: number;
}) {
  const action = deleteStampa.bind(null, id, negativoId, rullinoId);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Eliminare questa sessione di stampa?")) e.preventDefault();
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
