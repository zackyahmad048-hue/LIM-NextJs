// types/api.ts

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'IDEMPOTENCY_REPLAY'

export type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  code?: ApiErrorCode | string
  requestId?: string
}

export type ApiMeta = {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

export type ApiResponse<T> = ActionResult<T> & {
  meta?: ApiMeta
}
