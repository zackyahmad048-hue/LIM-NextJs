// modules/authentication/application/get-current-user.ts
import { getSession } from '@/lib/auth'
import type { LIMSession } from '@/types/auth'

export async function getCurrentSession(): Promise<LIMSession | null> {
  return (await getSession()) as LIMSession | null
}