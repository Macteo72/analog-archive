import { prisma } from "@/lib/prisma";

export async function getAllStampe() {
  return prisma.sessioneStampa.findMany({
    select: {
      id: true,
      dataStampa: true,
      carta: true,
      negativo: {
        select: {
          id: true,
          numeroFotogramma: true,
          scena: true,
          rullino: {
            select: { id: true, codiceArchivio: true },
          },
        },
      },
    },
    orderBy: [
      { dataStampa: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
  });
}

export async function getStampaById(id: number) {
  return prisma.sessioneStampa.findUnique({
    where: { id },
    include: {
      negativo: {
        include: { rullino: true },
      },
    },
  });
}
