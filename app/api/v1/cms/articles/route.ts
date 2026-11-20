import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { listArticles, createArticleRecord } from '@/modules/cms/application/cms-operations'
import { createArticleRequestSchema, listArticlesQuerySchema, toArticleDto, toArticleSummaryDto } from '@/modules/cms/presentation/dto/cms.dto'

export const GET = createApiHandler(
  { auth: 'public', rateLimit: { prefix: 'cms:articles:list', tokens: 120, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    const url = new URL(request.url)
    const parsed = listArticlesQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const { items, total } = await listArticles(parsed.data, principal?.subject ?? null)
    return jsonOk(items.map(toArticleSummaryDto), requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'cms:articles:create', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'cms', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createArticleRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await createArticleRecord(parsed.data, principal.subject)
    return jsonOk(toArticleDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
