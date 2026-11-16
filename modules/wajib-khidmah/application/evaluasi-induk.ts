// modules/wajib-khidmah/application/evaluasi-induk.ts
import type { EvaluasiIndukRepository, CreateEvaluasiIndukData } from '@/modules/wajib-khidmah/domain/evaluasi-induk.repository'
import type { CreateEvaluasiIndukInput } from '@/modules/wajib-khidmah/domain/evaluasi-induk.schema'

export async function createEvaluasiInduk(repo: EvaluasiIndukRepository, input: CreateEvaluasiIndukInput, userId: string) {
  const data: CreateEvaluasiIndukData = {
    penugasanId: input.penugasanId,
    lembagaId: input.lembagaId,
    evaluatorId: userId,
    initiatedById: userId,
    catatanEvaluasi: input.catatanEvaluasi,
    rekomendasi: input.rekomendasi,
  }
  return repo.create(data)
}