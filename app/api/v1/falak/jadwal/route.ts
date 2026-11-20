import { z } from 'zod'
import { createApiHandler, jsonOk, jsonValidationError } from '@/lib/api'
import { listJadwal, getJadwalByTanggal } from '@/modules/falak/application/falak-operations'
import { toJadwalDto } from '@/modules/falak/presentation/dto/falak.dto'

const querySchema = z.object({
  tanggal: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export const GET = createApiHandler(
  { auth: 'public', rateLimit: { prefix: 'falak:jadwal:list', tokens: 120, window: '1 m' } },
  async ({ request, requestId }) => {
    const url = new URL(request.url)
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    if (parsed.data.tanggal) {
      const d = new Date(parsed.data.tanggal)
      if (Number.isNaN(d.getTime())) return jsonValidationError({ tanggal: ['Tanggal tidak valid'] }, requestId)
      const item = await getJadwalByTanggal(d)
      return jsonOk(item ? toJadwalDto(item) : null, requestId)
    }

    const from = parsed.data.from ? new Date(parsed.data.from) : undefined
    const to = parsed.data.to ? new Date(parsed.data.to) : undefined
    const items = await listJadwal(from, to)
    return jsonOk(items.map(toJadwalDto), requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
export const runtime = 'nodejs'
