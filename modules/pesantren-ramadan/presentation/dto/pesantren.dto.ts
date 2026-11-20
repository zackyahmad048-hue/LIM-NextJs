import { z } from 'zod'
import { JenjangSekolah, StatusPenugasanPesantren, KondisiKelas } from '@/generated/client'

export const sekolahMitraDtoSchema = z.object({
  id: z.string(), namaSekolah: z.string(), jenjang: z.nativeEnum(JenjangSekolah), alamat: z.string(),
  picNama: z.string(), picNoHp: z.string(), picJabatan: z.string().nullable(),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
})
export type SekolahMitraDto = z.infer<typeof sekolahMitraDtoSchema>
export function toSekolahDto(s: { id: string; namaSekolah: string; jenjang: JenjangSekolah; alamat: string; picNama: string; picNoHp: string; picJabatan: string | null; createdAt: Date; updatedAt: Date }): SekolahMitraDto {
  return { id: s.id, namaSekolah: s.namaSekolah, jenjang: s.jenjang, alamat: s.alamat, picNama: s.picNama, picNoHp: s.picNoHp, picJabatan: s.picJabatan, createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString() }
}

export const bankMateriDtoSchema = z.object({
  id: z.string(), judulMateri: z.string(), deskripsi: z.string(), targetJenjang: z.nativeEnum(JenjangSekolah), durasiMenit: z.number().int(),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
})
export type BankMateriDto = z.infer<typeof bankMateriDtoSchema>
export function toBankMateriDto(m: { id: string; judulMateri: string; deskripsi: string; targetJenjang: JenjangSekolah; durasiMenit: number; createdAt: Date; updatedAt: Date }): BankMateriDto {
  return { id: m.id, judulMateri: m.judulMateri, deskripsi: m.deskripsi, targetJenjang: m.targetJenjang, durasiMenit: m.durasiMenit, createdAt: m.createdAt.toISOString(), updatedAt: m.updatedAt.toISOString() }
}

export const penugasanPesantrenDtoSchema = z.object({
  id: z.string(), sekolahId: z.string(), pengajarId: z.string(), koordinatorId: z.string(),
  tanggalMulai: z.string().datetime(), tanggalSelesai: z.string().datetime(), status: z.nativeEnum(StatusPenugasanPesantren),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
})
export type PenugasanPesantrenDto = z.infer<typeof penugasanPesantrenDtoSchema>
export function toPenugasanPesantrenDto(p: { id: string; sekolahId: string; pengajarId: string; koordinatorId: string; tanggalMulai: Date; tanggalSelesai: Date; status: StatusPenugasanPesantren; createdAt: Date; updatedAt: Date }): PenugasanPesantrenDto {
  return { id: p.id, sekolahId: p.sekolahId, pengajarId: p.pengajarId, koordinatorId: p.koordinatorId, tanggalMulai: p.tanggalMulai.toISOString(), tanggalSelesai: p.tanggalSelesai.toISOString(), status: p.status, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
}

export const laporanPengajarDtoSchema = z.object({
  id: z.string(), penugasanId: z.string(), tanggal: z.string().datetime(), kelas: z.string(),
  jumlahSiswaL: z.number().int(), jumlahSiswaP: z.number().int(), materiId: z.string(),
  pertanyaanPeserta: z.string().nullable(), kondisiKelas: z.nativeEnum(KondisiKelas),
  praktikDilakukan: z.boolean(), catatanTambahan: z.string().nullable(), createdAt: z.string().datetime(),
})
export type LaporanPengajarDto = z.infer<typeof laporanPengajarDtoSchema>
export function toLaporanPengajarDto(l: { id: string; penugasanId: string; tanggal: Date; kelas: string; jumlahSiswaL: number; jumlahSiswaP: number; materiId: string; pertanyaanPeserta: string | null; kondisiKelas: KondisiKelas; praktikDilakukan: boolean; catatanTambahan: string | null; createdAt: Date }): LaporanPengajarDto {
  return { id: l.id, penugasanId: l.penugasanId, tanggal: l.tanggal.toISOString(), kelas: l.kelas, jumlahSiswaL: l.jumlahSiswaL, jumlahSiswaP: l.jumlahSiswaP, materiId: l.materiId, pertanyaanPeserta: l.pertanyaanPeserta, kondisiKelas: l.kondisiKelas, praktikDilakukan: l.praktikDilakukan, catatanTambahan: l.catatanTambahan, createdAt: l.createdAt.toISOString() }
}

export const laporanKoordinatorDtoSchema = z.object({
  id: z.string(), penugasanId: z.string(), tanggal: z.string().datetime(), pengajarHadir: z.boolean(),
  kesiapanSarana: z.string().nullable(), catatanUmum: z.string().nullable(), createdAt: z.string().datetime(),
})
export type LaporanKoordinatorDto = z.infer<typeof laporanKoordinatorDtoSchema>
export function toLaporanKoordinatorDto(l: { id: string; penugasanId: string; tanggal: Date; pengajarHadir: boolean; kesiapanSarana: string | null; catatanUmum: string | null; createdAt: Date }): LaporanKoordinatorDto {
  return { id: l.id, penugasanId: l.penugasanId, tanggal: l.tanggal.toISOString(), pengajarHadir: l.pengajarHadir, kesiapanSarana: l.kesiapanSarana, catatanUmum: l.catatanUmum, createdAt: l.createdAt.toISOString() }
}

export const umpanBalikPusatDtoSchema = z.object({
  id: z.string(), penugasanId: z.string(), penilaiId: z.string(), tanggalKunjungan: z.string().datetime(),
  kondisiSarana: z.string(), relevansiMateri: z.string(), kesesuaianKesepakatan: z.string(), rekomendasi: z.string().nullable(), createdAt: z.string().datetime(),
})
export type UmpanBalikPusatDto = z.infer<typeof umpanBalikPusatDtoSchema>
export function toUmpanBalikPusatDto(u: { id: string; penugasanId: string; penilaiId: string; tanggalKunjungan: Date; kondisiSarana: string; relevansiMateri: string; kesesuaianKesepakatan: string; rekomendasi: string | null; createdAt: Date }): UmpanBalikPusatDto {
  return { id: u.id, penugasanId: u.penugasanId, penilaiId: u.penilaiId, tanggalKunjungan: u.tanggalKunjungan.toISOString(), kondisiSarana: u.kondisiSarana, relevansiMateri: u.relevansiMateri, kesesuaianKesepakatan: u.kesesuaianKesepakatan, rekomendasi: u.rekomendasi, createdAt: u.createdAt.toISOString() }
}

export const umpanBalikPesertaDtoSchema = z.object({
  id: z.string(), penugasanId: z.string(), jumlahResponden: z.number().int(), ratingKepuasan: z.number(),
  komentarPositif: z.string().nullable(), komentarPerbaikan: z.string().nullable(), createdAt: z.string().datetime(),
})
export type UmpanBalikPesertaDto = z.infer<typeof umpanBalikPesertaDtoSchema>
export function toUmpanBalikPesertaDto(u: { id: string; penugasanId: string; jumlahResponden: number; ratingKepuasan: number; komentarPositif: string | null; komentarPerbaikan: string | null; createdAt: Date }): UmpanBalikPesertaDto {
  return { id: u.id, penugasanId: u.penugasanId, jumlahResponden: u.jumlahResponden, ratingKepuasan: u.ratingKepuasan, komentarPositif: u.komentarPositif, komentarPerbaikan: u.komentarPerbaikan, createdAt: u.createdAt.toISOString() }
}

// Requests
export const createSekolahRequestSchema = z.object({ namaSekolah: z.string().trim().min(3).max(200), jenjang: z.nativeEnum(JenjangSekolah), alamat: z.string().trim().min(5), picNama: z.string().trim().min(2).max(100), picNoHp: z.string().trim().min(5).max(30), picJabatan: z.string().trim().max(100).optional() })
export const createBankMateriRequestSchema = z.object({ judulMateri: z.string().trim().min(3).max(200), deskripsi: z.string().trim().min(5), targetJenjang: z.nativeEnum(JenjangSekolah), durasiMenit: z.number().int().positive().max(600) })
export const createPenugasanPesantrenRequestSchema = z.object({ sekolahId: z.string().trim().min(1), pengajarId: z.string().trim().min(1), koordinatorId: z.string().trim().min(1), tanggalMulai: z.string().datetime().or(z.string().min(1)), tanggalSelesai: z.string().datetime().or(z.string().min(1)) })
export const createLaporanPengajarRequestSchema = z.object({ penugasanId: z.string().trim().min(1), tanggal: z.string().datetime().or(z.string().min(1)), kelas: z.string().trim().min(1).max(100), jumlahSiswaL: z.number().int().min(0), jumlahSiswaP: z.number().int().min(0), materiId: z.string().trim().min(1), pertanyaanPeserta: z.string().trim().max(2000).optional(), kondisiKelas: z.nativeEnum(KondisiKelas), praktikDilakukan: z.boolean().default(false), catatanTambahan: z.string().trim().max(2000).optional() })
export const createLaporanKoordinatorRequestSchema = z.object({ penugasanId: z.string().trim().min(1), tanggal: z.string().datetime().or(z.string().min(1)), pengajarHadir: z.boolean(), kesiapanSarana: z.string().trim().max(2000).optional(), catatanUmum: z.string().trim().max(2000).optional() })
export const createUmpanBalikPusatRequestSchema = z.object({ penugasanId: z.string().trim().min(1), tanggalKunjungan: z.string().datetime().or(z.string().min(1)), kondisiSarana: z.string().trim().min(5), relevansiMateri: z.string().trim().min(5), kesesuaianKesepakatan: z.string().trim().min(5), rekomendasi: z.string().trim().max(2000).optional() })
export const createUmpanBalikPesertaRequestSchema = z.object({ penugasanId: z.string().trim().min(1), jumlahResponden: z.number().int().positive(), ratingKepuasan: z.number().min(0).max(5), komentarPositif: z.string().trim().max(2000).optional(), komentarPerbaikan: z.string().trim().max(2000).optional() })
export const listQuerySchema = z.object({ page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(20), penugasanId: z.string().optional(), sekolahId: z.string().optional(), targetJenjang: z.nativeEnum(JenjangSekolah).optional() })
