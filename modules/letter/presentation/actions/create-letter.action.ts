// modules/letter/presentation/actions/create-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createLetterSchema } from '@/modules/letter/domain/letter.schema'
import { createLetterRecord } from '@/modules/letter/application/letter-operations'
import type { ActionResult } from '@/types/api'
import type { Letter } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function createLetterAction(formData: FormData): Promise<ActionResult<Letter>> {
  const parsed = createLetterSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const result = await createLetterRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
      })
      revalidatePath('/dashboard/letters', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message, code: error.code }
      }
      console.error('[createLetterAction]', error)
      return { success: false, error: 'Gagal membuat surat', code: 'INTERNAL_ERROR' }
    }
  })
}