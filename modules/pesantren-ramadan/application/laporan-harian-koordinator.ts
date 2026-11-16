// modules/pesantren-ramadan/application/laporan-harian-koordinator.ts
import type { LaporanHarianKoordinatorRepository, CreateLaporanHarianKoordinatorData } from '@/modules/pesantren-ramadan/domain/laporan-harian-koordinator.repository'
import type { CreateLaporanHarianKoordinatorInput } from '@/modules/pesantren-ramadan/domain/laporan-harian-koordinator.schema'

export class LaporanKoordinatorError extends Error {
  constructor(message: string) { super(message); this.name = 'LaporanKoordinatorError' }
}

export async function createLaporanHarianKoordinator(
  repo: LaporanHarianKoordinatorRepository,
  input: CreateLaporanHarianKoordinatorInput,
  sessionUserId: string
) {
  const penugasan = await repo.findPenugasan(input.penugasanId)
  if (!penugasan) throw new LaporanKoordinatorError('Penugasan tidak ditemukan')
  if (penugasan.koordinatorId !== sessionUserId) throw new LaporanKoordinatorError('Forbidden: Bukan koordinator penugasan ini')

  const data: CreateLaporanHarianKoordinatorData = {
    penugasanId: input.penugasanId,
    tanggal: input.tanggal,
    pengajarHadir: input.pengajarHadir,
    kesiapanSarana: input.kesiapanSarana,
    catatanUmum: input.catatanUmum,
  }
  return repo.create(data)
}