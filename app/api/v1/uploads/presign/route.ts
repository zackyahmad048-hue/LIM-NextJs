import { z } from 'zod'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import { createApiHandler, jsonOk, jsonValidationError, requireApiKeyPermission, ApiError } from '@/lib/api'

const ALLOWED: Record<string, { ext: string; maxBytes: number }> = {
  'application/pdf': { ext: 'pdf', maxBytes: 5 * 1024 * 1024 },
  'image/jpeg': { ext: 'jpg', maxBytes: 2 * 1024 * 1024 },
  'image/png': { ext: 'png', maxBytes: 2 * 1024 * 1024 },
}

const bodySchema = z.object({
  filename: z.string().trim().min(1).max(255).optional(),
  contentType: z.enum(['application/pdf', 'image/jpeg', 'image/png']),
  size: z.number().int().positive(),
  purpose: z.enum(['letter-attachment']).default('letter-attachment'),
})

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET_NAME
  const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined)
  const region = process.env.R2_REGION || (endpoint?.includes('r2.cloudflarestorage.com') ? 'auto' : '')
  const forcePathStyle =
    process.env.R2_FORCE_PATH_STYLE === 'true' ||
    (!!endpoint && !endpoint.includes('r2.cloudflarestorage.com'))
  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint) return null
  return { accessKeyId, secretAccessKey, bucket, endpoint, region: region || 'auto', forcePathStyle }
}

let s3: S3Client | null = null
function getS3(cfg: NonNullable<ReturnType<typeof getR2Config>>): S3Client {
  if (s3) return s3
  s3 = new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    forcePathStyle: cfg.forcePathStyle,
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  })
  return s3
}

export const POST = createApiHandler(
  {
    auth: 'required',
    idempotent: true,
    rateLimit: { prefix: 'uploads:presign', tokens: 30, window: '1 m' },
  },
  async ({ request, requestId, principal }) => {
    if (!principal) throw new Error('unreachable')
    requireApiKeyPermission(principal, 'uploads', 'write')

    const body = await request.json().catch(() => null)
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) return jsonValidationError(parsed.error.flatten().fieldErrors, requestId)

    const rule = ALLOWED[parsed.data.contentType]
    if (!rule) {
      return jsonValidationError({ contentType: ['Tipe file tidak diizinkan'] }, requestId)
    }
    if (parsed.data.size > rule.maxBytes) {
      return jsonValidationError({ size: [`Ukuran file melebihi batas (${rule.maxBytes} bytes)`] }, requestId)
    }

    const cfg = getR2Config()
    if (!cfg) {
      throw new ApiError('INTERNAL_ERROR', 'Penyimpanan berkas belum dikonfigurasi', 503)
    }

    const key = `uploads/${parsed.data.purpose}/${new Date().getUTCFullYear()}/${randomUUID()}.${rule.ext}`
    const command = new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      ContentType: parsed.data.contentType,
      ContentLength: parsed.data.size,
    })

    const client = getS3(cfg)
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 })

    return jsonOk(
      {
        key,
        uploadUrl,
        expiresIn: 3600,
        method: 'PUT' as const,
        headers: { 'Content-Type': parsed.data.contentType },
        maxBytes: rule.maxBytes,
      },
      requestId,
      { status: 201 }
    )
  }
)

export const OPTIONS = createApiHandler({ auth: 'public' }, async () => new Response(null, { status: 204 }))
