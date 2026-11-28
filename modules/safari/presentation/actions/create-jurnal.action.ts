// modules/safari/presentation/actions/create-jurnal.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createJurnalSchema } from '@/modules/safari/domain/delegasi-safari.schema'
import { createJurnalRecord } from '@/modules/safari/application/safari-operations'
import type { ActionResult } from '@/types/api'
import type { JurnalHarianSafari } from '@/generated/client'
import type { LIMSession } from '@/types/auth'
import { ApiError } from '@/lib/api/errors'

export async function createJurnalAction(formData: FormData): Promise<ActionResult<JurnalHarianSafari>> {
  const raw = Object.fromEntries(formData)
  const parsed = createJurnalSchema.safeParse({
    ...raw,
    jumlahJamaah: raw.jumlahJamaah ? Number(raw.jumlahJamaah) : undefined,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }

  return runWithSessionTenant(session, async () => {
    try {
      const h = await headers()
      const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
      const result = await createJurnalRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        ipAddress,
      })
      revalidatePath('/dashboard/safari/jurnal', 'page')
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message, code: error.code }
      console.error('[createJurnalAction]', error)
      return { success: false, error: 'Gagal mengirim jurnal', code: 'INTERNAL_ERROR' }
    }

  })
}
