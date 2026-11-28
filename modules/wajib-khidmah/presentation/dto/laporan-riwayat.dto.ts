import { z } from 'zod'

export const laporanRiwayatQuerySchema = z.object({
  jenis: z.enum(['rekap-tahun', 'wilayah', 'pola', 'top', 'gb', 'kasus', 'kualitas', 'cari', 'detail']),
  tahun: z.string().regex(/^\d{4}\/\d{4}$/).optional(),
  provinsi: z.string().trim().min(1).optional(),
  kabupaten: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().min(2).optional(),
  id: z.string().trim().min(1).optional(),
})
export type LaporanRiwayatQuery = z.infer<typeof laporanRiwayatQuerySchema>