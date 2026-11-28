'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { reviewPermohonanSchema } from '@/modules/wajib-khidmah/domain/permohonan-review.schema'
import { reviewPermohonanRecord } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'
import type { ActionResult } from '@/types/api'
import type { PermohonanGuruBantu } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function reviewPermohonanAction(formData: FormData): Promise<ActionResult<PermohonanGuruBantu>> {
  const parsed = reviewPermohonanSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await reviewPermohonanRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/wajib-khidmah/permohonan', 'page')
      revalidatePath('/dashboard/wajib-khidmah/riwayat', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[reviewPermohonanAction]', error)
      return { success: false, error: 'Gagal memproses permohonan', code: 'INTERNAL_ERROR' }
    }

  })
}
