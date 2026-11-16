// modules/pesantren-ramadan/domain/laporan-harian-pengajar.schema.ts
import { z } from 'zod'

export const createLaporanHarianPengajarSchema = z.object({
  penugasanId: z.string().trim().min(1),
  tanggal: z.coerce.date(),
  kelas: z.string().trim().min(1).max(100),
  jumlahSiswaL: z.coerce.number().int().min(0),
  jumlahSiswaP: z.coerce.number().int().min(0),
  materiId: z.string().trim().min(1),
  pertanyaanPeserta: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
  kondisiKelas: z.enum(['TENANG', 'RAMAI_TAPI_KONDUSIF', 'DISKUSI_BERJALAN_BAIK', 'BANYAK_YANG_MENGANTUK', 'TIDAK_KONDUSIF']),
  praktikDilakukan: z.coerce.boolean().default(false),
  catatanTambahan: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type CreateLaporanHarianPengajarInput = z.infer<typeof createLaporanHarianPengajarSchema>