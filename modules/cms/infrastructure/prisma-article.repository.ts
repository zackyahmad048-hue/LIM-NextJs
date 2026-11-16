// modules/cms/infrastructure/prisma-article.repository.ts
import { prisma } from '@/lib/prisma'
import type { ArticleStatus } from '@/generated/client'
import type { ArticleRepository, CreateCategoryData, CreateArticleData } from '@/modules/cms/domain/article.repository'

export class PrismaArticleRepository implements ArticleRepository {
  async createCategory(data: CreateCategoryData) {
    return prisma.articleCategory.create({ data })
  }
  async listCategories() {
    return prisma.articleCategory.findMany({ orderBy: { urutan: 'asc' } })
  }
  async createArticle(data: CreateArticleData) {
    return prisma.article.create({ data: { ...data, status: 'DRAFT' } })
  }
  async findById(id: string) {
    return prisma.article.findUnique({ where: { id } })
  }
  async updateStatus(id: string, status: ArticleStatus, extra?: { publishedAt?: Date }) {
    return prisma.article.update({ where: { id }, data: { status, ...extra } })
  }
}