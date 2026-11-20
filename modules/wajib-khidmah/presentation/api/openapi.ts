import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import {
  penugasanDtoSchema,
  laporanDtoSchema,
  evaluasiKasusDtoSchema,
  evaluasiIndukDtoSchema,
  submitLaporanRequestSchema,
  createEvaluasiKasusRequestSchema,
  createEvaluasiIndukRequestSchema,
} from '@/modules/wajib-khidmah/presentation/dto/wajib-khidmah.dto'
import { xLimAuthForWk } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)

function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) {
  const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() })
  return meta ? base.extend({ meta }) : base
}

const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerWajibKhidmahOpenApi(registry: OpenAPIRegistry) {
  const Penugasan = registry.register('WkPenugasan', penugasanDtoSchema)
  const Laporan = registry.register('WkLaporan', laporanDtoSchema)
  const EvaluasiKasus = registry.register('WkEvaluasiKasus', evaluasiKasusDtoSchema)
  const EvaluasiInduk = registry.register('WkEvaluasiInduk', evaluasiIndukDtoSchema)
  const SubmitLaporanRequest = registry.register('WkSubmitLaporanRequest', submitLaporanRequestSchema)
  const CreateEvaluasiKasusRequest = registry.register('WkCreateEvaluasiKasusRequest', createEvaluasiKasusRequestSchema)
  const CreateEvaluasiIndukRequest = registry.register('WkCreateEvaluasiIndukRequest', createEvaluasiIndukRequestSchema)
  registry.register('PaginationMeta', PaginationMeta)
  registry.register('ErrorResponse', ErrorResponse)

  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })

  registry.registerPath({ method: 'get', path: '/wajib-khidmah/penugasan', tags: ['Wajib Khidmah'], summary: 'Daftar penugasan', security,
    request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), status: z.string().optional(), guruBantuId: z.string().optional(), lembagaId: z.string().optional() }) },
    responses: { 200: json(envelope(z.array(Penugasan), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('read'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/wajib-khidmah/penugasan/{id}', tags: ['Wajib Khidmah'], summary: 'Detail penugasan', security,
    request: { params: z.object({ id: z.string() }) },
    responses: { 200: json(envelope(Penugasan)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('read'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/wajib-khidmah/laporan', tags: ['Wajib Khidmah'], summary: 'Daftar laporan mingguan', security,
    request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), penugasanId: z.string().optional(), periodeMinggu: z.coerce.number().int().optional(), periodeTahun: z.coerce.number().int().optional() }) },
    responses: { 200: json(envelope(z.array(Laporan), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('read'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'post', path: '/wajib-khidmah/laporan', tags: ['Wajib Khidmah'], summary: 'Submit laporan mingguan', description: 'Untuk GURU_BANTU/LEMBAGA_EKSTERNAL. Identitas pengisi akun organisasi diturunkan server. Mendukung Idempotency-Key.', security,
    request: { body: { content: { 'application/json': { schema: SubmitLaporanRequest } } } },
    responses: { 201: json(envelope(Laporan), 'Laporan dibuat'), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 409: json(ErrorResponse), 422: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('create'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/wajib-khidmah/laporan/{id}', tags: ['Wajib Khidmah'], summary: 'Detail laporan mingguan', security,
    request: { params: z.object({ id: z.string() }) },
    responses: { 200: json(envelope(Laporan)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('read'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/wajib-khidmah/evaluasi-kasus', tags: ['Wajib Khidmah'], summary: 'Daftar evaluasi kasus', security,
    request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), penugasanId: z.string().optional() }) },
    responses: { 200: json(envelope(z.array(EvaluasiKasus), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('read'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'post', path: '/wajib-khidmah/evaluasi-kasus', tags: ['Wajib Khidmah'], summary: 'Buat evaluasi kasus', description: 'OWNER/TIM_WAJIB_KHIDMAH. Idempotency-Key didukung.', security,
    request: { body: { content: { 'application/json': { schema: CreateEvaluasiKasusRequest } } } },
    responses: { 201: json(envelope(EvaluasiKasus)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('create'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/wajib-khidmah/evaluasi-induk', tags: ['Wajib Khidmah'], summary: 'Daftar evaluasi induk', security,
    request: { query: z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), penugasanId: z.string().optional() }) },
    responses: { 200: json(envelope(z.array(EvaluasiInduk), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('read'),
  } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'post', path: '/wajib-khidmah/evaluasi-induk', tags: ['Wajib Khidmah'], summary: 'Buat evaluasi induk', description: 'OWNER/TIM_WAJIB_KHIDMAH. Idempotency-Key didukung.', security,
    request: { body: { content: { 'application/json': { schema: CreateEvaluasiIndukRequest } } } },
    responses: { 201: json(envelope(EvaluasiInduk)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) },
    'x-lim-auth': xLimAuthForWk('create'),
  } as Parameters<typeof registry.registerPath>[0])
}
