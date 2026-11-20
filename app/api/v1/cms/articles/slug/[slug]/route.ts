import { createApiHandler, jsonOk, jsonValidationError } from '@/lib/api'
import { getArticleBySlug } from '@/modules/cms/application/cms-operations'
import { slugParamSchema, toArticleDto } from '@/modules/cms/presentation/dto/cms.dto'

export const GET = createApiHandler<{ slug: string }>(
  { auth: 'public', rateLimit: { prefix: 'cms:articles:slug', tokens: 120, window: '1 m' } },
  async ({ requestId, params }) => {
    const parsed = slugParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const item = await getArticleBySlug(parsed.data.slug)
    return jsonOk(toArticleDto(item), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
