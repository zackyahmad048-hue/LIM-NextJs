import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listAuditLogs } from '@/modules/audit/application/audit-operations'
import { listAuditQuerySchema, toAuditLogDto } from '@/modules/audit/presentation/dto/audit.dto'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'audit:logs:list', tokens: 30, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'audit', 'read')
    const url = new URL(request.url)
    const parsed = listAuditQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listAuditLogs(parsed.data, principal.subject)
    return jsonOk(items.map(toAuditLogDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
