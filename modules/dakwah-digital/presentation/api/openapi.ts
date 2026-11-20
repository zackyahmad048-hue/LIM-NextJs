import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { kontenDtoSchema, pendaftaranEventDtoSchema, createKontenRequestSchema, registerEventRequestSchema } from '@/modules/dakwah-digital/presentation/dto/dakwah.dto'
import { xLimAuthForDakwah, xLimAuthPublic } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)
function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) { const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() }); return meta ? base.extend({ meta }) : base }
const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerDakwahOpenApi(registry: OpenAPIRegistry) {
  const Konten = registry.register('DakwahKonten', kontenDtoSchema)
  const Pendaftaran = registry.register('DakwahPendaftaranEvent', pendaftaranEventDtoSchema)
  const CreateKonten = registry.register('DakwahCreateKontenRequest', createKontenRequestSchema)
  const RegisterEvent = registry.register('DakwahRegisterEventRequest', registerEventRequestSchema)
  registry.register('PaginationMeta', PaginationMeta); registry.register('ErrorResponse', ErrorResponse)
  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })

  registry.registerPath({ method: 'get', path: '/dakwah/konten', tags: ['Dakwah Digital'], summary: 'Daftar konten dakwah', security, request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), status: z.string().optional(), jenisKonten: z.string().optional() }) }, responses: { 200: json(envelope(z.array(Konten), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDakwah('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/dakwah/konten', tags: ['Dakwah Digital'], summary: 'Upload/buat konten', description: 'PW/PC → PENDING_REVIEW, OWNER/CONTENT_MANAGER → DRAFT.', security, request: { body: { content: { 'application/json': { schema: CreateKonten } } } }, responses: { 201: json(envelope(Konten)), 401: json(ErrorResponse), 403: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDakwah('create') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/dakwah/konten/{id}/approve', tags: ['Dakwah Digital'], summary: 'Approve konten', security, request: { params: z.object({ id: z.string() }) }, responses: { 200: json(envelope(Konten)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 409: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDakwah('approve') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/dakwah/konten/{id}/publish', tags: ['Dakwah Digital'], summary: 'Publish konten', security, request: { params: z.object({ id: z.string() }) }, responses: { 200: json(envelope(Konten)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 409: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDakwah('approve') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/dakwah/events/register', tags: ['Dakwah Digital'], summary: 'Daftar event (publik)', description: 'Event harus PUBLISHED. Idempotency-Key didukung.', security: [], request: { body: { content: { 'application/json': { schema: RegisterEvent } } } }, responses: { 201: json(envelope(Pendaftaran)), 404: json(ErrorResponse), 409: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthPublic() } as Parameters<typeof registry.registerPath>[0])
}
