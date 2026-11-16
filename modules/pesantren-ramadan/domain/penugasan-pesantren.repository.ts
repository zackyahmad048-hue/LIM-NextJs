// modules/pesantren-ramadan/domain/penugasan-pesantren.repository.ts
import type { PenugasanPesantren } from '@/generated/client'

export interface CreatePenugasanPesantrenData {
  sekolahId: string
  pengajarId: string
  koordinatorId: string
  tanggalMulai: Date
  tanggalSelesai: Date
}

export interface PenugasanPesantrenRepository {
  create(data: CreatePenugasanPesantrenData): Promise<PenugasanPesantren>
  findBySekolah(sekolahId: string): Promise<PenugasanPesantren[]>
  findByPengajar(pengajarId: string): Promise<PenugasanPesantren[]>
}