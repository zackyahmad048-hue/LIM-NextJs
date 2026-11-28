// modules/daerah-binaan/presentation/actions/create-laporan-bulanan.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { createLaporanBulananSchema } from '@/modules/daerah-binaan/domain/daerah-binaan.schema'
import { createLaporanBulananRecord } from '@/modules/daerah-binaan/application/daerah-binaan-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { LaporanBulananBinaan } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createLaporanBulananAction(formData: FormData): Promise<ActionResult<LaporanBulananBinaan>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanBulananSchema.safeParse({
    ...raw,
    bulan: raw.bulan ? Number(raw.bulan) : raw.bulan,
    tahun: raw.tahun ? Number(raw.tahun) : raw.tahun,
    jumlahPesertaEstimasi: raw.jumlahPesertaEstimasi ? Number(raw.jumlahPesertaEstimasi) : undefined,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  return runWithSessionTenant(session, async () => {
    try {
      const result = await createLaporanBulananRecord(parsed.data, {
        userId: session.user.id,
        role: session.user.role,
        accountType: session.user.accountType,
        organisasiId: null,
        lembagaId: null,
      })
      revalidatePath('/dashboard/daerah-binaan/laporan', 'page')
      return { success: true, data: result }
    } catch (error) {
      console.error('[createLaporanBulananAction]', error)
      if (error instanceof ApiError) return { success: false, error: error.message }
      return { success: false, error: 'Gagal mengirim laporan bulanan' }
    }

  })
}
