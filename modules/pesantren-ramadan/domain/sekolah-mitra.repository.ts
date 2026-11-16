// modules/pesantren-ramadan/domain/sekolah-mitra.repository.ts
import type { SekolahMitra, BankMateri } from '@/generated/client'

export interface CreateSekolahMitraData {
  namaSekolah: string
  jenjang: 'SD' | 'SMP' | 'SMA' | 'PERGURUAN_TINGGI'
  alamat: string
  picNama: string
  picNoHp: string
  picJabatan?: string
}

export interface CreateBankMateriData {
  judulMateri: string
  deskripsi: string
  targetJenjang: 'SD' | 'SMP' | 'SMA' | 'PERGURUAN_TINGGI'
  durasiMenit: number
}

export interface SekolahMitraRepository {
  createSekolah(data: CreateSekolahMitraData): Promise<SekolahMitra>
  listSekolah(): Promise<SekolahMitra[]>
  createMateri(data: CreateBankMateriData): Promise<BankMateri>
  listMateri(targetJenjang?: string): Promise<BankMateri[]>
}