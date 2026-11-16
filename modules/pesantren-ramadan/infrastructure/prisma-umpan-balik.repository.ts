// modules/pesantren-ramadan/infrastructure/prisma-umpan-balik.repository.ts
import { prisma } from '@/lib/prisma'
import type { UmpanBalikRepository, CreateUmpanBalikPusatData, CreateUmpanBalikPesertaData } from '@/modules/pesantren-ramadan/domain/umpan-balik.repository'

export class PrismaUmpanBalikRepository implements UmpanBalikRepository {
  async createPusat(data: CreateUmpanBalikPusatData) {
    return prisma.umpanBalikPusat.create({ data })
  }
  async createPeserta(data: CreateUmpanBalikPesertaData) {
    return prisma.umpanBalikPeserta.create({ data })
  }
}