import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { jadwalShalatDtoSchema, falakConfigDtoSchema, generateJadwalRequestSchema } from '@/modules/falak/presentation/dto/falak.dto'
import { xLimAuthForFalak, xLimAuthPublic } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)

function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) {
  const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() })
  return meta ? base.extend({ meta }) : base
}
const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerFalakOpenApi(registry: OpenAPIRegistry) {
  const Jadwal = registry.register('FalakJadwalShalat', jadwalShalatDtoSchema)
  const Config = registry.register('FalakConfig', falakConfigDtoSchema)
  const GenerateReq = registry.register('FalakGenerateJadwalRequest', generateJadwalRequestSchema)
  registry.register('PaginationMeta', PaginationMeta)
  registry.register('ErrorResponse', ErrorResponse)
  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })

  registry.registerPath({ method: 'get', path: '/falak/jadwal', tags: ['Falak'], summary: 'Jadwal shalat (publik)', description: 'Jika `tanggal` diberikan mengembalikan satu jadwal atau null, jika tidak mengembalikan daftar (opsional filter from/to).', security: [],
    request: { query: z.object({ tanggal: z.string().optional(), from: z.string().optional(), to: z.string().optional() }) },
    responses: { 200: json(envelope(z.union([Jadwal, z.array(Jadwal), z.null()]))), 422: json(ErrorResponse) },
    'x-lim-auth': xLimAuthPublic(),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'post', path: '/falak/jadwal/generate', tags: ['Falak'], summary: 'Generate/upsert jadwal shalat', description: 'OWNER only. Idempotency-Key didukung.', security,
    request: { body: { content: { 'application/json': { schema: GenerateReq } } } },
    responses: { 201: json(envelope(Jadwal)), 401: json(ErrorResponse), 403: json(ErrorResponse), 422: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForFalak('create'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/falak/config', tags: ['Falak'], summary: 'Konfigurasi falak aktif (publik)', security: [],
    responses: { 200: json(envelope(z.union([Config, z.null()]))) },
    'x-lim-auth': xLimAuthPublic(),
  } as Parameters<typeof registry.registerPath>[0])
}
