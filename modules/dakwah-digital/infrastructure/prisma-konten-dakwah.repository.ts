// modules/dakwah-digital/infrastructure/prisma-konten-dakwah.repository.ts
import { prisma } from '@/lib/prisma'
import type { StatusKonten } from '@/generated/client'
import type { KontenDakwahRepository, CreateKontenData } from '@/modules/dakwah-digital/domain/konten-dakwah.repository'

export class PrismaKontenDakwahRepository implements KontenDakwahRepository {
  async create(data: CreateKontenData) {
    return prisma.kontenDakwah.create({ data })
  }
  async findById(id: string) {
    return prisma.kontenDakwah.findUnique({ where: { id } })
  }
  async updateStatus(id: string, status: StatusKonten, extra?: { disetujuiOlehId?: string }) {
    return prisma.kontenDakwah.update({ where: { id }, data: { status, ...extra } })
  }
  async registerEvent(data: { kontenId: string; namaPeserta: string; email: string; noHp: string; asalInstansi?: string }) {
    return prisma.pendaftaranEvent.create({ data })
  }
}