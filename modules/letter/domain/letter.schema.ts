// modules/letter/domain/letter.schema.ts
import { z } from 'zod'

export const createLetterSchema = z.object({
  type: z.enum(['MASUK', 'KELUAR']).default('KELUAR'),
  pengirim: z.string().trim().min(2, 'Pengirim minimal 2 karakter').max(200),
  penerima: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
  perihal: z.string().trim().min(3, 'Perihal minimal 3 karakter').max(500),
  isiSurat: z.string().trim().min(10, 'Isi surat minimal 10 karakter'),
})

export type CreateLetterInput = z.infer<typeof createLetterSchema>

export const letterFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['DIKETIK', 'REVIEW', 'APPROVED', 'SENT', 'ARCHIVED']).optional(),
  type: z.enum(['MASUK', 'KELUAR']).optional(),
  q: z.string().trim().optional(),
})

export type LetterFilter = z.infer<typeof letterFilterSchema>