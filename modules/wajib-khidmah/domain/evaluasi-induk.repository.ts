// modules/wajib-khidmah/domain/evaluasi-induk.repository.ts
import type { EvaluasiInduk } from '@/generated/client'

export interface CreateEvaluasiIndukData {
  penugasanId: string
  lembagaId: string
  evaluatorId: string
  initiatedById: string
  catatanEvaluasi: string
  rekomendasi?: string
}

export interface EvaluasiIndukRepository {
  create(data: CreateEvaluasiIndukData): Promise<EvaluasiInduk>
}