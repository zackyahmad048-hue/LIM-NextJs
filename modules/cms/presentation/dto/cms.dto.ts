import { z } from 'zod'
import { ArticleStatus } from '@/generated/client'

export const articleCategoryDtoSchema = z.object({
  id: z.string(), nama: z.string(), slug: z.string(), urutan: z.number().int(),
})
export type ArticleCategoryDto = z.infer<typeof articleCategoryDtoSchema>

export const articleDtoSchema = z.object({
  id: z.string(), title: z.string(), slug: z.string(), excerpt: z.string().nullable(),
  content: z.string().optional(), coverImageUrl: z.string().nullable(),
  status: z.nativeEnum(ArticleStatus), authorId: z.string(), categoryId: z.string(),
  publishedAt: z.string().datetime().nullable(), createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
})
export type ArticleDto = z.infer<typeof articleDtoSchema>

export const articleSummaryDtoSchema = articleDtoSchema.omit({ content: true })
export type ArticleSummaryDto = z.infer<typeof articleSummaryDtoSchema>

export function toCategoryDto(c: { id: string; nama: string; slug: string; urutan: number }): ArticleCategoryDto {
  return { id: c.id, nama: c.nama, slug: c.slug, urutan: c.urutan }
}

export function toArticleDto(a: { id: string; title: string; slug: string; excerpt: string | null; content: string; coverImageUrl: string | null; status: ArticleStatus; authorId: string; categoryId: string; publishedAt: Date | null; createdAt: Date; updatedAt: Date }, opts?: { includeContent?: boolean }): ArticleDto {
  return {
    id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt,
    content: opts?.includeContent === false ? undefined : a.content,
    coverImageUrl: a.coverImageUrl, status: a.status, authorId: a.authorId, categoryId: a.categoryId,
    publishedAt: a.publishedAt?.toISOString() ?? null, createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
  }
}
export function toArticleSummaryDto(a: Parameters<typeof toArticleDto>[0]) { return toArticleDto(a, { includeContent: false }) }

export const createCategoryRequestSchema = z.object({ nama: z.string().trim().min(2).max(100), slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/), urutan: z.number().int().min(0).default(0) })
export const createArticleRequestSchema = z.object({ title: z.string().trim().min(3).max(200), slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/), excerpt: z.string().trim().max(500).optional(), content: z.string().trim().min(10), categoryId: z.string().trim().min(1), coverImageUrl: z.string().trim().url().optional() })
export const listArticlesQuerySchema = z.object({ page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(20), status: z.nativeEnum(ArticleStatus).optional(), categoryId: z.string().optional() })
export const idParamSchema = z.object({ id: z.string().trim().min(1) })
export const slugParamSchema = z.object({ slug: z.string().trim().min(1) })
