// modules/wajib-khidmah/domain/evaluasi.repository.ts
import type { EvaluasiKasus, StatusMediasi } from '@/generated/client'

export interface CreateEvaluasiKasusData {
  penugasanId: string
  judulMasalah: string
  deskripsi: string
  tingkatKeparahan: 'RINGAN' | 'SEDANG' | 'BERAT'
}

export interface EvaluasiRepository {
  create(data: CreateEvaluasiKasusData): Promise<EvaluasiKasus>
  findById(id: string): Promise<EvaluasiKasus | null>
  updateMediasi(id: string, statusMediasi: StatusMediasi, mediatorId: string, catatan?: string): Promise<EvaluasiKasus>
}