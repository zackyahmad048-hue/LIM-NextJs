// modules/daerah-binaan/presentation/actions/create-daerah-binaan.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createDaerahBinaanSchema } from '@/modules/daerah-binaan/domain/daerah-binaan.schema'
import { createDaerahBinaan } from '@/modules/daerah-binaan/application/daerah-binaan'
import { PrismaDaerahBinaanRepository } from '@/modules/daerah-binaan/infrastructure/prisma-daerah-binaan.repository'
import type { ActionResult } from '@/types/api'
import type { DaerahBinaan } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'PW', 'PC']

export async function createDaerahBinaanAction(formData: FormData): Promise<ActionResult<DaerahBinaan>> {
  const parsed = createDaerahBinaanSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  // ROW-LEVEL SCOPING untuk PW/PC
  if (session.user.role === 'PW' || session.user.role === 'PC') {
    const orgAccount = await (await import('@/lib/prisma')).prisma.organizationalAccount.findUnique({
      where: { userId: session.user.id },
      include: { unit: true },
    })
    const unitWilayah = orgAccount?.unit?.wilayah
    if (!unitWilayah) return { success: false, error: 'Forbidden: Akun organisasi tidak terhubung ke unit' }
    const inWilayah = session.user.role === 'PW'
      ? parsed.data.provinsi === unitWilayah
      : parsed.data.kabupaten === unitWilayah
    if (!inWilayah) return { success: false, error: 'Forbidden: Di luar wilayah Anda' }
  }

  try {
    const repo = new PrismaDaerahBinaanRepository()
    const result = await createDaerahBinaan(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/daerah-binaan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createDaerahBinaanAction]', error)
    return { success: false, error: 'Gagal membuat daerah binaan' }
  }
}