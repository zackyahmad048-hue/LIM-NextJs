// src/modules/letter/presentation/actions/send-letter.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { Prisma, Role } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { letterNumberingSchema } from '@/modules/letter/domain/letter-numbering.schema'
import { generateLetterNumber } from '@/modules/letter/domain/letter-numbering.rules'
import type { ActionResult } from '@/types/api'
import type { Letter } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const sendLetterSchema = z.object({
  letterId: z.string().trim().min(1, 'ID surat wajib diisi'),
})

// Hanya pusat yang boleh mengirim (generate nomor) surat.
const ALLOWED_ROLES: Role[] = ['OWNER', 'ADMIN_SEKRETARIAT']

// Status yang boleh ditransisikan ke SENT.
const SENDABLE_STATUSES = ['DIKETIK', 'REVIEW', 'APPROVED'] as const

export async function sendLetterAction(
  formData: FormData
): Promise<ActionResult<Letter>> {
  const rawData = Object.fromEntries(formData)
  const parsedForm = sendLetterSchema.safeParse(rawData)

  if (!parsedForm.success) {
    return { success: false, errors: parsedForm.error.flatten().fieldErrors }
  }

  const session = (await getSession()) as LIMSession | null

  if (!session) {
    return { success: false, error: 'Unauthorized: Silakan login terlebih dahulu' }
  }

  if (!ALLOWED_ROLES.includes(session.user.role)) {
    return { success: false, error: 'Forbidden: Anda tidak memiliki izin untuk mengirim surat' }
  }

  const { letterId } = parsedForm.data

  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

  try {
    const letter = await prisma.letter.findUnique({
      where: { id: letterId },
    })

    if (!letter) {
      return { success: false, error: 'Surat tidak ditemukan' }
    }

    if (letter.status === 'SENT') {
      return { success: false, error: 'Surat sudah pernah dikirim' }
    }

    if (letter.status === 'ARCHIVED') {
      return { success: false, error: 'Surat yang diarsipkan tidak dapat dikirim' }
    }

    if (!SENDABLE_STATUSES.includes(letter.status as (typeof SENDABLE_STATUSES)[number])) {
      return { success: false, error: `Status surat (${letter.status}) tidak dapat dikirim` }
    }

    // Resolve periode: pakai periodId surat bila ada, else periode aktif.
    let periodId = letter.periodId
    if (!periodId) {
      const activePeriod = await prisma.letterPeriod.findFirst({
        where: { isActive: true },
        select: { id: true },
      })
      if (!activePeriod) {
        return { success: false, error: 'Tidak ada periode surat aktif. Hubungi administrator.' }
      }
      periodId = activePeriod.id
    }

    // Level surat: pengirim surat adalah akun pusat, level = PP.
    // (PW/PC tidak boleh mengirim/generate nomor surat per RBAC matrix.)
    const levelCode = 'PP'

    // shortcut: category code hardcoded ke 'H' sampai model Letter memiliki field kategori surat.
    const categoryCode = 'H'

    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const result = await prisma.$transaction(async (tx) => {
      // Upsert counter agar tidak bergantung seed data (create jika belum ada).
      const counter = await tx.letterNumberCounter.upsert({
        where: {
          periodId_levelCode_categoryCode: {
            periodId,
            levelCode,
            categoryCode,
          },
        },
        create: {
          periodId,
          levelCode,
          categoryCode,
          currentSeq: 1,
        },
        update: {
          currentSeq: { increment: 1 },
        },
      })

      const finalNumberingInput = letterNumberingSchema.parse({
        seq: counter.currentSeq,
        level: levelCode,
        category: categoryCode,
        month,
        year,
        sequenceDigits: 3,
      })
      const nomorSurat = generateLetterNumber(finalNumberingInput)

      const updatedLetter = await tx.letter.update({
        where: { id: letterId },
        data: {
          status: 'SENT',
          nomorSurat,
          periodId,
        },
      })

      await tx.letterLog.create({
        data: {
          letterId: updatedLetter.id,
          action: 'SENT',
          userId: session.user.id,
          notes: `Nomor surat: ${nomorSurat}`,
        },
      })

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'LETTER_SENT',
          entity: 'Letter',
          entityId: updatedLetter.id,
          metadata: JSON.stringify({ nomorSurat, levelCode, categoryCode, periodId }),
          ipAddress,
        },
      })

      return updatedLetter
    }, {
      isolationLevel: 'Serializable',
      maxWait: 5000,
      timeout: 10000,
    })

    revalidatePath('/dashboard/letters', 'page')
    revalidatePath(`/dashboard/letters/${letterId}`, 'page')

    return { success: true, data: result }
  } catch (error) {
    console.error('[sendLetterAction] Error:', error)

    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Nomor surat duplikat. Silakan coba lagi.' }
      }
      if (error.code === 'P2025') {
        return { success: false, error: 'Data referensi tidak ditemukan. Silakan muat ulang halaman.' }
      }
    }

    return { success: false, error: 'Gagal mengirim surat. Silakan coba lagi atau hubungi administrator.' }
  }
}