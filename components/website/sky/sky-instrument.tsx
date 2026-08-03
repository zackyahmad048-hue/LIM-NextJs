"use client";

import { useEffect, useState } from "react";
import { toHijri } from "hijri-converter";
import { calculatePrayerTimes } from "@/lib/astroCalc";
import { MoonPhase } from "@/components/website/sky/moon-phase";
import { HubDot } from "@/components/shared/hub-dot";

const HOME = {
  name: "Kediri, Lirboyo",
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

const PRAYERS = [
  { key: "fajr", label: "Subuh" },
  { key: "dhuhr", label: "Dzuhur" },
  { key: "asr", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isya" },
] as const;

function getMoonPhase(date: Date): number {
  const epoch = Date.UTC(2000, 0, 6, 18, 14);
  const synodic = 29.53058867 * 86400000;
  const elapsed = (date.getTime() - epoch) / synodic;
  return elapsed - Math.floor(elapsed);
}

function getPhaseName(p: number): string {
  if (p < 0.03 || p >= 0.97) return "Bulan Baru";
  if (p < 0.24) return "Sabit Muda";
  if (p < 0.28) return "Perbani Awal";
  if (p < 0.47) return "Cembung Muda";
  if (p < 0.53) return "Purnama";
  if (p < 0.73) return "Cembung Tua";
  if (p < 0.77) return "Perbani Akhir";
  return "Sabit Tua";
}

const pad = (n: number) => n.toString().padStart(2, "0");

function hoursToStr(t: number): string {
  const h = Math.floor(t) % 24;
  const m = Math.round((t - Math.floor(t)) * 60) % 60;
  return `${pad(h)}.${pad(m)}`;
}

export function SkyInstrument() {
  const [now, setNow] = useState<Date | null>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const wib = new Date(now.getTime() + HOME.timezone * 3600000);
  const decHours =
    wib.getUTCHours() + wib.getUTCMinutes() / 60 + wib.getUTCSeconds() / 3600;

  const calculation = calculatePrayerTimes(now, HOME, false, 0);
  const numeric = calculation.timesNumeric;

  let next = { label: "Subuh", time: numeric.fajr };
  for (const p of PRAYERS) {
    if (numeric[p.key] > decHours) {
      next = { label: p.label, time: numeric[p.key] };
      break;
    }
  }

  let diff = next.time - decHours;
  if (diff < 0) diff += 24;
  const dh = Math.floor(diff);
  const dm = Math.floor((diff - dh) * 60);
  const ds = Math.floor(((diff - dh) * 60 - dm) * 60);

  const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const phase = getMoonPhase(now);
  const phaseName = getPhaseName(phase);
  const illum = Math.round(((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100);

  const gregorian = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${
    MONTH_NAMES[now.getMonth()]
  } ${now.getFullYear()}`;

  return (
    <aside className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-[0_18px_40px_-20px] shadow-black/20 lg:max-w-sm">
      <div className="flex items-center justify-between border-b border-border/10 pb-3">
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-foreground">
          <HubDot pulse className="h-2 w-2" />
          Jadwal Shalat Hari Ini
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {HOME.name}
        </span>
      </div>

      <div className="grid gap-5 pt-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
        <MoonPhase
          phase={phase}
          className="mx-auto h-24 w-24 text-foreground sm:h-28 sm:w-28"
        />

        <div>
          <p className="font-sans text-xl font-semibold text-foreground sm:text-2xl">
            {hijri.hd} {HIJRI_MONTHS[hijri.hm - 1]} {hijri.hy} H
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{gregorian}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Fase {phaseName} · {illum}% terang
          </p>

          <div className="mt-4 border-t border-border/20 pt-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Menuju {next.label}
            </p>
            <div className="flex items-baseline gap-3">
              <p className="font-mono text-2xl font-semibold tabular-nums text-primary">
                {pad(dh)}j {pad(dm)}m {pad(ds)}s
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                ({hoursToStr(next.time)} WIB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
