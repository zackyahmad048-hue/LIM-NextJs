// modules/wajib-khidmah/domain/laporan-mingguan.schema.ts
import { z } from 'zod'

// Schema untuk submit laporan mingguan (dari GURU_BANTU atau LEMBAGA_EKSTERNAL)
export const submitLaporanSchema = z.object({
  // ID Penugasan yang akan dilaporkan
  penugasanId: z
    .string()
    .trim()
    .min(1, 'Penugasan wajib dipilih'),

  // Periode waktu laporan
  periodeMinggu: z
    .number()
    .int('Periode minggu harus bilangan bulat')
    .min(1, 'Periode minggu minimal 1')
    .max(53, 'Periode minggu maksimal 53')
    .finite('Periode minggu tidak valid'),

  periodeTahun: z
    .number()
    .int('Periode tahun harus bilangan bulat')
    .min(2020, 'Periode tahun minimal 2020')
    .max(2100, 'Periode tahun maksimal 2100')
    .finite('Periode tahun tidak valid'),

  // Data kehadiran
  jumlahHariHadir: z
    .number()
    .int('Jumlah hari hadir harus bilangan bulat')
    .min(0, 'Jumlah hari hadir minimal 0')
    .max(7, 'Jumlah hari hadir maksimal 7 (1 minggu)')
    .finite('Jumlah hari hadir tidak valid'),

  keteranganAbsensi: z
    .string()
    .trim()
    .max(500, 'Keterangan absensi maksimal 500 karakter')
    .optional()
    .or(z.literal('').transform(() => undefined)),

  // Data jamaah & aktivitas
  jumlahJamaahDilakukan: z
    .number()
    .int('Jumlah jamaah harus bilangan bulat')
    .min(0, 'Jumlah jamaah minimal 0')
    .max(10000, 'Jumlah jamaah tidak wajar (maksimal 10.000)')
    .finite('Jumlah jamaah tidak valid'),

  aktivitasMingguan: z
    .string()
    .trim()
    .min(10, 'Aktivitas mingguan minimal 10 karakter')
    .max(2000, 'Aktivitas mingguan maksimal 2000 karakter'),

  kendala: z
    .string()
    .trim()
    .max(1000, 'Kendala maksimal 1000 karakter')
    .optional()
    .or(z.literal('').transform(() => undefined)),

  // Status honor
  statusHonor: z.enum(['SUDAH_SESUAI', 'BELUM', 'SEBAGIAN', 'TIDAK_BERLAKU'], {
    message: 'Status honor tidak valid',
  }),

  // Audit trail (WAJIB untuk akun organisasional LEMBAGA_EKSTERNAL)
  namaPengisi: z
    .string()
    .trim()
    .min(2, 'Nama pengisi minimal 2 karakter')
    .max(100, 'Nama pengisi maksimal 100 karakter'),

  jabatanPengisi: z
    .string()
    .trim()
    .min(2, 'Jabatan pengisi minimal 2 karakter')
    .max(100, 'Jabatan pengisi maksimal 100 karakter'),
})

export type SubmitLaporanInput = z.infer<typeof submitLaporanSchema>