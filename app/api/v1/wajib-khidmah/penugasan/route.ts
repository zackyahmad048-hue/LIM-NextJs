import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listPenugasan } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'
import { listPenugasanQuerySchema, toPenugasanDto } from '@/modules/wajib-khidmah/presentation/dto/wajib-khidmah.dto'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'wk:penugasan:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'wk', 'read')
    const url = new URL(request.url)
    const parsed = listPenugasanQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listPenugasan(parsed.data, principal.subject)
    return jsonOk(items.map(toPenugasanDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
