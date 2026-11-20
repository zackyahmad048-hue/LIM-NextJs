// modules/pesantren-ramadan/presentation/actions/create-sekolah-mitra.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createSekolahMitraSchema } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.schema'
import { createSekolahRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { SekolahMitra } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createSekolahMitraAction(formData: FormData): Promise<ActionResult<SekolahMitra>> {
  const parsed = createSekolahMitraSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createSekolahRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/pesantren/sekolah-mitra', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createSekolahMitraAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat sekolah mitra' }
  }
}