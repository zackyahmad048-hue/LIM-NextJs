import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { PrayerMethod } from "@/generated/client";

export async function getTodayPrayerTimes(latitude: number, longitude: number, method: PrayerMethod) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.falakPrayerTime.findFirst({
    where: {
      latitude,
      longitude,
      calculationMethod: method,
      prayerDate: today,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPrayerTimesForDateRange(
  latitude: number,
  longitude: number,
  method: PrayerMethod,
  startDate: Date,
  endDate: Date
) {
  return prisma.falakPrayerTime.findMany({
    where: {
      latitude,
      longitude,
      calculationMethod: method,
      prayerDate: { gte: startDate, lte: endDate },
    },
    orderBy: { prayerDate: "asc" },
  });
}

export async function getRecentPrayerTimes(latitude: number, longitude: number, method: PrayerMethod, take = 7) {
  return prisma.falakPrayerTime.findMany({
    where: {
      latitude,
      longitude,
      calculationMethod: method,
    },
    orderBy: { prayerDate: "desc" },
    take,
  });
}

export async function getAllPrayerTimes(latitude: number, longitude: number, method: PrayerMethod) {
  return prisma.falakPrayerTime.findMany({
    where: {
      latitude,
      longitude,
      calculationMethod: method,
    },
    orderBy: { prayerDate: "desc" },
  });
}
