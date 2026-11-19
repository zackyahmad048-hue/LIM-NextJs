import { describe, it, expect } from 'vitest'
import { letterScopeWhere } from './letter-scope'

describe('letterScopeWhere', () => {
  it('memberi akses penuh untuk role pusat (GLOBAL)', () => {
    expect(letterScopeWhere({ id: 'u1', role: 'OWNER' })).toEqual({})
    expect(letterScopeWhere({ id: 'u2', role: 'ADMIN_SEKRETARIAT' })).toEqual({})
  })

  it('membatasi PW/PC pada surat miliknya sendiri', () => {
    expect(letterScopeWhere({ id: 'u3', role: 'PW', accountType: 'ORGANIZATIONAL' })).toEqual({
      createdById: 'u3',
    })
    expect(letterScopeWhere({ id: 'u4', role: 'PC', accountType: 'ORGANIZATIONAL' })).toEqual({
      createdById: 'u4',
    })
  })

  it('tidak membocorkan surat ke role personal', () => {
    expect(letterScopeWhere({ id: 'u5', role: 'GURU_BANTU' })).toEqual({ createdById: 'u5' })
  })
})
