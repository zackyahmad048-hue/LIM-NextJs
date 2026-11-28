import { z } from 'zod'
import { LetterAction, LetterStatus, LetterType } from '@/generated/client'

export const letterTypeSchema = z.nativeEnum(LetterType)
export const letterStatusSchema = z.nativeEnum(LetterStatus)
export const letterActionSchema = z.nativeEnum(LetterAction)

export const letterDtoSchema = z.object({
  id: z.string(),
  type: letterTypeSchema,
  nomorSurat: z.string().nullable(),
  tanggalSurat: z.string().datetime(),
  pengirim: z.string(),
  penerima: z.string().nullable(),
  perihal: z.string(),
  isiSurat: z.string().nullable().optional(),
  fileUrl: z.string().nullable(),
  qrCodeUrl: z.string().nullable(),
  verificationSlug: z.string().nullable(),
  status: letterStatusSchema,
  createdById: z.string(),
  periodId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type LetterDto = z.infer<typeof letterDtoSchema>

export const letterSummaryDtoSchema = letterDtoSchema.omit({ isiSurat: true })
export type LetterSummaryDto = z.infer<typeof letterSummaryDtoSchema>

export const letterLogDtoSchema = z.object({
  id: z.string(),
  letterId: z.string(),
  action: letterActionSchema,
  userId: z.string(),
  notes: z.string().nullable(),
  timestamp: z.string().datetime(),
})
export type LetterLogDto = z.infer<typeof letterLogDtoSchema>

export const createLetterRequestSchema = z.object({
  type: letterTypeSchema.default('KELUAR'),
  pengirim: z.string().trim().min(2).max(200),
  penerima: z.string().trim().max(200).optional().nullable(),
  perihal: z.string().trim().min(3).max(500),
  isiSurat: z.string().trim().min(10),
})

export const updateLetterRequestSchema = z.object({
  pengirim: z.string().trim().min(2).max(200).optional(),
  penerima: z.string().trim().max(200).optional().nullable(),
  perihal: z.string().trim().min(3).max(500).optional(),
  isiSurat: z.string().trim().min(10).optional(),
  fileUrl: z.string().url().optional().nullable(),
})

export const letterIdParamSchema = z.object({ id: z.string().trim().min(1) })

export function toLetterDto(letter: {
  id: string
  type: LetterType
  nomorSurat: string | null
  tanggalSurat: Date
  pengirim: string
  penerima: string | null
  perihal: string
  isiSurat: string
  fileUrl: string | null
  qrCodeUrl: string | null
  verificationSlug: string | null
  status: LetterStatus
  createdById: string
  periodId: string | null
  createdAt: Date
  updatedAt: Date
}, options?: { includeIsi?: boolean }): LetterDto {
  return {
    id: letter.id,
    type: letter.type,
    nomorSurat: letter.nomorSurat,
    tanggalSurat: letter.tanggalSurat.toISOString(),
    pengirim: letter.pengirim,
    penerima: letter.penerima,
    perihal: letter.perihal,
    isiSurat: options?.includeIsi === false ? undefined : letter.isiSurat,
    fileUrl: letter.fileUrl,
    qrCodeUrl: letter.qrCodeUrl,
    verificationSlug: letter.verificationSlug,
    status: letter.status,
    createdById: letter.createdById,
    periodId: letter.periodId,
    createdAt: letter.createdAt.toISOString(),
    updatedAt: letter.updatedAt.toISOString(),
  }
}

export function toLetterSummaryDto(letter: Parameters<typeof toLetterDto>[0]) {
  return toLetterDto(letter, { includeIsi: false })
}

export function toLetterLogDto(log: {
  id: string
  letterId: string
  action: LetterAction
  userId: string
  notes: string | null
  timestamp: Date
}): LetterLogDto {
  return {
    id: log.id,
    letterId: log.letterId,
    action: log.action,
    userId: log.userId,
    notes: log.notes,
    timestamp: log.timestamp.toISOString(),
  }
}
