// modules/letter/presentation/actions/approve-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { approveLetterRecord } from '@/modules/letter/application/letter-operations'
import type { ActionResult } from '@/types/api'
import type { Letter } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

const schema = z.object({ letterId: z.string().trim().min(1) })

export async function approveLetterAction(formData: FormData): Promise<ActionResult<Letter>> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  try {
    const h = await headers()
    const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
    const updated = await approveLetterRecord(parsed.data.letterId, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      ipAddress,
    })
    revalidatePath('/dashboard/letters', 'page')
    revalidatePath(`/dashboard/letters/${parsed.data.letterId}`, 'page')
    return { success: true, data: updated }
  } catch (error) {
    if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
    console.error('[approveLetterAction]', error)
    return { success: false, error: 'Gagal menyetujui surat', code: 'INTERNAL_ERROR' }
  }
}