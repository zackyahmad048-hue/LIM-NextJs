import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listMateri, createMateriRecord } from '@/modules/pesantren-ramadan/application/pesantren-operations'
import { listQuerySchema, createBankMateriRequestSchema, toBankMateriDto } from '@/modules/pesantren-ramadan/presentation/dto/pesantren.dto'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'pesantren:materi:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'pesantren', 'read')
    const url = new URL(request.url)
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listMateri(parsed.data)
    return jsonOk(items.map(toBankMateriDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)
export const POST = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'pesantren:materi:create', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'pesantren', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createBankMateriRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await createMateriRecord(parsed.data, principal.subject)
    return jsonOk(toBankMateriDto(result), requestId, { status: 201 })
  }
)
export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
