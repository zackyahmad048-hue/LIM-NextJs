// modules/letter/presentation/queries/list-letters.query.ts
import { prisma } from '@/lib/prisma'
import { letterFilterSchema, type LetterFilter } from '@/modules/letter/domain/letter.schema'

export async function listLetters(filter: Partial<LetterFilter> = {}) {
  const parsed = letterFilterSchema.parse(filter)
  const skip = (parsed.page - 1) * parsed.limit
  const where: Record<string, unknown> = { deletedAt: null }
  if (parsed.status) where.status = parsed.status
  if (parsed.type) where.type = parsed.type
  if (parsed.q) {
    where.OR = [
      { perihal: { contains: parsed.q, mode: 'insensitive' } },
      { nomorSurat: { contains: parsed.q, mode: 'insensitive' } },
    ]
  }
  const [items, total] = await Promise.all([
    prisma.letter.findMany({ where, skip, take: parsed.limit, orderBy: { createdAt: 'desc' } }),
    prisma.letter.count({ where }),
  ])
  return { items, page: parsed.page, limit: parsed.limit, total, totalPages: Math.ceil(total / parsed.limit) }
}