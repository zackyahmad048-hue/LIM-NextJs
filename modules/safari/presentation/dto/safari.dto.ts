import { z } from 'zod'
import { JenjangSekolah, StatusDelegasiSafari } from '@/generated/client'

export const titikSafariDtoSchema = z.object({
  id: z.string(),
  namaTitik: z.string(),
  alamat: z.string(),
  provinsi: z.string(),
  kabupaten: z.string(),
  kecamatan: z.string(),
  desa: z.string(),
  picNama: z.string().nullable(),
  picNoHp: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type TitikSafariDto = z.infer<typeof titikSafariDtoSchema>

export function toTitikSafariDto(t: {
  id: string
  namaTitik: string
  alamat: string
  provinsi: string
  kabupaten: string
  kecamatan: string
  desa: string
  picNama: string | null
  picNoHp: string | null
  createdAt: Date
  updatedAt: Date
}): TitikSafariDto {
  return {
    id: t.id,
    namaTitik: t.namaTitik,
    alamat: t.alamat,
    provinsi: t.provinsi,
    kabupaten: t.kabupaten,
    kecamatan: t.kecamatan,
    desa: t.desa,
    picNama: t.picNama,
    picNoHp: t.picNoHp,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }
}

export const delegasiDtoSchema = z.object({
  id: z.string(),
  titikId: z.string(),
  userId: z.string(),
  namaLengkap: z.string(),
  noHp: z.string(),
  asalPondok: z.string().nullable(),
  status: z.nativeEnum(StatusDelegasiSafari),
  alasanGugur: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type DelegasiDto = z.infer<typeof delegasiDtoSchema>

export function toDelegasiDto(d: {
  id: string
  titikId: string
  userId: string
  namaLengkap: string
  noHp: string
  asalPondok: string | null
  status: StatusDelegasiSafari
  alasanGugur: string | null
  createdAt: Date
  updatedAt: Date
}): DelegasiDto {
  return {
    id: d.id,
    titikId: d.titikId,
    userId: d.userId,
    namaLengkap: d.namaLengkap,
    noHp: d.noHp,
    asalPondok: d.asalPondok,
    status: d.status,
    alasanGugur: d.alasanGugur,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }
}

export const jurnalDtoSchema = z.object({
  id: z.string(),
  delegasiId: z.string(),
  tanggal: z.string().datetime(),
  kegiatan: z.string(),
  jumlahJamaah: z.number().int().nullable(),
  catatan: z.string().nullable(),
  createdAt: z.string().datetime(),
})
export type JurnalDto = z.infer<typeof jurnalDtoSchema>

export function toJurnalDto(j: {
  id: string
  delegasiId: string
  tanggal: Date
  kegiatan: string
  jumlahJamaah: number | null
  catatan: string | null
  createdAt: Date
}): JurnalDto {
  return {
    id: j.id,
    delegasiId: j.delegasiId,
    tanggal: j.tanggal.toISOString(),
    kegiatan: j.kegiatan,
    jumlahJamaah: j.jumlahJamaah,
    catatan: j.catatan,
    createdAt: j.createdAt.toISOString(),
  }
}

export const laporanSidakDtoSchema = z.object({
  id: z.string(),
  delegasiId: z.string(),
  penilaiId: z.string(),
  tanggalSidak: z.string().datetime(),
  kondisiKegiatan: z.string(),
  kondisiDelegasi: z.string(),
  kendala: z.string().nullable(),
  rekomendasi: z.string().nullable(),
  createdAt: z.string().datetime(),
})
export type LaporanSidakDto = z.infer<typeof laporanSidakDtoSchema>

export function toLaporanSidakDto(l: {
  id: string
  delegasiId: string
  penilaiId: string
  tanggalSidak: Date
  kondisiKegiatan: string
  kondisiDelegasi: string
  kendala: string | null
  rekomendasi: string | null
  createdAt: Date
}): LaporanSidakDto {
  return {
    id: l.id,
    delegasiId: l.delegasiId,
    penilaiId: l.penilaiId,
    tanggalSidak: l.tanggalSidak.toISOString(),
    kondisiKegiatan: l.kondisiKegiatan,
    kondisiDelegasi: l.kondisiDelegasi,
    kendala: l.kendala,
    rekomendasi: l.rekomendasi,
    createdAt: l.createdAt.toISOString(),
  }
}

// Requests
export const createTitikSafariRequestSchema = z.object({
  namaTitik: z.string().trim().min(2).max(200),
  alamat: z.string().trim().min(5),
  provinsi: z.string().trim().min(2),
  kabupaten: z.string().trim().min(2),
  kecamatan: z.string().trim().min(2),
  desa: z.string().trim().min(2),
  picNama: z.string().trim().max(200).optional(),
  picNoHp: z.string().trim().max(30).optional(),
})

export const updateTitikSafariRequestSchema = createTitikSafariRequestSchema.partial()

export const createDelegasiRequestSchema = z.object({
  titikId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  namaLengkap: z.string().trim().min(2).max(200),
  noHp: z.string().trim().min(5).max(30),
  asalPondok: z.string().trim().max(200).optional(),
})

export const createJurnalRequestSchema = z.object({
  delegasiId: z.string().trim().min(1),
  tanggal: z.union([z.string().datetime(), z.string().min(1)]),
  kegiatan: z.string().trim().min(5),
  jumlahJamaah: z.number().int().min(0).optional(),
  catatan: z.string().trim().max(2000).optional(),
})

export const createLaporanSidakRequestSchema = z.object({
  delegasiId: z.string().trim().min(1),
  tanggalSidak: z.union([z.string().datetime(), z.string().min(1)]),
  kondisiKegiatan: z.string().trim().min(5),
  kondisiDelegasi: z.string().trim().min(5),
  kendala: z.string().trim().max(2000).optional(),
  rekomendasi: z.string().trim().max(2000).optional(),
})

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  titikId: z.string().optional(),
  delegasiId: z.string().optional(),
  provinsi: z.string().optional(),
  kabupaten: z.string().optional(),
})

export const idParamSchema = z.object({ id: z.string().trim().min(1) })

// avoid unused import lint in some setups
void (0 as unknown as JenjangSekolah)
