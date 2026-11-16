// modules/wajib-khidmah/domain/evaluasi-induk.schema.ts
import { z } from 'zod'

export const createEvaluasiIndukSchema = z.object({
  penugasanId: z.string().trim().min(1),
  lembagaId: z.string().trim().min(1),
  catatanEvaluasi: z.string().trim().min(10, 'Catatan minimal 10 karakter'),
  rekomendasi: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateEvaluasiIndukInput = z.infer<typeof createEvaluasiIndukSchema>