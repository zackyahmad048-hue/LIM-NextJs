// modules/safari/domain/laporan-sidak.repository.ts
import type { LaporanSidak } from '@/generated/client'

export interface CreateLaporanSidakData {
  delegasiId: string
  penilaiId: string
  tanggalSidak: Date
  kondisiKegiatan: string
  kondisiDelegasi: string
  kendala?: string
  rekomendasi?: string
}

export interface LaporanSidakRepository {
  create(data: CreateLaporanSidakData): Promise<LaporanSidak>
  findByDelegasi(delegasiId: string): Promise<LaporanSidak[]>
}