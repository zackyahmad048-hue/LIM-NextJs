import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listKonten, createKontenRecord } from '@/modules/dakwah-digital/application/dakwah-operations'
import { listKontenQuerySchema, createKontenRequestSchema, toKontenDto } from '@/modules/dakwah-digital/presentation/dto/dakwah.dto'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'dakwah:konten:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'dakwah', 'read')
    const url = new URL(request.url)
    const parsed = listKontenQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listKonten(parsed.data, principal.subject)
    return jsonOk(items.map(toKontenDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'dakwah:konten:create', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'dakwah', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createKontenRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await createKontenRecord(parsed.data, principal.subject)
    return jsonOk(toKontenDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
