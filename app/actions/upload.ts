"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase-server";

async function uploadToStorage(
  file: File,
  path: string
): Promise<{ error?: string; url?: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}

export async function uploadNegativoImage(
  negativoId: number,
  rullinoId: number,
  formData: FormData
): Promise<{ error?: string; url?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Nessun file selezionato" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const result = await uploadToStorage(file, `negativi/${negativoId}.${ext}`);
  if (result.error) return result;

  await prisma.negativo.update({
    where: { id: negativoId },
    data: { scansioneUrl: result.url },
  });

  revalidatePath(`/rullino/${rullinoId}/negativo/${negativoId}`);
  return { url: result.url };
}

export async function uploadStampaImage(
  stampaId: number,
  negativoId: number,
  rullinoId: number,
  formData: FormData
): Promise<{ error?: string; url?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Nessun file selezionato" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const result = await uploadToStorage(file, `stampe/${stampaId}.${ext}`);
  if (result.error) return result;

  await prisma.sessioneStampa.update({
    where: { id: stampaId },
    data: { fotoStampaUrl: result.url },
  });

  revalidatePath(`/rullino/${rullinoId}/negativo/${negativoId}/stampa/${stampaId}`);
  return { url: result.url };
}
