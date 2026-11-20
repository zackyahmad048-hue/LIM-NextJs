import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listLaporan, submitLaporanRecord } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'
import { listLaporanQuerySchema, submitLaporanRequestSchema, toLaporanDto } from '@/modules/wajib-khidmah/presentation/dto/wajib-khidmah.dto'
import { getClientIp } from '@/lib/api/rate-limit'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'wk:laporan:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'wk', 'read')
    const url = new URL(request.url)
    const parsed = listLaporanQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listLaporan(parsed.data, principal.subject)
    return jsonOk(items.map(toLaporanDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'wk:laporan:create', tokens: 30, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'wk', 'write')
    const body = await request.json().catch(() => null)
    const parsed = submitLaporanRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const ipAddress = getClientIp(request)
    const result = await submitLaporanRecord(parsed.data, { ...principal.subject, ipAddress, name: (principal.subject as { name?: string }).name })
    return jsonOk(toLaporanDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
