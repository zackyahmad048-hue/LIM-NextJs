import { prisma } from '@/lib/prisma'
export async function listKonten(filter?: { status?: string; jenisKonten?: string }) {
  const where: Record<string, unknown> = {}
  if (filter?.status) where.status = filter.status
  if (filter?.jenisKonten) where.jenisKonten = filter.jenisKonten
  return prisma.kontenDakwah.findMany({ where, orderBy: { createdAt: 'desc' } })
}
export async function listPendaftaranEvent(kontenId?: string) {
  const where = kontenId ? { kontenId } : {}
  return prisma.pendaftaranEvent.findMany({ where, orderBy: { createdAt: 'desc' } })
}