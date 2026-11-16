// modules/safari/presentation/actions/create-delegasi.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createDelegasiSchema } from '@/modules/safari/domain/delegasi-safari.schema'
import { createDelegasi, DelegasiError } from '@/modules/safari/application/delegasi-safari'
import { PrismaDelegasiRepository } from '@/modules/safari/infrastructure/prisma-delegasi.repository'
import type { ActionResult } from '@/types/api'
import type { DelegasiSafari } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC']

export async function createDelegasiAction(formData: FormData): Promise<ActionResult<DelegasiSafari>> {
  const parsed = createDelegasiSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaDelegasiRepository()
    const result = await createDelegasi(repo, parsed.data)
    revalidatePath('/dashboard/safari/delegasi', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createDelegasiAction]', error)
    if (error instanceof DelegasiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat delegasi' }
  }
}