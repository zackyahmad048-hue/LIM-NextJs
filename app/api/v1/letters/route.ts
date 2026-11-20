import { createApiHandler, jsonOk, jsonValidationError, buildMeta, requireApiKeyPermission } from '@/lib/api'
import { createLetterRequestSchema, toLetterDto, toLetterSummaryDto } from '@/modules/letter/presentation/dto/letter.dto'
import { listLetters, createLetterRecord } from '@/modules/letter/application/letter-operations'
import { letterFilterSchema } from '@/modules/letter/domain/letter.schema'

export const GET = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'letters:list', tokens: 60, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'read')

    const url = new URL(request.url)
    const parsed = letterFilterSchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    const { items, total } = await listLetters(
      {
        page: parsed.data.page,
        limit: parsed.data.limit,
        status: parsed.data.status,
        type: parsed.data.type,
        q: parsed.data.q,
      },
      principal.subject
    )

    const data = items.map((l) => toLetterSummaryDto(l))
    return jsonOk(data, requestId, { meta: buildMeta(parsed.data.page, parsed.data.limit, total) })
  }
)

export const POST = createApiHandler(
  { auth: 'required', rateLimit: { prefix: 'letters:create', tokens: 30, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'letters', 'write')

    const body = await request.json().catch(() => null)
    const parsed = createLetterRequestSchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    const letter = await createLetterRecord(
      {
        type: parsed.data.type,
        pengirim: parsed.data.pengirim,
        penerima: parsed.data.penerima ?? undefined,
        perihal: parsed.data.perihal,
        isiSurat: parsed.data.isiSurat,
      },
      principal.subject
    )

    return jsonOk(toLetterDto(letter), requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
