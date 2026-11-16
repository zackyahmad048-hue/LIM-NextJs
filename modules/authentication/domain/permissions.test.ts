import { describe, it, expect } from 'vitest'
import { isPusatRole, isOrganizationalAccount, requiresMfa, isMfaSatisfied, canAccessModule } from './permissions'

describe('isPusatRole', () => {
  it('true for pusat roles', () => {
    expect(isPusatRole('OWNER')).toBe(true)
    expect(isPusatRole('ADMIN_BIDANG_SAFARI')).toBe(true)
  })
  it('false for others', () => {
    expect(isPusatRole('PW')).toBe(false)
    expect(isPusatRole('GURU_BANTU')).toBe(false)
  })
})

describe('isOrganizationalAccount', () => {
  it('uses accountType when provided', () => {
    expect(isOrganizationalAccount('GURU_BANTU', 'ORGANIZATIONAL')).toBe(true)
    expect(isOrganizationalAccount('PW', 'PERSONAL')).toBe(false)
  })
  it('falls back to role list', () => {
    expect(isOrganizationalAccount('PW')).toBe(true)
    expect(isOrganizationalAccount('OWNER')).toBe(false)
  })
})

describe('requiresMfa', () => {
  it('true for OWNER/ADMIN_SEKRETARIAT/ADMIN_BIDANG_*', () => {
    expect(requiresMfa('OWNER')).toBe(true)
    expect(requiresMfa('ADMIN_SEKRETARIAT')).toBe(true)
    expect(requiresMfa('ADMIN_BIDANG_SAFARI')).toBe(true)
  })
  it('false otherwise', () => {
    expect(requiresMfa('PW')).toBe(false)
    expect(requiresMfa('CONTENT_MANAGER')).toBe(false)
  })
})

describe('isMfaSatisfied', () => {
  it('requires 2FA enabled for MFA roles', () => {
    expect(isMfaSatisfied({ role: 'OWNER', twoFactorEnabled: true })).toBe(true)
    expect(isMfaSatisfied({ role: 'OWNER', twoFactorEnabled: false })).toBe(false)
  })
  it('passes for non-MFA roles', () => {
    expect(isMfaSatisfied({ role: 'PW', twoFactorEnabled: false })).toBe(true)
  })
})

describe('canAccessModule', () => {
  it('OWNER can access all known modules', () => {
    expect(canAccessModule('OWNER', 'persuratan')).toBe(true)
    expect(canAccessModule('OWNER', 'falak')).toBe(true)
  })
  it('GURU_BANTU cannot access persuratan', () => {
    expect(canAccessModule('GURU_BANTU', 'persuratan')).toBe(false)
  })
  it('unknown module denied', () => {
    expect(canAccessModule('OWNER', 'nonexistent')).toBe(false)
  })
})