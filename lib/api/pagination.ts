import { z } from 'zod'
import type { ApiMeta } from '@/types/api'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export function parsePagination(searchParams: URLSearchParams): { page: number; limit: number } {
  const parsed = paginationSchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  })
  if (!parsed.success) return { page: 1, limit: 20 }
  return parsed.data
}

export function buildMeta(page: number, limit: number, total: number): ApiMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

export function toSkipTake(page: number, limit: number): { skip: number; take: number } {
  return { skip: (page - 1) * limit, take: limit }
}

export function buildCursorMeta<T extends { id: string }>(items: T[], limit: number) {
  const hasMore = items.length > limit
  const data = hasMore ? items.slice(0, limit) : items
  return {
    data,
    meta: {
      limit,
      hasMore,
      nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null,
    },
  }
}
