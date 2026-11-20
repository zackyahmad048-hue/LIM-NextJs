import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { ApiError } from './errors'

type LimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  redis = new Redis({ url, token })
  return redis
}

const limiters = new Map<string, Ratelimit>()

function getLimiter(prefix: string, tokens: number, window: `${number} s` | `${number} m` | `${number} h`): Ratelimit | null {
  const r = getRedis()
  if (!r) return null
  const key = `${prefix}:${tokens}:${window}`
  const existing = limiters.get(key)
  if (existing) return existing
  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `lim:rl:${prefix}`,
    analytics: false,
  })
  limiters.set(key, limiter)
  return limiter
}

export async function enforceRateLimit(opts: {
  key: string
  prefix: string
  tokens: number
  window: `${number} s` | `${number} m` | `${number} h`
}): Promise<LimitResult | null> {
  const limiter = getLimiter(opts.prefix, opts.tokens, opts.window)
  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      throw new ApiError('INTERNAL_ERROR', 'Rate limiter tidak tersedia', 503)
    }
    return null
  }
  const result = await limiter.limit(opts.key)
  if (!result.success) {
    throw new ApiError('RATE_LIMITED', 'Terlalu banyak permintaan, coba lagi nanti', 429)
  }
  return result
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}
