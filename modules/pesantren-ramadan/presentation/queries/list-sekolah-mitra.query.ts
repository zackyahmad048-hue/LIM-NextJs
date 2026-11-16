// modules/pesantren-ramadan/presentation/queries/list-sekolah-mitra.query.ts
import { prisma } from '@/lib/prisma'
import type { JenjangSekolah } from '@/generated/client'

export async function listSekolahMitra() {
  return prisma.sekolahMitra.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function listBankMateri(targetJenjang?: string) {
  const where = targetJenjang ? { targetJenjang: targetJenjang as JenjangSekolah } : {}
  return prisma.bankMateri.findMany({ where, orderBy: { createdAt: 'desc' } })
}