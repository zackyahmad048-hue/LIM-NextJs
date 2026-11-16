// modules/daerah-binaan/infrastructure/prisma-daerah-binaan.repository.ts
import { prisma } from '@/lib/prisma'
import type { DaerahBinaanRepository, CreateDaerahBinaanData, CreateLaporanBulananData } from '@/modules/daerah-binaan/domain/daerah-binaan.repository'

export class PrismaDaerahBinaanRepository implements DaerahBinaanRepository {
  async createDaerah(data: CreateDaerahBinaanData) {
    return prisma.daerahBinaan.create({ data })
  }
  async listDaerah() {
    return prisma.daerahBinaan.findMany({ orderBy: { createdAt: 'desc' } })
  }
  async createLaporan(data: CreateLaporanBulananData) {
    return prisma.laporanBulananBinaan.create({ data })
  }
}