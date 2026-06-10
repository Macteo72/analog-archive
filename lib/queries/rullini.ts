import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface RullinoFilters {
  formato?: string;
  pellicola?: string;
  fotocamera?: string;
  dataFrom?: string;
  dataTo?: string;
  q?: string;
  sort?: string;
}

export async function getRullini(filters: RullinoFilters) {
  const { formato, pellicola, fotocamera, dataFrom, dataTo, q, sort } = filters;

  const where: Prisma.RullinoWhereInput = {
    ...(formato && { formato }),
    ...(pellicola && { pellicola: { contains: pellicola, mode: "insensitive" } }),
    ...(fotocamera && { fotocamera: { contains: fotocamera, mode: "insensitive" } }),
    ...((dataFrom || dataTo) && {
      dataScatti: {
        ...(dataFrom && { gte: new Date(dataFrom) }),
        ...(dataTo && { lte: new Date(dataTo) }),
      },
    }),
    ...(q && {
      OR: [
        { scene: { contains: q, mode: "insensitive" } },
        { pellicola: { contains: q, mode: "insensitive" } },
        { noteSviluppo: { contains: q, mode: "insensitive" } },
        { negativi: { some: { scena: { contains: q, mode: "insensitive" } } } },
        { negativi: { some: { descrizione: { contains: q, mode: "insensitive" } } } },
        {
          negativi: {
            some: { stampe: { some: { note: { contains: q, mode: "insensitive" } } } },
          },
        },
      ],
    }),
  };

  const orderBy: Prisma.RullinoOrderByWithRelationInput =
    sort === "codice"
      ? { codiceArchivio: "asc" }
      : sort === "data_asc"
        ? { dataScatti: { sort: "asc", nulls: "last" } }
        : { dataScatti: { sort: "desc", nulls: "last" } };

  return prisma.rullino.findMany({
    where,
    include: { negativi: { select: { id: true } } },
    orderBy,
  });
}

export async function getRullinoById(id: number) {
  return prisma.rullino.findUnique({
    where: { id },
    include: {
      negativi: {
        select: { id: true, numeroFotogramma: true, scena: true },
        orderBy: { numeroFotogramma: "asc" },
      },
    },
  });
}

export async function getDistinctPellicole() {
  const rows = await prisma.rullino.findMany({
    select: { pellicola: true },
    distinct: ["pellicola"],
    orderBy: { pellicola: "asc" },
  });
  return rows.map((r) => r.pellicola);
}

export async function getDistinctFotocamere() {
  const rows = await prisma.rullino.findMany({
    where: { fotocamera: { not: null } },
    select: { fotocamera: true },
    distinct: ["fotocamera"],
    orderBy: { fotocamera: "asc" },
  });
  return rows.map((r) => r.fotocamera).filter(Boolean) as string[];
}
