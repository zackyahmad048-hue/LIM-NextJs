// Satu sumber pemetaan status surat → varian badge (dipakai halaman dashboard & verifikasi publik).
export const letterStatusVariant: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'muted'> = {
  DIKETIK: 'neutral',
  REVIEW: 'info',
  APPROVED: 'success',
  SENT: 'success',
  ARCHIVED: 'muted',
}
