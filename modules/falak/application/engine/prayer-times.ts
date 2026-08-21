import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  Qibla as qiblaCalc,
} from "adhan";
import type { PrayerMethod } from "@/generated/client";
import type { Coordinate, PrayerTimeResult } from "../../domain/types";

function resolveCalculationMethod(method: PrayerMethod) {
  switch (method) {
    case "KEMENAG":
      return CalculationMethod.MuslimWorldLeague();
    case "MUHAMMADIYAH":
      return CalculationMethod.Singapore();
    case "UMMAH_AL_QURA":
      return CalculationMethod.UmmAlQura();
    case "EGYPTIAN":
      return CalculationMethod.Egyptian();
    case "ISNA":
      return CalculationMethod.NorthAmerica();
    case "MWL":
      return CalculationMethod.MuslimWorldLeague();
    default:
      return CalculationMethod.MuslimWorldLeague();
  }
}

export function calculatePrayerTimes(
  coordinate: Coordinate,
  date: Date,
  method: PrayerMethod,
): PrayerTimeResult {
  const coords = new Coordinates(coordinate.latitude, coordinate.longitude);
  const params = resolveCalculationMethod(method);

  const pt = new PrayerTimes(coords, date, params);

  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

export function calculatePrayerTimesForMonth(
  coordinate: Coordinate,
  year: number,
  month: number,
  method: PrayerMethod,
): PrayerTimeResult[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const results: PrayerTimeResult[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    results.push(calculatePrayerTimes(coordinate, date, method));
  }

  return results;
}

export function calculateQibla(coordinate: Coordinate): number {
  const coords = new Coordinates(coordinate.latitude, coordinate.longitude);
  return qiblaCalc(coords);
}
