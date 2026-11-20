// modules/pesantren-ramadan/presentation/actions/create-umpan-balik-peserta.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createUmpanBalikPesertaSchema } from '@/modules/pesantren-ramadan/domain/umpan-balik.schema'
import { createUmpanBalikPesertaRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { UmpanBalikPeserta } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createUmpanBalikPesertaAction(formData: FormData): Promise<ActionResult<UmpanBalikPeserta>> {
  const raw = Object.fromEntries(formData)
  const parsed = createUmpanBalikPesertaSchema.safeParse({
    ...raw,
    jumlahResponden: raw.jumlahResponden ? Number(raw.jumlahResponden) : raw.jumlahResponden,
    ratingKepuasan: raw.ratingKepuasan ? Number(raw.ratingKepuasan) : raw.ratingKepuasan,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createUmpanBalikPesertaRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/pesantren/umpan-balik', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createUmpanBalikPesertaAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal menyimpan umpan balik peserta' }
  }
}