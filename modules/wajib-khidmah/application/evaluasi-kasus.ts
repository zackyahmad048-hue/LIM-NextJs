// modules/wajib-khidmah/application/evaluasi-kasus.ts
import type { EvaluasiRepository, CreateEvaluasiKasusData } from '@/modules/wajib-khidmah/domain/evaluasi.repository'
import type { CreateEvaluasiKasusInput, UpdateMediasiInput } from '@/modules/wajib-khidmah/domain/evaluasi.schema'

export class EvaluasiError extends Error {
  constructor(message: string) { super(message); this.name = 'EvaluasiError' }
}

export async function createEvaluasiKasus(repo: EvaluasiRepository, input: CreateEvaluasiKasusInput) {
  const data: CreateEvaluasiKasusData = {
    penugasanId: input.penugasanId,
    judulMasalah: input.judulMasalah,
    deskripsi: input.deskripsi,
    tingkatKeparahan: input.tingkatKeparahan,
  }
  return repo.create(data)
}

export async function updateMediasi(repo: EvaluasiRepository, input: UpdateMediasiInput, mediatorId: string) {
  const existing = await repo.findById(input.kasusId)
  if (!existing) throw new EvaluasiError('Kasus tidak ditemukan')
  return repo.updateMediasi(input.kasusId, input.statusMediasi, mediatorId, input.catatanMediasi)
}