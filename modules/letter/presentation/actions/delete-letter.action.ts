// modules/letter/presentation/actions/delete-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { deleteLetterRecord } from '@/modules/letter/application/letter-operations'
import type { ActionResult } from '@/types/api'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

const schema = z.object({ letterId: z.string().trim().min(1) })

export async function deleteLetterAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await deleteLetterRecord(parsed.data.letterId, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/letters', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[deleteLetterAction]', error)
      return { success: false, error: 'Gagal menghapus surat', code: 'INTERNAL_ERROR' }
    }
  })
}