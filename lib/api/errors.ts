import type { ApiErrorCode } from '@/types/api'

export const ERROR_STATUS: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  IDEMPOTENCY_REPLAY: 200,
}

export class ApiError extends Error {
  code: ApiErrorCode | string
  status: number
  details?: Record<string, string[]>

  constructor(code: ApiErrorCode | string, message: string, status?: number, details?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status ?? ERROR_STATUS[code as ApiErrorCode] ?? 500
    this.details = details
  }
}

export function toSafeErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) {
    // Never leak raw DB/provider details to clients.
    if (/prisma|P\d{4}|database|sql/i.test(error.message)) return 'Terjadi kesalahan internal'
    return error.message || 'Terjadi kesalahan'
  }
  return 'Terjadi kesalahan'
}
