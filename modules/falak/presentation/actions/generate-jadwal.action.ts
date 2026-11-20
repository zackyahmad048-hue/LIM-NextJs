// modules/falak/presentation/actions/generate-jadwal.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { generateJadwalSchema } from '@/modules/falak/domain/falak.schema'
import { generateJadwalRecord } from '@/modules/falak/application/falak-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { JadwalShalat } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function generateJadwalAction(formData: FormData): Promise<ActionResult<JadwalShalat>> {
  const parsed = generateJadwalSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await generateJadwalRecord(parsed.data.tanggal, parsed.data.modeWaktu, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/falak/konfigurasi', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[generateJadwalAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal generate jadwal shalat' }
  }
}