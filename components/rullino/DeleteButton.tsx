"use client";

import { deleteRullino } from "@/app/actions/rullino";

export function DeleteButton({ id }: { id: number }) {
  const action = deleteRullino.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Eliminare il rullino e tutti i negativi collegati? L'operazione non è reversibile.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Elimina
      </button>
    </form>
  );
}
