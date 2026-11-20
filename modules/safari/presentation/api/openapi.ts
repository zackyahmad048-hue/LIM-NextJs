import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import {
  titikSafariDtoSchema,
  delegasiDtoSchema,
  jurnalDtoSchema,
  laporanSidakDtoSchema,
  createTitikSafariRequestSchema,
  updateTitikSafariRequestSchema,
  createDelegasiRequestSchema,
  createJurnalRequestSchema,
  createLaporanSidakRequestSchema,
} from '@/modules/safari/presentation/dto/safari.dto'
import { xLimAuthForSafari } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)

function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) {
  const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() })
  return meta ? base.extend({ meta }) : base
}

const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerSafariOpenApi(registry: OpenAPIRegistry) {
  const Titik = registry.register('SafariTitik', titikSafariDtoSchema)
  const Delegasi = registry.register('SafariDelegasi', delegasiDtoSchema)
  const Jurnal = registry.register('SafariJurnal', jurnalDtoSchema)
  const Sidak = registry.register('SafariLaporanSidak', laporanSidakDtoSchema)
  const CreateTitik = registry.register('SafariCreateTitikRequest', createTitikSafariRequestSchema)
  const UpdateTitik = registry.register('SafariUpdateTitikRequest', updateTitikSafariRequestSchema)
  const CreateDelegasi = registry.register('SafariCreateDelegasiRequest', createDelegasiRequestSchema)
  const CreateJurnal = registry.register('SafariCreateJurnalRequest', createJurnalRequestSchema)
  const CreateSidak = registry.register('SafariCreateLaporanSidakRequest', createLaporanSidakRequestSchema)
  const Approval = registry.register('SafariApprovalJurnal', z.object({ id: z.string(), delegasiId: z.string(), approverRole: z.string(), approverName: z.string(), approverJabatan: z.string().nullable(), isApproved: z.boolean(), tanggalApproval: z.string().datetime().nullable(), createdAt: z.string().datetime() }))
  registry.register('PaginationMeta', PaginationMeta)
  registry.register('ErrorResponse', ErrorResponse)

  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })
  const queryList = z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), titikId: z.string().optional(), delegasiId: z.string().optional(), provinsi: z.string().optional(), kabupaten: z.string().optional() })

  registry.registerPath({ method: 'get', path: '/safari/titik', tags: ['Safari'], summary: 'Daftar titik safari', security, request: { query: queryList }, responses: { 200: json(envelope(z.array(Titik), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/safari/titik', tags: ['Safari'], summary: 'Buat titik safari', security, request: { body: { content: { 'application/json': { schema: CreateTitik } } } }, responses: { 201: json(envelope(Titik)), 401: json(ErrorResponse), 403: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('create') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'get', path: '/safari/titik/{id}', tags: ['Safari'], summary: 'Detail titik safari', security, request: { params: z.object({ id: z.string() }) }, responses: { 200: json(envelope(Titik)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'patch', path: '/safari/titik/{id}', tags: ['Safari'], summary: 'Ubah titik safari', security, request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: UpdateTitik } } } }, responses: { 200: json(envelope(Titik)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('update') } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/safari/delegasi', tags: ['Safari'], summary: 'Daftar delegasi safari', security, request: { query: queryList }, responses: { 200: json(envelope(z.array(Delegasi), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/safari/delegasi', tags: ['Safari'], summary: 'Buat delegasi safari', security, request: { body: { content: { 'application/json': { schema: CreateDelegasi } } } }, responses: { 201: json(envelope(Delegasi)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('create') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'get', path: '/safari/delegasi/{id}', tags: ['Safari'], summary: 'Detail delegasi safari', security, request: { params: z.object({ id: z.string() }) }, responses: { 200: json(envelope(Delegasi)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('read') } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/safari/jurnal', tags: ['Safari'], summary: 'Daftar jurnal harian', security, request: { query: queryList }, responses: { 200: json(envelope(z.array(Jurnal), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/safari/jurnal', tags: ['Safari'], summary: 'Buat jurnal harian (delegasi)', description: 'Hanya DELEGASI_SAFARI_DAERAH untuk delegasi miliknya. Idempotency-Key didukung.', security, request: { body: { content: { 'application/json': { schema: CreateJurnal } } } }, responses: { 201: json(envelope(Jurnal)), 401: json(ErrorResponse), 403: json(ErrorResponse), 409: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('create') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/safari/jurnal/approve', tags: ['Safari'], summary: 'Approve/reject jurnal (by delegasi)', description: 'Idempotency-Key didukung.', security, request: { body: { content: { 'application/json': { schema: z.object({ delegasiId: z.string(), isApproved: z.boolean().default(true), approverJabatan: z.string().optional() }) } } } }, responses: { 201: json(envelope(Approval)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('approve') } as Parameters<typeof registry.registerPath>[0])

  registry.registerPath({ method: 'get', path: '/safari/sidak', tags: ['Safari'], summary: 'Daftar laporan sidak', security, request: { query: queryList }, responses: { 200: json(envelope(z.array(Sidak), PaginationMeta)), 401: json(ErrorResponse), 403: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('read') } as Parameters<typeof registry.registerPath>[0])
  registry.registerPath({ method: 'post', path: '/safari/sidak', tags: ['Safari'], summary: 'Buat laporan sidak', security, request: { body: { content: { 'application/json': { schema: CreateSidak } } } }, responses: { 201: json(envelope(Sidak)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': xLimAuthForSafari('create') } as Parameters<typeof registry.registerPath>[0])
}
