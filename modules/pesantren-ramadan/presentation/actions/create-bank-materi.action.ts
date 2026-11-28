// modules/pesantren-ramadan/presentation/actions/create-bank-materi.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createBankMateriSchema } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.schema'
import { createMateriRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { BankMateri } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createBankMateriAction(formData: FormData): Promise<ActionResult<BankMateri>> {
  const raw = Object.fromEntries(formData)
  const parsed = createBankMateriSchema.safeParse({
    ...raw,
    durasiMenit: raw.durasiMenit ? Number(raw.durasiMenit) : raw.durasiMenit,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  return runWithSessionTenant(session, async () => {
    try {
      const result = await createMateriRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        organisasiId: null,
        lembagaId: null,
      })
      revalidatePath('/dashboard/pesantren/bank-materi', 'page')
      return { success: true, data: result }
    } catch (error) {
      console.error('[createBankMateriAction]', error)
      if (error instanceof ApiError) return { success: false, error: error.message }
      return { success: false, error: 'Gagal membuat bank materi' }
    }

  })
}
