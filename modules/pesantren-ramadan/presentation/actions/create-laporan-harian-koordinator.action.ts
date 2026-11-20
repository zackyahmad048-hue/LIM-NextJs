// modules/pesantren-ramadan/presentation/actions/create-laporan-harian-koordinator.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createLaporanHarianKoordinatorSchema } from '@/modules/pesantren-ramadan/domain/laporan-harian-koordinator.schema'
import { createLaporanKoordinatorRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { LaporanHarianKoordinator } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createLaporanHarianKoordinatorAction(formData: FormData): Promise<ActionResult<LaporanHarianKoordinator>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanHarianKoordinatorSchema.safeParse({
    ...raw,
    pengajarHadir: raw.pengajarHadir === 'true' || raw.pengajarHadir === 'on',
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createLaporanKoordinatorRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/pesantren/laporan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createLaporanHarianKoordinatorAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mengirim laporan koordinator' }
  }
}