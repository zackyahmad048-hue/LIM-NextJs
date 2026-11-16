// modules/cms/presentation/actions/publish-article.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { publishArticle, ArticleError } from '@/modules/cms/application/article'
import { PrismaArticleRepository } from '@/modules/cms/infrastructure/prisma-article.repository'
import type { ActionResult } from '@/types/api'
import type { Article } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'CONTENT_MANAGER']

export async function publishArticleAction(formData: FormData): Promise<ActionResult<Article>> {
  const parsed = z.object({ articleId: z.string().trim().min(1) }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaArticleRepository()
    const result = await publishArticle(repo, parsed.data.articleId)
    revalidatePath('/dashboard/cms/artikel', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[publishArticleAction]', error)
    if (error instanceof ArticleError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal mempublikasikan artikel' }
  }
}