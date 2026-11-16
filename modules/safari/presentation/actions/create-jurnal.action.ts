// modules/safari/presentation/actions/create-jurnal.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createJurnalSchema } from '@/modules/safari/domain/delegasi-safari.schema'
import { createJurnal, DelegasiError } from '@/modules/safari/application/delegasi-safari'
import { PrismaDelegasiRepository } from '@/modules/safari/infrastructure/prisma-delegasi.repository'
import type { ActionResult } from '@/types/api'
import type { JurnalHarianSafari } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createJurnalAction(formData: FormData): Promise<ActionResult<JurnalHarianSafari>> {
  const raw = Object.fromEntries(formData)
  const parsed = createJurnalSchema.safeParse({
    ...raw,
    jumlahJamaah: raw.jumlahJamaah ? Number(raw.jumlahJamaah) : undefined,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (session.user.role !== 'DELEGASI_SAFARI_DAERAH') return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaDelegasiRepository()
    const result = await createJurnal(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/safari/jurnal', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createJurnalAction]', error)
    if (error instanceof DelegasiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mengirim jurnal' }
  }
}