// app/(public)/falak/falak-client.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AlertCircle,
  Compass,
  Loader2,
  MapPin,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getJadwal,
  getArahKiblat,
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

type Mode = "standar" | "istiwa";

export function FalakClient() {
  const [location, setLocation] = useState<LokasiFalak>(LOKASI_DEFAULT);
  const [jadwal, setJadwal] = useState<JadwalLengkap | null>(null);
  const [arahKiblat, setArahKiblat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [mode, setMode] = useState<Mode>("standar");
  const [isDetecting, setIsDetecting] = useState(false);
  // Penanda request terbaru: respons lokasi lama tidak boleh menimpa lokasi baru
  const fetchIdRef = useRef(0);

  useEffect(() => {
    queueMicrotask(() => setLocation(bacaLokasi()));
  }, []);

  const muat = useCallback(async (loc: LokasiFalak) => {
    const fetchId = ++fetchIdRef.current;
    try {
      setLoading(true);
      setError(null);

      const [hasilJadwal, hasilKiblat] = await Promise.allSettled([
        getJadwal(loc),
        getArahKiblat(loc),
      ]);

      if (hasilJadwal.status === "fulfilled") {
        if (fetchId !== fetchIdRef.current) return;
        setJadwal(hasilJadwal.value);
        setStale(false);
        simpanJadwalCache(loc, hasilJadwal.value);
      } else {
        if (fetchId !== fetchIdRef.current) return;
        const cached = bacaJadwalCache(loc);
        if (cached) {
          setJadwal(cached);
          setStale(true);
        } else {
          setError(
            hasilJadwal.reason instanceof Error
              ? hasilJadwal.reason.message
              : "Gagal memuat jadwal",
          );
        }
      }

      if (fetchId !== fetchIdRef.current) return;
      setArahKiblat(
        hasilKiblat.status === "fulfilled" ? hasilKiblat.value : null,
      );
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void muat(location));
  }, [location, muat]);

  async function handleDetectLocation() {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung deteksi lokasi");
      return;
    }

    setIsDetecting(true);
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
      setIsDetecting(false);
    }
  }

  function handleResetLocation() {
    setLocation(LOKASI_DEFAULT);
    hapusLokasi();
    toast.success("Lokasi direset ke Markaz Lirboyo");
  }

  const waktu = jadwal ? (mode === "istiwa" ? jadwal.wis : jadwal.ws) : null;
  const daftarShalat: Array<[string, string]> = waktu
    ? [
        ["Subuh", waktu.subuh],
        ["Terbit", waktu.terbit],
        ["Dzuhur", waktu.dzuhur],
        ["Ashar", waktu.ashar],
        ["Maghrib", waktu.maghrib],
        ["Isya", waktu.isya],
      ]
    : [];

  return (
    <div className="bg-muted py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Jadwal Shalat Harian
          </h1>
          <div className="mt-4 flex flex-col items-center justify-center gap-2 text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{location.name}</span>
            </div>
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
              variant="outline"
              size="sm"
              onClick={handleDetectLocation}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-3.5 w-3.5" />
              )}
              Lokasi Saya
            </Button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mx-auto mb-6 flex max-w-md rounded-md bg-muted-foreground/10 p-1">
          {(["standar", "istiwa"] as const).map((pilihan) => (
            <button
              key={pilihan}
              type="button"
              onClick={() => setMode(pilihan)}
              aria-pressed={mode === pilihan}
              className={cn(
                "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                mode === pilihan
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {pilihan === "standar" ? "Waktu Standar" : "Waktu Istiwa'"}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mx-auto mb-6 flex max-w-4xl items-center gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">
                Gagal memuat jadwal
              </p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => muat(location)}>
              <RefreshCw className="mr-2 h-3 w-3" />
              Coba Lagi
            </Button>
          </div>
        )}

        {stale && (
          <p className="mx-auto mb-4 max-w-4xl rounded-md bg-warning/10 px-3 py-2 text-center text-xs text-warning">
            API sedang tidak tersedia — menampilkan data terakhir yang
            tersimpan.
          </p>
        )}

        {/* Jadwal Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {daftarShalat.map(([shalat, jam]) => (
              <div
                key={shalat}
                className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center transition-all duration-200 hover:border-primary"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {shalat}
                </span>
                <span className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
                  {jam}
                </span>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg border bg-card"
              />
            ))}
          </div>
        )}

        {/* Arah Kiblat */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-center">
          <Compass className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Arah Kiblat
          </span>
          <span className="text-2xl font-semibold text-foreground">
            {arahKiblat ?? (loading ? "..." : "Tidak tersedia")}
          </span>
          <span className="text-xs text-muted-foreground">
            diukur dari Utara sejati searah jarum jam
          </span>
        </div>

        {/* Info Metode */}
        <div className="mt-8 rounded-md border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Metode Hisab:</span>{" "}
            Digital Falak
            <br />
            <span className="text-xs">
              *Jadwal ini dapat mengalami perubahan sesuai dengan ketetapan
              resmi dari Lajnah Falak LIM.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
