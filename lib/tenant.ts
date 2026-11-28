import { Prisma } from '@/generated/client'
import { prisma } from '@/lib/prisma'
import { runWithTenantContext, type TenantContext } from '@/lib/tenant-context'

export type { TenantContext } from '@/lib/tenant-context'
export { getTenantContext, tenantContextFromSubject, runWithTenantContext } from '@/lib/tenant-context'

type InteractiveTx = (fn: (tx: Prisma.TransactionClient) => Promise<unknown>, options?: unknown) => Promise<unknown>

export async function withTenant<T>(
  ctx: TenantContext,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return runWithTenantContext(ctx, async () => {
    const txFn = prisma.$transaction.bind(prisma) as unknown as InteractiveTx
    return (await txFn(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.scope', ${ctx.scope}, true)`
      await tx.$executeRaw`SELECT set_config('app.unit_id', ${ctx.unitId ?? ''}, true)`
      await tx.$executeRaw`SELECT set_config('app.user_id', ${ctx.userId ?? ''}, true)`
      return fn(tx)
    })) as T
  })
}
