// modules/safari/application/laporan-sidak.ts
import type { LaporanSidakRepository, CreateLaporanSidakData } from '@/modules/safari/domain/laporan-sidak.repository'
import type { CreateLaporanSidakInput } from '@/modules/safari/domain/laporan-sidak.schema'

export async function createLaporanSidak(repo: LaporanSidakRepository, input: CreateLaporanSidakInput, penilaiId: string) {
  const data: CreateLaporanSidakData = {
    delegasiId: input.delegasiId,
    penilaiId,
    tanggalSidak: input.tanggalSidak,
    kondisiKegiatan: input.kondisiKegiatan,
    kondisiDelegasi: input.kondisiDelegasi,
    kendala: input.kendala,
    rekomendasi: input.rekomendasi,
  }
  return repo.create(data)
}