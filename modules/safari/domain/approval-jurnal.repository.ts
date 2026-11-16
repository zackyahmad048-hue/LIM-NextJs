// modules/safari/domain/approval-jurnal.repository.ts
import type { ApprovalJurnal } from '@/generated/client'

export interface CreateApprovalData {
  delegasiId: string
  approverRole: string
  approverName: string
  approverJabatan?: string
  isApproved: boolean
}

export interface ApprovalJurnalRepository {
  create(data: CreateApprovalData): Promise<ApprovalJurnal>
  findByDelegasi(delegasiId: string): Promise<ApprovalJurnal[]>
}