import { prisma } from '@/lib/prisma'
export async function listJadwalShalat(from?: Date, to?: Date) {
  const where: { tanggal?: { gte?: Date; lte?: Date } } = {}
  if (from || to) {
    where.tanggal = {}
    if (from) where.tanggal.gte = from
    if (to) where.tanggal.lte = to
  }
  return prisma.jadwalShalat.findMany({ where, orderBy: { tanggal: 'asc' } })
}