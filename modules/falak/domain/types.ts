import type {
  PrayerMethod,
  ObservationStatus,
  EclipseType,
  HijriMethod,
} from "@/generated/client";

export type {
  PrayerMethod,
  ObservationStatus,
  EclipseType,
  HijriMethod,
};

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

 
export interface HijriDate {
  year: number;
  month: number;
  day: number;
}
