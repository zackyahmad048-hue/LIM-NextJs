// modules/dakwah-digital/presentation/actions/register-event.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { pendaftaranEventSchema } from '@/modules/dakwah-digital/domain/konten-dakwah.schema'
import { registerEvent, KontenError } from '@/modules/dakwah-digital/application/konten-dakwah'
import { PrismaKontenDakwahRepository } from '@/modules/dakwah-digital/infrastructure/prisma-konten-dakwah.repository'
import type { ActionResult } from '@/types/api'
import type { PendaftaranEvent } from '@/generated/client'

export async function registerEventAction(formData: FormData): Promise<ActionResult<PendaftaranEvent>> {
  const parsed = pendaftaranEventSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  try {
    const repo = new PrismaKontenDakwahRepository()
    const result = await registerEvent(repo, parsed.data)
    revalidatePath('/dashboard/dakwah/event', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[registerEventAction]', error)
    if (error instanceof KontenError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mendaftar event' }
  }
}