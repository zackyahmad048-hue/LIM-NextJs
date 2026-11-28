import { z } from 'zod'
import { StatusDaerahBinaan } from '@/generated/client'

export const daerahBinaanDtoSchema = z.object({
  id: z.string(), namaLokasi: z.string(), provinsi: z.string(), kabupaten: z.string(), kecamatan: z.string(),
  deskripsiKondisi: z.string(), sumberLokasi: z.string().nullable(), status: z.nativeEnum(StatusDaerahBinaan),
  picLokalId: z.string().nullable(), createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
})
export type DaerahBinaanDto = z.infer<typeof daerahBinaanDtoSchema>

export function toDaerahDto(d: { id: string; namaLokasi: string; provinsi: string; kabupaten: string; kecamatan: string; deskripsiKondisi: string; sumberLokasi: string | null; status: StatusDaerahBinaan; picLokalId: string | null; createdAt: Date; updatedAt: Date }): DaerahBinaanDto {
  return { id: d.id, namaLokasi: d.namaLokasi, provinsi: d.provinsi, kabupaten: d.kabupaten, kecamatan: d.kecamatan, deskripsiKondisi: d.deskripsiKondisi, sumberLokasi: d.sumberLokasi, status: d.status, picLokalId: d.picLokalId, createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString() }
}

export const laporanBulananDtoSchema = z.object({
  id: z.string(), daerahBinaanId: z.string(), pelaporId: z.string(), bulan: z.number().int(), tahun: z.number().int(),
  tanggalLapor: z.string().datetime(), kegiatanDilakukan: z.string(), jumlahPesertaEstimasi: z.number().int().nullable(),
  dampakNaratif: z.string(), tantanganHambatan: z.string().nullable(), rencanaBulanDepan: z.string().nullable(), createdAt: z.string().datetime(),
})
export type LaporanBulananDto = z.infer<typeof laporanBulananDtoSchema>

export function toLaporanBulananDto(l: { id: string; daerahBinaanId: string; pelaporId: string; bulan: number; tahun: number; tanggalLapor: Date; kegiatanDilakukan: string; jumlahPesertaEstimasi: number | null; dampakNaratif: string; tantanganHambatan: string | null; rencanaBulanDepan: string | null; createdAt: Date }): LaporanBulananDto {
  return { id: l.id, daerahBinaanId: l.daerahBinaanId, pelaporId: l.pelaporId, bulan: l.bulan, tahun: l.tahun, tanggalLapor: l.tanggalLapor.toISOString(), kegiatanDilakukan: l.kegiatanDilakukan, jumlahPesertaEstimasi: l.jumlahPesertaEstimasi, dampakNaratif: l.dampakNaratif, tantanganHambatan: l.tantanganHambatan, rencanaBulanDepan: l.rencanaBulanDepan, createdAt: l.createdAt.toISOString() }
}

export const createDaerahRequestSchema = z.object({ namaLokasi: z.string().trim().min(3).max(200), provinsi: z.string().trim().min(2), kabupaten: z.string().trim().min(2), kecamatan: z.string().trim().min(2), deskripsiKondisi: z.string().trim().min(10), sumberLokasi: z.string().trim().max(200).optional() })
export const createLaporanBulananRequestSchema = z.object({ daerahBinaanId: z.string().trim().min(1), bulan: z.number().int().min(1).max(12), tahun: z.number().int().min(2020).max(2100), kegiatanDilakukan: z.string().trim().min(10), jumlahPesertaEstimasi: z.number().int().min(0).optional(), dampakNaratif: z.string().trim().min(10), tantanganHambatan: z.string().trim().max(2000).optional(), rencanaBulanDepan: z.string().trim().max(2000).optional() })
export const listQuerySchema = z.object({ page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(20), cursor: z.string().optional(), daerahBinaanId: z.string().optional(), status: z.nativeEnum(StatusDaerahBinaan).optional() })
