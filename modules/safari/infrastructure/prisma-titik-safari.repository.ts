// modules/safari/infrastructure/prisma-titik-safari.repository.ts
import { prisma } from '@/lib/prisma'
import type { TitikSafariRepository, CreateTitikSafariData } from '@/modules/safari/domain/titik-safari.repository'

export class PrismaTitikSafariRepository implements TitikSafariRepository {
  async create(data: CreateTitikSafariData) {
    return prisma.titikSafari.create({ data })
  }
  async findMany(filter?: { provinsi?: string; kabupaten?: string }) {
    const where: Record<string, unknown> = {}
    if (filter?.provinsi) where.provinsi = filter.provinsi
    if (filter?.kabupaten) where.kabupaten = filter.kabupaten
    return prisma.titikSafari.findMany({ where, orderBy: { createdAt: 'desc' } })
  }
  async findById(id: string) {
    return prisma.titikSafari.findUnique({ where: { id } })
  }
}