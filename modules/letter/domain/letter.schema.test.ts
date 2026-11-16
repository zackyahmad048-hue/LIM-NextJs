import { describe, it, expect } from 'vitest'
import { createLetterSchema, letterFilterSchema } from './letter.schema'

describe('createLetterSchema', () => {
  const valid = { pengirim: 'PP LIM', perihal: 'Surat Tugas', isiSurat: 'Isi surat yang cukup panjang' }

  it('accepts valid input with defaults', () => {
    const r = createLetterSchema.safeParse(valid)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.type).toBe('KELUAR')
  })

  it('rejects short perihal', () => {
    const r = createLetterSchema.safeParse({ ...valid, perihal: 'ab' })
    expect(r.success).toBe(false)
  })

  it('rejects short isiSurat', () => {
    const r = createLetterSchema.safeParse({ ...valid, isiSurat: 'short' })
    expect(r.success).toBe(false)
  })

  it('rejects invalid type', () => {
    const r = createLetterSchema.safeParse({ ...valid, type: 'X' })
    expect(r.success).toBe(false)
  })
})

describe('letterFilterSchema', () => {
  it('defaults page/limit', () => {
    const r = letterFilterSchema.safeParse({})
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.page).toBe(1)
      expect(r.data.limit).toBe(20)
    }
  })

  it('coerces string numbers', () => {
    const r = letterFilterSchema.safeParse({ page: '3', limit: '50' })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.page).toBe(3)
      expect(r.data.limit).toBe(50)
    }
  })
})