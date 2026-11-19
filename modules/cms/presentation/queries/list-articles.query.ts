import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

// Kolom content (Text) tidak pernah dikirim ke daftar — hanya ke halaman detail artikel.
const listFields = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  status: true,
  publishedAt: true,
  createdAt: true,
} as const

export async function listArticles(filter?: { status?: string; categoryId?: string; take?: number }) {
  const where: Record<string, unknown> = {}
  if (filter?.status) where.status = filter.status
  if (filter?.categoryId) where.categoryId = filter.categoryId
  return prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: listFields,
    ...(filter?.take ? { take: filter.take } : {}),
  })
}

// Publik: di-cache lintas pengunjung (Cache Components) dan diinvalidasi lewat tag 'articles'
// oleh Server Action CMS (create/publish).
export async function listPublishedArticles(take?: number) {
  'use cache'
  cacheLife('hours')
  cacheTag('articles')
  return listArticles({ status: 'PUBLISHED', take })
}

export async function listArticleCategories() {
  return prisma.articleCategory.findMany({ orderBy: { urutan: 'asc' } })
}
