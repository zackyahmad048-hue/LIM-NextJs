// modules/pesantren-ramadan/domain/laporan-harian-koordinator.schema.ts
import { z } from 'zod'

export const createLaporanHarianKoordinatorSchema = z.object({
  penugasanId: z.string().trim().min(1),
  tanggal: z.coerce.date(),
  pengajarHadir: z.coerce.boolean(),
  kesiapanSarana: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
  catatanUmum: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateLaporanHarianKoordinatorInput = z.infer<typeof createLaporanHarianKoordinatorSchema>