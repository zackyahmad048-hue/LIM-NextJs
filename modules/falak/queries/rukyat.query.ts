import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { ObservationStatus } from "@/generated/client";

export async function getRukyatByStatus(status: ObservationStatus, take = 50) {
  return prisma.falakRukyat.findMany({
    where: { status },
    orderBy: { observationDate: "desc" },
    take,
  });
}

export async function getAllRukyat(take = 50) {
  return prisma.falakRukyat.findMany({
    orderBy: { observationDate: "desc" },
    take,
  });
}

export async function getRukyatById(id: string) {
  return prisma.falakRukyat.findUnique({ where: { id } });
}
