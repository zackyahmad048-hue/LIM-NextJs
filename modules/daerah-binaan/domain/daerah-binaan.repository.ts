// modules/daerah-binaan/domain/daerah-binaan.repository.ts
import type { DaerahBinaan, LaporanBulananBinaan } from '@/generated/client'

export interface CreateDaerahBinaanData {
  namaLokasi: string; provinsi: string; kabupaten: string; kecamatan: string
  deskripsiKondisi: string; sumberLokasi?: string; picLokalId?: string
}

export interface CreateLaporanBulananData {
  daerahBinaanId: string; pelaporId: string; bulan: number; tahun: number
  kegiatanDilakukan: string; jumlahPesertaEstimasi?: number; dampakNaratif: string
  tantanganHambatan?: string; rencanaBulanDepan?: string
}

export interface DaerahBinaanRepository {
  createDaerah(data: CreateDaerahBinaanData): Promise<DaerahBinaan>
  listDaerah(): Promise<DaerahBinaan[]>
  createLaporan(data: CreateLaporanBulananData): Promise<LaporanBulananBinaan>
}