"use client";

import Link from "next/link";
import { toHijri } from "hijri-converter";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock, MapPin, Timer } from "lucide-react";
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
    // Populate right after hydration (deferred one macrotask so it never runs
    // synchronously inside the effect) — the placeholder shell holds the size,
    // so there is never a sudden, layout-shifting pop-in.
    const immediate = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(timer);
    };
  }, []);

  const isIstiwa = mode === "istiwa";
  // The widget always renders (reserved height) — it never returns null, so
  // the hero never jumps in height when the timer first ticks.
  const ready = now !== null;
  const calculation = now ? calculatePrayerTimes(now, location, isIstiwa, 3) : null;
  const timesFormatted = calculation?.timesFormatted;
  const timesNumeric = calculation?.timesNumeric;

  const timeFor = (key: keyof PrayerTimes | "imsak"): string => {
    if (key === "imsak") {
      return timesNumeric ? formatTime(timesNumeric.fajr - 10 / 60) : "--:--";
    }
    return timesFormatted?.[key] ?? "--:--";
  };

  let nextKey: keyof PrayerTimes | null = null;
  let countdown = "--j --m --s";
  if (now && timesNumeric) {
    // Current time expressed in the active location's frame (not the device's),
    // so it matches the timezone the prayer times are computed in.
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
        month: "short",
        year: "numeric",
      }).format(now)
    : "–";

  const hijri = now
    ? toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate())
    : null;

  const timezoneLabel = isIstiwa ? "WIS" : location.timezoneName || "WIB";

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
    <div className="rounded-xl border border-primary/25 bg-card">
      <div className="border-b border-border px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-data text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
            Jadwal Shalat
          </p>
          <span className="font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
            {timezoneLabel}
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-foreground sm:mt-2 sm:text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" aria-hidden />
          {gregorian}
        </p>
        <p className="mt-1 flex items-center gap-1.5 font-data text-lg font-semibold tabular-nums text-foreground sm:mt-1.5 sm:text-xl">
          <Clock className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" aria-hidden />
          {clock}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
          {hijri
            ? `${hijri.hd} ${HIJRI_MONTHS[hijri.hm - 1]} ${hijri.hy} H`
            : "–"}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground sm:mt-2 sm:text-xs">
          <MapPin className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" aria-hidden />
          {locationName}
        </p>
      </div>

      <div className="px-3 pt-3 sm:px-5 sm:pt-4">
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
          <ToggleGroupItem value="standard" className="flex-1 font-data text-[11px] sm:text-xs">
            {location.timezoneName || "WIB"}
          </ToggleGroupItem>
          <ToggleGroupItem value="istiwa" className="flex-1 font-data text-[11px] sm:text-xs">
            WIS
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ul className="px-3 py-2 sm:px-5 sm:py-3">
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
              className="flex items-center justify-between gap-2 border-b border-border/40 py-2 last:border-b-0 sm:gap-3 sm:py-2.5"
            >
              <span
                className={`flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm ${
                  isNext ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {row.label}
                {isNext && (
                  <span
                    className="rounded-full border border-primary/40 px-1.5 py-0.5 font-data text-[9px] uppercase tracking-[0.15em] sm:px-2 sm:text-[10px]"
                    role="status"
                  >
                    Menuju
                  </span>
                )}
              </span>
              <span
                className={`font-data text-xs tabular-nums sm:text-sm ${
                  isNext ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {time}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border px-3 py-3 sm:px-5 sm:py-3.5">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:text-xs">
          <Timer className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" aria-hidden />
          <span>
            Menuju{" "}
            <strong className="font-semibold text-foreground">
              {nextKey ? PRAYER_INDONESIA[nextKey] : "shalat berikutnya"}
            </strong>{" "}
            dalam{" "}
            <strong className="font-data tabular-nums text-foreground">
              {countdown}
            </strong>
          </span>
        </p>
        <Link
          href="/falak/jadwal-shalat"
          className="mt-2 block text-right font-data text-[10px] font-medium uppercase tracking-[0.2em] text-foreground underline-offset-4 hover:text-primary hover:underline sm:mt-3 sm:text-[11px]"
        >
          Jadwal Lengkap
        </Link>
      </div>
    </div>
  );
}