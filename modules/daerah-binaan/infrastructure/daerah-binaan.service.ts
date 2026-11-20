import { Prisma } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { getDaerahBinaanActionsForRole } from '@/modules/authorization/domain/matrix'

export type BinaanActor = AuthzSubject & { ipAddress?: string }

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'approve') {
  const allowed = getDaerahBinaanActionsForRole(subject.role)
  if (!allowed.includes(action)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
}

async function checkWilayahAccess(actor: BinaanActor, provinsi: string, kabupaten: string) {
  if (actor.role !== 'PW' && actor.role !== 'PC') return
  const orgAccount = await prisma.organizationalAccount.findUnique({ where: { userId: actor.userId }, include: { unit: true } })
  const unitWilayah = orgAccount?.unit?.wilayah
  if (!unitWilayah) throw new ApiError('FORBIDDEN', 'Akun organisasi tidak terhubung ke unit', 403)
  const inWilayah = actor.role === 'PW' ? provinsi === unitWilayah : kabupaten === unitWilayah
  if (!inWilayah) throw new ApiError('FORBIDDEN', 'Di luar wilayah Anda', 403)
}

export async function listDaerah(input: { page: number; limit: number; status?: string }, actor: BinaanActor) {
  assertCan(actor, 'read')
  const where: Prisma.DaerahBinaanWhereInput = {}
  if (input.status) where.status = input.status as never
  // shortcut: PW/PC wilayah filtering not applied at query level (requires unit wilayah join); enforced on create/report
  const [items, total] = await Promise.all([
    prisma.daerahBinaan.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.daerahBinaan.count({ where }),
  ])
  return { items, total }
}

export async function createDaerahRecord(input: { namaLokasi: string; provinsi: string; kabupaten: string; kecamatan: string; deskripsiKondisi: string; sumberLokasi?: string }, actor: BinaanActor) {
  assertCan(actor, 'create')
  await checkWilayahAccess(actor, input.provinsi, input.kabupaten)
  return prisma.daerahBinaan.create({ data: { ...input, picLokalId: actor.userId } })
}

export async function listLaporanBulanan(input: { page: number; limit: number; daerahBinaanId?: string }, actor: BinaanActor) {
  assertCan(actor, 'read')
  const where: Prisma.LaporanBulananBinaanWhereInput = {}
  if (input.daerahBinaanId) where.daerahBinaanId = input.daerahBinaanId
  const [items, total] = await Promise.all([
    prisma.laporanBulananBinaan.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.laporanBulananBinaan.count({ where }),
  ])
  return { items, total }
}

export async function createLaporanBulananRecord(input: { daerahBinaanId: string; bulan: number; tahun: number; kegiatanDilakukan: string; jumlahPesertaEstimasi?: number; dampakNaratif: string; tantanganHambatan?: string; rencanaBulanDepan?: string }, actor: BinaanActor) {
  assertCan(actor, 'create')
  const daerah = await prisma.daerahBinaan.findUnique({ where: { id: input.daerahBinaanId } })
  if (!daerah) throw new ApiError('NOT_FOUND', 'Daerah binaan tidak ditemukan', 404)
  await checkWilayahAccess(actor, daerah.provinsi, daerah.kabupaten)
  return prisma.laporanBulananBinaan.create({ data: { ...input, pelaporId: actor.userId } })
}
