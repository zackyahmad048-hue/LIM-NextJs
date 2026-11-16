// modules/pesantren-ramadan/application/umpan-balik.ts
import type { UmpanBalikRepository, CreateUmpanBalikPusatData, CreateUmpanBalikPesertaData } from '@/modules/pesantren-ramadan/domain/umpan-balik.repository'
import type { CreateUmpanBalikPusatInput, CreateUmpanBalikPesertaInput } from '@/modules/pesantren-ramadan/domain/umpan-balik.schema'

export async function createUmpanBalikPusat(repo: UmpanBalikRepository, input: CreateUmpanBalikPusatInput, penilaiId: string) {
  const data: CreateUmpanBalikPusatData = {
    penugasanId: input.penugasanId,
    penilaiId,
    tanggalKunjungan: input.tanggalKunjungan,
    kondisiSarana: input.kondisiSarana,
    relevansiMateri: input.relevansiMateri,
    kesesuaianKesepakatan: input.kesesuaianKesepakatan,
    rekomendasi: input.rekomendasi,
  }
  return repo.createPusat(data)
}

export async function createUmpanBalikPeserta(repo: UmpanBalikRepository, input: CreateUmpanBalikPesertaInput) {
  const data: CreateUmpanBalikPesertaData = {
    penugasanId: input.penugasanId,
    jumlahResponden: input.jumlahResponden,
    ratingKepuasan: input.ratingKepuasan,
    komentarPositif: input.komentarPositif,
    komentarPerbaikan: input.komentarPerbaikan,
  }
  return repo.createPeserta(data)
}