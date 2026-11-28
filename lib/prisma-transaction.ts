import { Prisma } from '@/generated/client'
import { prisma } from '@/lib/prisma'

const P2034 = 'P2034'
const MAX_RETRIES = 3

type InteractiveTx = (fn: (tx: Prisma.TransactionClient) => Promise<unknown>, options?: unknown) => Promise<unknown>

export async function withRetrySerializable<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: { maxRetries?: number; maxWait?: number; timeout?: number }
): Promise<T> {
  const maxRetries = options?.maxRetries ?? MAX_RETRIES
  const tx = prisma.$transaction.bind(prisma) as unknown as InteractiveTx
  for (let attempt = 1; ; attempt++) {
    try {
      return (await tx(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: options?.maxWait ?? 5000,
        timeout: options?.timeout ?? 10000,
      })) as T
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: string }).code
          : undefined
      if (code === P2034 && attempt < maxRetries) continue
      throw error
    }
  }
}
