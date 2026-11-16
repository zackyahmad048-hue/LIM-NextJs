// modules/wajib-khidmah/infrastructure/prisma-evaluasi-induk.repository.ts
import { prisma } from '@/lib/prisma'
import type { EvaluasiIndukRepository, CreateEvaluasiIndukData } from '@/modules/wajib-khidmah/domain/evaluasi-induk.repository'

export class PrismaEvaluasiIndukRepository implements EvaluasiIndukRepository {
  async create(data: CreateEvaluasiIndukData) {
    return prisma.evaluasiInduk.create({ data })
  }
}