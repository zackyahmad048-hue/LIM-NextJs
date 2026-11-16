// modules/wajib-khidmah/domain/evaluasi.schema.ts
import { z } from 'zod'

export const createEvaluasiKasusSchema = z.object({
  penugasanId: z.string().trim().min(1, 'Penugasan wajib dipilih'),
  judulMasalah: z.string().trim().min(3, 'Judul minimal 3 karakter').max(200),
  deskripsi: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  tingkatKeparahan: z.enum(['RINGAN', 'SEDANG', 'BERAT'], { message: 'Tingkat keparahan tidak valid' }),
})

export type CreateEvaluasiKasusInput = z.infer<typeof createEvaluasiKasusSchema>

export const updateMediasiSchema = z.object({
  kasusId: z.string().trim().min(1),
  statusMediasi: z.enum(['MENUNGGU_PUSAT', 'MEDIASI_CABANG', 'EVALUASI_INDUK', 'SELESAI', 'DICABUT']),
  catatanMediasi: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type UpdateMediasiInput = z.infer<typeof updateMediasiSchema>