import type { PrayerMethod } from "@/generated/client";
import { falakPrayerTimeRepository } from "../infrastructure/repository";

export async function getTodayPrayerTimes(
  latitude: number,
  longitude: number,
  method: PrayerMethod,
) {
  return falakPrayerTimeRepository.findToday(latitude, longitude, method);
}

export async function getPrayerTimesForDateRange(
  latitude: number,
  longitude: number,
  method: PrayerMethod,
  startDate: Date,
  endDate: Date,
) {
  return falakPrayerTimeRepository.findByDateRange(
    latitude,
    longitude,
    method,
    startDate,
    endDate,
  );
}

export async function getRecentPrayerTimes(
  latitude: number,
  longitude: number,
  method: PrayerMethod,
  take = 7,
) {
  return falakPrayerTimeRepository.findRecent(
    latitude,
    longitude,
    method,
    take,
  );
}

export async function getAllPrayerTimes(
  latitude: number,
  longitude: number,
  method: PrayerMethod,
) {
  return falakPrayerTimeRepository.findAllByCoordinate(
    latitude,
    longitude,
    method,
  );
}
