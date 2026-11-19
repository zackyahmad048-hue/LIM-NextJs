// modules/cms/presentation/actions/create-article.action.ts
'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createArticleSchema } from '@/modules/cms/domain/article.schema'
import { createArticle, ArticleError } from '@/modules/cms/application/article'
import { PrismaArticleRepository } from '@/modules/cms/infrastructure/prisma-article.repository'
import type { ActionResult } from '@/types/api'
import type { Article } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'CONTENT_MANAGER']

export async function createArticleAction(formData: FormData): Promise<ActionResult<Article>> {
  const parsed = createArticleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaArticleRepository()
    const result = await createArticle(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/cms/artikel', 'page')
    updateTag('articles')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createArticleAction]', error)
    if (error instanceof ArticleError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat artikel' }
  }
}