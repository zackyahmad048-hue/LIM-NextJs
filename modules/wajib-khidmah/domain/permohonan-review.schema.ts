import { z } from 'zod'

export const reviewPermohonanSchema = z.object({
  permohonanId: z.string().trim().min(1),
  action: z.enum(['approve', 'reject']),
  catatan: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

export type ReviewPermohonanInput = z.infer<typeof reviewPermohonanSchema>
