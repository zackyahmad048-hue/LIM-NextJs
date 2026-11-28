import { Prisma, type StatusKonten } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { getDakwahActionsForRole } from '@/modules/authorization/domain/matrix'

export type DakwahActor = AuthzSubject & { ipAddress?: string }

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'approve') {
  const allowed = getDakwahActionsForRole(subject.role)
  if (!allowed.includes(action)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
}

export async function listKonten(input: { page: number; limit: number; status?: StatusKonten; jenisKonten?: string }, actor: DakwahActor) {
  assertCan(actor, 'read')
  const where: Prisma.KontenDakwahWhereInput = {}
  if (input.status) where.status = input.status
  if (input.jenisKonten) where.jenisKonten = input.jenisKonten as never
  // PW/PC see own uploads? shortcut: not enforced without uploader org scope
  const [items, total] = await Promise.all([
    prisma.kontenDakwah.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.kontenDakwah.count({ where }),
  ])
  return { items, total }
}

export async function createKontenRecord(input: { judul: string; slug: string; deskripsi: string; jenisKonten: string; thumbnailUrl?: string; linkVideo?: string }, actor: DakwahActor) {
  assertCan(actor, 'create')
  const isPusat = actor.role === 'OWNER' || actor.role === 'CONTENT_MANAGER'
  return prisma.kontenDakwah.create({
    data: { ...input, jenisKonten: input.jenisKonten as never, pengunggahId: actor.userId, status: isPusat ? 'DRAFT' : 'PENDING_REVIEW', unitId: actor.organisasiId ?? undefined },
  })
}

export async function approveKontenRecord(id: string, actor: DakwahActor) {
  assertCan(actor, 'approve')
  const k = await prisma.kontenDakwah.findUnique({ where: { id } })
  if (!k) throw new ApiError('NOT_FOUND', 'Konten tidak ditemukan', 404)
  if (k.status !== 'PENDING_REVIEW') throw new ApiError('CONFLICT', `Status ${k.status} tidak dapat disetujui`, 409)
  return prisma.$transaction(async (tx) => {
    const updated = await tx.kontenDakwah.update({ where: { id }, data: { status: 'APPROVED', disetujuiOlehId: actor.userId } })
    await tx.auditLog.create({ data: { userId: actor.userId, action: 'DAKWAH_KONTEN_APPROVED', entity: 'KontenDakwah', entityId: id, ipAddress: actor.ipAddress } })
    return updated
  })
}

export async function publishKontenRecord(id: string, actor: DakwahActor) {
  assertCan(actor, 'approve')
  const k = await prisma.kontenDakwah.findUnique({ where: { id } })
  if (!k) throw new ApiError('NOT_FOUND', 'Konten tidak ditemukan', 404)
  if (k.status !== 'APPROVED') throw new ApiError('CONFLICT', `Status ${k.status} tidak dapat dipublikasikan`, 409)
  return prisma.$transaction(async (tx) => {
    const updated = await tx.kontenDakwah.update({ where: { id }, data: { status: 'PUBLISHED' } })
    await tx.auditLog.create({ data: { userId: actor.userId, action: 'DAKWAH_KONTEN_PUBLISHED', entity: 'KontenDakwah', entityId: id, ipAddress: actor.ipAddress } })
    return updated
  })
}

export async function registerEventRecord(input: { kontenId: string; namaPeserta: string; email: string; noHp: string; asalInstansi?: string }) {
  const k = await prisma.kontenDakwah.findUnique({ where: { id: input.kontenId } })
  if (!k) throw new ApiError('NOT_FOUND', 'Konten tidak ditemukan', 404)
  if (k.status !== 'PUBLISHED') throw new ApiError('CONFLICT', 'Event belum dipublikasikan', 409)
  return prisma.pendaftaranEvent.create({ data: input })
}
