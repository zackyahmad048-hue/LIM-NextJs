// modules/safari/domain/delegasi-safari.schema.ts
import { z } from 'zod'

export const createDelegasiSchema = z.object({
  titikId: z.string().trim().min(1, 'Titik wajib dipilih'),
  userId: z.string().trim().min(1, 'User wajib dipilih'),
  namaLengkap: z.string().trim().min(2).max(200),
  noHp: z.string().trim().min(5).max(30),
  asalPondok: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateDelegasiInput = z.infer<typeof createDelegasiSchema>

export const createJurnalSchema = z.object({
  delegasiId: z.string().trim().min(1),
  tanggal: z.coerce.date(),
  kegiatan: z.string().trim().min(5, 'Kegiatan minimal 5 karakter'),
  jumlahJamaah: z.coerce.number().int().min(0).optional(),
  catatan: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateJurnalInput = z.infer<typeof createJurnalSchema>