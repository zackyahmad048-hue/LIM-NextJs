// modules/pesantren-ramadan/domain/laporan-harian-pengajar.repository.ts
import type { LaporanHarianPengajar } from '@/generated/client'

export interface CreateLaporanHarianPengajarData {
  penugasanId: string
  tanggal: Date
  kelas: string
  jumlahSiswaL: number
  jumlahSiswaP: number
  materiId: string
  pertanyaanPeserta?: string
  kondisiKelas: 'TENANG' | 'RAMAI_TAPI_KONDUSIF' | 'DISKUSI_BERJALAN_BAIK' | 'BANYAK_YANG_MENGANTUK' | 'TIDAK_KONDUSIF'
  praktikDilakukan: boolean
  catatanTambahan?: string
}

export interface LaporanHarianPengajarRepository {
  findPenugasan(id: string): Promise<{ pengajarId: string } | null>
  create(data: CreateLaporanHarianPengajarData): Promise<LaporanHarianPengajar>
  findByPenugasan(penugasanId: string): Promise<LaporanHarianPengajar[]>
}