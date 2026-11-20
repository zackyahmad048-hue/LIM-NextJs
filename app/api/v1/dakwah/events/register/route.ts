import { createApiHandler, jsonOk, jsonValidationError } from '@/lib/api'
import { registerEventRecord } from '@/modules/dakwah-digital/application/dakwah-operations'
import { registerEventRequestSchema, toPendaftaranDto } from '@/modules/dakwah-digital/presentation/dto/dakwah.dto'

export const POST = createApiHandler(
  { auth: 'public', idempotent: true, rateLimit: { prefix: 'dakwah:event:register', tokens: 30, window: '1 m' } },
  async ({ request, requestId }) => {
    const body = await request.json().catch(() => null)
    const parsed = registerEventRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const result = await registerEventRecord(parsed.data)
    return jsonOk(toPendaftaranDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
