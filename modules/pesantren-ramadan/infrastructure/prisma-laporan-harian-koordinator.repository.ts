// modules/pesantren-ramadan/infrastructure/prisma-laporan-harian-koordinator.repository.ts
import { prisma } from '@/lib/prisma'
import type { LaporanHarianKoordinatorRepository, CreateLaporanHarianKoordinatorData } from '@/modules/pesantren-ramadan/domain/laporan-harian-koordinator.repository'

export class PrismaLaporanHarianKoordinatorRepository implements LaporanHarianKoordinatorRepository {
  async findPenugasan(id: string) {
    return prisma.penugasanPesantren.findUnique({ where: { id }, select: { koordinatorId: true } })
  }
  async create(data: CreateLaporanHarianKoordinatorData) {
    return prisma.laporanHarianKoordinator.create({ data })
  }
}