// modules/falak/domain/digital-falak.ts
// Kontrak data hisab Digital Falak (API publik digitalfalak.com).
import { z } from 'zod'

const jamSchema = z.string().regex(/^\d{1,2}:\d{2}(:\d{2})?$/)
// Selisih WIB→WIS boleh negatif (lokasi di barat meridian acuan)
export const selisihSchema = z.string().regex(/^-?\d{1,2}:\d{2}(:\d{2})?$/)

export const jadwalApiSchema = z.object({
  status: z.literal('success'),
  data: z.object({
    tanggal: z.string(),
    imsak: jamSchema,
    shubuh: jamSchema,
    terbit: jamSchema,
    dhuha: jamSchema.optional(),
    dzuhur: jamSchema,
    ashar: jamSchema,
    maghrib: jamSchema,
    isya: jamSchema,
    selisih: selisihSchema.optional(),
    bayangan_qiblat: jamSchema.optional(),
  }),
})

export const kiblatApiSchema = z.object({
  status: z.literal('success'),
  data: z.object({ arah_kiblat: z.string() }),
})

export const waktuShalatSchema = z.object({
  imsak: jamSchema,
  subuh: jamSchema,
  terbit: jamSchema,
  dzuhur: jamSchema,
  ashar: jamSchema,
  maghrib: jamSchema,
  isya: jamSchema,
})

export interface WaktuShalat {
  imsak: string
  subuh: string
  terbit: string
  dzuhur: string
  ashar: string
  maghrib: string
  isya: string
}

export interface JadwalFalak extends WaktuShalat {
  tanggal: string
}

export const KUNCI_WAKTU = [
  'imsak', 'subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya',
] as const satisfies ReadonlyArray<keyof WaktuShalat>

export function keMenit(jam: string): number {
  const [jamStr = '0', menitStr = '0'] = jam.split(':')
  return Number(jamStr) * 60 + Number(menitStr)
}

export function dariMenit(menit: number): string {
  const normal = ((menit % 1440) + 1440) % 1440
  return `${String(Math.floor(normal / 60)).padStart(2, '0')}:${String(normal % 60).padStart(2, '0')}`
}

function jarakLingkar(a: number, b: number): number {
  const selisih = Math.abs(a - b)
  return Math.min(selisih, 1440 - selisih)
}

// WIS dikirim API dalam jam-12 tanpa AM/PM. Cocokkan dengan WS untuk memilih meridiem.
export function wisKe24(wis: WaktuShalat, ws: WaktuShalat): WaktuShalat {
  const hasil = {} as WaktuShalat
  for (const kunci of KUNCI_WAKTU) {
    const menit12 = keMenit(wis[kunci])
    const menitWs = keMenit(ws[kunci])
    const pilihan = [menit12, (menit12 + 720) % 1440]
    hasil[kunci] = dariMenit(
      pilihan.reduce((terbaik, kandidat) =>
        jarakLingkar(kandidat, menitWs) < jarakLingkar(terbaik, menitWs) ? kandidat : terbaik
      )
    )
  }
  return hasil
}
