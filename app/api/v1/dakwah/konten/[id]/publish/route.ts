import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { publishKontenRecord } from '@/modules/dakwah-digital/application/dakwah-operations'
import { idParamSchema, toKontenDto } from '@/modules/dakwah-digital/presentation/dto/dakwah.dto'
import { getClientIp } from '@/lib/api/rate-limit'

export const POST = createApiHandler<{ id: string }>(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'dakwah:publish', tokens: 20, window: '1 m' } },
  async ({ request, requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'dakwah', 'write')
    const parsed = idParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await publishKontenRecord(parsed.data.id, { ...principal.subject, ipAddress: getClientIp(request) })
    return jsonOk(toKontenDto(result), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
