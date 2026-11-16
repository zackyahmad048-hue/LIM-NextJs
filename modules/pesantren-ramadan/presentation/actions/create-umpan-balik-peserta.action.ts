// modules/pesantren-ramadan/presentation/actions/create-umpan-balik-peserta.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createUmpanBalikPesertaSchema } from '@/modules/pesantren-ramadan/domain/umpan-balik.schema'
import { createUmpanBalikPeserta } from '@/modules/pesantren-ramadan/application/umpan-balik'
import { PrismaUmpanBalikRepository } from '@/modules/pesantren-ramadan/infrastructure/prisma-umpan-balik.repository'
import type { ActionResult } from '@/types/api'
import type { UmpanBalikPeserta } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC']

export async function createUmpanBalikPesertaAction(formData: FormData): Promise<ActionResult<UmpanBalikPeserta>> {
  const raw = Object.fromEntries(formData)
  const parsed = createUmpanBalikPesertaSchema.safeParse({
    ...raw,
    jumlahResponden: raw.jumlahResponden ? Number(raw.jumlahResponden) : raw.jumlahResponden,
    ratingKepuasan: raw.ratingKepuasan ? Number(raw.ratingKepuasan) : raw.ratingKepuasan,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaUmpanBalikRepository()
    const result = await createUmpanBalikPeserta(repo, parsed.data)
    revalidatePath('/dashboard/pesantren/umpan-balik', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createUmpanBalikPesertaAction]', error)
    return { success: false, error: 'Gagal menyimpan umpan balik peserta' }
  }
}