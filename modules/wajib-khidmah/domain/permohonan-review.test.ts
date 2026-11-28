import { describe, it, expect } from 'vitest'
import { reviewPermohonanSchema } from './permohonan-review.schema'
import { buildRiwayatReview } from './permohonan-review.rules'

describe('reviewPermohonanSchema', () => {
  it('accepts approve without catatan', () => {
    const r = reviewPermohonanSchema.safeParse({ permohonanId: 'p1', action: 'approve' })
    expect(r.success).toBe(true)
  })

  it('rejects unknown action', () => {
    const r = reviewPermohonanSchema.safeParse({ permohonanId: 'p1', action: 'delete' })
    expect(r.success).toBe(false)
  })
})

describe('buildRiwayatReview', () => {
  it('approve archives as DIPENUHI with approved count', () => {
    expect(buildRiwayatReview({
      action: 'approve', permohonanId: 'p1', jumlahGuruDiminta: 3, actorId: 'u1',
    })).toMatchObject({ status: 'DIPENUHI', jumlahDiminta: 3, jumlahDisetujui: 3, sumber: 'SISTEM' })
  })

  it('reject archives as TIDAK_DIPENUHI with zero count', () => {
    expect(buildRiwayatReview({
      action: 'reject', permohonanId: 'p1', jumlahGuruDiminta: 3, actorId: 'u1', catatan: 'tidak sesuai',
    })).toMatchObject({ status: 'TIDAK_DIPENUHI', jumlahDisetujui: 0, catatanLembaga: 'tidak sesuai' })
  })
})
