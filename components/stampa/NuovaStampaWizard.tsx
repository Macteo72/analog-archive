"use client";

import { useState, useActionState } from "react";
import { createStampaFromWizard } from "@/app/actions/stampa";
import type { getRulliniConNegativi } from "@/lib/queries/rullini";

type RullinoItem = Awaited<ReturnType<typeof getRulliniConNegativi>>[number];
type NegativoItem = RullinoItem["negativi"][number];

const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-800";

export function NuovaStampaWizard({ rullini }: { rullini: RullinoItem[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRullino, setSelectedRullino] = useState<RullinoItem | null>(null);
  const [selectedNegativoId, setSelectedNegativoId] = useState<number | null>(null);
  const [state, formAction, isPending] = useActionState(createStampaFromWizard, null);

  const selectedNegativo: NegativoItem | undefined = selectedRullino?.negativi.find(
    (n) => n.id === selectedNegativoId
  );

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-3">
        <StepBubble n={1} current={step} />
        <div className={`h-px flex-1 ${step > 1 ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"}`} />
        <StepBubble n={2} current={step} />
        <div className={`h-px flex-1 ${step > 2 ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"}`} />
        <StepBubble n={3} current={step} />
      </div>

      {/* Step 1: Select rullino */}
      {step === 1 && (
        <div>
          <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Seleziona il rullino</h2>
          <p className="mb-5 text-sm text-gray-400 dark:text-gray-500">
            Scegli il rullino che contiene il negativo da stampare.
          </p>

          {rullini.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Nessun rullino disponibile.</p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {rullini.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedRullino(r);
                    setSelectedNegativoId(null);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    selectedRullino?.id === r.id
                      ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="w-24 shrink-0 font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {r.codiceArchivio}
                  </span>
                  <span className="flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
                    {r.pellicola || "—"}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                    {r.negativi.length} fotogrammi
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => { if (selectedRullino) setStep(2); }}
              disabled={!selectedRullino}
              className="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-40"
            >
              Avanti →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select negativo */}
      {step === 2 && selectedRullino && (
        <div>
          <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Seleziona il fotogramma</h2>
          <p className="mb-5 text-sm text-gray-400 dark:text-gray-500">
            Rullino{" "}
            <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
              {selectedRullino.codiceArchivio}
            </span>
          </p>

          {selectedRullino.negativi.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Nessun fotogramma per questo rullino.
            </p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {selectedRullino.negativi.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNegativoId(n.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    selectedNegativoId === n.id
                      ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="w-10 shrink-0 font-mono text-sm font-bold text-gray-900 dark:text-white">
                    #{n.numeroFotogramma}
                  </span>
                  <span className="flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
                    {n.scena || "—"}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => { if (selectedNegativoId) setStep(3); }}
              disabled={!selectedNegativoId}
              className="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-40"
            >
              Avanti →
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ← Indietro
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Stampa form */}
      {step === 3 && selectedRullino && selectedNegativoId && (
        <div>
          <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
            Dati della sessione di stampa
          </h2>
          <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">
            <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
              {selectedRullino.codiceArchivio}
            </span>
            {" — "}Fotogramma #{selectedNegativo?.numeroFotogramma}
            {selectedNegativo?.scena ? ` — ${selectedNegativo.scena}` : ""}
          </p>

          {state?.errors?._ && (
            <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {state.errors._}
            </p>
          )}

          <form action={formAction} className="space-y-8">
            <input type="hidden" name="negativoId" value={selectedNegativoId} />
            <input type="hidden" name="rullinoId" value={selectedRullino.id} />

            {/* RIFERIMENTI */}
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Riferimenti
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Data stampa" name="dataStampa">
                  <input type="date" id="dataStampa" name="dataStampa" className={inputClass} />
                </Field>
                <Field label="Carta fotografica" name="carta">
                  <input
                    type="text"
                    id="carta"
                    name="carta"
                    placeholder="Marca e tipo"
                    className={inputClass}
                  />
                </Field>
                <Field label="Formato stampa" name="formatoStampa">
                  <input
                    type="text"
                    id="formatoStampa"
                    name="formatoStampa"
                    placeholder="es. 18x24"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* INGRANDITORE */}
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Ingranditore
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Filtro contrasto" name="filtroContrasto">
                  <input
                    type="text"
                    id="filtroContrasto"
                    name="filtroContrasto"
                    placeholder="es. 2.5"
                    className={inputClass}
                  />
                </Field>
                <Field label="Apertura obiettivo" name="aperturaObj">
                  <input
                    type="text"
                    id="aperturaObj"
                    name="aperturaObj"
                    placeholder="es. f/8"
                    className={inputClass}
                  />
                </Field>
                <Field label="Tempo esposizione" name="tempoEsposizione">
                  <input
                    type="text"
                    id="tempoEsposizione"
                    name="tempoEsposizione"
                    placeholder="es. 12 sec"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* CHIMICA */}
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Chimica camera oscura
              </h3>
              <div className="overflow-x-auto">
                <div className="grid min-w-[480px] grid-cols-[80px_1fr_90px_1fr] items-center gap-x-3">
                  <div />
                  <div className="py-1 text-xs font-medium text-gray-400 dark:text-gray-500">Prodotto</div>
                  <div className="py-1 text-xs font-medium text-gray-400 dark:text-gray-500">Temp. (°C)</div>
                  <div className="py-1 text-xs font-medium text-gray-400 dark:text-gray-500">Tempo</div>
                  <ChemRow label="Sviluppo" prefix="svil" />
                  <ChemRow label="Stop" prefix="stop" />
                  <ChemRow label="Fissaggio" prefix="fiss" />
                </div>
              </div>
            </section>

            {/* INTERVENTI E NOTE */}
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Interventi e note
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Interventi" name="interventi">
                  <textarea
                    id="interventi"
                    name="interventi"
                    placeholder="Mascherature, bruciature, variazioni di tempo…"
                    rows={4}
                    className={inputClass + " resize-y"}
                  />
                </Field>
                <Field label="Note" name="note">
                  <textarea
                    id="note"
                    name="note"
                    placeholder="Osservazioni generali sulla sessione…"
                    rows={4}
                    className={inputClass + " resize-y"}
                  />
                </Field>
              </div>
            </section>

            <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50"
              >
                {isPending ? "Salvataggio…" : "Crea sessione"}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                ← Indietro
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function StepBubble({ n, current }: { n: number; current: number }) {
  const active = current >= n;
  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        active
          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          : "border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
      }`}
    >
      {n}
    </div>
  );
}

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

function ChemRow({ label, prefix }: { label: string; prefix: "svil" | "stop" | "fiss" }) {
  return (
    <div className="contents">
      <div className="flex items-center py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </div>
      <div className="py-1">
        <input
          type="text"
          name={`${prefix}_prodotto`}
          placeholder="Prodotto"
          className={inputClass}
        />
      </div>
      <div className="py-1">
        <input
          type="number"
          name={`${prefix}_temp`}
          placeholder="°C"
          step="0.1"
          className={inputClass}
        />
      </div>
      <div className="py-1">
        <input
          type="text"
          name={`${prefix}_tempo`}
          placeholder="es. 1 min 30 sec"
          className={inputClass}
        />
      </div>
    </div>
  );
}
