import { prisma } from "@/lib/prisma";

export async function getNegativoById(id: number) {
  return prisma.negativo.findUnique({
    where: { id },
    include: {
      rullino: true,
      stampe: {
        orderBy: [{ dataStampa: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          dataStampa: true,
          carta: true,
          formatoStampa: true,
          filtroContrasto: true,
          tempoEsposizione: true,
        },
      },
    },
  });
}

export async function getNextNumeroFotogramma(rullinoId: number): Promise<number> {
  const last = await prisma.negativo.findFirst({
    where: { rullinoId },
    orderBy: { numeroFotogramma: "desc" },
    select: { numeroFotogramma: true },
  });
  return (last?.numeroFotogramma ?? 0) + 1;
}
