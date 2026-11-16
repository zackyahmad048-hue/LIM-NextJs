// modules/pesantren-ramadan/domain/sekolah-mitra.schema.ts
import { z } from 'zod'

export const createSekolahMitraSchema = z.object({
  namaSekolah: z.string().trim().min(3).max(200),
  jenjang: z.enum(['SD', 'SMP', 'SMA', 'PERGURUAN_TINGGI']),
  alamat: z.string().trim().min(5),
  picNama: z.string().trim().min(2).max(100),
  picNoHp: z.string().trim().min(5).max(30),
  picJabatan: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateSekolahMitraInput = z.infer<typeof createSekolahMitraSchema>

export const createBankMateriSchema = z.object({
  judulMateri: z.string().trim().min(3).max(200),
  deskripsi: z.string().trim().min(5),
  targetJenjang: z.enum(['SD', 'SMP', 'SMA', 'PERGURUAN_TINGGI']),
  durasiMenit: z.coerce.number().int().positive().max(600),
})

export type CreateBankMateriInput = z.infer<typeof createBankMateriSchema>