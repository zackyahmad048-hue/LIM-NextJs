// modules/pesantren-ramadan/presentation/actions/create-bank-materi.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createBankMateriSchema } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.schema'
import { createBankMateri } from '@/modules/pesantren-ramadan/application/sekolah-mitra'
import { PrismaSekolahMitraRepository } from '@/modules/pesantren-ramadan/infrastructure/prisma-sekolah-mitra.repository'
import type { ActionResult } from '@/types/api'
import type { BankMateri } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN']

export async function createBankMateriAction(formData: FormData): Promise<ActionResult<BankMateri>> {
  const raw = Object.fromEntries(formData)
  const parsed = createBankMateriSchema.safeParse({
    ...raw,
    durasiMenit: raw.durasiMenit ? Number(raw.durasiMenit) : raw.durasiMenit,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaSekolahMitraRepository()
    const result = await createBankMateri(repo, parsed.data)
    revalidatePath('/dashboard/pesantren/bank-materi', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createBankMateriAction]', error)
    return { success: false, error: 'Gagal membuat bank materi' }
  }
}