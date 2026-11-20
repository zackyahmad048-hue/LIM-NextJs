// modules/falak/presentation/queries/get-jadwal.query.ts
import { getJadwalByTanggal } from '@/modules/falak/application/falak-operations'

export async function getJadwalShalat(tanggal: Date) {
  return getJadwalByTanggal(tanggal)
}