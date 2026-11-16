// modules/dakwah-digital/domain/konten-dakwah.schema.ts
import { z } from 'zod'

export const createKontenSchema = z.object({
  judul: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug hanya huruf kecil, angka, dan tanda -'),
  deskripsi: z.string().trim().min(10),
  jenisKonten: z.enum(['WEBINAR', 'PODCAST', 'KONTEN_MEDIASOS', 'KULTUM_DIGITAL', 'TANYA_JAWAB_ONLINE']),
  thumbnailUrl: z.string().trim().url().optional().or(z.literal('').transform(() => undefined)),
  linkVideo: z.string().trim().url().optional().or(z.literal('').transform(() => undefined)),
})

export type CreateKontenInput = z.infer<typeof createKontenSchema>

export const pendaftaranEventSchema = z.object({
  kontenId: z.string().trim().min(1),
  namaPeserta: z.string().trim().min(2).max(200),
  email: z.string().trim().email('Format email tidak valid'),
  noHp: z.string().trim().min(5).max(30),
  asalInstansi: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
})

export type PendaftaranEventInput = z.infer<typeof pendaftaranEventSchema>