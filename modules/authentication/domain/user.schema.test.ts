// modules/authentication/domain/user.schema.test.ts
import { describe, expect, it } from 'vitest'
import { createUserSchema } from './user.schema'

const valid = {
  name: 'Ustadz Fulan',
  email: ' Fulan@LIM.or.id ',
  password: 'rahasia123',
  role: 'GURU_BANTU',
  accountType: 'PERSONAL',
} as const

describe('createUserSchema', () => {
  it('menerima input valid dan menormalkan email', () => {
    const parsed = createUserSchema.parse(valid)
    expect(parsed.email).toBe('fulan@lim.or.id')
  })

  it('menolak role OWNER lewat UI', () => {
    expect(createUserSchema.safeParse({ ...valid, role: 'OWNER' }).success).toBe(false)
  })

  it('menolak password kurang dari 8 karakter', () => {
    expect(createUserSchema.safeParse({ ...valid, password: 'pendek' }).success).toBe(false)
  })

  it('menolak email tidak valid', () => {
    expect(createUserSchema.safeParse({ ...valid, email: 'bukan-email' }).success).toBe(false)
  })
})
