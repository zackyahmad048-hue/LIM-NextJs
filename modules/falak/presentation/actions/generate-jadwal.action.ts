// modules/falak/presentation/actions/generate-jadwal.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { generateJadwalSchema } from '@/modules/falak/domain/falak.schema'
import { generateJadwal, FalakError } from '@/modules/falak/application/generate-jadwal'
import { PrismaFalakRepository } from '@/modules/falak/infrastructure/prisma-falak.repository'
import type { ActionResult } from '@/types/api'
import type { JadwalShalat } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER']

export async function generateJadwalAction(formData: FormData): Promise<ActionResult<JadwalShalat>> {
  const parsed = generateJadwalSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaFalakRepository()
    const result = await generateJadwal(repo, parsed.data.tanggal, parsed.data.modeWaktu)
    revalidatePath('/dashboard/falak/konfigurasi', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[generateJadwalAction]', error)
    if (error instanceof FalakError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal generate jadwal shalat' }
  }
}