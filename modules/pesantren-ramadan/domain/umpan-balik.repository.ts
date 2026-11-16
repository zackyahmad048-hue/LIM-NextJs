// modules/pesantren-ramadan/domain/umpan-balik.repository.ts
import type { UmpanBalikPusat, UmpanBalikPeserta } from '@/generated/client'

export interface CreateUmpanBalikPusatData {
  penugasanId: string
  penilaiId: string
  tanggalKunjungan: Date
  kondisiSarana: string
  relevansiMateri: string
  kesesuaianKesepakatan: string
  rekomendasi?: string
}

export interface CreateUmpanBalikPesertaData {
  penugasanId: string
  jumlahResponden: number
  ratingKepuasan: number
  komentarPositif?: string
  komentarPerbaikan?: string
}

export interface UmpanBalikRepository {
  createPusat(data: CreateUmpanBalikPusatData): Promise<UmpanBalikPusat>
  createPeserta(data: CreateUmpanBalikPesertaData): Promise<UmpanBalikPeserta>
}