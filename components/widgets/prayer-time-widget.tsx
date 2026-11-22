"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertCircle, RefreshCw, MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle, type ModeWaktu } from "@/components/widgets/mode-toggle";
import { toast } from "sonner";
import {
  getJadwal,
  jamKini,
  deteksiLokasi,
  bacaLokasi,
  simpanLokasi,
  hapusLokasi,
  bacaJadwalCache,
  simpanJadwalCache,
  LOKASI_DEFAULT,
  type JadwalLengkap,
  type LokasiFalak,
} from "@/lib/digital-falak";
import { keMenit } from "@/modules/falak/domain/digital-falak";
import {
  waktuShalatBerikutnya,
  type KunciShalat,
} from "@/modules/falak/domain/posisi-matahari";

type Mode = ModeWaktu;

interface PrayerItem {
  name: string;
  time: string;
  /** Hanya shalat wajib yang punya kunci; Imsak dan Terbit hanya penanda waktu. */
  key?: KunciShalat;
}

export function PrayerTimeWidget() {
  const [mode, setMode] = useState<Mode>("standar");
  const [jadwal, setJadwal] = useState<JadwalLengkap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [location, setLocation] = useState<LokasiFalak>(LOKASI_DEFAULT);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const fetchIdRef = useRef(0);

  // Waktu sekarang yang diperbarui berkala. null di render pertama agar hidrasi server/klien sama.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    function updateTime() {
      setNow(new Date());
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setLocation(bacaLokasi()));
  }, []);

  const fetchJadwal = useCallback(async (loc: LokasiFalak) => {
    const fetchId = ++fetchIdRef.current;
    try {
      setLoading(true);
      setError(null);

      const hasilJadwal = await getJadwal(loc);

      if (fetchId !== fetchIdRef.current) return;
      setJadwal(hasilJadwal);
      setStale(false);
      simpanJadwalCache(loc, hasilJadwal);
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;
      const cached = bacaJadwalCache(loc);
      if (cached) {
        setJadwal(cached);
        setStale(true);
      } else {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      }
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void fetchJadwal(location));
  }, [location, fetchJadwal]);

  async function handleDetectLocation() {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung deteksi lokasi");
      return;
    }

    setIsDetectingLocation(true);
    try {
      const lokasiBaru = await deteksiLokasi();
      setLocation(lokasiBaru);
      simpanLokasi(lokasiBaru);
      toast.success(`Lokasi diperbarui: ${lokasiBaru.name}`);
    } catch (err) {
      const geoError = err as GeolocationPositionError;
      const pesan: Record<number, string> = {
        [geoError.PERMISSION_DENIED]:
          "Izin lokasi ditolak. Gunakan lokasi default (Lirboyo).",
        [geoError.POSITION_UNAVAILABLE]: "Informasi lokasi tidak tersedia",
        [geoError.TIMEOUT]: "Waktu deteksi lokasi habis",
      };
      toast.error(pesan[geoError.code] ?? "Gagal mendeteksi lokasi");
    } finally {
      setIsDetectingLocation(false);
    }
  }

  function handleResetLocation() {
    setLocation(LOKASI_DEFAULT);
    hapusLokasi();
    toast.success("Lokasi direset ke Markaz Lirboyo");
  }

  const waktu = jadwal ? (mode === "istiwa" ? jadwal.wis : jadwal.ws) : null;
  const times: PrayerItem[] = waktu
    ? [
        { name: "Imsak", time: waktu.imsak },
        { name: "Subuh", time: waktu.subuh, key: "subuh" },
        { name: "Terbit", time: waktu.terbit },
        { name: "Dzuhur", time: waktu.dzuhur, key: "dzuhur" },
        { name: "Ashar", time: waktu.ashar, key: "ashar" },
        { name: "Maghrib", time: waktu.maghrib, key: "maghrib" },
        { name: "Isya", time: waktu.isya, key: "isya" },
      ]
    : [];

  const selisihJalan = mode === "istiwa" ? jadwal?.selisih : undefined;
  const jamTampil = now ? jamKini(now, selisihJalan) : "";
  const zona = selisihJalan ? "WIS" : "WIB";

  // Penanda "berikutnya" memakai jam yang sama dengan yang tampil di layar.
  const waktuAktif = jadwal
    ? mode === "istiwa"
      ? jadwal.wis
      : jadwal.ws
    : null;
  const menitSekarang = jamTampil ? keMenit(jamTampil) : null;
  const berikutnya =
    waktuAktif && menitSekarang !== null
      ? waktuShalatBerikutnya(waktuAktif, menitSekarang)
      : null;

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-sm font-medium text-muted-foreground">
        Jadwal shalat hari ini
      </h2>

      <div className="mt-3 text-center font-mono text-4xl font-semibold tracking-tight text-foreground tabular-nums">
        {jamTampil}
        <span className="ml-1.5 text-base font-medium text-muted-foreground">
          {zona}
        </span>
      </div>

      {/* Lokasi */}
      <div className="mt-4 flex items-center justify-between gap-2 border-y border-border py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span
            className="truncate text-xs font-medium text-muted-foreground"
            title={location.name}
          >
            {location.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {location.name !== LOKASI_DEFAULT.name && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleResetLocation}
              aria-label="Reset ke Markaz Lirboyo"
              title="Reset ke Markaz Lirboyo"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            aria-label="Deteksi lokasi saya"
            title="Gunakan lokasi device saya"
          >
            {isDetectingLocation ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      <ModeToggle value={mode} onChange={setMode} className="mt-4" />

      {/* Loading State */}
      {loading && (
        <div className="mt-3 divide-y divide-border" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">
                Gagal memuat jadwal
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fetchJadwal(location)}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Waktu Shalat */}
      {!loading && !error && (
        <>
          {stale && (
            <p className="mt-3 rounded-2xl bg-warning/15 px-3 py-2 text-xs text-warning-foreground">
              API sedang tidak tersedia — menampilkan data terakhir yang
              tersimpan.
            </p>
          )}

          <ul className="mt-2 divide-y divide-border">
            {times.map((item) => {
              const giliran = item.key !== undefined && item.key === berikutnya;
              return (
                <li
                  key={item.name}
                  aria-current={giliran ? "time" : undefined}
                  className={cn(
                    "relative flex items-center justify-between py-2.5 text-sm",
                    giliran && "font-semibold",
                  )}
                >
                  {giliran && (
                    <span
                      aria-hidden
                      className="absolute inset-y-1.5 -left-3 w-1 rounded-full bg-primary"
                    />
                  )}
                  <span className="flex items-baseline gap-2">
                    <span className="text-foreground">{item.name}</span>
                    {giliran && (
                      <span className="text-xs font-normal text-muted-foreground">
                        berikutnya
                      </span>
                    )}
                  </span>
                  <span className="text-foreground tabular-nums">
                    {item.time}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-xs text-muted-foreground">
            {mode === "istiwa"
              ? "Waktu Istiwa' (WIs) sesuai hisab Digital Falak"
              : "Sumber: Digital Falak API • Hisab Digital Falak"}
          </p>
        </>
      )}
    </div>
  );
}
