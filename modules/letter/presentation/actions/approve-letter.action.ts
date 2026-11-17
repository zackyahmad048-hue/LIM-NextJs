// modules/letter/presentation/actions/approve-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { ActionResult } from '@/types/api'
import type { Letter } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const schema = z.object({ letterId: z.string().trim().min(1) })
const ALLOWED: Role[] = ['OWNER', 'ADMIN_SEKRETARIAT']

export async function approveLetterAction(formData: FormData): Promise<ActionResult<Letter>> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const letter = await prisma.letter.findUnique({ where: { id: parsed.data.letterId } })
    if (!letter) return { success: false, error: 'Surat tidak ditemukan' }
    if (letter.status !== 'REVIEW') return { success: false, error: `Status ${letter.status} tidak dapat disetujui` }

    const updated = await prisma.$transaction(async (tx) => {
      const l = await tx.letter.update({
        where: { id: parsed.data.letterId },
        data: { status: 'APPROVED', approvedById: session.user.id },
      })
      await tx.letterLog.create({
        data: { letterId: l.id, action: 'APPROVED', userId: session.user.id },
      })
      return l
    })
    revalidatePath('/dashboard/letters', 'page')
    return { success: true, data: updated }
  } catch (error) {
    console.error('[approveLetterAction]', error)
    return { success: false, error: 'Gagal menyetujui surat' }
  }
}