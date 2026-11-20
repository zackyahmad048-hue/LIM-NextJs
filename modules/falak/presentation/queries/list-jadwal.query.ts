import { listJadwal } from '@/modules/falak/application/falak-operations'

export async function listJadwalShalat(from?: Date, to?: Date) {
  return listJadwal(from, to)
}