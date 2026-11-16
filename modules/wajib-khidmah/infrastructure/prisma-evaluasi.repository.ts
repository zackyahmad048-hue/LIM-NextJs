// modules/wajib-khidmah/infrastructure/prisma-evaluasi.repository.ts
import { prisma } from '@/lib/prisma'
import type { StatusMediasi } from '@/generated/client'
import type { EvaluasiRepository, CreateEvaluasiKasusData } from '@/modules/wajib-khidmah/domain/evaluasi.repository'

export class PrismaEvaluasiRepository implements EvaluasiRepository {
  async create(data: CreateEvaluasiKasusData) {
    return prisma.evaluasiKasus.create({ data })
  }
  async findById(id: string) {
    return prisma.evaluasiKasus.findUnique({ where: { id } })
  }
  async updateMediasi(id: string, statusMediasi: StatusMediasi, mediatorId: string, catatan?: string) {
    return prisma.evaluasiKasus.update({
      where: { id },
      data: { statusMediasi, mediatorId, catatanMediasi: catatan },
    })
  }
}