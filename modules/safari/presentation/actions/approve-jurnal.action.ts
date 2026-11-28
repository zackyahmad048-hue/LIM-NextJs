// modules/safari/presentation/actions/approve-jurnal.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { approveJurnalSchema } from '@/modules/safari/domain/approval-jurnal.schema'
import { approveJurnalRecord } from '@/modules/safari/application/safari-operations'
import type { ActionResult } from '@/types/api'
import type { ApprovalJurnal } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function approveJurnalAction(formData: FormData): Promise<ActionResult<ApprovalJurnal>> {
  const raw = Object.fromEntries(formData)
  const parsed = approveJurnalSchema.safeParse({
    ...raw,
    isApproved: raw.isApproved === undefined ? true : raw.isApproved,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await approveJurnalRecord(
        { delegasiId: parsed.data.delegasiId, isApproved: parsed.data.isApproved, approverJabatan: parsed.data.approverJabatan },
        {
          userId: session.user.id,
          role: session.user.role,
          accountType: session.user.accountType,
          name: session.user.name || 'Pengguna',
          ipAddress,
        }
      )
      revalidatePath('/dashboard/safari/jurnal', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[approveJurnalAction]', error)
      return { success: false, error: 'Gagal memproses approval', code: 'INTERNAL_ERROR' }
    }

  })
}
