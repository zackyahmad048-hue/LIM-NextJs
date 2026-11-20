import { z } from 'zod'

export const auditLogDtoSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().nullable(),
  metadata: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.string().datetime(),
})
export type AuditLogDto = z.infer<typeof auditLogDtoSchema>

export function toAuditLogDto(a: { id: string; userId: string | null; action: string; entity: string; entityId: string | null; metadata: string | null; ipAddress: string | null; createdAt: Date }): AuditLogDto {
  return { id: a.id, userId: a.userId, action: a.action, entity: a.entity, entityId: a.entityId, metadata: a.metadata, ipAddress: a.ipAddress, createdAt: a.createdAt.toISOString() }
}

export const listAuditQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  entity: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
})
