// modules/daerah-binaan/application/daerah-binaan.ts
import type { DaerahBinaanRepository, CreateDaerahBinaanData, CreateLaporanBulananData } from '@/modules/daerah-binaan/domain/daerah-binaan.repository'
import type { CreateDaerahBinaanInput, CreateLaporanBulananInput } from '@/modules/daerah-binaan/domain/daerah-binaan.schema'

export async function createDaerahBinaan(repo: DaerahBinaanRepository, input: CreateDaerahBinaanInput, picLokalId?: string) {
  const data: CreateDaerahBinaanData = { ...input, picLokalId }
  return repo.createDaerah(data)
}

export async function createLaporanBulanan(repo: DaerahBinaanRepository, input: CreateLaporanBulananInput, pelaporId: string) {
  const data: CreateLaporanBulananData = {
    daerahBinaanId: input.daerahBinaanId,
    pelaporId,
    bulan: input.bulan,
    tahun: input.tahun,
    kegiatanDilakukan: input.kegiatanDilakukan,
    jumlahPesertaEstimasi: input.jumlahPesertaEstimasi,
    dampakNaratif: input.dampakNaratif,
    tantanganHambatan: input.tantanganHambatan,
    rencanaBulanDepan: input.rencanaBulanDepan,
  }
  return repo.createLaporan(data)
}