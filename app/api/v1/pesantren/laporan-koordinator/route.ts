import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listLaporanKoordinator, createLaporanKoordinatorRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { listQuerySchema, createLaporanKoordinatorRequestSchema, toLaporanKoordinatorDto } from '@/modules/pesantren-ramadan/presentation/dto/pesantren.dto'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'pesantren:laporan-koordinator:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'pesantren', 'read')
    const url = new URL(request.url)
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listLaporanKoordinator(parsed.data, principal.subject)
    return jsonOk(items.map(toLaporanKoordinatorDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)
export const POST = createApiHandler(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'pesantren:laporan-koordinator:create', tokens: 30, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'pesantren', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createLaporanKoordinatorRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await createLaporanKoordinatorRecord(parsed.data, principal.subject)
    return jsonOk(toLaporanKoordinatorDto(result), requestId, { status: 201 })
  }
)
export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
