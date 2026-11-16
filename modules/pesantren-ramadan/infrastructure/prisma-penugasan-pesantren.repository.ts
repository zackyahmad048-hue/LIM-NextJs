// modules/pesantren-ramadan/infrastructure/prisma-penugasan-pesantren.repository.ts
import { prisma } from '@/lib/prisma'
import type { PenugasanPesantrenRepository, CreatePenugasanPesantrenData } from '@/modules/pesantren-ramadan/domain/penugasan-pesantren.repository'

export class PrismaPenugasanPesantrenRepository implements PenugasanPesantrenRepository {
  async create(data: CreatePenugasanPesantrenData) {
    return prisma.penugasanPesantren.create({ data })
  }
  async findBySekolah(sekolahId: string) {
    return prisma.penugasanPesantren.findMany({ where: { sekolahId }, orderBy: { createdAt: 'desc' } })
  }
  async findByPengajar(pengajarId: string) {
    return prisma.penugasanPesantren.findMany({ where: { pengajarId }, orderBy: { createdAt: 'desc' } })
  }
}