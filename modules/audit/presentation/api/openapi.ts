import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { auditLogDtoSchema } from '@/modules/audit/presentation/dto/audit.dto'
import { xLimAuthForAudit } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)
function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) { const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() }); return meta ? base.extend({ meta }) : base }
const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerAuditOpenApi(registry: OpenAPIRegistry) {
  const AuditLog = registry.register('AuditLog', auditLogDtoSchema)
  registry.register('PaginationMeta', PaginationMeta); registry.register('ErrorResponse', ErrorResponse)
  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })

  registry.registerPath({ method: 'get', path: '/audit/logs', tags: ['Audit'], summary: 'Daftar audit log (admin)', security, request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), entity: z.string().optional(), action: z.string().optional(), userId: z.string().optional() }) }, responses: { 200: json(envelope(z.array(AuditLog), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForAudit() } as Parameters<typeof registry.registerPath>[0])
}
