// modules/safari/presentation/actions/create-laporan-sidak.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createLaporanSidakSchema } from '@/modules/safari/domain/laporan-sidak.schema'
import { createLaporanSidakRecord } from '@/modules/safari/application/safari-operations'
import type { ActionResult } from '@/types/api'
import type { LaporanSidak } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function createLaporanSidakAction(formData: FormData): Promise<ActionResult<LaporanSidak>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanSidakSchema.safeParse(raw)
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await createLaporanSidakRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/safari/sidak', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[createLaporanSidakAction]', error)
      return { success: false, error: 'Gagal membuat laporan sidak', code: 'INTERNAL_ERROR' }
    }

  })
}
