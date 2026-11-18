import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import MfaSetup from './mfa-setup'

// Membaca sesi di request time; izinkan blocking saat prerender (pola yang sama dengan layout dashboard).
export const instant = false

export default async function MfaPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; reason?: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')
  const sp = await searchParams
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Keamanan: MFA</h1>
      {sp.reason === 'required' && <p className="text-red-600">MFA wajib untuk role Anda. Aktifkan untuk melanjutkan.</p>}
      <MfaSetup enabled={Boolean((session.user as { twoFactorEnabled?: boolean }).twoFactorEnabled)} callbackUrl={sp.callbackUrl} />
    </div>
  )
}
