// modules/dakwah-digital/presentation/actions/upload-konten.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createKontenSchema } from '@/modules/dakwah-digital/domain/konten-dakwah.schema'
import { uploadKonten, KontenError } from '@/modules/dakwah-digital/application/konten-dakwah'
import { PrismaKontenDakwahRepository } from '@/modules/dakwah-digital/infrastructure/prisma-konten-dakwah.repository'
import type { ActionResult } from '@/types/api'
import type { KontenDakwah } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'CONTENT_MANAGER', 'PW', 'PC']

export async function uploadKontenAction(formData: FormData): Promise<ActionResult<KontenDakwah>> {
  const parsed = createKontenSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  const isPusat = session.user.role === 'OWNER' || session.user.role === 'CONTENT_MANAGER'

  try {
    const repo = new PrismaKontenDakwahRepository()
    const result = await uploadKonten(repo, parsed.data, session.user.id, isPusat)
    revalidatePath('/dashboard/dakwah/konten', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[uploadKontenAction]', error)
    if (error instanceof KontenError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mengupload konten' }
  }
}