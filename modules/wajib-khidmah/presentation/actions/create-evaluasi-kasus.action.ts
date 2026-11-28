'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createEvaluasiKasusSchema } from '@/modules/wajib-khidmah/domain/evaluasi.schema'
import { createEvaluasiKasusRecord } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'
import type { ActionResult } from '@/types/api'
import type { EvaluasiKasus } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function createEvaluasiKasusAction(formData: FormData): Promise<ActionResult<EvaluasiKasus>> {
  const parsed = createEvaluasiKasusSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const evaluasi = await createEvaluasiKasusRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/wajib-khidmah/evaluasi', 'page')
      return { success: true, data: evaluasi }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[createEvaluasiKasusAction]', error)
      return { success: false, error: 'Gagal membuat evaluasi kasus', code: 'INTERNAL_ERROR' }
    }

  })
}
