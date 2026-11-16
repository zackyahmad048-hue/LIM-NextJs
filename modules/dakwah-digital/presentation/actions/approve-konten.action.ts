// modules/dakwah-digital/presentation/actions/approve-konten.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { approveKonten, publishKonten, KontenError } from '@/modules/dakwah-digital/application/konten-dakwah'
import { PrismaKontenDakwahRepository } from '@/modules/dakwah-digital/infrastructure/prisma-konten-dakwah.repository'
import type { ActionResult } from '@/types/api'
import type { KontenDakwah } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'CONTENT_MANAGER']

export async function approveKontenAction(formData: FormData): Promise<ActionResult<KontenDakwah>> {
  const parsed = z.object({ kontenId: z.string().trim().min(1) }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaKontenDakwahRepository()
    const result = await approveKonten(repo, parsed.data.kontenId, session.user.id)
    revalidatePath('/dashboard/dakwah/konten', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[approveKontenAction]', error)
    if (error instanceof KontenError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal menyetujui konten' }
  }
}

export async function publishKontenAction(formData: FormData): Promise<ActionResult<KontenDakwah>> {
  const parsed = z.object({ kontenId: z.string().trim().min(1) }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaKontenDakwahRepository()
    const result = await publishKonten(repo, parsed.data.kontenId)
    revalidatePath('/dashboard/dakwah/konten', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[publishKontenAction]', error)
    if (error instanceof KontenError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mempublikasikan konten' }
  }
}