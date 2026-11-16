// modules/wajib-khidmah/infrastructure/prisma-laporan.repository.ts
import { prisma } from '@/lib/prisma'
import type { LaporanRepository, CreateLaporanData } from '@/modules/wajib-khidmah/domain/laporan.repository'

export class PrismaLaporanRepository implements LaporanRepository {
  async findPenugasan(id: string) {
    const p = await prisma.penugasan.findUnique({
      where: { id },
      include: {
        guruBantu: { select: { userId: true } },
        lembaga: { select: { status: true, userId: true } },
      },
    })
    if (!p) return null
    return p as unknown as Awaited<ReturnType<LaporanRepository['findPenugasan']>>
  }

  async findDuplicate(penugasanId: string, pelaporId: string, periodeMinggu: number, periodeTahun: number) {
    return prisma.laporanMingguan.findFirst({
      where: { penugasanId, pelaporId, periodeMinggu, periodeTahun },
    })
  }

  async create(data: CreateLaporanData) {
    return prisma.laporanMingguan.create({ data })
  }

  async findByPenugasan(penugasanId: string, periodeMinggu?: number, periodeTahun?: number) {
    const where: Record<string, unknown> = { penugasanId }
    if (periodeMinggu !== undefined) where.periodeMinggu = periodeMinggu
    if (periodeTahun !== undefined) where.periodeTahun = periodeTahun
    return prisma.laporanMingguan.findMany({ where, orderBy: { createdAt: 'desc' } })
  }
}