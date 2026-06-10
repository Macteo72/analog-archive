"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type FormState = { errors: Record<string, string> } | null;

async function generateCodiceArchivio(formato: string): Promise<string> {
  const existing = await prisma.rullino.findMany({
    where: { formato },
    select: { codiceArchivio: true },
  });

  let maxNum = 0;
  for (const r of existing) {
    const parts = r.codiceArchivio.split("/");
    if (parts.length === 2) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }

  return `${formato}/${String(maxNum + 1).padStart(2, "0")}`;
}

function extractFormData(formData: FormData) {
  const get = (key: string) => (formData.get(key) as string) || null;
  const getNum = (key: string) => {
    const v = formData.get(key) as string;
    return v ? parseInt(v, 10) : null;
  };
  const getFloat = (key: string) => {
    const v = formData.get(key) as string;
    return v ? parseFloat(v) : null;
  };
  const getDate = (key: string) => {
    const v = formData.get(key) as string;
    return v ? new Date(v) : null;
  };

  return {
    pellicola: (formData.get("pellicola") as string) ?? "",
    sensibilita: getNum("sensibilita"),
    fotocamera: get("fotocamera"),
    focale: get("focale"),
    dataScatti: getDate("dataScatti"),
    scene: get("scene"),
    provinoContatto: formData.get("provinoContatto") === "on",
    prodottoSviluppo: get("prodottoSviluppo"),
    diluizione: get("diluizione"),
    tempoSviluppo: get("tempoSviluppo"),
    tempSviluppo: getFloat("tempSviluppo"),
    dataSviluppo: getDate("dataSviluppo"),
    noteSviluppo: get("noteSviluppo"),
  };
}

export async function createRullino(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const formato = (formData.get("formato") as string) || "135";
  const data = extractFormData(formData);

  const codiceArchivio = await generateCodiceArchivio(formato);

  const rullino = await prisma.rullino.create({
    data: { ...data, formato, codiceArchivio },
  });

  redirect(`/rullino/${rullino.id}`);
}

export async function updateRullino(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = extractFormData(formData);

  await prisma.rullino.update({ where: { id }, data });

  redirect(`/rullino/${id}`);
}

export async function deleteRullino(id: number): Promise<void> {
  await prisma.rullino.delete({ where: { id } });
  redirect("/");
}
