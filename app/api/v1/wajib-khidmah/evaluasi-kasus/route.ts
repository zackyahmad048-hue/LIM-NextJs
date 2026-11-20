import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listEvaluasiKasus, createEvaluasiKasusRecord } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'
import { createEvaluasiKasusRequestSchema, toEvaluasiKasusDto } from '@/modules/wajib-khidmah/presentation/dto/wajib-khidmah.dto'
import { getClientIp } from '@/lib/api/rate-limit'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  penugasanId: z.string().optional(),
})

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'wk:eval-kasus:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'wk', 'read')
    const url = new URL(request.url)
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listEvaluasiKasus(parsed.data, principal.subject)
    return jsonOk(items.map(toEvaluasiKasusDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'wk:eval-kasus:create', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'wk', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createEvaluasiKasusRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const ipAddress = getClientIp(request)
    const result = await createEvaluasiKasusRecord(parsed.data, { ...principal.subject, ipAddress })
    return jsonOk(toEvaluasiKasusDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
