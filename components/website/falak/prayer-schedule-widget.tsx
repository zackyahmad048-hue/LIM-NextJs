"use client";

import Link from "next/link";
import { toHijri } from "hijri-converter";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
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

const PASARAN_CYCLE = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"] as const;

// Anchor: 1 Jan 2000 = Legi (Sabtu Legi, neptu 14).
const PASARAN_ANCHOR = Date.UTC(2000, 0, 1);

function getPasaran(date: Date): string {
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((day - PASARAN_ANCHOR) / 86_400_000);
  return PASARAN_CYCLE[((diff % 5) + 5) % 5];
}

/** Widget jadwal shalat untuk hero: mode WIB/WITA/WIT dan istiwa (WIS). */
export function PrayerScheduleWidget() {
  const { location, locationName, isGPS, requestGPSLocation } = useGeolocation();
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

  // calculatePrayerTimes only reads year/month/day, so it only needs to run
  // once per day + location + mode. The 1s tick no longer calls the astronomy.
  const dayKey = now
    ? `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
    : "";
  const dayDate = useMemo(() => {
    if (!dayKey) return null;
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(y, m, d);
  }, [dayKey]);
  const calculation = useMemo(
    () =>
      dayDate ? calculatePrayerTimes(dayDate, location, isIstiwa, 3) : null,
    [dayDate, location, isIstiwa],
  );

  const timesFormatted = calculation?.timesFormatted;
  const timesNumeric = calculation?.timesNumeric;

  const timeFor = (key: keyof PrayerTimes | "imsak"): string => {
    if (key === "imsak") {
      return timesNumeric ? formatTime(timesNumeric.fajr - 10 / 60) : "--:--";
    }
    return timesFormatted?.[key] ?? "--:--";
  };

  let nextKey: keyof PrayerTimes | null = null;
  if (now && timesNumeric) {
    // Current time expressed in the active location's frame (not the device's),
    // so it matches the timezone the prayer times are computed in.
    const currentDec = dateToDecimalHoursInZone(now, location.timezone);
    const activeHourDec = isIstiwa
      ? (currentDec - (calculation?.transitStandard ?? 0) + 36) % 24
      : currentDec;

    const next = getNextPrayer(timesNumeric, activeHourDec);
    nextKey = next.key;
  }

  const weekdayName = now
    ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(now)
    : "-";
  const pasaranName = now ? getPasaran(now) : "";
  const masehiDate = now
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now)
    : "-";
  const gregorian = now ? `${weekdayName} ${pasaranName} - ${masehiDate}` : "-";

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
    <div className="glass glass-tint-primary rounded-xl ring-1 ring-inset ring-primary/10 shadow-sm shadow-primary/5">
      <div className="border-b border-border px-3 py-3 text-center sm:px-5 sm:py-4">
        <p className="font-data text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
          Jadwal Shalat
        </p>

        <div className="mt-1.5 flex items-baseline justify-center gap-2 sm:mt-2 sm:gap-3">
          <p className="font-data text-2xl font-semibold leading-none tabular-nums text-foreground sm:text-3xl">
            {clock}
          </p>
          <span className="font-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
            {timezoneLabel}
          </span>
        </div>

        <p className="mt-1.5 text-xs text-foreground sm:mt-2 sm:text-sm">
          {gregorian}
        </p>

        <p className="mt-1.5 text-[11px] text-muted-foreground sm:text-xs">
          {hijri
            ? `${hijri.hd} ${HIJRI_MONTHS[hijri.hm - 1]} ${hijri.hy} H`
            : "-"}
        </p>

        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground sm:mt-2 sm:text-xs">
          <MapPin
            className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5"
            aria-hidden
          />
          {isGPS ? "Titik GPS" : locationName}
        </p>
        {isGPS && (
          <p className="mt-0.5 font-data text-[10px] tabular-nums text-muted-foreground sm:text-[11px]">
            {location.latitude.toFixed(3)}°, {location.longitude.toFixed(3)}°
          </p>
        )}
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
          <ToggleGroupItem
            value="standard"
            className="flex-1 font-data text-[11px] sm:text-xs"
          >
            {location.timezoneName || "WIB"}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="istiwa"
            className="flex-1 font-data text-[11px] sm:text-xs"
          >
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
              className="flex items-center justify-between gap-2 py-2 sm:gap-3 sm:py-2.5"
            >
              <span
                className={`text-xs sm:text-sm ${
                  isNext ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {row.label}
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
        <Link
          href="/falak/jadwal-shalat"
          className="block text-right font-data text-[10px] font-medium uppercase tracking-[0.2em] text-foreground underline-offset-4 hover:text-primary hover:underline sm:text-[11px]"
        >
          Jadwal Lengkap
        </Link>
      </div>
    </div>
  );
}
