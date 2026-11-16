// modules/safari/domain/delegasi-safari.repository.ts
import type { DelegasiSafari, JurnalHarianSafari } from '@/generated/client'

export interface CreateDelegasiData {
  titikId: string
  userId: string
  namaLengkap: string
  noHp: string
  asalPondok?: string
}

export interface DelegasiRepository {
  createDelegasi(data: CreateDelegasiData): Promise<DelegasiSafari>
  findDelegasiById(id: string): Promise<DelegasiSafari | null>
  findDelegasiByUser(userId: string): Promise<DelegasiSafari | null>
  createJurnal(data: { delegasiId: string; tanggal: Date; kegiatan: string; jumlahJamaah?: number; catatan?: string }): Promise<JurnalHarianSafari>
}