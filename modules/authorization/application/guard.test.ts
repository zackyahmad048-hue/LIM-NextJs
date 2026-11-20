import { describe, expect, it } from 'vitest'
import { checkLetterPermission } from './guard'
import type { AuthzContext } from '../domain/permissions'

const base = (overrides: Partial<AuthzContext['subject']> = {}): AuthzContext['subject'] => ({
  userId: 'u1',
  role: 'OWNER',
  accountType: 'PERSONAL',
  organisasiId: null,
  ...overrides,
})

describe('checkLetterPermission', () => {
  it('allows OWNER to send globally', () => {
    const d = checkLetterPermission({ subject: base({ role: 'OWNER' }) }, 'send')
    expect(d.allowed).toBe(true)
    expect(d.scope).toBe('global')
  })

  it('denies PC from sending', () => {
    const d = checkLetterPermission(
      { subject: base({ role: 'PC', organisasiId: 'org-a' }), resourceOrgId: 'org-a' },
      'send'
    )
    expect(d.allowed).toBe(false)
  })

  it('allows PC to read own-org resource', () => {
    const d = checkLetterPermission(
      { subject: base({ role: 'PC', organisasiId: 'org-a' }), resourceOrgId: 'org-a' },
      'read'
    )
    expect(d.allowed).toBe(true)
  })

  it('denies PC cross-org access', () => {
    const d = checkLetterPermission(
      { subject: base({ role: 'PC', organisasiId: 'org-a' }), resourceOrgId: 'org-b' },
      'read'
    )
    expect(d.allowed).toBe(false)
    expect(d.reason).toBe('cross_org_access')
  })

  it('denies when subject has no organisasiId for scoped role', () => {
    const d = checkLetterPermission(
      { subject: base({ role: 'PW', organisasiId: null }) },
      'read'
    )
    expect(d.allowed).toBe(false)
  })
})
