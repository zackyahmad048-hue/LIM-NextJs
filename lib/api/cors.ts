const DEFAULT_ALLOWED = ['http://localhost:3000']

function parseAllowedOrigins(): string[] {
  const raw = process.env.API_ALLOWED_ORIGINS
  if (!raw) return DEFAULT_ALLOWED
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  const allowed = parseAllowedOrigins()
  return allowed.includes(origin)
}

export function corsHeaders(request: Request): Headers {
  const origin = request.headers.get('origin')
  const headers = new Headers()
  headers.set('Vary', 'Origin')

  if (origin && isOriginAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Credentials', 'true')
  }

  headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-API-Key, X-Request-Id, Idempotency-Key'
  )
  headers.set('Access-Control-Max-Age', '86400')
  headers.set('Access-Control-Expose-Headers', 'X-Request-Id, Retry-After, Deprecation, Sunset')
  return headers
}

export function withCors(response: Response, request: Request): Response {
  const cors = corsHeaders(request)
  cors.forEach((value, key) => response.headers.set(key, value))
  return response
}

export function preflight(request: Request): Response {
  const headers = corsHeaders(request)
  return new Response(null, { status: 204, headers })
}
