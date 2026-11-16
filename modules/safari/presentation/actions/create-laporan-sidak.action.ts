// modules/safari/presentation/actions/create-laporan-sidak.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createLaporanSidakSchema } from '@/modules/safari/domain/laporan-sidak.schema'
import { createLaporanSidak } from '@/modules/safari/application/laporan-sidak'
import { PrismaLaporanSidakRepository } from '@/modules/safari/infrastructure/prisma-laporan-sidak.repository'
import type { ActionResult } from '@/types/api'
import type { LaporanSidak } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC']

export async function createLaporanSidakAction(formData: FormData): Promise<ActionResult<LaporanSidak>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanSidakSchema.safeParse(raw)
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaLaporanSidakRepository()
    const result = await createLaporanSidak(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/safari/sidak', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createLaporanSidakAction]', error)
    return { success: false, error: 'Gagal membuat laporan sidak' }
  }
}