export type ReviewAction = 'approve' | 'reject'

export function buildRiwayatReview(input: {
  action: ReviewAction
  permohonanId: string
  jumlahGuruDiminta: number
  actorId: string
  catatan?: string
}) {
  const approved = input.action === 'approve'
  return {
    permohonanId: input.permohonanId,
    jumlahDiminta: input.jumlahGuruDiminta,
    jumlahDisetujui: approved ? input.jumlahGuruDiminta : 0,
    status: approved ? ('DIPENUHI' as const) : ('TIDAK_DIPENUHI' as const),
    sumber: 'SISTEM' as const,
    catatanLembaga: input.catatan ?? null,
    createdById: input.actorId,
  }
}
