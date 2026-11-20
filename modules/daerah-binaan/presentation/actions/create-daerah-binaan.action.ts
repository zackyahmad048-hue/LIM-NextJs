// modules/daerah-binaan/presentation/actions/create-daerah-binaan.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createDaerahBinaanSchema } from '@/modules/daerah-binaan/domain/daerah-binaan.schema'
import { createDaerahRecord } from '@/modules/daerah-binaan/application/daerah-binaan-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { DaerahBinaan } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createDaerahBinaanAction(formData: FormData): Promise<ActionResult<DaerahBinaan>> {
  const parsed = createDaerahBinaanSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createDaerahRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/daerah-binaan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createDaerahBinaanAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat daerah binaan' }
  }
}