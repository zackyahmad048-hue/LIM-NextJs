"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { toHijri } from "hijri-converter";
import {
  calculatePrayerTimes,
  formatTime,
  getNextPrayer,
  type LocationInfo,
  type PrayerTimes,
  type PrayerTimesNumeric,
} from "@/lib/astroCalc";
import { GlassPanel } from "@/components/website/glass/glass-panel";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

const HOME_NAME = "Lirboyo, Kediri";

const HOME: LocationInfo = {
  latitude: -7.8481,
  longitude: 112.0208,
  timezone: 7,
  timezoneName: "WIB",
};

const COORDS = "7°51' LS · 112°01' BT";

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

const PRAYERS: Array<{ key: keyof PrayerTimes; label: string }> = [
  { key: "fajr", label: "Subuh" },
  { key: "sunrise", label: "Thulu'" },
  { key: "dhuhr", label: "Dzuhur" },
  { key: "asr", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isya" },
];

type Mode = "standar" | "istiwa";

const pad = (n: number) => n.toString().padStart(2, "0");

const emptySubscribe = () => () => {};

/**
 * Hydration-safe mount flag: server snapshot is always false, client snapshot
 * true. Volatile local-time output stays a stable placeholder until mounted,
 * preventing SSR/client text mismatches.
 */
function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function wrap24(h: number): number {
  return ((h % 24) + 24) % 24;
}

function computeCurrentDec(
  now: Date,
  isIstiwa: boolean,
  transitStandard: number,
): number {
  const wib = new Date(now.getTime() + HOME.timezone * 3600000);
  const wibDec =
    wib.getUTCHours() + wib.getUTCMinutes() / 60 + wib.getUTCSeconds() / 3600;
  return isIstiwa ? wrap24(wibDec - transitStandard + 12) : wibDec;
}

function computeNextIndex(
  timesNumeric: PrayerTimesNumeric,
  now: Date,
  isIstiwa: boolean,
  transitStandard: number,
): number {
  const next = getNextPrayer(
    timesNumeric,
    computeCurrentDec(now, isIstiwa, transitStandard),
  );
  return PRAYERS.findIndex((prayer) => prayer.key === next.key);
}

/**
 * Ticking clock + countdown. Owns the 1-second interval so only these two
 * blocks re-render each tick — the surrounding folio stays static.
 */
function LiveTaqwim({
  mode,
  timesNumeric,
  transitStandard,
  deltaMinutes,
  onNextIndexChange,
}: {
  mode: Mode;
  timesNumeric: PrayerTimesNumeric;
  transitStandard: number;
  deltaMinutes: number;
  onNextIndexChange: (index: number) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const mounted = useHasMounted();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isIstiwa = mode === "istiwa";
  const currentDec = computeCurrentDec(now, isIstiwa, transitStandard);
  const next = getNextPrayer(timesNumeric, currentDec);
  const nextIndex = PRAYERS.findIndex((prayer) => prayer.key === next.key);
  const nextLabel = PRAYERS[nextIndex].label;

  const diff = next.diffHours;
  const dh = Math.floor(diff);
  const dm = Math.floor((diff - dh) * 60);
  const ds = Math.floor(((diff - dh) * 60 - dm) * 60);

  const wib = new Date(now.getTime() + HOME.timezone * 3600000);
  const wibDec =
    wib.getUTCHours() + wib.getUTCMinutes() / 60 + wib.getUTCSeconds() / 3600;
  const istiwaDec = wrap24(wibDec - transitStandard + 12);

  const standardClockStr = `${pad(wib.getUTCHours())}:${pad(
    wib.getUTCMinutes(),
  )}:${pad(wib.getUTCSeconds())}`;
  const istiwaClockStr = formatTime(istiwaDec, true);

  const deltaStr = `${deltaMinutes >= 0 ? "+" : ""}${deltaMinutes.toFixed(1)} mnt`;

  useEffect(() => {
    onNextIndexChange(nextIndex);
  }, [nextIndex, onNextIndexChange]);

  return (
    <>
      {/* Clock */}
      <motion.div
        {...(prefersReducedMotion ? { initial: false } : { initial: { opacity: 0, y: 10 } })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
        className="border-b border-border/70 px-5 py-5 text-center"
      >
        <p className="font-data text-[2.6rem] font-semibold leading-none tabular-nums text-foreground">
          {mounted ? (isIstiwa ? istiwaClockStr : standardClockStr) : "--:--:--"}
          <span className="ml-2 align-middle font-sans text-xs font-medium text-muted-foreground">
            {isIstiwa ? "WIS" : HOME.timezoneName}
          </span>
        </p>
        <p className="mt-2 font-data text-[10px] tabular-nums text-muted-foreground">
          {isIstiwa
            ? `Waktu Istiwa' · selisih ${deltaStr}`
            : `Waktu ${HOME.timezoneName} · ihtiyat +3 menit`}
        </p>
      </motion.div>

      {/* Menuju */}
      <motion.div
        {...(prefersReducedMotion ? { initial: false } : { initial: { opacity: 0, y: 8 } })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: EASE_OUT }}
        className="flex items-center justify-between border-b border-border/70 bg-secondary/40 px-5 py-3"
      >
        <span className="font-sans text-[10px] font-medium uppercase text-muted-foreground">
          Menuju {mounted ? nextLabel : "—"}
        </span>
        <span className="font-data text-sm font-medium tabular-nums text-primary">
          {mounted ? `${pad(dh)}:${pad(dm)}:${pad(ds)}` : "--:--:--"}
        </span>
      </motion.div>
    </>
  );
}

export function TaqwimFolio() {
  const prefersReducedMotion = useReducedMotion();
  const [snapshot] = useState(() => new Date());
  const [mode, setMode] = useState<Mode>("standar");
  const mounted = useHasMounted();

  const isIstiwa = mode === "istiwa";

  const calculation = useMemo(
    () => calculatePrayerTimes(snapshot, HOME, isIstiwa, 3),
    [snapshot, isIstiwa],
  );
  const { timesNumeric, timesFormatted, transitStandard, deltaMinutes } =
    calculation;

  const [nextIndex, setNextIndex] = useState(() =>
    computeNextIndex(timesNumeric, snapshot, isIstiwa, transitStandard),
  );
  const onNextIndexChange = useCallback((index: number) => {
    setNextIndex(index);
  }, []);

  const hijri = toHijri(
    snapshot.getFullYear(),
    snapshot.getMonth() + 1,
    snapshot.getDate(),
  );
  const hijriDate = `${hijri.hd} ${HIJRI_MONTHS[hijri.hm - 1]} ${hijri.hy} H`;
  const gregorian = `${DAY_NAMES[snapshot.getDay()]}, ${snapshot.getDate()} ${
    MONTH_NAMES[snapshot.getMonth()]
  } ${snapshot.getFullYear()}`;

  const rowAnim = prefersReducedMotion
    ? { initial: false }
    : { initial: { opacity: 0, y: 8 } };

  return (
    <GlassPanel
      as="aside"
      className="w-full max-w-md overflow-hidden lg:max-w-none"
    >
      {/* Masthead */}
      <motion.div
        {...(prefersReducedMotion ? { initial: false } : { initial: { opacity: 0 } })}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="flex items-center justify-between border-b border-border/70 px-5 py-3.5"
      >
        <div>
          <p className="font-sans text-[10px] font-medium uppercase text-foreground">
            Taqwim {HOME_NAME}
          </p>
          <p className="mt-1 font-data text-[10px] tabular-nums text-muted-foreground">
            {COORDS} · {HOME.timezoneName}
          </p>
        </div>
        <span aria-hidden className="font-ar text-base text-primary">
          المواقيت
        </span>
      </motion.div>

      <LiveTaqwim
        mode={mode}
        timesNumeric={timesNumeric}
        transitStandard={transitStandard}
        deltaMinutes={deltaMinutes}
        onNextIndexChange={onNextIndexChange}
      />

      {/* Taqwim table */}
      <table className="w-full border-b border-border/70">
        <tbody>
          {PRAYERS.map((prayer, i) => {
            const isNext = mounted && i === nextIndex;
            return (
              <motion.tr
                key={prayer.key}
                {...rowAnim}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: prefersReducedMotion ? 0 : 0.24 + i * 0.06,
                  ease: EASE_OUT,
                }}
                className={cn(
                  isNext
                    ? "text-primary"
                    : "hover:bg-accent/50 text-foreground",
                )}
              >
                <td className="w-1/2 border-b border-border/60 py-3 pl-5 last:border-b-0">
                  <span className="flex items-center gap-2.5">
                    {isNext && (
                      <span
                        aria-hidden
                        className="inline-block size-1.5 bg-primary"
                      />
                    )}
                    <span
                      className={cn(
                        "font-sans text-[11px] font-medium uppercase",
                        isNext ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {prayer.label}
                    </span>
                  </span>
                </td>
                <td className="border-b border-border/60 py-3 pl-5 pr-5 text-right last:border-b-0">
                  <span className="font-data text-base font-medium tabular-nums">
                    {mounted ? timesFormatted[prayer.key] : "--:--"}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Date strip */}
      <motion.div
        {...(prefersReducedMotion ? { initial: false } : { initial: { opacity: 0 } })}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease: EASE_OUT }}
        className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3"
      >
        <span className="font-data text-[11px] tabular-nums text-muted-foreground">
          {mounted ? gregorian : "—"}
        </span>
        <span className="font-data text-[11px] tabular-nums text-foreground">
          {mounted ? hijriDate : "—"}
        </span>
      </motion.div>

      {/* Mode */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5">
        <span className="font-sans text-[10px] font-medium uppercase text-muted-foreground">
          Mode Hisab
        </span>
        <div className="grid grid-cols-2 border border-border/70">
          <button
            type="button"
            onClick={() => setMode("standar")}
            aria-pressed={!isIstiwa}
            className={cn(
              "px-3 py-1.5 font-sans text-[11px] font-medium transition-colors",
              !isIstiwa
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Standar
          </button>
          <button
            type="button"
            onClick={() => setMode("istiwa")}
            aria-pressed={isIstiwa}
            className={cn(
              "px-3 py-1.5 font-sans text-[11px] font-medium transition-colors",
              isIstiwa
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Istiwa&apos;
          </button>
        </div>
      </div>

      {/* Colophon */}
      <div className="border-t border-border/70 bg-secondary/40 px-5 py-4 text-center">
        <p aria-hidden className="font-ar text-base leading-none text-primary">
          تم بحمد الله
        </p>
        <p className="mt-2 font-data text-[10px] uppercase tabular-nums text-muted-foreground">
          Selesai dihisab · {HOME_NAME} · {HOME.timezoneName}
        </p>
      </div>
    </GlassPanel>
  );
}