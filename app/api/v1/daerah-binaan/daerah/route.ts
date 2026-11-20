import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listDaerah, createDaerahRecord } from '@/modules/daerah-binaan/application/daerah-binaan-operations'
import { listQuerySchema, createDaerahRequestSchema, toDaerahDto } from '@/modules/daerah-binaan/presentation/dto/daerah-binaan.dto'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'binaan:daerah:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'daerah_binaan', 'read')
    const url = new URL(request.url)
    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listDaerah(parsed.data, principal.subject)
    return jsonOk(items.map(toDaerahDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'binaan:daerah:create', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'daerah_binaan', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createDaerahRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await createDaerahRecord(parsed.data, principal.subject)
    return jsonOk(toDaerahDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
