// modules/pesantren-ramadan/domain/laporan-harian-koordinator.repository.ts
import type { LaporanHarianKoordinator } from '@/generated/client'

export interface CreateLaporanHarianKoordinatorData {
  penugasanId: string
  tanggal: Date
  pengajarHadir: boolean
  kesiapanSarana?: string
  catatanUmum?: string
}

export interface LaporanHarianKoordinatorRepository {
  findPenugasan(id: string): Promise<{ koordinatorId: string } | null>
  create(data: CreateLaporanHarianKoordinatorData): Promise<LaporanHarianKoordinator>
}