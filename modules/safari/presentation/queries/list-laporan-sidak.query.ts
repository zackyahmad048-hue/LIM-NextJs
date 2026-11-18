import { prisma } from '@/lib/prisma'

export async function listAllLaporanSidak() {
  return prisma.laporanSidak.findMany({ orderBy: { tanggalSidak: 'desc' }, take: 100 })
}
