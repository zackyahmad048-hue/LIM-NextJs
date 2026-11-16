// modules/pesantren-ramadan/application/laporan-harian-pengajar.ts
import type { LaporanHarianPengajarRepository, CreateLaporanHarianPengajarData } from '@/modules/pesantren-ramadan/domain/laporan-harian-pengajar.repository'
import type { CreateLaporanHarianPengajarInput } from '@/modules/pesantren-ramadan/domain/laporan-harian-pengajar.schema'

export class LaporanHarianError extends Error {
  constructor(message: string) { super(message); this.name = 'LaporanHarianError' }
}

export async function createLaporanHarianPengajar(
  repo: LaporanHarianPengajarRepository,
  input: CreateLaporanHarianPengajarInput,
  sessionUserId: string
) {
  const penugasan = await repo.findPenugasan(input.penugasanId)
  if (!penugasan) throw new LaporanHarianError('Penugasan tidak ditemukan')
  if (penugasan.pengajarId !== sessionUserId) throw new LaporanHarianError('Forbidden: Bukan penugasan Anda')

  const data: CreateLaporanHarianPengajarData = {
    penugasanId: input.penugasanId,
    tanggal: input.tanggal,
    kelas: input.kelas,
    jumlahSiswaL: input.jumlahSiswaL,
    jumlahSiswaP: input.jumlahSiswaP,
    materiId: input.materiId,
    pertanyaanPeserta: input.pertanyaanPeserta,
    kondisiKelas: input.kondisiKelas,
    praktikDilakukan: input.praktikDilakukan,
    catatanTambahan: input.catatanTambahan,
  }
  return repo.create(data)
}