import { z } from 'zod'

export const PLACEHOLDER = 'belum diisi'

export const TAHUN_AJARAN_SEED = [
  { tahun: '2021/2022', tahunMulai: 2021, tahunSelesai: 2022, namaAngkatan: 'GAZA' },
  { tahun: '2022/2023', tahunMulai: 2022, tahunSelesai: 2023, namaAngkatan: 'MIZAB' },
  { tahun: '2023/2024', tahunMulai: 2023, tahunSelesai: 2024, namaAngkatan: 'CAHYO NINGRAT' },
  { tahun: '2024/2025', tahunMulai: 2024, tahunSelesai: 2025, namaAngkatan: 'DZAWEEN NAJA' },
  { tahun: '2025/2026', tahunMulai: 2025, tahunSelesai: 2026, namaAngkatan: 'ANFA' },
  { tahun: '2026/2027', tahunMulai: 2026, tahunSelesai: 2027, namaAngkatan: null },
  { tahun: '2027/2028', tahunMulai: 2027, tahunSelesai: 2028, namaAngkatan: null },
] as const

export const tahunAjaranSchema = z.object({
  tahun: z.string().regex(/^\d{4}\/\d{4}$/),
  tahunMulai: z.number().int().min(2000).max(2100),
  tahunSelesai: z.number().int().min(2000).max(2100),
  namaAngkatan: z.string().nullable(),
})

// Script mengirim '' sebagai undefined agar .default() berlaku.
export const lembagaImportSchema = z.object({
  namaLembaga: z.string().trim().min(3, 'nama lembaga kosong/terlalu pendek'),
  namaPimpinan: z.string().trim().min(1).default(PLACEHOLDER),
  alamatLengkap: z.string().trim().min(1).default(PLACEHOLDER),
  provinsi: z.string().trim().nullable().default(null),
  kabupaten: z.string().trim().nullable().default(null),
  kategori: z.enum(['EKSTERNAL', 'INTERNAL']).default('EKSTERNAL'),
  status: z.enum(['CALON', 'MITRA_AKTIF', 'NON_AKTIF']).default('CALON'),
  jenisLembaga: z.string().trim().nullable().default(null),
  pimpinanAlumniTahun: z.string().trim().nullable().default(null),
  isDzuriyyah: z.boolean().default(false),
  isBlacklist: z.boolean().default(false),
  catatanKhusus: z.string().trim().nullable().default(null),
})
export type LembagaImport = z.infer<typeof lembagaImportSchema>

export const riwayatImportSchema = z.object({
  tahun: z.string().regex(/^\d{4}\/\d{4}$/),
  jumlahDiminta: z.number().int().min(0).nullable().default(null),
  jumlahDisetujui: z.number().int().min(0).max(50).nullable().default(null),
  status: z.enum(['DIAJUKAN', 'DIPENUHI', 'TIDAK_DIPENUHI', 'REKOMENDASI']),
  catatanLembaga: z.string().nullable().default(null),
  catatanGb: z.string().nullable().default(null),
})
export type RiwayatImport = z.infer<typeof riwayatImportSchema>