// modules/dakwah-digital/presentation/actions/upload-konten.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createKontenSchema } from '@/modules/dakwah-digital/domain/konten-dakwah.schema'
import { createKontenRecord } from '@/modules/dakwah-digital/application/dakwah-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { KontenDakwah } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function uploadKontenAction(formData: FormData): Promise<ActionResult<KontenDakwah>> {
  const parsed = createKontenSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createKontenRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/dakwah/konten', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[uploadKontenAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mengupload konten' }
  }
}