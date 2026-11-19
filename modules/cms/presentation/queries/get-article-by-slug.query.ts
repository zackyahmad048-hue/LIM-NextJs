import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

// Publik: hanya artikel PUBLISHED. Di-cache dan diinvalidasi lewat tag 'articles'.
export async function getPublishedArticleBySlug(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('articles')

  return prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: { id: true, title: true, slug: true, excerpt: true, content: true, coverImageUrl: true, publishedAt: true, authorId: true },
  })
}
