import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { letterIdParamSchema, toLetterLogDto } from '@/modules/letter/presentation/dto/letter.dto'
import { listLetterLogs } from '@/modules/letter/application/letter-operations'

export const GET = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'letters:logs', tokens: 60, window: '1 m' } },
  async ({ requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'read')

    const parsed = letterIdParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    const logs = await listLetterLogs(parsed.data.id, principal.subject)
    return jsonOk(logs.map(toLetterLogDto), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
