// modules/pesantren-ramadan/presentation/actions/create-laporan-harian-pengajar.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createLaporanHarianPengajarSchema } from '@/modules/pesantren-ramadan/domain/laporan-harian-pengajar.schema'
import { createLaporanPengajarRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { LaporanHarianPengajar } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createLaporanHarianPengajarAction(formData: FormData): Promise<ActionResult<LaporanHarianPengajar>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanHarianPengajarSchema.safeParse({
    ...raw,
    jumlahSiswaL: raw.jumlahSiswaL ? Number(raw.jumlahSiswaL) : raw.jumlahSiswaL,
    jumlahSiswaP: raw.jumlahSiswaP ? Number(raw.jumlahSiswaP) : raw.jumlahSiswaP,
    praktikDilakukan: raw.praktikDilakukan === 'true' || raw.praktikDilakukan === 'on',
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createLaporanPengajarRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/pesantren/laporan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createLaporanHarianPengajarAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mengirim laporan harian' }
  }
}