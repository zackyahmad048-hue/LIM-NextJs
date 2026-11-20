// modules/cms/presentation/actions/create-category.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createCategorySchema } from '@/modules/cms/domain/article.schema'
import { createCategoryRecord } from '@/modules/cms/application/cms-operations'
import { ApiError } from '@/lib/api/errors'
import type { ActionResult } from '@/types/api'
import type { ArticleCategory } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function createCategoryAction(formData: FormData): Promise<ActionResult<ArticleCategory>> {
  const raw = Object.fromEntries(formData)
  const parsed = createCategorySchema.safeParse({
    ...raw,
    urutan: raw.urutan ? Number(raw.urutan) : 0,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  try {
    const result = await createCategoryRecord(parsed.data, {
      userId: session.user.id,
      role: session.user.role,
      accountType: session.user.accountType,
      organisasiId: null,
      lembagaId: null,
    })
    revalidatePath('/dashboard/cms/artikel', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createCategoryAction]', error)
    if (error instanceof ApiError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat kategori' }
  }
}