// modules/falak/domain/posisi-matahari.ts
// Perhitungan murni untuk tampilan: posisi matahari di antara terbit dan maghrib,
// dan waktu shalat berikutnya. Bukan hisab — jam masukan berasal dari Digital Falak.
import { keMenit, type WaktuShalat } from '@/modules/falak/domain/digital-falak'

export type FaseHari = 'sebelum-terbit' | 'siang' | 'setelah-maghrib'

export interface PosisiMatahari {
  fase: FaseHari
  /** 0 = terbit, 1 = maghrib. Di luar siang, terkunci di ujung terdekat. */
  fraksi: number
}

type JamSiang = Pick<WaktuShalat, 'terbit' | 'maghrib'>

function klem(nilai: number): number {
  return Math.min(1, Math.max(0, nilai))
}

export function posisiMatahari(waktu: JamSiang, menitSekarang: number): PosisiMatahari {
  const terbit = keMenit(waktu.terbit)
  const maghrib = keMenit(waktu.maghrib)
  if (maghrib <= terbit) return { fase: 'sebelum-terbit', fraksi: 0 }
  if (menitSekarang < terbit) return { fase: 'sebelum-terbit', fraksi: 0 }
  if (menitSekarang > maghrib) return { fase: 'setelah-maghrib', fraksi: 1 }
  return { fase: 'siang', fraksi: (menitSekarang - terbit) / (maghrib - terbit) }
}

/** Letak sebuah jam (mis. dzuhur) pada busur siang, 0..1. */
export function fraksiSiang(waktu: JamSiang, jam: string): number {
  const terbit = keMenit(waktu.terbit)
  const maghrib = keMenit(waktu.maghrib)
  if (maghrib <= terbit) return 0
  return klem((keMenit(jam) - terbit) / (maghrib - terbit))
}

export const KUNCI_SHALAT = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'] as const
export type KunciShalat = (typeof KUNCI_SHALAT)[number]

/** Shalat wajib pertama yang waktunya belum tiba hari ini; null bila Isya sudah lewat. */
export function waktuShalatBerikutnya(waktu: WaktuShalat, menitSekarang: number): KunciShalat | null {
  return KUNCI_SHALAT.find((kunci) => keMenit(waktu[kunci]) > menitSekarang) ?? null
}
