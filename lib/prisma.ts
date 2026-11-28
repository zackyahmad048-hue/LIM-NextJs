import { PrismaClient } from '@/generated/client'
import { getTenantContext, runWithTenantContext } from '@/lib/tenant-context'

const SOFT_DELETE_MODELS = new Set(['User', 'Penugasan', 'Letter'])

type QueryArgs = { where?: Record<string, unknown>; [key: string]: unknown }

// Soft-delete filter for tenant entities. Escape hatch: pass explicit `deletedAt`
// in where (e.g. `deletedAt: undefined` to include all, or a specific filter).
// `findUnique` is intentionally unfiltered (Prisma 6 unique-where limitation).
const SOFT_DELETE_OPS = new Set(['findMany', 'findFirst', 'findFirstOrThrow', 'count', 'aggregate', 'groupBy', 'updateMany', 'deleteMany'])

function withSoftDeleteArgs(model: string, args: QueryArgs) {
  if (SOFT_DELETE_MODELS.has(model)) {
    args.where = { deletedAt: null, ...(args.where ?? {}) }
  }
  return args
}

async function withTenantConfig<T>(tx: unknown, fn: () => Promise<T>): Promise<T> {
  const ctx = getTenantContext()
  const t = tx as { $executeRaw: (...args: unknown[]) => Promise<unknown> }
  if (ctx) {
    await t.$executeRaw`SELECT set_config('app.scope', ${ctx.scope}, true)`
    await t.$executeRaw`SELECT set_config('app.unit_id', ${ctx.unitId ?? ''}, true)`
    await t.$executeRaw`SELECT set_config('app.user_id', ${ctx.userId ?? ''}, true)`
  }
  return fn()
}

type InteractiveTxArg = (tx: unknown) => Promise<unknown>

function buildPrisma() {
  const base = new PrismaClient()

  const extended = base.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: { model: string; operation: string; args: QueryArgs; query: (args: QueryArgs) => Promise<unknown> }) {
          const nextArgs = SOFT_DELETE_OPS.has(operation) ? withSoftDeleteArgs(model, args) : args
          const ctx = getTenantContext()
          if (!ctx || ctx.txActive) return query(nextArgs)

          return runWithTenantContext({ ...ctx, txActive: true }, () =>
            originalTx(async (tx: unknown) => withTenantConfig(tx, async () => {
              const key = model.charAt(0).toLowerCase() + model.slice(1)
              const modelClient = (tx as Record<string, Record<string, (a: QueryArgs) => Promise<unknown>>>)[key]
              const op = modelClient?.[operation]
              if (typeof op !== 'function') return query(nextArgs)
              return op(nextArgs)
            }))
          )
        },
      },
    },
  })

  const originalTx = extended.$transaction.bind(extended) as unknown as (
    arg: InteractiveTxArg | unknown[],
    options?: unknown
  ) => Promise<unknown>

  ;(extended as unknown as { $transaction: typeof originalTx }).$transaction = async (
    arg: InteractiveTxArg | unknown[],
    options?: unknown
  ) => {
    if (typeof arg === 'function') {
      const ctx = getTenantContext()
      if (ctx) {
        return runWithTenantContext({ ...ctx, txActive: true }, () =>
          originalTx(async (tx: unknown) => withTenantConfig(tx, () => arg(tx)), options)
        )
      }
    }
    // Batch $transaction([...]) cannot inject set_config safely; avoid in tenant-scoped paths.
    return originalTx(arg, options)
  }

  return extended
}

type PrismaClientSingleton = ReturnType<typeof buildPrisma>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? buildPrisma()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
