import { AsyncLocalStorage } from 'node:async_hooks'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'

export type TenantContext = {
  scope: 'PUSAT' | 'UNIT' | 'LEMBAGA' | 'SELF' | 'PUBLIC'
  unitId: string | null
  userId: string | null
  txActive?: boolean
}

const tenantAls = new AsyncLocalStorage<TenantContext>()

export function getTenantContext(): TenantContext | null {
  return tenantAls.getStore() ?? null
}

export function tenantContextFromSubject(subject: AuthzSubject | null): TenantContext {
  if (!subject) return { scope: 'PUBLIC', unitId: null, userId: null }
  return {
    scope: subject.scope ?? 'SELF',
    unitId: subject.unitId ?? subject.organisasiId ?? null,
    userId: subject.userId,
  }
}

export async function runWithTenantContext<T>(ctx: TenantContext, fn: () => Promise<T>): Promise<T> {
  return tenantAls.run(ctx, fn)
}
