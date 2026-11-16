// modules/pesantren-ramadan/infrastructure/prisma-laporan-harian-pengajar.repository.ts
import { prisma } from '@/lib/prisma'
import type { LaporanHarianPengajarRepository, CreateLaporanHarianPengajarData } from '@/modules/pesantren-ramadan/domain/laporan-harian-pengajar.repository'

export class PrismaLaporanHarianPengajarRepository implements LaporanHarianPengajarRepository {
  async findPenugasan(id: string) {
    const p = await prisma.penugasanPesantren.findUnique({ where: { id }, select: { pengajarId: true } })
    return p
  }
  async create(data: CreateLaporanHarianPengajarData) {
    return prisma.laporanHarianPengajar.create({ data })
  }
  async findByPenugasan(penugasanId: string) {
    return prisma.laporanHarianPengajar.findMany({ where: { penugasanId }, orderBy: { tanggal: 'desc' } })
  }
}