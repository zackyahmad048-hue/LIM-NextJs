// modules/safari/domain/titik-safari.repository.ts
import type { TitikSafari } from '@/generated/client'

export interface CreateTitikSafariData {
  namaTitik: string
  alamat: string
  provinsi: string
  kabupaten: string
  kecamatan: string
  desa: string
  picNama?: string
  picNoHp?: string
}

export interface TitikSafariRepository {
  create(data: CreateTitikSafariData): Promise<TitikSafari>
  findMany(filter?: { provinsi?: string; kabupaten?: string }): Promise<TitikSafari[]>
  findById(id: string): Promise<TitikSafari | null>
}