import { z } from 'zod'
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import {
  createLetterRequestSchema,
  letterDtoSchema,
  letterLogDtoSchema,
  letterSummaryDtoSchema,
  updateLetterRequestSchema,
} from '@/modules/letter/presentation/dto/letter.dto'
import { xLimAuthForLetter } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)

function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) {
  const base = z.object({
    success: z.literal(true),
    data,
    requestId: z.string().optional(),
    code: z.string().optional(),
  })
  return meta ? base.extend({ meta }) : base
}

const PaginationMeta = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
}).openapi('PaginationMeta')

const ErrorResponse = z.object({
  success: z.literal(false),
  error: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  code: z.string().optional(),
  requestId: z.string().optional(),
}).openapi('ErrorResponse')

export function registerLetterOpenApi(registry: OpenAPIRegistry) {
  const Letter = registry.register('Letter', letterDtoSchema)
  const LetterSummary = registry.register('LetterSummary', letterSummaryDtoSchema)
  const LetterLog = registry.register('LetterLog', letterLogDtoSchema)
  const CreateLetterRequest = registry.register('CreateLetterRequest', createLetterRequestSchema)
  const UpdateLetterRequest = registry.register('UpdateLetterRequest', updateLetterRequestSchema)
  registry.register('PaginationMeta', PaginationMeta)
  registry.register('ErrorResponse', ErrorResponse)

  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({
    description,
    content: { 'application/json': { schema } },
  })

  // GET /letters
  registry.registerPath({
    method: 'get',
    path: '/letters',
    tags: ['Letters'],
    summary: 'Daftar surat',
    description: 'Mengembalikan daftar surat sesuai scope role (paginasi offset).',
    security,
    request: {
      query: z.object({
        page: z.coerce.number().int().positive().default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
        status: z.enum(['DIKETIK', 'REVIEW', 'APPROVED', 'SENT', 'ARCHIVED']).optional(),
        type: z.enum(['MASUK', 'KELUAR']).optional(),
        q: z.string().optional(),
      }),
    },
    responses: {
      200: json(envelope(z.array(LetterSummary), PaginationMeta), 'Daftar surat'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      422: json(ErrorResponse, 'Validation error'),
    },
    'x-lim-auth': xLimAuthForLetter('read'),
  } as Parameters<typeof registry.registerPath>[0])

  // POST /letters
  registry.registerPath({
    method: 'post',
    path: '/letters',
    tags: ['Letters'],
    summary: 'Buat surat',
    security,
    request: {
      body: { content: { 'application/json': { schema: CreateLetterRequest } } },
    },
    responses: {
      201: json(envelope(Letter), 'Surat dibuat'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      422: json(ErrorResponse, 'Validation error'),
    },
    'x-lim-auth': xLimAuthForLetter('create'),
  } as Parameters<typeof registry.registerPath>[0])

  // GET /letters/{id}
  registry.registerPath({
    method: 'get',
    path: '/letters/{id}',
    tags: ['Letters'],
    summary: 'Detail surat',
    security,
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: json(envelope(Letter), 'Detail surat'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
    },
    'x-lim-auth': xLimAuthForLetter('read'),
  } as Parameters<typeof registry.registerPath>[0])

  // PATCH /letters/{id}
  registry.registerPath({
    method: 'patch',
    path: '/letters/{id}',
    tags: ['Letters'],
    summary: 'Ubah surat (DIKETIK)',
    security,
    request: {
      params: z.object({ id: z.string() }),
      body: { content: { 'application/json': { schema: UpdateLetterRequest } } },
    },
    responses: {
      200: json(envelope(Letter), 'Surat diperbarui'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
      409: json(ErrorResponse, 'Conflict'),
      422: json(ErrorResponse, 'Validation error'),
    },
    'x-lim-auth': xLimAuthForLetter('update'),
  } as Parameters<typeof registry.registerPath>[0])

  // DELETE /letters/{id}
  registry.registerPath({
    method: 'delete',
    path: '/letters/{id}',
    tags: ['Letters'],
    summary: 'Hapus surat (soft delete)',
    security,
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: json(envelope(z.object({ id: z.string() })), 'Surat dihapus'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
    },
    'x-lim-auth': xLimAuthForLetter('delete'),
  } as Parameters<typeof registry.registerPath>[0])

  // POST /letters/{id}/submit
  registry.registerPath({
    method: 'post',
    path: '/letters/{id}/submit',
    tags: ['Letters'],
    summary: 'Kirim ke review',
    description: 'Transisi DIKETIK → REVIEW. Mendukung header Idempotency-Key (opsional, 8–128 karakter).',
    security,
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: json(envelope(Letter), 'Surat masuk review'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
      409: json(ErrorResponse, 'Conflict / in progress'),
    },
    'x-lim-auth': xLimAuthForLetter('update'),
  } as Parameters<typeof registry.registerPath>[0])

  // POST /letters/{id}/approve
  registry.registerPath({
    method: 'post',
    path: '/letters/{id}/approve',
    tags: ['Letters'],
    summary: 'Setujui surat',
    description: 'Transisi REVIEW → APPROVED. Mendukung header Idempotency-Key (opsional).',
    security,
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: json(envelope(Letter), 'Surat disetujui'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
      409: json(ErrorResponse, 'Conflict'),
    },
    'x-lim-auth': xLimAuthForLetter('approve'),
  } as Parameters<typeof registry.registerPath>[0])

  // POST /letters/{id}/send
  registry.registerPath({
    method: 'post',
    path: '/letters/{id}/send',
    tags: ['Letters'],
    summary: 'Kirim surat (terbitkan nomor)',
    description: 'Transisi ke SENT dan generate nomor surat. Mendukung header Idempotency-Key (disarankan).',
    security,
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: json(envelope(Letter), 'Surat terkirim'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
      409: json(ErrorResponse, 'Conflict'),
    },
    'x-lim-auth': xLimAuthForLetter('send'),
  } as Parameters<typeof registry.registerPath>[0])

  // GET /letters/{id}/logs
  registry.registerPath({
    method: 'get',
    path: '/letters/{id}/logs',
    tags: ['Letters'],
    summary: 'Log surat',
    security,
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: json(envelope(z.array(LetterLog)), 'Log surat'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      404: json(ErrorResponse, 'Not found'),
    },
    'x-lim-auth': xLimAuthForLetter('read'),
  } as Parameters<typeof registry.registerPath>[0])

  // POST /uploads/presign
  const UploadPresignRequest = registry.register('UploadPresignRequest', z.object({
    filename: z.string().min(1).max(255).optional(),
    contentType: z.enum(['application/pdf', 'image/jpeg', 'image/png']),
    size: z.number().int().positive(),
    purpose: z.enum(['letter-attachment']).default('letter-attachment'),
  }).openapi('UploadPresignRequest'))

  const UploadPresignResponse = registry.register('UploadPresignResponse', z.object({
    key: z.string(),
    uploadUrl: z.string().url(),
    expiresIn: z.number().int(),
    method: z.literal('PUT'),
    headers: z.record(z.string(), z.string()),
    maxBytes: z.number().int(),
  }).openapi('UploadPresignResponse'))

  registry.registerPath({
    method: 'post',
    path: '/uploads/presign',
    tags: ['Uploads'],
    summary: 'Buat presigned upload URL (R2/S3)',
    description: 'Mengembalikan URL upload sementara (1 jam). Mendukung header Idempotency-Key (opsional).',
    security,
    request: {
      body: { content: { 'application/json': { schema: UploadPresignRequest } } },
    },
    responses: {
      201: json(envelope(UploadPresignResponse), 'Presign dibuat'),
      401: json(ErrorResponse, 'Unauthorized'),
      403: json(ErrorResponse, 'Forbidden'),
      422: json(ErrorResponse, 'Validation error'),
      503: json(ErrorResponse, 'Storage belum dikonfigurasi'),
    },
    'x-lim-auth': { roles: ['OWNER', 'ADMIN_SEKRETARIAT', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'], scope: 'global', permissions: ['uploads:write'] },
  } as Parameters<typeof registry.registerPath>[0])
}
