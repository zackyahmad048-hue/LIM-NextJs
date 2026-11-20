import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { xLimAuthPublic } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)
function envelope<T extends z.ZodTypeAny>(data: T) { return z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() }) }
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerPublicOpenApi(registry: OpenAPIRegistry) {
  const Verification = registry.register('PublicLetterVerification', z.object({ nomorSurat: z.string().nullable(), perihal: z.string(), pengirim: z.string(), tanggalSurat: z.string().datetime(), status: z.string() }))
  registry.register('ErrorResponse', ErrorResponse)
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })
  registry.registerPath({ method: 'get', path: '/public/letters/verify/{slug}', tags: ['Public'], summary: 'Verifikasi surat via QR/slug (publik)', security: [], request: { params: z.object({ slug: z.string() }) }, responses: { 200: json(envelope(Verification)), 404: json(ErrorResponse) }, 'x-lim-auth': xLimAuthPublic() } as Parameters<typeof registry.registerPath>[0])
}
