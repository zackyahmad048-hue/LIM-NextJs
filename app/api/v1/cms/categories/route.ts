import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { listCategories, createCategoryRecord } from '@/modules/cms/application/cms-operations'
import { createCategoryRequestSchema, toCategoryDto } from '@/modules/cms/presentation/dto/cms.dto'

export const GET = createApiHandler(
  { auth: 'public', rateLimit: { prefix: 'cms:categories:list', tokens: 120, window: '1 m' } },
  async ({ requestId }) => {
    const items = await listCategories()
    return jsonOk(items.map(toCategoryDto), requestId)
  }
)

export const POST = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'cms:categories:create', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'cms', 'write')
    const body = await request.json().catch(() => null)
    const parsed = createCategoryRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await createCategoryRecord(parsed.data, principal.subject)
    return jsonOk(toCategoryDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
