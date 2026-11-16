// modules/safari/infrastructure/prisma-laporan-sidak.repository.ts
import { prisma } from '@/lib/prisma'
import type { LaporanSidakRepository, CreateLaporanSidakData } from '@/modules/safari/domain/laporan-sidak.repository'

export class PrismaLaporanSidakRepository implements LaporanSidakRepository {
  async create(data: CreateLaporanSidakData) {
    return prisma.laporanSidak.create({ data })
  }
  async findByDelegasi(delegasiId: string) {
    return prisma.laporanSidak.findMany({ where: { delegasiId }, orderBy: { createdAt: 'desc' } })
  }
}