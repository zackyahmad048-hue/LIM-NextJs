// modules/pesantren-ramadan/infrastructure/prisma-sekolah-mitra.repository.ts
import { prisma } from '@/lib/prisma'
import type { JenjangSekolah } from '@/generated/client'
import type { SekolahMitraRepository, CreateSekolahMitraData, CreateBankMateriData } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.repository'

export class PrismaSekolahMitraRepository implements SekolahMitraRepository {
  async createSekolah(data: CreateSekolahMitraData) {
    return prisma.sekolahMitra.create({ data })
  }
  async listSekolah() {
    return prisma.sekolahMitra.findMany({ orderBy: { createdAt: 'desc' } })
  }
  async createMateri(data: CreateBankMateriData) {
    return prisma.bankMateri.create({ data })
  }
  async listMateri(targetJenjang?: string) {
    const where = targetJenjang ? { targetJenjang: targetJenjang as JenjangSekolah } : {}
    return prisma.bankMateri.findMany({ where, orderBy: { createdAt: 'desc' } })
  }
}