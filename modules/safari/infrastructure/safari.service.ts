import { Prisma, type StatusDelegasiSafari } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { getSafariActionsForRole } from '@/modules/authorization/domain/matrix'

export type SafariActor = AuthzSubject & { ipAddress?: string; name?: string }

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'approve') {
  const allowed = getSafariActionsForRole(subject.role)
  if (!allowed.includes(action)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
}

// shortcut: TitikSafari/Delegasi belum memiliki organizationalAccountId; scope wilayah (PW/PC) belum bisa dibatasi ketat di query.

// --- Titik Safari ---
export async function listTitikSafari(input: { page: number; limit: number; provinsi?: string; kabupaten?: string }, actor: SafariActor) {
  assertCan(actor, 'read')
  const where: Prisma.TitikSafariWhereInput = {}
  if (input.provinsi) where.provinsi = { contains: input.provinsi, mode: 'insensitive' }
  if (input.kabupaten) where.kabupaten = { contains: input.kabupaten, mode: 'insensitive' }
  const [items, total] = await Promise.all([
    prisma.titikSafari.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.titikSafari.count({ where }),
  ])
  return { items, total }
}

export async function getTitikSafariById(id: string, actor: SafariActor) {
  assertCan(actor, 'read')
  const item = await prisma.titikSafari.findUnique({ where: { id } })
  if (!item) throw new ApiError('NOT_FOUND', 'Titik safari tidak ditemukan', 404)
  return item
}

export async function createTitikSafariRecord(input: {
  namaTitik: string; alamat: string; provinsi: string; kabupaten: string; kecamatan: string; desa: string; picNama?: string; picNoHp?: string
}, actor: SafariActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC'].includes(actor.role)) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin membuat titik safari', 403)
  }
  return prisma.titikSafari.create({ data: { ...input } })
}

export async function updateTitikSafariRecord(id: string, input: Partial<{
  namaTitik: string; alamat: string; provinsi: string; kabupaten: string; kecamatan: string; desa: string; picNama?: string; picNoHp?: string
}>, actor: SafariActor) {
  assertCan(actor, 'update')
  if (!['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC'].includes(actor.role)) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin mengubah titik safari', 403)
  }
  const existing = await prisma.titikSafari.findUnique({ where: { id } })
  if (!existing) throw new ApiError('NOT_FOUND', 'Titik safari tidak ditemukan', 404)
  return prisma.titikSafari.update({ where: { id }, data: input })
}

// --- Delegasi ---
export async function listDelegasi(input: { page: number; limit: number; titikId?: string; userId?: string }, actor: SafariActor) {
  assertCan(actor, 'read')
  const where: Prisma.DelegasiSafariWhereInput = {}
  if (input.titikId) where.titikId = input.titikId
  if (input.userId) where.userId = input.userId
  // delegasi role sees own
  if (actor.role === 'DELEGASI_SAFARI_DAERAH') where.userId = actor.userId
  const [items, total] = await Promise.all([
    prisma.delegasiSafari.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.delegasiSafari.count({ where }),
  ])
  return { items, total }
}

export async function getDelegasiById(id: string, actor: SafariActor) {
  assertCan(actor, 'read')
  const item = await prisma.delegasiSafari.findUnique({ where: { id } })
  if (!item) throw new ApiError('NOT_FOUND', 'Delegasi tidak ditemukan', 404)
  if (actor.role === 'DELEGASI_SAFARI_DAERAH' && item.userId !== actor.userId) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki akses ke delegasi ini', 403)
  }
  return item
}

export async function createDelegasiRecord(input: {
  titikId: string; userId: string; namaLengkap: string; noHp: string; asalPondok?: string
}, actor: SafariActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC'].includes(actor.role)) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin membuat delegasi', 403)
  }
  const titik = await prisma.titikSafari.findUnique({ where: { id: input.titikId } })
  if (!titik) throw new ApiError('NOT_FOUND', 'Titik safari tidak ditemukan', 404)
  return prisma.delegasiSafari.create({ data: { ...input, status: 'AKTIF' } })
}

// --- Jurnal ---
export async function listJurnal(input: { page: number; limit: number; delegasiId?: string }, actor: SafariActor) {
  assertCan(actor, 'read')
  const where: Prisma.JurnalHarianSafariWhereInput = {}
  if (input.delegasiId) where.delegasiId = input.delegasiId
  if (actor.role === 'DELEGASI_SAFARI_DAERAH') {
    const delegasi = await prisma.delegasiSafari.findFirst({ where: { userId: actor.userId } })
    if (!delegasi) return { items: [], total: 0 }
    where.delegasiId = delegasi.id
  }
  const [items, total] = await Promise.all([
    prisma.jurnalHarianSafari.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { tanggal: 'desc' } }),
    prisma.jurnalHarianSafari.count({ where }),
  ])
  return { items, total }
}

export async function createJurnalRecord(input: {
  delegasiId: string; tanggal: string | Date; kegiatan: string; jumlahJamaah?: number; catatan?: string
}, actor: SafariActor) {
  assertCan(actor, 'create')
  if (actor.role !== 'DELEGASI_SAFARI_DAERAH') {
    throw new ApiError('FORBIDDEN', 'Hanya delegasi safari yang dapat membuat jurnal', 403)
  }
  const delegasi = await prisma.delegasiSafari.findFirst({ where: { id: input.delegasiId, userId: actor.userId } })
  if (!delegasi) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki akses ke delegasi ini', 403)
  if (delegasi.status !== 'AKTIF') throw new ApiError('CONFLICT', 'Delegasi tidak aktif', 409)
  return prisma.jurnalHarianSafari.create({
    data: {
      delegasiId: input.delegasiId,
      tanggal: new Date(input.tanggal),
      kegiatan: input.kegiatan,
      jumlahJamaah: input.jumlahJamaah,
      catatan: input.catatan,
    },
  })
}

// --- Approval Jurnal ---
export async function approveJurnalRecord(input: {
  delegasiId: string; isApproved: boolean; approverJabatan?: string
}, actor: SafariActor) {
  assertCan(actor, 'approve')
  const allowed: string[] = ['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC', 'PANITIA_SAFARI_DAERAH']
  if (!allowed.includes(actor.role)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin approval jurnal', 403)
  const delegasi = await prisma.delegasiSafari.findUnique({ where: { id: input.delegasiId } })
  if (!delegasi) throw new ApiError('NOT_FOUND', 'Delegasi tidak ditemukan', 404)

  const approval = await prisma.$transaction(async (tx) => {
    const created = await tx.approvalJurnal.create({
      data: {
        delegasiId: input.delegasiId,
        approverRole: actor.role,
        approverName: actor.name || actor.userId,
        approverJabatan: input.approverJabatan,
        isApproved: input.isApproved,
        tanggalApproval: input.isApproved ? new Date() : null,
      },
    })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: input.isApproved ? 'SAFARI_JURNAL_APPROVED' : 'SAFARI_JURNAL_REJECTED',
        entity: 'ApprovalJurnal',
        entityId: created.id,
        metadata: JSON.stringify({ delegasiId: input.delegasiId }),
        ipAddress: actor.ipAddress,
      },
    })
    return created
  })
  return approval
}

export async function listApprovalByDelegasi(delegasiId: string, actor: SafariActor) {
  assertCan(actor, 'read')
  const delegasi = await prisma.delegasiSafari.findUnique({ where: { id: delegasiId } })
  if (!delegasi) throw new ApiError('NOT_FOUND', 'Delegasi tidak ditemukan', 404)
  return prisma.approvalJurnal.findMany({ where: { delegasiId }, orderBy: { createdAt: 'desc' } })
}

// --- Laporan Sidak ---
export async function listLaporanSidak(input: { page: number; limit: number; delegasiId?: string }, actor: SafariActor) {
  assertCan(actor, 'read')
  const where: Prisma.LaporanSidakWhereInput = {}
  if (input.delegasiId) where.delegasiId = input.delegasiId
  if (actor.role === 'DELEGASI_SAFARI_DAERAH') {
    const delegasi = await prisma.delegasiSafari.findFirst({ where: { userId: actor.userId } })
    if (!delegasi) return { items: [], total: 0 }
    where.delegasiId = delegasi.id
  }
  const [items, total] = await Promise.all([
    prisma.laporanSidak.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.laporanSidak.count({ where }),
  ])
  return { items, total }
}

export async function createLaporanSidakRecord(input: {
  delegasiId: string; tanggalSidak: string | Date; kondisiKegiatan: string; kondisiDelegasi: string; kendala?: string; rekomendasi?: string
}, actor: SafariActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC'].includes(actor.role)) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin membuat laporan sidak', 403)
  }
  const delegasi = await prisma.delegasiSafari.findUnique({ where: { id: input.delegasiId } })
  if (!delegasi) throw new ApiError('NOT_FOUND', 'Delegasi tidak ditemukan', 404)

  const sidak = await prisma.$transaction(async (tx) => {
    const created = await tx.laporanSidak.create({
      data: {
        delegasiId: input.delegasiId,
        penilaiId: actor.userId,
        tanggalSidak: new Date(input.tanggalSidak),
        kondisiKegiatan: input.kondisiKegiatan,
        kondisiDelegasi: input.kondisiDelegasi,
        kendala: input.kendala,
        rekomendasi: input.rekomendasi,
      },
    })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'SAFARI_SIDAK_CREATED',
        entity: 'LaporanSidak',
        entityId: created.id,
        metadata: JSON.stringify({ delegasiId: input.delegasiId }),
        ipAddress: actor.ipAddress,
      },
    })
    return created
  })
  return sidak
}

// avoid unused
void (0 as unknown as StatusDelegasiSafari)
