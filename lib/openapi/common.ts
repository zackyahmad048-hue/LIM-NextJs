import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { registry } from './registry'

extendZodWithOpenApi(z)

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  code: z.string().optional(),
  requestId: z.string().optional(),
}).meta({ id: 'ErrorResponse', description: 'Envelope error standar' })

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
}).meta({ id: 'PaginationMeta' })

export function registerCommonComponents() {
  registry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'API Key',
    description: 'Kirim API key sebagai Bearer token, atau gunakan session cookie untuk klien web first-party.',
  })

  registry.registerComponent('securitySchemes', 'CookieAuth', {
    type: 'apiKey',
    in: 'cookie',
    name: 'better-auth.session_token',
    description: 'Session cookie Better Auth (khusus origin first-party).',
  })

  registry.registerComponent('parameters', 'PageParam', {
    name: 'page',
    in: 'query',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
    description: 'Nomor halaman (mulai dari 1)',
  })

  registry.registerComponent('parameters', 'LimitParam', {
    name: 'limit',
    in: 'query',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    description: 'Jumlah item per halaman (maks 100)',
  })

  registry.registerComponent('parameters', 'RequestIdHeader', {
    name: 'X-Request-Id',
    in: 'header',
    required: false,
    schema: { type: 'string', maxLength: 128 },
    description: 'ID korelasi permintaan (opsional, dibuat server jika kosong)',
  })

  registry.registerComponent('parameters', 'IdempotencyKeyHeader', {
    name: 'Idempotency-Key',
    in: 'header',
    required: false,
    schema: { type: 'string', minLength: 8, maxLength: 128 },
    description: 'Kunci idempotensi untuk operasi mutasi kritis',
  })

  // Ensure schemas are known to registry
  registry.register('ErrorResponse', ErrorResponseSchema)
  registry.register('PaginationMeta', PaginationMetaSchema)
}
