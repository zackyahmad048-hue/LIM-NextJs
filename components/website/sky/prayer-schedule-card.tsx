"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { toHijri } from "hijri-converter";
import {
  calculatePrayerTimes,
  formatTime,
  getNextPrayer,
  type LocationInfo,
  type PrayerTimes,
} from "@/lib/astroCalc";
import { cn } from "@/lib/utils";

const HOME_NAME = "Kediri, Lirboyo";

const HOME: LocationInfo = {
  latitude: -7.8481,
  longitude: 112.0208,
  timezone: 7,
  timezoneName: "WIB",
};

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

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const PRAYERS: Array<{
  key: keyof PrayerTimes;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "dhuhr", label: "Dzuhur", icon: <Sun className="size-3.5" /> },
  { key: "asr", label: "Ashar", icon: <Sun className="size-3.5" /> },
  { key: "maghrib", label: "Maghrib", icon: <Sunset className="size-3.5" /> },
  { key: "isha", label: "Isya", icon: <Moon className="size-3.5" /> },
  { key: "fajr", label: "Subuh", icon: <Sunrise className="size-3.5" /> },
  { key: "sunrise", label: "Thulu'", icon: <Sunrise className="size-3.5" /> },
];

type Mode = "standar" | "istiwa";

const pad = (n: number) => n.toString().padStart(2, "0");

function wrap24(h: number): number {
  return ((h % 24) + 24) % 24;
}

export function PrayerScheduleCard() {
  const [now, setNow] = useState<Date | null>(() => new Date());
  const [mode, setMode] = useState<Mode>("standar");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const isIstiwa = mode === "istiwa";
  const calculation = calculatePrayerTimes(now, HOME, isIstiwa, 3);
  const timesFormatted = calculation.timesFormatted;
  const timesNumeric = calculation.timesNumeric;

  const wib = new Date(now.getTime() + HOME.timezone * 3600000);
  const wibDec =
    wib.getUTCHours() + wib.getUTCMinutes() / 60 + wib.getUTCSeconds() / 3600;
  const istiwaDec = wrap24(wibDec - calculation.transitStandard + 12);

  const currentDec = isIstiwa ? istiwaDec : wibDec;

  const next = getNextPrayer(timesNumeric, currentDec);
  const nextIndex = PRAYERS.findIndex((prayer) => prayer.key === next.key);
  const diff = next.diffHours;

  const dh = Math.floor(diff);
  const dm = Math.floor((diff - dh) * 60);
  const ds = Math.floor(((diff - dh) * 60 - dm) * 60);

  const standardClockStr = `${pad(wib.getUTCHours())}:${pad(
    wib.getUTCMinutes(),
  )}:${pad(wib.getUTCSeconds())}`;
  const istiwaClockStr = formatTime(istiwaDec, true);

  const deltaMinutes = calculation.deltaMinutes;
  const deltaStr = `${deltaMinutes >= 0 ? "+" : ""}${deltaMinutes.toFixed(
    1,
  )} mnt`;

  const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const gregorian = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${
    MONTH_NAMES[now.getMonth()]
  } ${now.getFullYear()}`;

  const nextLabel = PRAYERS[nextIndex].label;

  return (
    <aside className="w-full max-w-md rounded-2xl border border-primary/15 bg-card p-5 shadow-[0_18px_40px_-20px] shadow-black/25 lg:max-w-sm">
      <div className="border-b border-border/10 pb-3 text-center">
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Jadwal Shalat Hari Ini
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {HOME_NAME}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-full border border-border bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("standar")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            !isIstiwa
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Standar
        </button>
        <button
          type="button"
          onClick={() => setMode("istiwa")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            isIstiwa
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Istiwa&apos;
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="font-mono text-[2rem] font-semibold tabular-nums leading-none tracking-tight text-foreground">
          {isIstiwa ? istiwaClockStr : standardClockStr}
          <span className="ml-2 align-middle text-xs font-medium text-muted-foreground">
            {isIstiwa ? "WIS" : HOME.timezoneName}
          </span>
        </p>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {isIstiwa
            ? `Waktu Istiwa' · selisih ${deltaStr}`
            : `Waktu ${HOME.timezoneName} · ihtiyat +3 menit`}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
        <p className="text-[11px] text-muted-foreground">
          Menuju <span className="font-semibold text-foreground">{nextLabel}</span>
        </p>
        <p className="font-mono text-xs font-semibold tabular-nums text-primary">
          {pad(dh)}:{pad(dm)}:{pad(ds)}
        </p>
      </div>

      <div className="mt-4 border-t border-border/10 pt-3 text-center">
        <p className="text-[11px] text-muted-foreground">{gregorian}</p>
        <p className="mt-0.5 font-sans text-xs font-medium text-foreground">
          {hijri.hd} {HIJRI_MONTHS[hijri.hm - 1]} {hijri.hy} H
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {PRAYERS.map((prayer, i) => (
          <div
            key={prayer.key}
            className={cn(
              "rounded-lg border px-2 py-2.5 text-center transition-colors",
              i === nextIndex
                ? "border-primary/40 bg-primary/10"
                : "border-border bg-muted/30",
            )}
          >
            <span className={cn("mx-auto flex justify-center", i === nextIndex ? "text-primary" : "text-muted-foreground")}>
              {prayer.icon}
            </span>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {prayer.label}
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
              {timesFormatted[prayer.key]}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
