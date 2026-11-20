// modules/dakwah-digital/presentation/actions/register-event.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { pendaftaranEventSchema } from '@/modules/dakwah-digital/domain/konten-dakwah.schema'
import { registerEventRecord } from '@/modules/dakwah-digital/application/dakwah-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { PendaftaranEvent } from '@/generated/client'

export async function registerEventAction(formData: FormData): Promise<ActionResult<PendaftaranEvent>> {
  const parsed = pendaftaranEventSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  try {
    const result = await registerEventRecord(parsed.data)
    revalidatePath('/dashboard/dakwah/event', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[registerEventAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mendaftar event' }
  }
}