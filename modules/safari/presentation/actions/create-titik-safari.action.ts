// modules/safari/presentation/actions/create-titik-safari.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createTitikSafariSchema } from '@/modules/safari/domain/titik-safari.schema'
import { createTitikSafariRecord } from '@/modules/safari/application/safari-operations'
import type { ActionResult } from '@/types/api'
import type { TitikSafari } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function createTitikSafariAction(formData: FormData): Promise<ActionResult<TitikSafari>> {
  const parsed = createTitikSafariSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await createTitikSafariRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/safari/titik', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[createTitikSafariAction]', error)
      return { success: false, error: 'Gagal membuat titik safari', code: 'INTERNAL_ERROR' }
    }

  })
}
