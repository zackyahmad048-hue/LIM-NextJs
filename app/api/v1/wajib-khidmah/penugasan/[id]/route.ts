import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { getPenugasanById } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'
import { idParamSchema, toPenugasanDto } from '@/modules/wajib-khidmah/presentation/dto/wajib-khidmah.dto'

export const GET = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'wk:penugasan:get', tokens: 120, window: '1 m' } },
  async ({ requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'wk', 'read')
    const parsed = idParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const item = await getPenugasanById(parsed.data.id, principal.subject)
    return jsonOk(toPenugasanDto(item), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
