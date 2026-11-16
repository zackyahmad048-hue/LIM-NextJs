// modules/safari/application/approval-jurnal.ts
import type { ApprovalJurnalRepository, CreateApprovalData } from '@/modules/safari/domain/approval-jurnal.repository'
import type { ApproveJurnalInput } from '@/modules/safari/domain/approval-jurnal.schema'

export class ApprovalError extends Error {
  constructor(message: string) { super(message); this.name = 'ApprovalError' }
}

export async function approveJurnal(
  repo: ApprovalJurnalRepository,
  input: ApproveJurnalInput,
  approver: { role: string; name: string }
) {
  const data: CreateApprovalData = {
    delegasiId: input.delegasiId,
    approverRole: approver.role,
    approverName: approver.name,
    approverJabatan: input.approverJabatan,
    isApproved: input.isApproved,
  }
  return repo.create(data)
}