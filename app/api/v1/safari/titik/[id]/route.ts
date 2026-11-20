import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { getTitikSafariById, updateTitikSafariRecord } from '@/modules/safari/application/safari-operations'
import { idParamSchema, toTitikSafariDto, updateTitikSafariRequestSchema } from '@/modules/safari/presentation/dto/safari.dto'
import { getClientIp } from '@/lib/api/rate-limit'

export const GET = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'safari:titik:get', tokens: 120, window: '1 m' } },
  async ({ requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'safari', 'read')
    const parsed = idParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const item = await getTitikSafariById(parsed.data.id, principal.subject)
    return jsonOk(toTitikSafariDto(item), requestId)
  }
)

export const PATCH = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'safari:titik:update', tokens: 20, window: '1 m' } },
  async ({ request, requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'safari', 'write')
    const idParsed = idParamSchema.safeParse(params)
    if (!idParsed.success) return jsonValidationError(idParsed.error.flatten().fieldErrors, requestId)
    const body = await request.json().catch(() => null)
    const parsed = updateTitikSafariRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    if (Object.keys(parsed.data).length === 0) return jsonValidationError({ body: ['Tidak ada field yang diubah'] }, requestId)
    const ipAddress = getClientIp(request)
    const result = await updateTitikSafariRecord(idParsed.data.id, parsed.data, { ...principal.subject, ipAddress })
    return jsonOk(toTitikSafariDto(result), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
