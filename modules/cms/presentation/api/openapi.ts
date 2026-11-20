import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { articleCategoryDtoSchema, articleDtoSchema, articleSummaryDtoSchema, createCategoryRequestSchema, createArticleRequestSchema } from '@/modules/cms/presentation/dto/cms.dto'
import { xLimAuthForCms, xLimAuthPublic } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)

function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) {
  const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() })
  return meta ? base.extend({ meta }) : base
}
const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerCmsOpenApi(registry: OpenAPIRegistry) {
  const Category = registry.register('CmsCategory', articleCategoryDtoSchema)
  const Article = registry.register('CmsArticle', articleDtoSchema)
  const ArticleSummary = registry.register('CmsArticleSummary', articleSummaryDtoSchema)
  const CreateCategory = registry.register('CmsCreateCategoryRequest', createCategoryRequestSchema)
  const CreateArticle = registry.register('CmsCreateArticleRequest', createArticleRequestSchema)
  registry.register('PaginationMeta', PaginationMeta)
  registry.register('ErrorResponse', ErrorResponse)
  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })

  registry.registerPath({ method: 'get', path: '/cms/categories', tags: ['CMS'], summary: 'Daftar kategori artikel (publik)', security: [], responses: { 200: json(envelope(z.array(Category))) }, 'x-lim-auth': xLimAuthPublic() } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/cms/categories', tags: ['CMS'], summary: 'Buat kategori', security, request: { body: { content: { 'application/json': { schema: CreateCategory } } } }, responses: { 201: json(envelope(Category)), 401: json(ErrorResponse), 403: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForCms('create') } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/cms/articles', tags: ['CMS'], summary: 'Daftar artikel', description: 'Publik: hanya PUBLISHED (tanpa content). Admin terautentikasi: semua status.', security: [],
    request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), status: z.string().optional(), categoryId: z.string().optional() }) },
    responses: { 200: json(envelope(z.array(ArticleSummary), PaginationMeta)), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthPublic() } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/cms/articles', tags: ['CMS'], summary: 'Buat artikel (draft)', security, request: { body: { content: { 'application/json': { schema: CreateArticle } } } }, responses: { 201: json(envelope(Article)), 401: json(ErrorResponse), 403: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForCms('create') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'get', path: '/cms/articles/{id}', tags: ['CMS'], summary: 'Detail artikel by id', security: [], request: { params: z.object({ id: z.string() }) }, responses: { 200: json(envelope(Article)), 404: json(ErrorResponse) }, 'x-lim-auth': xLimAuthPublic() } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/cms/articles/{id}/publish', tags: ['CMS'], summary: 'Publish artikel', description: 'Idempotency-Key didukung.', security, request: { params: z.object({ id: z.string() }) }, responses: { 200: json(envelope(Article)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 409: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForCms('approve') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'get', path: '/cms/articles/slug/{slug}', tags: ['CMS'], summary: 'Detail artikel by slug (publik, PUBLISHED)', security: [], request: { params: z.object({ slug: z.string() }) }, responses: { 200: json(envelope(Article)), 404: json(ErrorResponse) }, 'x-lim-auth': xLimAuthPublic() } as Parameters<typeof registry.registerPath>[0])
}
