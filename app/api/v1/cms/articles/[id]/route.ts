import { createApiHandler, jsonOk, jsonValidationError } from '@/lib/api'
import { getArticleById } from '@/modules/cms/application/cms-operations'
import { idParamSchema, toArticleDto } from '@/modules/cms/presentation/dto/cms.dto'

export const GET = createApiHandler<{ id: string }>(
  { auth: 'public', rateLimit: { prefix: 'cms:articles:get', tokens: 120, window: '1 m' } },
  async ({ requestId, params, principal }) => {
    const parsed = idParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const item = await getArticleById(parsed.data.id, principal?.subject ?? null)
    return jsonOk(toArticleDto(item), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
