import { Prisma, type Role, type StatusHonor } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { getWkActionsForRole } from '@/modules/authorization/domain/matrix'

export type WkActor = AuthzSubject & { ipAddress?: string; name?: string }

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'review' | 'approve') {
  const allowed = getWkActionsForRole(subject.role)
  if (!allowed.includes(action)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
}

// shortcut: scoping berbasis relasi user pada penugasan/lembaga; PW/PC belum dipetakan ke unit wilayah spesifik karena model belum menyimpan scope wilayah eksplisit.
async function penugasanScope(subject: AuthzSubject): Promise<Prisma.PenugasanWhereInput> {
  if (subject.role === 'OWNER' || subject.role === 'TIM_WAJIB_KHIDMAH') return {}
  if (subject.role === 'PW' || subject.role === 'PC') return {} // shortcut: butuh scope wilayah
  if (subject.role === 'GURU_BANTU') {
    const profile = await prisma.guruBantuProfile.findUnique({ where: { userId: subject.userId }, select: { id: true } })
    if (!profile) return { id: '__none__' }
    return { guruBantuId: profile.id }
  }
  if (subject.role === 'LEMBAGA_EKSTERNAL') {
    const lembaga = await prisma.lembaga.findUnique({ where: { userId: subject.userId }, select: { id: true } })
    if (!lembaga) return { id: '__none__' }
    return { lembagaId: lembaga.id }
  }
  return { id: '__none__' }
}

async function laporanScope(subject: AuthzSubject): Promise<Prisma.LaporanMingguanWhereInput> {
  if (subject.role === 'OWNER' || subject.role === 'TIM_WAJIB_KHIDMAH') return {}
  if (subject.role === 'PW' || subject.role === 'PC') return {} // shortcut: butuh scope wilayah
  return { pelaporId: subject.userId }
}

// --- Penugasan ---
export async function listPenugasan(input: {
  page: number
  limit: number
  status?: string
  guruBantuId?: string
  lembagaId?: string
}, actor: WkActor) {
  assertCan(actor, 'read')
  const scope = await penugasanScope(actor)
  const where: Prisma.PenugasanWhereInput = { deletedAt: null, ...scope }
  if (input.status) where.status = input.status as never
  if (input.guruBantuId) where.guruBantuId = input.guruBantuId
  if (input.lembagaId) where.lembagaId = input.lembagaId
  const [items, total] = await Promise.all([
    prisma.penugasan.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.penugasan.count({ where }),
  ])
  return { items, total }
}

export async function getPenugasanById(id: string, actor: WkActor) {
  assertCan(actor, 'read')
  const scope = await penugasanScope(actor)
  const item = await prisma.penugasan.findFirst({ where: { id, deletedAt: null, ...scope } })
  if (!item) throw new ApiError('NOT_FOUND', 'Penugasan tidak ditemukan', 404)
  return item
}

// --- Laporan ---
export async function listLaporan(input: {
  page: number
  limit: number
  penugasanId?: string
  periodeMinggu?: number
  periodeTahun?: number
}, actor: WkActor) {
  assertCan(actor, 'read')
  const scope = await laporanScope(actor)
  const where: Prisma.LaporanMingguanWhereInput = { ...scope }
  if (input.penugasanId) where.penugasanId = input.penugasanId
  if (input.periodeMinggu !== undefined) where.periodeMinggu = input.periodeMinggu
  if (input.periodeTahun !== undefined) where.periodeTahun = input.periodeTahun
  const [items, total] = await Promise.all([
    prisma.laporanMingguan.findMany({
      where,
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      include: { detailKitab: true },
    }),
    prisma.laporanMingguan.count({ where }),
  ])
  return { items, total }
}

export async function getLaporanById(id: string, actor: WkActor) {
  assertCan(actor, 'read')
  const scope = await laporanScope(actor)
  const item = await prisma.laporanMingguan.findFirst({ where: { id, ...scope }, include: { detailKitab: true } })
  if (!item) throw new ApiError('NOT_FOUND', 'Laporan tidak ditemukan', 404)
  return item
}

function deriveNamaJabatan(actor: WkActor): { namaPengisi: string; jabatanPengisi: string } {
  if (actor.accountType === 'ORGANIZATIONAL') {
    // identity must be server-derived; fallback to role label if no org profile loaded in actor context
    const orgName = actor.organisasiId ?? actor.userId
    return { namaPengisi: actor.name || orgName, jabatanPengisi: actor.role }
  }
  return { namaPengisi: actor.name || actor.userId, jabatanPengisi: actor.role }
}

export async function submitLaporanRecord(input: {
  penugasanId: string
  periodeMinggu: number
  periodeTahun: number
  jumlahHariHadir: number
  keteranganAbsensi?: string
  jumlahJamaahDilakukan: number
  aktivitasMingguan: string
  kendala?: string
  statusHonor: StatusHonor
  detailKitab?: Array<{ fan: string; namaKitab: string; frekuensiPertemuan: number }>
  // client-provided identity ignored for org accounts; accepted for backward compat but overridden server-side
  namaPengisi?: string
  jabatanPengisi?: string
}, actor: WkActor) {
  if (actor.role !== 'GURU_BANTU' && actor.role !== 'LEMBAGA_EKSTERNAL') {
    throw new ApiError('FORBIDDEN', 'Hanya Guru Bantu atau Lembaga Eksternal yang dapat mengirim laporan', 403)
  }

  const penugasan = await prisma.penugasan.findUnique({
    where: { id: input.penugasanId },
    include: { lembaga: true, guruBantu: true },
  })
  if (!penugasan) throw new ApiError('NOT_FOUND', 'Penugasan tidak ditemukan', 404)

  if (penugasan.lembaga.status !== 'MITRA_AKTIF') {
    const msgs: Record<string, string> = { CALON: 'Lembaga masih calon/belum diverifikasi', NON_AKTIF: 'Lembaga tidak aktif' }
    throw new ApiError('CONFLICT', msgs[penugasan.lembaga.status] || 'Lembaga tidak memenuhi syarat', 409)
  }
  if (actor.role === 'GURU_BANTU' && penugasan.guruBantu.userId !== actor.userId) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki akses ke penugasan ini', 403)
  }
  if (actor.role === 'LEMBAGA_EKSTERNAL' && penugasan.lembaga.userId !== actor.userId) {
    throw new ApiError('FORBIDDEN', 'Anda tidak memiliki akses ke penugasan ini', 403)
  }
  if (penugasan.status !== 'DIAKTIFKAN') {
    throw new ApiError('CONFLICT', `Penugasan tidak aktif (status: ${penugasan.status})`, 409)
  }

  const existing = await prisma.laporanMingguan.findFirst({
    where: { penugasanId: input.penugasanId, pelaporId: actor.userId, periodeMinggu: input.periodeMinggu, periodeTahun: input.periodeTahun },
  })
  if (existing) {
    throw new ApiError('CONFLICT', `Laporan untuk minggu ${input.periodeMinggu}/${input.periodeTahun} sudah pernah dikirim`, 409)
  }

  const identity = deriveNamaJabatan(actor)
  const namaPengisi = actor.accountType === 'ORGANIZATIONAL' ? identity.namaPengisi : (input.namaPengisi || identity.namaPengisi)
  const jabatanPengisi = actor.accountType === 'ORGANIZATIONAL' ? identity.jabatanPengisi : (input.jabatanPengisi || identity.jabatanPengisi)

  const laporan = await prisma.laporanMingguan.create({
    data: {
      penugasanId: input.penugasanId,
      pelaporId: actor.userId,
      rolePelapor: actor.role as Role,
      namaPengisi,
      jabatanPengisi,
      periodeMinggu: input.periodeMinggu,
      periodeTahun: input.periodeTahun,
      jumlahHariHadir: input.jumlahHariHadir,
      keteranganAbsensi: input.keteranganAbsensi,
      jumlahJamaahDilakukan: input.jumlahJamaahDilakukan,
      aktivitasMingguan: input.aktivitasMingguan,
      kendala: input.kendala,
      statusHonor: input.statusHonor,
      detailKitab: input.detailKitab?.length
        ? { create: input.detailKitab.map((d) => ({ fan: d.fan as never, namaKitab: d.namaKitab, frekuensiPertemuan: d.frekuensiPertemuan })) }
        : undefined,
    },
    include: { detailKitab: true },
  })

  await prisma.auditLog.create({
    data: {
      userId: actor.userId,
      action: 'LAPORAN_MINGGUAN_SUBMITTED',
      entity: 'LaporanMingguan',
      entityId: laporan.id,
      metadata: JSON.stringify({ penugasanId: input.penugasanId, periode: `${input.periodeMinggu}/${input.periodeTahun}`, rolePelapor: actor.role }),
      ipAddress: actor.ipAddress,
    },
  })

  return laporan
}

// --- Evaluasi Kasus ---
export async function createEvaluasiKasusRecord(input: {
  penugasanId: string
  judulMasalah: string
  deskripsi: string
  tingkatKeparahan: string
}, actor: WkActor) {
  assertCan(actor, 'create')
  if (actor.role !== 'OWNER' && actor.role !== 'TIM_WAJIB_KHIDMAH') {
    throw new ApiError('FORBIDDEN', 'Hanya Owner atau Tim Wajib Khidmah yang dapat membuat evaluasi kasus', 403)
  }
  const penugasan = await prisma.penugasan.findFirst({ where: { id: input.penugasanId, deletedAt: null } })
  if (!penugasan) throw new ApiError('NOT_FOUND', 'Penugasan tidak ditemukan', 404)

  const evaluasi = await prisma.$transaction(async (tx) => {
    const created = await tx.evaluasiKasus.create({
      data: {
        penugasanId: input.penugasanId,
        judulMasalah: input.judulMasalah,
        deskripsi: input.deskripsi,
        tingkatKeparahan: input.tingkatKeparahan as never,
        statusMediasi: 'MENUNGGU_PUSAT',
      },
    })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'EVALUASI_KASUS_CREATED',
        entity: 'EvaluasiKasus',
        entityId: created.id,
        ipAddress: actor.ipAddress,
      },
    })
    return created
  })
  return evaluasi
}

export async function listEvaluasiKasus(input: { page: number; limit: number; penugasanId?: string }, actor: WkActor) {
  assertCan(actor, 'read')
  const scope = await penugasanScope(actor)
  const where: Prisma.EvaluasiKasusWhereInput = {}
  if (input.penugasanId) where.penugasanId = input.penugasanId
  // enforce penugasan scope for non-global
  if (Object.keys(scope).length > 0) where.penugasan = scope as Prisma.PenugasanWhereInput
  const [items, total] = await Promise.all([
    prisma.evaluasiKasus.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.evaluasiKasus.count({ where }),
  ])
  return { items, total }
}

// --- Evaluasi Induk ---
export async function createEvaluasiIndukRecord(input: {
  penugasanId: string
  lembagaId: string
  catatanEvaluasi: string
  rekomendasi?: string
}, actor: WkActor) {
  assertCan(actor, 'create')
  if (actor.role !== 'OWNER' && actor.role !== 'TIM_WAJIB_KHIDMAH') {
    throw new ApiError('FORBIDDEN', 'Hanya Owner atau Tim Wajib Khidmah yang dapat membuat evaluasi induk', 403)
  }
  const [penugasan, lembaga] = await Promise.all([
    prisma.penugasan.findFirst({ where: { id: input.penugasanId, deletedAt: null } }),
    prisma.lembaga.findUnique({ where: { id: input.lembagaId } }),
  ])
  if (!penugasan) throw new ApiError('NOT_FOUND', 'Penugasan tidak ditemukan', 404)
  if (!lembaga) throw new ApiError('NOT_FOUND', 'Lembaga tidak ditemukan', 404)

  const evaluasi = await prisma.$transaction(async (tx) => {
    const created = await tx.evaluasiInduk.create({
      data: {
        penugasanId: input.penugasanId,
        lembagaId: input.lembagaId,
        evaluatorId: actor.userId,
        initiatedById: actor.userId,
        catatanEvaluasi: input.catatanEvaluasi,
        rekomendasi: input.rekomendasi,
      },
    })
    await tx.auditLog.create({
      data: {
        userId: actor.userId,
        action: 'EVALUASI_INDUK_CREATED',
        entity: 'EvaluasiInduk',
        entityId: created.id,
        ipAddress: actor.ipAddress,
      },
    })
    return created
  })
  return evaluasi
}

export async function listEvaluasiInduk(input: { page: number; limit: number; penugasanId?: string }, actor: WkActor) {
  assertCan(actor, 'read')
  const scope = await penugasanScope(actor)
  const where: Prisma.EvaluasiIndukWhereInput = {}
  if (input.penugasanId) where.penugasanId = input.penugasanId
  if (Object.keys(scope).length > 0) where.penugasan = scope as Prisma.PenugasanWhereInput
  const [items, total] = await Promise.all([
    prisma.evaluasiInduk.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.evaluasiInduk.count({ where }),
  ])
  return { items, total }
}
