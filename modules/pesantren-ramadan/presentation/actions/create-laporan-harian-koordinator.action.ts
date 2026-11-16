// modules/pesantren-ramadan/presentation/actions/create-laporan-harian-koordinator.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createLaporanHarianKoordinatorSchema } from '@/modules/pesantren-ramadan/domain/laporan-harian-koordinator.schema'
import { createLaporanHarianKoordinator, LaporanKoordinatorError } from '@/modules/pesantren-ramadan/application/laporan-harian-koordinator'
import { PrismaLaporanHarianKoordinatorRepository } from '@/modules/pesantren-ramadan/infrastructure/prisma-laporan-harian-koordinator.repository'
import type { ActionResult } from '@/types/api'
import type { LaporanHarianKoordinator } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC']

export async function createLaporanHarianKoordinatorAction(formData: FormData): Promise<ActionResult<LaporanHarianKoordinator>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanHarianKoordinatorSchema.safeParse({
    ...raw,
    pengajarHadir: raw.pengajarHadir === 'true' || raw.pengajarHadir === 'on',
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaLaporanHarianKoordinatorRepository()
    const result = await createLaporanHarianKoordinator(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/pesantren/laporan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createLaporanHarianKoordinatorAction]', error)
    if (error instanceof LaporanKoordinatorError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mengirim laporan koordinator' }
  }
}