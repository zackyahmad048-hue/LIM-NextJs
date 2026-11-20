import { NextResponse } from 'next/server'
import type { ApiMeta, ApiResponse } from '@/types/api'
import { ApiError, toSafeErrorMessage } from './errors'

export function jsonOk<T>(
  data: T,
  requestId: string,
  init?: { status?: number; meta?: ApiMeta; headers?: HeadersInit; code?: string }
): NextResponse<ApiResponse<T>> {
  const headers = new Headers(init?.headers)
  headers.set('x-request-id', requestId)
  return NextResponse.json(
    {
      success: true,
      data,
      requestId,
      ...(init?.meta ? { meta: init.meta } : {}),
      ...(init?.code ? { code: init.code } : {}),
    },
    { status: init?.status ?? 200, headers }
  )
}

export function jsonError(
  error: unknown,
  requestId: string,
  fallback: { code?: string; status?: number; message?: string } = {}
): NextResponse<ApiResponse<never>> {
  const headers = new Headers()
  headers.set('x-request-id', requestId)

  if (error instanceof ApiError) {
    if (error.status === 429) headers.set('Retry-After', '60')
    return NextResponse.json(
      {
        success: false,
        error: toSafeErrorMessage(error),
        code: error.code,
        requestId,
        ...(error.details ? { errors: error.details } : {}),
      },
      { status: error.status, headers }
    )
  }

  const status = fallback.status ?? 500
  const code = fallback.code ?? 'INTERNAL_ERROR'
  const message = fallback.message ?? toSafeErrorMessage(error)
  if (status >= 500) {
    console.error(`[api][${requestId}]`, error)
  }
  return NextResponse.json(
    { success: false, error: message, code, requestId },
    { status, headers }
  )
}

export function jsonValidationError(
  errors: Record<string, string[]>,
  requestId: string
): NextResponse<ApiResponse<never>> {
  const headers = new Headers({ 'x-request-id': requestId })
  return NextResponse.json(
    {
      success: false,
      error: 'Data tidak valid',
      code: 'VALIDATION_ERROR',
      errors,
      requestId,
    },
    { status: 422, headers }
  )
}
