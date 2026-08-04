"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculatePrayerTimes, type LocationInfo } from "@/lib/astroCalc";
import { cn } from "@/lib/utils";

const PRAYER_LOCATION: LocationInfo = {
  latitude: -7.8481,
  longitude: 112.0208,
  timezone: 7,
  timezoneName: "WIB",
};

const PRAYERS = [
  { key: "fajr", label: "Subuh" },
  { key: "dhuhr", label: "Dzuhur" },
  { key: "asr", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isya" },
] as const;

function getActiveIndex(now: Date): number {
  const wib = new Date(now.getTime() + PRAYER_LOCATION.timezone * 3600000);
  const decHours =
    wib.getUTCHours() + wib.getUTCMinutes() / 60 + wib.getUTCSeconds() / 3600;

  const { timesNumeric } = calculatePrayerTimes(now, PRAYER_LOCATION, false, 0);

  for (let i = 0; i < PRAYERS.length; i++) {
    if (timesNumeric[PRAYERS[i].key] > decHours) {
      return i;
    }
  }

  return 0;
}

export default function PrayerStrip() {
  const [times, setTimes] = useState<string[] | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const compute = () => {
      const { timesFormatted } = calculatePrayerTimes(
        new Date(),
        PRAYER_LOCATION,
        false,
        0,
      );
      setTimes(PRAYERS.map((p) => timesFormatted[p.key]));
      setActive(getActiveIndex(new Date()));
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-border/10 bg-muted/40">
      <div className="mx-auto flex h-9 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/falak/jadwal-shalat"
          title="Jadwal shalat hari ini — Kediri"
          className="hidden shrink-0 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-primary md:inline-flex"
        >
          Jadwal Shalat
        </Link>

        <div className="no-scrollbar flex min-w-0 flex-1 items-center justify-end gap-4 overflow-x-auto sm:gap-6">
          {PRAYERS.map((prayer, i) => (
            <span
              key={prayer.key}
              className={cn(
                "flex shrink-0 items-baseline gap-1.5",
                i === active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span className="text-[11px] font-medium">{prayer.label}</span>
              <span
                className={cn(
                  "tabular-nums text-xs",
                  i === active ? "font-semibold" : "font-medium",
                )}
              >
                {times ? times[i] : "--:--"}
              </span>
            </span>
          ))}
        </div>

        <Link
          href="/falak/jadwal-shalat"
          title="Lihat jadwal lengkap"
          className="hidden shrink-0 text-[11px] font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-primary hover:underline md:inline-flex"
        >
          Selengkapnya
        </Link>
      </div>
    </div>
  );
}
