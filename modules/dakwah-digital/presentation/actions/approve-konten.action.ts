// modules/dakwah-digital/presentation/actions/approve-konten.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { approveKontenRecord, publishKontenRecord } from '@/modules/dakwah-digital/application/dakwah-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { KontenDakwah } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function approveKontenAction(formData: FormData): Promise<ActionResult<KontenDakwah>> {
  const parsed = z.object({ kontenId: z.string().trim().min(1) }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  return runWithSessionTenant(session, async () => {
    try {
      const result = await approveKontenRecord(parsed.data.kontenId, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        organisasiId: null,
        lembagaId: null,
      })
      revalidatePath('/dashboard/dakwah/konten', 'page')
      return { success: true, data: result }
    } catch (error) {
      console.error('[approveKontenAction]', error)
      if (error instanceof ApiError) return { success: false, error: error.message }
      return { success: false, error: 'Gagal menyetujui konten' }
    }
  })
}

export async function publishKontenAction(formData: FormData): Promise<ActionResult<KontenDakwah>> {
  const parsed = z.object({ kontenId: z.string().trim().min(1) }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  return runWithSessionTenant(session, async () => {
    try {
      const result = await publishKontenRecord(parsed.data.kontenId, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        organisasiId: null,
        lembagaId: null,
      })
      revalidatePath('/dashboard/dakwah/konten', 'page')
      return { success: true, data: result }
    } catch (error) {
      console.error('[publishKontenAction]', error)
      if (error instanceof ApiError) return { success: false, error: error.message }
      return { success: false, error: 'Gagal mempublikasikan konten' }
    }
  })
}