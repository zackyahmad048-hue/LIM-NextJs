import { createApiHandler, jsonOk, jsonValidationError } from '@/lib/api'
import { ApiError } from '@/lib/api/errors'
import { getPublicVerification } from '@/modules/letter/application/letter-operations'
import { z } from 'zod'

const paramSchema = z.object({ slug: z.string().trim().min(1) })

export const GET = createApiHandler<{ slug: string }>(
  { auth: 'public', rateLimit: { prefix: 'public:letter:verify', tokens: 60, window: '1 m' } },
  async ({ requestId, params }) => {
    const parsed = paramSchema.safeParse(params)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const letter = await getPublicVerification(parsed.data.slug)
    if (!letter) throw new ApiError('NOT_FOUND', 'Surat tidak ditemukan atau tidak valid', 404)
    return jsonOk({
      nomorSurat: letter.nomorSurat,
      perihal: letter.perihal,
      pengirim: letter.pengirim,
      tanggalSurat: letter.tanggalSurat.toISOString(),
      status: letter.status,
    }, requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
