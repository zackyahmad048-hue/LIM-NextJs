// modules/safari/presentation/actions/approve-jurnal.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { approveJurnalSchema } from '@/modules/safari/domain/approval-jurnal.schema'
import { approveJurnal, ApprovalError } from '@/modules/safari/application/approval-jurnal'
import { PrismaApprovalJurnalRepository } from '@/modules/safari/infrastructure/prisma-approval-jurnal.repository'
import type { ActionResult } from '@/types/api'
import type { ApprovalJurnal } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC', 'PANITIA_SAFARI_DAERAH']

export async function approveJurnalAction(formData: FormData): Promise<ActionResult<ApprovalJurnal>> {
  const raw = Object.fromEntries(formData)
  const parsed = approveJurnalSchema.safeParse({
    ...raw,
    isApproved: raw.isApproved === undefined ? true : raw.isApproved,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaApprovalJurnalRepository()
    const result = await approveJurnal(repo, parsed.data, {
      role: session.user.role,
      name: session.user.name || 'Pengguna',
    })
    revalidatePath('/dashboard/safari/jurnal', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[approveJurnalAction]', error)
    if (error instanceof ApprovalError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal memproses approval' }
  }
}