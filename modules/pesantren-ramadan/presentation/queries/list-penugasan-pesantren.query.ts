// modules/pesantren-ramadan/presentation/queries/list-penugasan-pesantren.query.ts
import { prisma } from '@/lib/prisma'

export async function listPenugasanPesantren(filter?: { sekolahId?: string; pengajarId?: string }) {
  const where: Record<string, unknown> = {}
  if (filter?.sekolahId) where.sekolahId = filter.sekolahId
  if (filter?.pengajarId) where.pengajarId = filter.pengajarId
  return prisma.penugasanPesantren.findMany({ where, orderBy: { createdAt: 'desc' } })
}