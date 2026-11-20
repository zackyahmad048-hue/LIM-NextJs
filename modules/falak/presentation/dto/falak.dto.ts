import { z } from 'zod'

export const jadwalShalatDtoSchema = z.object({
  id: z.string(),
  tanggal: z.string().datetime(),
  subuh: z.string(),
  terbit: z.string(),
  dzuhur: z.string(),
  ashar: z.string(),
  maghrib: z.string(),
  isya: z.string(),
  configId: z.string(),
  isManualOverride: z.boolean(),
  catatanOverride: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type JadwalShalatDto = z.infer<typeof jadwalShalatDtoSchema>

export function toJadwalDto(j: {
  id: string; tanggal: Date; subuh: string; terbit: string; dzuhur: string; ashar: string; maghrib: string; isya: string
  configId: string; isManualOverride: boolean; catatanOverride: string | null; createdAt: Date; updatedAt: Date
}): JadwalShalatDto {
  return {
    id: j.id,
    tanggal: j.tanggal.toISOString(),
    subuh: j.subuh, terbit: j.terbit, dzuhur: j.dzuhur, ashar: j.ashar, maghrib: j.maghrib, isya: j.isya,
    configId: j.configId,
    isManualOverride: j.isManualOverride,
    catatanOverride: j.catatanOverride,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  }
}

export const falakConfigDtoSchema = z.object({
  id: z.string(),
  namaLokasi: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  ketinggian: z.number(),
  metodeHisab: z.string(),
  kriteriaMABIMS: z.boolean(),
  koreksiSubuh: z.number(),
  koreksiMaghrib: z.number(),
  modeWaktu: z.string(),
  isActive: z.boolean(),
  updatedAt: z.string().datetime(),
})
export type FalakConfigDto = z.infer<typeof falakConfigDtoSchema>

export function toFalakConfigDto(c: {
  id: string; namaLokasi: string; latitude: number; longitude: number; ketinggian: number; metodeHisab: string
  kriteriaMABIMS: boolean; koreksiSubuh: number; koreksiMaghrib: number; modeWaktu: string; isActive: boolean; updatedAt: Date
}): FalakConfigDto {
  return {
    id: c.id, namaLokasi: c.namaLokasi, latitude: c.latitude, longitude: c.longitude, ketinggian: c.ketinggian,
    metodeHisab: c.metodeHisab, kriteriaMABIMS: c.kriteriaMABIMS, koreksiSubuh: c.koreksiSubuh, koreksiMaghrib: c.koreksiMaghrib,
    modeWaktu: c.modeWaktu, isActive: c.isActive, updatedAt: c.updatedAt.toISOString(),
  }
}

export const generateJadwalRequestSchema = z.object({
  tanggal: z.string().datetime().or(z.string().min(1)),
  modeWaktu: z.enum(['standar', 'istiwa']).optional(),
})

export const listJadwalQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  tanggal: z.string().optional(),
})
