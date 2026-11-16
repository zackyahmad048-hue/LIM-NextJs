// modules/pesantren-ramadan/presentation/actions/create-umpan-balik-pusat.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createUmpanBalikPusatSchema } from '@/modules/pesantren-ramadan/domain/umpan-balik.schema'
import { createUmpanBalikPusat } from '@/modules/pesantren-ramadan/application/umpan-balik'
import { PrismaUmpanBalikRepository } from '@/modules/pesantren-ramadan/infrastructure/prisma-umpan-balik.repository'
import type { ActionResult } from '@/types/api'
import type { UmpanBalikPusat } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN']

export async function createUmpanBalikPusatAction(formData: FormData): Promise<ActionResult<UmpanBalikPusat>> {
  const parsed = createUmpanBalikPusatSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaUmpanBalikRepository()
    const result = await createUmpanBalikPusat(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/pesantren/umpan-balik', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createUmpanBalikPusatAction]', error)
    return { success: false, error: 'Gagal menyimpan umpan balik pusat' }
  }
}