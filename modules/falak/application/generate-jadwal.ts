// modules/falak/application/generate-jadwal.ts
import { hitungWaktuShalat } from '@/modules/falak/domain/falak-calculation'
import type { FalakRepository } from '@/modules/falak/domain/falak.repository'

export class FalakError extends Error {
  constructor(message: string) { super(message); this.name = 'FalakError' }
}

export async function generateJadwal(repo: FalakRepository, tanggal: Date, modeWaktuOverride?: 'standar' | 'istiwa') {
  const config = await repo.getActiveConfig()
  if (!config) throw new FalakError('Konfigurasi Falak aktif tidak ditemukan')

  const modeWaktu = modeWaktuOverride ?? (config.modeWaktu === 'istiwa' ? 'istiwa' : 'standar')

  const result = hitungWaktuShalat({
    tanggal,
    latitude: config.latitude,
    longitude: config.longitude,
    elevation: config.ketinggian,
    sudutSubuh: 20,
    koreksiSubuh: config.koreksiSubuh,
    koreksiMaghrib: config.koreksiMaghrib,
    zonaWaktu: 7,
    modeWaktu,
  })

  return repo.upsertJadwal({
    tanggal,
    subuh: result.subuh,
    terbit: result.terbit,
    dzuhur: result.dzuhur,
    ashar: result.ashar,
    maghrib: result.maghrib,
    isya: result.isya,
    configId: config.id,
  })
}