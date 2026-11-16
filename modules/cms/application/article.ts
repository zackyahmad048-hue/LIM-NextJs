// modules/cms/application/article.ts
import type { ArticleRepository, CreateCategoryData, CreateArticleData } from '@/modules/cms/domain/article.repository'
import type { CreateCategoryInput, CreateArticleInput } from '@/modules/cms/domain/article.schema'

export class ArticleError extends Error {
  constructor(message: string) { super(message); this.name = 'ArticleError' }
}

export async function createCategory(repo: ArticleRepository, input: CreateCategoryInput) {
  const data: CreateCategoryData = { ...input }
  return repo.createCategory(data)
}

export async function createArticle(repo: ArticleRepository, input: CreateArticleInput, authorId: string) {
  const data: CreateArticleData = { ...input, authorId }
  return repo.createArticle(data)
}

export async function publishArticle(repo: ArticleRepository, id: string) {
  const a = await repo.findById(id)
  if (!a) throw new ArticleError('Artikel tidak ditemukan')
  if (a.status === 'PUBLISHED') throw new ArticleError('Artikel sudah dipublikasikan')
  return repo.updateStatus(id, 'PUBLISHED', { publishedAt: new Date() })
}