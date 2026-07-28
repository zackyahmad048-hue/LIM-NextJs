import type { PrayerMethod, ObservationStatus, RukyatResult, EclipseType, HijriMethod } from "@/generated/client";

export type { PrayerMethod, ObservationStatus, RukyatResult, EclipseType, HijriMethod };

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PrayerTimeResult {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface HilalResult {
  altitude: number;
  elongation: number;
  moonAge: number;
  lagTime: number;
  illumination: number;
  sunAzimuth: number;
  moonAzimuth: number;
}

export interface HijriDate {
  year: number;
  month: number;
  day: number;
}
