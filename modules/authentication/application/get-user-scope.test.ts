import { describe, it, expect } from 'vitest'
import { getUserScope } from './get-user-scope'
import type { OrganizationRepository } from '@/modules/authentication/domain/organization.repository'

function fakeRepo(unitName: string | null): OrganizationRepository {
  return { findUnitNameByUserId: async () => unitName }
}

describe('getUserScope', () => {
  it('returns Pusat for pusat roles without querying the unit', async () => {
    const repo: OrganizationRepository = {
      findUnitNameByUserId: async () => {
        throw new Error('should not be called')
      },
    }
    expect(await getUserScope(repo, { id: 'u1', role: 'OWNER' })).toEqual({ kind: 'GLOBAL', label: 'Pusat' })
  })

  it('returns the unit name for organizational accounts', async () => {
    const scope = await getUserScope(fakeRepo('PC Surabaya'), { id: 'u2', role: 'PC' })
    expect(scope).toEqual({ kind: 'ORGANIZATIONAL', label: 'PC Surabaya' })
  })

  it('falls back to a generic label when the account has no unit', async () => {
    const scope = await getUserScope(fakeRepo(null), { id: 'u3', role: 'PW' })
    expect(scope).toEqual({ kind: 'ORGANIZATIONAL', label: 'Organisasi' })
  })

  it('returns personal scope for personal accounts', async () => {
    const scope = await getUserScope(fakeRepo('ignored'), { id: 'u4', role: 'GURU_BANTU' })
    expect(scope).toEqual({ kind: 'PERSONAL', label: 'Data pribadi' })
  })
})
