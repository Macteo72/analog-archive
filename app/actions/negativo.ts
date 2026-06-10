"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type FormState = { errors: Record<string, string> } | null;

export async function createNegativo(
  rullinoId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = formData.get("numeroFotogramma") as string;
  const numeroFotogramma = parseInt(raw, 10);
  const scena = (formData.get("scena") as string) || null;
  const descrizione = (formData.get("descrizione") as string) || null;

  const errors: Record<string, string> = {};
  if (!raw || isNaN(numeroFotogramma) || numeroFotogramma < 1) {
    errors.numeroFotogramma = "Inserire un numero valido (≥ 1)";
  } else {
    const exists = await prisma.negativo.findUnique({
      where: { rullinoId_numeroFotogramma: { rullinoId, numeroFotogramma } },
    });
    if (exists) errors.numeroFotogramma = `Il fotogramma ${numeroFotogramma} esiste già in questo rullino`;
  }
  if (Object.keys(errors).length > 0) return { errors };

  const negativo = await prisma.negativo.create({
    data: { rullinoId, numeroFotogramma, scena, descrizione },
  });

  redirect(`/rullino/${rullinoId}/negativo/${negativo.id}`);
}

export async function updateNegativo(
  id: number,
  rullinoId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const scena = (formData.get("scena") as string) || null;
  const descrizione = (formData.get("descrizione") as string) || null;

  await prisma.negativo.update({ where: { id }, data: { scena, descrizione } });

  redirect(`/rullino/${rullinoId}/negativo/${id}`);
}

export async function deleteNegativo(id: number, rullinoId: number): Promise<void> {
  await prisma.negativo.delete({ where: { id } });
  redirect(`/rullino/${rullinoId}`);
}
