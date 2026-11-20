export function createRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateRequestId(request: Request): string {
  const existing = request.headers.get('x-request-id')?.trim()
  return existing && existing.length <= 128 ? existing : createRequestId()
}
