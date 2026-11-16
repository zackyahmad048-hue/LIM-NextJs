// modules/safari/infrastructure/prisma-delegasi.repository.ts
import { prisma } from '@/lib/prisma'
import type { DelegasiRepository, CreateDelegasiData } from '@/modules/safari/domain/delegasi-safari.repository'

export class PrismaDelegasiRepository implements DelegasiRepository {
  async createDelegasi(data: CreateDelegasiData) {
    return prisma.delegasiSafari.create({ data: { ...data, status: 'AKTIF' } })
  }
  async findDelegasiById(id: string) {
    return prisma.delegasiSafari.findUnique({ where: { id } })
  }
  async findDelegasiByUser(userId: string) {
    return prisma.delegasiSafari.findFirst({ where: { userId, status: 'AKTIF' } })
  }
  async createJurnal(data: { delegasiId: string; tanggal: Date; kegiatan: string; jumlahJamaah?: number; catatan?: string }) {
    return prisma.jurnalHarianSafari.create({ data })
  }
}