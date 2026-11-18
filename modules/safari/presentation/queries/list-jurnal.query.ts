import { prisma } from '@/lib/prisma'

export async function listAllJurnal() {
  return prisma.jurnalHarianSafari.findMany({ orderBy: { tanggal: 'desc' }, take: 100 })
}

export async function listAllApproval() {
  return prisma.approvalJurnal.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
}
