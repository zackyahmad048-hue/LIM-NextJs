import { z } from 'zod'
import {
  StatusPenugasan,
  StatusHonor,
  FanIlmu,
  TingkatKeparahan,
  StatusMediasi,
} from '@/generated/client'

export const penugasanStatusSchema = z.nativeEnum(StatusPenugasan)
export const statusHonorSchema = z.nativeEnum(StatusHonor)
export const fanIlmuSchema = z.nativeEnum(FanIlmu)

export const penugasanDtoSchema = z.object({
  id: z.string(),
  guruBantuId: z.string(),
  lembagaId: z.string(),
  dosenPenanggungId: z.string(),
  tanggalMulai: z.string().datetime(),
  tanggalSelesai: z.string().datetime().nullable(),
  status: penugasanStatusSchema,
  targetJamaahMingguan: z.number().int().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type PenugasanDto = z.infer<typeof penugasanDtoSchema>

export function toPenugasanDto(p: {
  id: string
  guruBantuId: string
  lembagaId: string
  dosenPenanggungId: string
  tanggalMulai: Date
  tanggalSelesai: Date | null
  status: StatusPenugasan
  targetJamaahMingguan: number | null
  createdAt: Date
  updatedAt: Date
}): PenugasanDto {
  return {
    id: p.id,
    guruBantuId: p.guruBantuId,
    lembagaId: p.lembagaId,
    dosenPenanggungId: p.dosenPenanggungId,
    tanggalMulai: p.tanggalMulai.toISOString(),
    tanggalSelesai: p.tanggalSelesai?.toISOString() ?? null,
    status: p.status,
    targetJamaahMingguan: p.targetJamaahMingguan,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export const detailKitabDtoSchema = z.object({
  fan: fanIlmuSchema,
  namaKitab: z.string(),
  frekuensiPertemuan: z.number().int(),
})

export const laporanDtoSchema = z.object({
  id: z.string(),
  penugasanId: z.string(),
  pelaporId: z.string(),
  rolePelapor: z.string(),
  namaPengisi: z.string(),
  jabatanPengisi: z.string(),
  periodeMinggu: z.number().int(),
  periodeTahun: z.number().int(),
  tanggalLapor: z.string().datetime(),
  jumlahHariHadir: z.number().int(),
  keteranganAbsensi: z.string().nullable(),
  jumlahJamaahDilakukan: z.number().int(),
  aktivitasMingguan: z.string(),
  kendala: z.string().nullable(),
  statusHonor: statusHonorSchema,
  isForwardedToInduk: z.boolean(),
  createdAt: z.string().datetime(),
  detailKitab: z.array(detailKitabDtoSchema).optional(),
})
export type LaporanDto = z.infer<typeof laporanDtoSchema>

export function toLaporanDto(l: {
  id: string
  penugasanId: string
  pelaporId: string
  rolePelapor: string
  namaPengisi: string
  jabatanPengisi: string
  periodeMinggu: number
  periodeTahun: number
  tanggalLapor: Date
  jumlahHariHadir: number
  keteranganAbsensi: string | null
  jumlahJamaahDilakukan: number
  aktivitasMingguan: string
  kendala: string | null
  statusHonor: StatusHonor
  isForwardedToInduk: boolean
  createdAt: Date
  detailKitab?: Array<{ fan: FanIlmu; namaKitab: string; frekuensiPertemuan: number }>
}): LaporanDto {
  return {
    id: l.id,
    penugasanId: l.penugasanId,
    pelaporId: l.pelaporId,
    rolePelapor: l.rolePelapor,
    namaPengisi: l.namaPengisi,
    jabatanPengisi: l.jabatanPengisi,
    periodeMinggu: l.periodeMinggu,
    periodeTahun: l.periodeTahun,
    tanggalLapor: l.tanggalLapor.toISOString(),
    jumlahHariHadir: l.jumlahHariHadir,
    keteranganAbsensi: l.keteranganAbsensi,
    jumlahJamaahDilakukan: l.jumlahJamaahDilakukan,
    aktivitasMingguan: l.aktivitasMingguan,
    kendala: l.kendala,
    statusHonor: l.statusHonor,
    isForwardedToInduk: l.isForwardedToInduk,
    createdAt: l.createdAt.toISOString(),
    detailKitab: l.detailKitab?.map((d) => ({ fan: d.fan, namaKitab: d.namaKitab, frekuensiPertemuan: d.frekuensiPertemuan })),
  }
}

export const evaluasiKasusDtoSchema = z.object({
  id: z.string(),
  penugasanId: z.string(),
  judulMasalah: z.string(),
  deskripsi: z.string(),
  tingkatKeparahan: z.nativeEnum(TingkatKeparahan),
  statusMediasi: z.nativeEnum(StatusMediasi),
  mediatorId: z.string().nullable(),
  catatanMediasi: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type EvaluasiKasusDto = z.infer<typeof evaluasiKasusDtoSchema>

export function toEvaluasiKasusDto(e: {
  id: string
  penugasanId: string
  judulMasalah: string
  deskripsi: string
  tingkatKeparahan: TingkatKeparahan
  statusMediasi: StatusMediasi
  mediatorId: string | null
  catatanMediasi: string | null
  createdAt: Date
  updatedAt: Date
}): EvaluasiKasusDto {
  return {
    id: e.id,
    penugasanId: e.penugasanId,
    judulMasalah: e.judulMasalah,
    deskripsi: e.deskripsi,
    tingkatKeparahan: e.tingkatKeparahan,
    statusMediasi: e.statusMediasi,
    mediatorId: e.mediatorId,
    catatanMediasi: e.catatanMediasi,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }
}

export const evaluasiIndukDtoSchema = z.object({
  id: z.string(),
  penugasanId: z.string(),
  lembagaId: z.string(),
  evaluatorId: z.string(),
  initiatedById: z.string(),
  catatanEvaluasi: z.string(),
  rekomendasi: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type EvaluasiIndukDto = z.infer<typeof evaluasiIndukDtoSchema>

export function toEvaluasiIndukDto(e: {
  id: string
  penugasanId: string
  lembagaId: string
  evaluatorId: string
  initiatedById: string
  catatanEvaluasi: string
  rekomendasi: string | null
  createdAt: Date
  updatedAt: Date
}): EvaluasiIndukDto {
  return {
    id: e.id,
    penugasanId: e.penugasanId,
    lembagaId: e.lembagaId,
    evaluatorId: e.evaluatorId,
    initiatedById: e.initiatedById,
    catatanEvaluasi: e.catatanEvaluasi,
    rekomendasi: e.rekomendasi,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }
}

// Request schemas (API)
export const listPenugasanQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: penugasanStatusSchema.optional(),
  guruBantuId: z.string().optional(),
  lembagaId: z.string().optional(),
})

export const submitLaporanRequestSchema = z.object({
  penugasanId: z.string().trim().min(1),
  periodeMinggu: z.number().int().min(1).max(53),
  periodeTahun: z.number().int().min(2020).max(2100),
  jumlahHariHadir: z.number().int().min(0).max(7),
  keteranganAbsensi: z.string().trim().max(500).optional(),
  jumlahJamaahDilakukan: z.number().int().min(0),
  aktivitasMingguan: z.string().trim().min(10).max(2000),
  kendala: z.string().trim().max(1000).optional(),
  statusHonor: statusHonorSchema,
  detailKitab: z.array(z.object({
    fan: fanIlmuSchema,
    namaKitab: z.string().trim().min(1).max(200),
    frekuensiPertemuan: z.number().int().min(1),
  })).optional(),
})

export const listLaporanQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  penugasanId: z.string().optional(),
  periodeMinggu: z.coerce.number().int().optional(),
  periodeTahun: z.coerce.number().int().optional(),
})

export const createEvaluasiKasusRequestSchema = z.object({
  penugasanId: z.string().trim().min(1),
  judulMasalah: z.string().trim().min(3).max(200),
  deskripsi: z.string().trim().min(10),
  tingkatKeparahan: z.nativeEnum(TingkatKeparahan),
})

export const createEvaluasiIndukRequestSchema = z.object({
  penugasanId: z.string().trim().min(1),
  lembagaId: z.string().trim().min(1),
  catatanEvaluasi: z.string().trim().min(10),
  rekomendasi: z.string().trim().max(2000).optional(),
})

export const idParamSchema = z.object({ id: z.string().trim().min(1) })
