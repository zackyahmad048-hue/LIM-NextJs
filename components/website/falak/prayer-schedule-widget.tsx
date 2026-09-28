"use client";

import Link from "next/link";
import { toHijri } from "hijri-converter";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
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
import { PrayerWidgetSkeleton } from "@/components/website/ui/skeleton";

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

/** Widget jadwal shalat untuk hero — glassmorphism style. */
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
    const immediate = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(timer);
    };
  }, []);

  const isIstiwa = mode === "istiwa";
  const ready = now !== null;
  const calculation = now ? calculatePrayerTimes(now, location, isIstiwa, 3) : null;
  const timesFormatted = calculation?.timesFormatted;
  const timesNumeric = calculation?.timesNumeric;

  if (!ready) {
    return <PrayerWidgetSkeleton />;
  }

  const timeFor = (key: keyof PrayerTimes | "imsak"): string => {
    if (key === "imsak") {
      return timesNumeric ? formatTime(timesNumeric.fajr - 10 / 60) : "--:--";
    }
    return timesFormatted?.[key] ?? "--:--";
  };

  let nextKey: keyof PrayerTimes | null = null;
  let countdown = "--j --m --s";
  if (now && timesNumeric) {
    const currentDec = dateToDecimalHoursInZone(now, location.timezone);
    const activeHourDec = isIstiwa
      ? (currentDec - (calculation?.transitStandard ?? 0) + 36) % 24
      : currentDec;

    const next = getNextPrayer(timesNumeric, activeHourDec);
    nextKey = next.key;
    const diffHours = next.diffHours;
    countdown = `${Math.floor(diffHours)}j ${pad(
      Math.floor((diffHours % 1) * 60),
    )}m ${pad(Math.round((((diffHours % 1) * 60) % 1) * 60))}s`;
  }

  const gregorian = now
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now)
    : "-";

  const hijri = now
    ? toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate())
    : null;

  const clockDec =
    now && calculation
      ? isIstiwa
        ? (() => {
            const currentDec = dateToDecimalHoursInZone(now, location.timezone);
            return (currentDec - (calculation.transitStandard ?? 0) + 36) % 24;
          })()
        : dateToDecimalHoursInZone(now, location.timezone)
      : null;

  const clock = clockDec !== null ? formatTime(clockDec, true) : "--:--:--";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
      {/* Subtle gradient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.03]"
      />

      <div className="relative">
        {/* Header — clock + countdown */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-data text-[2.5rem] font-bold leading-none tracking-tight tabular-nums text-foreground">
                {clock}
              </p>
              <p className="mt-2 text-sm text-foreground/60">{gregorian}</p>
              {hijri && (
                <p className="mt-0.5 font-ar text-xs text-foreground/40">
                  {hijri.hd} {HIJRI_MONTHS[hijri.hm - 1]} {hijri.hy} H
                </p>
              )}
            </div>

            {nextKey && (
              <div className="flex flex-col items-end gap-1 pt-1">
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
                  {PRAYER_INDONESIA[nextKey]}
                </span>
                <span className="font-data text-xs tabular-nums text-foreground/50">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-foreground/40">
            <MapPin className="h-3 w-3" aria-hidden />
            {locationName}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Mode toggle */}
        <div className="px-6 pt-4 pb-3">
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
            className="w-full rounded-full border-white/10 bg-white/5 p-0.5"
          >
            <ToggleGroupItem value="standard" className="flex-1 rounded-full font-data text-[11px] data-[state=on]:bg-primary/15 data-[state=on]:text-primary">
              {location.timezoneName || "WIB"}
            </ToggleGroupItem>
            <ToggleGroupItem value="istiwa" className="flex-1 rounded-full font-data text-[11px] data-[state=on]:bg-primary/15 data-[state=on]:text-primary">
              WIS
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Prayer times list */}
        <ul className="px-6 pb-3">
          {ROWS.map((row) => {
            const isNext =
              ready &&
              row.key !== "imsak" &&
              row.key !== "sunrise" &&
              row.key === nextKey;
            const time = timeFor(row.key);
            return (
              <li
                key={row.key}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                  isNext
                    ? "bg-primary/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isNext && (
                    <Navigation className="h-3 w-3 text-primary" aria-hidden />
                  )}
                  <span
                    className={`text-sm ${
                      isNext ? "font-semibold text-primary" : "text-foreground/80"
                    }`}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className={`font-data text-sm tabular-nums ${
                    isNext ? "font-semibold text-primary" : "text-foreground/60"
                  }`}
                >
                  {time}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2">
          <Link
            href="/falak/jadwal-shalat"
            className="block rounded-full bg-white/5 py-2 text-center text-xs font-medium text-foreground/50 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            Lihat Jadwal Lengkap
          </Link>
        </div>
      </div>
    </div>
  );
}
