// src/modules/letter/domain/letter-numbering.schema.ts
import { z } from 'zod'

export const letterNumberingSchema = z.object({
  seq: z.number()
    .int('Nomor urut harus bilangan bulat')
    .positive('Nomor urut harus lebih dari 0')
    .max(100000, 'Nomor urut maksimal 100000')
    .finite('Nomor urut tidak valid'),
    
  level: z.string()
    .trim() // Membersihkan spasi di awal/akhir
    .min(1, 'Level tidak boleh kosong')
    .max(50, 'Level maksimal 50 karakter')
    .refine((val) => !val.includes('/'), {
      message: 'Level tidak boleh mengandung karakter "/"',
    }),
    
  category: z.string()
    .trim() // Membersihkan spasi di awal/akhir
    .min(1, 'Kategori tidak boleh kosong')
    .max(50, 'Kategori maksimal 50 karakter')
    .refine((val) => !val.includes('/'), {
      message: 'Kategori tidak boleh mengandung karakter "/"',
    }),
    
  month: z.number()
    .int('Bulan harus bilangan bulat')
    .min(1, 'Bulan minimal 1')
    .max(12, 'Bulan maksimal 12')
    .finite('Bulan tidak valid'),
    
  year: z.number()
    .int('Tahun harus bilangan bulat')
    .min(1000, 'Tahun minimal 1000')
    .max(9999, 'Tahun maksimal 9999')
    .finite('Tahun tidak valid'),
    
  sequenceDigits: z.number()
    .int('Jumlah digit harus bilangan bulat')
    .positive('Jumlah digit harus lebih dari 0')
    .max(10, 'Jumlah digit maksimal 10')
    .finite('Jumlah digit tidak valid'),
})

export type LetterNumberingInput = z.infer<typeof letterNumberingSchema>