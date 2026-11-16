// modules/cms/domain/article.repository.ts
import type { Article, ArticleCategory, ArticleStatus } from '@/generated/client'

export interface CreateCategoryData { nama: string; slug: string; urutan: number }
export interface CreateArticleData {
  title: string; slug: string; excerpt?: string; content: string
  coverImageUrl?: string; authorId: string; categoryId: string
}

export interface ArticleRepository {
  createCategory(data: CreateCategoryData): Promise<ArticleCategory>
  listCategories(): Promise<ArticleCategory[]>
  createArticle(data: CreateArticleData): Promise<Article>
  findById(id: string): Promise<Article | null>
  updateStatus(id: string, status: ArticleStatus, extra?: { publishedAt?: Date }): Promise<Article>
}