import { prisma } from '@/lib/prisma'
export async function listDaerahBinaan(filter?: { status?: string }) {
  const where: Record<string, unknown> = {}
  if (filter?.status) where.status = filter.status
  return prisma.daerahBinaan.findMany({ where, orderBy: { createdAt: 'desc' } })
}
export async function listLaporanBulananBinaan(daerahBinaanId?: string) {
  const where = daerahBinaanId ? { daerahBinaanId } : {}
  return prisma.laporanBulananBinaan.findMany({ where, orderBy: { createdAt: 'desc' } })
}