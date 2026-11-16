// modules/pesantren-ramadan/domain/penugasan-pesantren.schema.ts
import { z } from 'zod'

export const createPenugasanPesantrenSchema = z.object({
  sekolahId: z.string().trim().min(1),
  pengajarId: z.string().trim().min(1),
  koordinatorId: z.string().trim().min(1),
  tanggalMulai: z.coerce.date(),
  tanggalSelesai: z.coerce.date(),
})

export type CreatePenugasanPesantrenInput = z.infer<typeof createPenugasanPesantrenSchema>