import { NextResponse } from 'next/server'
import type { ApiMeta, ApiResponse } from '@/types/api'
import { getOrCreateRequestId } from './request-id'
import { jsonError, jsonOk, jsonValidationError } from './response'
import { withCors, preflight } from './cors'
import { enforceRateLimit, getClientIp } from './rate-limit'
import { authenticateRequest, requireAuth, type ApiPrincipal } from './auth'
import {
  abortIdempotent,
  beginIdempotent,
  completeIdempotent,
  getIdempotencyKey,
} from './idempotency'

export type RouteContext<TParams = Record<string, string>> = {
  params: Promise<TParams>
}

export type ApiHandlerContext<TParams = Record<string, string>> = {
  request: Request
  requestId: string
  params: TParams
  principal: ApiPrincipal | null
}

export type ApiHandlerOptions = {
  auth?: 'required' | 'optional' | 'public'
  rateLimit?: {
    prefix: string
    tokens: number
    window: `${number} s` | `${number} m` | `${number} h`
  }
  idempotent?: boolean
}

function scopeForIdempotency(request: Request, principal: ApiPrincipal | null): string {
  const url = new URL(request.url)
  const actor = principal?.subject.userId ?? principal?.apiKeyId ?? 'anon'
  return `${actor}:${request.method}:${url.pathname}`
}

export function createApiHandler<TParams = Record<string, string>>(
  options: ApiHandlerOptions,
  handler: (ctx: ApiHandlerContext<TParams>) => Promise<Response | NextResponse<ApiResponse<unknown>>>
) {
  return async (request: Request, routeCtx?: RouteContext<TParams>) => {
    const requestId = getOrCreateRequestId(request)

    if (request.method === 'OPTIONS') {
      return preflight(request)
    }

    try {
      // Rate limit
      if (options.rateLimit) {
        const ip = getClientIp(request)
        await enforceRateLimit({ key: ip, ...options.rateLimit })
      }

      // Auth
      let principal: ApiPrincipal | null = null
      if (options.auth === 'required') {
        principal = await requireAuth(request)
      } else if (options.auth === 'optional' || options.auth === 'public') {
        principal = await authenticateRequest(request)
      } else {
        principal = await requireAuth(request)
      }

      // Per-principal rate limit for authenticated requests
      if (principal && options.rateLimit) {
        await enforceRateLimit({
          key: principal.subject.userId,
          prefix: `${options.rateLimit.prefix}:user`,
          tokens: options.rateLimit.tokens,
          window: options.rateLimit.window,
        })
      }

      const params = ((await routeCtx?.params) ?? {}) as TParams

      // Idempotency
      let idemKey: string | null = null
      if (options.idempotent) {
        idemKey = getIdempotencyKey(request)
        if (idemKey) {
          const scope = scopeForIdempotency(request, principal)
          const begun = await beginIdempotent(scope, idemKey)
          if (begun.state === 'replay') {
            const res = NextResponse.json(begun.cached.body as ApiResponse<unknown>, {
              status: begun.cached.status,
              headers: { 'x-request-id': requestId, 'x-idempotent-replay': 'true' },
            })
            return withCors(res, request)
          }
        }
      }

      const response = await handler({ request, requestId, params, principal })

      // Ensure request id header present
      if (!response.headers.get('x-request-id')) {
        response.headers.set('x-request-id', requestId)
      }

      if (idemKey && response.ok) {
        try {
          const clone = response.clone()
          const body = await clone.json()
          const scope = scopeForIdempotency(request, principal)
          await completeIdempotent(scope, idemKey, {
            status: response.status,
            body,
            completedAt: new Date().toISOString(),
          })
        } catch {
          // best-effort: if body not json/cache fails, abort idempotency lock
          const scope = scopeForIdempotency(request, principal)
          await abortIdempotent(scope, idemKey)
        }
      } else if (idemKey && !response.ok) {
        const scope = scopeForIdempotency(request, principal)
        await abortIdempotent(scope, idemKey)
      }

      return withCors(response, request)
    } catch (error) {
      const res = jsonError(error, requestId)
      return withCors(res, request)
    }
  }
}

export { jsonOk, jsonError, jsonValidationError }
export type { ApiMeta }
