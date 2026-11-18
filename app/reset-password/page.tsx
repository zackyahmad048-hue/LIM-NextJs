import type { Metadata } from 'next'
import { FormulirReset } from './reset-form'

export const metadata: Metadata = { title: 'Atur Ulang Password' }
// Token di URL wajib terbaca sebelum halaman dirender (pola /verifikasi)
export const instant = false

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>
}) {
  const { token, error } = await searchParams
  return <FormulirReset token={token} error={error} />
}
