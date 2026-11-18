import { prisma } from '@/lib/prisma'

// Publik: hanya artikel PUBLISHED
export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: { id: true, title: true, slug: true, excerpt: true, content: true, coverImageUrl: true, publishedAt: true, authorId: true },
  })
}
