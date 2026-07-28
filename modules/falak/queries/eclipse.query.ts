import { prisma } from "@/modules/shared/infrastructure/prisma";

export async function getUpcomingEclipses() {
  const now = new Date();
  return prisma.falakEclipse.findMany({
    where: {
      eclipseDate: { gte: now },
    },
    orderBy: { eclipseDate: "asc" },
  });
}

export async function getPastEclipses(take = 10) {
  const now = new Date();
  return prisma.falakEclipse.findMany({
    where: {
      eclipseDate: { lt: now },
    },
    orderBy: { eclipseDate: "desc" },
    take,
  });
}

export async function getEclipseById(id: string) {
  return prisma.falakEclipse.findUnique({ where: { id } });
}
