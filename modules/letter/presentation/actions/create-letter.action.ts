// modules/letter/presentation/actions/create-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createLetterSchema } from '@/modules/letter/domain/letter.schema'
import { createLetter as createLetterUseCase } from '@/modules/letter/application/create-letter'
import { PrismaLetterRepository } from '@/modules/letter/infrastructure/prisma-letter.repository'
import type { ActionResult } from '@/types/api'
import type { Letter } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED_ROLES: Role[] = ['OWNER', 'ADMIN_SEKRETARIAT', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN']

export async function createLetterAction(
  formData: FormData
): Promise<ActionResult<Letter>> {
  const rawData = Object.fromEntries(formData)
  const parsed = createLetterSchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  if (!ALLOWED_ROLES.includes(session.user.role)) {
    return { success: false, error: 'Forbidden: Insufficient permissions' }
  }

  try {
    const repo = new PrismaLetterRepository()
    const result = await createLetterUseCase(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/secretariat/letters', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createLetterAction]', error)
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors }
    }
    return { success: false, error: 'Gagal membuat surat' }
  }
}