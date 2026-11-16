import { prisma } from '@/lib/prisma'
export async function listDelegasi(filter?: { titikId?: string; status?: string }) {
  const where: Record<string, unknown> = {}
  if (filter?.titikId) where.titikId = filter.titikId
  if (filter?.status) where.status = filter.status
  return prisma.delegasiSafari.findMany({ where, orderBy: { createdAt: 'desc' } })
}
export async function listJurnalByDelegasi(delegasiId: string) {
  return prisma.jurnalHarianSafari.findMany({ where: { delegasiId }, orderBy: { tanggal: 'desc' } })
}
export async function listApprovalByDelegasi(delegasiId: string) {
  return prisma.approvalJurnal.findMany({ where: { delegasiId }, orderBy: { createdAt: 'desc' } })
}