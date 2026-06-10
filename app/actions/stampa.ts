"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type FormState = { errors: Record<string, string> } | null;

function extractStampaData(formData: FormData) {
  const get = (k: string) => (formData.get(k) as string) || null;
  const getFloat = (k: string) => {
    const v = formData.get(k) as string;
    return v ? parseFloat(v) : null;
  };
  const getDate = (k: string) => {
    const v = formData.get(k) as string;
    return v ? new Date(v) : null;
  };

  return {
    dataStampa:       getDate("dataStampa"),
    carta:            get("carta"),
    formatoStampa:    get("formatoStampa"),
    filtroContrasto:  get("filtroContrasto"),
    aperturaObj:      get("aperturaObj"),
    tempoEsposizione: get("tempoEsposizione"),
    svil_prodotto:    get("svil_prodotto"),
    svil_temp:        getFloat("svil_temp"),
    svil_tempo:       get("svil_tempo"),
    stop_prodotto:    get("stop_prodotto"),
    stop_temp:        getFloat("stop_temp"),
    stop_tempo:       get("stop_tempo"),
    fiss_prodotto:    get("fiss_prodotto"),
    fiss_temp:        getFloat("fiss_temp"),
    fiss_tempo:       get("fiss_tempo"),
    interventi:       get("interventi"),
    note:             get("note"),
  };
}

export async function createStampa(
  negativoId: number,
  rullinoId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = extractStampaData(formData);
  const stampa = await prisma.sessioneStampa.create({ data: { ...data, negativoId } });
  redirect(`/rullino/${rullinoId}/negativo/${negativoId}/stampa/${stampa.id}`);
}

export async function updateStampa(
  id: number,
  negativoId: number,
  rullinoId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = extractStampaData(formData);
  await prisma.sessioneStampa.update({ where: { id }, data });
  redirect(`/rullino/${rullinoId}/negativo/${negativoId}/stampa/${id}`);
}

export async function deleteStampa(
  id: number,
  negativoId: number,
  rullinoId: number
): Promise<void> {
  await prisma.sessioneStampa.delete({ where: { id } });
  redirect(`/rullino/${rullinoId}/negativo/${negativoId}`);
}
