// modules/falak/domain/falak.schema.ts
import { z } from 'zod'

export const modeWaktuSchema = z.enum(['standar', 'istiwa'])

export const generateJadwalSchema = z.object({
  tanggal: z.coerce.date(),
  modeWaktu: modeWaktuSchema.optional(),
})

export type GenerateJadwalInput = z.infer<typeof generateJadwalSchema>