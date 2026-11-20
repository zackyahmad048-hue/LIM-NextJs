import { createApiHandler, jsonOk } from '@/lib/api'
import { getActiveConfig } from '@/modules/falak/application/falak-operations'
import { toFalakConfigDto } from '@/modules/falak/presentation/dto/falak.dto'

export const GET = createApiHandler(
  { auth: 'public', rateLimit: { prefix: 'falak:config', tokens: 60, window: '1 m' } },
  async ({ requestId }) => {
    const cfg = await getActiveConfig()
    return jsonOk(cfg ? toFalakConfigDto(cfg) : null, requestId)
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
