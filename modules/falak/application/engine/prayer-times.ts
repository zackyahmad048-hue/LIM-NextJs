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

 
export function calculateQibla(coordinate: Coordinate): number {
  const coords = new Coordinates(coordinate.latitude, coordinate.longitude);
  return qiblaCalc(coords);
}
