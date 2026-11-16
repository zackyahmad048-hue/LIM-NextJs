// modules/cms/domain/article.schema.ts
import { z } from 'zod'

export const createCategorySchema = z.object({
  nama: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
  urutan: z.coerce.number().int().min(0).default(0),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().trim().max(500).optional().or(z.literal('').transform(() => undefined)),
  content: z.string().trim().min(10),
  categoryId: z.string().trim().min(1),
  coverImageUrl: z.string().trim().url().optional().or(z.literal('').transform(() => undefined)),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>