import { z } from 'zod'
import { JenisKonten, StatusKonten } from '@/generated/client'

export const kontenDtoSchema = z.object({
  id: z.string(), judul: z.string(), slug: z.string(), deskripsi: z.string(),
  jenisKonten: z.nativeEnum(JenisKonten), status: z.nativeEnum(StatusKonten),
  thumbnailUrl: z.string().nullable(), linkVideo: z.string().nullable(),
  pengunggahId: z.string(), disetujuiOlehId: z.string().nullable(),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
})
export type KontenDto = z.infer<typeof kontenDtoSchema>

export function toKontenDto(k: { id: string; judul: string; slug: string; deskripsi: string; jenisKonten: JenisKonten; status: StatusKonten; thumbnailUrl: string | null; linkVideo: string | null; pengunggahId: string; disetujuiOlehId: string | null; createdAt: Date; updatedAt: Date }): KontenDto {
  return { id: k.id, judul: k.judul, slug: k.slug, deskripsi: k.deskripsi, jenisKonten: k.jenisKonten, status: k.status, thumbnailUrl: k.thumbnailUrl, linkVideo: k.linkVideo, pengunggahId: k.pengunggahId, disetujuiOlehId: k.disetujuiOlehId, createdAt: k.createdAt.toISOString(), updatedAt: k.updatedAt.toISOString() }
}

export const pendaftaranEventDtoSchema = z.object({
  id: z.string(), kontenId: z.string(), namaPeserta: z.string(), email: z.string(), noHp: z.string(), asalInstansi: z.string().nullable(), createdAt: z.string().datetime(),
})
export type PendaftaranEventDto = z.infer<typeof pendaftaranEventDtoSchema>

export function toPendaftaranDto(p: { id: string; kontenId: string; namaPeserta: string; email: string; noHp: string; asalInstansi: string | null; createdAt: Date }): PendaftaranEventDto {
  return { id: p.id, kontenId: p.kontenId, namaPeserta: p.namaPeserta, email: p.email, noHp: p.noHp, asalInstansi: p.asalInstansi, createdAt: p.createdAt.toISOString() }
}

export const createKontenRequestSchema = z.object({ judul: z.string().trim().min(3).max(200), slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/), deskripsi: z.string().trim().min(10), jenisKonten: z.nativeEnum(JenisKonten), thumbnailUrl: z.string().trim().url().optional(), linkVideo: z.string().trim().url().optional() })
export const registerEventRequestSchema = z.object({ kontenId: z.string().trim().min(1), namaPeserta: z.string().trim().min(2).max(200), email: z.string().trim().email(), noHp: z.string().trim().min(5).max(30), asalInstansi: z.string().trim().max(200).optional() })
export const listKontenQuerySchema = z.object({ page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(20), status: z.nativeEnum(StatusKonten).optional(), jenisKonten: z.nativeEnum(JenisKonten).optional() })
export const idParamSchema = z.object({ id: z.string().trim().min(1) })
