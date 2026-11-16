// modules/wajib-khidmah/presentation/actions/create-evaluasi-kasus.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createEvaluasiKasusSchema } from '@/modules/wajib-khidmah/domain/evaluasi.schema'
import { createEvaluasiKasus } from '@/modules/wajib-khidmah/application/evaluasi-kasus'
import { PrismaEvaluasiRepository } from '@/modules/wajib-khidmah/infrastructure/prisma-evaluasi.repository'
import type { ActionResult } from '@/types/api'
import type { EvaluasiKasus } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'TIM_WAJIB_KHIDMAH']

export async function createEvaluasiKasusAction(formData: FormData): Promise<ActionResult<EvaluasiKasus>> {
  const parsed = createEvaluasiKasusSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaEvaluasiRepository()
    const result = await createEvaluasiKasus(repo, parsed.data)
    revalidatePath('/dashboard/wajib-khidmah/evaluasi', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createEvaluasiKasusAction]', error)
    return { success: false, error: 'Gagal membuat evaluasi kasus' }
  }
}