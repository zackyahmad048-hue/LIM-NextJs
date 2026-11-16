// modules/daerah-binaan/domain/daerah-binaan.schema.ts
import { z } from 'zod'

export const createDaerahBinaanSchema = z.object({
  namaLokasi: z.string().trim().min(3).max(200),
  provinsi: z.string().trim().min(2),
  kabupaten: z.string().trim().min(2),
  kecamatan: z.string().trim().min(2),
  deskripsiKondisi: z.string().trim().min(10),
  sumberLokasi: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateDaerahBinaanInput = z.infer<typeof createDaerahBinaanSchema>

export const createLaporanBulananSchema = z.object({
  daerahBinaanId: z.string().trim().min(1),
  bulan: z.coerce.number().int().min(1).max(12),
  tahun: z.coerce.number().int().min(2020).max(2100),
  kegiatanDilakukan: z.string().trim().min(10),
  jumlahPesertaEstimasi: z.coerce.number().int().min(0).optional(),
  dampakNaratif: z.string().trim().min(10),
  tantanganHambatan: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
  rencanaBulanDepan: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateLaporanBulananInput = z.infer<typeof createLaporanBulananSchema>