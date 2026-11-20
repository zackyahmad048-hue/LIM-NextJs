import { Prisma, type ArticleStatus } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api/errors'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { getCmsActionsForRole } from '@/modules/authorization/domain/matrix'

export type CmsActor = AuthzSubject & { ipAddress?: string }

function assertCan(subject: AuthzSubject, action: 'read' | 'create' | 'update' | 'delete' | 'approve') {
  if (action === 'read') return // public for published; admin for all - enforced at query level
  const allowed = getCmsActionsForRole(subject.role)
  if (!allowed.includes(action)) throw new ApiError('FORBIDDEN', 'Anda tidak memiliki izin untuk aksi ini', 403)
}

export async function listCategories() {
  return prisma.articleCategory.findMany({ orderBy: { urutan: 'asc' } })
}

export async function createCategoryRecord(input: { nama: string; slug: string; urutan: number }, actor: CmsActor) {
  assertCan(actor, 'create')
  return prisma.articleCategory.create({ data: input })
}

export async function listArticles(input: { page: number; limit: number; status?: ArticleStatus; categoryId?: string }, actor?: CmsActor | null) {
  const isAdmin = actor && (actor.role === 'OWNER' || actor.role === 'CONTENT_MANAGER')
  const where: Prisma.ArticleWhereInput = {}
  if (isAdmin) {
    if (input.status) where.status = input.status
  } else {
    where.status = 'PUBLISHED'
  }
  if (input.categoryId) where.categoryId = input.categoryId
  const [items, total] = await Promise.all([
    prisma.article.findMany({ where, skip: (input.page - 1) * input.limit, take: input.limit, orderBy: { createdAt: 'desc' } }),
    prisma.article.count({ where }),
  ])
  return { items, total }
}

export async function getArticleById(id: string, actor?: CmsActor | null) {
  const isAdmin = actor && (actor.role === 'OWNER' || actor.role === 'CONTENT_MANAGER')
  const item = await prisma.article.findFirst({ where: { id, ...(isAdmin ? {} : { status: 'PUBLISHED' }) } })
  if (!item) throw new ApiError('NOT_FOUND', 'Artikel tidak ditemukan', 404)
  return item
}

export async function getArticleBySlug(slug: string) {
  const item = await prisma.article.findFirst({ where: { slug, status: 'PUBLISHED' } })
  if (!item) throw new ApiError('NOT_FOUND', 'Artikel tidak ditemukan', 404)
  return item
}

export async function createArticleRecord(input: { title: string; slug: string; excerpt?: string; content: string; categoryId: string; coverImageUrl?: string }, actor: CmsActor) {
  assertCan(actor, 'create')
  return prisma.article.create({ data: { ...input, authorId: actor.userId, status: 'DRAFT' } })
}

export async function publishArticleRecord(id: string, actor: CmsActor) {
  assertCan(actor, 'approve')
  const a = await prisma.article.findUnique({ where: { id } })
  if (!a) throw new ApiError('NOT_FOUND', 'Artikel tidak ditemukan', 404)
  if (a.status === 'PUBLISHED') throw new ApiError('CONFLICT', 'Artikel sudah dipublikasikan', 409)
  return prisma.$transaction(async (tx) => {
    const updated = await tx.article.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
    await tx.auditLog.create({ data: { userId: actor.userId, action: 'ARTICLE_PUBLISHED', entity: 'Article', entityId: id, ipAddress: actor.ipAddress } })
    return updated
  })
}
