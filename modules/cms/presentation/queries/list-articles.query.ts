import { prisma } from '@/lib/prisma'
export async function listArticles(filter?: { status?: string; categoryId?: string }) {
  const where: Record<string, unknown> = {}
  if (filter?.status) where.status = filter.status
  if (filter?.categoryId) where.categoryId = filter.categoryId
  return prisma.article.findMany({ where, orderBy: { createdAt: 'desc' } })
}
export async function listArticleCategories() {
  return prisma.articleCategory.findMany({ orderBy: { urutan: 'asc' } })
}