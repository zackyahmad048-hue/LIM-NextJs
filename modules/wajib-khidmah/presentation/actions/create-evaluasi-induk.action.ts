// modules/wajib-khidmah/presentation/actions/create-evaluasi-induk.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createEvaluasiIndukSchema } from '@/modules/wajib-khidmah/domain/evaluasi-induk.schema'
import { createEvaluasiInduk } from '@/modules/wajib-khidmah/application/evaluasi-induk'
import { PrismaEvaluasiIndukRepository } from '@/modules/wajib-khidmah/infrastructure/prisma-evaluasi-induk.repository'
import type { ActionResult } from '@/types/api'
import type { EvaluasiInduk } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'TIM_WAJIB_KHIDMAH']

export async function createEvaluasiIndukAction(formData: FormData): Promise<ActionResult<EvaluasiInduk>> {
  const parsed = createEvaluasiIndukSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaEvaluasiIndukRepository()
    const result = await createEvaluasiInduk(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/wajib-khidmah/evaluasi', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createEvaluasiIndukAction]', error)
    return { success: false, error: 'Gagal membuat evaluasi induk' }
  }
}