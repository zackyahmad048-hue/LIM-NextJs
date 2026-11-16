// modules/falak/infrastructure/prisma-falak.repository.ts
import { prisma } from '@/lib/prisma'
import type { FalakRepository } from '@/modules/falak/domain/falak.repository'

export class PrismaFalakRepository implements FalakRepository {
  async getActiveConfig() {
    return prisma.falakConfig.findFirst({ where: { isActive: true } })
  }
  async upsertJadwal(data: Parameters<FalakRepository['upsertJadwal']>[0]) {
    return prisma.jadwalShalat.upsert({
      where: { tanggal: data.tanggal },
      create: data,
      update: data,
    })
  }
  async getJadwal(tanggal: Date) {
    return prisma.jadwalShalat.findUnique({ where: { tanggal } })
  }
}