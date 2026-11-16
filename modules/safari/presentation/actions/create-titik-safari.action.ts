// modules/safari/presentation/actions/create-titik-safari.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createTitikSafariSchema } from '@/modules/safari/domain/titik-safari.schema'
import { createTitikSafari } from '@/modules/safari/application/titik-safari'
import { PrismaTitikSafariRepository } from '@/modules/safari/infrastructure/prisma-titik-safari.repository'
import type { ActionResult } from '@/types/api'
import type { TitikSafari } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC']

export async function createTitikSafariAction(formData: FormData): Promise<ActionResult<TitikSafari>> {
  const parsed = createTitikSafariSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaTitikSafariRepository()
    const result = await createTitikSafari(repo, parsed.data)
    revalidatePath('/dashboard/safari/titik', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createTitikSafariAction]', error)
    return { success: false, error: 'Gagal membuat titik safari' }
  }
}