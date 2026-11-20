import { Prisma, type Letter, type LetterLog, type LetterStatus, type Role } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { letterNumberingSchema } from '@/modules/letter/domain/letter-numbering.schema'
import { generateLetterNumber } from '@/modules/letter/domain/letter-numbering.rules'
import { getLetterActionsForRole } from '@/modules/authorization/domain/matrix'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { ApiError } from '@/lib/api/errors'

export type LetterActor = AuthzSubject & { ipAddress?: string }

function scopeWhere(subject: AuthzSubject): Prisma.LetterWhereInput {
  if (subject.role === 'OWNER' || subject.role === 'ADMIN_SEKRETARIAT' || subject.role === 'ADMIN_BIDANG_SAFARI' || subject.role === 'ADMIN_BIDANG_PESANTREN_RAMADAN') {
    return {}
  }
  // shortcut: Letter has no organizationId; PW/PC scoped to own created letters until schema supports org scope.
  if (subject.role === 'PW' || subject.role === 'PC') {
    return { createdById: subject.userId }
  }
  return { createdById: subject.userId }
}

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'review' | 'approve' | 'send') {
  const allowed = getLetterActionsForRole(subject.role)
  if (!allowed.includes(action)) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
  }
}

export async function listLetters(input: {
  page: number
  limit: number
  status?: LetterStatus
  type?: 'MASUK' | 'KELUAR'
  q?: string
}, actor: LetterActor): Promise<{ items: Letter[]; total: number }> {
  assertCan(actor, 'read')
  const where: Prisma.LetterWhereInput = { deletedAt: null, ...scopeWhere(actor) }
  if (input.status) where.status = input.status
  if (input.type) where.type = input.type
  if (input.q) {
    where.OR = [
      { perihal: { contains: input.q, mode: 'insensitive' } },
      { nomorSurat: { contains: input.q, mode: 'insensitive' } },
    ]
  }
  const [items, total] = await Promise.all([
    prisma.letter.findMany({
      where,
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.letter.count({ where }),
  ])
  return { items, total }
}

export async function getLetterById(id: string, actor: LetterActor): Promise<Letter> {
  assertCan(actor, 'read')
  const letter = await prisma.letter.findFirst({ where: { id, deletedAt: null, ...scopeWhere(actor) } })
  if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)
  return letter
}

export async function createLetterRecord(input: {
  type: 'MASUK' | 'KELUAR'
  pengirim: string
  penerima?: string | null
  perihal: string
  isiSurat: string
}, actor: LetterActor): Promise<Letter> {
  assertCan(actor, 'create')
  return prisma.letter.create({
    data: {
      type: input.type,
      pengirim: input.pengirim,
      penerima: input.penerima ?? null,
      perihal: input.perihal,
      isiSurat: input.isiSurat,
      status: 'DIKETIK',
      createdById: actor.userId,
    },
  })
}

export async function updateLetterRecord(id: string, input: {
  pengirim?: string
  penerima?: string | null
  perihal?: string
  isiSurat?: string
  fileUrl?: string | null
}, actor: LetterActor): Promise<Letter> {
  assertCan(actor, 'update')
  const existing = await prisma.letter.findFirst({ where: { id, deletedAt: null, ...scopeWhere(actor) } })
  if (!existing) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)
  if (existing.status !== 'DIKETIK') {
    throw new ApiError('CONFLICT', 'Hanya surat berstatus DIKETIK yang dapat diubah', 409)
  }
  return prisma.letter.update({
    where: { id },
    data: { ...input, updatedById: actor.userId },
  })
}

export async function submitLetterForReview(id: string, actor: LetterActor): Promise<Letter> {
  const submitRoles: Role[] = ['OWNER', 'ADMIN_SEKRETARIAT', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN']
  if (!submitRoles.includes(actor.role)) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk mengirim surat ke review', 403)
  }
  const letter = await prisma.letter.findFirst({ where: { id, deletedAt: null, ...scopeWhere(actor) } })
  if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)
  if (letter.status !== 'DIKETIK') throw new ApiError('CONFLICT', `Status ${letter.status} tidak dapat dikirim ke review`, 409)

  return prisma.$transaction(async (tx) => {
    const updated = await tx.letter.update({
      where: { id },
      data: { status: 'REVIEW', reviewedById: actor.userId, updatedById: actor.userId },
    })
    await tx.letterLog.create({ data: { letterId: id, action: 'REVIEW', userId: actor.userId } })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'LETTER_SUBMITTED_REVIEW',
        entity: 'Letter',
        entityId: id,
        ipAddress: actor.ipAddress,
      },
    })
    return updated
  })
}

export async function approveLetterRecord(id: string, actor: LetterActor): Promise<Letter> {
  assertCan(actor, 'approve')
  const letter = await prisma.letter.findFirst({ where: { id, deletedAt: null, ...scopeWhere(actor) } })
  if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)
  if (letter.status !== 'REVIEW') throw new ApiError('CONFLICT', `Status ${letter.status} tidak dapat disetujui`, 409)

  return prisma.$transaction(async (tx) => {
    const updated = await tx.letter.update({
      where: { id },
      data: { status: 'APPROVED', approvedById: actor.userId, updatedById: actor.userId },
    })
    await tx.letterLog.create({ data: { letterId: id, action: 'APPROVED', userId: actor.userId } })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'LETTER_APPROVED',
        entity: 'Letter',
        entityId: id,
        ipAddress: actor.ipAddress,
      },
    })
    return updated
  })
}

const SENDABLE_STATUSES: LetterStatus[] = ['DIKETIK', 'REVIEW', 'APPROVED']

export async function sendLetterRecord(id: string, actor: LetterActor): Promise<Letter> {
  assertCan(actor, 'send')
  const letter = await prisma.letter.findFirst({ where: { id, deletedAt: null, ...scopeWhere(actor) } })
  if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)
  if (letter.status === 'SENT') throw new ApiError('CONFLICT', 'Surat sudah pernah dikirim', 409)
  if (letter.status === 'ARCHIVED') throw new ApiError('CONFLICT', 'Surat yang diarsipkan tidak dapat dikirim', 409)
  if (!SENDABLE_STATUSES.includes(letter.status)) {
    throw new ApiError('CONFLICT', `Status surat (${letter.status}) tidak dapat dikirim`, 409)
  }

  let periodId = letter.periodId
  if (!periodId) {
    const activePeriod = await prisma.letterPeriod.findFirst({ where: { isActive: true }, select: { id: true } })
    if (!activePeriod) throw new ApiError('CONFLICT', 'Tidak ada periode surat aktif', 409)
    periodId = activePeriod.id
  }

  const levelCode = 'PP'
  // shortcut: category code hardcoded ke 'H' sampai model Letter memiliki field kategori surat.
  const categoryCode = 'H'
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()

  return prisma.$transaction(async (tx) => {
    const counter = await tx.letterNumberCounter.upsert({
      where: { periodId_levelCode_categoryCode: { periodId, levelCode, categoryCode } },
      create: { periodId, levelCode, categoryCode, currentSeq: 1 },
      update: { currentSeq: { increment: 1 } },
    })

    const numbering = letterNumberingSchema.parse({
      seq: counter.currentSeq,
      level: levelCode,
      category: categoryCode,
      month,
      year,
      sequenceDigits: 3,
    })
    const nomorSurat = generateLetterNumber(numbering)

    const updated = await tx.letter.update({
      where: { id },
      data: { status: 'SENT', nomorSurat, periodId, updatedById: actor.userId },
    })
    await tx.letterLog.create({
      data: { letterId: id, action: 'SENT', userId: actor.userId, notes: `Nomor surat: ${nomorSurat}` },
    })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'LETTER_SENT',
        entity: 'Letter',
        entityId: id,
        metadata: JSON.stringify({ nomorSurat, levelCode, categoryCode, periodId }),
        ipAddress: actor.ipAddress,
      },
    })
    return updated
  }, { isolationLevel: 'Serializable', maxWait: 5000, timeout: 10000 })
}

export async function deleteLetterRecord(id: string, actor: LetterActor): Promise<{ id: string }> {
  assertCan(actor, 'delete')
  const letter = await prisma.letter.findFirst({ where: { id, deletedAt: null, ...scopeWhere(actor) } })
  if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)

  await prisma.$transaction(async (tx) => {
    await tx.letter.update({ where: { id }, data: { deletedAt: new Date(), updatedById: actor.userId } })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'LETTER_DELETED',
        entity: 'Letter',
        entityId: id,
        ipAddress: actor.ipAddress,
      },
    })
  })
  return { id }
}

export async function listLetterLogs(letterId: string, actor: LetterActor): Promise<LetterLog[]> {
  assertCan(actor, 'read')
  const letter = await prisma.letter.findFirst({ where: { id: letterId, deletedAt: null, ...scopeWhere(actor) } })
  if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan', 404)
  return prisma.letterLog.findMany({ where: { letterId }, orderBy: { timestamp: 'asc' } })
}

export async function getPublicVerification(slug: string) {
  return prisma.letter.findFirst({
    where: { verificationSlug: slug, deletedAt: null },
    select: {
      id: true,
      nomorSurat: true,
      perihal: true,
      pengirim: true,
      tanggalSurat: true,
      status: true,
    },
  })
}
