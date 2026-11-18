// components/widgets/prayer-time-widget.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, AlertCircle, RefreshCw, MapPin, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
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
} from '@/lib/digital-falak'

type Mode = 'standar' | 'istiwa'

interface PrayerItem {
  name: string
  time: string
}

export function PrayerTimeWidget() {
  const [mode, setMode] = useState<Mode>('standar')
  const [jadwal, setJadwal] = useState<JadwalLengkap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stale, setStale] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [location, setLocation] = useState<LokasiFalak>(LOKASI_DEFAULT)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  // Penanda request terbaru: respons fetch lokasi lama tidak boleh menimpa lokasi baru
  const fetchIdRef = useRef(0)

  // ==========================================
  // 1. DIGITAL CLOCK (Real-time)
  // ==========================================
  useEffect(() => {
    function updateTime() {
      setNow(new Date())
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // ==========================================
  // 2. LOAD PREFERENSI LOKASI DARI LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    // Tunda agar render pertama tetap pakai lokasi default (hydrasi aman).
    queueMicrotask(() => setLocation(bacaLokasi()))
  }, [])

  // ==========================================
  // 3. FETCH JADWAL DARI KLIEN DIGITAL FALAK
  // ==========================================
  const fetchJadwal = useCallback(async (loc: LokasiFalak) => {
    const fetchId = ++fetchIdRef.current
    try {
      setLoading(true)
      setError(null)

      const data = await getJadwal(loc)
      if (fetchId !== fetchIdRef.current) return
      setJadwal(data)
      setStale(false)
      simpanJadwalCache(loc, data)
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return
      const cached = bacaJadwalCache(loc)
      if (cached) {
        setJadwal(cached)
        setStale(true)
        setError(null)
      } else {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      }
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false)
    }
  }, [])

  // Fetch jadwal saat lokasi berubah
  useEffect(() => {
    queueMicrotask(() => void fetchJadwal(location))
  }, [location, fetchJadwal])

  // ==========================================
  // 4. DETEKSI LOKASI DEVICE
  // ==========================================
  async function handleDetectLocation() {
    if (!navigator.geolocation) {
      toast.error('Browser Anda tidak mendukung deteksi lokasi')
      return
    }

    setIsDetectingLocation(true)

    try {
      const lokasiBaru = await deteksiLokasi()
      setLocation(lokasiBaru)
      simpanLokasi(lokasiBaru)
      toast.success(`Lokasi diperbarui: ${lokasiBaru.name}`)
    } catch (err) {
      const geoError = err as GeolocationPositionError
      let message = 'Gagal mendeteksi lokasi'

      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          message = 'Izin lokasi ditolak. Gunakan lokasi default (Lirboyo).'
          break
        case geoError.POSITION_UNAVAILABLE:
          message = 'Informasi lokasi tidak tersedia'
          break
        case geoError.TIMEOUT:
          message = 'Waktu deteksi lokasi habis'
          break
      }

      toast.error(message)
    } finally {
      setIsDetectingLocation(false)
    }
  }

  // ==========================================
  // 5. RESET KE LOKASI DEFAULT
  // ==========================================
  function handleResetLocation() {
    setLocation(LOKASI_DEFAULT)
    hapusLokasi()
    toast.success('Lokasi direset ke Markaz Lirboyo')
  }

  // ==========================================
  // 6. KONVERSI JADWAL KE ARRAY
  // ==========================================
  function getPrayerTimes(): PrayerItem[] {
    if (!jadwal) return []

    const waktu = mode === 'istiwa' ? jadwal.wis : jadwal.ws

    return [
      { name: 'Imsak', time: waktu.imsak },
      { name: 'Subuh', time: waktu.subuh },
      { name: 'Terbit', time: waktu.terbit },
      { name: 'Dzuhur', time: waktu.dzuhur },
      { name: 'Ashar', time: waktu.ashar },
      { name: 'Maghrib', time: waktu.maghrib },
      { name: 'Isya', time: waktu.isya },
    ]
  }

  const times = getPrayerTimes()
  const isCustomLocation = location.name !== LOKASI_DEFAULT.name

  // Mode Istiwa' menggeser jam berjalan dengan selisih WIB→WIS dari API;
  // label selalu menyatakan zona jam yang benar-benar ditampilkan.
  const selisihJalan = mode === 'istiwa' ? jadwal?.selisih : undefined
  const jamTampil = now ? jamKini(now, selisihJalan) : ''
  const zona = selisihJalan ? 'WIS' : 'WIB'

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header Widget — judul + jam besar di tengah */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Jadwal Shalat</span>
        </div>
        <div className="mt-2 font-mono text-4xl font-bold tracking-tight text-primary tabular-nums">
          {jamTampil}
          <span className="ml-1.5 text-lg font-medium text-muted-foreground">{zona}</span>
        </div>
      </div>

      {/* Info Lokasi + Tombol Lokasi */}
      <div className="mb-4 flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs font-medium text-muted-foreground" title={location.name}>
            {location.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isCustomLocation && (
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

      {/* Toggle Mode */}
      <div className="mb-5 flex rounded-md bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode('standar')}
          aria-pressed={mode === 'standar'}
          className={cn(
            'flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-all duration-150 ease-out',
            mode === 'standar'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Waktu Standar
        </button>
        <button
          type="button"
          onClick={() => setMode('istiwa')}
          aria-pressed={mode === 'istiwa'}
          className={cn(
            'flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-all duration-150 ease-out',
            mode === 'istiwa'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Waktu Istiwa&apos;
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-2.5"
            >
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Gagal memuat jadwal</p>
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
            <p className="mb-3 rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
              API sedang tidak tersedia — menampilkan data terakhir yang tersimpan.
            </p>
          )}

          <div className="space-y-1.5">
            {times.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-2.5 transition-colors hover:bg-muted"
              >
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="font-bold text-primary tabular-nums">{item.time}</span>
              </div>
            ))}
          </div>

          {/* Keterangan Kaki */}
          <div className="mt-5 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {mode === 'istiwa'
                ? "Waktu Istiwa' (WIs) sesuai hisab Digital Falak"
                : 'Sumber: Digital Falak API • Hisab Digital Falak'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
