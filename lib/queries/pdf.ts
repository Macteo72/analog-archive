import { prisma } from "@/lib/prisma";

export async function getRullinoForPdf(id: number) {
  return prisma.rullino.findUnique({
    where: { id },
    include: {
      negativi: {
        select: {
          id: true,
          numeroFotogramma: true,
          scena: true,
          descrizione: true,
        },
        orderBy: { numeroFotogramma: "asc" },
      },
    },
  });
}

export async function getNegativoForPdf(id: number) {
  return prisma.negativo.findUnique({
    where: { id },
    include: {
      rullino: true,
      stampe: {
        orderBy: [{ dataStampa: "desc" }, { createdAt: "desc" }],
      },
    },
  });
}
