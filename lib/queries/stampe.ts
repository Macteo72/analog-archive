import { prisma } from "@/lib/prisma";

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
