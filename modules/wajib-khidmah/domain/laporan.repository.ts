// modules/wajib-khidmah/domain/laporan.repository.ts
import type { LaporanMingguan, Penugasan, StatusLembaga } from "@/generated/client"

export interface CreateLaporanData {
  penugasanId: string
  pelaporId: string
  rolePelapor: 'GURU_BANTU' | 'LEMBAGA_EKSTERNAL'
  namaPengisi: string
  jabatanPengisi: string
  periodeMinggu: number
  periodeTahun: number
  jumlahHariHadir: number
  keteranganAbsensi?: string
  jumlahJamaahDilakukan: number
  aktivitasMingguan: string
  kendala?: string
  statusHonor: 'SUDAH_SESUAI' | 'BELUM' | 'SEBAGIAN' | 'TIDAK_BERLAKU'
}

export interface LaporanRepository {
  findPenugasan(id: string): Promise<(Penugasan & { lembaga: { status: StatusLembaga; userId: string | null } ; guruBantu: { userId: string } }) | null>
  findDuplicate(penugasanId: string, pelaporId: string, periodeMinggu: number, periodeTahun: number): Promise<LaporanMingguan | null>
  create(data: CreateLaporanData): Promise<LaporanMingguan>
  findByPenugasan(penugasanId: string, periodeMinggu?: number, periodeTahun?: number): Promise<LaporanMingguan[]>
}