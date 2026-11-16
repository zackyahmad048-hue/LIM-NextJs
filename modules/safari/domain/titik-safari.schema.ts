// modules/safari/domain/titik-safari.schema.ts
import { z } from 'zod'

export const createTitikSafariSchema = z.object({
  namaTitik: z.string().trim().min(3, 'Nama titik minimal 3 karakter').max(200),
  alamat: z.string().trim().min(5, 'Alamat minimal 5 karakter'),
  provinsi: z.string().trim().min(2),
  kabupaten: z.string().trim().min(2),
  kecamatan: z.string().trim().min(2),
  desa: z.string().trim().min(2),
  picNama: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
  picNoHp: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateTitikSafariInput = z.infer<typeof createTitikSafariSchema>