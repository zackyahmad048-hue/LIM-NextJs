import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { letterIdParamSchema, toLetterDto } from '@/modules/letter/presentation/dto/letter.dto'
import { approveLetterRecord } from '@/modules/letter/application/letter-operations'
import { getClientIp } from '@/lib/api/rate-limit'

export const POST = createApiHandler<{ id: string }>(
  {
    auth: 'required',
    idempotent: true,
    rateLimit: { prefix: 'letters:approve', tokens: 20, window: '1 m' },
  },
  async ({ request, requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'write')

    const parsed = letterIdParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    const ipAddress = getClientIp(request)
    const letter = await approveLetterRecord(parsed.data.id, { ...principal.subject, ipAddress })
    return jsonOk(toLetterDto(letter), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
