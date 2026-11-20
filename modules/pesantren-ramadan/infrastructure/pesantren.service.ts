import { Prisma, type KondisiKelas } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { getPesantrenActionsForRole } from '@/modules/authorization/domain/matrix'

export type PesantrenActor = AuthzSubject & { ipAddress?: string }

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'approve') {
  const allowed = getPesantrenActionsForRole(subject.role)
  if (!allowed.includes(action)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
}

export async function listSekolah(input: { page: number; limit: number }) {
  const [items, total] = await Promise.all([
    prisma.sekolahMitra.findMany({ skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.sekolahMitra.count(),
  ])
  return { items, total }
}
export async function createSekolahRecord(input: { namaSekolah: string; jenjang: string; alamat: string; picNama: string; picNoHp: string; picJabatan?: string }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'].includes(actor.role)) throw new ApiError('FORBIDDEN', 'Tidak diizinkan', 403)
  return prisma.sekolahMitra.create({ data: { ...input, jenjang: input.jenjang as never } })
}

export async function listMateri(input: { page: number; limit: number; targetJenjang?: string }) {
  const where: Prisma.BankMateriWhereInput = input.targetJenjang ? { targetJenjang: input.targetJenjang as never } : {}
  const [items, total] = await Promise.all([
    prisma.bankMateri.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.bankMateri.count({ where }),
  ])
  return { items, total }
}
export async function createMateriRecord(input: { judulMateri: string; deskripsi: string; targetJenjang: string; durasiMenit: number }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN'].includes(actor.role)) throw new ApiError('FORBIDDEN', 'Hanya OWNER/ADMIN_BIDANG_PESANTREN_RAMADAN', 403)
  return prisma.bankMateri.create({ data: { ...input, targetJenjang: input.targetJenjang as never } })
}

export async function listPenugasanPesantren(input: { page: number; limit: number; sekolahId?: string }, actor: PesantrenActor) {
  assertCan(actor, 'read')
  const where: Prisma.PenugasanPesantrenWhereInput = {}
  if (input.sekolahId) where.sekolahId = input.sekolahId
  if (actor.role === 'PENGAJAR_PESANTREN_RAMADAN') where.pengajarId = actor.userId
  const [items, total] = await Promise.all([
    prisma.penugasanPesantren.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.penugasanPesantren.count({ where }),
  ])
  return { items, total }
}
export async function createPenugasanPesantrenRecord(input: { sekolahId: string; pengajarId: string; koordinatorId: string; tanggalMulai: string | Date; tanggalSelesai: string | Date }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'].includes(actor.role)) throw new ApiError('FORBIDDEN', 'Tidak diizinkan', 403)
  return prisma.penugasanPesantren.create({ data: { sekolahId: input.sekolahId, pengajarId: input.pengajarId, koordinatorId: input.koordinatorId, tanggalMulai: new Date(input.tanggalMulai), tanggalSelesai: new Date(input.tanggalSelesai) } })
}

export async function listLaporanPengajar(input: { page: number; limit: number; penugasanId?: string }, actor: PesantrenActor) {
  assertCan(actor, 'read')
  const where: Prisma.LaporanHarianPengajarWhereInput = {}
  if (input.penugasanId) where.penugasanId = input.penugasanId
  if (actor.role === 'PENGAJAR_PESANTREN_RAMADAN') where.penugasan = { pengajarId: actor.userId }
  const [items, total] = await Promise.all([
    prisma.laporanHarianPengajar.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { tanggal: 'desc' } }),
    prisma.laporanHarianPengajar.count({ where }),
  ])
  return { items, total }
}
export async function createLaporanPengajarRecord(input: { penugasanId: string; tanggal: string | Date; kelas: string; jumlahSiswaL: number; jumlahSiswaP: number; materiId: string; pertanyaanPeserta?: string; kondisiKelas: KondisiKelas; praktikDilakukan: boolean; catatanTambahan?: string }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (actor.role !== 'PENGAJAR_PESANTREN_RAMADAN') throw new ApiError('FORBIDDEN', 'Hanya pengajar yang dapat membuat laporan harian', 403)
  const penugasan = await prisma.penugasanPesantren.findUnique({ where: { id: input.penugasanId } })
  if (!penugasan) throw new ApiError('NOT_FOUND', 'Penugasan tidak ditemukan', 404)
  if (penugasan.pengajarId !== actor.userId) throw new ApiError('FORBIDDEN', 'Bukan penugasan Anda', 403)
  return prisma.laporanHarianPengajar.create({ data: { penugasanId: input.penugasanId, tanggal: new Date(input.tanggal), kelas: input.kelas, jumlahSiswaL: input.jumlahSiswaL, jumlahSiswaP: input.jumlahSiswaP, materiId: input.materiId, pertanyaanPeserta: input.pertanyaanPeserta, kondisiKelas: input.kondisiKelas, praktikDilakukan: input.praktikDilakukan, catatanTambahan: input.catatanTambahan } })
}

export async function listLaporanKoordinator(input: { page: number; limit: number; penugasanId?: string }, actor: PesantrenActor) {
  assertCan(actor, 'read')
  const where: Prisma.LaporanHarianKoordinatorWhereInput = {}
  if (input.penugasanId) where.penugasanId = input.penugasanId
  const [items, total] = await Promise.all([
    prisma.laporanHarianKoordinator.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { tanggal: 'desc' } }),
    prisma.laporanHarianKoordinator.count({ where }),
  ])
  return { items, total }
}
export async function createLaporanKoordinatorRecord(input: { penugasanId: string; tanggal: string | Date; pengajarHadir: boolean; kesiapanSarana?: string; catatanUmum?: string }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'].includes(actor.role)) throw new ApiError('FORBIDDEN', 'Tidak diizinkan', 403)
  const penugasan = await prisma.penugasanPesantren.findUnique({ where: { id: input.penugasanId } })
  if (!penugasan) throw new ApiError('NOT_FOUND', 'Penugasan tidak ditemukan', 404)
  if (penugasan.koordinatorId !== actor.userId && actor.role !== 'OWNER' && actor.role !== 'ADMIN_BIDANG_PESANTREN_RAMADAN') {
    // PW/PC can manage in scope per RBAC; shortcut: require koordinator match for non-admin
    throw new ApiError('FORBIDDEN', 'Bukan koordinator penugasan ini', 403)
  }
  return prisma.laporanHarianKoordinator.create({ data: { penugasanId: input.penugasanId, tanggal: new Date(input.tanggal), pengajarHadir: input.pengajarHadir, kesiapanSarana: input.kesiapanSarana, catatanUmum: input.catatanUmum } })
}

export async function listUmpanBalikPusat(input: { page: number; limit: number; penugasanId?: string }, actor: PesantrenActor) {
  assertCan(actor, 'read')
  const where: Prisma.UmpanBalikPusatWhereInput = {}
  if (input.penugasanId) where.penugasanId = input.penugasanId
  const [items, total] = await Promise.all([
    prisma.umpanBalikPusat.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.umpanBalikPusat.count({ where }),
  ])
  return { items, total }
}
export async function createUmpanBalikPusatRecord(input: { penugasanId: string; tanggalKunjungan: string | Date; kondisiSarana: string; relevansiMateri: string; kesesuaianKesepakatan: string; rekomendasi?: string }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN'].includes(actor.role)) throw new ApiError('FORBIDDEN', 'Hanya OWNER/ADMIN_BIDANG_PESANTREN_RAMADAN', 403)
  return prisma.umpanBalikPusat.create({ data: { penugasanId: input.penugasanId, penilaiId: actor.userId, tanggalKunjungan: new Date(input.tanggalKunjungan), kondisiSarana: input.kondisiSarana, relevansiMateri: input.relevansiMateri, kesesuaianKesepakatan: input.kesesuaianKesepakatan, rekomendasi: input.rekomendasi } })
}

export async function listUmpanBalikPeserta(input: { page: number; limit: number; penugasanId?: string }, actor: PesantrenActor) {
  assertCan(actor, 'read')
  const where: Prisma.UmpanBalikPesertaWhereInput = {}
  if (input.penugasanId) where.penugasanId = input.penugasanId
  const [items, total] = await Promise.all([
    prisma.umpanBalikPeserta.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.umpanBalikPeserta.count({ where }),
  ])
  return { items, total }
}
export async function createUmpanBalikPesertaRecord(input: { penugasanId: string; jumlahResponden: number; ratingKepuasan: number; komentarPositif?: string; komentarPerbaikan?: string }, actor: PesantrenActor) {
  assertCan(actor, 'create')
  if (!['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'].includes(actor.role)) throw new ApiError('FORBIDDEN', 'Tidak diizinkan', 403)
  return prisma.umpanBalikPeserta.create({ data: input })
}
