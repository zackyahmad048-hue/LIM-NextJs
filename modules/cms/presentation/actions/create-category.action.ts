// modules/cms/presentation/actions/create-category.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createCategorySchema } from '@/modules/cms/domain/article.schema'
import { createCategory, ArticleError } from '@/modules/cms/application/article'
import { PrismaArticleRepository } from '@/modules/cms/infrastructure/prisma-article.repository'
import type { ActionResult } from '@/types/api'
import type { ArticleCategory } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'CONTENT_MANAGER']

export async function createCategoryAction(formData: FormData): Promise<ActionResult<ArticleCategory>> {
  const raw = Object.fromEntries(formData)
  const parsed = createCategorySchema.safeParse({
    ...raw,
    urutan: raw.urutan ? Number(raw.urutan) : 0,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  try {
    const repo = new PrismaArticleRepository()
    const result = await createCategory(repo, parsed.data)
    revalidatePath('/dashboard/cms/artikel', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createCategoryAction]', error)
    if (error instanceof ArticleError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat kategori' }
  }
}