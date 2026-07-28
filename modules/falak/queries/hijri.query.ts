import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { HijriMethod } from "@/generated/client";

export async function getHijriCalendar(year: number, month: number, method: HijriMethod) {
  return prisma.falakHijriCalendar.findMany({
    where: {
      hijriYear: year,
      hijriMonth: month,
      method,
    },
    orderBy: { hijriDay: "asc" },
  });
}

export async function getHijriForDate(date: Date, method: HijriMethod) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.falakHijriCalendar.findFirst({
    where: {
      gregorianDate: startOfDay,
      method,
    },
  });
}
