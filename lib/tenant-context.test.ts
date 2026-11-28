import { describe, expect, it } from 'vitest'
import { getTenantContext, runWithTenantContext, tenantContextFromSubject } from './tenant-context'

describe('tenant-context', () => {
  it('returns null outside ALS', () => {
    expect(getTenantContext()).toBeNull()
  })

  it('provides context inside ALS', async () => {
    const ctx = { scope: 'UNIT' as const, unitId: 'u1', userId: 'usr1' }
    await runWithTenantContext(ctx, async () => {
      expect(getTenantContext()).toEqual(ctx)
    })
  })

  it('builds context from subject', () => {
    expect(tenantContextFromSubject(null)).toEqual({ scope: 'PUBLIC', unitId: null, userId: null })
    expect(
      tenantContextFromSubject({ userId: 'u1', role: 'PW', accountType: 'ORGANIZATIONAL', organisasiId: 'org1', scope: 'UNIT' })
    ).toEqual({ scope: 'UNIT', unitId: 'org1', userId: 'u1' })
  })
})
