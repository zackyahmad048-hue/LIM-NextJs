import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { generateJadwalRequestSchema, toJadwalDto } from '@/modules/falak/presentation/dto/falak.dto'
import { generateJadwalRecord } from '@/modules/falak/application/falak-operations'
import { getClientIp } from '@/lib/api/rate-limit'

export const POST = createApiHandler(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'falak:generate', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'falak', 'write')
    const body = await request.json().catch(() => null)
    const parsed = generateJadwalRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const ipAddress = getClientIp(request)
    const result = await generateJadwalRecord(new Date(parsed.data.tanggal), parsed.data.modeWaktu, { ...principal.subject, ipAddress })
    return jsonOk(toJadwalDto(result), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
