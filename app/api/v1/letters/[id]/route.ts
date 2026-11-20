import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { letterIdParamSchema, toLetterDto, updateLetterRequestSchema } from '@/modules/letter/presentation/dto/letter.dto'
import { getLetterById, updateLetterRecord, deleteLetterRecord } from '@/modules/letter/application/letter-operations'
import { getClientIp } from '@/lib/api/rate-limit'

export const GET = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'letters:get', tokens: 120, window: '1 m' } },
  async ({ requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'read')

    const parsed = letterIdParamSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    const letter = await getLetterById(parsed.data.id, principal.subject)
    return jsonOk(toLetterDto(letter), requestId)
  }
)

export const PATCH = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'letters:update', tokens: 30, window: '1 m' } },
  async ({ request, requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'write')

    const idParsed = letterIdParamSchema.safeParse(params)
    if (!idParsed.success) return jsonValidationError(idParsed.error.flatten().fieldErrors, requestId)

    const body = await request.json().catch(() => null)
    const parsed = updateLetterRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    if (Object.keys(parsed.data).length === 0) {
      return jsonValidationError({ body: ['Tidak ada field yang diubah'] }, requestId)
    }

    const letter = await updateLetterRecord(idParsed.data.id, parsed.data, principal.subject)
    return jsonOk(toLetterDto(letter), requestId)
  }
)

export const DELETE = createApiHandler<{ id: string }>(
  { auth: 'required', rateLimit: { prefix: 'letters:delete', tokens: 20, window: '1 m' } },
  async ({ request, requestId, params, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'write')

    const idParsed = letterIdParamSchema.safeParse(params)
    if (!idParsed.success) return jsonValidationError(idParsed.error.flatten().fieldErrors, requestId)

    const ipAddress = getClientIp(request)
    const result = await deleteLetterRecord(idParsed.data.id, { ...principal.subject, ipAddress })
    return jsonOk(result, requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
