import { prisma } from '@/lib/prisma'
export async function listLaporanHarianPengajar(penugasanId?: string) {
  const where = penugasanId ? { penugasanId } : {}
  return prisma.laporanHarianPengajar.findMany({ where, orderBy: { tanggal: 'desc' } })
}
export async function listLaporanHarianKoordinator(penugasanId?: string) {
  const where = penugasanId ? { penugasanId } : {}
  return prisma.laporanHarianKoordinator.findMany({ where, orderBy: { tanggal: 'desc' } })
}
export async function listUmpanBalikPusat(penugasanId?: string) {
  const where = penugasanId ? { penugasanId } : {}
  return prisma.umpanBalikPusat.findMany({ where, orderBy: { createdAt: 'desc' } })
}
export async function listUmpanBalikPeserta(penugasanId?: string) {
  const where = penugasanId ? { penugasanId } : {}
  return prisma.umpanBalikPeserta.findMany({ where, orderBy: { createdAt: 'desc' } })
}