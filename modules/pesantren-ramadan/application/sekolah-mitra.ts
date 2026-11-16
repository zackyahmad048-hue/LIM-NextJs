// modules/pesantren-ramadan/application/sekolah-mitra.ts
import type { SekolahMitraRepository, CreateSekolahMitraData, CreateBankMateriData } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.repository'
import type { CreateSekolahMitraInput, CreateBankMateriInput } from '@/modules/pesantren-ramadan/domain/sekolah-mitra.schema'

export async function createSekolahMitra(repo: SekolahMitraRepository, input: CreateSekolahMitraInput) {
  const data: CreateSekolahMitraData = { ...input }
  return repo.createSekolah(data)
}

export async function createBankMateri(repo: SekolahMitraRepository, input: CreateBankMateriInput) {
  const data: CreateBankMateriData = { ...input }
  return repo.createMateri(data)
}