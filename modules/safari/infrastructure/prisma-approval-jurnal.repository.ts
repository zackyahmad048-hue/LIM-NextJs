// modules/safari/infrastructure/prisma-approval-jurnal.repository.ts
import { prisma } from '@/lib/prisma'
import type { ApprovalJurnalRepository, CreateApprovalData } from '@/modules/safari/domain/approval-jurnal.repository'

export class PrismaApprovalJurnalRepository implements ApprovalJurnalRepository {
  async create(data: CreateApprovalData) {
    return prisma.approvalJurnal.create({ data: { ...data, tanggalApproval: data.isApproved ? new Date() : null } })
  }
  async findByDelegasi(delegasiId: string) {
    return prisma.approvalJurnal.findMany({ where: { delegasiId }, orderBy: { createdAt: 'desc' } })
  }
}