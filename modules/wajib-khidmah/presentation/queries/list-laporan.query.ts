// modules/wajib-khidmah/presentation/queries/list-laporan.query.ts
import { prisma } from '@/lib/prisma'

export async function listLaporanByPenugasan(penugasanId: string, periodeMinggu?: number, periodeTahun?: number) {
  const where: Record<string, unknown> = { penugasanId }
  if (periodeMinggu !== undefined) where.periodeMinggu = periodeMinggu
  if (periodeTahun !== undefined) where.periodeTahun = periodeTahun
  return prisma.laporanMingguan.findMany({ where, orderBy: { createdAt: 'desc' } })
}