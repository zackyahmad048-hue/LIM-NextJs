"use client";

import Link from "next/link";
import { toHijri } from "hijri-converter";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, Timer } from "lucide-react";
import {
  calculatePrayerTimes,
  dateToDecimalHoursInZone,
  formatTime,
  getNextPrayer,
  type PrayerTimes,
} from "@/lib/astroCalc";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

type ScheduleMode = "standard" | "istiwa";

const ROWS: Array<{ key: keyof PrayerTimes | "imsak"; label: string }> = [
  { key: "imsak", label: "Imsak" },
  { key: "fajr", label: "Subuh" },
  { key: "sunrise", label: "Terbit" },
  { key: "dhuhr", label: "Dzuhur" },
  { key: "asr", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isya" },
];

const PRAYER_INDONESIA: Record<string, string> = {
  fajr: "Subuh",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Widget jadwal shalat untuk hero: mode WIB/WITA/WIT dan istiwa (WIS). */
export function PrayerScheduleWidget() {
  const { location, locationName, requestGPSLocation } = useGeolocation();
  const [mode, setMode] = useState<ScheduleMode>("standard");
  const [now, setNow] = useState<Date | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!requestedRef.current) {
      requestedRef.current = true;
      requestGPSLocation();
    }
  }, [requestGPSLocation]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const isIstiwa = mode === "istiwa";
  const calculation = calculatePrayerTimes(
    now,
    location,
    isIstiwa,
    3,
  );
  const { timesFormatted, timesNumeric } = calculation;

  const imsakNumeric = timesNumeric.fajr - 10 / 60;
  const imsakFormatted = formatTime(imsakNumeric);

  // Current time expressed in the active location's frame (not the device's),
  // so it matches the timezone the prayer times are computed in.
  const currentDec = dateToDecimalHoursInZone(now, location.timezone);
  const activeHourDec = isIstiwa
    ? (currentDec - calculation.transitStandard + 36) % 24
    : currentDec;

  const { key: nextKey, diffHours } = getNextPrayer(timesNumeric, activeHourDec);
  const countdown = `${Math.floor(diffHours)}j ${pad(
    Math.floor((diffHours % 1) * 60),
  )}m ${pad(Math.round((((diffHours % 1) * 60) % 1) * 60))}s`;

  const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const gregorian = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);

  const timezoneLabel = isIstiwa ? "WIS" : location.timezoneName || "WIB";

  return (
    <div className="rounded-md border border-primary/25 bg-card">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-data text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Jadwal Shalat
          </p>
          <span className="font-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {timezoneLabel}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
          {gregorian}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {hijri.hd} {HIJRI_MONTHS[hijri.hm - 1]} {hijri.hy} H
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
          {locationName}
        </p>
      </div>

      <div className="px-5 pt-4">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) setMode(value as ScheduleMode);
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Mode waktu jadwal shalat"
          className="w-full"
        >
          <ToggleGroupItem value="standard" className="flex-1 font-data text-xs">
            {location.timezoneName || "WIB"}
          </ToggleGroupItem>
          <ToggleGroupItem value="istiwa" className="flex-1 font-data text-xs">
            WIS
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ul className="px-5 py-3">
        {ROWS.map((row) => {
          const isNext =
            row.key !== "imsak" && row.key !== "sunrise" && row.key === nextKey;
          const time =
            row.key === "imsak"
              ? imsakFormatted
              : timesFormatted[row.key as keyof PrayerTimes];
          return (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 border-b border-border/40 py-2.5 last:border-b-0"
            >
              <span
                className={`flex items-center gap-2 text-sm ${
                  isNext ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {row.label}
                {isNext && (
                  <span
                    className="rounded-full border border-primary/40 px-2 py-0.5 font-data text-[10px] uppercase tracking-[0.15em]"
                    role="status"
                  >
                    Menuju
                  </span>
                )}
              </span>
              <span
                className={`font-data text-sm tabular-nums ${
                  isNext ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {time}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border px-5 py-3.5">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Timer className="h-3.5 w-3.5 text-primary" aria-hidden />
          <span>
            Menuju{" "}
            <strong className="font-semibold text-foreground">
              {PRAYER_INDONESIA[nextKey]}
            </strong>{" "}
            dalam{" "}
            <strong className="font-data tabular-nums text-foreground">
              {countdown}
            </strong>
          </span>
        </p>
        <Link
          href="/falak/jadwal-shalat"
          className="mt-3 block text-right font-data text-[11px] font-medium uppercase tracking-[0.2em] text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Jadwal Lengkap
        </Link>
      </div>
    </div>
  );
}