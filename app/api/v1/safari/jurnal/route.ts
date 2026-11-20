import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listJurnal, createJurnalRecord } from '@/modules/safari/application/safari-operations'
import { createJurnalRequestSchema, listQuerySchema, toJurnalDto } from '@/modules/safari/presentation/dto/safari.dto'
import { getClientIp } from '@/lib/api/rate-limit'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'safari:jurnal:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'safari', 'read')
    const url = new URL(request.url)
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listJurnal(parsed.data, principal.subject)
    return jsonOk(items.map(toJurnalDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'safari:jurnal:create', tokens: 30, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'safari', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createJurnalRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const ipAddress = getClientIp(request)
    const result = await createJurnalRecord(parsed.data, { ...principal.subject, ipAddress })
    return jsonOk(toJurnalDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
