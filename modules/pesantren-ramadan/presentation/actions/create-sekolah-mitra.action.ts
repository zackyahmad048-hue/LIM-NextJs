// modules/pesantren-ramadan/presentation/actions/create-sekolah-mitra.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createSekolahMitraSchema } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.schema'
import { createSekolahMitra } from '@/modules/pesantren-ramadan/application/sekolah-mitra'
import { PrismaSekolahMitraRepository } from '@/modules/pesantren-ramadan/infrastructure/prisma-sekolah-mitra.repository'
import type { ActionResult } from '@/types/api'
import type { SekolahMitra } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC']

export async function createSekolahMitraAction(formData: FormData): Promise<ActionResult<SekolahMitra>> {
  const parsed = createSekolahMitraSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaSekolahMitraRepository()
    const result = await createSekolahMitra(repo, parsed.data)
    revalidatePath('/dashboard/pesantren/sekolah', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createSekolahMitraAction]', error)
    return { success: false, error: 'Gagal membuat sekolah mitra' }
  }
}