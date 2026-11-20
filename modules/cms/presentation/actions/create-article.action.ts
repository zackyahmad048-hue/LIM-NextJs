// modules/cms/presentation/actions/create-article.action.ts
'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createArticleSchema } from '@/modules/cms/domain/article.schema'
import { createArticleRecord } from '@/modules/cms/application/cms-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { Article } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createArticleAction(formData: FormData): Promise<ActionResult<Article>> {
  const parsed = createArticleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createArticleRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/cms/artikel', 'page')
    updateTag('articles')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createArticleAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat artikel' }
  }
}