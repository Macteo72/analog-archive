import Link from "next/link";
import { formatDateFlex } from "@/lib/utils";
import type { Rullino } from "@prisma/client";

interface RullinoCardProps {
  rullino: Rullino & { negativi: { id: number }[] };
}

export function RullinoCard({ rullino }: RullinoCardProps) {
  const nFotogrammi = rullino.negativi.length;

  return (
    <Link
      href={`/rullino/${rullino.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-lg font-bold tracking-tight text-gray-900">
          {rullino.codiceArchivio}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {rullino.formato}mm
        </span>
      </div>

      <div className="mt-2 text-sm font-medium text-gray-800">
        {rullino.pellicola}
        {rullino.sensibilita ? (
          <span className="ml-1 font-normal text-gray-500">— {rullino.sensibilita} ISO</span>
        ) : null}
      </div>

      {(rullino.fotocamera || rullino.focale) && (
        <div className="mt-0.5 text-sm text-gray-500">
          {[rullino.fotocamera, rullino.focale].filter(Boolean).join(" · ")}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-400">{formatDateFlex(rullino.dataScatti, rullino.dataScattiPrecisione, rullino.dataScattiFine)}</div>

      {rullino.scene && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{rullino.scene}</p>
      )}

      <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
        <span>
          {nFotogrammi} {nFotogrammi === 1 ? "fotogramma" : "fotogrammi"}
        </span>
        {rullino.provinoContatto && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">
            Provino ✓
          </span>
        )}
      </div>
    </Link>
  );
}
