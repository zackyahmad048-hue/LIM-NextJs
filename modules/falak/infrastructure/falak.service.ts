import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { generateJadwal as generateJadwalUseCase } from '@/modules/falak/application/generate-jadwal'
import { PrismaFalakRepository } from '@/modules/falak/infrastructure/prisma-falak.repository'

export type FalakActor = AuthzSubject & { ipAddress?: string }

export async function listJadwal(from?: Date, to?: Date) {
  const where: { tanggal?: { gte?: Date; lte?: Date } } = {}
  if (from || to) {
    where.tanggal = {}
    if (from) where.tanggal.gte = from
    if (to) where.tanggal.lte = to
  }
  return prisma.jadwalShalat.findMany({ where, orderBy: { tanggal: 'asc' } })
}

export async function getJadwalByTanggal(tanggal: Date) {
  return prisma.jadwalShalat.findFirst({
    where: { tanggal },
    orderBy: { config: { isActive: 'desc' } },
  })
}

export async function getActiveConfig() {
  return prisma.falakConfig.findFirst({ where: { isActive: true } })
}

export async function generateJadwalRecord(tanggal: Date, modeWaktu: 'standar' | 'istiwa' | undefined, actor: FalakActor) {
  if (actor.role !== 'OWNER') {
    throw new ApiError('FORBIDDEN', 'Hanya OWNER yang dapat generate jadwal shalat', 403)
  }
  const repo = new PrismaFalakRepository()
  const result = await generateJadwalUseCase(repo, tanggal, modeWaktu)
  await prisma.auditLog.create({
    data: {
      userId: actor.userId,
      action: 'FALAK_JADWAL_GENERATED',
      entity: 'JadwalShalat',
      entityId: result.id,
      metadata: { tanggal: result.tanggal.toISOString() },
      ipAddress: actor.ipAddress,
    },
  })
  return result
}
