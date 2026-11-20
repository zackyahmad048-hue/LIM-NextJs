import { Prisma } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'

export async function listAuditLogs(input: { page: number; limit: number; entity?: string; action?: string; userId?: string }, actor: AuthzSubject) {
  if (actor.role !== 'OWNER' && actor.role !== 'ADMIN_SEKRETARIAT') {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk melihat audit log', 403)
  }
  const where: Prisma.AuditLogWhereInput = {}
  if (input.entity) where.entity = input.entity
  if (input.action) where.action = input.action
  if (input.userId) where.userId = input.userId
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.auditLog.count({ where }),
  ])
  return { items, total }
}
