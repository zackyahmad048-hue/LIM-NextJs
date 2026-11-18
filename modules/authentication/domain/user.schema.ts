// modules/authentication/domain/user.schema.ts
import { z } from 'zod'

// OWNER sengaja tidak ada di sini — role OWNER hanya lahir dari seed/DB langsung
// agar tidak bisa dibuat/disalahgunakan lewat UI (keputusan scope: lihat riwayat fitur).
export const CREATABLE_ROLES = [
  'ADMIN_SEKRETARIAT',
  'TIM_WAJIB_KHIDMAH',
  'CONTENT_MANAGER',
  'ADMIN_BIDANG_SAFARI',
  'ADMIN_BIDANG_PESANTREN_RAMADAN',
  'PW',
  'PC',
  'PANITIA_SAFARI_DAERAH',
  'DELEGASI_SAFARI_DAERAH',
  'PENGAJAR_PESANTREN_RAMADAN',
  'GURU_BANTU',
  'LEMBAGA_EKSTERNAL',
  'PONDOK_INTERNAL',
] as const

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi').max(120),
  email: z.string().trim().toLowerCase().pipe(z.email('Format email tidak valid')),
  // Batas sama dengan konfigurasi better-auth (minPasswordLength: 8, maxPasswordLength: 128)
  password: z.string().min(8, 'Password minimal 8 karakter').max(128),
  role: z.enum(CREATABLE_ROLES),
  accountType: z.enum(['PERSONAL', 'ORGANIZATIONAL']),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
