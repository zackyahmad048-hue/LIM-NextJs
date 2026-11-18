// lib/digital-falak.ts
// Satu klien API Digital Falak, dipakai widget homepage dan halaman /falak.
import { z } from 'zod'
import {
  jadwalApiSchema,
  kiblatApiSchema,
  waktuShalatSchema,
  wisKe24,
  selisihSchema,
  type JadwalFalak,
  type WaktuShalat,
} from '@/modules/falak/domain/digital-falak'

const API_BASE = 'https://www.digitalfalak.com'
export const STORAGE_LOKASI = 'lim_prayer_location'
const STORAGE_JADWAL = 'lim_prayer_jadwal'

export interface LokasiFalak {
  name: string
  latitude: number
  longitude: number
}

export const LOKASI_DEFAULT: LokasiFalak = {
  name: 'Markaz Lirboyo, Kediri',
  latitude: -7.818758,
  longitude: 111.993158,
}

export interface JadwalLengkap {
  ws: JadwalFalak
  wis: WaktuShalat
  /** Selisih WIB→WIS dari API (mis. "00:42:51"); absen pada cache lama */
  selisih?: string
  diambilPada: number
}

const cacheSchema = z.object({
  // Bentuk tersimpan = JadwalFalak hasil konversi (subuh), bukan bentuk mentah API (shubuh)
  ws: waktuShalatSchema.extend({ tanggal: z.string() }),
  wis: waktuShalatSchema,
  selisih: selisihSchema.optional(),
  diambilPada: z.number(),
  latitude: z.number(),
  longitude: z.number(),
})

export function bacaLokasi(): LokasiFalak {
  if (typeof window === 'undefined') return LOKASI_DEFAULT
  try {
    const raw = window.localStorage.getItem(STORAGE_LOKASI)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LokasiFalak>
      if (parsed.name && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        return { name: parsed.name, latitude: parsed.latitude, longitude: parsed.longitude }
      }
    }
  } catch (error) {
    console.error('[digital-falak] gagal membaca lokasi tersimpan', error)
  }
  return LOKASI_DEFAULT
}

export function simpanLokasi(loc: LokasiFalak): void {
  try {
    window.localStorage.setItem(STORAGE_LOKASI, JSON.stringify(loc))
  } catch (error) {
    console.error('[digital-falak] gagal menyimpan lokasi', error)
  }
}

export function hapusLokasi(): void {
  try {
    window.localStorage.removeItem(STORAGE_LOKASI)
  } catch (error) {
    console.error('[digital-falak] gagal menghapus lokasi', error)
  }
}

export async function deteksiLokasi(): Promise<LokasiFalak> {
  if (!navigator.geolocation) throw new Error('Browser Anda tidak mendukung deteksi lokasi')

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 600_000,
    })
  })

  const { latitude, longitude } = position.coords
  let name = 'Lokasi Saya'
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
      { headers: { Accept: 'application/json' } }
    )
    if (response.ok) {
      const geo = (await response.json()) as {
        address?: { city?: string; town?: string; village?: string; state?: string }
      }
      const address = geo.address
      name = [address?.city || address?.town || address?.village, address?.state]
        .filter(Boolean)
        .join(', ') || name
    }
  } catch (error) {
    console.error('[digital-falak] gagal reverse geocoding', error)
  }

  return { name, latitude, longitude }
}

type DataApiJadwal = z.infer<typeof jadwalApiSchema.shape.data>

function keWaktuShalat(data: Omit<DataApiJadwal, 'tanggal'>): WaktuShalat {
  return {
    imsak: data.imsak,
    subuh: data.shubuh,
    terbit: data.terbit,
    dzuhur: data.dzuhur,
    ashar: data.ashar,
    maghrib: data.maghrib,
    isya: data.isya,
  }
}

function keJadwalFalak(data: DataApiJadwal): JadwalFalak {
  return { tanggal: data.tanggal, ...keWaktuShalat(data) }
}

function pesanApi(payload: unknown, fallback: string): string {
  const message = (payload as { message?: unknown } | null)?.message
  return typeof message === 'string' ? message : fallback
}

async function mintaJadwal(
  loc: LokasiFalak,
  tanggal: Date,
  standar: 'WS' | 'WIS',
  format: '12' | '24'
): Promise<{ jadwal: JadwalFalak; selisih?: string }> {
  const url = new URL(`${API_BASE}/api.php`)
  url.searchParams.set('tgl', String(tanggal.getDate()))
  url.searchParams.set('bln', String(tanggal.getMonth() + 1))
  url.searchParams.set('lat', String(loc.latitude))
  url.searchParams.set('lon', String(loc.longitude))
  url.searchParams.set('tz', String(-tanggal.getTimezoneOffset() / 60))
  url.searchParams.set('standar', standar)
  url.searchParams.set('format', format)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error(`Gagal mengambil jadwal (HTTP ${response.status})`)

  const payload: unknown = await response.json()
  const parsed = jadwalApiSchema.safeParse(payload)
  if (!parsed.success) throw new Error(pesanApi(payload, 'Format jadwal tidak valid'))

  return { jadwal: keJadwalFalak(parsed.data.data), selisih: parsed.data.data.selisih }
}

export async function getJadwal(loc: LokasiFalak, tanggal = new Date()): Promise<JadwalLengkap> {
  const [hasilWs, hasilWis] = await Promise.all([
    mintaJadwal(loc, tanggal, 'WS', '24'),
    mintaJadwal(loc, tanggal, 'WIS', '12'),
  ])
  return {
    ws: hasilWs.jadwal,
    wis: wisKe24(hasilWis.jadwal, hasilWs.jadwal),
    selisih: hasilWis.selisih,
    diambilPada: Date.now(),
  }
}

// Jam berjalan saat ini digeser selisih WIB→WIS (format "H:MM:SS"), hasil "HH:MM:SS".
export function jamKini(d: Date, selisih?: string): string {
  const bagian = selisih?.split(':').map(Number) ?? []
  const ms = (((bagian[0] ?? 0) * 60 + (bagian[1] ?? 0)) * 60 + (bagian[2] ?? 0)) * 1000
  const t = new Date(d.getTime() + ms)
  return [t.getHours(), t.getMinutes(), t.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export async function getArahKiblat(loc: LokasiFalak): Promise<string> {
  const url = new URL(`${API_BASE}/api/kiblat.php`)
  url.searchParams.set('lat', String(loc.latitude))
  url.searchParams.set('lon', String(loc.longitude))

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error(`Gagal mengambil arah kiblat (HTTP ${response.status})`)

  const payload: unknown = await response.json()
  const parsed = kiblatApiSchema.safeParse(payload)
  if (!parsed.success) throw new Error(pesanApi(payload, 'Format arah kiblat tidak valid'))

  return parsed.data.data.arah_kiblat
}

export function simpanJadwalCache(loc: LokasiFalak, jadwal: JadwalLengkap): void {
  try {
    window.localStorage.setItem(
      STORAGE_JADWAL,
      JSON.stringify({ ...jadwal, latitude: loc.latitude, longitude: loc.longitude })
    )
  } catch (error) {
    console.error('[digital-falak] gagal menyimpan cache jadwal', error)
  }
}

export function bacaJadwalCache(loc: LokasiFalak): JadwalLengkap | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_JADWAL)
    if (!raw) return null

    const parsed = cacheSchema.safeParse(JSON.parse(raw) as unknown)
    if (!parsed.success) return null

    const cache = parsed.data
    if (cache.latitude !== loc.latitude || cache.longitude !== loc.longitude) return null
    // Cache hanya berlaku untuk hari yang sama — jadwal beda hari tidak valid
    if (new Date(cache.diambilPada).toDateString() !== new Date().toDateString()) return null

    return { ws: cache.ws, wis: cache.wis, selisih: cache.selisih, diambilPada: cache.diambilPada }
  } catch (error) {
    console.error('[digital-falak] gagal membaca cache jadwal', error)
    return null
  }
}
