import { redis } from '@/lib/redis'
import { ApiError } from './errors'

const IN_PROGRESS_TTL = 60 // seconds
const RESULT_TTL = 60 * 60 * 24 // 24 hours

type CachedResponse = {
  status: number
  body: unknown
  completedAt: string
}

function keyFor(scope: string, idempotencyKey: string): string {
  return `lim:idem:${scope}:${idempotencyKey}`
}

export function getIdempotencyKey(request: Request): string | null {
  const v = request.headers.get('idempotency-key')?.trim()
  if (!v) return null
  if (v.length < 8 || v.length > 128) {
    throw new ApiError('BAD_REQUEST', 'Idempotency-Key tidak valid', 400)
  }
  return v
}

export async function beginIdempotent(scope: string, idempotencyKey: string): Promise<
  | { state: 'new' }
  | { state: 'replay'; cached: CachedResponse }
> {
  const k = keyFor(scope, idempotencyKey)
  const existing = await redis.get<CachedResponse | 'in-progress'>(k)
  if (existing === 'in-progress') {
    throw new ApiError('CONFLICT', 'Permintaan dengan Idempotency-Key ini sedang diproses', 409)
  }
  if (existing && typeof existing === 'object') {
    return { state: 'replay', cached: existing }
  }
  const set = await redis.set(k, 'in-progress', { nx: true, ex: IN_PROGRESS_TTL })
  if (set !== 'OK') {
    const again = await redis.get<CachedResponse | 'in-progress'>(k)
    if (again && typeof again === 'object') return { state: 'replay', cached: again as CachedResponse }
    throw new ApiError('CONFLICT', 'Permintaan dengan Idempotency-Key ini sedang diproses', 409)
  }
  return { state: 'new' }
}

export async function completeIdempotent(scope: string, idempotencyKey: string, cached: CachedResponse): Promise<void> {
  const k = keyFor(scope, idempotencyKey)
  await redis.set(k, cached, { ex: RESULT_TTL })
}

export async function abortIdempotent(scope: string, idempotencyKey: string): Promise<void> {
  const k = keyFor(scope, idempotencyKey)
  await redis.del(k)
}
