// modules/falak/presentation/queries/get-jadwal.query.ts
import { prisma } from '@/lib/prisma'

export async function getJadwalShalat(tanggal: Date) {
  return prisma.jadwalShalat.findUnique({ where: { tanggal } })
}