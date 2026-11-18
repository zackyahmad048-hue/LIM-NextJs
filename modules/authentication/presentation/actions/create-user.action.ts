// modules/authentication/presentation/actions/create-user.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { createUserSchema } from '@/modules/authentication/domain/user.schema'
import { createUserAccount, UserError } from '@/modules/authentication/application/create-user'
import type { ActionResult } from '@/types/api'
import type { LIMSession } from '@/types/auth'

export async function createUserAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = createUserSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (session.user.role !== 'OWNER') return { success: false, error: 'Forbidden' }

  try {
    const user = await createUserAccount(parsed.data)
    revalidatePath('/dashboard/pengguna', 'page')
    return { success: true, data: user }
  } catch (error) {
    console.error('[createUserAction]', error)
    if (error instanceof UserError) return { success: false, error: error.message }
    return { success: false, error: 'Gagal membuat akun' }
  }
}
