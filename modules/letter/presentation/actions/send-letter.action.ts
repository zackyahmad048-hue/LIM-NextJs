// src/modules/letter/presentation/actions/send-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { sendLetterRecord } from '@/modules/letter/application/letter-operations'
import type { ActionResult } from '@/types/api'
import type { Letter } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

const sendLetterSchema = z.object({
  letterId: z.string().trim().min(1, 'ID surat wajib diisi'),
})

export async function sendLetterAction(formData: FormData): Promise<ActionResult<Letter>> {
  const parsedForm = sendLetterSchema.safeParse(Object.fromEntries(formData))
  if (!parsedForm.success) {
    return { success: false, errors: parsedForm.error.flatten().fieldErrors }
  }

  const session = (await getSession()) as LIMSession | null
  if (!session) {
    return { success: false, error: 'Unauthorized: Silakan login terlebih dahulu', code: 'UNAUTHORIZED' }
  }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await sendLetterRecord(parsedForm.data.letterId, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/letters', 'page')
      revalidatePath(`/dashboard/letters/${parsedForm.data.letterId}`, 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message, code: error.code }
      }
      console.error('[sendLetterAction] Error:', error)
      return { success: false, error: 'Gagal mengirim surat. Silakan coba lagi atau hubungi administrator.', code: 'INTERNAL_ERROR' }
    }
  })
}