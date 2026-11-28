// modules/pesantren-ramadan/presentation/actions/create-penugasan-pesantren.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createPenugasanPesantrenSchema } from '@/modules/pesantren-ramadan/domain/penugasan-pesantren.schema'
import { createPenugasanPesantrenRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { PenugasanPesantren } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createPenugasanPesantrenAction(formData: FormData): Promise<ActionResult<PenugasanPesantren>> {
  const parsed = createPenugasanPesantrenSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  return runWithSessionTenant(session, async () => {
    try {
      const result = await createPenugasanPesantrenRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        organisasiId: null,
        lembagaId: null,
      })
      revalidatePath('/dashboard/pesantren/penugasan', 'page')
      return { success: true, data: result }
    } catch (error) {
      console.error('[createPenugasanPesantrenAction]', error)
      if (error instanceof ApiError) return { success: false, error: error.message }
      return { success: false, error: 'Gagal membuat penugasan pesantren' }
    }

  })
}
