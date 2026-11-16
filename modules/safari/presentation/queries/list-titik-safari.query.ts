// modules/safari/presentation/queries/list-titik-safari.query.ts
import { prisma } from '@/lib/prisma'

export async function listTitikSafari(filter?: { provinsi?: string; kabupaten?: string }) {
  const where: Record<string, unknown> = {}
  if (filter?.provinsi) where.provinsi = filter.provinsi
  if (filter?.kabupaten) where.kabupaten = filter.kabupaten
  return prisma.titikSafari.findMany({ where, orderBy: { createdAt: 'desc' } })
}