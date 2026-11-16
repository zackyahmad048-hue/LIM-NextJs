// modules/letter/presentation/actions/delete-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import type { ActionResult } from '@/types/api'
import type { LIMSession } from '@/types/auth'

const schema = z.object({ letterId: z.string().trim().min(1) })
const ALLOWED: Role[] = ['OWNER', 'ADMIN_SEKRETARIAT']

export async function deleteLetterAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const letter = await prisma.letter.findFirst({ where: { id: parsed.data.letterId, deletedAt: null } })
    if (!letter) return { success: false, error: 'Surat tidak ditemukan' }

    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

    await prisma.$transaction(async (tx) => {
      await tx.letter.update({ where: { id: parsed.data.letterId }, data: { deletedAt: new Date(), updatedById: session.user.id } })
      await tx.auditLog.create({
        data: { userId: session.user.id, action: 'LETTER_DELETED', entity: 'Letter', entityId: parsed.data.letterId, ipAddress },
      })
    })
    revalidatePath('/dashboard/secretariat/letters', 'page')
    return { success: true, data: { id: parsed.data.letterId } }
  } catch (error) {
    console.error('[deleteLetterAction]', error)
    return { success: false, error: 'Gagal menghapus surat' }
  }
}