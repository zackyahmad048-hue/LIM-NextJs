import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission } from '@/lib/api'
import { approveJurnalRecord } from '@/modules/safari/application/safari-operations'
import { getClientIp } from '@/lib/api/rate-limit'
import { z } from 'zod'

const bodySchema = z.object({
  delegasiId: z.string().trim().min(1),
  isApproved: z.boolean().default(true),
  approverJabatan: z.string().trim().max(200).optional(),
})

export const POST = createApiHandler(
  { auth: 'required', idempotent: true, rateLimit: { prefix: 'safari:jurnal:approve', tokens: 20, window: '1 m' } },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'safari', 'write')
    const body = await request.json().catch(() => null)
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)
    const ipAddress = getClientIp(request)
    const result = await approveJurnalRecord(parsed.data, { ...principal.subject, ipAddress, name: (principal.subject as { name?: string }).name })
    return jsonOk({
      id: result.id,
      delegasiId: result.delegasiId,
      approverRole: result.approverRole,
      approverName: result.approverName,
      approverJabatan: result.approverJabatan,
      isApproved: result.isApproved,
      tanggalApproval: result.tanggalApproval?.toISOString() ?? null,
      createdAt: result.createdAt.toISOString(),
    }, requestId, { status: 201 })
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
