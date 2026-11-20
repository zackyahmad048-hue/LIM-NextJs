import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { getDelegasiById } from '@/modules/safari/application/safari-operations'
import { idParamSchema, toDelegasiDto } from '@/modules/safari/presentation/dto/safari.dto'

export const GET = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'safari:delegasi:get', tokens: 120, window: '1 m' } },
  async ({ requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'safari', 'read')
    const parsed = idParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const item = await getDelegasiById(parsed.data.id, principal.subject)
    return jsonOk(toDelegasiDto(item), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
