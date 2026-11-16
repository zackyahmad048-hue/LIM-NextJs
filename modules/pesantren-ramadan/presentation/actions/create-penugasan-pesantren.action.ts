// modules/pesantren-ramadan/presentation/actions/create-penugasan-pesantren.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createPenugasanPesantrenSchema } from '@/modules/pesantren-ramadan/domain/penugasan-pesantren.schema'
import { createPenugasanPesantren } from '@/modules/pesantren-ramadan/application/penugasan-pesantren'
import { PrismaPenugasanPesantrenRepository } from '@/modules/pesantren-ramadan/infrastructure/prisma-penugasan-pesantren.repository'
import type { ActionResult } from '@/types/api'
import type { PenugasanPesantren } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC']

export async function createPenugasanPesantrenAction(formData: FormData): Promise<ActionResult<PenugasanPesantren>> {
  const parsed = createPenugasanPesantrenSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaPenugasanPesantrenRepository()
    const result = await createPenugasanPesantren(repo, parsed.data)
    revalidatePath('/dashboard/pesantren/penugasan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createPenugasanPesantrenAction]', error)
    return { success: false, error: 'Gagal membuat penugasan pesantren' }
  }
}