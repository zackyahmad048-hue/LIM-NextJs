// modules/safari/domain/approval-jurnal.schema.ts
import { z } from 'zod'

export const approveJurnalSchema = z.object({
  delegasiId: z.string().trim().min(1),
  approverJabatan: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
  isApproved: z.coerce.boolean().default(true),
  catatan: z.string().trim().max(500).optional().or(z.literal('').transform(() => undefined)),
})

export type ApproveJurnalInput = z.infer<typeof approveJurnalSchema>