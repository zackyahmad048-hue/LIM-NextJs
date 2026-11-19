import { describe, it, expect } from 'vitest'
import { isPusatRole, isOrganizationalAccount, canAccessModule, getDataScope } from './permissions'

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

describe('getDataScope', () => {
  it('GLOBAL for pusat roles', () => {
    expect(getDataScope('OWNER')).toBe('GLOBAL')
    expect(getDataScope('CONTENT_MANAGER')).toBe('GLOBAL')
  })
  it('ORGANIZATIONAL for organizational accounts', () => {
    expect(getDataScope('PC')).toBe('ORGANIZATIONAL')
    expect(getDataScope('GURU_BANTU', 'ORGANIZATIONAL')).toBe('ORGANIZATIONAL')
  })
  it('PERSONAL for other personal accounts', () => {
    expect(getDataScope('GURU_BANTU')).toBe('PERSONAL')
    expect(getDataScope('DELEGASI_SAFARI_DAERAH', 'PERSONAL')).toBe('PERSONAL')
  })
})