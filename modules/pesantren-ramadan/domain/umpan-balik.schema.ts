// modules/pesantren-ramadan/domain/umpan-balik.schema.ts
import { z } from 'zod'

export const createUmpanBalikPusatSchema = z.object({
  penugasanId: z.string().trim().min(1),
  tanggalKunjungan: z.coerce.date(),
  kondisiSarana: z.string().trim().min(5),
  relevansiMateri: z.string().trim().min(5),
  kesesuaianKesepakatan: z.string().trim().min(5),
  rekomendasi: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateUmpanBalikPusatInput = z.infer<typeof createUmpanBalikPusatSchema>

export const createUmpanBalikPesertaSchema = z.object({
  penugasanId: z.string().trim().min(1),
  jumlahResponden: z.coerce.number().int().positive(),
  ratingKepuasan: z.coerce.number().min(0).max(5),
  komentarPositif: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
  komentarPerbaikan: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateUmpanBalikPesertaInput = z.infer<typeof createUmpanBalikPesertaSchema>