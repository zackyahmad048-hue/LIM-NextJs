import { describe, expect, it } from 'vitest'
import { getLetterActionsForRole, getLetterScopeForRole, getWkActionsForRole, xLimAuthForLetter } from './matrix'

describe('letter matrix', () => {
  it('OWNER gets full letter actions and global scope', () => {
    expect(getLetterScopeForRole('OWNER')).toBe('global')
    expect(getLetterActionsForRole('OWNER')).toEqual(
      expect.arrayContaining(['read', 'create', 'update', 'delete', 'review', 'approve', 'send'])
    )
  })

  it('PC is limited to read/create/update in pc scope', () => {
    expect(getLetterScopeForRole('PC')).toBe('pc')
    expect(getLetterActionsForRole('PC')).toEqual(['read', 'create', 'update'])
    expect(getLetterActionsForRole('PC')).not.toContain('send')
  })

  it('ADMIN_BIDANG_SAFARI can read/create only', () => {
    expect(getLetterActionsForRole('ADMIN_BIDANG_SAFARI')).toEqual(['read', 'create'])
  })

  it('GURU_BANTU has no letter access', () => {
    expect(getLetterScopeForRole('GURU_BANTU')).toBeNull()
    expect(getLetterActionsForRole('GURU_BANTU')).toEqual([])
  })

  it('x-lim-auth for send is restricted to OWNER/ADMIN_SEKRETARIAT', () => {
    const auth = xLimAuthForLetter('send')
    expect(auth.roles).toEqual(['OWNER', 'ADMIN_SEKRETARIAT'])
    expect(auth.permissions).toContain('letters:write')
  })
})

describe('wajib khidmah matrix', () => {
  it('ADMIN_SEKRETARIAT can review but not delete', () => {
    const actions = getWkActionsForRole('ADMIN_SEKRETARIAT')
    expect(actions).toEqual(expect.arrayContaining(['read', 'review', 'approve']))
    expect(actions).not.toContain('delete')
  })

  it('GURU_BANTU cannot review permohonan', () => {
    expect(getWkActionsForRole('GURU_BANTU')).not.toContain('review')
  })

  it('PW/PC cannot approve permohonan', () => {
    expect(getWkActionsForRole('PW')).not.toContain('approve')
    expect(getWkActionsForRole('PC')).not.toContain('approve')
  })
})
