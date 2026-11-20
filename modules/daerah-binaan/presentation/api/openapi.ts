import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { daerahBinaanDtoSchema, laporanBulananDtoSchema, createDaerahRequestSchema, createLaporanBulananRequestSchema } from '@/modules/daerah-binaan/presentation/dto/daerah-binaan.dto'
import { xLimAuthForDaerahBinaan } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)
function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) { const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() }); return meta ? base.extend({ meta }) : base }
const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerDaerahBinaanOpenApi(registry: OpenAPIRegistry) {
  const Daerah = registry.register('DaerahBinaan', daerahBinaanDtoSchema)
  const Laporan = registry.register('LaporanBulananBinaan', laporanBulananDtoSchema)
  const CreateDaerah = registry.register('CreateDaerahBinaanRequest', createDaerahRequestSchema)
  const CreateLaporan = registry.register('CreateLaporanBulananBinaanRequest', createLaporanBulananRequestSchema)
  registry.register('PaginationMeta', PaginationMeta); registry.register('ErrorResponse', ErrorResponse)
  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })

  registry.registerPath({ method: 'get', path: '/daerah-binaan/daerah', tags: ['Daerah Binaan'], summary: 'Daftar daerah binaan', security, request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), status: z.string().optional() }) }, responses: { 200: json(envelope(z.array(Daerah), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDaerahBinaan('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/daerah-binaan/daerah', tags: ['Daerah Binaan'], summary: 'Ajukan daerah binaan', security, request: { body: { content: { 'application/json': { schema: CreateDaerah } } } }, responses: { 201: json(envelope(Daerah)), 401: json(ErrorResponse), 403: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDaerahBinaan('create') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'get', path: '/daerah-binaan/laporan', tags: ['Daerah Binaan'], summary: 'Daftar laporan bulanan binaan', security, request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), daerahBinaanId: z.string().optional() }) }, responses: { 200: json(envelope(z.array(Laporan), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDaerahBinaan('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/daerah-binaan/laporan', tags: ['Daerah Binaan'], summary: 'Buat laporan bulanan binaan', description: 'Idempotency-Key didukung.', security, request: { body: { content: { 'application/json': { schema: CreateLaporan } } } }, responses: { 201: json(envelope(Laporan)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForDaerahBinaan('create') } as Parameters<typeof registry.registerPath>[0])
}
