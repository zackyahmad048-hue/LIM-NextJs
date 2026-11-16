import { describe, it, expect } from 'vitest'
import { createEvaluasiKasusSchema, updateMediasiSchema } from './evaluasi.schema'

describe('createEvaluasiKasusSchema', () => {
  it('accepts valid input', () => {
    const r = createEvaluasiKasusSchema.safeParse({
      penugasanId: 'p1', judulMasalah: 'Masalah', deskripsi: 'Deskripsi yang cukup panjang', tingkatKeparahan: 'SEDANG',
    })
    expect(r.success).toBe(true)
  })
  it('rejects invalid tingkat', () => {
    const r = createEvaluasiKasusSchema.safeParse({
      penugasanId: 'p1', judulMasalah: 'Masalah', deskripsi: 'Deskripsi yang cukup panjang', tingkatKeparahan: 'X',
    })
    expect(r.success).toBe(false)
  })
})

describe('updateMediasiSchema', () => {
  it('accepts valid', () => {
    const r = updateMediasiSchema.safeParse({ kasusId: 'k1', statusMediasi: 'SELESAI' })
    expect(r.success).toBe(true)
  })
})