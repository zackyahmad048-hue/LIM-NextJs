// modules/safari/domain/laporan-sidak.schema.ts
import { z } from 'zod'

export const createLaporanSidakSchema = z.object({
  delegasiId: z.string().trim().min(1),
  tanggalSidak: z.coerce.date(),
  kondisiKegiatan: z.string().trim().min(5, 'Kondisi kegiatan minimal 5 karakter'),
  kondisiDelegasi: z.string().trim().min(5, 'Kondisi delegasi minimal 5 karakter'),
  kendala: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
  rekomendasi: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateLaporanSidakInput = z.infer<typeof createLaporanSidakSchema>