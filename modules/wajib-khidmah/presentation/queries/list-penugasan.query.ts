import { prisma } from '@/lib/prisma'
export async function listPenugasan(filter?: { status?: string; guruBantuId?: string; lembagaId?: string }) {
  const where: Record<string, unknown> = { deletedAt: null }
  if (filter?.status) where.status = filter.status
  if (filter?.guruBantuId) where.guruBantuId = filter.guruBantuId
  if (filter?.lembagaId) where.lembagaId = filter.lembagaId
  return prisma.penugasan.findMany({ where, orderBy: { createdAt: 'desc' }, include: { guruBantu: { include: { user: true } }, lembaga: true } })
}