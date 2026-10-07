import type { PrayerMethod } from "@/generated/client";
import { falakPrayerTimeRepository } from "../infrastructure/repository";



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
